import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStepProps {
  title: string;
  description: string;
  date?: string;
  isCompleted?: boolean;
  isLast?: boolean;
  delay?: number;
}

export function TimelineStep({ title, description, date, isCompleted, isLast, delay = 0 }: TimelineStepProps) {
  return (
    <div 
      className="relative flex gap-6 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Line connecting steps */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-border group-last:hidden" />
      )}

      {/* Icon */}
      <div className="relative z-10 flex-none">
        <div className={cn(
          "w-10 h-10 rounded-full border-2 flex items-center justify-center bg-background transition-colors duration-300",
          isCompleted 
            ? "border-primary text-primary" 
            : "border-muted-foreground/30 text-muted-foreground/30"
        )}>
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-10 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
          <h3 className={cn(
            "text-lg font-semibold font-serif leading-none",
            isCompleted ? "text-foreground" : "text-muted-foreground"
          )}>
            {title}
          </h3>
          {date && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-accent">
              <Clock className="w-4 h-4" />
              <span>{date}</span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
