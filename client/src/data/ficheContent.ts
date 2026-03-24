/**
 * Structured content for resolution fiches.
 * Fiche 1-4: contrat vente non payé (selected by amount + mise en demeure).
 *
 * Content updated from Retours Juridique PDF (March 2026).
 */

export interface FicheLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FicheStepBlock {
  paragraphs?: string[];
  link?: FicheLink;
  note?: string;
  bullets?: string[];
}

export interface FicheStep {
  title: string;
  blocks: FicheStepBlock[];
}

export interface FicheContent {
  header: string;
  intro: string;
  /** "Rappel du cadre légal" section shown before the steps */
  cadreLegal?: {
    paragraphs: string[];
    bullets?: string[];
    reference?: string;
  };
  steps: FicheStep[];
  ctaPractitionersHref: string;
}

// ═══════════════════════════════════════════════════════════════
//  SHARED BLOCKS (reused across fiches)
// ═══════════════════════════════════════════════════════════════

const CADRE_LEGAL_VENTE = {
  paragraphs: [
    "La vente d'un bien, y compris entre particuliers, constitue un **contrat de vente**.",
    "Dans ce contrat :",
  ],
  bullets: [
    "le vendeur doit délivrer le bien vendu",
    "l'acheteur doit en payer le prix",
  ],
  reference: "Article 1582 et 1650 du code civil",
};

const MISE_EN_DEMEURE_BLOCK: FicheStepBlock = {
  paragraphs: [
    "C'est quoi ? Une lettre envoyée avec accusé de réception pour demander le paiement",
    "Préalable nécessaire avant toute action en justice",
    "Étape qui peut parfois suffire à résoudre le problème",
  ],
  link: {
    label: "J'ai besoin d'aide pour la mise en demeure",
    href: "#",
    external: false,
  },
  note: "Lien vers une fiche récap sur les mentions obligatoires de la mise en demeure.",
};

const CONCILIATION_MEDIATION_OBLIGATOIRE: FicheStepBlock = {
  paragraphs: [
    "Avant de saisir un juge, il existe 2 démarches amiables *(article 750-1 du Code de procédure civile)* :",
    "**Conciliation :**",
  ],
  bullets: [
    "Rapide, gratuite, confidentielle",
    "Prise de rendez-vous dans un tribunal judiciaire, en mairie, ou en ligne, sur le site conciliateurs.fr",
  ],
};

const MEDIATION_BLOCK: FicheStepBlock = {
  paragraphs: ["**Médiation :**"],
  bullets: [
    "Payant",
    "Obligatoire en cas de clause de médiation prévue au contrat",
    "Liste des médiateurs dans l'annuaire des sites de cours d'appel",
    "Contact courrier ou sur leur site internet",
  ],
};

const SAISINE_DIRECTE: FicheStepBlock = {
  paragraphs: [
    "Saisir directement le juge est possible (sans conciliation ou médiation) uniquement si :",
  ],
  bullets: [
    "Il y a urgence",
    "Les circonstances rendent impossible une tentative de conciliation ou médiation",
    "Le conciliateur ou médiateur est indisponible dans un délai de 3 mois",
  ],
};

const PETITES_CREANCES: FicheStepBlock = {
  paragraphs: [
    "Si les démarches amiables échouent et que la dette est claire (montant précis, vente prouvée, paiement dû), une procédure simplifiée est possible :",
    "Un commissaire de justice est désigné dans le ressort du tribunal judiciaire du lieu où habite celui qui doit l'argent.",
  ],
  link: {
    label: "Où s'adresser : commissaire-justice.fr",
    href: "https://www.commissaire-justice.fr",
    external: true,
  },
};

const PETITES_CREANCES_SUITE: FicheStepBlock = {
  paragraphs: [
    "Le commissaire invitera la personne devant de l'argent à participer à la procédure.",
    "Si elle refuse ou ne répond pas dans le mois, une action devant le juge devient possible.",
    "Coût approximatif : 45€ + frais de recouvrement.",
  ],
};

const ACTION_JUGE_5ANS: FicheStepBlock = {
  paragraphs: [
    "**Rappel des délais de prescription :**",
    "L'action peut être engagée jusqu'à **5 ans** après la date à laquelle le paiement était dû *(article 2224 du code civil)*.",
    "**Précision :** Pour un achat à un particulier via une plateforme en ligne, la plateforme est seulement un intermédiaire. L'action doit être dirigée contre le particulier qui n'a pas payé.",
  ],
};

const ACTION_JUGE_5ANS_AVOCAT: FicheStepBlock = {
  paragraphs: [
    "**Rappel des délais de prescription :**",
    "L'action peut être engagée jusqu'à **5 ans** après la date à laquelle le paiement était dû *(article 2224 du code civil)*.",
    "**Précision :** Pour un achat à un particulier via une plateforme en ligne, la plateforme est seulement un intermédiaire. L'action doit être dirigée contre le particulier qui n'a pas payé.",
    "**L'avocat est obligatoire** pour les litiges dont le montant est > 10 000 €.",
  ],
};

