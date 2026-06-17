import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/data/faqContent";

interface FaqSectionProps {
  items: FaqItem[];
  /** Préfixe d'identifiant pour éviter les collisions de valeurs entre plusieurs accordéons. */
  idPrefix?: string;
  className?: string;
}

/**
 * Liste de questions/réponses repliables, réutilisable côté utilisateurs et avocats.
 */
export function FaqSection({ items, idPrefix = "faq", className }: FaqSectionProps) {
  return (
    <Accordion type="single" collapsible className={className}>
      {items.map((item, i) => (
        <AccordionItem key={`${idPrefix}-${i}`} value={`${idPrefix}-${i}`}>
          <AccordionTrigger className="text-left font-serif font-semibold text-primary">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            <div className="space-y-3">
              {item.answer.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
              {item.bullets && (
                <ul className="list-disc pl-5 space-y-1">
                  {item.bullets.map((b, k) => (
                    <li key={k}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
