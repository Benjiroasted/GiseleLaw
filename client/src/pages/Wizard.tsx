import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateProcedure, useUpdateProcedure, useProcedure } from "@/hooks/use-procedures";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getStep,
  getFirstStepId,
  getChipLabel,
  PLACEHOLDER_NEXT,
  STEP_CRIMINAL_BLOCK,
  SUMMARY_STEP_ID,
  type WizardStep,
  type WizardOption,
} from "@/data/wizardTree";
import { WizardQuestion } from "@/components/WizardQuestion";
import { PlaceholderScreen } from "@/components/PlaceholderScreen";
import { WizardSummary } from "@/components/WizardSummary";
import { ProgressTrail } from "@/components/ProgressTrail";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ProcedureAnswers } from "@shared/schema";

const STEP_ID_TO_ANSWER_KEY: Record<string, string> = {
  step_1: "callerType",
  step_1b: "moraleSubType",
  step_2: "context",
  step_3: "isCriminal",
  step_3b: "criminalSituation",
  step_3c: "criminalClarification",
  step_3_opponent: "opponentType",
  step_doc: "documentOfficiel",
  step_doc_emp: "documentOfficiel",
  step_doc_type: "documentType",
  step_4: "disputeCategory",
  step_4_immo: "immoCategory",
  step_4_immo_role: "immoRole",
  step_4_loc: "locataireProbleme",
  step_4_prop: "proprietaireProbleme",
  step_4_emploi: "emploiCategory",
  step_5: "agreementType",
  step_6: "problemType",
  step_6a: "problemDetail",
  step_6b: "problemDetail",
  step_6c: "problemDetail",
  step_7: "amount",
  step_8: "miseEnDemeure",
  // Depot garantie mappings
  dg_edl: "dgEtatDesLieux",
  dg_c1_degradations: "dgDegradations",
  dg_c1_d_delai: "dgDelaiCles",
  dg_c1_c_delai: "dgDelaiCles",
  dg_c1_d_raison: "dgRaisonProprio",
  dg_c1_c_raison: "dgRaisonProprio",
  dg_c1_d_deg_justif: "dgJustifications",
  dg_c1_d_deg_conteste: "dgContesteJustif",
  dg_c1_d_deg_cont_dem: "dgDemandeRestitution",
  dg_c1_d_deg_nojust_dem: "dgDemandeRestitution",
  dg_c1_d_loy_impayes: "dgLoyersImpayes",
  dg_c1_d_loy_montant: "dgMontantProportionne",
  dg_c1_d_loy_disp_dem: "dgDemandeRestitution",
  dg_c1_d_loy_non_dem: "dgDemandeRestitution",
  dg_c1_d_auc_dem: "dgDemandeRestitution",
  dg_c1_c_deg_justif: "dgJustifications",
  dg_c1_c_deg_oui_dem: "dgDemandeRestitution",
  dg_c1_c_deg_non_dem: "dgDemandeRestitution",
  dg_c1_c_loy_impayes: "dgLoyersImpayes",
  dg_c1_c_loy_montant: "dgMontantProportionne",
  dg_c1_c_loy_disp_dem: "dgDemandeRestitution",
  dg_c1_c_loy_non_dem: "dgDemandeRestitution",
  dg_c1_c_auc_dem: "dgDemandeRestitution",
  dg_c2_contestation: "dgContestation",
  dg_c2_deg_delai: "dgDelaiCles",
  dg_c2_deg_justif: "dgJustifications",
  dg_c2_deg_oui_dem: "dgDemandeRestitution",
  dg_c2_deg_non_dem: "dgDemandeRestitution",
  dg_c2_mont_delai: "dgDelaiCles",
  dg_c2_mont_justif: "dgJustifications",
  dg_c2_mont_oui_dem: "dgDemandeRestitution",
  dg_c2_mont_non_dem: "dgDemandeRestitution",
  dg_c2_deux_delai: "dgDelaiCles",
  dg_c2_deux_justif: "dgJustifications",
  dg_c2_deux_oui_dem: "dgDemandeRestitution",
  dg_c2_deux_non_dem: "dgDemandeRestitution",
  dg_c3_raison: "dgAbsenceRaison",
  // Employment / licenciement mappings
  emp_fin_contrat: "empFinContrat",
  emp_situation: "empSituation",
  emp_motif: "empMotif",
  emp_type_faute: "empTypeFaute",
  emp_procedure: "empProcedure",
};