const CONCILIATION_NON_OBLIGATOIRE: FicheStepBlock = {
  paragraphs: [
    "**La conciliation et la médiation ne sont pas obligatoires** (le montant étant > 5 000€).",
    "Rappel si besoin :",
    "**Conciliation :**",
  ],
  bullets: [
    "Rapide, gratuite, confidentielle",
    "Prise de rendez-vous dans un tribunal judiciaire, en mairie, ou en ligne, sur le site conciliateurs.fr",
  ],
};

const INJONCTION_PAYER: FicheStepBlock = {
  paragraphs: [
    "**Conditions :**",
  ],
  bullets: [
    "La somme doit être précise (facture impayée, montant exact à réclamer…)",
    "Il doit exister un contrat qui justifie le paiement",
  ],
};

const INJONCTION_PROCEDURE: FicheStepBlock = {
  paragraphs: ["**Comment procéder :**"],
  bullets: [
    "Envoyer une demande écrite au greffe du tribunal judiciaire du lieu de résidence de la personne qui doit l'argent",
    "Utiliser le formulaire Cerfa n°12948",
    "Indiquer le montant réclamé et l'origine du litige",
  ],
};

const INJONCTION_A_SAVOIR: FicheStepBlock = {
  paragraphs: [
    "**À savoir :**",
    "La demande est gratuite. Des honoraires peuvent être dus si un avocat assiste.",
    "**Après décision du juge :**",
  ],
  bullets: [
    "Si l'ordonnance d'injonction est accordée : un commissaire de justice transmet la décision à la personne concernée",
    "Si la demande est refusée : la procédure classique (contentieuse) doit être suivie",
  ],
};

// ═══════════════════════════════════════════════════════════════
//  FICHES 1-4 : CONTRAT VENTE NON PAYÉ
// ═══════════════════════════════════════════════════════════════

/** Fiche 1: < 5 000€, sans mise en demeure */
export const FICHE_1: FicheContent = {
  header:
    "Inexécution du contrat pour défaut de paiement d'un montant < 5 000€ sans mise en demeure amiable",
  intro:
    "Au vu des éléments transmis, le problème concerne un paiement non effectué pour un contrat de vente, d'un montant inférieur à 5 000€, sans relance de paiement.",
  cadreLegal: CADRE_LEGAL_VENTE,
  ctaPractitionersHref: "/practitioners?specialty=Droit%20civil",
  steps: [
    {
      title: "1/ Une mise en demeure amiable",
      blocks: [MISE_EN_DEMEURE_BLOCK],
    },
    {
      title: "2/ Une tentative de conciliation ou de médiation",
      blocks: [CONCILIATION_MEDIATION_OBLIGATOIRE, MEDIATION_BLOCK, SAISINE_DIRECTE],
    },
    {
      title: "3/ Une procédure simplifiée de recouvrement des petites créances",
      blocks: [PETITES_CREANCES, PETITES_CREANCES_SUITE],
    },
    {
      title: "4/ Action devant un juge",
      blocks: [ACTION_JUGE_5ANS],
    },
  ],
};

/** Fiche 2: < 5 000€, avec mise en demeure */
export const FICHE_2: FicheContent = {
  header:
    "Inexécution du contrat pour défaut de paiement d'un montant < 5 000€ avec mise en demeure amiable",
  intro:
    "Au vu des éléments transmis, le litige concerne un paiement non effectué pour un contrat de vente, d'un montant inférieur à 5 000€, avec une relance de paiement (mise en demeure amiable).",
  cadreLegal: CADRE_LEGAL_VENTE,
  ctaPractitionersHref: "/practitioners?specialty=Droit%20civil",
  steps: [
    {
      title: "1/ Une tentative de conciliation ou de médiation",
      blocks: [CONCILIATION_MEDIATION_OBLIGATOIRE, MEDIATION_BLOCK, SAISINE_DIRECTE],
    },
    {
      title: "3/ Une procédure simplifiée de recouvrement des petites créances",
      blocks: [PETITES_CREANCES, PETITES_CREANCES_SUITE],
    },
    {
      title: "4/ Action devant un juge",
      blocks: [ACTION_JUGE_5ANS],
    },
  ],
};

