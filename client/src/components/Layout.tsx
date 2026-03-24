import { Link, useLocation } from "wouter";
import { Scale, LogOut, Moon, Sun, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getUserInitial(user: { firstName?: string | null; lastName?: string | null; email?: string | null }): string {
  if (user.firstName) return user.firstName[0].toUpperCase();
  if (user.lastName) return user.lastName[0].toUpperCase();
  if (user.email) return user.email[0].toUpperCase();
  return "U";
}

function getUserDisplayName(user: { firstName?: string | null; lastName?: string | null; email?: string | null }): string {
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  if (user.email) return user.email;
  return "Utilisateur";
}

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return [dark, setDark] as const;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [dark, setDark] = useDarkMode();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Logo + Account */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold font-serif tracking-tight text-primary">
                  Gisèle<span className="text-accent">.law</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Nav + Dark mode + Account */}
          <nav className="flex items-center gap-4 md:gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary hidden sm:block ${location === "/" ? "text-primary" : "text-muted-foreground"}`}>
              Accueil
            </Link>
            <Link href="/practitioners" className={`text-sm font-medium transition-colors hover:text-primary hidden sm:block ${location === "/practitioners" ? "text-primary" : "text-muted-foreground"}`}>
              Trouver un avocat
            </Link>
            {user && (
              <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary hidden sm:block ${location === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}>
                Mes dossiers
              </Link>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Changer le thème"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={getUserDisplayName(user)} />
                      <AvatarFallback>{getUserInitial(user)}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground hidden sm:inline">Invité</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Pas encore de compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a href="/api/login">Se connecter (dev)</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scale className="h-5 w-5 text-muted-foreground" />
            <span className="font-serif font-bold text-muted-foreground">Gisèle.law</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
            Gisèle.law est un outil d'information juridique et ne constitue pas du conseil personnalisé.
            Pour des cas complexes, nous vous recommandons de consulter un professionnel du droit.
          </p>
          <div className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Gisèle.law — Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
