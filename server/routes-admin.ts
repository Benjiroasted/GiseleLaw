/**
 * Admin API routes — review & approve lawyer applications.
 *
 *   - GET  /api/admin/lawyers              → list pending applications +
 *                                            auto-computed CNB match per row
 *   - POST /api/admin/lawyers/:id/approve  → mark as `verified`
 *   - POST /api/admin/lawyers/:id/reject   → mark as `rejected` with a reason
 *
 * Admin auth strategy
 *   1. Env allowlist `ADMIN_USER_IDS` (comma-separated) for bootstrap.
 *   2. Otherwise, the connected user must have `users.role = 'admin'`.
 */

import type { Express, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { and, eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  cnbDirectory,
  practitioners,
  users,
  type CnbDirectoryEntry,
  type Practitioner,
} from "@shared/schema";
import { api } from "@shared/routes";
import { normalizeName } from "@shared/utils/normalize";
import { isAuthenticated } from "./auth";

function getAdminAllowlist(): Set<string> {
  return new Set(
    (process.env.ADMIN_USER_IDS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // Run isAuthenticated first — short-circuits with 401 if not logged in.
  await new Promise<void>((resolve, reject) => {
    isAuthenticated(req, res, (err?: unknown) => (err ? reject(err) : resolve()));
  }).catch(() => {});
  if (res.headersSent) return;

  const u = (req as any).user;
  const userId: string | undefined = u?.id ?? u?.claims?.sub;
  if (!userId) {
    return res.status(401).json({ message: "Authentification requise" });
  }

  if (getAdminAllowlist().has(userId)) {
    return next();
  }

  try {
    const [row] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (row?.role === "admin") return next();
  } catch (err) {
    console.error("[admin] role lookup failed:", err);
  }

  return res.status(403).json({ message: "Accès réservé aux administrateurs" });
}

/**
 * Compute a fresh CNB match for a practitioner. Used to surface the most
 * up-to-date directory state at review time (the user-supplied cnbMatchId at
 * signup is no longer trusted — see security note in routes-lawyers.ts).
 */
async function computeCnbAutoMatch(
  practitioner: Practitioner,
): Promise<{
  status: "match_exact" | "match_ambiguous" | "no_match";
  candidates: CnbDirectoryEntry[];
}> {
  const fullName = practitioner.name.trim();
  const parts = fullName.split(/\s+/);
  if (parts.length < 2 || !practitioner.barreau) {
    return { status: "no_match", candidates: [] };
  }
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");

  const exact = await db
    .select()
    .from(cnbDirectory)
    .where(
      and(
        eq(cnbDirectory.barreau, practitioner.barreau.toUpperCase().trim()),
        eq(cnbDirectory.nomNormalized, normalizeName(lastName)),
        eq(cnbDirectory.prenomNormalized, normalizeName(firstName)),
      ),
    )
    .limit(5);

  if (exact.length === 1) return { status: "match_exact", candidates: exact };
  if (exact.length > 1) return { status: "match_ambiguous", candidates: exact };

  const fuzzy = await db
    .select()
    .from(cnbDirectory)
    .where(
      and(
        eq(cnbDirectory.barreau, practitioner.barreau.toUpperCase().trim()),
        eq(cnbDirectory.nomNormalized, normalizeName(lastName)),
      ),
    )
    .limit(10);

  if (fuzzy.length > 0) return { status: "match_ambiguous", candidates: fuzzy };
  return { status: "no_match", candidates: [] };
}

export function registerAdminRoutes(app: Express): void {
  // ── GET /api/admin/lawyers ────────────────────────────────────────────
  app.get(api.admin.listApplications.path, requireAdmin, async (_req, res) => {
    try {
      const rows = await db
        .select()
        .from(practitioners)
        .where(eq(practitioners.verificationStatus, "pending_review"))
        .orderBy(desc(practitioners.id));

      const enriched = await Promise.all(
        rows.map(async (p) => {
          let cnbCandidate: CnbDirectoryEntry | null = null;
          if (p.cnbMatchId) {
            const [c] = await db
              .select()
              .from(cnbDirectory)
              .where(eq(cnbDirectory.id, p.cnbMatchId))
              .limit(1);
            cnbCandidate = c ?? null;
          }
          const cnbAutoMatch = await computeCnbAutoMatch(p);
          return { practitioner: p, cnbCandidate, cnbAutoMatch };
        }),
      );

      res.json(enriched);
    } catch (err) {
      console.error("[admin] list failed:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // ── POST /api/admin/lawyers/:id/approve ───────────────────────────────
  const approveSchema = z.object({
    cnbMatchId: z.number().int().positive().nullable().optional(),
  });

  app.post("/api/admin/lawyers/:id/approve", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const body = approveSchema.parse(req.body ?? {});
      const adminId =
        (req as any).user?.id ?? (req as any).user?.claims?.sub ?? null;

      // Ensure cnbMatchId points to a real entry (avoid spoofing).
      let cnbMatchId: number | null = null;
      if (body.cnbMatchId) {
        const [m] = await db
          .select({ id: cnbDirectory.id })
          .from(cnbDirectory)
          .where(eq(cnbDirectory.id, body.cnbMatchId))
          .limit(1);
        cnbMatchId = m?.id ?? null;
      }

      const [updated] = await db
        .update(practitioners)
        .set({
          verificationStatus: "verified",
          verifiedAt: new Date(),
          verifiedBy: adminId,
          rejectionReason: null,
          cnbMatchId,
        })
        .where(eq(practitioners.id, id))
        .returning();

      if (!updated) return res.status(404).json({ message: "Introuvable" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message ?? "Invalide" });
      }
      console.error("[admin] approve failed:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // ── POST /api/admin/lawyers/:id/reject ────────────────────────────────
  const rejectSchema = z.object({ reason: z.string().min(1).max(500) });

  app.post("/api/admin/lawyers/:id/reject", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const body = rejectSchema.parse(req.body ?? {});

      const [updated] = await db
        .update(practitioners)
        .set({
          verificationStatus: "rejected",
          rejectionReason: body.reason,
        })
        .where(eq(practitioners.id, id))
        .returning();

      if (!updated) return res.status(404).json({ message: "Introuvable" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message ?? "Invalide" });
      }
      console.error("[admin] reject failed:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
}
