/**
 * Maps procedure types and answers to human-readable labels and resolution timelines.
 */

import type { ProcedureAnswers } from "@shared/schema";

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: "done" | "current" | "upcoming";
  /** ISO date string, if known */
  date?: string;
  /** Reminder text, if applicable */
  reminderText?: string;
  /** Days until deadline (for reminders) */
  daysUntilDeadline?: number;
}

export interface ProcedureInfo {
  label: string;
  ficheNumber: number | null;
  ficheLabel: string;
  category: "civil" | "immobilier" | "travail" | "autre";
  timelineSteps: TimelineStep[];
}

/** Get a human-readable label for the procedure type */
function getProcedureLabel(type: string, answers: ProcedureAnswers): string {
  if (type === "contrat_vente_non_paye") {
    const amount = answers.amount === "less_5000" ? "< 5 000€" : "> 5 000€";
    return `Vente non payée — ${amount}`;
  }
  if (type === "depot_garantie") {
    return "Dépôt de garantie non restitué";
  }
  if (type === "licenciement") {
    const faute = answers.empTypeFaute === "faute_simple"
      ? "faute simple"
      : answers.empTypeFaute === "faute_grave"
        ? "faute grave"
        : "faute lourde";
    return `Contestation de licenciement — ${faute}`;
  }
  return "Procédure en cours";
}

function getCategory(type: string): ProcedureInfo["category"] {
  if (type === "contrat_vente_non_paye") return "civil";
  if (type === "depot_garantie") return "immobilier";
  if (type === "licenciement") return "travail";
  return "autre";
}

/** Build the resolution timeline based on procedure type and whether MED was done */
function buildTimeline(type: string, answers: ProcedureAnswers): TimelineStep[] {
  const now = new Date();

  if (type === "contrat_vente_non_paye") {
    const hasMED = answers.miseEnDemeure === true;
    const steps: TimelineStep[] = [
      {
        id: "questionnaire",
        title: "Questionnaire complété",
        description: "Fiche juridique générée",
        status: "done",
      },
    ];

    if (!hasMED) {
      steps.push({
        id: "med",
        title: "Mise en demeure amiable",
        description: "Envoyer un courrier RAR pour demander le paiement",
        status: "current",
        reminderText: "Envoyez votre mise en demeure",
      });
      steps.push({
        id: "conciliation",
        title: "Tentative de conciliation ou médiation",
        description: answers.amount === "less_5000"
          ? "Obligatoire si montant < 5 000€"
          : "Facultatif si montant > 5 000€",
        status: "upcoming",
      });
    } else {
      steps.push({
        id: "med",
        title: "Mise en demeure envoyée",
        description: "En attente de réponse",
        status: "done",
      });
      steps.push({
        id: "conciliation",
        title: "Tentative de conciliation ou médiation",
        description: answers.amount === "less_5000"
          ? "Obligatoire si montant < 5 000€"
          : "Facultatif si montant > 5 000€",
        status: "current",
      });
    }

    if (answers.amount === "less_5000") {
      steps.push({
        id: "petites_creances",
        title: "Procédure simplifiée de recouvrement",
        description: "Via un commissaire de justice",
        status: "upcoming",
      });
    }

    steps.push({
      id: "injonction",
      title: "Injonction de payer",
      description: "Demande au greffe du tribunal judiciaire (Cerfa n°12948)",
      status: "upcoming",
    });

    steps.push({
      id: "action_juge",
      title: "Action devant le juge",
      description: "Prescription : 5 ans (article 2224 du code civil)",
      status: "upcoming",
    });

    return steps;
  }

  if (type === "depot_garantie") {
    const hasMED = answers.dgDemandeRestitution === true;
    const steps: TimelineStep[] = [
      {
        id: "questionnaire",
        title: "Questionnaire complété",
        description: "Fiche juridique générée",
        status: "done",
      },
    ];

    if (!hasMED) {
      steps.push({
        id: "med",
        title: "Mise en demeure amiable",
        description: "Courrier RAR au propriétaire pour demander la restitution",
        status: "current",
        reminderText: "Envoyez votre mise en demeure au propriétaire",
      });
    } else {
      steps.push({
        id: "med",
        title: "Mise en demeure envoyée",
        description: "En attente de réponse du propriétaire",
        status: "done",
      });
    }

    steps.push({
      id: "conciliation",
      title: "Tentative de conciliation ou médiation",
      description: "Commission départementale de conciliation ou médiateur",
      status: hasMED ? "current" : "upcoming",
    });

    steps.push({
      id: "injonction",
      title: "Injonction de payer",
      description: "Cerfa n°12948 au greffe du tribunal judiciaire",
      status: "upcoming",
    });

    steps.push({
      id: "action_juge",
      title: "Action devant le juge",
      description: "Juge du Contentieux de la Protection — Prescription : 3 ans",
      status: "upcoming",
    });

    return steps;
  }

  if (type === "licenciement") {
    const steps: TimelineStep[] = [
      {
        id: "questionnaire",
        title: "Questionnaire complété",
        description: "Fiche juridique générée",
        status: "done",
      },
      {
        id: "contestation",
        title: "Contestation amiable",
        description: "Courrier RAR à l'employeur",
        status: "current",
        reminderText: "Rédigez votre contestation — délai de 12 mois",
        daysUntilDeadline: 365,
      },
      {
        id: "cph",
        title: "Conseil de prud'hommes — conciliation",
        description: "Bureau de conciliation du CPH (Cerfa n°15586*09)",
        status: "upcoming",
      },
      {
        id: "action_justice",
        title: "Action en justice",
        description: "Si échec de la conciliation — le juge examine le licenciement",
        status: "upcoming",
      },
    ];
    return steps;
  }

  // Fallback
  return [
    {
      id: "questionnaire",
      title: "Questionnaire complété",
      description: "Fiche juridique générée",
      status: "done",
    },
  ];
}

