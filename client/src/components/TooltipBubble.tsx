import * as React from "react";
import { useState, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LEGAL_DEFINITIONS, type LegalDefinitionKey } from "@/data/legalDefinitions";
import { cn } from "@/lib/utils";

function renderDefinitionText(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

export interface TooltipBubbleProps {
  definitionKey: LegalDefinitionKey;
  className?: string;
  superscript?: boolean;
}

export function TooltipBubble({ definitionKey, className, superscript }: TooltipBubbleProps) {
  const definition = LEGAL_DEFINITIONS[definitionKey];
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!definition) return null;

  const isOpen = pinned || hovered;

  const handleMouseEnter = () => {
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
      leaveTimeout.current = null;
    }
    setHovered(true);
  };

  const handleMouseLeave = () => {
    leaveTimeout.current = setTimeout(() => {
      setHovered(false);
    }, 150);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPinned((prev) => !prev);
  };

  return (
    <span
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
      onMouseDown={(e) => { e.stopPropagation(); }}
      className={cn("inline-block", superscript && "align-middle ml-1.5")}
    >
      <Popover open={isOpen} onOpenChange={(open) => { if (!open) setPinned(false); }}>
        <PopoverTrigger asChild>
          <span
            role="button"
            tabIndex={0}
            className={cn(
              "inline-flex items-center justify-center rounded-md bg-primary/10 text-primary font-semibold cursor-pointer hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors select-none",
              superscript ? "w-5 h-5 text-xs" : "w-6 h-6 text-sm",
              className
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onMouseDown={(e) => { e.stopPropagation(); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setPinned((prev) => !prev);
              }
            }}
          >
            ?
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="max-w-sm text-sm text-popover-foreground"
          side="top"
          align="start"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => { e.stopPropagation(); }}
          onOpenAutoFocus={(e) => { e.preventDefault(); }}
        >
          <p className="leading-relaxed">{renderDefinitionText(definition)}</p>
        </PopoverContent>
      </Popover>
    </span>
  );
}
