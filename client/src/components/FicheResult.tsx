import { Link } from "wouter";
import type { FicheContent, FicheLink } from "@/data/ficheContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase, ArrowDown } from "lucide-react";

function autoLinkText(text: string): string {
  let result = text.replace(
    /\b(articles?\s+[A-Z]?\d[\w\-\.]*(?:\s+(?:à|et)\s+[A-Z]?\d[\w\-\.]*)?)\s+(du\s+(?:code\s+(?:civil|de\s+procédure\s+civile|du\s+travail|pénal)|la\s+loi\s+n°?\s*[\d\-]+[^)]*?))/gi,
    (match, articlePart, codePart) => {
      const query = encodeURIComponent(`${articlePart} ${codePart}`);
      return `[LINK:https://www.legifrance.gouv.fr/search/all?tab_selection=all&searchField=ALL&query=${query}]${articlePart} ${codePart}[/LINK]`;
    }
  );
  result = result.replace(
    /\b((?:conciliateurs|commissaire-justice|legifrance\.gouv)\.fr)\b/gi,
    (match) => `[LINK:https://www.${match}]${match}[/LINK]`
  );
  result = result.replace(
    /\b(\d+\s*€|\d+\s*euros?|gratuit(?:e)?|payant(?:e)?|obligatoire|majoration\s+de\s+\d+%)/gi,
    (match) => `**${match}**`
  );
  return result;
}

function renderBoldItalic(text: string, baseKey: number): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  const boldParts = text.split(/\*\*(.*?)\*\*/g);
  boldParts.forEach((part, i) => {
    if (i % 2 === 1) {
      elements.push(<strong key={`b${baseKey}-${i}`}>{part}</strong>);
    } else {
      const italicParts = part.split(/\*(.*?)\*/g);
      italicParts.forEach((ip, j) => {
        if (j % 2 === 1) {
          elements.push(<em key={`i${baseKey}-${i}-${j}`} className="text-muted-foreground text-xs">{ip}</em>);
        } else if (ip) {
          elements.push(ip);
        }
      });
    }
  });
  return elements;
}

function renderFormattedText(text: string): React.ReactNode {
  const processed = autoLinkText(text);
  const elements: React.ReactNode[] = [];
  let remaining = processed;
  let key = 0;
  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[LINK:(.*?)\](.*?)\[\/LINK\]/);
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) {
        elements.push(...renderBoldItalic(remaining.slice(0, linkMatch.index), key));
        key += 10;
      }
      elements.push(
        <a key={`link-${key++}`} href={linkMatch[1]} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline font-medium">
          {linkMatch[2]}
        </a>
      );
      key += 10;
      remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
    } else {
      elements.push(...renderBoldItalic(remaining, key));
      break;
    }
  }
  return elements;
}

function FicheLinkEl({ link }: { link: FicheLink }) {
  const props = link.external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
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
              <p className="text-xs text-muted-foreground italic mt-2">{renderFormattedText(fiche.cadreLegal.reference)}</p>
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
                      {block.paragraphs?.map((p, i) => (<p key={i} className="text-sm leading-relaxed text-foreground">{renderFormattedText(p)}</p>))}
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
