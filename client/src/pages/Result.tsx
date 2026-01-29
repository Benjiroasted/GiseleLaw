import { useRoute } from "wouter";
import { useProcedure } from "@/hooks/use-procedures";
import { Layout } from "@/components/Layout";
import { TimelineStep } from "@/components/TimelineStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Printer, Briefcase, AlertTriangle, CalendarDays } from "lucide-react";
import { addDays, addYears, addMonths, format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Result() {
  const [, params] = useRoute("/procedure/:id/result");
  const procedureId = parseInt(params!.id);
  const { data: procedure, isLoading } = useProcedure(procedureId);

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
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-destructive">Procédure introuvable</h2>
          <p className="text-muted-foreground mt-2">Les données de ce dossier semblent incomplètes.</p>
        </div>
      </Layout>
    );
  }

  const answers = procedure.answers as any;
  const baseDate = answers.date ? new Date(answers.date) : new Date();

  // --- LOGIC FOR TIMELINE GENERATION ---
  // Ideally this would be shared/utils logic, but keeping it here for simplicity of the prompt
  const getTimeline = () => {
    if (answers.type === 'unpaid_work') {
      const isEmployee = answers.status === 'employee';
      const prescriptionDate = addYears(baseDate, 3); // Generally 3 years for salaries

      return {
        prescription: format(prescriptionDate, 'dd MMMM yyyy', { locale: fr }),
        steps: [
          {
            title: "Mise en demeure",
            description: "Envoyez une lettre recommandée avec accusé de réception exigeant le paiement sous un délai raisonnable (ex: 8-15 jours).",
            date: format(addDays(baseDate, 1), 'dd MMMM yyyy', { locale: fr }),
            isCompleted: true
          },
          {
            title: isEmployee ? "Saisine du Conseil de Prud'hommes" : "Injonction de payer",
            description: isEmployee 
              ? "Si pas de réponse, déposez une requête au greffe du Conseil de Prud'hommes."
              : "Déposez une requête en injonction de payer auprès du Tribunal de Commerce ou Judiciaire.",
            date: format(addDays(baseDate, 15), 'dd MMMM yyyy', { locale: fr }),
            isCompleted: false
          },
          {
            title: isEmployee ? "Bureau de Conciliation et d'Orientation (BCO)" : "Signification par huissier",
            description: isEmployee
              ? "Une audience obligatoire pour tenter de trouver un accord amiable."
              : "Vous avez 6 mois pour faire signifier l'ordonnance par un huissier si le juge accepte.",
            date: format(addMonths(baseDate, 2), 'MMMM yyyy', { locale: fr }), // Rough estimate
            isCompleted: false
          },
          {
            title: isEmployee ? "Bureau de Jugement" : "Exécution forcée",
            description: "L'audience finale où l'affaire est plaidée devant les juges.",
            date: format(addMonths(baseDate, 8), 'MMMM yyyy', { locale: fr }), // Rough estimate
            isCompleted: false
          }
        ]
      };
    } else {
      // IP Logic
      const prescriptionDate = addYears(baseDate, 5); // 5 years for civil IP action

      return {
        prescription: format(prescriptionDate, 'dd MMMM yyyy', { locale: fr }),
        steps: [
          {
            title: "Constitution de preuves",
            description: "Rassemblez toutes les preuves d'antériorité et de la contrefaçon (constat d'huissier sur internet, achat test).",
            date: format(addDays(baseDate, 0), 'dd MMMM yyyy', { locale: fr }),
            isCompleted: true
          },
          {
            title: "Mise en demeure",
            description: "Lettre formelle demandant la cessation des actes de contrefaçon et indemnisation.",
            date: format(addDays(baseDate, 7), 'dd MMMM yyyy', { locale: fr }),
            isCompleted: false
          },
          {
            title: "Saisie-contrefaçon (Optionnel)",
            description: "Autorisée par un juge, elle permet à un huissier de saisir les preuves directement chez le contrefacteur.",
            date: format(addDays(baseDate, 30), 'dd MMMM yyyy', { locale: fr }),
            isCompleted: false
          },
          {
            title: "Assignation en justice",
            description: "Lancement officiel de la procédure devant le Tribunal Judiciaire (compétence exclusive).",
            date: format(addMonths(baseDate, 2), 'MMMM yyyy', { locale: fr }),
            isCompleted: false
          }
        ]
      };
    }
  };

  const { steps, prescription } = getTimeline();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Votre Plan d'Action</h1>
            <p className="text-muted-foreground">
              Dossier : <span className="font-semibold text-foreground">{procedure.title}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer / PDF
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-primary-foreground">
              <Briefcase className="mr-2 h-4 w-4" />
              Trouver un avocat
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Timeline Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Calendrier de procédure
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-0 pl-2">
                  {steps.map((step, idx) => (
                    <TimelineStep
                      key={idx}
                      {...step}
                      isLast={idx === steps.length - 1}
                      delay={idx * 150}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-1">Attention à la prescription</h3>
                    <p className="text-primary-foreground/80 leading-relaxed">
                      Vous devez agir en justice avant le <span className="font-bold text-white bg-white/10 px-1 rounded">{prescription}</span>. 
                      Passé ce délai, vos droits seront éteints et aucune action ne sera plus possible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Résumé du cas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Nature</span>
                  <span className="font-medium bg-slate-100 px-2 py-1 rounded text-slate-700">
                    {answers.type === 'unpaid_work' ? 'Travail / Salaire' : 'Propriété Intellectuelle'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Date de départ</span>
                  <span className="font-medium">
                     {answers.date ? format(new Date(answers.date), 'dd MMMM yyyy', { locale: fr }) : 'N/A'}
                  </span>
                </div>
                {answers.ipType && (
                  <div>
                     <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Type IP</span>
                     <span className="font-medium">{answers.ipType}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
              <h4 className="font-serif font-bold text-amber-900 mb-3">Le conseil de Gisèle</h4>
              <p className="text-sm text-amber-800 leading-relaxed mb-4">
                La mise en demeure est une étape cruciale. Elle fait courir les intérêts légaux et prouve votre bonne foi.
                N'allez pas au tribunal sans l'avoir envoyée.
              </p>
              <Button variant="link" className="text-amber-700 p-0 h-auto font-semibold">
                Télécharger un modèle →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
