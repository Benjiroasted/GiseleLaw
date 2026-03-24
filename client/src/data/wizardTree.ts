/**
 * Decision tree for the legal procedure wizard — v2 (March 2026).
 * Rebuilt from Retours Juridique PDF.
 *
 * Each step has a question and options; each option has:
 *   value   — stored in answers
 *   label   — main button text
 *   sublabel — smaller text below label (optional)
 *   tooltipKey — key into legalDefinitions for (?) bubble (optional)
 *   chipLabel — short text for progress trail (~20 chars, optional — defaults to label truncated)
 *   next — step id | "placeholder" | "summary"
 */

export interface WizardOption {
  label: string;
  sublabel?: string;
  value: string;
  tooltipKey?: string;
  chipLabel?: string;
  next: string | "placeholder" | "summary";
}

export interface WizardStep {
  id: string;
  question: string;
  questionTooltipKey?: string;
  helpText?: string;
  contextLabel?: string;
  label?: string;
  options: WizardOption[];
}

/** Special next-step ids */
export const PLACEHOLDER_NEXT = "placeholder";
export const STEP_CRIMINAL_BLOCK = "step_3b";
export const SUMMARY_STEP_ID = "step_9";

/** Max length for progress trail chip text */
const CHIP_MAX = 20;
export function getChipLabel(option: WizardOption): string {
  const text = option.chipLabel ?? option.label;
  return text.length > CHIP_MAX ? text.slice(0, CHIP_MAX - 1) + "…" : text;
}

// ═══════════════════════════════════════════════════════════════
//  WIZARD STEPS
// ═══════════════════════════════════════════════════════════════

