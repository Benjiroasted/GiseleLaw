import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, Save, ChevronLeft } from "lucide-react";
import type { ProcedureAnswers } from "@shared/schema";

/**
 * Human-readable French labels for every possible answer value.
 * Each key in LABELS maps to a ProcedureAnswers field.
 * `valueLabels` maps the raw stored value → what the user sees.
 */
const LABELS: Record<
  string,
  { label: string; valueLabels: Record<string, string> }
> = {
  callerType: {
    label: "Vous êtes",
    valueLabels: {
      particulier: "Un particulier",
      autre: "Autre (entité juridique)",
    },
  },
  moraleSubType: {
    label: "Vous agissez en tant que",
    valueLabels: {
      entreprise: "Entreprise / Société",
      employeur: "Employeur",
      commercant: "Commerçant / Prof. libérale / Artisan",
      association: "Association",
    },
  },
  context: {
    label: "Contexte",
    valueLabels: {
      vie_perso: "Vie perso",
      activite_pro: "Activité professionnelle",
    },
  },
  isCriminal: {
    label: "Infraction pénale",
    valueLabels: {
      true: "Oui",
      false: "Non",
      je_ne_sais_pas: "Ne savait pas",
    },
  },
  criminalSituation: {
    label: "Situation pénale",
    valueLabels: {
      porter_plainte: "Souhaitez porter plainte",
      convoque_police: "Convoqué par la police",
      poursuivi_tribunal: "Poursuivi devant un tribunal",
    },
  },
  criminalClarification: {
    label: "Précision",
    valueLabels: {
      infraction: "Infraction / acte illégal",
      procedure_police: "Procédure police / tribunal",
      conflit: "Conflit / désaccord",
    },
  },
  opponentType: {
    label: "Litige avec",
    valueLabels: {
      particulier: "Un particulier",
      professionnel: "Un professionnel / entreprise",
      employeur: "Un employeur",
      banque: "Une banque",
      assurance: "Une assurance",
      administration: "Une administration",
    },
  },
  disputeCategory: {
    label: "Catégorie du litige",
    valueLabels: {
      achat_vente_service: "Achat / vente / service",
      pret_argent: "Prêt d'argent / somme non remboursée",
      logement_immobilier: "Logement / immobilier",
      dommage: "Dommage subi",
      famille_heritage: "Famille / héritage",
      voisinage: "Conflit de voisinage",
      infraction_penale: "Infraction pénale",
      // Legacy values
      contrat: "Contrat / Engagement",
      pret_dette: "Prêt d'argent ou dette",
      immobilier: "Immobilier / Logement",
      famille: "Famille / Succession",
    },
  },
  documentOfficiel: {
    label: "Document officiel reçu",
    valueLabels: {
      true: "Oui",
      false: "Non",
    },
  },
  documentType: {
    label: "Type de document",
    valueLabels: {
      mise_en_demeure: "Une mise en demeure",
      convocation: "Une convocation (police ou tribunal)",
      assignation: "Une assignation au tribunal",
      decision_justice: "Une décision de justice ou ordonnance",
      ne_sais_pas: "Ne sait pas",
    },
  },
  immoCategory: {
    label: "Sous-catégorie immobilier",
    valueLabels: {
      location: "Location de logement",
      achat_vente_immo: "Achat / vente immobilier",
      travaux: "Travaux / réparations",
      voisinage_immo: "Problèmes de voisinage",
    },
  },
  immoRole: {
    label: "Vous êtes",
    valueLabels: {
      locataire: "Locataire",
      proprietaire: "Propriétaire",
    },
  },
  locataireProbleme: {
    label: "Problème locataire",
    valueLabels: {
      depot_garantie: "Restitution du dépôt de garantie",
      reparations_travaux: "Réparations ou travaux facturés",
      augmentation_loyer: "Augmentation du loyer",
      loyers_impayes: "Loyers impayés",
      etat_logement: "État du logement",
      expulsion: "Menace d'expulsion",
    },
  },
  proprietaireProbleme: {
    label: "Problème propriétaire",
    valueLabels: {
      loyers_impayes: "Loyers impayés",
      degradations: "Dégradations du logement",
      refus_quitter: "Refus de quitter le logement",
      charges_impayees: "Charges impayées",
      contestation_retenue: "Contestation retenue caution",
    },
  },
  emploiCategory: {
    label: "Problème emploi",
    valueLabels: {
      rupture_contrat: "Rupture de contrat de travail",
      contrat_embauche: "Contrat de travail / embauche",
      salaire_impaye: "Salaire ou somme impayée",
      conditions_travail: "Conditions de travail / conflit",
      accident_travail: "Accident du travail / maladie pro",
      discrimination: "Discrimination au travail",
      sanction: "Sanction disciplinaire",
    },
  },
  agreementType: {
    label: "Type de bien / service",
    valueLabels: {
      objet_bien: "Un objet / bien vendu ou acheté",
      prestation_service: "Prestation ou service rendu",
      autre_accord: "Autre accord écrit ou verbal",
      // Legacy
      vente_achat: "Vente ou achat entre particuliers",
      pret_remboursement: "Prêt ou somme à rembourser",
    },
  },
  problemType: {
    label: "Nature du problème",
    valueLabels: {
      informations_accord: "Informations / ce qui a été convenu",
      accord_pas_respecte: "Accord non respecté",
      annulation_contrat: "Annulation / remise en cause",
      // Legacy
      signature_contrat: "Signature / Informations avant signature",
      execution_contrat: "Mauvaise exécution / Non-respect",
    },
  },
  problemDetail: {
    label: "Précision",
    valueLabels: {
      // Step 6a
      trompe_vente: "Trompé(e) ou mal informé(e) lors de la vente",
      trompe_achat: "Trompé(e) ou mal informé(e) lors de l'achat",
      erreur_bien_prix: "Erreur sur le bien ou le prix",
      pas_droit_signer: "La personne n'avait pas le droit de signer",
      // Step 6b
      non_paye: "Non payé(e)",
      bien_non_recu: "Bien non reçu",
      bien_defaut: "Bien non conforme / défauts",
      retard_livraison: "Retard de livraison",
      paiement_incomplet: "Paiement incomplet ou refusé",
      // Step 6c
      autre_veut_annuler: "L'autre partie veut annuler",
      je_veux_annuler: "Je veux annuler",
      desaccord_annulation: "Désaccord sur l'annulation",
      vendeur_retracte: "Le vendeur s'est rétracté",
      acheteur_retracte: "L'acheteur s'est rétracté",
    },
  },
  amount: {
    label: "Montant réclamé",
    valueLabels: {
      less_5000: "Moins de 5 000 €",
      more_5000: "Plus de 5 000 €",
    },
  },
  miseEnDemeure: {
    label: "Mise en demeure envoyée",
    valueLabels: {
      true: "Oui",
      false: "Non",
    },
  },
  // Depot garantie labels
  dgEtatDesLieux: {
    label: "État des lieux de sortie",
    valueLabels: {
      signe: "Signé par les deux parties",
      pas_signe: "Fait mais non signé (contesté)",
      pas_realise: "Non réalisé",
    },
  },
  dgDegradations: {
    label: "Dégradations mentionnées",
    valueLabels: { true: "Oui", false: "Non (conforme)" },
  },
  dgDelaiCles: {
    label: "Délai depuis remise des clés",
    valueLabels: {
      moins_2_mois: "Moins de 2 mois",
      plus_2_mois: "Plus de 2 mois",
      moins_1_mois: "Moins d'un mois",
      plus_1_mois: "Plus d'un mois",
    },
  },
  dgRaisonProprio: {
    label: "Raison du propriétaire",
    valueLabels: {
      degradation: "Dégradation du logement",
      loyers_impayes: "Loyers ou charges impayés",
      aucune: "Aucune explication",
    },
  },
  dgJustifications: {
    label: "Justifications fournies",
    valueLabels: { true: "Oui", false: "Non" },
  },
  dgContesteJustif: {
    label: "Justifications contestées",
    valueLabels: { true: "Oui", false: "Non" },
  },
  dgDemandeRestitution: {
    label: "Demande de restitution faite",
    valueLabels: { true: "Oui", false: "Non" },
  },
  dgLoyersImpayes: {
    label: "Loyers/charges impayés au départ",
    valueLabels: { true: "Oui", false: "Non" },
  },
  dgMontantProportionne: {
    label: "Montant proportionné",
    valueLabels: { true: "Oui (proportionné)", false: "Non (disproportionné)" },
  },
  dgContestation: {
    label: "Objet de la contestation",
    valueLabels: {
      degradation: "Les dégradations",
      montant_reparations: "Le montant des réparations",
      les_deux: "Les deux",
    },
  },
  dgAbsenceRaison: {
    label: "Raison absence d'état des lieux",
    valueLabels: {
      proprio_absent: "Propriétaire absent / pas proposé",
      locataire_absent: "J'étais absent(e)",
      desaccord: "Pas d'accord entre les parties",
    },
  },
};

