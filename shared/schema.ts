import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, decimal, date, uniqueIndex, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth Models
import { users, sessions } from "./models/auth";
export { users, sessions };
export type { UserRole } from "./models/auth";

// === TABLE DEFINITIONS ===
export const procedures = pgTable("procedures", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // 'contrat_vente_non_paye' | 'placeholder' | legacy 'unpaid_work' | 'ip'
  title: text("title").notNull(),
  answers: jsonb("answers").$type<Record<string, unknown>>().notNull(),
  status: text("status").notNull().default("in_progress"), // 'in_progress', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/** Shape of procedure.answers for the decision-tree wizard (v2) */
export interface ProcedureAnswers {
  callerType?: "particulier" | "autre";
  moraleSubType?: "entreprise" | "employeur" | "commercant" | "association";
  context?: "vie_perso" | "activite_pro";
  isCriminal?: boolean | "je_ne_sais_pas";
  criminalSituation?: "porter_plainte" | "convoque_police" | "poursuivi_tribunal";
  criminalClarification?: "infraction" | "procedure_police" | "conflit";
  opponentType?: "particulier" | "professionnel" | "employeur" | "banque" | "assurance" | "administration";
  documentOfficiel?: boolean;
  documentType?: "mise_en_demeure" | "convocation" | "assignation" | "decision_justice" | "ne_sais_pas";
  disputeCategory?: string;
  // Immobilier branch
  immoCategory?: "location" | "achat_vente_immo" | "travaux" | "voisinage_immo";
  immoRole?: "locataire" | "proprietaire";
  locataireProbleme?: string;
  proprietaireProbleme?: string;
  // Emploi branch
  emploiCategory?: string;
  // Depot garantie branch
  dgEtatDesLieux?: "signe" | "pas_signe" | "pas_realise";
  dgDegradations?: boolean;
  dgDelaiCles?: string;
  dgRaisonProprio?: "degradation" | "loyers_impayes" | "aucune";
  dgJustifications?: boolean;
  dgContesteJustif?: boolean;
  dgDemandeRestitution?: boolean;
  dgLoyersImpayes?: boolean;
  dgMontantProportionne?: boolean;
  dgContestation?: "degradation" | "montant_reparations" | "les_deux";
  dgAbsenceRaison?: "proprio_absent" | "locataire_absent" | "desaccord";
  // Employment / licenciement branch
  empFinContrat?: "licencie" | "rupture_conv" | "demission" | "cdd_termine" | "abandon_poste";
  empSituation?: "convoque_entretien" | "lettre_recue" | "pas_de_lettre";
  empMotif?: "faute" | "insuffisance" | "economique";
  empTypeFaute?: "faute_simple" | "faute_grave" | "faute_lourde";
  empProcedure?: "oui" | "non" | "ne_sais_pas";
  // Achat/vente/service branch
  agreementType?: string;
  problemType?: string;
  problemDetail?: string;
  amount?: "less_5000" | "more_5000";
  miseEnDemeure?: boolean;
  /** Legacy / optional */
  [key: string]: unknown;
}

/** Verification lifecycle for a lawyer profile. */
export type VerificationStatus =
  | "draft" // Just submitted, waiting for review
  | "pending_review" // Form complete, in admin queue
  | "verified" // Approved & visible publicly
  | "rejected" // Rejected by admin (see rejectionReason)
  | "suspended"; // Was verified but later disabled (omission CNB, plainte, etc.)

export const practitioners = pgTable("practitioners", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  specialties: text("specialties").array().default(sql`'{}'::text[]`),
  locationCity: text("location_city"),
  locationDepartment: text("location_department"),
  experienceYears: integer("experience_years").default(0),
  rateConsultation: integer("rate_consultation"),
  rateHourly: integer("rate_hourly"),
  acceptsLegalAid: boolean("accepts_legal_aid").default(false),
  similarCasesTravail: integer("similar_cases_travail").default(0),
  similarCasesIp: integer("similar_cases_ip").default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  // ── Lawyer signup / verification metadata ──
  email: text("email"),
  phone: text("phone"),
  /** Barreau d'inscription (CNB), e.g. "PARIS" */
  barreau: text("barreau"),
  /** FK to cnb_directory if matched at signup (nullable for legacy demo rows). */
  cnbMatchId: integer("cnb_match_id"),
  verificationStatus: varchar("verification_status")
    .$type<VerificationStatus>()
    .notNull()
    .default("verified"),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: varchar("verified_by").references(() => users.id),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Snapshot of the official CNB (Conseil National des Barreaux) directory.
 * Imported monthly from data.gouv.fr (licence Etalab 2.0).
 *
 *   https://www.data.gouv.fr/datasets/annuaire-des-avocats-de-france
 *
 * Used to verify lawyer signups against the official barreau registration.
 */
export const cnbDirectory = pgTable(
  "cnb_directory",
  {
    id: serial("id").primaryKey(),
    barreau: text("barreau").notNull(),
    nom: text("nom").notNull(),
    prenom: text("prenom").notNull(),
    /** Normalized lowercase no-accent versions for fast matching. */
    nomNormalized: text("nom_normalized").notNull(),
    prenomNormalized: text("prenom_normalized").notNull(),
    raisonSociale: text("raison_sociale"),
    siren: varchar("siren", { length: 9 }),
    adresse1: text("adresse_1"),
    adresse2: text("adresse_2"),
    codePostal: varchar("code_postal", { length: 5 }),
    ville: text("ville"),
    specialite1: text("specialite_1"),
    specialite2: text("specialite_2"),
    specialite3: text("specialite_3"),
    specialite4: text("specialite_4"),
    dateSerment: date("date_serment"),
    langues: text("langues"),
    /** Date of the CSV snapshot this row was imported from (yyyymmdd). */
    sourceSnapshot: varchar("source_snapshot", { length: 8 }).notNull(),
    importedAt: timestamp("imported_at").defaultNow(),
  },
  (t) => [
    index("idx_cnb_match").on(t.barreau, t.nomNormalized, t.prenomNormalized),
    index("idx_cnb_barreau").on(t.barreau),
  ],
);

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  practitionerId: integer("practitioner_id").references(() => practitioners.id),
  procedureId: integer("procedure_id"),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  bookingDatetime: timestamp("booking_datetime"),
  caseDescription: text("case_description"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dossiers = pgTable("dossiers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  title: text("title"),
  domain: text("domain"),
  subdomain: text("subdomain"),
  procedureData: jsonb("procedure_data").$type<Record<string, any>>(),
  deadlines: jsonb("deadlines").$type<Record<string, any>>(),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === RELATIONS ===
export const proceduresRelations = relations(procedures, ({ one }) => ({
  user: one(users, {
    fields: [procedures.userId],
    references: [users.id],
  }),
}));

export const dossiersRelations = relations(dossiers, ({ one }) => ({
  user: one(users, {
    fields: [dossiers.userId],
    references: [users.id],
  }),
}));

export const practitionersRelations = relations(practitioners, ({ one, many }) => ({
  user: one(users, {
    fields: [practitioners.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  practitioner: one(practitioners, {
    fields: [bookings.practitionerId],
    references: [practitioners.id],
  }),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  procedures: many(procedures),
  dossiers: many(dossiers),
  practitionerProfile: one(practitioners, {
    fields: [users.id],
    references: [practitioners.userId],
  }),
}));

// === BASE SCHEMAS ===
export const insertProcedureSchema = createInsertSchema(procedures).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPractitionerSchema = createInsertSchema(practitioners).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertDossierSchema = createInsertSchema(dossiers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCnbDirectorySchema = createInsertSchema(cnbDirectory).omit({ id: true, importedAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type { User, UpsertUser as InsertUser } from "./models/auth";

export type Procedure = typeof procedures.$inferSelect;
export type InsertProcedure = z.infer<typeof insertProcedureSchema>;

export type Practitioner = typeof practitioners.$inferSelect;
export type InsertPractitioner = z.infer<typeof insertPractitionerSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Dossier = typeof dossiers.$inferSelect;
export type InsertDossier = z.infer<typeof insertDossierSchema>;

export type CnbDirectoryEntry = typeof cnbDirectory.$inferSelect;
export type InsertCnbDirectoryEntry = z.infer<typeof insertCnbDirectorySchema>;

// Request types
export type CreateProcedureRequest = InsertProcedure;
export type UpdateProcedureRequest = Partial<InsertProcedure>;

// Logic Types for the Questionnaire
export type QuestionType = 'choice' | 'date' | 'text' | 'currency';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: { value: string; label: string; nextQuestionId?: string }[];
  nextQuestionId?: string;
}

export interface ProcedureStep {
  title: string;
  description: string;
  deadline?: string;
  isCompleted?: boolean;
}

export interface ProcedureResult {
  procedureType: 'unpaid_work' | 'ip';
  timeline: ProcedureStep[];
  prescriptionDate: string;
}
