# Joga — site vitrine (Next.js)

Application de rencontres pour relations sérieuses (Kinshasa d'abord). Ce repo : **site vitrine (Next.js)**.

## Avant toute tâche

Lire dans cet ordre, à chaque étape de travail :

1. @docs/GUIDELINES.md — la guideline générale (valeurs, décisions actées, règles non négociables, définition de « terminé »).
2. @docs/INTERFACE.md — la guideline de ce repo.
3. @docs/ECRANS.md — inventaire des écrans et parcours (si la tâche touche à l'interface).
4. @docs/PERIMETRE.md — périmètre v1 et architecture.
5. `design/tokens.json` — tokens de design (source unique, ne jamais copier de valeurs en dur).
6. @docs/ADMIN-SCOPE.md — périmètre de l'admin, rôles, catalogue de configuration (la configuration concerne toutes les interfaces).
7. @docs/BUSINESS.md — business model : principes, offres, droits, paiement.
8. @docs/DATA-MODEL.md — modèle de données (brouillon à valider) : tables, règles, rétention.

Si une demande contredit une décision de ces documents, le signaler avant d'agir. Si une décision change, mettre à jour le registre de `docs/GUIDELINES.md` (§3) et le journal (§9).

## Rappels non négociables

- Aucune chaîne de texte en dur : i18n (français livré, lingala et anglais préparés).
- Aucune valeur de design en dur : tokens uniquement.
- Sécurité et modération avant les fonctionnalités ; données sensibles au minimum.
- Pensé pour Android milieu de gamme et réseaux lents ; accessible (contrastes, zones tactiles ≥ 44 px).
- Aucun emoji dans l'interface ; ton direct, chaleureux, sans pression (tutoiement dans l'app).
- Chaque écran : états chargement, vide, erreur, hors-ligne.
- Pas de fonctionnalité hors périmètre v1 sans validation.

## Branche de travail

Développer sur `claude/focused-goldberg-kr37qh`. Ne pas pousser ailleurs sans accord.

## Commandes

Node 22, npm.

- `npm install` : installe les dépendances.
- `npm run dev` : serveur de développement (http://localhost:3000), régénère les tokens.
- `npm run tokens` : génère `src/styles/tokens.css` depuis `design/tokens.json` (`npm run tokens:check` pour vérifier sans écrire). Ne jamais éditer `tokens.css` à la main.
- `npm run lint` : ESLint. `npm run typecheck` : TypeScript. `npm test` : Vitest.
- `npm run format` : Prettier (`npm run format:check` pour vérifier).
- `npm run build` puis `npm start` : build et serveur de production.

Avant de conclure une tâche : `tokens:check`, `lint`, `typecheck`, `test`, `build` doivent passer (la CI les exécute).

## Conventions de code

- Messages dans `messages/fr.json` ; toute clé est ajoutée aussi à `ln.json` et `en.json` (test de parité).
- Styles : CSS Modules et variables issues des tokens (`var(--color-*)`, `var(--space-*)`, classes `t-*` pour la typographie). Aucune couleur ni taille littérale.
- Liens internes : `Link` de `@/i18n/navigation`. Le français n'a pas de préfixe d'URL.
- Liste d'attente : jamais d'appel direct du navigateur vers le backend, uniquement `/api/waitlist`.
- Pas de script tiers, pas de cookie.