function transformAnswerValue(stepId: string, value: string): unknown {
  if (stepId === "step_3") {
    if (value === "oui") return true;
    if (value === "non") return false;
    return value; // "je_ne_sais_pas" stays as string
  }
  if (stepId === "step_8") return value === "oui";
  if (stepId === "step_doc" || stepId === "step_doc_emp") return value === "oui";
  // Depot garantie boolean fields
  if (stepId === "dg_c1_degradations") return value === "oui";
  if (stepId.startsWith("dg_") && stepId.includes("_justif") && !stepId.includes("conteste")) return value === "oui";
  if (stepId.startsWith("dg_") && stepId.includes("_conteste")) return value === "oui";
  if (stepId.startsWith("dg_") && stepId.includes("_dem")) return value === "oui";
  if (stepId.startsWith("dg_") && stepId.includes("_impayes")) return value === "oui";
  if (stepId.startsWith("dg_") && stepId.includes("_montant")) return value === "oui";
  return value;
}

function answersArrayToProcedureAnswers(
  answers: Array<{ stepId: string; selectedValue: string }>
): ProcedureAnswers {
  const out: Record<string, unknown> = {};
  for (const { stepId, selectedValue } of answers) {
    const key = STEP_ID_TO_ANSWER_KEY[stepId];
    if (key) (out as any)[key] = transformAnswerValue(stepId, selectedValue);
  }
  return out as ProcedureAnswers;
}

function estimateRemainingSteps(currentStepId: string): number {
  let count = 0;
  let id: string = currentStepId;
  const seen = new Set<string>();
  while (!seen.has(id)) {
    seen.add(id);
    const step = getStep(id);
    if (!step || step.options.length === 0) break;
    const first = step.options[0];
    if (first.next === PLACEHOLDER_NEXT || first.next === SUMMARY_STEP_ID) break;
    count++;
    id = first.next === STEP_CRIMINAL_BLOCK ? "step_3b" : first.next;
  }
  return count;
}

const PLACEHOLDER_SCREEN_ID = "__placeholder__";

