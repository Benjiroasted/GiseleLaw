/**
 * Vice du consentement — branche "Je pense avoir été trompé(e) lors de la vente".
 * Fiches 128-143, transcrites depuis "Retours Juridique" (avril 2026).
 *
 * Deux régimes juridiques :
 *   - DOL (articles 1130 et 1137 du code civil) — fiches 128-140
 *   - GARANTIE DES VICES CACHÉS (articles 1641 à 1648 du code civil) — fiches 141-143
 *
 * ⚠️ Les fiches 141-143 (vice caché) n'étaient présentes dans la source que
 * sous forme de titres. Leur contenu a été rédigé à partir du régime légal
 * applicable et doit être relu par l'équipe juridique avant mise en production.
 */

import type { FicheContent, FicheStepBlock } from "./ficheContent";

const CTA_CIVIL = "/practitioners?specialty=Droit%20civil";

// ═══════════════════════════════════════════════════════════════
//  BLOCS PARTAGÉS — DOL
// ═══════════════════════════════════════════════════════════════

const DOL_CADRE_LEGAL = {
  paragraphs: [
    "Le fait d'avoir donné une fausse information ou d'avoir menti lors de la vente correspond à un **dol**.",
    "Un dol peut prendre plusieurs formes :",
  ],
  bullets: [
    "Mensonge",
    "Dissimulation volontaire d'une information importante",
    "Manœuvres",
  ],
  reference: "Articles 1130 et 1137 du code civil",
};

const DOL_CONDITIONS_STEP = {
  title: "Les conditions à réunir",
  blocks: [
    {
      paragraphs: ["Identifier des manœuvres, mensonges ou dissimulation d'informations :"],
      bullets: [
        "Exemples : mise en scène, affirmation fausse sur un élément du contrat, silence intentionnel sur une information cruciale…",
      ],
    },
    {
      paragraphs: ["Démontrer la **volonté de tromper**, et non une simple négligence."],
    },
    {
      paragraphs: ["La tromperie porte sur une **information déterminante** :"],
      bullets: [
        "L'information fausse doit avoir été décisive pour vendre",
        "La vente ne se serait pas réalisée, ou pas aux mêmes conditions, sans cette information",
      ],
    },
    {
      paragraphs: ["**Attention :**"],
      bullets: [
        "Une simple négligence ou exagération ne suffit pas",
        "Le dol doit provenir de l'acheteur ou d'un tiers complice",
      ],
    },
  ],
};

function medBlock(demande: string): FicheStepBlock {
  return {
    paragraphs: [
      `**C'est quoi ?** Une lettre envoyée avec accusé de réception pour demander ${demande}.`,
      "Préalable nécessaire avant toute action en justice.",
      "Cette étape peut parfois suffire à résoudre le problème.",
    ],
    link: {
      label: "J'ai besoin d'aide pour la mise en demeure",
      href: "#",
      external: false,
    },
  };
}

const CONCILIATION_BLOCK: FicheStepBlock = {
  paragraphs: [
    "Avant de saisir un juge, il existe 2 démarches amiables — article 750-1 du Code de procédure civile :",
    "**Conciliation :**",
  ],
  bullets: [
    "Rapide, gratuite, confidentielle",
    "Prise de rendez-vous dans un tribunal judiciaire, en mairie, ou en ligne, sur le site conciliateurs.fr",
    "Possibilité de saisir directement la commission départementale de conciliation",
  ],
};

const MEDIATION_BLOCK: FicheStepBlock = {
  paragraphs: ["**Médiation :**"],
  bullets: [
    "Payante",
    "Obligatoire en cas de clause de médiation prévue au contrat",
    "Liste des médiateurs dans l'annuaire des sites de cours d'appel",
    "Contact par courrier ou sur leur site internet",
  ],
};

const SAISINE_DIRECTE_BLOCK: FicheStepBlock = {
  paragraphs: ["Saisir directement le juge est possible (sans conciliation ou médiation) uniquement si :"],
  bullets: [
    "Il y a urgence",
    "Les circonstances rendent impossible une tentative de conciliation ou médiation",
    "Le conciliateur ou médiateur est indisponible dans un délai de 3 mois",
  ],
};

const ACTION_NULLITE_BLOCKS: FicheStepBlock[] = [
  {
    paragraphs: ["**Délai pour agir :**"],
    bullets: [
      "5 ans à compter de la découverte du dol",
      "Délai butoir de 20 ans à compter de la conclusion du contrat",
      "Action en nullité relative, exercée par la victime uniquement",
    ],
  },
  {
    paragraphs: [
      "**Tribunal compétent :** le tribunal judiciaire du lieu de résidence de l'acheteur ou du lieu d'exécution du contrat — article 2224 du code civil.",
      "**Effets de l'annulation :**",
    ],
    bullets: ["Restitution du bien au vendeur", "Restitution du prix à l'acheteur"],
  },
  {
    paragraphs: [
      "Article 1352 et suivants du code civil.",
      "Possibilité de demander des dommages et intérêts sur le fondement de la responsabilité civile extracontractuelle (article 1240) :",
    ],
    bullets: [
      "En prouvant la faute de l'autre personne",
      "Si la nullité ne suffit pas à réparer le préjudice subi",
    ],
  },
];

