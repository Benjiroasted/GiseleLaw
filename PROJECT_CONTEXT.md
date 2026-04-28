# Gisèle.law — Contexte projet (pour présentation rapide)

> Document synthétique à donner en contexte à un LLM (Claude, GPT, etc.)
> pour générer une présentation, un pitch, un deck ou un résumé du projet.

---

## 1. En une phrase

**Gisèle.law** est une application web francophone qui aide les justiciables
(particuliers, professionnels) à **comprendre leur situation juridique**,
à **identifier les démarches concrètes possibles** (amiables, puis judiciaires),
et à **être mis en relation avec un avocat** si nécessaire.

L'idée : rendre le droit **accessible avant le rendez-vous avocat**, via un
questionnaire court qui produit une fiche claire (cadre légal + étapes de
résolution + références Legifrance cliquables).

---

## 2. Proposition de valeur

- **Pour le justiciable :** un questionnaire de quelques minutes → une fiche
  structurée, gratuite, qui remplace la recherche Google floue. Il sait
  « qui saisir, quand, comment ».
- **Pour l'avocat :** un flux de prospects déjà qualifiés (domaine identifié,
  situation structurée), avec un dashboard côté avocat (`/avocat`) en cours
  de développement.
- **Positionnement :** information juridique générale, **pas** conseil
  personnalisé. La passerelle vers l'avocat reste explicite.

---

## 3. Utilisateurs cibles

| Profil | Besoin principal |
|--------|------------------|
| Particulier (vie perso) | Comprendre ses droits, éviter les litiges inutiles |
| Particulier (activité pro) | Questions récurrentes (clients, contrats) |
| Professionnel / entreprise | Briefing rapide avant avocat (branches placeholder pour l'instant) |
| Avocat | Recevoir des demandes déjà structurées, gérer son pipeline |

---

## 4. Parcours utilisateur (cœur produit)

1. **Home** (`/`) — pitch + CTA « Commencer le questionnaire ».
2. **Wizard** (`/procedure/:id/wizard`) — arbre de décision guidé (~5 à 15
   questions selon la branche) avec tooltips de vocabulaire juridique,
   breadcrumb, progress trail.
3. **Récapitulatif** — l'utilisateur peut modifier n'importe quelle réponse.
4. **Fiche résultat** (`/procedure/:id/result`) :
   - Titre = résumé en langage naturel de la situation (« Au vu des éléments
     transmis, le problème concerne… »).
   - Rappel du cadre légal (articles, textes applicables).
   - Étapes de résolution numérotées (mise en demeure, conciliation,
     injonction, juge, etc.) — articles de loi auto-liés vers **Legifrance**.
   - CTA « Trouver un avocat » filtré par spécialité.
5. **Sauvegarde** (auth requise) — dossier consultable depuis le Dashboard.

---

## 5. Couverture juridique (contenu actuel)

**~90 fiches juridiques** couvrant trois domaines :

| Domaine | Fiches | Exemples de situations |
|---------|--------|-----------------------|
| **Droit civil** — contrat de vente non payé | 1–4 | Vente entre particuliers non payée (selon montant + mise en demeure) |
| **Droit immobilier** — dépôt de garantie | 5–45 | 42 variantes selon : signature EDL, délai dépassé, dégradations contestées, justifications, demande amiable faite ou non |
| **Droit du travail** — contestation de licenciement | 87–88 | Licenciement pour faute simple : motif contesté ou procédure |

Les branches non couvertes (banque, famille, pénal, personne morale, etc.)
renvoient vers un **placeholder** « Cette procédure sera bientôt disponible »,
ce qui permet de **cartographier la demande** sans se disperser.

Sources : transcrites depuis un « Retours Juridique PDF » (mars 2026) — le PDF
reste la source de vérité, les fichiers TS en sont la version structurée.

---

## 6. Stack technique

- **Frontend :** React 18, Vite 7, TypeScript, Wouter (routing), TanStack Query,
  Tailwind + Radix UI, Framer Motion.
- **Backend :** Node + Express 5, TypeScript, un seul serveur (API + Vite en dev,
  statique en prod).
- **DB :** PostgreSQL + Drizzle ORM. Schéma partagé dans `shared/`.
- **Auth :** session Express (cookies), mock mono-utilisateur. `/api/login`
  connecte sous l'ID `dev-user-local` (override via `MOCK_USER_ID`). À
  remplacer par email/password ou OAuth avant la mise en prod.
- **Déploiement :** prévu pour Replit (config `.replit`) mais tourne partout
  avec Node + Postgres.

---

## 7. Architecture du repo

```
client/
├── src/
│   ├── pages/           # Home, Wizard, Result, Dashboard, AvocatDashboard,
│   │                    # Practitioners, not-found
│   ├── components/      # Layout, FicheResult, WizardQuestion, ProgressTrail,
│   │                    # BreadcrumbNav, TooltipBubble, OptionCard, ui/ (shadcn)
│   ├── data/            # ★ Cœur métier :
│   │   ├── wizardTree.ts        # Arbre de décision (1200+ lignes)
│   │   ├── ficheContent.ts      # Types + fiches 1-4 (vente non payée)
│   │   ├── dgFiches.ts          # Fiches 5-45 (dépôt de garantie, factory)
│   │   ├── emploiFiches.ts      # Fiches 87-88 (licenciement)
│   │   ├── legalDefinitions.ts  # Glossaire tooltips
│   │   └── procedureHelpers.ts  # Sélection fiche ← réponses wizard
│   ├── hooks/           # use-auth, use-procedures, use-toast, use-mobile
│   └── lib/             # queryClient, auth-utils, cn()
server/
├── index.ts             # Express + Vite en dev
├── routes.ts            # API procedures / practitioners / dossiers
├── storage.ts           # Accès DB
├── vite.ts              # Vite dev middleware (SPA catch-all)
└── auth/                # index.ts (session + /api/login), routes.ts, storage.ts
shared/
├── schema.ts            # Tables Drizzle
├── routes.ts            # Contrat API (Zod)
└── models/auth.ts       # Users + sessions
script/
├── build.ts             # Build prod
├── exportDecisionTreeCsv.ts     # Export arbre en CSV (utilitaire interne)
└── exportDecisionTreeDrawio.ts  # Export arbre en .drawio (visualisation)
```

---

## 8. Modèle de données (résumé)

| Table | Rôle |
|-------|------|
| `users` | id, email, firstName, lastName, profileImageUrl |
| `sessions` | express-session (sid, sess, expire) |
| `procedures` | id, userId, type, title, answers (JSON), status, timestamps |
| `practitioners` | id, name, photo, bio, specialties[], location, rates, acceptsLegalAid, similarCases, rating |
| `dossiers` | id, userId, title, domain, procedureData (JSON), deadlines (JSON), status |
| `bookings` | practitionerId ↔ procedureId (futur) |

---

## 9. API (résumé)

| Méthode | Endpoint | Auth | Rôle |
|---------|----------|------|------|
| GET | `/api/auth/user` | oui | Utilisateur courant |
| GET | `/api/procedures` | oui | Liste des procédures de l'utilisateur |
| POST | `/api/procedures` | opt | Créer (body : type, title, answers, status) |
| PUT | `/api/procedures/:id` | oui | Mettre à jour |
| DELETE | `/api/procedures/:id` | oui | Supprimer |
| GET | `/api/practitioners` | non | Liste filtrable (specialty, city, legal_aid) |
| GET | `/api/dossiers` | oui | Dossiers de l'utilisateur |
| POST | `/api/dossiers` | oui | Sauvegarder un dossier depuis une fiche |

---

## 10. Fonctionnalités UX notables

- **Arbre de décision extensible** — nouvelles branches ajoutables sans toucher
  au moteur (juste de la data dans `wizardTree.ts`).
- **Breadcrumb + progress trail** — chips cliquables pour revenir en arrière.
- **Tooltips juridiques** — définitions en hover sur vocabulaire technique
  (ex : « personne morale », « personne physique »).
- **Liens Legifrance auto-détectés** — regex qui transforme « articles L1235-1
  à L1235-6 du code du travail » en liens cliquables.
- **Dark mode** avec persistance.
- **Récapitulatif éditable** — modifier n'importe quelle réponse relance
  proprement le flux à partir de cette question.
- **Mise en relation avocat** — CTA contextualisé par domaine
  (`/practitioners?specialty=Droit%20du%20travail`).

---

## 11. État du projet

**Fait :**
- Arbre de décision v2 (refonte mars 2026), ~1200 lignes, structuré et testé
  en démo.
- ~48 fiches effectivement rédigées (vente, dépôt de garantie, licenciement).
- Auth locale + Replit, sauvegarde de dossiers.
- UX léchée : dark mode, tooltips, breadcrumb, récap éditable.
- Scripts d'export (CSV / drawio) pour visualiser et partager l'arbre.
- Nouvelle vue avocat `/avocat` (dashboard — stats, rappels, timeline).

**En cours / à faire :**
- Branches placeholder (banque, famille, pénal, personne morale) — structure
  prête, contenu à produire.
- Mise en relation avocat : pipeline complet (réservation, paiement).
- Durcir l'auth (passage OIDC partout, suppression du mock en prod).

---

## 12. Scripts npm

```bash
npm run dev       # Dev server (Express + Vite) sur :5000
npm run build     # Build prod (script/build.ts)
npm run start     # Serveur prod
npm run db:push   # Drizzle push schema → DB
npm run check     # tsc (type-check)
```

---

## 13. Angles pour une présentation

Selon l'audience, pitcher autour de :

- **Produit / UX** : parcours utilisateur, démo live d'un scénario (vente non
  payée < 5 000 €), fiche résultat avec liens Legifrance.
