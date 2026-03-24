import { useRoute, Link, useLocation } from "wouter";
import { useProcedure } from "@/hooks/use-procedures";
import { Layout } from "@/components/Layout";
import { FicheResult } from "@/components/FicheResult";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, Save } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  getFicheForAnswers,
  getDepotGarantieFicheNumber,
  getDepotGarantieFiche,
  type FicheContent,
} from "@/data/ficheContent";
import type { ProcedureAnswers } from "@shared/schema";

export default function Result() {
  const [, params] = useRoute("/procedure/:id/result");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const procedureId = parseInt(params!.id, 10);
  const { data: procedure, isLoading } = useProcedure(procedureId);

  const saveToDossiers = async () => {
    if (!procedure) return;
    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/dossiers", {
        title: procedure.title,
        domain: procedure.type,
        procedureData: procedure.answers,
        status: "active",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dossiers"] });
      toast({
        title: "Dossier sauvegardé",
        description: "Votre dossier a été ajouté à votre compte.",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le dossier.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!procedure || !procedure.answers) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold text-destructive">Procédure introuvable</h2>
          <p className="text-muted-foreground mt-2">
            Les données de ce dossier semblent incomplètes.
          </p>
        </div>
      </Layout>
    );
  }

  const answers = procedure.answers as ProcedureAnswers;

  // ── Resolve fiche based on procedure type ──
  let fiche: FicheContent | null = null;

  if (
    procedure.type === "contrat_vente_non_paye" &&
    answers.amount &&
    answers.miseEnDemeure !== undefined
  ) {
    fiche = getFicheForAnswers(answers.amount, answers.miseEnDemeure);
  }

  if (procedure.type === "depot_garantie") {
    const ficheNum = getDepotGarantieFicheNumber(answers);
    if (ficheNum !== null) {
      fiche = getDepotGarantieFiche(ficheNum);
    }
  }

  // ── Render fiche if found ──
  if (fiche) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-muted-foreground">
                Dossier :{" "}
                <span className="font-semibold text-foreground">
                  {procedure.title}
                </span>
              </p>
            </div>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer / PDF
            </Button>
          </div>

          <FicheResult fiche={fiche} />

          {user && (
            <div className="mt-8 pt-8 border-t">
              <Button
                variant="outline"
                onClick={saveToDossiers}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Sauvegarder dans mes dossiers
              </Button>
            </div>
          )}
          {!user && (
            <div className="mt-8 pt-8 border-t bg-muted/50 p-6 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Créez un compte gratuit pour sauvegarder votre dossier et suivre
                vos délais.
              </p>
              <a href="/api/login">
                <Button variant="outline">Se connecter</Button>
              </a>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // ── Fallback: no fiche available ──
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-primary">
          Résultat non disponible
        </h2>
        <p className="text-muted-foreground mt-2">
          Cette procédure ne correspond pas à une fiche disponible ou les
          données sont incomplètes.
        </p>
        <Link href="/">
          <Button className="mt-6">Retour à l'accueil</Button>
        </Link>
      </div>
    </Layout>
  );
}