const ACTION_INDEMNISATION_BLOCKS: FicheStepBlock[] = [
  {
    paragraphs: ["**Délai pour agir :**"],
    bullets: [
      "5 ans à compter de la découverte du dol",
      "Délai butoir de 20 ans à compter de la conclusion du contrat",
    ],
  },
  {
    paragraphs: [
      "**Tribunal compétent :** le tribunal judiciaire du lieu de résidence de l'acheteur ou du lieu d'exécution du contrat.",
      "Possibilité de demander des dommages et intérêts sur le fondement de la responsabilité civile extracontractuelle (article 1240) :",
    ],
    bullets: [
      "En prouvant la faute de l'autre personne",
      "Si la nullité ne suffit pas à réparer le préjudice subi",
    ],
  },
];

const CUMUL_BLOCK: FicheStepBlock = {
  paragraphs: ["Possibilité de cumuler l'annulation du contrat et le versement d'une indemnisation."],
};

const DOL_INTRO =
  "Au vu des éléments fournis, votre problème concerne une information fausse qui vous a été donnée ou dissimulée lors de la vente d'un bien ou d'un objet.";

type DolVariant = "annuler" | "indemnise" | "les_deux";

function makeDolFiche(variant: DolVariant): FicheContent {
  const conciliationStep = {
    title: "Une tentative de conciliation ou de médiation",
    blocks: [CONCILIATION_BLOCK, MEDIATION_BLOCK, SAISINE_DIRECTE_BLOCK],
  };

  if (variant === "annuler") {
    return {
      header: "Dol lors de la vente — annulation du contrat",
      intro: DOL_INTRO,
      cadreLegal: DOL_CADRE_LEGAL,
      ctaPractitionersHref: CTA_CIVIL,
      steps: [
        DOL_CONDITIONS_STEP,
        { title: "Une mise en demeure amiable", blocks: [medBlock("l'annulation du contrat")] },
        conciliationStep,
        { title: "Action en justice", blocks: ACTION_NULLITE_BLOCKS },
      ],
    };
  }

  if (variant === "indemnise") {
    return {
      header: "Dol lors de la vente — indemnisation",
      intro: DOL_INTRO,
      cadreLegal: DOL_CADRE_LEGAL,
      ctaPractitionersHref: CTA_CIVIL,
      steps: [
        DOL_CONDITIONS_STEP,
        { title: "Une mise en demeure amiable", blocks: [medBlock("l'indemnisation du préjudice subi")] },
        conciliationStep,
        { title: "Action en justice", blocks: [...ACTION_INDEMNISATION_BLOCKS, CUMUL_BLOCK] },
      ],
    };
  }

  // les_deux
  return {
    header: "Dol lors de la vente — annulation et indemnisation",
    intro: DOL_INTRO,
    cadreLegal: DOL_CADRE_LEGAL,
    ctaPractitionersHref: CTA_CIVIL,
    steps: [
      DOL_CONDITIONS_STEP,
      { title: "Une mise en demeure amiable", blocks: [medBlock("l'annulation du contrat")] },
      conciliationStep,
      { title: "Action en justice", blocks: [...ACTION_NULLITE_BLOCKS, CUMUL_BLOCK] },
    ],
  };
}

const DOL_ANNULER = makeDolFiche("annuler");
const DOL_INDEMNISE = makeDolFiche("indemnise");
const DOL_LES_DEUX = makeDolFiche("les_deux");

// ── Réponses informatives (pas d'action possible) ──

const DOL_NON_DETERMINANT: FicheContent = {
  header: "Dol : information non déterminante",
  intro:
    "Au vu des éléments transmis, l'information en cause ne semble pas avoir été déterminante de votre consentement.",
  cadreLegal: DOL_CADRE_LEGAL,
  ctaPractitionersHref: CTA_CIVIL,
  steps: [
    {
      title: "Le caractère déterminant fait défaut",
      blocks: [
        {
          paragraphs: [
            "Une des conditions essentielles pour caractériser le dol est son **caractère déterminant** :",
          ],
          bullets: [
            "L'information fausse doit avoir été décisive pour vendre",
            "La vente ne se serait pas réalisée, ou pas aux mêmes conditions, sans cette information",
          ],
        },
        {
          paragraphs: [
            "Sans caractère déterminant, une action en annulation ou en indemnisation ne peut aboutir.",
          ],
        },
      ],
    },
  ],
};

