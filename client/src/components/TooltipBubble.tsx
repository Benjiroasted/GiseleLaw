import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import { LEGAL_DEFINITIONS, type LegalDefinitionKey } from "@/data/legalDefinitions";
import { cn } from "@/lib/utils";

/**
 * Renders a term with a small circled (?) icon. On click/tap, opens a popover with the legal definition.
 */
function renderDefinitionText(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

export interface TooltipBubbleProps {
  /** Key into LEGAL_DEFINITIONS */
  definitionKey: LegalDefinitionKey;
  /** Optional class for the wrapper span */
  className?: string;
  /** Render as superscript (exponent) next to a term */
  superscript?: boolean;
}

export function TooltipBubble({ definitionKey, className, superscript }: TooltipBubbleProps) {
  const definition = LEGAL_DEFINITIONS[definitionKey];
  if (!definition) return null;

  return (
    <span
      onClick={(e) => {
        // Stop event propagation so clicking the tooltip doesn't trigger parent button
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseDown={(e) => {
        // Also stop on mousedown to prevent button activation
        e.stopPropagation();
      }}
      className={cn("inline-block", superscript && "align-super")}
    >
      <Popover>
        <PopoverTrigger asChild>
          <span
            role="button"
            tabIndex={0}
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-muted-foreground/50 bg-muted/50 text-muted-foreground font-medium cursor-help hover:bg-muted hover:border-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 align-middle ml-0.5",
              superscript ? "w-3 h-3 -translate-y-1" : "w-4 h-4",
              className
            )}
            onClick={(e) => {
              // Stop event propagation so clicking the tooltip doesn't trigger parent button
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              // Also stop on mousedown to prevent button activation
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget as HTMLElement).click();
              }
            }}
          >
            <HelpCircle className={cn(superscript ? "w-2 h-2" : "w-2.5 h-2.5")} />
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="max-w-sm text-sm text-popover-foreground"
          side="top"
          align="start"
          onClick={(e) => {
            // Stop event propagation on popover content too
            e.stopPropagation();
          }}
        >
          <p className="leading-relaxed">{renderDefinitionText(definition)}</p>
        </PopoverContent>
      </Popover>
    </span>
  );
}
