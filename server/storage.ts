import { db } from "./db";
import {
  users,
  procedures,
  type User,
  type InsertUser,
  type Procedure,
  type InsertProcedure,
  type UpdateProcedureRequest
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Procedure operations
  createProcedure(procedure: InsertProcedure): Promise<Procedure>;
  getProcedure(id: number): Promise<Procedure | undefined>;
  updateProcedure(id: number, updates: UpdateProcedureRequest): Promise<Procedure>;
  listProcedures(userId: string): Promise<Procedure[]>;
  deleteProcedure(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createProcedure(insertProcedure: InsertProcedure): Promise<Procedure> {
    const [procedure] = await db.insert(procedures).values(insertProcedure).returning();
    return procedure;
  }

  async getProcedure(id: number): Promise<Procedure | undefined> {
    const [procedure] = await db.select().from(procedures).where(eq(procedures.id, id));
    return procedure;
  }

  async updateProcedure(id: number, updates: UpdateProcedureRequest): Promise<Procedure> {
    const [procedure] = await db.update(procedures)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(procedures.id, id))
      .returning();
    return procedure;
  }

  async listProcedures(userId: string): Promise<Procedure[]> {
    return await db.select().from(procedures).where(eq(procedures.userId, userId));
  }

  async deleteProcedure(id: number): Promise<void> {
    await db.delete(procedures).where(eq(procedures.id, id));
  }
}

export const storage = new DatabaseStorage();
