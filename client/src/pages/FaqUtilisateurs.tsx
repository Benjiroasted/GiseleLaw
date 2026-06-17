import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { FaqSection } from "@/components/FaqSection";
import { USER_FAQ } from "@/data/faqContent";

export default function FaqUtilisateurs() {
  useEffect(() => {
    document.title = "Gisèle.law — Questions fréquentes";
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6">
            <MessageCircleQuestion className="h-4 w-4" />
            Particuliers & entreprises
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-primary tracking-tight mb-6 leading-tight">
            Comment fonctionne Gisèle&nbsp;?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comprendre votre situation, connaître vos droits et savoir comment
            agir. Voici les réponses aux questions les plus fréquentes.
          </p>
        </motion.div>

        <FaqSection items={USER_FAQ} idPrefix="user-faq" className="mb-12" />

        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-primary mb-6">
            Prêt à comprendre votre situation&nbsp;?
          </h2>
          <Link href="/procedure/new/wizard">
            <Button
              size="lg"
              className="h-12 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary/90 text-white"
            >
              Commencer le questionnaire
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
