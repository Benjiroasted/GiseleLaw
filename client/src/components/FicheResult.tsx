import { Link } from "wouter";
import type { FicheContent, FicheLink } from "@/data/ficheContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase, ArrowDown } from "lucide-react";

/**
 * Renders text with **bold** and *italic* markers.
 * **text** → <strong>, *text* → <em>
 */
function renderFormattedText(text: string): React.ReactNode {
  // First split on **bold**
  const boldParts = text.split(/\*\*(.*?)\*\*/g);
  const elements: React.ReactNode[] = [];

  boldParts.forEach((part, i) => {
    if (i % 2 === 1) {
      // Bold segment — check for italic inside
      elements.push(<strong key={`b${i}`}>{part}</strong>);
    } else {
      // Regular segment — check for *italic*
      const italicParts = part.split(/\*(.*?)\*/g);
      italicParts.forEach((ip, j) => {
        if (j % 2 === 1) {
          elements.push(
            <em key={`i${i}-${j}`} className="text-muted-foreground text-xs">
              {ip}
            </em>
          );
        } else {
          elements.push(ip);
        }
      });
    }
  });

  return elements;
}

function FicheLinkEl({ link }: { link: FicheLink }) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:no-underline font-medium"
      >
        {link.label}
      </a>
    );
  }
  return (
    <a
      href={link.href}
      className="text-primary underline hover:no-underline font-medium"
    >
      {link.label}
    </a>
  );
}

export interface FicheResultProps {
  fiche: FicheContent;
}

export function FicheResult({ fiche }: FicheResultProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">
          {fiche.header}
        </h1>
        <p className="text-muted-foreground leading-relaxed">{fiche.intro}</p>
      </div>

      {/* Rappel du cadre légal */}
      {fiche.cadreLegal && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold text-primary">
              Rappel du cadre légal
            </h2>
          </CardHeader>
          <CardContent className="space-y-2">
            {fiche.cadreLegal.paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground">
                {renderFormattedText(p)}
              </p>
            ))}
            {fiche.cadreLegal.bullets && (
              <ul className="list-disc list-inside text-sm space-y-1 text-foreground ml-2">
                {fiche.cadreLegal.bullets.map((b, i) => (
                  <li key={i}>{renderFormattedText(b)}</li>
                ))}
              </ul>
            )}
            {fiche.cadreLegal.reference && (
              <p className="text-xs text-muted-foreground italic mt-2">
                {fiche.cadreLegal.reference}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Étapes de résolution header */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-serif font-bold text-primary">
          Étapes de résolution
        </h2>
        <ArrowDown className="h-5 w-5 text-primary/40" />
      </div>

      {/* Steps */}
      <div className="space-y-6 relative">
        {/* Vertical line connecting steps */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-primary/10 hidden md:block" />

        {fiche.steps.map((step, stepIdx) => (
          <Card
            key={stepIdx}
            className="border-border/60 relative md:ml-12"
          >
            {/* Step number circle */}
            <div className="absolute -left-12 top-6 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">
              {stepIdx + 1}
            </div>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold text-primary">
                {step.title}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {step.blocks.map((block, blockIdx) => (
                <div key={blockIdx} className="space-y-2">
                  {block.paragraphs?.map((p, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-foreground"
                    >
                      {renderFormattedText(p)}
                    </p>
                  ))}
                  {block.bullets && (
                    <ul className="list-disc list-inside text-sm space-y-1 text-foreground ml-2">
                      {block.bullets.map((b, i) => (
                        <li key={i}>{renderFormattedText(b)}</li>
                      ))}
                    </ul>
                  )}
                  {block.link && (
                    <p className="text-sm">
                      <FicheLinkEl link={block.link} />
                    </p>
                  )}
                  {block.note && (
                    <p className="text-sm text-muted-foreground italic">
                      {block.note}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="font-semibold text-primary mb-4">
            Avez-vous besoin d'un avocat ?
          </p>
          <Link href={fiche.ctaPractitionersHref}>
            <Button className="gap-2">
              <Briefcase className="h-4 w-4" />
              Trouver un avocat
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
