import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserCheck,
  UserPlus,
  FolderCheck,
  TrendingUp,
  Check,
  X,
  Eye,
  StickyNote,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA (will be replaced by real API calls)
// ═══════════════════════════════════════════════════════════════

interface ClientRequest {
  id: number;
  name: string;
  initials: string;
  color: string;
  ficheType: string;
  ficheNumber: number;
  summary: string;
  receivedAt: string;
  answers: Record<string, string>;
}

interface ActiveClient {
  id: number;
  name: string;
  initials: string;
  color: string;
  ficheType: string;
  detail: string;
  startDate: string;
  status: "premier_contact" | "med_envoyee" | "conciliation" | "en_attente" | "resolu";
  notes: string;
  phone?: string;
  email?: string;
}

const MOCK_REQUESTS: ClientRequest[] = [
  {
    id: 1,
    name: "Sophie Dubois",
    initials: "SD",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    ficheType: "Dépôt de garantie",
    ficheNumber: 20,
    summary: "Locataire, EDL conforme, loyers impayés invoqués mais montant disproportionné",
    receivedAt: "Il y a 2h",
    answers: {
      "Type de litige": "Dépôt de garantie",
      "État des lieux": "Signé, conforme",
      "Raison du proprio": "Loyers impayés",
      "Montant": "Disproportionné",
      "Demande restitution": "Oui",
    },
  },
  {
    id: 2,
    name: "Jean Petit",
    initials: "JP",
    color: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
    ficheType: "Licenciement",
    ficheNumber: 88,
    summary: "Licencié pour faute grave, procédure respectée, conteste le motif",
    receivedAt: "Il y a 5h",
    answers: {
      "Type": "Licenciement pour faute",
      "Faute": "Faute grave",
      "Procédure respectée": "Oui",
    },
  },
  {
    id: 3,
    name: "Claire Moreau",
    initials: "CM",
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    ficheType: "Vente non payée",
    ficheNumber: 1,
    summary: "Vente d'un objet sur Leboncoin, acheteur n'a pas payé, montant < 5 000€",
    receivedAt: "Hier",
    answers: {
      "Type": "Vente non payée",
      "Montant": "< 5 000€",
      "Mise en demeure": "Non",
    },
  },
];

const MOCK_CLIENTS: ActiveClient[] = [
  {
    id: 10,
    name: "Marie Renaud",
    initials: "MR",
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    ficheType: "Vente non payée — 3 200€",
    detail: "Depuis le 10 mars",
    startDate: "10 mars 2026",
    status: "premier_contact",
    notes: "Premier contact le 10/03. La cliente a vendu un meuble sur Leboncoin, l'acheteur n'a jamais payé. Pas de contrat écrit mais échanges SMS. Conseillé d'envoyer une mise en demeure d'abord.",
    phone: "06 12 34 56 78",
    email: "marie.renaud@email.fr",
  },
  {
    id: 11,
    name: "Lucas Bonnet",
    initials: "LB",
    color: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
    ficheType: "Dépôt de garantie",
    detail: "Conciliation en cours — depuis le 2 mars",
    startDate: "2 mars 2026",
    status: "conciliation",
    notes: "Mise en demeure envoyée le 5/03, pas de réponse. Conciliation planifiée le 15/04. Le propriétaire retient 1 800€ sur un dépôt de 1 200€ pour des dégradations contestées.",
    phone: "07 98 76 54 32",
    email: "lucas.bonnet@email.fr",
  },
  {
    id: 12,
    name: "Amélie Faure",
    initials: "AF",
    color: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    ficheType: "Licenciement — faute simple",
    detail: "Contestation envoyée — depuis le 15 mars",
    startDate: "15 mars 2026",
    status: "med_envoyee",
    notes: "Lettre de contestation envoyée à l'employeur le 18/03. En attente de réponse (15 jours). Si pas de réponse, saisine du CPH.",
    email: "amelie.faure@email.fr",
  },
];

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  premier_contact: { label: "Premier contact", class: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  med_envoyee: { label: "Mise en demeure", class: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  conciliation: { label: "Conciliation", class: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  en_attente: { label: "En attente", class: "bg-muted text-muted-foreground" },
  resolu: { label: "Résolu", class: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" },
};

const STATUS_PIPELINE = ["premier_contact", "med_envoyee", "conciliation", "resolu"];

// ═══════════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════════

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number | string; accent?: boolean }) {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className={cn("text-2xl font-medium", accent && "text-primary")}>{value}</p>
    </div>
  );
}

