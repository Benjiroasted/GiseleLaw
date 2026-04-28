import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  ShieldCheck,
  FileSearch,
  CheckCircle2,
  Sparkles,
  Users,
  ClipboardList,
  Inbox,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";

interface PricingTier {
  name: string;
  tagline: string;
  price: string;
  priceUnit?: string;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Découverte",
    tagline: "Pour tester la plateforme",
    price: "0\u00a0€",
    priceUnit: "Gratuit pendant la phase pilote",
    ctaLabel: "Créer mon espace",
    ctaHref: "/avocats/inscription",
    features: [
      "Profil public dans l'annuaire",
      "Vérification CNB systématique",
      "Réception des demandes qualifiées",
      "Dashboard basique (rappels, dossiers)",
      "Sans engagement",
    ],
  },
  {
    name: "Cabinet",
    tagline: "Pour les avocats en exercice individuel",
    price: "49\u00a0€",
    priceUnit: "/ avocat / mois HT",
    ctaLabel: "Bientôt disponible",
    ctaHref: "/avocats/inscription",
    features: [
      "Tout de Découverte",
      "Prises de contact illimitées",
      "Profil enrichi (photo, témoignages)",
      "Calendrier de réservation en ligne",
      "Statistiques de conversion",
    ],
  },
  {
    name: "Premium",
    tagline: "Pour développer votre clientèle",
    price: "99\u00a0€",
    priceUnit: "/ avocat / mois HT",
    ctaLabel: "Bientôt disponible",
    ctaHref: "/avocats/inscription",
    badge: "Recommandé",
    highlighted: true,
    features: [
      "Tout de Cabinet",
      "Mise en avant locale (top 3 par spécialité)",
      "Suivi des dossiers (timeline, rappels)",
      "Branding personnalisé",
      "Support prioritaire",
    ],
  },
  {
    name: "Enterprise",
    tagline: "Pour les cabinets multi-avocats",
    price: "Sur devis",
    priceUnit: "À partir de 5 collaborateurs",
    ctaLabel: "Nous contacter",
    ctaHref: "mailto:contact@gisele.law?subject=Plan%20Enterprise",
    features: [
      "Tout de Premium",
      "Comptes multi-collaborateurs",
      "API d'intégration",
      "Account manager dédié",
      "SLA contractuel",
    ],
  },
];

const HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    title: "Le justiciable qualifie son dossier",
    text: "Il répond à un questionnaire juridique guidé qui structure sa situation, identifie le cadre légal applicable et les démarches déjà engagées.",
  },
  {
    icon: Inbox,
    title: "Vous recevez les dossiers pertinents",
    text: "Filtrage automatique par spécialité, ville et éligibilité à l'aide juridictionnelle. Vous ne voyez que ce qui correspond à votre pratique.",
  },
  {
    icon: Handshake,
    title: "Vous prenez contact en un clic",
    text: "Le contexte est déjà documenté : situation, pièces, délais. Vous engagez la relation client directement, sans perte de temps en pré-qualification.",
  },
];

export default function AvocatsLanding() {
  useEffect(() => {
    document.title = "Gisèle.law — Espace avocats";
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 md:py-20">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6">
            <Briefcase className="h-4 w-4" />
            Espace professionnels
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-primary tracking-tight mb-6 leading-tight">
            Des prospects{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-500">
              déjà qualifiés
            </span>
            <br />
            arrivent dans votre cabinet
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Gisèle pré-structure les dossiers via un questionnaire juridique guidé.
            Vous recevez la situation, le cadre légal applicable, et les démarches
            déjà engagées par le justiciable — pas une simple demande de contact.
          </p>
        </motion.div>

        {/* ── Comment ça marche ───────────────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Comment ça marche
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trois étapes, du questionnaire client à la mise en relation. Vous
              gardez le contrôle, Gisèle pré-qualifie.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative bg-card border border-border/60 rounded-2xl p-6"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-serif font-bold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Pricing ─────────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Choisissez votre formule
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm">
              <Sparkles className="h-4 w-4" />
              Tous les plans sont gratuits pendant la phase pilote
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <PricingCard tier={tier} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Trust strip ─────────────────────────────────────────────── */}
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 mb-12">
          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex md:items-start gap-4 flex-col md:flex-row items-center">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-primary mb-1">
                  Vérification CNB
                </h4>
                <p className="text-sm text-muted-foreground">
                  Chaque inscription est croisée avec l'annuaire officiel du
                  Conseil National des Barreaux.
                </p>
              </div>
            </div>
            <div className="flex md:items-start gap-4 flex-col md:flex-row items-center">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileSearch className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-primary mb-1">
                  Dossiers structurés
                </h4>
                <p className="text-sm text-muted-foreground">
                  Vous recevez la situation, le cadre légal et les démarches
                  déjà engagées — pas de demandes vagues.
                </p>
              </div>
            </div>
            <div className="flex md:items-start gap-4 flex-col md:flex-row items-center">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-primary mb-1">
                  Mise en relation ciblée
                </h4>
                <p className="text-sm text-muted-foreground">
                  Filtrage par spécialité, ville et aide juridictionnelle pour
                  des prospects pertinents.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Final CTA ───────────────────────────────────────────────── */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-6">
            Prêt à recevoir vos premiers dossiers&nbsp;?
          </h2>
          <Link href="/avocats/inscription">
            <Button
              size="lg"
              className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary/90 text-white"
            >
              Créer mon espace avocat
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            Vérification CNB sous 24-48h. Sans engagement.
          </p>
        </div>
      </div>
    </Layout>
  );
}

/**
 * Full-height pricing card for the pricing grid.
 * Highlighted = visually emphasized (used for the "Recommandé" tier).
 */
function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={
        tier.highlighted
          ? "h-full rounded-2xl p-6 border-2 border-primary bg-primary/5 relative flex flex-col shadow-lg shadow-primary/10"
          : "h-full rounded-2xl p-6 border border-border bg-card flex flex-col"
      }
    >
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
          {tier.badge}
        </div>
      )}
      <div className="mb-4">
        <h3 className="font-serif font-bold text-primary text-xl mb-1">
          {tier.name}
        </h3>
        <p className="text-xs text-muted-foreground min-h-[2.5em]">
          {tier.tagline}
        </p>
      </div>
      <div className="mb-5">
        <div className="font-bold text-primary text-3xl leading-none">
          {tier.price}
        </div>
        {tier.priceUnit && (
          <div className="text-xs text-muted-foreground mt-1">
            {tier.priceUnit}
          </div>
        )}
      </div>
      <ul className="space-y-2 mb-6 flex-1">
        {tier.features.map((feat) => (
          <li
            key={feat}
            className="flex items-start gap-2 text-sm text-foreground/90"
          >
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
      <Link href={tier.ctaHref}>
        <Button
          variant={tier.highlighted ? "default" : "outline"}
          size="sm"
          className={
            tier.highlighted
              ? "w-full bg-primary hover:bg-primary/90 text-white"
              : "w-full"
          }
        >
          {tier.ctaLabel}
        </Button>
      </Link>
    </div>
  );
}
