/**
 * Local development auth – mock strategy when REPL_ID is not set.
 * Use /api/login to auto-login as a dev user, or /api/logout to clear session.
 */
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";
import { authStorage } from "./storage";

const MOCK_USER_ID = process.env.MOCK_USER_ID ?? "dev-user-local";
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week

const mockUser = {
  id: MOCK_USER_ID,
  claims: { sub: MOCK_USER_ID },
};

export function getSession() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is required. Add it to .env for local dev.");
  }

  // Use MemoryStore in dev when DATABASE_URL might not be set; otherwise PG
  const store = process.env.DATABASE_URL
    ? new (connectPg(session))({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        ttl: SESSION_TTL,
        tableName: "sessions",
      })
    : new (MemoryStore(session))({ checkPeriod: 86400000 });

  return session({
    secret,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_TTL,
    },
  });
}

export async function setupAuth(app: Express) {
  console.log("[auth] Using local dev auth (REPL_ID not set). Visit /api/login to sign in as mock user.");
  app.set("trust proxy", 1);
  app.use(getSession());

  // Simple "passport-like" middleware: attach user from session
  app.use((req, _res, next) => {
    (req as any).login = (user: any, cb: (err?: Error) => void) => {
      (req as any).session.user = user;
      cb?.();
    };
    (req as any).logout = (cb: (err?: Error) => void) => {
      delete (req as any).session?.user;
      cb?.();
    };
    (req as any).isAuthenticated = () => !!(req as any).session?.user;
    (req as any).user = (req as any).session?.user;
    next();
  });

  app.get("/api/login", async (req, res) => {
    if (process.env.DATABASE_URL) {
      await authStorage.upsertUser({
        id: MOCK_USER_ID,
        email: "dev@local.test",
        firstName: "Dev",
        lastName: "User",
      });
    }
    (req as any).session.user = mockUser;
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    delete (req as any).session?.user;
    res.redirect("/");
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = (req as any).session?.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  (req as any).user = user;
  next();
};
