import { Link } from "wouter";
import { useEffect } from "react";
import {
  ArrowRight,
  Scale,
  Search,
  Route,
  Users,
  MessageCircleQuestion,
  ListChecks,
  FileSearch,
  ClipboardList,
  Inbox,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";

export default function Home() {
  useEffect(() => {
    document.title = "Gisèle.law — Simplifiez vos démarches juridiques";
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const scrollToHowItWorks = () => {
    const section = document.getElementById("comment-ca-marche");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-12 md:py-24">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Le droit accessible à tous
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-primary tracking-tight mb-6">
              Simplifiez vos <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-500">
                démarches juridiques
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Décrivez votre situation en quelques questions : Gisèle vous
              fournit une synthèse claire du cadre légal et des actions
              envisageables, puis vous oriente vers un avocat si besoin.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/procedure/new/wizard">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary/90 text-white"
              >
                Analyser ma situation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-full border-2 hover:bg-accent/5 hover:text-accent hover:border-accent/50 transition-all"
              onClick={scrollToHowItWorks}
            >
              Comment ça marche ?
            </Button>
          </motion.div>
        </div>

        {/* Features Grid — repositioned value proposition */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div
            variants={item}
            className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-serif text-primary">
                Analysez votre problème
              </h3>
            </div>
            <p className="text-muted-foreground">
              Répondez à quelques questions simples. Gisèle identifie votre
              situation et vous présente le cadre juridique applicable.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Route className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold font-serif text-primary">
                Découvrez vos options
              </h3>
            </div>
            <p className="text-muted-foreground">
              Qui saisir, quand et comment : accédez à une synthèse claire des
              démarches possibles avant de faire appel à un professionnel.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold font-serif text-primary">
                Agissez ou faites-vous accompagner
              </h3>
            </div>
            <p className="text-muted-foreground">
              Avancez par vous-même ou, si nécessaire, entrez en relation avec
              un avocat adapté à votre situation.
            </p>
          </motion.div>
        </motion.div>

        {/* Comment ça marche Section — split en deux parcours (justiciables / avocats) */}
        <div id="comment-ca-marche" className="mt-24 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Gisèle connecte deux mondes : les justiciables qui cherchent à
              comprendre leurs droits, et les avocats qui reçoivent des
              dossiers déjà qualifiés. Découvrez les deux parcours.
            </p>
          </motion.div>

          {/* Deux blocs côte à côte : particuliers/entreprises | avocats */}
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* ── Bloc 1 : Particuliers & entreprises ─────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-border/60 bg-card overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="mb-3">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-primary leading-tight">
                    Pour les particuliers ou les entreprises :
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Comprendre votre situation, connaître vos droits et savoir
                  comment agir — seul ou accompagné.
                </p>

                <div className="flex flex-col gap-4 flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-background/60 p-5 rounded-2xl border border-border/50"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="shrink-0 w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                        <MessageCircleQuestion className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-accent">
                          Étape 1
                        </div>
                        <h4 className="text-base font-semibold font-serif text-primary leading-tight">
                          Décrivez votre situation
                        </h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Répondez à un questionnaire adapté à votre cas. Les
                      questions s'ajustent en fonction de vos réponses.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="bg-background/60 p-5 rounded-2xl border border-border/50"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="shrink-0 w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                        <ListChecks className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-accent">
                          Étape 2
                        </div>
                        <h4 className="text-base font-semibold font-serif text-primary leading-tight">
                          Recevez votre feuille de route
                        </h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Gisèle rappelle le cadre légal applicable et vous
                      indique les démarches possibles ainsi que les délais à
                      respecter.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-background/60 p-5 rounded-2xl border border-border/50"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="shrink-0 w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                        <FileSearch className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-accent">
                          Étape 3
                        </div>
                        <h4 className="text-base font-semibold font-serif text-primary leading-tight">
                          Agissez ou trouvez un avocat
                        </h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Suivez les étapes vous-même — la plupart sont gratuites
                      — ou connectez-vous avec un professionnel spécialisé.
                    </p>
                  </motion.div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-3">
                  <Link href="/faq" className="flex-1">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 px-6 rounded-full"
                    >
                      En savoir plus
                    </Button>
                  </Link>
                  <Link href="/procedure/new/wizard" className="flex-1">
                    <Button
                      size="lg"
                      className="w-full h-12 px-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary/90 text-white"
                    >
                      Commencer le questionnaire
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* ── Bloc 2 : Avocats ────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl border-2 border-accent/30 bg-accent/5 overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="mb-3">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-primary leading-tight">
                    Pour les avocats :
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Recevez des dossiers déjà structurés, par spécialité et par
                  zone géographique — sans prise de contact à froid.
                </p>

                <div className="flex flex-col gap-4 flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-background/80 p-5 rounded-2xl border border-border/50"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="shrink-0 w-11 h-11 bg-accent/15 rounded-xl flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-accent">
                          Étape 1
                        </div>
                        <h4 className="text-base font-semibold font-serif text-primary leading-tight">
                          Des demandes qualifiées en amont
                        </h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Des particuliers et professionnels décrivent leur
                      situation via un questionnaire structuré. Chaque demande
                      est clarifiée en amont (contexte, cadre juridique, besoin),
                      pour vous permettre d'intervenir sur des dossiers
                      pertinents.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="bg-background/80 p-5 rounded-2xl border border-border/50"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="shrink-0 w-11 h-11 bg-accent/15 rounded-xl flex items-center justify-center">
                        <Inbox className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-accent">
                          Étape 2
                        </div>
                        <h4 className="text-base font-semibold font-serif text-primary leading-tight">
                          Inscrivez-vous et recevez des dossiers ciblés
                        </h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Créez votre profil et définissez vos domaines
                      d'intervention. Vous recevez des demandes correspondant à
                      votre expertise et pouvez choisir d'y répondre en
                      proposant un accompagnement.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-background/80 p-5 rounded-2xl border border-border/50"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="shrink-0 w-11 h-11 bg-accent/15 rounded-xl flex items-center justify-center">
                        <Handshake className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-accent">
                          Étape 3
                        </div>
                        <h4 className="text-base font-semibold font-serif text-primary leading-tight">
                          Entrez en relation simplement
                        </h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Échangez avec les utilisateurs intéressés en quelques
                      clics. La relation se poursuit ensuite directement entre
                      vous et votre client, selon vos modalités habituelles.
                    </p>
                  </motion.div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-3">
                  <Link href="/avocats" className="flex-1">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 px-6 rounded-full border-accent/40 hover:bg-accent/10 hover:text-accent hover:border-accent"
                    >
                      En savoir plus
                    </Button>
                  </Link>
                  <Link href="/avocats/inscription" className="flex-1">
                    <Button
                      size="lg"
                      className="w-full h-12 px-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary/90 text-white"
                    >
                      Créer mon espace
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust/Disclaimer Section — updated messaging */}
        <div className="mt-24 bg-primary/5 rounded-3xl p-8 md:p-12 text-center">
          <Scale className="h-12 w-12 text-primary mx-auto mb-6 opacity-20" />
          <h2 className="text-2xl font-serif font-bold text-primary mb-4">
            Information juridique générale, pas de conseil personnalisé
          </h2>
          <div className="text-muted-foreground max-w-2xl mx-auto leading-relaxed space-y-4">
            <p>
              Gisèle fournit, à partir de vos réponses, une synthèse automatisée
              du cadre légal et des démarches possibles.
            </p>
            <p>
              Ces informations sont générales et ne constituent pas un conseil
              juridique personnalisé ni une recommandation stratégique.
            </p>
            <p>
              Pour obtenir un accompagnement personnalisé à votre situation, il
              est recommandé de consulter un avocat. Gisèle vous aide en vous
              mettant en relation avec un professionnel.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