- **Technique** : arbre de décision pur-data + renderer générique (pas de
  logique hardcodée par fiche), factory pour les 42 variantes dépôt de
  garantie, auto-linking articles de loi.
- **Business** : marché B2C (particuliers perdus) × B2B (avocats qui veulent
  des leads qualifiés), positionnement clair « info, pas conseil ».
- **Juridique / éthique** : garde-fou contre le conseil personnalisé, sources
  tracées (PDF Retours Juridique), passerelle avocat assumée.

---

## 14. Scénarios de démo (2-3 minutes chacun)

1. **Vente non payée** : Particulier → Vie perso → Non (pas d'infraction) →
   Particulier → Non → Achat/vente → Objet → Accord non respecté → Non payé →
   < 5 000 € → Non (pas de MED) → Fiche 4 étapes.
2. **Dépôt de garantie** : Particulier → Vie perso → Logement → Location →
   Locataire → Dépôt de garantie → EDL signé → Pas de dégradation → > 1 mois
   → Dégradation invoquée → Justifications → Demande faite → Fiche 7.
3. **Licenciement** : Particulier → Vie perso → Employeur → Rupture contrat →
   Licencié(e) → Lettre reçue → Faute simple → Procédure respectée →
   Fiche 87 (prud'hommes).

---

*Ce document est volontairement concis. Pour approfondir un aspect spécifique
(code, API, arbre, fiches), référer au fichier concerné ou demander un
extrait ciblé.*
