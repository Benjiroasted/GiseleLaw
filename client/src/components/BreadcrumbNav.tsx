import { cn } from "@/lib/utils";
import {
  BREADCRUMB_SECTIONS,
  getSectionForStep,
  getCompletedSections,
} from "@/data/wizardTree";

export interface BreadcrumbNavProps {
  answeredStepIds: string[];
  currentStepId: string | null;
  className?: string;
}

export function BreadcrumbNav({
  answeredStepIds,
  currentStepId,
  className,
}: BreadcrumbNavProps) {
  const completedSections = getCompletedSections(answeredStepIds);
  const currentSection = currentStepId
    ? getSectionForStep(currentStepId)
    : null;

  return (
    <div
      className={cn(
        "flex items-center gap-1 flex-wrap text-xs px-4 py-2",
        className
      )}
    >
      {BREADCRUMB_SECTIONS.map((section, i) => {
        const isCompleted = completedSections.has(section.id);
        const isCurrent = section.id === currentSection;
        const isFuture = !isCompleted && !isCurrent;

        return (
          <div key={section.id} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-muted-foreground/40 text-[10px] mx-0.5">
                ›
              </span>
            )}
            <span
              className={cn(
                "transition-colors",
                isCurrent &&
                  "font-medium px-2 py-0.5 rounded-full bg-accent/15 text-accent",
                isCompleted && !isCurrent && "font-medium text-primary",
                isFuture && "text-muted-foreground/50"
              )}
            >
              {section.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