/** Get full procedure info for display */
export function getProcedureInfo(
  type: string,
  answers: ProcedureAnswers,
  ficheNumber: number | null = null
): ProcedureInfo {
  return {
    label: getProcedureLabel(type, answers),
    ficheNumber,
    ficheLabel: ficheNumber ? `Fiche ${ficheNumber}` : "",
    category: getCategory(type),
    timelineSteps: buildTimeline(type, answers),
  };
}

/** Get reminders from all procedures */
export interface Reminder {
  procedureId: number;
  procedureTitle: string;
  text: string;
  urgency: "high" | "medium" | "info";
  dueDate?: string;
}

export function getRemindersFromProcedures(
  procedures: Array<{ id: number; title: string; type: string; answers: Record<string, unknown> }>
): Reminder[] {
  const reminders: Reminder[] = [];

  for (const proc of procedures) {
    const info = getProcedureInfo(proc.type, proc.answers as ProcedureAnswers);

    for (const step of info.timelineSteps) {
      if (step.status === "current" && step.reminderText) {
        reminders.push({
          procedureId: proc.id,
          procedureTitle: info.label,
          text: step.reminderText,
          urgency: step.daysUntilDeadline && step.daysUntilDeadline < 30
            ? "high"
            : step.daysUntilDeadline && step.daysUntilDeadline < 90
              ? "medium"
              : "info",
        });
      }
    }
  }

  return reminders;
}

/** Category badge color mapping */
export function getCategoryColor(category: ProcedureInfo["category"]): string {
  switch (category) {
    case "civil": return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    case "immobilier": return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    case "travail": return "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
    default: return "bg-muted text-muted-foreground";
  }
}

export function getCategoryLabel(category: ProcedureInfo["category"]): string {
  switch (category) {
    case "civil": return "Droit civil";
    case "immobilier": return "Droit immobilier";
    case "travail": return "Droit du travail";
    default: return "Autre";
  }
}