function RequestCard({ request, onAccept, onRefuse, onView }: {
  request: ClientRequest;
  onAccept: () => void;
  onRefuse: () => void;
  onView: () => void;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0", request.color)}>
            {request.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{request.name}</p>
            <p className="text-xs text-muted-foreground">{request.ficheType} — Fiche {request.ficheNumber} — {request.receivedAt}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary flex-shrink-0">
            Nouvelle
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-3">{request.summary}</p>

        {/* Answers preview */}
        <div className="bg-muted/50 rounded-md p-2.5 mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Réponses du client</p>
          {Object.entries(request.answers).map(([key, val]) => (
            <div key={key} className="flex justify-between text-xs py-0.5">
              <span className="text-muted-foreground">{key}</span>
              <span className="font-medium">{val}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={onAccept}>
            <Check className="w-3 h-3" />
            Accepter
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={onView}>
            <Eye className="w-3 h-3" />
            Voir le dossier
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1.5" onClick={onRefuse}>
            <X className="w-3 h-3" />
            Refuser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientCard({ client, onOpen }: { client: ActiveClient; onOpen: () => void }) {
  const statusInfo = STATUS_LABELS[client.status] ?? STATUS_LABELS.en_attente;

  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0", client.color)}>
            {client.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.ficheType} — {client.detail}</p>
          </div>
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0", statusInfo.class)}>
            {statusInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={onOpen}>
            <Eye className="w-3 h-3" />
            Ouvrir le dossier
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <StickyNote className="w-3 h-3" />
            Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientDetail({ client, onBack }: { client: ActiveClient; onBack: () => void }) {
  const [notes, setNotes] = useState(client.notes);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" onClick={onBack}>
        <ChevronLeft className="w-4 h-4" />
        Retour à la liste
      </Button>

      {/* Client info card */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={cn("w-14 h-14 rounded-full flex items-center justify-center text-lg font-medium flex-shrink-0", client.color)}>
              {client.initials}
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium">{client.name}</p>
              <p className="text-sm text-muted-foreground mb-3">Particulier — {client.ficheType}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                {client.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    {client.email}
                  </span>
                )}
                {client.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    {client.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3" />
                  Depuis le {client.startDate}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status pipeline */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Statut du dossier</p>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_PIPELINE.map((s, i) => {
            const info = STATUS_LABELS[s];
            const isCurrent = s === client.status;
            const isPast = STATUS_PIPELINE.indexOf(client.status) > i;
            return (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/40" />}
                <span
                  className={cn(
                    "text-xs px-3 py-1 rounded-full font-medium transition-colors",
                    isCurrent ? info.class : isPast
                      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "bg-muted text-muted-foreground/50"
                  )}
                >
                  {info.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Notes internes</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full min-h-[120px] p-3 text-sm bg-muted/50 border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Ajoutez vos notes sur ce dossier..."
        />
        <div className="flex justify-end mt-2">
          <Button size="sm" variant="outline" className="text-xs">
            Sauvegarder les notes
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfilPublic() {
  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center text-2xl font-medium flex-shrink-0">
              ML
            </div>
            <div className="flex-1">
              <p className="text-xl font-medium">Me Martin Lefebvre</p>
              <p className="text-sm text-muted-foreground">Avocat au barreau de Paris</p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={cn("w-3.5 h-3.5", i <= 4 ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">4.8 (12 avis)</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Modifier mon profil
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Spécialités</p>
              <div className="flex flex-wrap gap-1.5">
                {["Droit immobilier", "Droit civil", "Droit du travail"].map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Localisation</p>
              <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-muted-foreground" /> Paris, Île-de-France</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tarif consultation</p>
              <p className="font-medium">80€ — 150€</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Aide juridictionnelle</p>
              <p className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Acceptée</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground mb-1">Bio</p>
            <p className="text-sm text-muted-foreground">
              Avocat inscrit au barreau de Paris depuis 2015, je suis spécialisé en droit immobilier (baux, copropriété, dépôts de garantie) et en droit du travail (licenciements, prud'hommes). J'accompagne les particuliers dans la résolution amiable et contentieuse de leurs litiges.
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Ce profil est visible par les particuliers qui recherchent un avocat sur Gisèle.law.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════

type Tab = "clients" | "profil" | "demandes" | "stats";

export default function AvocatDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("clients");
  const [selectedClient, setSelectedClient] = useState<ActiveClient | null>(null);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [clients, setClients] = useState(MOCK_CLIENTS);

  const handleAccept = (req: ClientRequest) => {
    const newClient: ActiveClient = {
      id: req.id + 100,
      name: req.name,
      initials: req.initials,
      color: req.color,
      ficheType: req.ficheType,
      detail: `Accepté — ${req.receivedAt}`,
      startDate: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      status: "premier_contact",
      notes: `Résumé : ${req.summary}`,
    };
    setClients((prev) => [newClient, ...prev]);
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  const handleRefuse = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "clients", label: "Mes clients" },
    { id: "demandes", label: "Demandes entrantes", count: requests.length },
    { id: "profil", label: "Mon profil public" },
    { id: "stats", label: "Statistiques" },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        {/* Tabs */}
        <div className="flex gap-0 border-b border-border mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedClient(null); }}
              className={cn(
                "px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab: Mes clients */}
        {activeTab === "clients" && !selectedClient && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <StatCard icon={UserCheck} label="Clients actifs" value={clients.length} accent />
              <StatCard icon={UserPlus} label="Nouvelles demandes" value={requests.length} />
              <StatCard icon={FolderCheck} label="Dossiers résolus" value={12} />
            </div>

            <h2 className="text-sm font-medium text-muted-foreground mb-3">Clients actifs</h2>
            <div className="space-y-3">
              {clients.map((c) => (
                <ClientCard key={c.id} client={c} onOpen={() => setSelectedClient(c)} />
              ))}
            </div>

            {clients.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm">
                Aucun client actif. Acceptez des demandes entrantes pour commencer.
              </div>
            )}
          </>
        )}

        {/* Tab: Mes clients → Detail */}
        {activeTab === "clients" && selectedClient && (
          <ClientDetail client={selectedClient} onBack={() => setSelectedClient(null)} />
        )}

        {/* Tab: Demandes entrantes */}
        {activeTab === "demandes" && (
          <>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Nouvelles demandes ({requests.length})
            </h2>
            <div className="space-y-3">
              {requests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onAccept={() => handleAccept(req)}
                  onRefuse={() => handleRefuse(req.id)}
                  onView={() => {}}
                />
              ))}
            </div>

            {requests.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm">
                Aucune demande en attente.
              </div>
            )}
          </>
        )}

        {/* Tab: Mon profil public */}
        {activeTab === "profil" && <ProfilPublic />}

        {/* Tab: Statistiques */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-3">
              <StatCard icon={UserCheck} label="Clients total" value={20} />
              <StatCard icon={FolderCheck} label="Dossiers résolus" value={12} />
              <StatCard icon={Star} label="Note moyenne" value="4.8" />
              <StatCard icon={TrendingUp} label="Taux d'acceptation" value="76%" />
            </div>
            <Card className="border-border/60">
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                Les statistiques détaillées (graphiques d'activité, revenus, temps moyen de résolution) seront disponibles dans une prochaine version.
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}