const DOL_ESTIMATION: FicheContent = {
  header: "Dol : estimation de la valeur",
  intro:
    "Au vu des éléments transmis, le désaccord porte sur l'estimation de la valeur du bien, ce qui ne constitue pas un dol.",
  cadreLegal: DOL_CADRE_LEGAL,
  ctaPractitionersHref: CTA_CIVIL,
  steps: [
    {
      title: "Estimation de la valeur ou valeur faussée ?",
      blocks: [
        {
          paragraphs: [
            "**Estimation de la valeur du bien**",
            "Exemple : le bien a été vendu 200 €, mais en valait davantage.",
          ],
          bullets: [
            "Chacun est libre de fixer son prix",
            "Ne pas faire une bonne affaire n'est pas un dol",
            "Le silence de l'acheteur sur sa propre estimation du bien n'est pas un dol",
          ],
        },
        {
          paragraphs: [
            "**Valeur du bien faussée**",
            "Exemple : dissimulation d'un défaut, mensonge sur l'authenticité ou une caractéristique essentielle…",
          ],
          bullets: [
            "La valeur est faussée en raison d'un mensonge ou d'une dissimulation",
            "Dans ce cas, une action en nullité pour dol est possible",
          ],
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  FICHES 141-143 — GARANTIE DES VICES CACHÉS
//  ⚠️ Contenu rédigé à partir du régime légal (source = titre seul).
// ═══════════════════════════════════════════════════════════════

const VICE_CACHE_CADRE_LEGAL = {
  paragraphs: [
    "Lorsque le défaut n'a pas été dissimulé intentionnellement, il peut relever de la **garantie des vices cachés**.",
    "Le vice caché est un défaut :",
  ],
  bullets: [
    "Caché (non apparent lors de l'achat)",
    "Antérieur à la vente",
    "Rendant le bien impropre à son usage, ou en diminuant fortement l'usage",
  ],
  reference: "Articles 1641 à 1648 du code civil",
};

const VICE_CACHE_DELAI_BLOCK: FicheStepBlock = {
  paragraphs: ["**Délai pour agir :**"],
  bullets: [
    "2 ans à compter de la découverte du vice — article 1648 du code civil",
    "Tribunal compétent : le tribunal judiciaire",
  ],
};

const VICE_CACHE_AMIABLE_STEP = {
  title: "Une mise en demeure amiable",
  blocks: [
    {
      paragraphs: [
        "**C'est quoi ?** Une lettre envoyée avec accusé de réception pour signaler le vice et formuler votre demande.",
        "Préalable utile avant toute action en justice ; cette étape peut parfois suffire à résoudre le problème.",
      ],
      link: { label: "J'ai besoin d'aide pour la mise en demeure", href: "#", external: false },
    },
  ],
};

const VICE_CACHE_141: FicheContent = {
  header: "Vice caché — annulation de la vente",
  intro:
    "Au vu des éléments transmis, le bien présente un défaut caché et vous souhaitez obtenir l'annulation de la vente.",
  cadreLegal: VICE_CACHE_CADRE_LEGAL,
  ctaPractitionersHref: CTA_CIVIL,
  steps: [
    VICE_CACHE_AMIABLE_STEP,
    {
      title: "Action rédhibitoire — annulation de la vente",
      blocks: [
        {
          paragraphs: [
            "L'action rédhibitoire permet de **rendre le bien et d'obtenir la restitution du prix** — article 1644 du code civil.",
          ],
          bullets: [
            "Restitution du bien au vendeur",
            "Restitution du prix à l'acheteur",
            "Dommages et intérêts possibles si le vendeur connaissait le vice (vendeur de mauvaise foi)",
          ],
        },
        VICE_CACHE_DELAI_BLOCK,
      ],
    },
  ],
};

const VICE_CACHE_142: FicheContent = {
  header: "Vice caché — réduction du prix",
  intro:
    "Au vu des éléments transmis, le bien présente un défaut caché et vous souhaitez conserver le bien en obtenant une réduction du prix.",
  cadreLegal: VICE_CACHE_CADRE_LEGAL,
  ctaPractitionersHref: CTA_CIVIL,
  steps: [
    VICE_CACHE_AMIABLE_STEP,
    {
      title: "Action estimatoire — réduction du prix",
      blocks: [
        {
          paragraphs: [
            "L'action estimatoire permet de **conserver le bien tout en obtenant une réduction du prix** — article 1644 du code civil.",
          ],
          bullets: [
            "Le montant de la réduction est apprécié par le juge (souvent à dire d'expert)",
            "Dommages et intérêts possibles si le vendeur connaissait le vice (vendeur de mauvaise foi)",
          ],
        },
        VICE_CACHE_DELAI_BLOCK,
      ],
    },
  ],
};

const VICE_CACHE_143: FicheContent = {
  header: "Vice caché — remplacement ou réparation",
  intro:
    "Au vu des éléments transmis, le bien présente un défaut et vous souhaitez son remplacement ou sa réparation.",
  cadreLegal: VICE_CACHE_CADRE_LEGAL,
  ctaPractitionersHref: CTA_CIVIL,
  steps: [
    {
      title: "Quel régime s'applique ?",
      blocks: [
        {
          paragraphs: [
            "Le **remplacement** ou la **réparation** du bien relèvent en principe de la **garantie légale de conformité**, qui ne s'applique que pour un achat **auprès d'un vendeur professionnel** (articles L.217-3 et suivants du code de la consommation).",
            "Entre particuliers, la garantie des vices cachés ouvre droit, au choix :",
          ],
          bullets: [
            "à l'annulation de la vente (restitution du prix) — action rédhibitoire",
            "ou à une réduction du prix — action estimatoire",
          ],
        },
      ],
    },
    VICE_CACHE_AMIABLE_STEP,
    {
      title: "Action en garantie des vices cachés",
      blocks: [VICE_CACHE_DELAI_BLOCK],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  SÉLECTION
// ═══════════════════════════════════════════════════════════════

interface VCAnswers {
  vcPasse?: "info_fausse" | "info_manquante" | "erreur_soi";
  vcIntention?: "menti_volontaire" | "oubli_ignorance";
  vcInfoConcernait?: "caracteristiques" | "usage" | "identite" | "valeur";
  vcCaracVolontaire?: "oui" | "non";
  vcValeurPrecision?: "valeur_reelle" | "estimation";
  vcDeterminant?: "non_refuse" | "conditions_diff" | "oui_quand_meme";
  vcSouhait?: "annuler" | "indemnise" | "les_deux";
  vcViceSouhait?: "annulation" | "reduction" | "remplacement";
  [key: string]: unknown;
}

function souhaitToFiche(souhait: VCAnswers["vcSouhait"], base: number): number | null {
  if (souhait === "annuler") return base;
  if (souhait === "indemnise") return base + 1;
  if (souhait === "les_deux") return base + 2;
  return null;
}

/**
 * Détermine le numéro de fiche (128-143) à partir des réponses du wizard.
 * Renvoie null si le chemin est incomplet.
 */
export function getViceConsentementFicheNumber(a: VCAnswers): number | null {
  const info = a.vcInfoConcernait;
  const det = a.vcDeterminant;

  // ── Usage / identité de la personne → fiches 128-131 ──
  if (info === "usage" || info === "identite") {
    if (det === "oui_quand_meme") return 128;
    if (det === "non_refuse" || det === "conditions_diff") return souhaitToFiche(a.vcSouhait, 129);
    return null;
  }

  // ── Valeur du bien → fiches 132-136 ──
  if (info === "valeur") {
    if (a.vcValeurPrecision === "estimation") return 132;
    if (a.vcValeurPrecision === "valeur_reelle") {
      if (det === "oui_quand_meme") return 133;
      if (det === "non_refuse" || det === "conditions_diff") return souhaitToFiche(a.vcSouhait, 134);
    }
    return null;
  }

  // ── Caractéristiques du bien → dol (137-140) ou vice caché (141-143) ──
  if (info === "caracteristiques") {
    if (a.vcCaracVolontaire === "non") {
      if (a.vcViceSouhait === "annulation") return 141;
      if (a.vcViceSouhait === "reduction") return 142;
      if (a.vcViceSouhait === "remplacement") return 143;
      return null;
    }
    if (a.vcCaracVolontaire === "oui") {
      if (det === "oui_quand_meme") return 137;
      if (det === "non_refuse" || det === "conditions_diff") return souhaitToFiche(a.vcSouhait, 138);
    }
    return null;
  }

  return null;
}

const VICE_CONSENTEMENT_FICHES: Record<number, FicheContent> = {
  128: DOL_NON_DETERMINANT,
  129: DOL_ANNULER,
  130: DOL_INDEMNISE,
  131: DOL_LES_DEUX,
  132: DOL_ESTIMATION,
  133: DOL_NON_DETERMINANT,
  134: DOL_ANNULER,
  135: DOL_INDEMNISE,
  136: DOL_LES_DEUX,
  137: DOL_NON_DETERMINANT,
  138: DOL_ANNULER,
  139: DOL_INDEMNISE,
  140: DOL_LES_DEUX,
  141: VICE_CACHE_141,
  142: VICE_CACHE_142,
  143: VICE_CACHE_143,
};

/** Récupère une fiche vice du consentement par numéro (128-143). */
export function getViceConsentementFiche(num: number): FicheContent | null {
  return VICE_CONSENTEMENT_FICHES[num] ?? null;
}
