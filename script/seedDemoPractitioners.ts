/**
 * Seed / clean demo lawyers in the `practitioners` table.
 *
 * All seeded rows have `bio` prefixed with DEMO_MARKER so they can be
 * safely removed with `--clean` without touching real data.
 *
 *   tsx script/seedDemoPractitioners.ts            # insert 20 demo lawyers
 *   tsx script/seedDemoPractitioners.ts --clean    # remove all demo lawyers
 *   tsx script/seedDemoPractitioners.ts --reset    # clean + seed
 */

import "dotenv/config";
import { like } from "drizzle-orm";
import { db, pool } from "../server/db";
import { practitioners, type InsertPractitioner } from "../shared/schema";

const DEMO_MARKER = "[DEMO_SEED]";

const DEMO_LAWYERS: InsertPractitioner[] = [
  {
    name: "Maître Sophie Laurent",
    photoUrl: "https://i.pravatar.cc/200?img=1",
    bio: `${DEMO_MARKER} Avocate en droit immobilier depuis 12 ans, spécialisée dans les litiges locatifs (dépôt de garantie, charges, état des lieux).`,
    specialties: ["Droit immobilier", "Droit civil"],
    locationCity: "Paris",
    locationDepartment: "75",
    experienceYears: 12,
    rateConsultation: 80,
    rateHourly: 250,
    acceptsLegalAid: true,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.8",
  },
  {
    name: "Maître Julien Moreau",
    photoUrl: "https://i.pravatar.cc/200?img=12",
    bio: `${DEMO_MARKER} Avocat en droit du travail — contentieux prud'homal, licenciements, ruptures conventionnelles.`,
    specialties: ["Droit du travail"],
    locationCity: "Lyon",
    locationDepartment: "69",
    experienceYears: 8,
    rateConsultation: 60,
    rateHourly: 220,
    acceptsLegalAid: true,
    similarCasesTravail: 47,
    similarCasesIp: 0,
    rating: "4.7",
  },
  {
    name: "Maître Camille Petit",
    photoUrl: "https://i.pravatar.cc/200?img=5",
    bio: `${DEMO_MARKER} Avocate généraliste — droit de la consommation, contrats, recouvrement amiable.`,
    specialties: ["Droit civil", "Droit de la consommation"],
    locationCity: "Marseille",
    locationDepartment: "13",
    experienceYears: 6,
    rateConsultation: 50,
    rateHourly: 180,
    acceptsLegalAid: true,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.5",
  },
  {
    name: "Maître Antoine Dubois",
    photoUrl: "https://i.pravatar.cc/200?img=13",
    bio: `${DEMO_MARKER} 20 ans d'expérience en droit immobilier — copropriété, baux commerciaux, transactions.`,
    specialties: ["Droit immobilier", "Droit commercial"],
    locationCity: "Bordeaux",
    locationDepartment: "33",
    experienceYears: 20,
    rateConsultation: 120,
    rateHourly: 320,
    acceptsLegalAid: false,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.9",
  },
  {
    name: "Maître Léa Garnier",
    photoUrl: "https://i.pravatar.cc/200?img=9",
    bio: `${DEMO_MARKER} Droit du travail côté salarié : contestation de licenciement, harcèlement, inaptitude.`,
    specialties: ["Droit du travail"],
    locationCity: "Toulouse",
    locationDepartment: "31",
    experienceYears: 10,
    rateConsultation: 70,
    rateHourly: 230,
    acceptsLegalAid: true,
    similarCasesTravail: 62,
    similarCasesIp: 0,
    rating: "4.8",
  },
  {
    name: "Maître Thomas Roux",
    photoUrl: "https://i.pravatar.cc/200?img=14",
    bio: `${DEMO_MARKER} Avocat en droit des contrats et recouvrement — impayés, injonctions de payer, mises en demeure.`,
    specialties: ["Droit civil", "Droit commercial"],
    locationCity: "Nantes",
    locationDepartment: "44",
    experienceYears: 9,
    rateConsultation: 65,
    rateHourly: 210,
    acceptsLegalAid: false,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.6",
  },
  {
    name: "Maître Élise Fontaine",
    photoUrl: "https://i.pravatar.cc/200?img=16",
    bio: `${DEMO_MARKER} Droit de la famille — divorce, garde d'enfants, pensions alimentaires.`,
    specialties: ["Droit de la famille"],
    locationCity: "Lille",
    locationDepartment: "59",
    experienceYears: 14,
    rateConsultation: 80,
    rateHourly: 240,
    acceptsLegalAid: true,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.7",
  },
  {
    name: "Maître Nicolas Bernard",
    photoUrl: "https://i.pravatar.cc/200?img=17",
    bio: `${DEMO_MARKER} Droit pénal — défense, victimes, plaintes, gardes à vue.`,
    specialties: ["Droit pénal"],
    locationCity: "Strasbourg",
    locationDepartment: "67",
    experienceYears: 15,
    rateConsultation: 100,
    rateHourly: 280,
    acceptsLegalAid: true,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.6",
  },
  {
    name: "Maître Anaïs Lefèvre",
    photoUrl: "https://i.pravatar.cc/200?img=20",
    bio: `${DEMO_MARKER} Avocate polyvalente : baux d'habitation, litiges de consommation, petits contentieux civils.`,
    specialties: ["Droit immobilier", "Droit civil", "Droit de la consommation"],
    locationCity: "Montpellier",
    locationDepartment: "34",
    experienceYears: 5,
    rateConsultation: 45,
    rateHourly: 170,
    acceptsLegalAid: true,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.4",
  },
  {
    name: "Maître Paul Girard",
    photoUrl: "https://i.pravatar.cc/200?img=33",
    bio: `${DEMO_MARKER} Droit commercial et droit des sociétés — création, litiges entre associés, contentieux commerciaux.`,
    specialties: ["Droit commercial"],
    locationCity: "Nice",
    locationDepartment: "06",
    experienceYears: 18,
    rateConsultation: 110,
    rateHourly: 300,
    acceptsLegalAid: false,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.7",
  },
  {
    name: "Maître Marine Chevalier",
    photoUrl: "https://i.pravatar.cc/200?img=25",
    bio: `${DEMO_MARKER} Spécialisée en droit du travail côté entreprise — conseil RH, contentieux prud'homal employeur.`,
    specialties: ["Droit du travail"],
    locationCity: "Rennes",
    locationDepartment: "35",
    experienceYears: 11,
    rateConsultation: 90,
    rateHourly: 260,
    acceptsLegalAid: false,
    similarCasesTravail: 35,
    similarCasesIp: 0,
    rating: "4.6",
  },
  {
    name: "Maître Romain Mercier",
    photoUrl: "https://i.pravatar.cc/200?img=52",
    bio: `${DEMO_MARKER} Droit immobilier rural et urbain — dépôts de garantie, troubles du voisinage, indivision.`,
    specialties: ["Droit immobilier"],
    locationCity: "Reims",
    locationDepartment: "51",
    experienceYears: 7,
    rateConsultation: 55,
    rateHourly: 190,
    acceptsLegalAid: true,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.5",
  },
  {
    name: "Maître Chloé Durand",
    photoUrl: "https://i.pravatar.cc/200?img=44",
    bio: `${DEMO_MARKER} Droit de la consommation et protection des emprunteurs — crédits à la consommation, clauses abusives.`,
    specialties: ["Droit de la consommation", "Droit civil"],
    locationCity: "Grenoble",
    locationDepartment: "38",
    experienceYears: 9,
    rateConsultation: 60,
    rateHourly: 200,
    acceptsLegalAid: true,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.7",
  },
  {
    name: "Maître Hugo Leroy",
    photoUrl: "https://i.pravatar.cc/200?img=60",
    bio: `${DEMO_MARKER} Contentieux civil quotidien — voisinage, contrats de vente, petites créances.`,
    specialties: ["Droit civil"],
    locationCity: "Dijon",
    locationDepartment: "21",
    experienceYears: 6,
    rateConsultation: 50,
    rateHourly: 175,
    acceptsLegalAid: true,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.3",
  },
  {
    name: "Maître Laura Simon",
    photoUrl: "https://i.pravatar.cc/200?img=47",
    bio: `${DEMO_MARKER} Droit du travail côté salarié — licenciements économiques, ruptures conventionnelles, heures supplémentaires.`,
    specialties: ["Droit du travail"],
    locationCity: "Paris",
    locationDepartment: "75",
    experienceYears: 13,
    rateConsultation: 95,
    rateHourly: 270,
    acceptsLegalAid: true,
    similarCasesTravail: 88,
    similarCasesIp: 0,
    rating: "4.9",
  },
  {
    name: "Maître David Perrin",
    photoUrl: "https://i.pravatar.cc/200?img=53",
    bio: `${DEMO_MARKER} Propriété intellectuelle et droit du numérique — marques, brevets, RGPD.`,
    specialties: ["Propriété intellectuelle", "Droit commercial"],
    locationCity: "Paris",
    locationDepartment: "75",
    experienceYears: 16,
    rateConsultation: 130,
    rateHourly: 340,
    acceptsLegalAid: false,
    similarCasesTravail: 0,
    similarCasesIp: 52,
    rating: "4.8",
  },
  {
    name: "Maître Inès Blanc",
    photoUrl: "https://i.pravatar.cc/200?img=45",
    bio: `${DEMO_MARKER} Avocate de proximité — baux, litiges locatifs, droit civil des particuliers.`,
    specialties: ["Droit immobilier", "Droit civil"],
    locationCity: "Angers",
    locationDepartment: "49",
    experienceYears: 4,
    rateConsultation: 40,
    rateHourly: 160,
    acceptsLegalAid: true,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.4",
  },
  {
    name: "Maître Étienne Marchand",
    photoUrl: "https://i.pravatar.cc/200?img=64",
    bio: `${DEMO_MARKER} Droit de la famille et des successions — divorces, héritages, tutelles.`,
    specialties: ["Droit de la famille"],
    locationCity: "Nîmes",
    locationDepartment: "30",
    experienceYears: 22,
    rateConsultation: 100,
    rateHourly: 280,
    acceptsLegalAid: false,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.8",
  },
  {
    name: "Maître Pauline Roche",
    photoUrl: "https://i.pravatar.cc/200?img=23",
    bio: `${DEMO_MARKER} Droit du travail + droit de la sécurité sociale — accidents du travail, AT/MP.`,
    specialties: ["Droit du travail"],
    locationCity: "Le Havre",
    locationDepartment: "76",
    experienceYears: 8,
    rateConsultation: 60,
    rateHourly: 200,
    acceptsLegalAid: true,
    similarCasesTravail: 41,
    similarCasesIp: 0,
    rating: "4.6",
  },
  {
    name: "Maître Lucas Henry",
    photoUrl: "https://i.pravatar.cc/200?img=68",
    bio: `${DEMO_MARKER} Droit pénal et droit routier — infractions, gardes à vue, délits routiers.`,
    specialties: ["Droit pénal"],
    locationCity: "Clermont-Ferrand",
    locationDepartment: "63",
    experienceYears: 10,
    rateConsultation: 75,
    rateHourly: 230,
    acceptsLegalAid: true,
    similarCasesTravail: 0,
    similarCasesIp: 0,
    rating: "4.5",
  },
];

async function clean(): Promise<number> {
  const result = await db
    .delete(practitioners)
    .where(like(practitioners.bio, `${DEMO_MARKER}%`))
    .returning({ id: practitioners.id });
  return result.length;
}

async function seed(): Promise<number> {
  if (DEMO_LAWYERS.length !== 20) {
    throw new Error(`Expected 20 demo lawyers, got ${DEMO_LAWYERS.length}`);
  }
  const inserted = await db
    .insert(practitioners)
    .values(DEMO_LAWYERS)
    .returning({ id: practitioners.id });
  return inserted.length;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const doClean = args.has("--clean") || args.has("--reset");
  const doSeed = !args.has("--clean"); // seed by default, unless --clean alone

  try {
    if (doClean) {
      const removed = await clean();
      console.log(`[demo-seed] Removed ${removed} demo lawyers.`);
    }
    if (doSeed) {
      const added = await seed();
      console.log(`[demo-seed] Inserted ${added} demo lawyers (marker: "${DEMO_MARKER}").`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("[demo-seed] FAILED:", err);
  process.exit(1);
});
