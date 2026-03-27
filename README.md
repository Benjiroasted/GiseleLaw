# Gisèle.law — Guide d'installation (Mac + Cursor)

Ce guide vous accompagne de A à Z pour installer et lancer le projet Gisèle.law sur votre Mac après avoir téléchargé le zip depuis GitHub.

---

## Étape 1 — Dézipper le projet

1. Aller dans votre dossier **Téléchargements**
2. Double-cliquer sur `GiseleLaw-main.zip` pour le décompresser
3. Vous obtenez un dossier `GiseleLaw-main`

---

## Étape 2 — Installer Cursor

Si vous n'avez pas encore Cursor :

1. Aller sur **https://cursor.sh**
2. Télécharger la version Mac
3. Glisser l'app dans le dossier **Applications**
4. Ouvrir Cursor

---

## Étape 3 — Ouvrir le projet dans Cursor

1. Dans Cursor : **File → Open Folder**
2. Naviguer vers `~/Downloads/GiseleLaw-main`
3. Cliquer **Open**

Vous devriez voir l'arborescence du projet dans le panneau de gauche.

---

## Étape 4 — Ouvrir le terminal intégré

Dans Cursor : **Terminal → New Terminal** (ou raccourci `Ctrl + ù`)

Le terminal s'ouvre en bas de l'écran, déjà positionné dans le dossier du projet.

---

## Étape 5 — Installer Homebrew (si pas déjà fait)

Homebrew est le gestionnaire de paquets pour Mac. Dans le terminal :

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Suivre les instructions à l'écran. À la fin, Homebrew affiche des commandes à copier-coller pour l'ajouter au PATH. **Faites-le.**

Pour vérifier que ça fonctionne :

```bash
brew --version
```

---

## Étape 6 — Installer Node.js

```bash
brew install node
```

Vérifier :

```bash
node -v
npm -v
```

Vous devriez voir des numéros de version (v18+ pour node, 9+ pour npm).

---

## Étape 7 — Installer PostgreSQL

```bash
brew install postgresql@15
brew services start postgresql@15
```

Ajouter PostgreSQL au PATH (copier-coller la ligne entière) :

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zprofile && source ~/.zprofile
```

Vérifier :

```bash
psql --version
```

---

## Étape 8 — Créer la base de données

```bash
createdb gisele_law
```

Si vous obtenez une erreur "role does not exist", notez votre nom d'utilisateur Mac :

```bash
whoami
```

Le résultat (par exemple `marie`) est votre username PostgreSQL.

---

## Étape 9 — Créer le fichier .env

Dans le terminal Cursor (toujours dans le dossier du projet) :

```bash
echo "DATABASE_URL=postgresql://$(whoami)@localhost:5432/gisele_law
SESSION_SECRET=demo-secret-local" > .env
```

Cette commande utilise automatiquement votre nom d'utilisateur Mac.

Pour vérifier que le fichier est bien créé :

```bash
cat .env
```

Vous devriez voir quelque chose comme :

```
DATABASE_URL=postgresql://marie@localhost:5432/gisele_law
SESSION_SECRET=demo-secret-local
```

---

## Étape 10 — Installer les dépendances du projet

```bash
npm install
```

Cela prend 1-2 minutes. Des warnings jaunes sont normaux, les erreurs rouges ne le sont pas.

---

## Étape 11 — Initialiser la base de données

```bash
npm run db:push
```

Cela crée les tables nécessaires dans PostgreSQL.

---

## Étape 12 — Lancer l'application

```bash
npm run dev
```

Le terminal affiche :

```
serving on port 5000
```

---

## Étape 13 — Ouvrir dans le navigateur

Ouvrir **http://localhost:5000** dans Chrome, Safari ou Firefox.

Vous devriez voir la page d'accueil de Gisèle.law.

---

## Scénarios de démonstration

Voir le fichier **DEMO.md** pour 5 scénarios de démo complets avec les réponses à cliquer.

En résumé :

| Démo | Parcours | Résultat |
|------|----------|----------|
| Vente non payée | Particulier → Vie perso → Vente → < 5000€ | Fiche avec 4 étapes de résolution |
| Dépôt de garantie | Particulier → Vie perso → Location → Locataire | Fiche avec cadre légal + démarches |
| Licenciement | Particulier → Vie perso → Employeur → Faute simple | Fiche prud'hommes |
| Dark mode | Cliquer lune/soleil en haut à droite | Thème sombre |
| Tooltips | Survoler le "?" à côté des options | Popup de définition |

---

## Commandes utiles

| Action | Commande |
|--------|---------|
| Lancer l'app | `npm run dev` |
| Arrêter l'app | `Ctrl + C` dans le terminal |
| Relancer après arrêt | `npm run dev` |
| Se connecter (mode dev) | Aller sur http://localhost:5000/api/login |
| Réinitialiser la base | `npm run db:push` |

---

## En cas de problème

| Erreur | Solution |
|--------|---------|
| `command not found: npm` | Refaire l'étape 6 (installer Node.js) |
| `command not found: psql` | Refaire l'étape 7 (PATH PostgreSQL) |
| `role "xxx" does not exist` | Vérifier le username dans `.env` avec `whoami` |
| `database "gisele_law" does not exist` | Relancer `createdb gisele_law` |
| `DATABASE_URL must be set` | Vérifier que `.env` existe : `cat .env` |
| `EADDRINUSE: port 5000` | `kill -9 $(lsof -t -i:5000)` puis `npm run dev` |
| Page blanche dans le navigateur | `Cmd + Shift + R` pour hard refresh |
| `Cannot find module` | Relancer `npm install` |
