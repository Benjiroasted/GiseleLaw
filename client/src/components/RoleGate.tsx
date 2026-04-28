import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, Lock } from "lucide-react";
import type { UserRole } from "@shared/models/auth";
import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

interface RoleGateProps {
  /** Roles allowed to view the children. */
  allow: UserRole[];
  /** Where to send unauthenticated users (defaults to "/"). */
  loginRedirect?: string;
  children: React.ReactNode;
}

/**
 * Client-side guard that only renders `children` if the connected user has
 * one of the `allow`-listed roles. Anonymous users are redirected to
 * `loginRedirect`; authenticated-but-unauthorized users see a 403 panel.
 *
 * Note: this is UX sugar. Real authorization always happens server-side
 * in the corresponding API handlers.
 */
export function RoleGate({ allow, loginRedirect = "/", children }: RoleGateProps) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) navigate(loginRedirect);
  }, [user, isLoading, loginRedirect, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-32 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    // Effect above redirects; render nothing in the meantime.
    return null;
  }

  if (!allow.includes(user.role)) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mb-2">
            Accès refusé
          </h1>
          <p className="text-muted-foreground mb-6">
            Cet espace est réservé aux {allow.join(" / ")}. Votre compte est
            actuellement de type <strong>{user.role}</strong>.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Retour à l'accueil
          </Button>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
}
