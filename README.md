# Gisèle.law — Guide juridique intelligent

Gisèle.law est une application web qui aide les particuliers à comprendre leurs droits et à naviguer les procédures juridiques en France.

L'utilisateur répond à un questionnaire interactif et reçoit une fiche personnalisée avec les étapes de résolution, les délais de prescription et les textes de loi applicables.

## Fonctionnalités

- **Questionnaire intelligent** — arbre de décision adaptatif couvrant le droit civil, immobilier et du travail
- **Fiches juridiques** — étapes de résolution détaillées avec références aux articles de loi
- **Annuaire d'avocats** — recherche par spécialité, ville et aide juridictionnelle
- **Sauvegarde de dossiers** — suivi des procédures (compte requis)

## Stack technique

- **Frontend** : React 18, Vite, Tailwind CSS, Radix UI, Framer Motion, Wouter
- **Backend** : Node.js, Express 5, TypeScript
- **Base de données** : PostgreSQL avec Drizzle ORM
- **Auth** : Sessions Express (mock local en dev)

## Installation locale

### Prérequis

- [Node.js](https://nodejs.org/) v18+ (recommandé : v20+)
- [PostgreSQL](https://www.postgresql.org/) 15+
- npm (inclus avec Node.js)

### 1. Cloner le projet

```bash
git clone https://github.com/VOTRE-USERNAME/Gisele-Law.git
cd Gisele-Law
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer la base de données

Installer PostgreSQL si pas déjà fait :

```bash
# macOS avec Homebrew
brew install postgresql@15
brew services start postgresql@15
```

Créer la base de données :

```bash
createdb gisele_law
```

### 4. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Modifier `.env` si nécessaire (les valeurs par défaut fonctionnent pour une installation locale standard).

### 5. Initialiser le schéma de la base

```bash
npm run db:push
```

### 6. Lancer l'application

```bash
npm run dev
```

Ouvrir [http://localhost:5000](http://localhost:5000) dans votre navigateur.

### Connexion en mode développement

En local, l'authentification utilise un mock. Visitez `/api/login` pour vous connecter avec un utilisateur fictif (utile pour tester la sauvegarde de dossiers).

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (Express + Vite) |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run db:push` | Appliquer le schéma à la base de données |

## Structure du projet

```
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Composants UI (Layout, Wizard, Fiches...)
│   │   ├── data/        # Arbre de décision + contenu des fiches
│   │   ├── hooks/       # Hooks custom (auth, procédures)
│   │   ├── lib/         # Utilitaires
│   │   └── pages/       # Pages (Home, Wizard, Result, Dashboard)
│   └── index.html
├── server/              # Backend Express
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Accès base de données
│   └── index.ts         # Point d'entrée serveur
├── shared/              # Types et schéma partagés
│   ├── schema.ts        # Tables Drizzle + types
│   └── routes.ts        # Contrat API (paths + Zod)
└── package.json
```

## Avertissement

Gisèle.law est un outil d'information juridique et **ne remplace pas les conseils d'un avocat**. Pour des cas complexes, consultez un professionnel du droit.

## Licence

Propriétaire — tous droits réservés.
