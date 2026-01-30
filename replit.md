# Gisèle Law - French Legal Procedure Guide

## Overview

Gisèle Law is a French-language legal procedure guide application featuring a chatbot assistant named "Gisele". The platform helps users understand legal procedures (not legal advice) through step-by-step questionnaires, calculates deadlines based on user-provided dates, and outputs procedure timelines with steps, deadlines, and required documents.

The application currently supports two legal domains:
- **Unpaid Work (Travail non payé)**: Routes users through Conseil de Prud'hommes or commercial court procedures based on employment status
- **Intellectual Property (Propriété intellectuelle)**: Handles copyright, trademark, and patent infringement cases

A practitioner matching platform is planned to connect users with legal professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme extending the design system (primary: #1E3A5F deep blue, accent: #C9A227 gold)
- **Animations**: Framer Motion for smooth wizard transitions
- **Typography**: Playfair Display (serif for headings), Inter (sans-serif for body)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful API with typed route contracts defined in `shared/routes.ts`
- **Authentication**: Replit Auth integration using OpenID Connect with Passport.js
- **Session Management**: Express sessions stored in PostgreSQL via connect-pg-simple

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod schema validation via drizzle-zod
- **Schema Location**: `shared/schema.ts` for shared types, `shared/models/auth.ts` for auth tables
- **Migrations**: Drizzle Kit with migrations in `/migrations` directory

### Key Data Models
- **users**: User accounts with Replit Auth integration (id, email, firstName, lastName, profileImageUrl)
- **sessions**: Session storage for authentication
- **procedures**: Legal procedure records (type, title, answers as JSONB, status, userId reference)

### Build System
- **Development**: tsx for TypeScript execution, Vite dev server with HMR
- **Production**: esbuild bundles server code, Vite builds client to `dist/public`
- **Path Aliases**: `@/*` maps to client/src, `@shared/*` maps to shared directory

## External Dependencies

### Database
- PostgreSQL database (connection via DATABASE_URL environment variable)

### Authentication
- Replit Auth (OpenID Connect provider at replit.com/oidc)
- Requires REPL_ID and SESSION_SECRET environment variables

### Key Runtime Dependencies
- **drizzle-orm** / **drizzle-kit**: Database ORM and migration tooling
- **express** / **express-session**: Web server and session handling
- **passport** / **openid-client**: Authentication middleware
- **date-fns**: Date calculations for legal deadlines
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/\***: Accessible UI primitives (dialog, dropdown, tabs, etc.)
- **@tanstack/react-query**: Async state management
- **framer-motion**: Animation library
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework