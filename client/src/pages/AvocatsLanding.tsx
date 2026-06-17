import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Inbox,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { FaqSection } from "@/components/FaqSection";
import { LAWYER_FAQ_GENERAL, LAWYER_FAQ_SUBSCRIPTIONS } from "@/data/faqContent";

interface PricingTier {
  name: string;
  tagline: string;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Découverte",
    tagline: "Inscription gratuite, paiement à l'unité",
    ctaLabel: "Créer mon espace",
    ctaHref: "/avocats/inscription",
    features: [
      "Inscription gratuite et création de votre profil",
      "Réception de demandes ciblées selon votre expertise et votre zone géographique",
      "Libre de sélectionner les demandes qui vous intéressent",
      "Paiement uniquement lorsque vous proposez votre accompagnement",
      "Les demandes sont envoyées à plusieurs avocats : la réactivité est clé",
      "Mise en relation via la plateforme, puis gestion directe et autonome avec votre client",
    ],
  },
  {
    name: "Essentiel",
    tagline: "Un abonnement mensuel pour maîtriser votre budget",
    ctaLabel: "Bientôt disponible",
    ctaHref: "/avocats/inscription",
    features: [
      "Abonnement mensuel incluant un nombre défini de réponses",
      "Une fois ce quota atteint, paiement à l'unité pour chaque réponse supplémentaire",
      "Réception de demandes ciblées selon votre expertise et votre zone géographique",
      "Permet de maîtriser votre budget et votre volume de dossiers",
      "Mise en relation via la plateforme, puis gestion directe et autonome avec votre client",
    ],
  },
  {
    name: "Pro",
    tagline: "Réponses illimitées pour une activité soutenue",
    ctaLabel: "Bientôt disponible",
    ctaHref: "/avocats/inscription",
    badge: "Recommandé",
    highlighted: true,
    features: [
      "Abonnement mensuel avec réponses illimitées",
      "Priorité d'affichage de vos réponses auprès des utilisateurs",
      "Réception de demandes ciblées selon votre expertise et votre zone géographique",
      "Adapté à une activité soutenue et régulière",
      "Mise en relation via la plateforme, puis gestion directe et autonome avec votre client",
    ],
  },
  {
    name: "Cabinet",
    tagline: "Pour plusieurs avocats d'un même cabinet",
    ctaLabel: "Nous contacter",
    ctaHref: "mailto:contact@gisele.law?subject=Plan%20Cabinet",
    features: [
      "Abonnement mensuel pour plusieurs avocats",
      "Réponses illimitées pour l'ensemble du cabinet",
      "Tarif préférentiel par avocat, dégressif selon le nombre d'utilisateurs",
      "Accès partagé aux demandes et organisation libre en interne",
      "Pensé pour structurer et développer l'activité du cabinet",
    ],
  },
];

interface HowItWorksStep {
  icon: typeof ClipboardList;
  title: string;
  text: string;
  bullets?: string[];
}

const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    icon: ClipboardList,
    title: "Des demandes clarifiées en amont",
    text: "Les utilisateurs décrivent leur situation juridique ou leur besoin d'éclairage via un questionnaire guidé. Gisèle leur fournit une synthèse du cadre légal applicable et des démarches envisageables, notamment celles pouvant être réalisées de manière autonome. Ce travail en amont permet :",
    bullets: [
      "d'écarter certaines situations pouvant se résoudre sans accompagnement",
      "de mieux qualifier les demandes nécessitant l'intervention d'un professionnel",
      "de vous donner une première vision du domaine concerné et du contexte",
    ],
  },
  {
    icon: Inbox,
    title: "Inscrivez-vous et recevez des demandes ciblées",
    text: "Pour accéder aux demandes, vous créez votre profil sur Gisèle. L'inscription comprend une vérification de votre qualité d'avocat, puis la configuration de votre profil (domaines d'intervention, zone géographique, modalités d'intervention…), après avoir choisi l'abonnement qui vous convient le mieux. Une fois votre profil actif, vous recevez des demandes correspondant à votre expertise et pouvez choisir d'y répondre en proposant votre accompagnement.",
  },
  {
    icon: Handshake,
    title: "Entrez en relation et exercez librement",
    text: "Si un utilisateur souhaite poursuivre avec vous, la mise en relation se fait simplement via la plateforme pour un premier échange. La suite de la relation (rendez-vous, conseil, procédure, honoraires) se déroule ensuite directement entre vous et votre client, selon vos pratiques habituelles. Gisèle n'intervient pas dans la gestion du dossier.",
  },
];

export default function AvocatsLanding() {
  useEffect(() => {
    document.title = "Gisèle.law — Espace avocats";
    window.scrollTo({ top: 0, behavior: "auto" });
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
            Des demandes{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-500">
              déjà clarifiées
            </span>
            ,<br />
            directement dans votre domaine d'expertise
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Gisèle structure en amont les situations via un questionnaire guidé.
            Vous recevez alors des demandes qualifiées, avec une vision claire du
            contexte et du cadre juridique, et pouvez proposer votre
            accompagnement si le dossier vous correspond.
          </p>
        </motion.div>

        {/* ── Comment ça marche ───────────────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Comment ça marche&nbsp;?
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
                className="bg-card border border-border/60 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-primary leading-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.text}
                </p>
                {step.bullets && (
                  <ul className="mt-3 space-y-1.5">
                    {step.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
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

        {/* ── FAQ avocats ─────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Questions fréquentes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tout ce qu'il faut savoir sur le fonctionnement de la plateforme
              et les abonnements.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-10">
            <div>
              <h3 className="text-lg font-serif font-bold text-primary mb-2">
                La plateforme
              </h3>
              <FaqSection items={LAWYER_FAQ_GENERAL} idPrefix="lawyer-faq" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-primary mb-2">
                Les abonnements
              </h3>
              <FaqSection
                items={LAWYER_FAQ_SUBSCRIPTIONS}
                idPrefix="lawyer-faq-subs"
              />
            </div>
          </div>
        </section>

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
      <div className="mb-5">
        <h3 className="font-serif font-bold text-primary text-xl mb-1">
          {tier.name}
        </h3>
        <p className="text-xs text-muted-foreground min-h-[2.5em]">
          {tier.tagline}
        </p>
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