const ORDER: string[] = [
  "callerType",
  "moraleSubType",
  "context",
  "isCriminal",
  "criminalClarification",
  "criminalSituation",
  "opponentType",
  "documentOfficiel",
  "documentType",
  "disputeCategory",
  "immoCategory",
  "immoRole",
  "locataireProbleme",
  "proprietaireProbleme",
  "emploiCategory",
  "agreementType",
  "problemType",
  "problemDetail",
  "amount",
  "miseEnDemeure",
  // Depot garantie
  "dgEtatDesLieux",
  "dgDegradations",
  "dgDelaiCles",
  "dgRaisonProprio",
  "dgJustifications",
  "dgContesteJustif",
  "dgLoyersImpayes",
  "dgMontantProportionne",
  "dgContestation",
  "dgAbsenceRaison",
  "dgDemandeRestitution",
];

function formatValue(key: string, rawValue: unknown): string {
  const meta = LABELS[key];
  if (!meta) return String(rawValue ?? "");
  // Booleans need to be converted to string keys for lookup
  const lookupKey = String(rawValue);
  return meta.valueLabels[lookupKey] ?? lookupKey;
}

export interface WizardSummaryProps {
  answers: ProcedureAnswers;
  onValidate: () => void;
  onModify: () => void;
  isSubmitting?: boolean;
}

export function WizardSummary({
  answers,
  onValidate,
  onModify,
  isSubmitting = false,
}: WizardSummaryProps) {
  const entries = ORDER.filter(
    (key) => answers[key] !== undefined && answers[key] !== null
  ).map((key) => ({
    key,
    label: LABELS[key]?.label ?? key,
    value: formatValue(key, answers[key]),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8 max-w-lg mx-auto"
    >
      <div>
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">
          Récapitulatif de vos réponses
        </h2>
        <p className="text-muted-foreground text-sm">
          Vérifiez vos réponses puis validez pour obtenir votre fiche.
        </p>
      </div>

      <ul className="space-y-3 text-sm">
        {entries.map(({ key, label, value }) => (
          <li
            key={key}
            className="flex justify-between gap-4 py-2 border-b border-border/60 last:border-0"
          >
            <span className="text-muted-foreground shrink-0">{label}</span>
            <span className="font-medium text-right">{value}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onModify}
          className="gap-2 order-2 sm:order-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Modifier
        </Button>
        <Button
          onClick={onValidate}
          disabled={isSubmitting}
          className="gap-2 order-1 sm:order-2 min-w-[200px]"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Valider mes réponses
              <Save className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
