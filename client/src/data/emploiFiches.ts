/**
 * Employment / Licenciement Fiches 87-88
 * Content from Retours Juridique PDF.
 */

import type { FicheContent } from "./ficheContent";

export const FICHE_87: FicheContent = {
  header: "Contestation d'un licenciement pour faute simple",
  intro:
    "Au vu des éléments transmis, le problème concerne un licenciement pour faute simple. La procédure a été respectée, mais le motif du licenciement est contesté.",
  cadreLegal: {
    paragraphs: [
      "**Une faute simple suppose :**",
    ],
    bullets: [
      "Un manquement du salarié à ses obligations (ex : erreur, négligence)",
      "D'une gravité suffisante pour justifier un licenciement",
    ],
    reference: "Articles L1235-1 à L1235-6 du code du travail",
  },
  ctaPractitionersHref: "/practitioners?specialty=Droit%20du%20travail",
  steps: [
    {
      title: "Rappel des règles applicables",
      blocks: [
        {
          paragraphs: [
            "Le licenciement doit reposer sur une **cause réelle et sérieuse** :",
          ],
          bullets: [
            "Des faits réels",
            "Précis, concrets et vérifiables",
            "Suffisamment importants pour justifier la rupture du contrat",
          ],
        },
        {
          paragraphs: [
            "L'employeur doit respecter la **procédure du licenciement pour motif personnel** :",
          ],
          bullets: [
            "Convocation à un entretien préalable, soumis à plusieurs conditions (délai entre la convocation et l'entretien, mentions obligatoires, formalités…). À défaut, le licenciement peut être contesté pour irrégularité.",
            "Le salarié reçoit une indemnité de licenciement (si au moins 8 mois d'ancienneté) et une indemnité de congés payés",
            "Un préavis (ou indemnité compensatrice) doit être respecté",
            "Le salarié a droit à l'allocation d'aide au retour à l'emploi (si conditions remplies)",
          ],
        },
        {
          paragraphs: [
            "Même si la procédure est respectée, le salarié peut contester le licenciement si :",
          ],
          bullets: [
            "Les faits ne sont pas établis",
            "Ou ne sont pas suffisamment graves",
          ],
        },
        {
          paragraphs: [
            "**Délai pour agir :** 12 mois pour contester le licenciement (point de départ : notification du licenciement ou réponse de l'employeur si des précisions ont été demandées).",
            "Le licenciement peut être :",
          ],
          bullets: [
            "**Abusif** (sans cause réelle et sérieuse)",
            "Ou **nul** (ex : discrimination, atteinte à une liberté fondamentale comme la liberté de religion, d'expression…)",
          ],
        },
      ],
    },
    {
      title: "Une contestation amiable",
      blocks: [
        {
          bullets: [
            "Contestation par écrit",
            "Courrier recommandé avec accusé de réception",
            "Permet parfois de résoudre le litige à l'amiable",
          ],
          link: {
            label: "J'ai besoin d'aide pour rédiger ma contestation",
            href: "#",
            external: false,
          },
        },
      ],
    },
    {
      title: "Tentative de conciliation devant le Conseil de prud'hommes (CPH)",
      blocks: [
        {
          paragraphs: [
            "Le salarié peut saisir le bureau de conciliation du Conseil de prud'hommes, soit du lieu de travail, soit du lieu où le contrat de travail a été conclu, soit du siège social de l'entreprise.",
            "**Comment faire :**",
          ],
          bullets: [
            "Remplir le formulaire Cerfa n°15586*09",
            "Envoyer la requête par courrier au greffe du CPH, avec : coordonnées du salarié, coordonnées de l'employeur, objet de la demande, exposé des motifs et de ses prétentions, pièces justificatives",
          ],
        },
      ],
    },
    {
      title: "En cas d'échec de la conciliation — Action en justice",
      blocks: [
        {
          paragraphs: [
            "Le juge examine si le licenciement est bien justifié.",
            "**Si le licenciement est justifié** → aucune indemnité supplémentaire.",
            "**Si le licenciement est sans cause réelle et sérieuse :**",
          ],
          bullets: [
            "Réintégration dans l'entreprise (sous conditions), ou",
            "Indemnité pour licenciement injustifié (cette indemnité s'ajoute aux autres sommes déjà dues)",
          ],
        },
      ],
    },
  ],
};

