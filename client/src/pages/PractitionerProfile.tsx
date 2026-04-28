/**
 * Practitioner profile page — route: /practitioners/:id
 *
 * Simple client-side page that fetches the full practitioners list (~20 rows)
 * and picks the matching id. No backend change required.
 *
 * To remove this feature:
 *   1. Delete this file.
 *   2. Remove the `/practitioners/:id` route in client/src/App.tsx.
 *   3. Revert the "Voir le profil" Link in client/src/pages/Practitioners.tsx
 *      back to a plain <Button>.
 */

import { Link, useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Practitioner } from "@shared/schema";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  User,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  Euro,
  Mail,
  Phone,
} from "lucide-react";

const DEMO_MARKER = "[DEMO_SEED]";

/** Strip the internal seed marker from bios so it never shows in UI. */
function cleanBio(bio: string | null | undefined): string {
  if (!bio) return "";
  return bio.startsWith(DEMO_MARKER)
    ? bio.slice(DEMO_MARKER.length).trimStart()
    : bio;
}

export default function PractitionerProfile() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const id = Number(params.id);

  const { data: practitioners, isLoading, isError } = useQuery<Practitioner[]>({
    queryKey: ["/api/practitioners"],
    queryFn: async () => {
      const res = await fetch("/api/practitioners");
      if (!res.ok) throw new Error("Failed to fetch practitioners");
      return res.json();
    },
  });

  const practitioner = practitioners?.find((p) => p.id === id);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="h-10 w-48 bg-muted animate-pulse rounded mb-6" />
          <div className="h-80 bg-muted animate-pulse rounded-lg" />
        </div>
      </Layout>
    );
  }

  if (isError || !practitioner) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <h1 className="text-2xl font-serif font-bold text-primary mb-3">
            Profil introuvable
          </h1>
          <p className="text-muted-foreground mb-6">
            Ce professionnel n'existe pas ou n'est plus disponible.
          </p>
          <Button onClick={() => setLocation("/practitioners")}>
            Retour à la liste
          </Button>
        </div>
      </Layout>
    );
  }

  const bio = cleanBio(practitioner.bio);
  const totalCases =
    (practitioner.similarCasesTravail ?? 0) +
    (practitioner.similarCasesIp ?? 0);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link href="/practitioners">
          <Button variant="ghost" size="sm" className="gap-2 mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Button>
        </Link>

        {/* Header card */}
        <Card className="overflow-hidden mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 overflow-hidden shrink-0 border-2 border-primary/10 flex items-center justify-center mx-auto md:mx-0">
                {practitioner.photoUrl ? (
                  <img
                    src={practitioner.photoUrl}
                    alt={practitioner.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-primary/40" />
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">
                    {practitioner.name}
                  </h1>
                  <div className="inline-flex items-center text-amber-500 bg-amber-50 px-3 py-1 rounded text-sm font-bold self-center md:self-start">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {practitioner.rating}
                  </div>
                </div>

                <div className="flex items-center justify-center md:justify-start text-muted-foreground text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {practitioner.locationCity}
                  {practitioner.locationDepartment
                    ? ` (${practitioner.locationDepartment})`
                    : ""}
                </div>

                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                  {practitioner.specialties?.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="text-[11px] uppercase tracking-wider"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        {bio && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="font-serif text-lg font-bold text-primary mb-3">
                À propos
              </h2>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Key facts grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Briefcase className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">
                {practitioner.experienceYears ?? 0}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                {practitioner.experienceYears === 1
                  ? "Année d'exp."
                  : "Années d'exp."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Euro className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">
                {practitioner.rateConsultation
                  ? `${practitioner.rateConsultation}€`
                  : "—"}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                Consultation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Euro className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">
                {practitioner.rateHourly ? `${practitioner.rateHourly}€` : "—"}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                Tarif horaire
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Aide juridictionnelle + cas similaires */}
        {(practitioner.acceptsLegalAid || totalCases > 0) && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-6 space-y-3">
              {practitioner.acceptsLegalAid && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-primary text-sm">
                      Aide juridictionnelle acceptée
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ce professionnel accepte les dossiers pris en charge au
                      titre de l'aide juridictionnelle.
                    </p>
                  </div>
                </div>
              )}
              {totalCases > 0 && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-primary text-sm">
                      {totalCases} affaires similaires traitées
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {practitioner.similarCasesTravail ? (
                        <>
                          Droit du travail : {practitioner.similarCasesTravail}
                          {practitioner.similarCasesIp
                            ? ` · Propriété intellectuelle : ${practitioner.similarCasesIp}`
                            : ""}
                        </>
                      ) : (
                        <>
                          Propriété intellectuelle :{" "}
                          {practitioner.similarCasesIp}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="font-serif text-xl font-bold text-primary">
              Prendre contact
            </h2>
            <p className="text-sm text-muted-foreground">
              La prise de rendez-vous en ligne sera bientôt disponible. En
              attendant, vous pouvez contacter le cabinet directement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="gap-2" disabled>
                <Mail className="h-4 w-4" />
                Envoyer un message
              </Button>
              <Button variant="outline" className="gap-2" disabled>
                <Phone className="h-4 w-4" />
                Demander à être rappelé
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
