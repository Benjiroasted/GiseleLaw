import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase } from "lucide-react";

export interface PlaceholderPageProps {
  onBack: () => void;
  /** If true, render inside Layout with back button only (no link to practitioners in layout) */
  embedded?: boolean;
}

export function PlaceholderPage({ onBack, embedded = true }: PlaceholderPageProps) {
  const content = (
    <div className="max-w-xl mx-auto py-12 text-center space-y-6">
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">
        Cette procédure sera bientôt disponible
      </h1>
      <p className="text-muted-foreground leading-relaxed">
        Nous travaillons à enrichir nos parcours juridiques. En attendant, n'hésitez pas à consulter un avocat.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <Link href="/practitioners">
          <Button className="gap-2">
            <Briefcase className="h-4 w-4" />
            Trouver un avocat
          </Button>
        </Link>
      </div>
    </div>
  );

  if (embedded) {
    return <Layout>{content}</Layout>;
  }
  return content;
}
