import { Link } from "wouter";
import type { FicheContent, FicheLink } from "@/data/ficheContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase, ArrowDown } from "lucide-react";

function renderBoldItalic(text: string, baseKey: number = 0): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  const boldParts = text.split(/\*\*(.*?)\*\*/g);
  boldParts.forEach((part, i) => {
    if (i % 2 === 1) {
      elements.push(<strong key={`b${baseKey}-${i}`}>{part}</strong>);
    } else if (part) {
      elements.push(part);
    }
  });
  return elements;
}

function legifranceUrl(ref: string): string {
  return `https://www.legifrance.gouv.fr/search/all?tab_selection=all&searchField=ALL&query=${encodeURIComponent(ref)}`;
}

function renderFormattedText(text: string): React.ReactNode {
  // Auto-bold euro amounts
  let processed = text.replace(
    /(?<!\*)\b(\d+\s*€)\b(?!\*)/gi,
    (m) => `**${m}**`
  );

  // Regex for article references: handles "du code..." AND "de la loi..."
  const articleRegex = /(articles?\s+[A-Z]?\d[\w\-\.]*(?:\s+(?:à|et)\s+[A-Z]?\d[\w\-\.]*)?)\s+((?:du|de\s+la)\s+(?:code\s+(?:civil|de\s+procédure\s+civile|du\s+travail|pénal)|loi\s+n°?\s*[\d\-]+(?:\s+du\s+\d+\s+\w+\s+\d+)?))/gi;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match;

  articleRegex.lastIndex = 0;
  while ((match = articleRegex.exec(processed)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...renderBoldItalic(processed.slice(lastIndex, match.index), key));
      key += 100;
    }
    const fullRef = match[0];
    parts.push(
      <a key={`art-${key++}`} href={legifranceUrl(fullRef)} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline font-medium">
        {fullRef}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < processed.length) {
    parts.push(...renderBoldItalic(processed.slice(lastIndex), key));
  }

  if (parts.length === 0) {
    return renderBoldItalic(processed, 0);
  }
  return parts;
}

function FicheLinkEl({ link }: { link: FicheLink }) {
  const isExternal = link.external || link.href.startsWith("http");
  const props = isExternal ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
  return (
    <a href={link.href} {...props} className="text-primary underline hover:no-underline font-medium">
      {link.label}
    </a>
  );
}

export interface FicheResultProps { fiche: FicheContent; }

export function FicheResult({ fiche }: FicheResultProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">{fiche.header}</h1>
        <p className="text-muted-foreground leading-relaxed">{fiche.intro}</p>
      </div>

      {fiche.cadreLegal && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold text-primary">Rappel du cadre légal</h2>
          </CardHeader>
          <CardContent className="space-y-2">
            {fiche.cadreLegal.paragraphs.map((p: string, i: number) => (
              <p key={i} className="text-sm leading-relaxed text-foreground">{renderFormattedText(p)}</p>
            ))}
            {fiche.cadreLegal.bullets && (
              <ul className="list-disc list-inside text-sm space-y-1 text-foreground ml-2">
                {fiche.cadreLegal.bullets.map((b: string, i: number) => (<li key={i}>{renderFormattedText(b)}</li>))}
              </ul>
            )}
            {fiche.cadreLegal.reference && (
              <p className="text-xs text-muted-foreground mt-2">{renderFormattedText(fiche.cadreLegal.reference)}</p>
            )}
          </CardContent>
        </Card>
      )}

      {fiche.steps.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-serif font-bold text-primary">Étapes de résolution</h2>
            <ArrowDown className="h-5 w-5 text-primary/40" />
          </div>
          <div className="space-y-6 relative">
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-primary/10 hidden md:block" />
            {fiche.steps.map((step, stepIdx) => (
              <Card key={stepIdx} className="border-border/60 relative md:ml-12">
                <div className="absolute -left-12 top-6 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">{stepIdx + 1}</div>
                <CardHeader className="pb-2">
                  <h2 className="text-lg font-semibold text-primary font-serif">{renderFormattedText(step.title)}</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {step.blocks.map((block, blockIdx) => (
                    <div key={blockIdx} className="space-y-2">
                      {block.paragraphs?.map((p, i) => (
                        <p key={i} className="text-sm leading-relaxed text-foreground">{renderFormattedText(p)}</p>
                      ))}
                      {block.bullets && (
                        <ul className="list-disc list-inside text-sm space-y-1 text-foreground ml-2">
                          {block.bullets.map((b, i) => (<li key={i}>{renderFormattedText(b)}</li>))}
                        </ul>
                      )}
                      {block.link && (<p className="text-sm"><FicheLinkEl link={block.link} /></p>)}
                      {block.note && (<p className="text-sm text-muted-foreground italic">{renderFormattedText(block.note)}</p>)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="font-semibold text-primary mb-4">Avez-vous besoin d&apos;un avocat ?</p>
          <Link href={fiche.ctaPractitionersHref}>
            <Button className="gap-2"><Briefcase className="h-4 w-4" />Trouver un avocat</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
