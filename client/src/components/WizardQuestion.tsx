import { motion } from "framer-motion";
import { OptionCard } from "@/components/OptionCard";
import { TooltipBubble } from "@/components/TooltipBubble";
import type { WizardStep, WizardOption } from "@/data/wizardTree";
import { cn } from "@/lib/utils";

export interface QuestionTextProps {
  question: string;
  questionTooltipKey?: WizardStep["questionTooltipKey"];
}

export function QuestionText({ question, questionTooltipKey }: QuestionTextProps) {
  if (!questionTooltipKey) return <>{question}</>;
  const termMap: Record<string, string> = {
    personne_physique: "personne physique",
    personne_morale: "personne morale",
    activite_professionnelle: "activité professionnelle",
  };
  const term = termMap[questionTooltipKey];
  if (!term) return <>{question}</>;
  const idx = question.indexOf(term);
  if (idx === -1) return <>{question}</>;
  return (
    <>
      {question.slice(0, idx)}
      {term}
      <TooltipBubble definitionKey={questionTooltipKey} superscript />
      {question.slice(idx + term.length)}
    </>
  );
}

export interface WizardQuestionProps {
  step: WizardStep;
  selectedValue: string | null;
  onSelect: (option: WizardOption) => void;
}

export function WizardQuestion({ step, selectedValue, onSelect }: WizardQuestionProps) {
  const contextLabel = step.contextLabel ?? step.label;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        {contextLabel && (
          <p className="text-sm text-muted-foreground italic">{contextLabel}</p>
        )}
        <h2
          className={cn(
            "text-xl md:text-2xl font-serif font-bold text-primary",
            step.questionNoWrap && "whitespace-nowrap"
          )}
        >
          <QuestionText
            question={step.question}
            questionTooltipKey={step.questionTooltipKey}
          />
        </h2>
        {step.helpText && (
          <p className="text-sm text-muted-foreground">{step.helpText}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {step.options.map((option, index) => (
          <OptionCard
            key={option.value}
            option={option}
            isSelected={selectedValue === option.value}
            onClick={() => onSelect(option)}
            staggerDelay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
}
