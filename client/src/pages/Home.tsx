import { Link } from "wouter";
import { ArrowRight, Scale, ShieldCheck, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
              Votre guide juridique intelligent
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-primary tracking-tight mb-6">
              Simplifiez vos <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-500">
                démarches juridiques
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Gisèle vous accompagne pas à pas pour comprendre vos droits, calculer vos délais et préparer vos dossiers. 
              Simple, rapide, et accessible.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/procedure/new">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary/90 text-white">
                Démarrer une procédure
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-accent/5 hover:text-accent hover:border-accent/50 transition-all">
              Comment ça marche ?
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div variants={item} className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-serif mb-3 text-primary">Droits clairs</h3>
            <p className="text-muted-foreground">
              Comprenez immédiatement si votre situation justifie une action en justice grâce à notre questionnaire intelligent.
            </p>
          </motion.div>

          <motion.div variants={item} className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold font-serif mb-3 text-primary">Délais calculés</h3>
            <p className="text-muted-foreground">
              Ne manquez jamais une date limite. Nous calculons automatiquement les délais de prescription et de procédure.
            </p>
          </motion.div>

          <motion.div variants={item} className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
              <FileText className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold font-serif mb-3 text-primary">Dossier prêt</h3>
            <p className="text-muted-foreground">
              Obtenez une feuille de route détaillée et les modèles de documents nécessaires pour avancer sereinement.
            </p>
          </motion.div>
        </motion.div>

        {/* Trust/Disclaimer Section */}
        <div className="mt-24 bg-primary/5 rounded-3xl p-8 md:p-12 text-center">
          <Scale className="h-12 w-12 text-primary mx-auto mb-6 opacity-20" />
          <h2 className="text-2xl font-serif font-bold text-primary mb-4">Une aide à la décision</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Gisèle ne remplace pas un avocat. Notre mission est de démocratiser l'accès à l'information juridique 
            pour vous permettre de prendre les bonnes décisions au bon moment.
          </p>
        </div>
      </div>
    </Layout>
  );
}
