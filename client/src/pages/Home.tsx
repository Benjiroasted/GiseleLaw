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
  Briefcase,
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
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-serif mb-3 text-primary">
              Analysez votre problème
            </h3>
            <p className="text-muted-foreground">
              Répondez à quelques questions simples. Gisèle identifie votre
              situation et vous présente le cadre juridique applicable.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
              <Route className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold font-serif mb-3 text-primary">
              Découvrez vos options
            </h3>
            <p className="text-muted-foreground">
              Qui saisir, quand et comment : accédez à une synthèse claire des
              démarches possibles avant de faire appel à un professionnel.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold font-serif mb-3 text-primary">
              Agissez ou faites-vous accompagner
            </h3>
            <p className="text-muted-foreground">
              Avancez par vous-même ou, si nécessaire, entrez en relation avec
              un avocat adapté à votre situation.
            </p>
          </motion.div>
        </motion.div>

        {/* Comment ça marche Section — with boxed steps */}
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
            <p className="text-muted-foreground max-w-xl mx-auto">
              Trois étapes simples pour comprendre votre situation et savoir
              comment agir.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <MessageCircleQuestion className="h-8 w-8 text-primary" />
              </div>
              <div className="text-sm font-bold text-accent mb-2">Étape 1</div>
              <h3 className="text-lg font-semibold font-serif text-primary mb-2">
                Décrivez votre situation
              </h3>
              <p className="text-sm text-muted-foreground">
                Répondez à un questionnaire adapté à votre cas. Les questions
                s'ajustent en fonction de vos réponses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ListChecks className="h-8 w-8 text-primary" />
              </div>
              <div className="text-sm font-bold text-accent mb-2">Étape 2</div>
              <h3 className="text-lg font-semibold font-serif text-primary mb-2">
                Recevez votre feuille de route
              </h3>
              <p className="text-sm text-muted-foreground">
                Gisèle rappelle le cadre légal applicable à votre situation et
                vous indique les démarches possibles et les délais applicables.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FileSearch className="h-8 w-8 text-primary" />
              </div>
              <div className="text-sm font-bold text-accent mb-2">Étape 3</div>
              <h3 className="text-lg font-semibold font-serif text-primary mb-2">
                Agissez ou trouvez un avocat
              </h3>
              <p className="text-sm text-muted-foreground">
                Suivez les étapes vous-même — la plupart sont gratuites — ou
                connectez-vous avec un professionnel spécialisé.
              </p>
            </motion.div>
          </div>

          {/* CTA after "Comment ça marche" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/procedure/new/wizard">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary/90 text-white"
              >
                Commencer le questionnaire
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Bandeau "Vous êtes avocat ?" — entrée plateforme côté professionnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24 rounded-3xl border border-border/60 bg-card overflow-hidden"
        >
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 md:max-w-2xl">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                  Vous êtes avocat&nbsp;?
                </p>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-primary mb-2">
                  Recevez des demandes déjà qualifiées
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Gisèle pré-qualifie les justiciables avec un questionnaire dédié.
                  Vous recevez des dossiers structurés (situation, cadre légal, démarches
                  déjà engagées) plutôt que des prises de contact à froid.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/avocats">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 rounded-full"
                >
                  En savoir plus
                </Button>
              </Link>
              <Link href="/avocats/inscription">
                <Button
                  size="lg"
                  className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 text-white"
                >
                  Créer mon espace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Trust/Disclaimer Section — updated messaging */}
        <div className="mt-16 bg-primary/5 rounded-3xl p-8 md:p-12 text-center">
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
