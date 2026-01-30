import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, decimal } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth Models
import { users, sessions } from "./models/auth";
export { users, sessions };

// === TABLE DEFINITIONS ===
export const procedures = pgTable("procedures", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // 'unpaid_work' | 'ip'
  title: text("title").notNull(),
  answers: jsonb("answers").$type<Record<string, any>>().notNull(),
  status: text("status").notNull().default("in_progress"), // 'in_progress', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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
  createdAt: timestamp("created_at").defaultNow(),
});

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

// === RELATIONS ===
export const proceduresRelations = relations(procedures, ({ one }) => ({
  user: one(users, {
    fields: [procedures.userId],
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
  practitionerProfile: one(practitioners, {
    fields: [users.id],
    references: [practitioners.userId],
  }),
}));

// === BASE SCHEMAS ===
export const insertProcedureSchema = createInsertSchema(procedures).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPractitionerSchema = createInsertSchema(practitioners).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type { User, UpsertUser as InsertUser } from "./models/auth";

export type Procedure = typeof procedures.$inferSelect;
export type InsertProcedure = z.infer<typeof insertProcedureSchema>;

export type Practitioner = typeof practitioners.$inferSelect;
export type InsertPractitioner = z.infer<typeof insertPractitionerSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

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
