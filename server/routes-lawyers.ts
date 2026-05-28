/**
 * Lawyer-side API routes:
 *   - GET  /api/cnb/barreaux        → distinct list of barreaux from cnb_directory
 *   - GET  /api/cnb/match           → match a (firstName, lastName, barreau) tuple
 *                                     against the CNB directory
 *   - POST /api/lawyers/apply       → create a draft Practitioner profile
 *                                     in `pending_review` status
 */

import type { Express, Request, Response } from "express";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "./db";
import {
  cnbDirectory,
  practitioners,
  type CnbDirectoryEntry,
} from "@shared/schema";
import { api, lawyerApplicationSchema } from "@shared/routes";
import { normalizeName } from "@shared/utils/normalize";

export function registerLawyerRoutes(app: Express): void {
  // ── GET /api/cnb/barreaux ─────────────────────────────────────────────
  app.get(api.cnb.barreaux.path, async (_req: Request, res: Response) => {
    try {
      const rows = await db
        .selectDistinct({ barreau: cnbDirectory.barreau })
        .from(cnbDirectory)
        .orderBy(cnbDirectory.barreau);
      res.json(rows.map((r) => r.barreau));
    } catch (err) {
      console.error("[lawyers] Failed to list barreaux:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // ── GET /api/cnb/match?firstName=&lastName=&barreau= ──────────────────
  const matchQuerySchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    barreau: z.string().min(1),
  });

  app.get(api.cnb.match.path, async (req: Request, res: Response) => {
    try {
      const parsed = matchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res
          .status(400)
          .json({ message: "Paramètres invalides", field: parsed.error.errors[0]?.path.join(".") });
      }
      const { firstName, lastName, barreau } = parsed.data;
      const nomNorm = normalizeName(lastName);
      const prenomNorm = normalizeName(firstName);
      const barreauNorm = barreau.toUpperCase().trim();

      // 1) Exact match on (barreau, nom_normalized, prenom_normalized)
      const exact = await db
        .select()
        .from(cnbDirectory)
        .where(
          and(
            eq(cnbDirectory.barreau, barreauNorm),
            eq(cnbDirectory.nomNormalized, nomNorm),
            eq(cnbDirectory.prenomNormalized, prenomNorm),
          ),
        )
        .limit(5);

      if (exact.length === 1) {
        return res.json({ status: "match_exact", candidates: exact });
      }
      if (exact.length > 1) {
        // Same name in same barreau (homonymes) → ambiguous, admin must pick.
        return res.json({ status: "match_ambiguous", candidates: exact });
      }

      // 2) Looser match: same barreau + same lastName, different/abbrev firstName.
      const fuzzy = await db
        .select()
        .from(cnbDirectory)
        .where(
          and(
            eq(cnbDirectory.barreau, barreauNorm),
            eq(cnbDirectory.nomNormalized, nomNorm),
          ),
        )
        .limit(10);

      if (fuzzy.length > 0) {
        return res.json({ status: "match_ambiguous", candidates: fuzzy });
      }

      return res.json({ status: "no_match", candidates: [] as CnbDirectoryEntry[] });
    } catch (err) {
      console.error("[lawyers] Failed to match CNB:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // ── POST /api/lawyers/apply ───────────────────────────────────────────
  app.post(api.lawyers.apply.path, async (req: Request, res: Response) => {
    try {
      const input = lawyerApplicationSchema.parse(req.body);

      // Reject duplicate applications for the same email.
      const existing = await db
        .select({ id: practitioners.id })
        .from(practitioners)
        .where(eq(practitioners.email, input.email.toLowerCase()))
        .limit(1);

      if (existing.length > 0) {
        return res.status(409).json({
          message:
            "Une candidature existe déjà pour cet email. Contactez-nous si vous pensez qu'il s'agit d'une erreur.",
          field: "email",
        });
      }

      // If a cnbMatchId was sent, verify it actually exists (avoid spoofing).
      let cnbMatched = false;
      let cnbMatchId: number | null = null;
      if (input.cnbMatchId) {
        const [match] = await db
          .select({ id: cnbDirectory.id })
          .from(cnbDirectory)
          .where(eq(cnbDirectory.id, input.cnbMatchId))
          .limit(1);
        if (match) {
          cnbMatched = true;
          cnbMatchId = match.id;
        }
      }

      const [practitioner] = await db
        .insert(practitioners)
        .values({
          name: `${input.firstName} ${input.lastName}`.trim(),
          email: input.email.toLowerCase(),
          phone: input.phone || null,
          barreau: input.barreau.toUpperCase().trim(),
          specialties: input.specialties.length > 0 ? input.specialties : sql`'{}'::text[]`,
          locationCity: input.locationCity || null,
          bio: input.bio || null,
          cnbMatchId,
          verificationStatus: "pending_review",
          proCardFileData: input.proCardFile.dataUrl,
          proCardFileName: input.proCardFile.name,
          proCardFileType: input.proCardFile.type,
          // sane defaults — the rest is filled during onboarding after approval
          rating: "0.0",
          experienceYears: 0,
          acceptsLegalAid: false,
          similarCasesTravail: 0,
          similarCasesIp: 0,
        })
        .returning({
          id: practitioners.id,
          verificationStatus: practitioners.verificationStatus,
        });

      return res.status(201).json({
        practitionerId: practitioner.id,
        verificationStatus: practitioner.verificationStatus,
        cnbMatched,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Données invalides",
          field: err.errors[0]?.path.join("."),
        });
      }
      console.error("[lawyers] apply failed:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
}
