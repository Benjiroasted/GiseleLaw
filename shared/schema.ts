import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth Models
import { users, sessions } from "./models/auth";
export { users, sessions };

// === TABLE DEFINITIONS ===
export const procedures = pgTable("procedures", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id), // Changed to varchar to match users.id
  type: text("type").notNull(), // 'unpaid_work' | 'ip'
  title: text("title").notNull(),
  answers: jsonb("answers").$type<Record<string, any>>().notNull(),
  status: text("status").notNull().default("in_progress"), // 'in_progress', 'completed'
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

export const usersRelations = relations(users, ({ many }) => ({
  procedures: many(procedures),
}));

// === BASE SCHEMAS ===
// We don't need insertUserSchema here as it's handled by Auth, 
// but if we did, we'd base it on the imported users table.
export const insertProcedureSchema = createInsertSchema(procedures).omit({ id: true, createdAt: true, updatedAt: true });

// === EXPLICIT API CONTRACT TYPES ===
// User types are exported from ./models/auth, but we can re-export or alias if needed.
export type { User, InsertUser } from "./models/auth";

export type Procedure = typeof procedures.$inferSelect;
export type InsertProcedure = z.infer<typeof insertProcedureSchema>;

// Request types
export type CreateProcedureRequest = InsertProcedure;
export type UpdateProcedureRequest = Partial<InsertProcedure>;

// Response types
export type ProcedureResponse = Procedure;
export type ProceduresListResponse = Procedure[];

// Logic Types for the Questionnaire
export type QuestionType = 'choice' | 'date' | 'text' | 'currency';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: { value: string; label: string; nextQuestionId?: string }[];
  nextQuestionId?: string; // Default next
}

export interface ProcedureStep {
  title: string;
  description: string;
  deadline?: string; // Calculated date string
  isCompleted?: boolean;
}

export interface ProcedureResult {
  procedureType: 'unpaid_work' | 'ip';
  timeline: ProcedureStep[];
  prescriptionDate: string;
}
