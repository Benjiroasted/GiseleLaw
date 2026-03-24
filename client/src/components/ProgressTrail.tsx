import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export interface TrailAnswer {
  stepId: string;
  chipLabel: string;
}

export interface ProgressTrailProps {
  /** Completed steps with chip labels (in order) */
  answers: TrailAnswer[];
  /** Current step id (the one being answered; no chip yet) */
  currentStepId: string | null;
  /** Estimated total steps for fill % (e.g. path length + 1) */
  estimatedTotal: number;
  /** Click on a chip (or dot on mobile) to go back to that step */
  onBackToStep: (stepId: string) => void;
  /** Optional class for container */
  className?: string;
}

export function ProgressTrail({
  answers,
  currentStepId,
  estimatedTotal,
  onBackToStep,
  className,
}: ProgressTrailProps) {
  const isMobile = useIsMobile();
  const [mobileTooltipStepId, setMobileTooltipStepId] = useState<string | null>(null);

  const completedCount = answers.length;
  const fillPercent = estimatedTotal > 0 ? (completedCount / estimatedTotal) * 100 : 0;

  if (isMobile) {
    return (
      <div
        className={cn("flex flex-col items-center w-10 shrink-0 sticky top-24", className)}
        style={{ minHeight: 120 }}
      >
        {/* Vertical track */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-muted-foreground/20 rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-primary rounded-full"
            style={{ originY: 0 }}
            initial={false}
            animate={{ height: `${fillPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Dots + optional tooltip */}
        <div className="relative flex flex-col items-center gap-4 py-2">
          {answers.map((a) => (
            <div key={a.stepId} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  if (mobileTooltipStepId === a.stepId) {
                    onBackToStep(a.stepId);
                    setMobileTooltipStepId(null);
                  } else {
                    setMobileTooltipStepId(a.stepId);
                  }
                }}
                className="relative z-10 w-3 h-3 rounded-full bg-primary border-2 border-primary shrink-0 hover:scale-110 transition-transform"
                aria-label={a.chipLabel}
              />
              <AnimatePresence>
                {mobileTooltipStepId === a.stepId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-20 px-3 py-2 rounded-md bg-popover border shadow-md text-xs font-medium whitespace-nowrap"
                  >
                    {a.chipLabel}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {currentStepId && (
            <motion.div
              className="relative z-10 w-3.5 h-3.5 rounded-full border-2 border-primary bg-primary/20 shrink-0"
              animate={{ opacity: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>
    );
  }

  // Desktop: track + fill + dots + chips
  return (
    <div
      className={cn("flex flex-col items-stretch w-40 shrink-0 sticky top-24", className)}
      style={{ minHeight: 200 }}
    >
      <div className="relative flex-1 flex flex-col">
        {/* Track line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/30 rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-b from-primary/80 to-primary rounded-full"
            style={{ originY: 0 }}
            initial={false}
            animate={{ height: `${fillPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Unfilled segment (dashed / fade) */}
        <div
          className="absolute left-3 top-0 w-0.5 bg-muted-foreground/20 rounded-full border-l border-dashed"
          style={{ top: `${fillPercent}%`, bottom: 0 }}
        />

        <div className="relative flex flex-col gap-6 py-1">
          {answers.map((a) => (
            <div key={a.stepId} className="flex items-center gap-3 min-h-[28px]">
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary shrink-0" />
              <button
                type="button"
                onClick={() => onBackToStep(a.stepId)}
                className="text-left text-xs font-medium text-foreground bg-muted/50 hover:bg-muted px-2 py-1.5 rounded truncate max-w-[140px] cursor-pointer transition-colors"
              >
                {a.chipLabel}
              </button>
            </div>
          ))}
          {currentStepId && (
            <div className="flex items-center gap-3 min-h-[28px]">
              <motion.div
                className="w-3.5 h-3.5 rounded-full border-2 border-primary bg-primary/20 shrink-0"
                animate={{ opacity: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                —
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
