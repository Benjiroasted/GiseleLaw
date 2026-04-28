import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Layout } from "@/components/Layout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SPECIALTIES = [
  "Droit civil",
  "Droit du travail",
  "Droit immobilier",
  "Droit de la famille",
  "Droit pénal",
  "Droit commercial",
  "Droit de la consommation",
  "Propriété intellectuelle",
];

interface ApplyResponse {
  practitionerId: number;
  verificationStatus: string;
  cnbMatched: boolean;
}

export default function AvocatInscription() {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "submitted">("form");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [barreau, setBarreau] = useState("");
  const [barreauOpen, setBarreauOpen] = useState(false);
  const [locationCity, setLocationCity] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    document.title = "Inscription avocat — Gisèle.law";
  }, []);

  // Load barreaux from CNB directory (used to populate the dropdown).
  // We do NOT match the (firstName, lastName, barreau) tuple client-side:
  // showing a "matched / not matched" status during signup would let
  // anyone confirm someone else's CNB inscription, which encourages
  // identity usurpation. Verification is handled by an admin a posteriori.
  const { data: barreaux } = useQuery<string[]>({
    queryKey: ["/api/cnb/barreaux"],
    queryFn: async () => {
      const res = await fetch("/api/cnb/barreaux");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (): Promise<ApplyResponse> => {
      const res = await apiRequest("POST", "/api/lawyers/apply", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        barreau: barreau.trim().toUpperCase(),
        specialties,
        locationCity: locationCity.trim(),
        bio: bio.trim(),
      });
      return res.json();
    },
    onSuccess: () => {
      setStep("submitted");
    },
    onError: (err: Error) => {
      toast({
        title: "Échec de l'inscription",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const isFormValid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    barreau.trim().length > 0;

  if (step === "submitted") {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 items-center justify-center mb-6"
          >
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Candidature envoyée&nbsp;!
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Merci&nbsp;! Notre équipe vérifie votre profil sous 24-48h.
            Vous recevrez un email à <strong>{email}</strong> avec l'accès à votre
            espace avocat dès validation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12">
        <Link href="/avocats" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">
            Créer mon espace avocat
          </h1>
          <p className="text-muted-foreground">
            Quelques minutes suffisent. Nous vérifions ensuite votre inscription
            à l'annuaire officiel du{" "}
            <a
              href="https://www.data.gouv.fr/datasets/annuaire-des-avocats-de-france"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              Conseil National des Barreaux
            </a>
            .
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isFormValid && !submitMutation.isPending) submitMutation.mutate();
          }}
          className="space-y-6 bg-card border rounded-2xl p-6 md:p-8"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="off"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="off"
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="barreau">Barreau d'inscription *</Label>
            <Popover open={barreauOpen} onOpenChange={setBarreauOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={barreauOpen}
                  className={cn(
                    "mt-1.5 w-full justify-between font-normal",
                    !barreau && "text-muted-foreground",
                  )}
                >
                  {barreau || "Sélectionnez votre barreau…"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[--radix-popover-trigger-width] p-0"
              >
                <Command>
                  <CommandInput placeholder="Tapez les premières lettres…" />
                  <CommandList>
                    <CommandEmpty>Aucun barreau trouvé.</CommandEmpty>
                    <CommandGroup>
                      {barreaux?.map((b) => (
                        <CommandItem
                          key={b}
                          value={b}
                          onSelect={(currentValue) => {
                            setBarreau(currentValue.toUpperCase());
                            setBarreauOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              barreau === b ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {b}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground mt-1.5">
              Tapez les premières lettres de votre barreau (ex.&nbsp;: «&nbsp;par&nbsp;» pour Paris).
            </p>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              Coordonnées
            </div>
            <div>
              <Label htmlFor="email">Email professionnel *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@cabinet-x.fr"
                required
                autoComplete="off"
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Votre email professionnel.
              </p>
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="locationCity">Ville d'exercice</Label>
              <Input
                id="locationCity"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="Ex: Paris, Lyon…"
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div>
              <Label>Spécialités principales</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Sélectionnez les domaines dans lesquels vous souhaitez recevoir des
                demandes.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SPECIALTIES.map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 p-2 rounded border bg-background hover:bg-muted cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={specialties.includes(s)}
                      onCheckedChange={(checked) =>
                        setSpecialties((prev) =>
                          checked ? [...prev, s] : prev.filter((x) => x !== s),
                        )
                      }
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Présentation courte</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Quelques lignes sur votre approche et vos domaines de prédilection."
                className="mt-1.5"
                maxLength={2000}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid || submitMutation.isPending}
            className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Envoi en cours…
              </>
            ) : (
              "Envoyer ma candidature"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            En soumettant ce formulaire, vous acceptez que vos informations soient
            croisées avec l'annuaire public du CNB pour vérification.
          </p>
        </form>
      </div>
    </Layout>
  );
}
