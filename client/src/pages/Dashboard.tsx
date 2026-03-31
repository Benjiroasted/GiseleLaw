import { Link } from "wouter";
import { useState } from "react";
import { useProcedures, useDeleteProcedure } from "@/hooks/use-procedures";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  FileText,
  Trash2,
  ChevronRight,
  ChevronDown,
  Clock,
  AlertTriangle,
  Info,
  Download,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ProcedureTimeline } from "@/components/ProcedureTimeline";
import {
  getProcedureInfo,
  getRemindersFromProcedures,
  getCategoryColor,
  getCategoryLabel,
  type Reminder,
} from "@/data/procedureHelpers";
import type { ProcedureAnswers } from "@shared/schema";

function ReminderCard({ reminder }: { reminder: Reminder }) {
  const iconClass =
    reminder.urgency === "high"
      ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
      : reminder.urgency === "medium"
        ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        : "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400";

  const Icon =
    reminder.urgency === "high"
      ? AlertTriangle
      : reminder.urgency === "medium"
        ? Clock
        : Info;

  return (
    <div className="flex gap-3 items-start p-3 bg-card rounded-lg border border-border/60">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClass}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{reminder.text}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {reminder.procedureTitle}
        </p>
      </div>
    </div>
  );
}

function DossierCard({
  proc,
  onDelete,
}: {
  proc: { id: number; title: string; type: string; answers: Record<string, unknown>; createdAt: string | Date | null; status: string };
  onDelete: (id: number) => void;
}) {
  const [showSuivi, setShowSuivi] = useState(false);
  const answers = proc.answers as ProcedureAnswers;
  const info = getProcedureInfo(proc.type, answers);

  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{info.label}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(info.category)}`}
              >
                {getCategoryLabel(info.category)}
              </span>
              {info.ficheLabel && (
                <span className="text-xs text-muted-foreground">
                  {info.ficheLabel}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {proc.createdAt
                  ? format(new Date(proc.createdAt), "dd MMM yyyy", {
                      locale: fr,
                    })
                  : ""}
              </span>
            </div>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary flex-shrink-0">
            En cours
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Link href={`/procedure/${proc.id}/result`}>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Eye className="w-3 h-3" />
              Voir la fiche
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => setShowSuivi(!showSuivi)}
          >
            {showSuivi ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            Suivi
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => window.print()}
          >
            <Download className="w-3 h-3" />
            PDF
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1.5 ml-auto"
              >
                <Trash2 className="w-3 h-3" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer ce dossier ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Le dossier &ldquo;{info.label}
                  &rdquo; sera définitivement supprimé.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(proc.id)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Suivi timeline (expanded) */}
        {showSuivi && (
          <div className="mt-4 pt-4 border-t border-border/60">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Suivi de la procédure
            </p>
            <ProcedureTimeline steps={info.timelineSteps} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: procedures, isLoading } = useProcedures();
  const deleteProcedure = useDeleteProcedure();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await deleteProcedure.mutateAsync(id);
      toast({
        title: "Dossier supprimé",
        description: "Le dossier a été supprimé avec succès.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le dossier.",
        variant: "destructive",
      });
    }
  };

  const procs = procedures ?? [];
  const reminders = getRemindersFromProcedures(
    procs.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      answers: p.answers as Record<string, unknown>,
    }))
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-bold text-primary">
            Mes dossiers
          </h1>
          <Link href="/procedure/new/wizard">
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              Nouveau dossier
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 bg-muted animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : procs.length > 0 ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Dossiers actifs
                </p>
                <p className="text-2xl font-medium">{procs.length}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Rappels en attente
                </p>
                <p className="text-2xl font-medium text-amber-600 dark:text-amber-400">
                  {reminders.length}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Fiches consultées
                </p>
                <p className="text-2xl font-medium">{procs.length}</p>
              </div>
            </div>

            {/* Reminders */}
            {reminders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Rappels et alertes
                </h2>
                <div className="space-y-2">
                  {reminders.map((r, i) => (
                    <ReminderCard key={i} reminder={r} />
                  ))}
                </div>
              </div>
            )}

            {/* Dossier list */}
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">
                Dossiers en cours
              </h2>
              <div className="space-y-3">
                {procs.map((proc) => (
                  <DossierCard
                    key={proc.id}
                    proc={proc}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Aucun dossier pour le moment
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
              Commencez une nouvelle procédure pour obtenir votre feuille de
              route juridique personnalisée.
            </p>
            <Link href="/procedure/new/wizard">
              <Button>Commencer ma procédure</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