export const WIZARD_STEPS: WizardStep[] = [
  // ──────────── STEP 1 : Êtes-vous ────────────
  {
    id: "step_1",
    question: "Êtes-vous",
    options: [
      {
        label: "Un particulier",
        value: "particulier",
        chipLabel: "Particulier",
        tooltipKey: "particulier",
        next: "step_2",
      },
      {
        label: "Autre",
        value: "autre",
        chipLabel: "Autre",
        tooltipKey: "autre_entite",
        next: "step_1b",
      },
    ],
  },

  // ──────────── STEP 1B : Personne morale — sous-type ────────────
  {
    id: "step_1b",
    question: "Agissez-vous en tant que :",
    options: [
      { label: "Entreprise / Société", value: "entreprise", next: PLACEHOLDER_NEXT },
      { label: "Employeur", value: "employeur", next: PLACEHOLDER_NEXT },
      {
        label: "Commerçant / Profession libérale / Artisan",
        value: "commercant",
        next: PLACEHOLDER_NEXT,
      },
      { label: "Association", value: "association", next: PLACEHOLDER_NEXT },
    ],
  },

  // ──────────── STEP 2 : Contexte vie perso / activité pro ────────────
  {
    id: "step_2",
    question: "Agissez-vous dans le cadre de votre vie perso ou dans le cadre de votre activité pro ?",
    options: [
      { label: "Vie perso", value: "vie_perso", chipLabel: "Vie perso", next: "step_3" },
      {
        label: "Activité pro",
        value: "activite_pro",
        chipLabel: "Activité pro",
        next: "step_1b",
      },
    ],
  },

  // ──────────── STEP 3 : Infraction pénale ? ────────────
  {
    id: "step_3",
    question:
      "Votre situation concerne-t-elle une infraction ? (violence, escroquerie, harcèlement, contravention…)",
    options: [
      { label: "OUI", value: "oui", next: "step_3b" },
      { label: "NON", value: "non", next: "step_3_opponent" },
      { label: "JE NE SAIS PAS", value: "je_ne_sais_pas", chipLabel: "Ne sais pas", next: "step_3c" },
    ],
  },

  // ──────────── STEP 3B : Bloc pénal (placeholder) ────────────
  {
    id: "step_3b",
    question: "Votre situation :",
    options: [
      { label: "Vous souhaitez porter plainte", value: "porter_plainte", next: PLACEHOLDER_NEXT },
      {
        label: "Vous êtes convoqué(e) par la police",
        value: "convoque_police",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Vous êtes poursuivi(e) devant un tribunal",
        value: "poursuivi_tribunal",
        next: PLACEHOLDER_NEXT,
      },
    ],
  },

  // ──────────── STEP 3C : Clarification "je ne sais pas" ────────────
  {
    id: "step_3c",
    question: "Votre situation ressemble plutôt à :",
    options: [
      {
        label: "Une infraction ou un acte illégal (violence, vol, escroquerie, harcèlement…)",
        value: "infraction",
        chipLabel: "Infraction",
        next: "step_3b",
      },
      {
        label: "Une procédure avec la police ou un tribunal",
        value: "procedure_police",
        chipLabel: "Procédure police",
        next: "step_3b",
      },
      {
        label: "Un conflit ou un désaccord avec une personne",
        value: "conflit",
        chipLabel: "Conflit / désaccord",
        next: "step_3_opponent",
      },
    ],
  },

  // ──────────── STEP 3_OPPONENT : Type d'adversaire (vie perso) ────────────
  {
    id: "step_3_opponent",
    question: "Votre problème concerne :",
    options: [
      {
        label: "Un particulier (voisin, membre de la famille, bailleur ponctuel…)",
        value: "particulier",
        chipLabel: "vs Particulier",
        next: "step_doc",
      },
      {
        label: "Professionnel, entreprise, commerçant (société, agence locative, vendeur…)",
        value: "professionnel",
        chipLabel: "vs Professionnel",
        next: "step_doc",
      },
      {
        label: "Employeur",
        value: "employeur",
        chipLabel: "vs Employeur",
        next: "step_doc_emp",
      },
      { label: "Banque", value: "banque", next: PLACEHOLDER_NEXT },
      { label: "Assurance", value: "assurance", next: PLACEHOLDER_NEXT },
      { label: "Administration", value: "administration", next: PLACEHOLDER_NEXT },
    ],
  },

  // ──────────── STEP DOC : Document officiel ? (civil) ────────────
  {
    id: "step_doc",
    question:
      "Avez-vous déjà reçu un document officiel concernant votre problème ? (convocation, mise en demeure, courrier d'avocat, décision de justice…)",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Doc: oui", next: "step_doc_type" },
      { label: "NON", value: "non", chipLabel: "Doc: non", next: "step_4" },
    ],
  },

  // ──────────── STEP DOC EMP : Document officiel ? (employeur) ────────────
  {
    id: "step_doc_emp",
    question:
      "Avez-vous déjà reçu un document officiel concernant votre problème ? (convocation, mise en demeure, courrier d'avocat, décision de justice…)",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Doc: oui", next: "step_doc_type" },
      { label: "NON", value: "non", chipLabel: "Doc: non", next: "step_4_emploi" },
    ],
  },

  // ──────────── STEP DOC TYPE : Quel document ? (placeholder) ────────────
  {
    id: "step_doc_type",
    question: "Quel document avez-vous reçu ?",
    options: [
      { label: "Une mise en demeure", value: "mise_en_demeure", next: PLACEHOLDER_NEXT },
      {
        label: "Une convocation (police ou tribunal)",
        value: "convocation",
        next: PLACEHOLDER_NEXT,
      },
      { label: "Une assignation au tribunal", value: "assignation", next: PLACEHOLDER_NEXT },
      {
        label: "Une décision de justice ou ordonnance",
        value: "decision_justice",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Je ne sais pas",
        value: "ne_sais_pas",
        sublabel: "Nous vous recommandons de consulter un avocat",
        next: PLACEHOLDER_NEXT,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  //  CATÉGORIES DU LITIGE (vie perso, civil)
  // ══════════════════════════════════════════════════════════════

  // ──────────── STEP 4 : Catégorie du litige ────────────
  {
    id: "step_4",
    question: "Votre problème concerne :",
    options: [
      {
        label: "Un achat, une vente, un service qui s'est mal passé",
        sublabel: "objet acheté, prestation non réalisée, contrat non respecté…",
        value: "achat_vente_service",
        chipLabel: "Achat / vente",
        next: "step_5",
      },
      {
        label: "Un prêt d'argent ou une somme qui ne vous a pas été remboursée",
        value: "pret_argent",
        chipLabel: "Prêt / dette",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Un logement ou un bien immobilier",
        sublabel: "vente, location, caution…",
        value: "logement_immobilier",
        chipLabel: "Logement / immo",
        next: "step_4_immo",
      },
      {
        label: "Un dommage que vous avez subi",
        sublabel: "accident, dégradation, blessure…",
        value: "dommage",
        chipLabel: "Dommage subi",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Une situation familiale ou un héritage",
        sublabel: "divorce, garde d'enfant, héritage…",
        value: "famille_heritage",
        chipLabel: "Famille / héritage",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Un conflit de voisinage",
        sublabel: "nuisances, bruit, limite de terrain…",
        value: "voisinage",
        chipLabel: "Voisinage",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Une infraction ou un acte illégal",
        sublabel: "vol, diffamation, harcèlement…",
        value: "infraction_penale",
        chipLabel: "Infraction",
        next: "step_3b",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  //  BRANCHE : ACHAT / VENTE / SERVICE
  // ══════════════════════════════════════════════════════════════

  // ──────────── STEP 5 : Type de produit / service ────────────
  {
    id: "step_5",
    question: "Votre problème concerne :",
    options: [
      {
        label: "Un objet / un bien vendu ou acheté",
        value: "objet_bien",
        chipLabel: "Objet / bien",
        next: "step_6",
      },
      {
        label: "Une prestation ou service rendu",
        value: "prestation_service",
        chipLabel: "Prestation / service",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Un autre accord écrit ou verbal entre vous et cette personne",
        value: "autre_accord",
        chipLabel: "Autre accord",
        next: PLACEHOLDER_NEXT,
      },
    ],
  },

  // ──────────── STEP 6 : Type de mésentente ────────────
  {
    id: "step_6",
    question: "Votre problème concerne :",
    options: [
      {
        label: "Les informations données ou ce qui a été convenu au moment de l'accord",
        value: "informations_accord",
        chipLabel: "Infos / accord",
        next: "step_6a",
      },
      {
        label: "L'accord n'est pas respecté ou ne se déroule pas comme prévu",
        value: "accord_pas_respecte",
        chipLabel: "Accord non respecté",
        next: "step_6b",
      },
      {
        label: "L'annulation ou la remise en cause du contrat",
        value: "annulation_contrat",
        chipLabel: "Annulation",
        next: "step_6c",
      },
    ],
  },

  // ──────────── STEP 6A : Problèmes pré-accord (placeholder) ────────────
  {
    id: "step_6a",
    question: "Précisez :",
    options: [
      {
        label: "Je pense avoir été trompé(e) ou mal informé(e) lors de la vente",
        value: "trompe_vente",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Je pense avoir été trompé(e) ou mal informé(e) lors de l'achat",
        value: "trompe_achat",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Il y a une erreur sur le bien ou le prix",
        value: "erreur_bien_prix",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "La personne n'avait pas le droit de signer",
        value: "pas_droit_signer",
        next: PLACEHOLDER_NEXT,
      },
    ],
  },

  // ──────────── STEP 6B : Accord non respecté — détail ────────────
  {
    id: "step_6b",
    question: "Votre problème concerne :",
    contextLabel: "Hypothèse : L'accord n'est pas respecté ou ne se déroule pas comme prévu",
    options: [
      {
        label: "Je n'ai pas été payé(e)",
        value: "non_paye",
        chipLabel: "Non payé(e)",
        next: "step_7",
      },
      {
        label: "Je n'ai pas reçu le bien",
        value: "bien_non_recu",
        chipLabel: "Bien non reçu",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Le bien ne correspond pas à ce qui était prévu / présente des défauts",
        value: "bien_defaut",
        chipLabel: "Bien défectueux",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Il y a du retard dans la livraison du bien",
        value: "retard_livraison",
        chipLabel: "Retard livraison",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Le paiement est incomplet ou refusé",
        value: "paiement_incomplet",
        chipLabel: "Paiement incomplet",
        next: PLACEHOLDER_NEXT,
      },
    ],
  },

  // ──────────── STEP 6C : Annulation (placeholder) ────────────
  {
    id: "step_6c",
    question: "Précisez :",
    options: [
      { label: "L'autre partie veut annuler", value: "autre_veut_annuler", next: PLACEHOLDER_NEXT },
      { label: "Je veux annuler", value: "je_veux_annuler", next: PLACEHOLDER_NEXT },
      {
        label: "Nous ne sommes pas d'accord sur l'annulation",
        value: "desaccord_annulation",
        next: PLACEHOLDER_NEXT,
      },
      { label: "Le vendeur s'est rétracté", value: "vendeur_retracte", next: PLACEHOLDER_NEXT },
      { label: "L'acheteur s'est rétracté", value: "acheteur_retracte", next: PLACEHOLDER_NEXT },
    ],
  },

  // ──────────── STEP 7 : Montant ────────────
  {
    id: "step_7",
    contextLabel: "Hypothèse : Je n'ai pas été payé(e) = inexécution pour défaut de paiement",
    question: "Quel est le montant réclamé ?",
    options: [
      { label: "< 5 000€", value: "less_5000", chipLabel: "< 5 000€", next: "step_8" },
      { label: "> 5 000€", value: "more_5000", chipLabel: "> 5 000€", next: "step_8" },
    ],
  },

  // ──────────── STEP 8 : Mise en demeure ────────────
  {
    id: "step_8",
    question:
      "Avez-vous envoyé une relance de paiement par écrit (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "MED: oui", next: "step_9" },
      { label: "NON", value: "non", chipLabel: "MED: non", next: "step_9" },
    ],
  },

  // ──────────── STEP 9 : Récapitulatif ────────────
  {
    id: "step_9",
    question: "Récapitulatif de vos réponses",
    options: [],
  },

  // ══════════════════════════════════════════════════════════════
  //  BRANCHE : IMMOBILIER / LOGEMENT
  // ══════════════════════════════════════════════════════════════

  // ──────────── STEP 4_IMMO : Sous-catégorie immobilier ────────────
  {
    id: "step_4_immo",
    question: "Votre problème concerne :",
    options: [
      {
        label: "Une location de logement",
        value: "location",
        chipLabel: "Location",
        next: "step_4_immo_role",
      },
      {
        label: "Un achat ou une vente d'un bien immobilier",
        value: "achat_vente_immo",
        chipLabel: "Achat/vente immo",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Des travaux ou réparations d'un logement",
        value: "travaux",
        chipLabel: "Travaux",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Des problèmes de voisinage",
        sublabel: "Si vous êtes victime d'un cambriolage ou d'une intrusion, cliquer sur infraction ou acte illégal",
        value: "voisinage_immo",
        chipLabel: "Voisinage",
        next: PLACEHOLDER_NEXT,
      },
    ],
  },

  // ──────────── STEP 4_IMMO_ROLE : Locataire ou propriétaire ? ────────────
  {
    id: "step_4_immo_role",
    question: "Vous êtes :",
    options: [
      { label: "Locataire", value: "locataire", chipLabel: "Locataire", next: "step_4_loc" },
      { label: "Propriétaire", value: "proprietaire", chipLabel: "Propriétaire", next: "step_4_prop" },
    ],
  },

  // ──────────── STEP 4_LOC : Problèmes locataire ────────────
  {
    id: "step_4_loc",
    question: "Votre problème concerne :",
    options: [
      {
        label: "La restitution du dépôt de garantie (caution)",
        value: "depot_garantie",
        chipLabel: "Dépôt de garantie",
        next: "dg_edl",
      },
      {
        label: "Des réparations ou travaux facturés",
        value: "reparations_travaux",
        chipLabel: "Réparations",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Une augmentation ou révision du loyer",
        value: "augmentation_loyer",
        chipLabel: "Hausse loyer",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Des loyers impayés",
        value: "loyers_impayes",
        chipLabel: "Loyers impayés",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "L'état du logement (insalubrité…)",
        value: "etat_logement",
        chipLabel: "État logement",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Menace d'expulsion ou demande de quitter le logement",
        value: "expulsion",
        chipLabel: "Expulsion",
        next: PLACEHOLDER_NEXT,
      },
    ],
  },

  // ──────────── STEP 4_PROP : Problèmes propriétaire (placeholder) ────────────
  {
    id: "step_4_prop",
    question: "Votre problème concerne :",
    options: [
      { label: "Loyers impayés", value: "loyers_impayes", next: PLACEHOLDER_NEXT },
      { label: "Dégradations du logement", value: "degradations", next: PLACEHOLDER_NEXT },
      { label: "Refus de quitter le logement", value: "refus_quitter", next: PLACEHOLDER_NEXT },
      { label: "Charges impayées", value: "charges_impayees", next: PLACEHOLDER_NEXT },
      {
        label: "Contestation de retenue sur dépôt de garantie (caution)",
        value: "contestation_retenue",
        next: PLACEHOLDER_NEXT,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  //  BRANCHE : EMPLOYEUR (droit du travail)
  // ══════════════════════════════════════════════════════════════

  // ──────────── STEP 4_EMPLOI : Catégorie emploi ────────────
  {
    id: "step_4_emploi",
    question: "Votre problème concerne :",
    options: [
      {
        label: "Une rupture de votre contrat de travail",
        sublabel: "licenciement, rupture conventionnelle, démission, fin de CDD…",
        value: "rupture_contrat",
        chipLabel: "Rupture contrat",
        next: PLACEHOLDER_NEXT, // → Batch 3 : sous-arbre licenciement + fiches 87-88
      },
      {
        label: "Votre contrat de travail ou embauche",
        sublabel: "promesse d'embauche, période d'essai, requalification du contrat, contrat non signé…",
        value: "contrat_embauche",
        chipLabel: "Contrat / embauche",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Votre salaire ou une autre somme impayée",
        sublabel: "salaire, heure supplémentaire, prime, indemnité de licenciement, congé payé…",
        value: "salaire_impaye",
        chipLabel: "Salaire impayé",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Vos conditions de travail ou un conflit avec l'employeur",
        sublabel: "harcèlement, conditions de travail dégradées…",
        value: "conditions_travail",
        chipLabel: "Conditions travail",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Un accident du travail ou une maladie professionnelle",
        value: "accident_travail",
        chipLabel: "Accident travail",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Une discrimination au travail",
        sublabel: "sexe, grossesse, handicap…",
        value: "discrimination",
        chipLabel: "Discrimination",
        next: PLACEHOLDER_NEXT,
      },
      {
        label: "Une sanction disciplinaire",
        sublabel: "avertissement, mise à pied…",
        value: "sanction",
        chipLabel: "Sanction",
        next: PLACEHOLDER_NEXT,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  //  BRANCHE : DÉPÔT DE GARANTIE (vs Particulier)
  //  Entrée : step_4_loc → depot_garantie → dg_edl
  // ══════════════════════════════════════════════════════════════

  // ──────────── DG: État des lieux de sortie ? ────────────
  {
    id: "dg_edl",
    question: "Un état des lieux de sortie a-t-il été réalisé ?",
    options: [
      {
        label: "Oui, avec ma signature et celle du propriétaire",
        value: "signe",
        chipLabel: "EDL signé",
        next: "dg_c1_degradations",
      },
      {
        label: "Oui, mais je n'ai pas signé (je conteste les informations indiquées sur l'état des lieux)",
        value: "pas_signe",
        chipLabel: "EDL non signé",
        next: "dg_c2_contestation",
      },
      {
        label: "Non",
        value: "pas_realise",
        chipLabel: "Pas d'EDL",
        next: "dg_c3_raison",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  //  CHOIX 1 : EDL SIGNÉ
  // ══════════════════════════════════════════════════════════════

  {
    id: "dg_c1_degradations",
    question: "L'état des lieux de sortie mentionne-t-il des dégradations par rapport à l'état des lieux d'entrée ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Dégradations oui", next: "dg_c1_d_delai" },
      { label: "NON", sublabel: "L'état des lieux est conforme", value: "non", chipLabel: "EDL conforme", next: "dg_c1_c_delai" },
    ],
  },

  // ── Dégradations OUI → Délai ──
  {
    id: "dg_c1_d_delai",
    question: "Depuis combien de temps avez-vous rendu les clés ?",
    options: [
      { label: "Moins de 2 mois", value: "moins_2_mois", chipLabel: "< 2 mois", next: "dg_info_2mois" },
      { label: "Plus de 2 mois", value: "plus_2_mois", chipLabel: "> 2 mois", next: "dg_c1_d_raison" },
    ],
  },

  // ── Conforme → Délai ──
  {
    id: "dg_c1_c_delai",
    question: "Depuis combien de temps avez-vous rendu les clés ?",
    options: [
      { label: "Moins d'un mois", value: "moins_1_mois", chipLabel: "< 1 mois", next: "dg_info_1mois" },
      { label: "Plus d'un mois", value: "plus_1_mois", chipLabel: "> 1 mois", next: "dg_c1_c_raison" },
    ],
  },

  // ── Info pages (délai pas dépassé) ──
  {
    id: "dg_info_2mois",
    question: "Le propriétaire dispose d'un délai de 2 mois pour restituer le dépôt de garantie lorsque des dégradations sont mentionnées dans l'état des lieux de sortie (article 22 de la loi du 6 juillet 1989).",
    helpText: "Ce délai n'est pas encore dépassé. Si le propriétaire ne restitue pas le dépôt après ce délai, revenez compléter le questionnaire.",
    options: [],
  },
  {
    id: "dg_info_1mois",
    question: "Le propriétaire dispose d'un délai d'un mois après la remise des clés pour restituer le dépôt de garantie lorsque l'état des lieux de sortie est conforme à celui d'entrée (article 22 de la loi du 6 juillet 1989).",
    helpText: "Ce délai n'est pas encore dépassé. Si le propriétaire ne restitue pas le dépôt après ce délai, revenez compléter le questionnaire.",
    options: [],
  },

  // ── Dégradations OUI, > 2 mois → Raison du proprio ──
  {
    id: "dg_c1_d_raison",
    question: "Le propriétaire a-t-il expliqué pourquoi il ne restitue pas le dépôt de garantie ?",
    options: [
      { label: "Dégradation du logement", value: "degradation", chipLabel: "Dégradation", next: "dg_c1_d_deg_justif" },
      { label: "Loyers ou charges impayés", value: "loyers_impayes", chipLabel: "Loyers impayés", next: "dg_c1_d_loy_impayes" },
      { label: "Aucune explication", value: "aucune", chipLabel: "Aucune explication", next: "dg_c1_d_auc_dem" },
    ],
  },

  // ── Conforme, > 1 mois → Raison du proprio ──
  {
    id: "dg_c1_c_raison",
    question: "Le propriétaire a-t-il expliqué pourquoi il ne restitue pas le dépôt de garantie ?",
    options: [
      { label: "Dégradation du logement", value: "degradation", chipLabel: "Dégradation", next: "dg_c1_c_deg_justif" },
      { label: "Loyers ou charges impayés", value: "loyers_impayes", chipLabel: "Loyers impayés", next: "dg_c1_c_loy_impayes" },
      { label: "Aucune explication", value: "aucune", chipLabel: "Aucune explication", next: "dg_c1_c_auc_dem" },
    ],
  },

  // ━━━━━━━━━━━━ CHOIX 1 / DÉG / DÉGRADATION ━━━━━━━━━━━━

  {
    id: "dg_c1_d_deg_justif",
    question: "Le propriétaire a-t-il fourni des justifications (facture, devis…) ?",
    options: [
      { label: "OUI", value: "oui", next: "dg_c1_d_deg_conteste" },
      { label: "NON", value: "non", next: "dg_c1_d_deg_nojust_dem" },
    ],
  },
  {
    id: "dg_c1_d_deg_conteste",
    question: "Contestez-vous ces justifications ?",
    helpText: "Si non, la retenue est considérée comme justifiée.",
    options: [
      { label: "OUI", value: "oui", next: "dg_c1_d_deg_cont_dem" },
      { label: "NON", value: "non", next: SUMMARY_STEP_ID }, // → F5
    ],
  },
  {
    id: "dg_c1_d_deg_cont_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F6
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F7
    ],
  },
  {
    id: "dg_c1_d_deg_nojust_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F8
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F9
    ],
  },

  // ━━━━━━━━━━━━ CHOIX 1 / DÉG / LOYERS IMPAYÉS ━━━━━━━━━━━━

  {
    id: "dg_c1_d_loy_impayes",
    question: "Des loyers ou charges restaient-ils impayés au moment de votre départ ?",
    options: [
      { label: "OUI", value: "oui", next: "dg_c1_d_loy_montant" },
      { label: "NON", value: "non", next: "dg_c1_d_loy_non_dem" },
    ],
  },
  {
    id: "dg_c1_d_loy_montant",
    question: "Le montant retenu par le propriétaire est-il proportionné aux loyers ou charges impayés ?",
    helpText: "Le propriétaire retient-il plus que ce qui lui est dû ?",
    options: [
      { label: "OUI (proportionné)", value: "oui", chipLabel: "Proportionné", next: SUMMARY_STEP_ID }, // → F14
      { label: "NON (il retient plus que ce qui est dû)", value: "non", chipLabel: "Disproportionné", next: "dg_c1_d_loy_disp_dem" },
    ],
  },
  {
    id: "dg_c1_d_loy_disp_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F15
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F16
    ],
  },
  {
    id: "dg_c1_d_loy_non_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F17
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F18
    ],
  },

  // ━━━━━━━━━━━━ CHOIX 1 / DÉG / AUCUNE EXPLICATION ━━━━━━━━━━━━

  {
    id: "dg_c1_d_auc_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F24
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F25
    ],
  },

  // ━━━━━━━━━━━━ CHOIX 1 / CONFORME / DÉGRADATION ━━━━━━━━━━━━

  {
    id: "dg_c1_c_deg_justif",
    question: "Le propriétaire a-t-il fourni des justifications (facture, devis…) ?",
    options: [
      { label: "OUI", value: "oui", next: "dg_c1_c_deg_oui_dem" },
      { label: "NON", value: "non", next: "dg_c1_c_deg_non_dem" },
    ],
  },
  {
    id: "dg_c1_c_deg_oui_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F10
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F11
    ],
  },
  {
    id: "dg_c1_c_deg_non_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F12
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F13
    ],
  },

  // ━━━━━━━━━━━━ CHOIX 1 / CONFORME / LOYERS IMPAYÉS ━━━━━━━━━━━━

  {
    id: "dg_c1_c_loy_impayes",
    question: "Des loyers ou charges restaient-ils impayés au moment de votre départ ?",
    options: [
      { label: "OUI", value: "oui", next: "dg_c1_c_loy_montant" },
      { label: "NON", value: "non", next: "dg_c1_c_loy_non_dem" },
    ],
  },
  {
    id: "dg_c1_c_loy_montant",
    question: "Le montant retenu par le propriétaire est-il proportionné aux loyers ou charges impayés ?",
    options: [
      { label: "OUI (proportionné)", value: "oui", chipLabel: "Proportionné", next: SUMMARY_STEP_ID }, // → F19
      { label: "NON (il retient plus que ce qui est dû)", value: "non", chipLabel: "Disproportionné", next: "dg_c1_c_loy_disp_dem" },
    ],
  },
  {
    id: "dg_c1_c_loy_disp_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F20
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F21
    ],
  },
  {
    id: "dg_c1_c_loy_non_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F22
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F23
    ],
  },

  // ━━━━━━━━━━━━ CHOIX 1 / CONFORME / AUCUNE EXPLICATION ━━━━━━━━━━━━

  {
    id: "dg_c1_c_auc_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F26
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F27
    ],
  },

  // ══════════════════════════════════════════════════════════════
  //  CHOIX 2 : EDL FAIT MAIS PAS SIGNÉ (je conteste)
  // ══════════════════════════════════════════════════════════════

  {
    id: "dg_c2_contestation",
    question: "Que contestez-vous ?",
    options: [
      { label: "Les dégradations", value: "degradation", chipLabel: "Dégradations", next: "dg_c2_deg_delai" },
      { label: "Le montant des réparations demandées", value: "montant_reparations", chipLabel: "Montant réparations", next: "dg_c2_mont_delai" },
      { label: "Les deux", value: "les_deux", chipLabel: "Les deux", next: "dg_c2_deux_delai" },
    ],
  },

  // ━━━━━━━━━━━━ CHOIX 2 / DÉGRADATIONS ━━━━━━━━━━━━

  {
    id: "dg_c2_deg_delai",
    question: "Depuis combien de temps avez-vous rendu les clés ?",
    options: [
      { label: "Moins de 2 mois", value: "moins_2_mois", chipLabel: "< 2 mois", next: SUMMARY_STEP_ID }, // → F28
      { label: "Plus de 2 mois", value: "plus_2_mois", chipLabel: "> 2 mois", next: "dg_c2_deg_justif" },
    ],
  },
  {
    id: "dg_c2_deg_justif",
    question: "Le propriétaire a-t-il fourni des justifications (facture, devis…) ?",
    options: [
      { label: "OUI", value: "oui", next: "dg_c2_deg_oui_dem" },
      { label: "NON", value: "non", next: "dg_c2_deg_non_dem" },
    ],
  },
  {
    id: "dg_c2_deg_oui_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F29
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F30
    ],
  },
  {
    id: "dg_c2_deg_non_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F31
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F32
    ],
  },

  // ━━━━━━━━━━━━ CHOIX 2 / MONTANT RÉPARATIONS ━━━━━━━━━━━━

  {
    id: "dg_c2_mont_delai",
    question: "Depuis combien de temps avez-vous rendu les clés ?",
    options: [
      { label: "Moins de 2 mois", value: "moins_2_mois", chipLabel: "< 2 mois", next: SUMMARY_STEP_ID }, // → F33
      { label: "Plus de 2 mois", value: "plus_2_mois", chipLabel: "> 2 mois", next: "dg_c2_mont_justif" },
    ],
  },
  {
    id: "dg_c2_mont_justif",
    question: "Le propriétaire a-t-il fourni des justifications (facture, devis…) ?",
    options: [
      { label: "OUI", value: "oui", next: "dg_c2_mont_oui_dem" },
      { label: "NON", value: "non", next: "dg_c2_mont_non_dem" },
    ],
  },
  {
    id: "dg_c2_mont_oui_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F34
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F35
    ],
  },
  {
    id: "dg_c2_mont_non_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F36
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F37
    ],
  },

  // ━━━━━━━━━━━━ CHOIX 2 / LES DEUX ━━━━━━━━━━━━

  {
    id: "dg_c2_deux_delai",
    question: "Depuis combien de temps avez-vous rendu les clés ?",
    options: [
      { label: "Moins de 2 mois", value: "moins_2_mois", chipLabel: "< 2 mois", next: SUMMARY_STEP_ID }, // → F38
      { label: "Plus de 2 mois", value: "plus_2_mois", chipLabel: "> 2 mois", next: "dg_c2_deux_justif" },
    ],
  },
  {
    id: "dg_c2_deux_justif",
    question: "Le propriétaire a-t-il fourni des justifications (facture, devis…) ?",
    options: [
      { label: "OUI", value: "oui", next: "dg_c2_deux_oui_dem" },
      { label: "NON", value: "non", next: "dg_c2_deux_non_dem" },
    ],
  },
  {
    id: "dg_c2_deux_oui_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F39
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F40
    ],
  },
  {
    id: "dg_c2_deux_non_dem",
    question: "Une demande de restitution du dépôt a-t-elle été faite (mise en demeure amiable) ?",
    options: [
      { label: "OUI", value: "oui", chipLabel: "Demande: oui", next: SUMMARY_STEP_ID }, // → F41
      { label: "NON", value: "non", chipLabel: "Demande: non", next: SUMMARY_STEP_ID }, // → F42
    ],
  },

  // ══════════════════════════════════════════════════════════════
  //  CHOIX 3 : PAS D'ÉTAT DES LIEUX RÉALISÉ
  // ══════════════════════════════════════════════════════════════

  {
    id: "dg_c3_raison",
    question: "Pourquoi l'état des lieux de sortie n'a-t-il pas été réalisé ?",
    options: [
      {
        label: "Le propriétaire ne s'est pas présenté / ne l'a pas proposé",
        value: "proprio_absent",
        chipLabel: "Proprio absent",
        next: SUMMARY_STEP_ID, // → F43
      },
      {
        label: "J'étais absent(e)",
        value: "locataire_absent",
        chipLabel: "Locataire absent",
        next: SUMMARY_STEP_ID, // → F44
      },
      {
        label: "Nous n'avons pas pu nous mettre d'accord",
        value: "desaccord",
        chipLabel: "Désaccord",
        next: SUMMARY_STEP_ID, // → F45
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
//  LOOKUP HELPERS
// ═══════════════════════════════════════════════════════════════

const stepById = new Map(WIZARD_STEPS.map((s) => [s.id, s]));

export function getStep(id: string): WizardStep | undefined {
  return stepById.get(id);
}

export function getFirstStepId(): string {
  return "step_1";
}
