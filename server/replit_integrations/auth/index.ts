const useLocalAuth = !process.env.REPL_ID;

export const { setupAuth, isAuthenticated, getSession } = useLocalAuth
  ? await import("./localAuth")
  : await import("./replitAuth");

export { authStorage, type IAuthStorage } from "./storage";
export { registerAuthRoutes } from "./routes";
