# Gisèle Law Guide – App context for AI assistants

Quick reference for the stack, features, and how things work so an AI can help with changes.

---

## What the app is

**Gisèle.law** is a French-language legal guide web app. It helps users:
- Run step-by-step **procedures** (e.g. unpaid work / *travail*, or intellectual property / *propriété intellectuelle*).
- Get a **timeline and deadlines** based on their answers.
- **Save procedures** as **dossiers** in their account.
- **Find practitioners** (lawyers) with filters (specialty, city, legal aid).

---

## Tech stack

- **Backend:** Node + Express 5, TypeScript, single server (API + static/Vite dev server).
- **Frontend:** React 18, Vite 7, Wouter (routing), TanStack Query, Tailwind + Radix UI, Framer Motion.
- **DB:** PostgreSQL with Drizzle ORM. Shared schema and API contract live in `shared/`.
- **Auth:** Session-based. **Local dev:** `localAuth` (mock user via `/api/login`). **Replit:** `replitAuth` (OIDC). Chosen via `REPL_ID` env.

---

## Project layout

| Path | Purpose |
|------|--------|
| `server/index.ts` | Express app, Vite in dev, listen port/host, error handler |
| `server/routes.ts` | Registers auth + all API routes (procedures, practitioners, dossiers) |
| `server/storage.ts` | DB access (procedures, practitioners, dossiers, users) |
| `server/vite.ts` | Vite dev middleware + catch-all for SPA |
| `server/replit_integrations/auth/` | Auth: `index.ts` picks local vs Replit; `localAuth.ts` / `replitAuth.ts`; `routes.ts` (e.g. `/api/auth/user`); `storage.ts` (auth user storage) |
| `shared/schema.ts` | Drizzle tables: procedures, practitioners, bookings, dossiers, users, sessions |
| `shared/routes.ts` | API contract (paths, methods, Zod input/response schemas) |
| `shared/models/auth.ts` | Users + sessions table definitions |
| `client/src/App.tsx` | Router (Wouter), routes list, auth-gated Dashboard |
| `client/src/pages/` | Home, Wizard, Result, Dashboard, Practitioners, not-found |
| `client/src/components/Layout.tsx` | Header (logo, nav, login/logout, avatar), main, footer |
| `client/src/hooks/` | `use-auth`, `use-procedures`, `use-toast`, etc. |

---

## Main features and flows

### 1. Procedures (wizard + result)

- **Create:** User goes **Home** → “Démarrer une procédure” → `/procedure/new/wizard`. Wizard steps: type (unpaid_work vs IP), details, key date, summary. Data is `type`, `title`, `answers` (JSON), `status`. On submit, `POST /api/procedures` (optionally with `userId` if logged in), then redirect to `/procedure/:id/result`.
- **Result page:** Shows a **timeline** (prescription dates, steps) derived from `procedure.answers` (e.g. base date, employee/freelance, IP type). User can “Save to Dossiers” (requires auth) or continue to practitioners.
- **Edit:** Same wizard at `/procedure/:id/wizard`; loads procedure, then `PUT /api/procedures/:id` on save.
- **List/delete:** **Dashboard** (`/dashboard`, protected) lists user’s procedures; delete calls `DELETE /api/procedures/:id`.

### 2. Dossiers

- **Create:** From Result, “Save to Dossiers” → `POST /api/dossiers` with `title`, `domain`, `procedureData`, `status`. Requires auth.
- **List:** Dashboard can show dossiers; API: `GET /api/dossiers` (auth required, filtered by `userId`).

### 3. Practitioners

- **List:** Page `/practitioners`. Filters: specialty, city, accepts legal aid. `GET /api/practitioners?specialty=...&city=...&accepts_legal_aid=...`. No auth required.
- **Data:** `practitioners` table: name, photo, bio, specialties (array), location, rates, `acceptsLegalAid`, similarity counts, rating.

### 4. Auth

- **Session:** Express session; secret from `SESSION_SECRET`; store: PG (`connect-pg-simple`) or MemoryStore in dev.
- **Local:** `GET /api/login` sets mock user; `GET /api/logout` destroys session. `GET /api/auth/user` returns current user (401 if not logged in).
- **Replit:** OIDC login/logout; same `/api/auth/user` for current user.
- **Frontend:** `useAuth()` (TanStack Query on `/api/auth/user`); Layout shows “Se connecter” → `/api/login` or user avatar + “Mes Dossiers” + logout.

---

## API summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/auth/user` | required | Current user |
| GET | `/api/procedures` | required | List procedures for user |
| GET | `/api/procedures/:id` | optional | Get one (403 if owned by another user) |
| POST | `/api/procedures` | optional | Create (body: type, title, answers, status; userId if logged in) |
| PUT | `/api/procedures/:id` | — | Update procedure |
| DELETE | `/api/procedures/:id` | — | Delete procedure |
| GET | `/api/practitioners` | no | List; query: specialty, city, accepts_legal_aid |
| GET | `/api/dossiers` | required | List dossiers for user |
| POST | `/api/dossiers` | required | Create dossier (body: title, domain, procedureData, status, etc.) |

Input/response shapes are in `shared/routes.ts` (Zod + Drizzle types).

---

## Data model (high level)

- **users** – id, email, firstName, lastName, profileImageUrl (auth).
- **sessions** – sid, sess, expire (express-session).
- **procedures** – id, userId (nullable), type, title, answers (JSON), status, createdAt, updatedAt.
- **practitioners** – id, userId, name, photoUrl, bio, specialties[], location, rates, acceptsLegalAid, similarCases*, rating.
- **bookings** – practitionerId, procedureId, client info, bookingDatetime, status (for future use).
- **dossiers** – id, userId, title, domain, subdomain, procedureData (JSON), deadlines (JSON), status.

---

## Conventions and gotchas

- **Port:** `PORT` env (default 5000). Dev server binds to `localhost` so both `http://localhost:5000` and `http://127.0.0.1:5000` work.
- **API base:** Same origin; no `/api` prefix in frontend config beyond the path strings in `shared/routes.ts` and `apiRequest`/fetch.
- **Result → Dashboard:** Result page uses `setLocation("/my-account")` after saving a dossier; the actual route is `/dashboard`. Consider redirecting to `/dashboard` for consistency.
- **Procedure ownership:** List/get enforce or scope by `userId` when authenticated; create attaches `userId` when logged in.
- **i18n:** UI copy is in French (labels, toasts, nav).

---

## Scripts

- `npm run dev` – Start dev server (Express + Vite).
- `npm run build` – Production build (see `script/build.ts`).
- `npm run start` – Run production server.
- `npm run db:push` – Drizzle push schema to DB.

Use this file as context when editing backend, frontend, or shared types so changes stay consistent with the app’s structure and behavior.
