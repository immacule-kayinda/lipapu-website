# Joga, site vitrine

Site web de **Joga**, application de rencontres pour relations sérieuses, lancée d'abord à Kinshasa.
Le site ne fait que **présenter** l'application : pas de connexion, pas de profils, pas de messagerie.
Il présente l'app, renvoie vers les stores (bientôt), collecte une liste d'attente et publie les pages légales.

Les règles du projet sont dans [`docs/`](docs/) : commencer par [`docs/GUIDELINES.md`](docs/GUIDELINES.md),
puis [`docs/INTERFACE.md`](docs/INTERFACE.md) (guideline du site) et [`docs/PERIMETRE.md`](docs/PERIMETRE.md).
Les tokens de design sont dans [`design/tokens.json`](design/tokens.json) (source unique).

## Pile

Next.js 16 (App Router), React 19, TypeScript strict, next-intl, CSS Modules et variables CSS générées depuis les tokens,
polices Instrument Serif et Inter via `next/font`, Vitest, ESLint, Prettier. Node 22 et npm.

## Démarrage

```bash
nvm use            # Node 22 (voir .nvmrc)
npm install
cp .env.example .env.local   # facultatif en local
npm run dev        # http://localhost:3000
```

Variables d'environnement (voir `.env.example`) :

| Variable           | Rôle                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `SITE_URL`         | URL publique (sitemap, robots, Open Graph). Lue au build.                                      |
| `WAITLIST_API_URL` | API du backend qui reçoit la liste d'attente : `https://api.joga.kayinda.dev/v1/waitlist`. Absente : le formulaire répond « indisponible ». |

## Scripts

| Commande               | Rôle                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Serveur de développement (régénère les tokens)                      |
| `npm run build`        | Build de production (régénère les tokens)                           |
| `npm start`            | Sert le build de production                                         |
| `npm run tokens`       | Génère `src/styles/tokens.css` depuis `design/tokens.json`          |
| `npm run tokens:check` | Échoue si `tokens.css` n'est pas à jour (utilisé par la CI)         |
| `npm run lint`         | ESLint (config Next.js)                                             |
| `npm run typecheck`    | TypeScript sans émission                                            |
| `npm test`             | Tests Vitest (validation du formulaire, i18n, tokens et contrastes) |
| `npm run format`       | Prettier (écrit) ; `npm run format:check` pour vérifier             |

## Structure

```
design/tokens.json        tokens de design (ne pas copier les valeurs ailleurs)
docs/                     guidelines, périmètre, écrans
messages/                 textes : fr.json (livré), ln.json et en.json (copie TODO, mêmes clés)
scripts/generate-tokens.mjs   tokens.json -> src/styles/tokens.css (clair, sombre, data-theme)
src/app/[locale]/         pages (accueil, sécurité, blog, à propos, légal, suppression), 404, erreur
src/app/api/waitlist/     route serveur de la liste d'attente
src/components/           composants (un composant de boutons stores, formulaire, logo, thème)
src/config/site.ts        URL du site, liens des stores, pages publiques
src/i18n/                 routage next-intl, chargement des messages
src/lib/                  validation du formulaire, métadonnées, thème
src/proxy.ts              routage des langues (le français n'a pas de préfixe)
tests/                    tests Vitest
```

## Règles à retenir

- Aucune chaîne en dur : tout passe par `messages/*.json`. Toute clé ajoutée à `fr.json` doit l'être dans `ln.json` et `en.json` (un test le vérifie).
- Aucune valeur de design en dur : variables CSS issues des tokens (un test refuse les couleurs littérales).
- Pas de script tiers, pas de cookie. Le choix de thème reste dans le `localStorage` du navigateur.
- Liste d'attente : le navigateur n'appelle que `/api/waitlist` ; le serveur valide puis relaie vers `WAITLIST_API_URL`. Rien n'est stocké dans le site.
- Activer le lingala ou l'anglais : relire les traductions, puis ajouter la langue à `ENABLED_LOCALES` dans `src/i18n/routing.ts`.
- Liens des stores : renseigner `STORE_LINKS` dans `src/config/site.ts` ; les boutons passent de « Bientôt » à des liens.

## Contenu provisoire

Tous les textes sont provisoires. Les pages légales (CGU, confidentialité, cookies, suppression de compte) sont
marquées « texte provisoire, à faire valider par un juriste » et ne doivent pas être publiées en l'état.

## Intégration continue

`.github/workflows/ci.yml` (push et pull request) : installation, tokens à jour, lint, format, types, tests, build.

## Déploiement prévu

Vercel ou Railway (à décider), Cloudflare devant. Variables à définir chez l'hébergeur : `SITE_URL` (avant le build)
et `WAITLIST_API_URL`. Les en-têtes de sécurité (CSP, HSTS, etc.) sont posés par `next.config.ts`.
