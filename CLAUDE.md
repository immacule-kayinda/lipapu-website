# Joga — site vitrine (Next.js)

Application de rencontres pour relations sérieuses (Kinshasa d'abord). Ce repo : **site vitrine (Next.js)**.

## Avant toute tâche

Lire dans cet ordre, à chaque étape de travail :

1. @docs/GUIDELINES.md — la guideline générale (valeurs, décisions actées, règles non négociables, définition de « terminé »).
2. @docs/INTERFACE.md — la guideline de ce repo.
3. @docs/ECRANS.md — inventaire des écrans et parcours (si la tâche touche à l'interface).
4. @docs/PERIMETRE.md — périmètre v1 et architecture.
5. `design/tokens.json` — tokens de design (source unique, ne jamais copier de valeurs en dur).

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

À compléter à l'initialisation du projet.
