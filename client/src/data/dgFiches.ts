/**
 * Depot Garantie Fiches 5-45 (vs Particulier)
 * Content from Retours Juridique PDF.
 *
 * Uses a factory approach: shared legal blocks + parametric intro/cadre legal
 * instead of 42 duplicate objects.
 */

import type { FicheContent, FicheStep, FicheStepBlock } from "./ficheContent";

// ═══════════════════════════════════════════════════════════════
//  SHARED RESOLUTION STEP BLOCKS
// ═══════════════════════════════════════════════════════════════

const DG_MED_BLOCK: FicheStep = {
  title: "Mise en demeure amiable",
  blocks: [
    {
      paragraphs: [
        "C'est quoi ? Une lettre envoyée avec accusé de réception pour demander la restitution du dépôt de garantie",
        "Préalable nécessaire avant toute action en justice",
        "Étape qui peut parfois suffire à résoudre le problème",
      ],
      link: {
        label: "J'ai besoin d'aide pour la mise en demeure",
        href: "#",
        external: false,
      },
    },
  ],
};

const DG_CONCILIATION: FicheStep = {
  title: "Tentative de conciliation ou de médiation",
  blocks: [
    {
      paragraphs: [
        "Obligatoire si le montant est < 5 000€. Facultatif si le montant est > 5 000€.",
        "Avant de saisir un juge, il existe 2 démarches amiables *(article 750-1 du Code de procédure civile)* :",
        "**Conciliation :**",
      ],
      bullets: [
        "Rapide, gratuite, confidentielle",
        "Prise de rendez-vous dans un tribunal judiciaire, en mairie, ou en ligne, sur le site conciliateurs.fr",
        "Possibilité de saisir directement la commission départementale de conciliation",
      ],
    },
    {
      paragraphs: ["**Médiation :**"],
      bullets: [
        "Payant",
        "Obligatoire en cas de clause de médiation prévue au contrat",
        "Liste des médiateurs dans l'annuaire des sites de cours d'appel",
        "Contact courrier ou sur leur site internet",
      ],
    },
    {
      paragraphs: [
        "Saisir directement le juge est possible (sans conciliation ou médiation) uniquement si :",
      ],
      bullets: [
        "Il y a urgence",
        "Les circonstances rendent impossible une tentative de conciliation ou médiation",
        "Le conciliateur ou médiateur est indisponible dans un délai de 3 mois",
      ],
    },
  ],
};

const DG_INJONCTION: FicheStep = {
  title: "Injonction de payer (article 1405 du code de procédure civile)",
  blocks: [
    {
      paragraphs: ["**Conditions :**"],
      bullets: [
        "La somme doit être précise (montant exact à réclamer…)",
        "Il doit exister un contrat qui justifie le paiement",
      ],
    },
    {
      paragraphs: ["**Comment procéder :**"],
      bullets: [
        "Envoyer une demande écrite au greffe du tribunal judiciaire du lieu de résidence de la personne qui doit l'argent",
        "Utiliser le formulaire Cerfa n°12948",
        "Indiquer le montant réclamé et l'origine du litige",
      ],
    },
    {
      paragraphs: [
        "**À savoir :** La demande est gratuite. Des honoraires peuvent être dus si un avocat assiste.",
        "**Après décision du juge :**",
      ],
      bullets: [
        "Si l'ordonnance d'injonction est accordée : un commissaire de justice transmet la décision à la personne concernée",
        "Si la demande est refusée : la procédure classique (contentieuse) doit être suivie",
      ],
    },
  ],
};

