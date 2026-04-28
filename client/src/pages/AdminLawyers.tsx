import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Practitioner, CnbDirectoryEntry } from "@shared/schema";

interface ApplicationRow {
  practitioner: Practitioner;
  cnbCandidate: CnbDirectoryEntry | null;
  cnbAutoMatch: {
    status: "match_exact" | "match_ambiguous" | "no_match";
    candidates: CnbDirectoryEntry[];
  };
}

export default function AdminLawyers() {
  const { toast } = useToast();
  const { data, isLoading, error } = useQuery<ApplicationRow[]>({
    queryKey: ["/api/admin/lawyers"],
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Chargement…</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    const msg = (error as Error).message;
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-20 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-primary mb-2">
            Accès refusé
          </h1>
          <p className="text-muted-foreground">
            {msg.includes("403")
              ? "Cette page est réservée aux administrateurs."
              : msg.includes("401")
                ? "Vous devez être connecté pour accéder à cette page."
                : `Erreur : ${msg}`}
          </p>
        </div>
      </Layout>
    );
  }

  const rows = data ?? [];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-12 px-4">
        <header className="mb-10">
          <Badge variant="secondary" className="uppercase tracking-wider mb-3">
            Admin · Vérification CNB
          </Badge>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
            Candidatures avocats
          </h1>
          <p className="text-muted-foreground">
            {rows.length} candidature{rows.length > 1 ? "s" : ""} en attente
            de vérification
          </p>
        </header>

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <ShieldCheck className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucune candidature en attente. Retour ici dès qu'un avocat
              s'inscrit.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {rows.map((row) => (
              <ApplicationCard key={row.practitioner.id} row={row} toast={toast} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function ApplicationCard({
  row,
  toast,
}: {
  row: ApplicationRow;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const { practitioner, cnbAutoMatch } = row;
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(
    cnbAutoMatch.status === "match_exact"
      ? cnbAutoMatch.candidates[0]?.id ?? null
      : row.cnbCandidate?.id ?? null,
  );
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const approveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST",
        `/api/admin/lawyers/${practitioner.id}/approve`,
        { cnbMatchId: selectedMatchId },
      );
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Candidature approuvée", description: practitioner.name });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lawyers"] });
    },
    onError: (err: Error) =>
      toast({
        title: "Échec de l'approbation",
        description: err.message,
        variant: "destructive",
      }),
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST",
        `/api/admin/lawyers/${practitioner.id}/reject`,
        { reason: rejectReason.trim() },
      );
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Candidature rejetée", description: practitioner.name });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lawyers"] });
    },
    onError: (err: Error) =>
      toast({
        title: "Échec du rejet",
        description: err.message,
        variant: "destructive",
      }),
  });

  const matchBadge =
    cnbAutoMatch.status === "match_exact" ? (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
        <CheckCircle2 className="h-3 w-3 mr-1" /> Match CNB exact
      </Badge>
    ) : cnbAutoMatch.status === "match_ambiguous" ? (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
        <AlertTriangle className="h-3 w-3 mr-1" />
        {cnbAutoMatch.candidates.length} candidats CNB
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" /> Aucun match CNB
      </Badge>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-primary">
            {practitioner.name}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
            {practitioner.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {practitioner.email}
              </span>
            )}
            {practitioner.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {practitioner.phone}
              </span>
            )}
            {practitioner.locationCity && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {practitioner.locationCity}
              </span>
            )}
          </div>
        </div>
        {matchBadge}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
            Barreau déclaré
          </div>
          <div className="font-medium text-foreground">{practitioner.barreau ?? "—"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
            Spécialités
          </div>
          <div className="font-medium text-foreground">
            {practitioner.specialties?.length
              ? practitioner.specialties.join(", ")
              : "—"}
          </div>
        </div>
      </div>

      {practitioner.bio && (
        <div className="mb-4">
          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
            Présentation
          </div>
          <p className="text-sm text-foreground/90 whitespace-pre-wrap">
            {practitioner.bio}
          </p>
        </div>
      )}

      {/* Candidate picker (for ambiguous matches) */}
      {cnbAutoMatch.candidates.length > 0 && (
        <div className="mb-4">
          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
            Candidats CNB
          </div>
          <div className="space-y-2">
            {cnbAutoMatch.candidates.map((c) => (
              <label
                key={c.id}
                className={
                  selectedMatchId === c.id
                    ? "flex items-start gap-3 p-3 rounded-lg border-2 border-primary bg-primary/5 cursor-pointer"
                    : "flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 cursor-pointer"
                }
              >
                <input
                  type="radio"
                  name={`match-${practitioner.id}`}
                  checked={selectedMatchId === c.id}
                  onChange={() => setSelectedMatchId(c.id)}
                  className="mt-1"
                />
                <div className="text-sm flex-1">
                  <div className="font-medium text-primary">
                    {c.prenom} {c.nom} — {c.barreau}
                  </div>
                  {c.raisonSociale && (
                    <div className="text-xs text-muted-foreground">
                      {c.raisonSociale}
                    </div>
                  )}
                  {c.adresse && (
                    <div className="text-xs text-muted-foreground">{c.adresse}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {!rejectMode ? (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
          <Button
            onClick={() => approveMutation.mutate()}
            disabled={approveMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {approveMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            Approuver
          </Button>
          <Button
            variant="outline"
            onClick={() => setRejectMode(true)}
            disabled={rejectMutation.isPending}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejeter
          </Button>
        </div>
      ) : (
        <div className="pt-2 border-t border-border/60 space-y-2">
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Motif du rejet (sera communiqué à l'avocat)"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => rejectMutation.mutate()}
              disabled={!rejectReason.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Confirmer le rejet
            </Button>
            <Button variant="ghost" onClick={() => setRejectMode(false)}>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