export default function Wizard() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/procedure/:id/wizard");
  const isNew = match && params?.id === "new";
  const procedureId = match && !isNew ? parseInt(params!.id, 10) : undefined;

  const { toast } = useToast();
  const createProcedure = useCreateProcedure();
  const updateProcedure = useUpdateProcedure();
  const { data: procedure, isLoading: isLoadingProcedure } = useProcedure(procedureId ?? 0);

  const [answers, setAnswers] = useState<Array<{ stepId: string; selectedValue: string; chipLabel: string }>>([]);
  const [currentStepId, setCurrentStepId] = useState<string>(getFirstStepId());
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [pendingSelection, setPendingSelection] = useState<string | null>(null);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isNew && procedure?.answers) {
      const a = procedure.answers as ProcedureAnswers;
      const arr: Array<{ stepId: string; selectedValue: string; chipLabel: string }> = [];
      let stepId = getFirstStepId();
      while (stepId && stepId !== SUMMARY_STEP_ID && stepId !== PLACEHOLDER_SCREEN_ID) {
        const step = getStep(stepId);
        if (!step) break;
        const key = STEP_ID_TO_ANSWER_KEY[stepId];
        const raw = key ? (a as any)[key] : undefined;
        if (raw === undefined || raw === null) break;
        const value =
          stepId === "step_3" || stepId === "step_8" ? (raw ? "oui" : "non") : String(raw);
        const option = step.options.find((o) => o.value === value);
        if (!option) break;
        arr.push({ stepId, selectedValue: option.value, chipLabel: getChipLabel(option) });
        const next = option.next;
        if (next === PLACEHOLDER_NEXT) {
          setCurrentStepId(PLACEHOLDER_SCREEN_ID);
          setAnswers(arr);
          return;
        }
        if (next === STEP_CRIMINAL_BLOCK) stepId = "step_3b";
        else if (next === SUMMARY_STEP_ID) {
          setCurrentStepId(SUMMARY_STEP_ID);
          setAnswers(arr);
          return;
        } else stepId = next;
      }
      setAnswers(arr);
      setCurrentStepId(stepId || getFirstStepId());
    }
  }, [isNew, procedure]);

  const handleSelectOption = useCallback(
    (option: WizardOption) => {
      setPendingSelection(option.value);
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = setTimeout(() => {
        pendingTimeoutRef.current = null;
        setPendingSelection(null);
        const chipLabel = getChipLabel(option);
        setAnswers((prev) => [...prev, { stepId: currentStepId, selectedValue: option.value, chipLabel }]);
        setDirection("forward");

        const next = option.next;
        if (next === PLACEHOLDER_NEXT) {
          setCurrentStepId(PLACEHOLDER_SCREEN_ID);
          return;
        }
        if (next === STEP_CRIMINAL_BLOCK) {
          setCurrentStepId("step_3b");
          return;
        }
        if (next === SUMMARY_STEP_ID) {
          setCurrentStepId(SUMMARY_STEP_ID);
          return;
        }
        setCurrentStepId(next);
      }, 250);
    },
    [currentStepId]
  );

  const goBack = useCallback(() => {
    if (answers.length === 0) return;
    const stepWeAreGoingBackTo = answers[answers.length - 1].stepId;
    setAnswers((prev) => prev.slice(0, -1));
    setCurrentStepId(stepWeAreGoingBackTo);
    setDirection("backward");
  }, [answers]);

  const handleBackToStep = useCallback((stepId: string) => {
    setAnswers((prev) => {
      const idx = prev.findIndex((a) => a.stepId === stepId);
      if (idx === -1) return prev;
      return prev.slice(0, idx);
    });
    setCurrentStepId(stepId);
    setDirection("backward");
  }, []);

  const handlePlaceholderModify = useCallback(() => {
    if (answers.length === 0) return;
    const stepWeAreGoingBackTo = answers[answers.length - 1].stepId;
    setAnswers((prev) => prev.slice(0, -1));
    setCurrentStepId(stepWeAreGoingBackTo);
    setDirection("backward");
  }, [answers]);

  const handleSummaryModify = useCallback(() => {
    if (answers.length === 0) return;
    const stepWeAreGoingBackTo = answers[answers.length - 1].stepId;
    setAnswers((prev) => prev.slice(0, -1));
    setCurrentStepId(stepWeAreGoingBackTo);
    setDirection("backward");
  }, [answers]);

  const handleValidate = useCallback(async () => {
    const procedureAnswers = answersArrayToProcedureAnswers(answers);
    let type = "placeholder";
    if (procedureAnswers.amount !== undefined && procedureAnswers.miseEnDemeure !== undefined) {
      type = "contrat_vente_non_paye";
    } else if (procedureAnswers.dgEtatDesLieux !== undefined) {
      type = "depot_garantie";
    } else if (procedureAnswers.empTypeFaute !== undefined || procedureAnswers.empMotif === "insuffisance") {
      type = "licenciement";
    }
    const payload = {
      title: `Procédure du ${new Date().toLocaleDateString("fr-FR")}`,
      type,
      answers: procedureAnswers as Record<string, unknown>,
      status: "in_progress" as const,
    };
    try {
      if (isNew) {
        const result = await createProcedure.mutateAsync(payload);
        setLocation(`/procedure/${result.id}/result`);
      } else if (procedureId) {
        await updateProcedure.mutateAsync({ id: procedureId, ...payload });
        setLocation(`/procedure/${procedureId}/result`);
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la procédure. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  }, [answers, isNew, procedureId, createProcedure, updateProcedure, setLocation, toast]);

  useEffect(() => {
    return () => {
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && answers.length > 0) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goBack, answers.length]);

  const isPlaceholder = currentStepId === PLACEHOLDER_SCREEN_ID;
  const isSummary = currentStepId === SUMMARY_STEP_ID;
  const currentStep = !isPlaceholder && !isSummary ? getStep(currentStepId) : null;

  const trailAnswers = answers.map((a) => ({ stepId: a.stepId, chipLabel: a.chipLabel }));
  const trailCurrentStepId =
    isPlaceholder || isSummary ? null : currentStepId;
  const estimatedTotal =
    answers.length +
    1 +
    (trailCurrentStepId ? estimateRemainingSteps(trailCurrentStepId) : 0);

  const isMobile = useIsMobile();
  const procedureAnswers = answersArrayToProcedureAnswers(answers);
  const progressPercent =
    estimatedTotal > 0 ? Math.round((answers.length / estimatedTotal) * 100) : 0;
  const selectedValueForStep =
    currentStep && pendingSelection !== null
      ? pendingSelection
      : currentStep
        ? answers.find((a) => a.stepId === currentStepId)?.selectedValue ?? null
        : null;

  if (!isNew && procedureId !== undefined && isLoadingProcedure) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout>
      {isMobile && (
        <div className="sticky top-0 z-10 w-full pl-6 pr-8 py-2 bg-background/95 backdrop-blur border-b">
          <Progress value={progressPercent} className="h-1" />
        </div>
      )}
      <div className="min-h-[80vh] flex">
        {/* Main area — one screen at a time */}
        <div className="flex-1 flex flex-col min-w-0 md:min-w-[80%]">
          <div className="flex-1 flex flex-col justify-center px-4 py-8 md:py-12">
            <AnimatePresence mode="wait" initial={false}>
              {isPlaceholder && (
                <PlaceholderScreen key="placeholder" onModify={handlePlaceholderModify} />
              )}
              {isSummary && (
                <WizardSummary
                  key="summary"
                  answers={procedureAnswers}
                  onValidate={handleValidate}
                  onModify={handleSummaryModify}
                  isSubmitting={createProcedure.isPending || updateProcedure.isPending}
                />
              )}
              {currentStep && (
                <motion.div
                  key={currentStepId}
                  initial={
                    direction === "forward"
                      ? { opacity: 0, y: 60 }
                      : { opacity: 0, y: -60 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    direction === "forward"
                      ? { opacity: 0, y: -60 }
                      : { opacity: 0, y: 60 }
                  }
                  transition={{
                    duration: direction === "forward" ? 0.4 : 0.3,
                    ease: direction === "forward" ? "easeOut" : "easeIn",
                  }}
                  className="w-full max-w-2xl mx-auto"
                >
                  <WizardQuestion
                    step={currentStep}
                    selectedValue={selectedValueForStep}
                    onSelect={handleSelectOption}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Back button — bottom left */}
          {!isPlaceholder && (currentStep || isSummary) && answers.length > 0 && (
            <div className="px-4 pb-8 pt-4">
              <Button
                variant="ghost"
                onClick={goBack}
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Retour
              </Button>
            </div>
          )}
        </div>

        {/* Right panel — progress trail (inset from right edge) */}
        <ProgressTrail
          answers={trailAnswers}
          currentStepId={trailCurrentStepId}
          estimatedTotal={Math.max(estimatedTotal, 1)}
          onBackToStep={handleBackToStep}
          className="hidden md:flex mr-6"
        />
        {/* Mobile: thin vertical trail visible */}
        <ProgressTrail
          answers={trailAnswers}
          currentStepId={trailCurrentStepId}
          estimatedTotal={Math.max(estimatedTotal, 1)}
          onBackToStep={handleBackToStep}
          className="md:hidden mr-4"
        />
      </div>
    </Layout>
  );
}
