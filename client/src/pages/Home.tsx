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
              Gisèle analyse votre situation juridique, vous présente les actions
              possibles et vous guide pas à pas. Avant d'avoir besoin d'un
              avocat, vous pouvez déjà agir — simplement et gratuitement.
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
              situation juridique et vous dit si une action est possible.
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
              Qui saisir, quand et comment : obtenez une feuille de route claire
              avec les démarches gratuites à tenter avant de faire appel à un
              professionnel.
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
              Suivez les étapes vous-même ou trouvez un avocat spécialisé.
              La plupart des premières démarches sont simples et gratuites.
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
                Gisèle vous indique les démarches possibles, les délais
                applicables et les textes de loi. Qui saisir, quand et comment.
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
                Commencer ma procédure
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Trust/Disclaimer Section — updated messaging */}
        <div className="mt-24 bg-primary/5 rounded-3xl p-8 md:p-12 text-center">
          <Scale className="h-12 w-12 text-primary mx-auto mb-6 opacity-20" />
          <h2 className="text-2xl font-serif font-bold text-primary mb-4">
            Information juridique, pas conseil personnalisé
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Gisèle vous aide à comprendre qui saisir, quand et comment. Ce
            n'est pas du conseil personnalisé sur la stratégie de votre dossier
            — pour cela, un avocat reste indispensable. Notre mission : rendre
            le droit accessible pour que chacun puisse agir en connaissance de
            cause.
          </p>
        </div>
      </div>
    </Layout>
  );
}