export const FICHE_88: FicheContent = {
  header: "Contestation d'un licenciement pour faute grave",
  intro:
    "Au vu des éléments transmis, le problème concerne un licenciement pour faute grave. La procédure a été respectée, mais le motif du licenciement est contesté.",
  cadreLegal: {
    paragraphs: [
      "**Une faute grave suppose :**",
    ],
    bullets: [
      "Un manquement grave aux obligations du salarié (indiscipline, absences injustifiées, vol, harcèlement…)",
      "D'une gravité telle qu'elle rend impossible le maintien du salarié dans l'entreprise, même pendant la durée du préavis",
    ],
    reference: "Articles L1235-1 à L1235-6 du code du travail",
  },
  ctaPractitionersHref: "/practitioners?specialty=Droit%20du%20travail",
  steps: [
    {
      title: "Rappel des règles applicables",
      blocks: [
        {
          paragraphs: [
            "Le licenciement pour faute grave doit reposer sur une **cause réelle et sérieuse** :",
          ],
          bullets: [
            "Des faits réels",
            "Précis, concrets et vérifiables",
            "Suffisamment graves pour rendre impossible le maintien du salarié dans l'entreprise",
          ],
        },
        {
          paragraphs: [
            "**Conséquences de la faute grave :**",
          ],
          bullets: [
            "Pas de préavis (le contrat est rompu immédiatement)",
            "Pas d'indemnité de licenciement",
            "Le salarié conserve son droit à l'indemnité de congés payés",
            "Le salarié a droit à l'allocation d'aide au retour à l'emploi (si conditions remplies)",
          ],
        },
        {
          paragraphs: [
            "Le salarié peut contester le licenciement si :",
          ],
          bullets: [
            "Les faits ne sont pas établis",
            "Ou ne sont pas suffisamment graves pour constituer une faute grave (requalification possible en faute simple)",
          ],
        },
        {
          paragraphs: [
            "**Délai pour agir :** 12 mois pour contester le licenciement (point de départ : notification du licenciement ou réponse de l'employeur si des précisions ont été demandées).",
            "Le licenciement peut être :",
          ],
          bullets: [
            "**Abusif** (sans cause réelle et sérieuse) — le salarié récupère alors le droit au préavis et à l'indemnité de licenciement",
            "Ou **nul** (ex : discrimination, atteinte à une liberté fondamentale)",
          ],
        },
      ],
    },
    {
      title: "Une contestation amiable",
      blocks: [
        {
          bullets: [
            "Contestation par écrit",
            "Courrier recommandé avec accusé de réception",
            "Permet parfois de résoudre le litige à l'amiable",
          ],
          link: {
            label: "J'ai besoin d'aide pour rédiger ma contestation",
            href: "#",
            external: false,
          },
        },
      ],
    },
    {
      title: "Tentative de conciliation devant le Conseil de prud'hommes (CPH)",
      blocks: [
        {
          paragraphs: [
            "Le salarié peut saisir le bureau de conciliation du Conseil de prud'hommes, soit du lieu de travail, soit du lieu où le contrat de travail a été conclu, soit du siège social de l'entreprise.",
            "**Comment faire :**",
          ],
          bullets: [
            "Remplir le formulaire Cerfa n°15586*09",
            "Envoyer la requête par courrier au greffe du CPH, avec : coordonnées du salarié, coordonnées de l'employeur, objet de la demande, exposé des motifs et de ses prétentions, pièces justificatives",
          ],
        },
      ],
    },
    {
      title: "En cas d'échec de la conciliation — Action en justice",
      blocks: [
        {
          paragraphs: [
            "Le juge examine si le licenciement est bien justifié.",
            "**Si le licenciement est justifié** → aucune indemnité supplémentaire.",
            "**Si le licenciement est sans cause réelle et sérieuse :**",
          ],
          bullets: [
            "Réintégration dans l'entreprise (sous conditions), ou",
            "Indemnité pour licenciement injustifié (cette indemnité s'ajoute aux autres sommes déjà dues)",
            "Le salarié récupère le droit au préavis et à l'indemnité de licenciement",
          ],
        },
      ],
    },
  ],
};

/**
 * Returns the licenciement fiche based on fault type.
 * Only faute_simple (F87) and faute_grave (F88) are available.
 */
export function getLicenciementFiche(typeFaute: string): FicheContent | null {
  if (typeFaute === "faute_simple") return FICHE_87;
  if (typeFaute === "faute_grave") return FICHE_88;
  return null;
}
