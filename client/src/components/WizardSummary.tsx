import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, ChevronLeft, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProcedureAnswers } from "@shared/schema";

/** Maps step IDs to ProcedureAnswers field names (for click-to-edit) */
const STEP_ID_TO_DISPLAY_KEY: Record<string, string> = {
  step_1: "callerType", step_1b: "moraleSubType", step_2: "context",
  step_3: "isCriminal", step_3b: "criminalSituation", step_3c: "criminalClarification",
  step_3_opponent: "opponentType", step_doc: "documentOfficiel", step_doc_emp: "documentOfficiel",
  step_4: "disputeCategory", step_4_immo: "immoCategory", step_4_immo_role: "immoRole",
  step_4_loc: "locataireProbleme", step_4_prop: "proprietaireProbleme",
  step_4_emploi: "emploiCategory", step_5: "agreementType",
  step_6: "problemType", step_6a: "problemDetail", step_6b: "problemDetail",
  step_6c: "problemDetail", step_7: "amount", step_8: "miseEnDemeure",
  dg_edl: "dgEtatDesLieux", dg_c1_degradations: "dgDegradations",
  dg_c1_d_delai: "dgDelaiCles", dg_c1_c_delai: "dgDelaiCles",
  dg_c1_d_raison: "dgRaisonProprio", dg_c1_c_raison: "dgRaisonProprio",
  dg_c1_d_deg_justif: "dgJustifications", dg_c1_c_deg_justif: "dgJustifications",
  dg_c1_d_deg_conteste: "dgContesteJustif",
  dg_c2_contestation: "dgContestation", dg_c3_raison: "dgAbsenceRaison",
  emp_fin_contrat: "empFinContrat", emp_situation: "empSituation",
  emp_motif: "empMotif", emp_type_faute: "empTypeFaute", emp_procedure: "empProcedure",
};

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
  // Employment / licenciement
  empFinContrat: {
    label: "Fin du contrat",
    valueLabels: {
      licencie: "Licencié(e)",
      rupture_conv: "Rupture conventionnelle",
      demission: "Démission",
      cdd_termine: "CDD terminé / rompu",
      abandon_poste: "Abandon de poste (selon employeur)",
    },
  },
  empSituation: {
    label: "Situation actuelle",
    valueLabels: {
      convoque_entretien: "Convoqué(e) à un entretien préalable",
      lettre_recue: "Lettre de licenciement reçue",
      pas_de_lettre: "Pas de lettre de licenciement",
    },
  },
  empMotif: {
    label: "Motif du licenciement",
    valueLabels: {
      faute: "Licenciement pour faute",
      insuffisance: "Insuffisance professionnelle",
      economique: "Motifs économiques",
    },
  },
  empTypeFaute: {
    label: "Type de faute",
    valueLabels: {
      faute_simple: "Faute simple",
      faute_grave: "Faute grave",
      faute_lourde: "Faute lourde",
    },
  },
  empProcedure: {
    label: "Procédure respectée",
    valueLabels: {
      oui: "Oui",
      non: "Non",
      ne_sais_pas: "Ne sais pas",
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
  // Employment
  "empFinContrat",
  "empSituation",
  "empMotif",
  "empTypeFaute",
  "empProcedure",
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
  rawAnswers?: Array<{ stepId: string; selectedValue: string; chipLabel: string }>;
  onValidate: () => void;
  onModify: () => void;
  onBackToStep?: (stepId: string) => void;
  isSubmitting?: boolean;
}

export function WizardSummary({
  answers,
  rawAnswers,
  onValidate,
  onModify,
  onBackToStep,
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

      <ul className="space-y-1 text-sm">
        {entries.map(({ key, label, value }, idx) => {
          const matchingRawAnswer = rawAnswers?.find((a) => {
            const mappedKey = STEP_ID_TO_DISPLAY_KEY[a.stepId];
            return mappedKey === key;
          });
          const canClick = !!matchingRawAnswer && !!onBackToStep;

          return (
            <li
              key={key}
              className={cn(
                "flex items-center justify-between gap-4 py-2.5 px-3 rounded-lg border-b border-border/40 last:border-0 group transition-colors",
                canClick && "cursor-pointer hover:bg-muted/50"
              )}
              onClick={() => {
                if (canClick && matchingRawAnswer) {
                  onBackToStep(matchingRawAnswer.stepId);
                }
              }}
            >
              <span className="text-muted-foreground shrink-0">{label}</span>
              <span className="flex items-center gap-2">
                <span className="font-medium text-right">{value}</span>
                {canClick && (
                  <Pencil className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                )}
              </span>
            </li>
          );
        })}
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
              <CheckCircle className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
