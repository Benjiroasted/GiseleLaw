import { motion } from "framer-motion";
import { TooltipBubble } from "@/components/TooltipBubble";
import type { WizardOption } from "@/data/wizardTree";
import { cn } from "@/lib/utils";

export interface OptionCardProps {
  option: WizardOption;
  isSelected?: boolean;
  onClick: () => void;
  /** Stagger delay in seconds for entrance animation */
  staggerDelay?: number;
}

export function OptionCard({ option, isSelected, onClick, staggerDelay = 0 }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: staggerDelay, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-start text-left w-full max-w-[600px] mx-auto rounded-lg border py-4 px-6 transition-all min-h-[48px]",
        "hover:border-primary/80 hover:shadow-md hover:scale-[1.01]",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
          : "border-border bg-background"
      )}
    >
      <span className="flex items-center gap-1.5 font-medium">
        {option.label}
        {option.tooltipKey && (
          <TooltipBubble definitionKey={option.tooltipKey} superscript />
        )}
      </span>
      {option.sublabel && (
        <span className="text-sm text-muted-foreground mt-1">{option.sublabel}</span>
      )}
    </motion.button>
  );
}
