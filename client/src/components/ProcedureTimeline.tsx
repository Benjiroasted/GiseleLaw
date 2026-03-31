import { cn } from "@/lib/utils";
import { Check, Circle, Clock } from "lucide-react";
import type { TimelineStep } from "@/data/procedureHelpers";

interface ProcedureTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function ProcedureTimeline({ steps, className }: ProcedureTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Vertical line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />

      <div className="space-y-1">
        {steps.map((step, i) => (
          <div key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
            {/* Dot */}
            <div className="relative z-10 flex-shrink-0 mt-0.5">
              {step.status === "done" ? (
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              ) : step.status === "current" ? (
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-primary/30">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Circle className="w-3 h-3 text-muted-foreground/40" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.status === "done" && "text-foreground",
                  step.status === "current" && "text-primary",
                  step.status === "upcoming" && "text-muted-foreground"
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {step.description}
              </p>
              {step.date && (
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {step.date}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
