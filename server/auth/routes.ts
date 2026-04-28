import type { Express } from "express";
import { authStorage } from "./storage";

export function registerAuthRoutes(app: Express): void {
  // Returns the currently authenticated user (or 401 if unauthenticated).
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      const userId = sessionUser?.id ?? sessionUser?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.json(user);
    } catch (error) {
      console.error("[auth] Failed to fetch user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
