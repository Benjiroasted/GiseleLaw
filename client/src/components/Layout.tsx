import { Link, useLocation } from "wouter";
import { Scale, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
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

          <nav className="flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              Accueil
            </Link>
            {user && (
              <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
                Mes Dossiers
              </Link>
            )}
            
            {user ? (
               <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <div className="flex items-center gap-2 cursor-pointer">
                   <Avatar className="h-8 w-8 border border-border">
                     <AvatarImage src={user.profileImageUrl || undefined} alt={user.username || "User"} />
                     <AvatarFallback>{(user.username?.[0] || "U").toUpperCase()}</AvatarFallback>
                   </Avatar>
                 </div>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-56">
                 <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                   <LogOut className="mr-2 h-4 w-4" />
                   <span>Se déconnecter</span>
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
            ) : (
              <a href="/api/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Se connecter
              </a>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scale className="h-5 w-5 text-muted-foreground" />
            <span className="font-serif font-bold text-muted-foreground">Gisèle.law</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
            Gisèle.law est un outil d'information juridique et ne remplace pas les conseils d'un avocat. 
            Pour des cas complexes, nous vous recommandons de consulter un professionnel.
          </p>
          <div className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Gisèle.law - Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