const DG_ACTION_JUGE: FicheStep = {
  title: "Action devant le juge",
  blocks: [
    {
      paragraphs: [
        "Devant le **Juge du Contentieux de la Protection**, du tribunal dont dépend le lieu loué.",
        "**Rappel des délais de prescription :**",
        "L'action peut être engagée jusqu'à **3 ans** après la date à laquelle le paiement était dû *(article 7-1 de la loi n°89-462 du 6 juillet 1989)*.",
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CADRE LÉGAL VARIANTS
// ═══════════════════════════════════════════════════════════════

interface CadreLegal {
  paragraphs: string[];
  bullets?: string[];
  reference?: string;
}

const CL_DEGRADATION_BASE: CadreLegal = {
  paragraphs: [
    "**Locataire** : en charge des dégradations résultant d'une absence d'entretien du bien ou de réparation locative (petite réparation ou entretien courant).",
    "**Propriétaire** : en charge des dégradations résultant de la vétusté (usure normale due au temps et à l'usage du bien) et celles dues à une absence de réparation hors réparations locatives.",
    "La retenue du dépôt de garantie doit être justifiée par des éléments factuels (mentionnés sur l'état des lieux de sortie).",
    "La facturation doit prendre en compte la vétusté, l'usure normale du logement.",
    "Les retenues doivent être justifiées par des devis ou factures. Les travaux facturés doivent être proportionnés à la dégradation constatée.",
    "**Majoration** de 10% du loyer mensuel hors charges, par mois entamé de retard.",
  ],
  reference: "Article 22 de la loi n° 89-462 du 6 juillet 1989 tendant à améliorer les rapports locatifs",
};

const CL_DEGRADATION_INFO: CadreLegal = {
  paragraphs: [
    "**Locataire** : en charge des dégradations résultant d'une absence d'entretien du bien ou de réparation locative (petite réparation ou entretien courant).",
    "**Propriétaire** : en charge des dégradations résultant de la vétusté (usure normale due au temps et à l'usage du bien) et celles dues à une absence de réparation hors réparations locatives.",
    "Le propriétaire peut utiliser le dépôt de garantie pour payer les réparations liées aux dégradations constatées.",
    "La retenue doit être justifiée par des devis, des factures, des justificatifs de travaux.",
  ],
  bullets: [
    "La retenue ne peut pas dépasser le montant des réparations nécessaires",
    "Doit tenir compte de la vétusté du logement (usure normale liée au temps)",
    "Si le montant des réparations est inférieur au dépôt de garantie, la différence doit être restituée au locataire",
  ],
  reference: "Article 22 de la loi du 6 juillet 1989 tendant à améliorer les rapports locatifs",
};

const CL_LOYERS_IMPAYES_PROPORTIONNEL: CadreLegal = {
  paragraphs: [
    "Le locataire doit payer les loyers et charges dus jusqu'à la fin du bail.",
    "Le propriétaire peut retenir tout ou partie du dépôt de garantie pour couvrir les loyers ou charges impayés.",
    "Cette possibilité est prévue par l'article 22 de la loi n°89-462 du 6 juillet 1989.",
  ],
  bullets: [
    "La retenue ne peut pas dépasser le montant exact des loyers ou charges impayés",
    "Elle doit être justifiée par des documents (relevés, quittances, factures)",
    "Si le montant retenu est inférieur au dépôt de garantie, la différence doit être restituée au locataire",
  ],
  reference: "Article 22 de la loi n° 89-462 du 6 juillet 1989",
};

const CL_LOYERS_IMPAYES_DISPROP: CadreLegal = {
  paragraphs: [
    "Le locataire doit payer les loyers et charges dus jusqu'à la fin du bail.",
    "Le propriétaire peut retenir **uniquement** le montant exact des loyers ou charges impayés pour couvrir la dette.",
    "Toute différence entre le montant retenu et la dette réelle doit être restituée au locataire.",
    "La retenue doit être justifiée par des documents (relevés, quittances, factures).",
    "**Majoration** de 10% du loyer mensuel hors charges, par mois entamé de retard.",
  ],
  reference: "Article 22 de la loi n° 89-462 du 6 juillet 1989 tendant à améliorer les rapports locatifs",
};

const CL_AUCUNE_EXPLICATION: CadreLegal = {
  paragraphs: [
    "Le propriétaire a l'obligation de restituer le dépôt de garantie dans le délai légal.",
    "Toute retenue doit être justifiée par des éléments factuels (dégradations, loyers impayés…).",
    "En l'absence de justification, le dépôt de garantie doit être intégralement restitué.",
    "**Majoration** de 10% du loyer mensuel hors charges, par mois entamé de retard.",
  ],
  reference: "Article 22 de la loi n° 89-462 du 6 juillet 1989 tendant à améliorer les rapports locatifs",
};

// ═══════════════════════════════════════════════════════════════
//  FACTORY FUNCTION
// ═══════════════════════════════════════════════════════════════

interface DGFicheParams {
  ficheNum: number;
  header: string;
  intro: string;
  cadreLegal: CadreLegal;
  /** true = demande already made → start at conciliation. false = start at mise en demeure */
  demandeFaite: boolean;
  /** true = info-only page (no resolution steps) */
  infoOnly?: boolean;
}

function buildDGFiche(p: DGFicheParams): FicheContent {
  const steps: FicheStep[] = [];
  let stepNum = 1;

  if (p.infoOnly) {
    return {
      header: p.header,
      intro: p.intro,
      cadreLegal: p.cadreLegal,
      ctaPractitionersHref: "/practitioners?specialty=Droit%20immobilier",
      steps: [],
    };
  }

  if (!p.demandeFaite) {
    steps.push({ ...DG_MED_BLOCK, title: `${stepNum}/ Mise en demeure amiable` });
    stepNum++;
  }

  steps.push({ ...DG_CONCILIATION, title: `${stepNum}/ Tentative de conciliation ou de médiation` });
  stepNum++;

  steps.push({ ...DG_INJONCTION, title: `${stepNum}/ Injonction de payer *(article 1405 du code de procédure civile)*` });
  stepNum++;

  steps.push({ ...DG_ACTION_JUGE, title: `${stepNum}/ Action devant le juge` });

  return {
    header: p.header,
    intro: p.intro,
    cadreLegal: p.cadreLegal,
    ctaPractitionersHref: "/practitioners?specialty=Droit%20immobilier",
    steps,
  };
}

// ═══════════════════════════════════════════════════════════════
//  ALL 42 FICHES (5-45)
// ═══════════════════════════════════════════════════════════════

const DG_FICHES: Record<number, FicheContent> = {
  // ━━━━ CHOIX 1 / EDL SIGNÉ / DÉGRADATIONS OUI / > 2 MOIS ━━━━

  // Dégradation + justif + pas contesté
  5: buildDGFiche({
    ficheNum: 5,
    header: "Absence de restitution du dépôt de garantie — dégradations non contestées",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de dégradations de la location. Les dégradations ne sont pas contestées.",
    cadreLegal: CL_DEGRADATION_INFO,
    demandeFaite: true,
    infoOnly: true,
  }),

  // Dégradation + justif + contesté + demande OUI
  6: buildDGFiche({
    ficheNum: 6,
    header: "Absence de restitution du dépôt de garantie — dégradations contestées, demande faite",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de dégradations de la location. Les dégradations sont contestées mais l'état des lieux de sortie a été signé. Une demande de restitution amiable a été réalisée.",
    cadreLegal: CL_DEGRADATION_BASE,
    demandeFaite: true,
  }),

  // Dégradation + justif + contesté + demande NON
  7: buildDGFiche({
    ficheNum: 7,
    header: "Absence de restitution du dépôt de garantie — dégradations contestées, aucune demande",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de dégradations de la location. Les dégradations sont contestées mais l'état des lieux a été signé. Aucune demande de restitution amiable n'a encore été réalisée.",
    cadreLegal: CL_DEGRADATION_BASE,
    demandeFaite: false,
  }),

  // Dégradation + pas de justif + demande OUI
  8: buildDGFiche({
    ficheNum: 8,
    header: "Absence de restitution du dépôt de garantie — dégradations sans justification, demande faite",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de dégradations de la location. Aucune justification n'est apportée par le propriétaire mais l'état des lieux de sortie a été signé. Une demande de restitution amiable a été réalisée.",
    cadreLegal: CL_DEGRADATION_BASE,
    demandeFaite: true,
  }),

  // Dégradation + pas de justif + demande NON
  9: buildDGFiche({
    ficheNum: 9,
    header: "Absence de restitution du dépôt de garantie — dégradations sans justification, aucune demande",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de dégradations de la location. Aucune justification n'est apportée par le propriétaire mais l'état des lieux a été signé. Aucune demande de restitution amiable n'a encore été réalisée.",
    cadreLegal: CL_DEGRADATION_BASE,
    demandeFaite: false,
  }),

  // Loyers impayés OUI + proportionné
  14: buildDGFiche({
    ficheNum: 14,
    header: "Absence de restitution du dépôt de garantie — loyers impayés, retenue proportionnée",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de loyers ou charges impayés.",
    cadreLegal: CL_LOYERS_IMPAYES_PROPORTIONNEL,
    demandeFaite: true,
    infoOnly: true,
  }),

  // Loyers impayés OUI + disproportionné + demande OUI
  15: buildDGFiche({
    ficheNum: 15,
    header: "Absence de restitution du dépôt de garantie — loyers impayés, retenue disproportionnée, demande faite",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de loyers ou charges impayés. Le montant non restitué est supérieur aux loyers ou charges impayés. Une demande de restitution a été réalisée.",
    cadreLegal: CL_LOYERS_IMPAYES_DISPROP,
    demandeFaite: true,
  }),

  // Loyers impayés OUI + disproportionné + demande NON
  16: buildDGFiche({
    ficheNum: 16,
    header: "Absence de restitution du dépôt de garantie — loyers impayés, retenue disproportionnée, aucune demande",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de loyers ou charges impayés. Le montant non restitué est supérieur aux loyers ou charges impayés. Aucune demande de restitution n'a encore été réalisée.",
    cadreLegal: CL_LOYERS_IMPAYES_DISPROP,
    demandeFaite: false,
  }),

  // Loyers impayés NON + demande OUI
  17: buildDGFiche({
    ficheNum: 17,
    header: "Absence de restitution du dépôt de garantie — loyers invoqués sans impayé réel, demande faite",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de loyers ou charges impayés. Aucun loyer ou charge n'était impayé au moment du départ. Une demande de restitution a été réalisée.",
    cadreLegal: CL_AUCUNE_EXPLICATION,
    demandeFaite: true,
  }),

  // Loyers impayés NON + demande NON
  18: buildDGFiche({
    ficheNum: 18,
    header: "Absence de restitution du dépôt de garantie — loyers invoqués sans impayé réel, aucune demande",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de loyers ou charges impayés. Aucun loyer ou charge n'était impayé au moment du départ. Aucune demande de restitution n'a encore été réalisée.",
    cadreLegal: CL_AUCUNE_EXPLICATION,
    demandeFaite: false,
  }),

  // Aucune explication + demande OUI
  24: buildDGFiche({
    ficheNum: 24,
    header: "Absence de restitution du dépôt de garantie — aucune explication, demande faite",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois). Aucune explication n'est apportée sur la retenue. Une demande de restitution a été réalisée.",
    cadreLegal: CL_AUCUNE_EXPLICATION,
    demandeFaite: true,
  }),

  // Aucune explication + demande NON
  25: buildDGFiche({
    ficheNum: 25,
    header: "Absence de restitution du dépôt de garantie — aucune explication, aucune demande",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois). Aucune explication n'est apportée sur la retenue. Aucune demande de restitution n'a encore été réalisée.",
    cadreLegal: CL_AUCUNE_EXPLICATION,
    demandeFaite: false,
  }),

  // ━━━━ CHOIX 1 / EDL SIGNÉ / CONFORME / > 1 MOIS ━━━━

  // Dégradation invoquée malgré conforme + justif + demande OUI
  10: buildDGFiche({
    ficheNum: 10,
    header: "Absence de restitution du dépôt de garantie — dégradations invoquées malgré état conforme, justifiées, demande faite",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois), en raison de dégradation, et ce, malgré la signature de l'état des lieux de sortie conforme. Une demande de restitution amiable a été réalisée.",
    cadreLegal: CL_DEGRADATION_BASE,
    demandeFaite: true,
  }),

  10.1: undefined as any, // placeholder to keep numbering

  11: buildDGFiche({
    ficheNum: 11,
    header: "Absence de restitution du dépôt de garantie — dégradations invoquées malgré état conforme, justifiées, aucune demande",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois), en raison de dégradation, et ce, malgré la signature de l'état des lieux de sortie conforme. Aucune demande de restitution amiable n'a encore été réalisée.",
    cadreLegal: CL_DEGRADATION_BASE,
    demandeFaite: false,
  }),

  12: buildDGFiche({
    ficheNum: 12,
    header: "Absence de restitution du dépôt de garantie — dégradations invoquées malgré état conforme, sans justification, demande faite",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois), en raison de dégradations de la location, malgré la signature de l'état des lieux conforme. Aucune justification n'est apportée. Une demande de restitution a été réalisée.",
    cadreLegal: CL_DEGRADATION_BASE,
    demandeFaite: true,
  }),

  13: buildDGFiche({
    ficheNum: 13,
    header: "Absence de restitution du dépôt de garantie — dégradations invoquées malgré état conforme, sans justification, aucune demande",
    intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois), en raison de dégradations de la location, malgré la signature de l'état des lieux conforme. Aucune justification n'est apportée. Aucune demande de restitution n'a encore été réalisée.",
    cadreLegal: CL_DEGRADATION_BASE,
    demandeFaite: false,
  }),

  // Conforme + Loyers impayés OUI + proportionné
  19: buildDGFiche({ ficheNum: 19, header: "Absence de restitution du dépôt de garantie — loyers impayés, retenue proportionnée (état conforme)", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois), en raison de loyers ou charges impayés.", cadreLegal: CL_LOYERS_IMPAYES_PROPORTIONNEL, demandeFaite: true, infoOnly: true }),

  20: buildDGFiche({ ficheNum: 20, header: "Absence de restitution — loyers impayés, disproportionné, demande faite (état conforme)", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois), en raison de loyers ou charges impayés. Le montant non restitué est supérieur aux loyers ou charges impayés. Une demande de restitution a été réalisée.", cadreLegal: CL_LOYERS_IMPAYES_DISPROP, demandeFaite: true }),

  21: buildDGFiche({ ficheNum: 21, header: "Absence de restitution — loyers impayés, disproportionné, aucune demande (état conforme)", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois), en raison de loyers ou charges impayés. Le montant non restitué est supérieur aux loyers ou charges impayés. Aucune demande de restitution n'a encore été réalisée.", cadreLegal: CL_LOYERS_IMPAYES_DISPROP, demandeFaite: false }),

  22: buildDGFiche({ ficheNum: 22, header: "Absence de restitution — loyers invoqués sans impayé réel, demande faite (état conforme)", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois), en raison de loyers ou charges impayés. Aucun loyer ou charge n'était impayé au moment du départ. Une demande de restitution a été réalisée.", cadreLegal: CL_AUCUNE_EXPLICATION, demandeFaite: true }),

  23: buildDGFiche({ ficheNum: 23, header: "Absence de restitution — loyers invoqués sans impayé réel, aucune demande (état conforme)", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois), en raison de loyers ou charges impayés. Aucun loyer ou charge n'était impayé au moment du départ. Aucune demande de restitution n'a encore été réalisée.", cadreLegal: CL_AUCUNE_EXPLICATION, demandeFaite: false }),

  // Conforme + Aucune explication
  26: buildDGFiche({ ficheNum: 26, header: "Absence de restitution — aucune explication, demande faite (état conforme)", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois). Aucune explication n'est apportée sur la retenue. Une demande de restitution a été réalisée.", cadreLegal: CL_AUCUNE_EXPLICATION, demandeFaite: true }),

  27: buildDGFiche({ ficheNum: 27, header: "Absence de restitution — aucune explication, aucune demande (état conforme)", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ d'un mois). Aucune explication n'est apportée sur la retenue. Aucune demande de restitution n'a encore été réalisée.", cadreLegal: CL_AUCUNE_EXPLICATION, demandeFaite: false }),

  // ━━━━ CHOIX 2 / EDL PAS SIGNÉ ━━━━

  // Info pages (< 2 mois)
  28: buildDGFiche({ ficheNum: 28, header: "Information — délai non dépassé (dégradations contestées)", intro: "Lorsque des dégradations sont mentionnées dans l'état des lieux de sortie, le propriétaire dispose d'un délai de deux mois pour restituer le dépôt de garantie (article 22 de la loi du 6 juillet 1989). Ce délai n'est pas encore dépassé.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: true, infoOnly: true }),

  33: buildDGFiche({ ficheNum: 33, header: "Information — délai non dépassé (montant réparations contesté)", intro: "Lorsque des dégradations sont mentionnées dans l'état des lieux de sortie, le propriétaire dispose d'un délai de deux mois pour restituer le dépôt de garantie (article 22 de la loi du 6 juillet 1989). Ce délai n'est pas encore dépassé.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: true, infoOnly: true }),

  38: buildDGFiche({ ficheNum: 38, header: "Information — délai non dépassé (dégradations et montant contestés)", intro: "Lorsque des dégradations sont mentionnées dans l'état des lieux de sortie, le propriétaire dispose d'un délai de deux mois pour restituer le dépôt de garantie (article 22 de la loi du 6 juillet 1989). Ce délai n'est pas encore dépassé.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: true, infoOnly: true }),

  // Choix 2 / Dégradations / > 2 mois
  29: buildDGFiche({ ficheNum: 29, header: "Absence de restitution — dégradations contestées, EDL non signé, justifié, demande faite", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de dégradations de la location. L'état des lieux de sortie n'a pas été signé. Une demande de restitution amiable a été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: true }),

  30: buildDGFiche({ ficheNum: 30, header: "Absence de restitution — dégradations contestées, EDL non signé, justifié, aucune demande", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de dégradations de la location. L'état des lieux de sortie n'a pas été signé. Aucune demande de restitution amiable n'a encore été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: false }),

  31: buildDGFiche({ ficheNum: 31, header: "Absence de restitution — dégradations contestées, EDL non signé, sans justification, demande faite", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de dégradations de la location. L'état des lieux de sortie n'a pas été signé. Le propriétaire n'apporte aucune justification. Une demande de restitution amiable a été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: true }),

  32: buildDGFiche({ ficheNum: 32, header: "Absence de restitution — dégradations contestées, EDL non signé, sans justification, aucune demande", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois), en raison de dégradations de la location. L'état des lieux de sortie n'a pas été signé. Le propriétaire n'apporte aucune justification. Aucune demande de restitution n'a encore été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: false }),

  // Choix 2 / Montant réparations / > 2 mois
  34: buildDGFiche({ ficheNum: 34, header: "Absence de restitution — montant réparations contesté, EDL non signé, justifié, demande faite", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois). Le montant des réparations demandées est contesté. L'état des lieux de sortie n'a pas été signé. Une demande de restitution amiable a été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: true }),

  35: buildDGFiche({ ficheNum: 35, header: "Absence de restitution — montant réparations contesté, EDL non signé, justifié, aucune demande", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois). Le montant des réparations demandées est contesté. L'état des lieux de sortie n'a pas été signé. Aucune demande de restitution n'a encore été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: false }),

  36: buildDGFiche({ ficheNum: 36, header: "Absence de restitution — montant réparations contesté, EDL non signé, sans justification, demande faite", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois). Le montant des réparations demandées est contesté. L'état des lieux de sortie n'a pas été signé. Le propriétaire n'apporte aucune justification. Une demande de restitution a été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: true }),

  37: buildDGFiche({ ficheNum: 37, header: "Absence de restitution — montant réparations contesté, EDL non signé, sans justification, aucune demande", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois). Le montant des réparations demandées est contesté. L'état des lieux de sortie n'a pas été signé. Le propriétaire n'apporte aucune justification. Aucune demande de restitution n'a encore été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: false }),

  // Choix 2 / Les deux / > 2 mois
  39: buildDGFiche({ ficheNum: 39, header: "Absence de restitution — dégradations et montant contestés, EDL non signé, justifié, demande faite", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois). Les dégradations et le montant des réparations sont contestés. L'état des lieux de sortie n'a pas été signé. Une demande de restitution amiable a été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: true }),

  40: buildDGFiche({ ficheNum: 40, header: "Absence de restitution — dégradations et montant contestés, EDL non signé, justifié, aucune demande", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois). Les dégradations et le montant des réparations sont contestés. L'état des lieux de sortie n'a pas été signé. Aucune demande de restitution n'a encore été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: false }),

  41: buildDGFiche({ ficheNum: 41, header: "Absence de restitution — dégradations et montant contestés, EDL non signé, sans justification, demande faite", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois). Les dégradations et le montant des réparations sont contestés. L'état des lieux de sortie n'a pas été signé. Le propriétaire n'apporte aucune justification. Une demande de restitution a été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: true }),

  42: buildDGFiche({ ficheNum: 42, header: "Absence de restitution — dégradations et montant contestés, EDL non signé, sans justification, aucune demande", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution) par le propriétaire, au-delà du délai légal de restitution (+ de 2 mois). Les dégradations et le montant des réparations sont contestés. L'état des lieux de sortie n'a pas été signé. Le propriétaire n'apporte aucune justification. Aucune demande de restitution n'a encore été réalisée.", cadreLegal: CL_DEGRADATION_BASE, demandeFaite: false }),

  // ━━━━ CHOIX 3 / PAS D'EDL ━━━━

  43: buildDGFiche({ ficheNum: 43, header: "Absence de restitution du dépôt de garantie — pas d'état des lieux (propriétaire absent)", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution). L'état des lieux de sortie n'a pas été réalisé, le propriétaire ne s'étant pas présenté / ne l'ayant pas proposé.", cadreLegal: CL_AUCUNE_EXPLICATION, demandeFaite: false }),

  44: buildDGFiche({ ficheNum: 44, header: "Absence de restitution du dépôt de garantie — pas d'état des lieux (locataire absent)", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution). L'état des lieux de sortie n'a pas été réalisé, le locataire étant absent.", cadreLegal: CL_AUCUNE_EXPLICATION, demandeFaite: false }),

  45: buildDGFiche({ ficheNum: 45, header: "Absence de restitution du dépôt de garantie — pas d'état des lieux (désaccord)", intro: "Au vu des éléments transmis, le problème concerne l'absence de restitution du dépôt de garantie (caution). L'état des lieux de sortie n'a pas été réalisé, les parties n'ayant pas pu se mettre d'accord.", cadreLegal: CL_AUCUNE_EXPLICATION, demandeFaite: false }),
};

// Clean up the placeholder 10.1 entry
delete (DG_FICHES as any)[10.1];

/**
 * Get a depot garantie fiche by number (5-45).
 * Returns the real content built from PDF data.
 */
export function getDGFiche(ficheNum: number): FicheContent | null {
  return DG_FICHES[ficheNum] ?? null;
}
