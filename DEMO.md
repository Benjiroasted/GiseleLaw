# Gisèle.law — Guide de démonstration

Ce document permet à n'importe qui de lancer le projet en local et faire une démo complète.

---

## 1. Prérequis à installer

### Node.js (v18 ou plus)
```bash
# Vérifier si déjà installé
node -v

# Si pas installé → télécharger sur https://nodejs.org (bouton LTS)
```

### PostgreSQL 15+
```bash
# macOS avec Homebrew
brew install postgresql@15
brew services start postgresql@15

# Ajouter au PATH si nécessaire
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile

# Vérifier
psql --version
```

### Git
```bash
# Vérifier si déjà installé
git --version

# Si pas installé → https://git-scm.com/downloads
```

---

## 2. Cloner et installer le projet

```bash
# Cloner le repo
git clone https://github.com/Benjiroasted/GiseleLaw.git
cd GiseleLaw

# Installer les dépendances
npm install
```

---

## 3. Configurer la base de données

```bash
# Créer la base de données
createdb gisele_law

# Si "createdb: error: role ... does not exist" → utiliser votre username
# Vérifier votre username PostgreSQL :
psql -l
# Le nom dans la colonne "Owner" est votre username
```

---

## 4. Créer le fichier .env

Créer un fichier `.env` à la racine du projet :

```bash
# Remplacer VOTRE_USERNAME par votre nom d'utilisateur PostgreSQL (souvent votre nom de session Mac/Linux)
echo 'DATABASE_URL=postgresql://VOTRE_USERNAME@localhost:5432/gisele_law
SESSION_SECRET=demo-secret-local' > .env
```

**Exemples courants :**
- macOS Homebrew : `postgresql://benjamin@localhost:5432/gisele_law`
- Linux par défaut : `postgresql://postgres:postgres@localhost:5432/gisele_law`
- Si mot de passe : `postgresql://user:password@localhost:5432/gisele_law`

---

## 5. Initialiser la base de données

```bash
npm run db:push
```

Cela crée les tables nécessaires (users, procedures, practitioners, etc.).

---

## 6. Lancer l'application

```bash
npm run dev
```

Ouvrir **http://localhost:5000** dans le navigateur.

Vous devriez voir la page d'accueil de Gisèle.law.

---

## 7. Scénarios de démonstration

### Démo 1 : Parcours "Vente non payée" (fiches 1-4)

1. Cliquer **"Analyser ma situation"**
2. Répondre :
   - Êtes-vous → **Un particulier**
   - Contexte → **Vie perso**
   - Infraction → **Non**
   - Adversaire → **Un particulier**
   - Document officiel → **Non**
   - Catégorie → **Un achat, une vente, un service qui s'est mal passé**
   - Type → **Un objet / un bien vendu ou acheté**
   - Problème → **L'accord n'est pas respecté...**
   - Détail → **Je n'ai pas été payé(e)**
   - Montant → **< 5 000€**
   - Mise en demeure → **Non**
3. **Récapitulatif** → Vérifier les réponses → **Valider**
4. **Fiche résultat** : 4 étapes de résolution avec liens Legifrance cliquables

### Démo 2 : Parcours "Dépôt de garantie" (fiches 5-45)

1. Cliquer **"Analyser ma situation"**
2. Répondre :
   - Êtes-vous → **Un particulier**
   - Contexte → **Vie perso**
   - Infraction → **Non**
   - Adversaire → **Un particulier**
   - Document officiel → **Non**
   - Catégorie → **Un logement ou un bien immobilier**
   - Sous-catégorie → **Une location de logement**
   - Vous êtes → **Locataire**
   - Problème → **La restitution du dépôt de garantie (caution)**
   - État des lieux → **Oui, avec ma signature et celle du propriétaire**
   - Dégradations → **Non** (conforme)
   - Délai → **Plus d'un mois**
   - Raison proprio → **Dégradation du logement**
   - Justifications → **Oui**
   - Demande restitution → **Oui**
3. **Fiche résultat** : cadre légal + étapes (conciliation, injonction, action juge)

### Démo 3 : Parcours "Licenciement" (fiches 87-88)

1. Cliquer **"Analyser ma situation"**
2. Répondre :
   - Êtes-vous → **Un particulier**
   - Contexte → **Vie perso**
   - Infraction → **Non**
   - Adversaire → **Employeur**
   - Document officiel → **Non**
   - Catégorie → **Une rupture de votre contrat de travail**
   - Fin contrat → **J'ai été licencié(e)**
   - Situation → **J'ai reçu une lettre de licenciement**
   - Motif → **Licenciement pour faute**
   - Type → **Faute simple**
   - Procédure respectée → **Oui**
3. **Fiche résultat** : contestation amiable + Conseil de prud'hommes + action en justice

### Démo 4 : Fonctionnalités UX

- **Dark mode** : cliquer l'icône lune/soleil en haut à droite
- **Tooltip** : survoler le "?" à côté de "Un particulier" → popup au survol, clic pour épingler
- **Breadcrumb** : observer le fil d'Ariane (Profil › Situation › Catégorie › Détails)
- **Modifier au récap** : cliquer sur une ligne du récapitulatif → retourne à cette question
- **Liens Legifrance** : dans la fiche résultat, les articles de loi sont des liens cliquables
- **Trouver un avocat** : bouton en fin de fiche + lien dans la navigation

### Démo 5 : Placeholder (branches en construction)

1. Choisir **Un particulier** → **Vie perso** → **Non** → **Banque**
2. → Écran "Cette procédure sera bientôt disponible"
3. Montre que l'arbre est extensible — les branches non encore couvertes sont identifiées

---

## 8. Connexion (mode développement)

L'app utilise un mock d'authentification en local :

- Aller sur **http://localhost:5000/api/login** → connecte automatiquement un utilisateur fictif
- Permet de tester : sauvegarde de dossiers, dashboard "Mes dossiers"
- Se déconnecter : cliquer l'avatar → "Se déconnecter"

---

## 9. En cas de problème

| Problème | Solution |
|----------|---------|
| `command not found: npm` | Installer Node.js depuis https://nodejs.org |
| `role "postgres" does not exist` | Changer le username dans `.env` (voir section 4) |
| `database "gisele_law" does not exist` | Lancer `createdb gisele_law` |
| `DATABASE_URL must be set` | Vérifier que le fichier `.env` existe à la racine |
| Port 5000 déjà utilisé | `kill -9 $(lsof -t -i:5000)` puis relancer |
| Page blanche | Faire Cmd+Shift+R (hard refresh) dans le navigateur |

---

## 10. Structure du projet (pour les curieux)

```
├── client/src/
│   ├── pages/           → Pages (Home, Wizard, Result, Dashboard)
│   ├── components/      → Composants (Layout, FicheResult, BreadcrumbNav...)
│   ├── data/            → Arbre de décision + contenu des 90 fiches juridiques
│   └── hooks/           → Hooks React (auth, procédures)
├── server/              → API Express + auth
├── shared/              → Schéma DB + types partagés
└── .env                 → Configuration locale (ne pas committer)
```

**90 fiches juridiques couvrant :**
- Droit civil : contrat de vente non payé (4 fiches)
- Droit immobilier : dépôt de garantie non restitué (42 fiches)
- Droit du travail : contestation de licenciement (2 fiches)
- + branches placeholder pour les extensions futures
