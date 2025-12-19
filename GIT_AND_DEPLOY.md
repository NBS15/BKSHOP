# BKSHOP — Git & Déploiement

Ce fichier contient des instructions étape par étape pour initialiser Git, pousser vers GitHub, et déployer `UserFrontend` sur GitHub Pages.

## Pré-requis

- Installer Git : https://git-scm.com/
- Avoir Node.js + npm installés
- Avoir créé un repository GitHub (par ex. `https://github.com/NBS15/BKSHOP.git`)

## Initialiser le dépôt local et pousser vers GitHub

Exécuter depuis le dossier racine du projet (`final_project`):

```bash
# créer le README si nécessaire
echo "# BKSHOP" >> README.md

git init
git add README.md
git commit -m "first commit"
git branch -M main
# remplacez l'URL par la vôtre si nécessaire
git remote add origin https://github.com/NBS15/BKSHOP.git
# pousser (HTTPS demandera identifiants ou PAT)
git push -u origin main
```

Remarques d'authentification:
- Pour éviter les prompts d'identifiants HTTPS, configure une clé SSH et ajoute-la à GitHub, ou crée un Personal Access Token (PAT) et utilise-le comme mot de passe pour HTTPS pushes.

## Déployer `UserFrontend` sur GitHub Pages (avec `gh-pages`)

1. Remplace le placeholder `REPO_NAME` dans `UserFrontend/vite.config.ts` par `/BKSHOP/` (ou `/ton-repo/`). Exemple :

```ts
// UserFrontend/vite.config.ts
export default defineConfig({
  base: '/BKSHOP/',
  plugins: [react()],
  ...
})
```

2. Installer les dépendances et construire :

```bash
cd UserFrontend
# si peer deps posent problème : npm install --legacy-peer-deps
npm install
npm run build
```

3. Déployer via `gh-pages` (nous avons ajouté un script `deploy` dans `package.json` qui utilise `gh-pages`):

```bash
npm run deploy
```

L'application sera disponible à : `https://<github-username>.github.io/<repo-name>/`.

## Si tu veux que j'exécute les commandes pour toi

Je peux:
- remplacer `REPO_NAME` automatiquement par `/BKSHOP/` dans `UserFrontend/vite.config.ts` (à confirmer)
- lancer `npm run deploy` (si tu veux que j'utilise `--legacy-peer-deps`, dis-le)

Dis-moi quelle action suivante tu veux que j'effectue.
