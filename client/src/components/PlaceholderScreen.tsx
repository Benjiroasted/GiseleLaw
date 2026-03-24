import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, Briefcase } from "lucide-react";

export interface PlaceholderScreenProps {
  onModify: () => void;
}

export function PlaceholderScreen({ onModify }: PlaceholderScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-md mx-auto"
    >
      <div className="rounded-full bg-muted p-4 mb-6">
        <Lock className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-3">
        Cette procédure sera bientôt disponible
      </h1>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Nous travaillons à enrichir nos parcours juridiques.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button variant="outline" onClick={onModify} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Modifier mes réponses
        </Button>
        <Link href="/practitioners">
          <Button className="gap-2">
            <Briefcase className="h-4 w-4" />
            Trouver un avocat
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
