import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateProcedure, useUpdateProcedure, useProcedure } from "@/hooks/use-procedures";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Types matching schema logic
type WizardData = {
  type?: 'unpaid_work' | 'ip';
  status?: 'employee' | 'freelance'; // If unpaid_work
  ipType?: 'copyright' | 'trademark' | 'patent'; // If ip
  hasProof?: 'yes' | 'no'; // If ip
  date?: string; // The crucial date for calculations
  title?: string;
};

// Wizard Steps Configuration
const STEPS = [
  { id: 'type', title: "Nature du litige" },
  { id: 'details', title: "Détails" },
  { id: 'date', title: "Dates clés" },
  { id: 'summary', title: "Récapitulatif" },
];

export default function Wizard() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/procedure/:id/wizard");
  const isNew = match && params?.id === "new";
  const procedureId = match && !isNew ? parseInt(params!.id) : undefined;
  
  const { toast } = useToast();
  const createProcedure = useCreateProcedure();
  const updateProcedure = useUpdateProcedure();
  const { data: procedure, isLoading: isLoadingProcedure } = useProcedure(procedureId || 0);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardData>({});
  
  // Load existing data if editing
  useEffect(() => {
    if (procedure && procedure.answers) {
      setAnswers(procedure.answers as WizardData);
      // Rough logic to restore step could go here, but starting at 0 is safe
    }
  }, [procedure]);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: answers.title || `Procédure du ${new Date().toLocaleDateString()}`,
        type: answers.type || 'unpaid_work',
        answers: answers,
        status: 'in_progress'
      };

      if (isNew) {
        const result = await createProcedure.mutateAsync(payload);
        setLocation(`/procedure/${result.id}/result`);
      } else if (procedureId) {
        await updateProcedure.mutateAsync({ id: procedureId, ...payload });
        setLocation(`/procedure/${procedureId}/result`);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la procédure. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const updateAnswer = (key: keyof WizardData, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  if (!isNew && isLoadingProcedure) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Determine completion percentage
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        {/* Progress Header */}
        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
            <span>Étape {step + 1} sur {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <h2 className="text-2xl font-serif font-bold text-primary">
            {STEPS[step].title}
          </h2>
        </div>

        {/* Wizard Content */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8 min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                {/* STEP 0: TYPE SELECTION */}
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-lg">Quel est le sujet de votre problème juridique ?</Label>
                      <p className="text-sm text-muted-foreground">Sélectionnez la catégorie qui correspond le mieux à votre situation.</p>
                    </div>
                    
                    <RadioGroup 
                      value={answers.type} 
                      onValueChange={(val) => updateAnswer('type', val)}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div className={`flex items-start space-x-3 space-y-0 rounded-xl border p-4 cursor-pointer transition-all hover:border-primary ${answers.type === 'unpaid_work' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}>
                        <RadioGroupItem value="unpaid_work" id="unpaid" className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="unpaid" className="text-base font-semibold cursor-pointer">Travail et Rémunération</Label>
                          <p className="text-sm text-muted-foreground">Salaires impayés, factures non réglées, primes manquantes.</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-start space-x-3 space-y-0 rounded-xl border p-4 cursor-pointer transition-all hover:border-primary ${answers.type === 'ip' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}>
                        <RadioGroupItem value="ip" id="ip" className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="ip" className="text-base font-semibold cursor-pointer">Propriété Intellectuelle</Label>
                          <p className="text-sm text-muted-foreground">Contrefaçon, droit d'auteur, utilisation non autorisée de vos créations.</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* STEP 1: DETAILS (Branching Logic) */}
                {step === 1 && (
                  <div className="space-y-6">
                    {answers.type === 'unpaid_work' ? (
                      <>
                        <div className="space-y-2">
                          <Label className="text-lg">Quel est votre statut ?</Label>
                        </div>
                        <RadioGroup 
                          value={answers.status} 
                          onValueChange={(val) => updateAnswer('status', val)}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-slate-50">
                            <RadioGroupItem value="employee" id="employee" />
                            <Label htmlFor="employee" className="flex-1 cursor-pointer">Je suis salarié(e)</Label>
                          </div>
                          <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-slate-50">
                            <RadioGroupItem value="freelance" id="freelance" />
                            <Label htmlFor="freelance" className="flex-1 cursor-pointer">Je suis travailleur indépendant / Freelance</Label>
                          </div>
                        </RadioGroup>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label className="text-lg">Quel type de droit est concerné ?</Label>
                        </div>
                        <RadioGroup 
                          value={answers.ipType} 
                          onValueChange={(val) => updateAnswer('ipType', val)}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-slate-50">
                            <RadioGroupItem value="copyright" id="copyright" />
                            <Label htmlFor="copyright" className="flex-1 cursor-pointer">Droit d'auteur (œuvre artistique, texte, code...)</Label>
                          </div>
                          <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-slate-50">
                            <RadioGroupItem value="trademark" id="trademark" />
                            <Label htmlFor="trademark" className="flex-1 cursor-pointer">Marque déposée</Label>
                          </div>
                        </RadioGroup>

                        <div className="pt-4 space-y-2">
                          <Label className="text-lg">Avez-vous des preuves de votre antériorité ?</Label>
                          <p className="text-sm text-muted-foreground">Dépôt légal, enveloppe Soleau, fichiers sources datés, etc.</p>
                          <RadioGroup 
                            value={answers.hasProof} 
                            onValueChange={(val) => updateAnswer('hasProof', val)}
                            className="flex gap-4 pt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="proof-yes" />
                              <Label htmlFor="proof-yes">Oui</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="proof-no" />
                              <Label htmlFor="proof-no">Non / Incertain</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* STEP 2: DATES */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-lg">
                        {answers.type === 'unpaid_work' 
                          ? "Depuis quelle date le paiement est-il dû ?" 
                          : "À quelle date avez-vous découvert l'atteinte à vos droits ?"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Cette date est essentielle pour calculer les délais de prescription.
                      </p>
                      <Input
                        type="date"
                        className="h-12 text-lg"
                        value={answers.date || ''}
                        onChange={(e) => updateAnswer('date', e.target.value)}
                      />
                    </div>

                    <div className="pt-4 space-y-4">
                      <Label className="text-lg">Donnez un nom à ce dossier</Label>
                      <Input
                        type="text"
                        placeholder="Ex: Facture Client X ou Contrefaçon Logo"
                        className="h-12"
                        value={answers.title || ''}
                        onChange={(e) => updateAnswer('title', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: SUMMARY */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-primary">Tout est prêt !</h3>
                    <p className="text-muted-foreground">
                      Voici un résumé des informations saisies. Cliquez sur "Générer mon plan d'action" pour obtenir votre calendrier juridique.
                    </p>

                    <div className="bg-slate-50 p-6 rounded-xl border space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium text-right">
                          {answers.type === 'unpaid_work' ? 'Travail non payé' : 'Propriété Intellectuelle'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Détail</span>
                        <span className="font-medium text-right">
                          {answers.type === 'unpaid_work' 
                            ? (answers.status === 'employee' ? 'Salarié' : 'Indépendant')
                            : (answers.ipType === 'copyright' ? "Droit d'auteur" : "Marque")
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date clé</span>
                        <span className="font-medium text-right">
                          {answers.date ? format(new Date(answers.date), 'dd MMMM yyyy', { locale: fr }) : 'Non renseignée'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-auto pt-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 0}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={
                  (step === 0 && !answers.type) ||
                  (step === 2 && !answers.date) ||
                  createProcedure.isPending || 
                  updateProcedure.isPending
                }
                className="min-w-[140px]"
              >
                {createProcedure.isPending || updateProcedure.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : step === STEPS.length - 1 ? (
                  <>
                    Générer mon plan
                    <Save className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Suivant
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
