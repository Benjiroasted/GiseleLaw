import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // === PROCEDURES API ===

  app.get(api.procedures.list.path, async (req, res) => {
    // Check auth if needed, for now allowing generic listing or filtering by user
    if (!req.isAuthenticated()) {
       return res.status(401).send("Not authenticated");
    }
    const userId = (req.user as any).id;
    const procedures = await storage.listProcedures(userId);
    res.json(procedures);
  });

  app.get(api.procedures.get.path, async (req, res) => {
    const procedure = await storage.getProcedure(Number(req.params.id));
    if (!procedure) {
      return res.status(404).json({ message: 'Procedure not found' });
    }
    // Optional: Check ownership
    if (req.isAuthenticated() && procedure.userId !== (req.user as any).id) {
       // Allow guest access if no userId, otherwise forbidden
       if (procedure.userId) {
         return res.status(403).send("Forbidden");
       }
    }
    res.json(procedure);
  });

  app.post(api.procedures.create.path, async (req, res) => {
    try {
      const input = api.procedures.create.input.parse(req.body);
      
      // Associate with user if logged in
      if (req.isAuthenticated()) {
        input.userId = (req.user as any).id;
      }

      const procedure = await storage.createProcedure(input);
      res.status(201).json(procedure);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.procedures.update.path, async (req, res) => {
    try {
      const input = api.procedures.update.input.parse(req.body);
      const procedureId = Number(req.params.id);
      
      const existing = await storage.getProcedure(procedureId);
      if (!existing) {
        return res.status(404).json({ message: 'Procedure not found' });
      }

      const updated = await storage.updateProcedure(procedureId, input);
      res.json(updated);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.procedures.delete.path, async (req, res) => {
    await storage.deleteProcedure(Number(req.params.id));
    res.status(204).send();
  });

  // === PRACTITIONERS API ===
  app.get(api.practitioners.list.path, async (req, res) => {
    const { specialty, city, accepts_legal_aid } = req.query;
    const practitioners = await storage.listPractitioners({
      specialty: specialty as string,
      city: city as string,
      acceptsLegalAid: accepts_legal_aid === 'true' ? true : accepts_legal_aid === 'false' ? false : undefined
    });
    res.json(practitioners);
  });

  return httpServer;
}