/** Fiche 3: > 5 000€, sans mise en demeure */
export const FICHE_3: FicheContent = {
  header:
    "Inexécution du contrat pour défaut de paiement d'un montant > 5 000€ sans mise en demeure amiable",
  intro:
    "Au vu des éléments transmis, le litige concerne un paiement non effectué pour un contrat de vente, d'un montant supérieur à 5 000€, sans relance de paiement.",
  cadreLegal: CADRE_LEGAL_VENTE,
  ctaPractitionersHref: "/practitioners?specialty=Droit%20civil",
  steps: [
    {
      title: "1/ Une mise en demeure amiable",
      blocks: [MISE_EN_DEMEURE_BLOCK],
    },
    {
      title: "1.2/ La conciliation et la médiation ne sont pas obligatoires",
      blocks: [CONCILIATION_NON_OBLIGATOIRE, MEDIATION_BLOCK],
    },
    {
      title: "2/ Une injonction de payer (article 1405 du code de procédure civile)",
      blocks: [INJONCTION_PAYER, INJONCTION_PROCEDURE, INJONCTION_A_SAVOIR],
    },
    {
      title: "3/ Action devant un juge",
      blocks: [ACTION_JUGE_5ANS_AVOCAT],
    },
  ],
};

/** Fiche 4: > 5 000€, avec mise en demeure */
export const FICHE_4: FicheContent = {
  header:
    "Inexécution du contrat pour défaut de paiement d'un montant > 5 000€ avec mise en demeure amiable",
  intro:
    "Au vu des éléments transmis, le litige concerne un paiement non effectué pour un contrat de vente, d'un montant supérieur à 5 000€, avec relance de paiement.",
  cadreLegal: CADRE_LEGAL_VENTE,
  ctaPractitionersHref: "/practitioners?specialty=Droit%20civil",
  steps: [
    {
      title: "1/ La conciliation et la médiation ne sont pas obligatoires",
      blocks: [CONCILIATION_NON_OBLIGATOIRE, MEDIATION_BLOCK],
    },
    {
      title: "1.2/ Une injonction de payer (article 1405 du code de procédure civile)",
      blocks: [INJONCTION_PAYER, INJONCTION_PROCEDURE, INJONCTION_A_SAVOIR],
    },
    {
      title: "2/ Action devant un juge",
      blocks: [ACTION_JUGE_5ANS_AVOCAT],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  FICHE LOOKUP
// ═══════════════════════════════════════════════════════════════

const FICHES_MAP = {
  "1": FICHE_1,
  "2": FICHE_2,
  "3": FICHE_3,
  "4": FICHE_4,
} as const;

/**
 * Returns fiche 1-4 based on amount + miseEnDemeure.
 * Fiche 1: <5k, no MED. Fiche 2: <5k, MED. Fiche 3: >5k, no MED. Fiche 4: >5k, MED.
 */
export function getFicheForAnswers(
  amount: "less_5000" | "more_5000",
  miseEnDemeure: boolean
): FicheContent {
  const key =
    amount === "less_5000" ? (miseEnDemeure ? "2" : "1") : miseEnDemeure ? "4" : "3";
  return FICHES_MAP[key];
}

// ═══════════════════════════════════════════════════════════════
//  FICHES 5-45 : DÉPÔT DE GARANTIE (vs Particulier)
//  Selection logic based on wizard answers
// ═══════════════════════════════════════════════════════════════

interface DGAnswers {
  dgEtatDesLieux?: "signe" | "pas_signe" | "pas_realise";
  dgDegradations?: boolean;
  dgDelaiCles?: string;
  dgRaisonProprio?: "degradation" | "loyers_impayes" | "aucune";
  dgJustifications?: boolean;
  dgContesteJustif?: boolean;
  dgDemandeRestitution?: boolean;
  dgLoyersImpayes?: boolean;
  dgMontantProportionne?: boolean;
  dgContestation?: "degradation" | "montant_reparations" | "les_deux";
  dgAbsenceRaison?: "proprio_absent" | "locataire_absent" | "desaccord";
  [key: string]: unknown;
}

/**
 * Determines the fiche number (5-45) based on depot garantie answers.
 * Returns null if answers are incomplete or lead to an info page.
 */
export function getDepotGarantieFicheNumber(a: DGAnswers): number | null {
  const edl = a.dgEtatDesLieux;

  // ── CHOIX 3 : Pas d'état des lieux ──
  if (edl === "pas_realise") {
    if (a.dgAbsenceRaison === "proprio_absent") return 43;
    if (a.dgAbsenceRaison === "locataire_absent") return 44;
    if (a.dgAbsenceRaison === "desaccord") return 45;
    return null;
  }

  // ── CHOIX 2 : EDL non signé (contesté) ──
  if (edl === "pas_signe") {
    const cont = a.dgContestation;
    const delai = a.dgDelaiCles;
    const justif = a.dgJustifications;
    const dem = a.dgDemandeRestitution;

    // Info pages si délai pas dépassé
    if (cont === "degradation" && delai === "moins_2_mois") return 28;
    if (cont === "montant_reparations" && delai === "moins_2_mois") return 33;
    if (cont === "les_deux" && delai === "moins_2_mois") return 38;

    if (cont === "degradation") {
      if (justif === true)  return dem === true ? 29 : 30;
      if (justif === false) return dem === true ? 31 : 32;
    }
    if (cont === "montant_reparations") {
      if (justif === true)  return dem === true ? 34 : 35;
      if (justif === false) return dem === true ? 36 : 37;
    }
    if (cont === "les_deux") {
      if (justif === true)  return dem === true ? 39 : 40;
      if (justif === false) return dem === true ? 41 : 42;
    }
    return null;
  }

  // ── CHOIX 1 : EDL signé ──
  if (edl === "signe") {
    const deg = a.dgDegradations;
    const raison = a.dgRaisonProprio;
    const justif = a.dgJustifications;
    const conteste = a.dgContesteJustif;
    const dem = a.dgDemandeRestitution;
    const loyImp = a.dgLoyersImpayes;
    const montProp = a.dgMontantProportionne;

    // ── Branche dégradations OUI (délai 2 mois) ──
    if (deg === true) {
      if (raison === "degradation") {
        if (justif === true && conteste === false) return 5;
        if (justif === true && conteste === true)  return dem === true ? 6 : 7;
        if (justif === false) return dem === true ? 8 : 9;
      }
      if (raison === "loyers_impayes") {
        if (loyImp === true) {
          if (montProp === true) return 14;
          if (montProp === false) return dem === true ? 15 : 16;
        }
        if (loyImp === false) return dem === true ? 17 : 18;
      }
      if (raison === "aucune") return dem === true ? 24 : 25;
    }

    // ── Branche conforme (délai 1 mois) ──
    if (deg === false) {
      if (raison === "degradation") {
        if (justif === true)  return dem === true ? 10 : 11;
        if (justif === false) return dem === true ? 12 : 13;
      }
      if (raison === "loyers_impayes") {
        if (loyImp === true) {
          if (montProp === true) return 19;
          if (montProp === false) return dem === true ? 20 : 21;
        }
        if (loyImp === false) return dem === true ? 22 : 23;
      }
      if (raison === "aucune") return dem === true ? 26 : 27;
    }
  }

  return null;
}

/**
 * Generates a placeholder fiche for a given depot garantie fiche number.
 * In Batch 2b/2c, these will be replaced with real content from the PDF.
 */
function makeDGPlaceholderFiche(ficheNum: number): FicheContent {
  // Info-only fiches (délai pas dépassé)
  const INFO_FICHES = [28, 33, 38];
  const isInfo = INFO_FICHES.includes(ficheNum);

  return {
    header: isInfo
      ? `Information — Fiche ${ficheNum}`
      : `Absence de restitution du dépôt de garantie — Fiche ${ficheNum}`,
    intro: isInfo
      ? "Le délai légal de restitution du dépôt de garantie n'est pas encore dépassé. Conservez ce dossier et revenez si le propriétaire ne restitue pas le dépôt dans le délai imparti."
      : `Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire. Le contenu détaillé de cette fiche sera bientôt disponible.`,
    cadreLegal: {
      paragraphs: [
        "Le propriétaire doit restituer le dépôt de garantie dans un délai de **1 mois** (état des lieux conforme) ou **2 mois** (dégradations mentionnées) après la remise des clés.",
        "En cas de retenue, celle-ci doit être justifiée par des éléments factuels (état des lieux, devis, factures).",
        "Majoration de 10% du loyer mensuel hors charges, par mois entamé de retard.",
      ],
      reference: "Article 22 de la loi n° 89-462 du 6 juillet 1989 tendant à améliorer les rapports locatifs",
    },
    ctaPractitionersHref: "/practitioners?specialty=Droit%20immobilier",
    steps: isInfo
      ? []
      : [
          {
            title: "Étapes de résolution",
            blocks: [
              {
                paragraphs: [
                  "Le contenu complet de cette fiche (étapes de résolution, conciliation, injonction de payer, action devant le juge) sera disponible prochainement.",
                  "En attendant, vous pouvez consulter un avocat spécialisé en droit immobilier.",
                ],
              },
            ],
          },
        ],
  };
}

// Cache for DG placeholder fiches
const DG_FICHE_CACHE = new Map<number, FicheContent>();

/**
 * Get a depot garantie fiche by number (5-45).
 * Returns placeholder content for now; will be replaced with real content in Batch 2b/2c.
 */
export function getDepotGarantieFiche(ficheNum: number): FicheContent {
  if (!DG_FICHE_CACHE.has(ficheNum)) {
    DG_FICHE_CACHE.set(ficheNum, makeDGPlaceholderFiche(ficheNum));
  }
  return DG_FICHE_CACHE.get(ficheNum)!;
}
