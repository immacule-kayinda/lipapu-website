# Joga — Guideline générale

> À relire au début de chaque étape de travail (conception, design, code, contenu).
> Ce document est la mémoire du projet. Si une demande contredit un point ici, **on le signale avant d'agir**, puis on met ce document à jour si la décision change.
> Documents liés : `PERIMETRE.md` (périmètre et architecture), `ECRANS.md` (écrans et parcours), `design/tokens.json` (design tokens), `INTERFACE.md` (guideline de ce repo ; les autres interfaces ont leur propre repo).

## 1. Le projet en une phrase

**Joga** est une application mobile de rencontres pour **relations sérieuses**, dans l'esprit de Hinge, pour des personnes de **22 à 40 ans**, lancée d'abord à **Kinshasa**. Le site web ne fait que présenter l'app ; tout se passe dans l'app.

*(Le nom « Joga » est retenu mais les vérifications de marque et de disponibilité sur les stores ne sont pas faites. Ancien nom de travail : Lipapu.)*

## 2. Les valeurs à ne jamais perdre

1. **Sérieux et respect.** Pas de jeu, pas de pression, pas de dark patterns. Peu de likes par jour, des réponses écrites, un rythme posé.
2. **Sécurité avant fonctionnalités.** Signaler, bloquer, supprimer son compte, vérification des profils, modération des photos : ce sont des fonctions de base, pas des options.
3. **Sobre et élégant.** Interface en noir et blanc, premium, minimaliste. La seule couleur d'écran vient des photos.
4. **Pensé pour le terrain.** Android milieu de gamme, réseaux lents ou instables, plein soleil. L'app doit rester utilisable dans ces conditions.
5. **Accessible et inclusif.** Contrastes forts, zones tactiles d'au moins 44 px, texte qui suit les réglages du système, jamais d'information par la couleur seule.
6. **Données sensibles au minimum.** Photos, selfies, religion : consentement explicite, rétention courte, droit à la suppression.
7. **Un bon début avant le grand final.** Qualité et solidité avant la vitesse. Il n'y a pas de date imposée.

## 3. Décisions actées (registre)

| Sujet | Décision |
|---|---|
| Marché de lancement | Kinshasa (RDC), puis d'autres villes |
| Public | Hétérosexuel exclusivement, 22 à 40 ans |
| Positionnement | Relations sérieuses |
| Langues | Français en premier ; i18n dès le départ : `fr`, `ln` (lingala), `en` ; `sw` plus tard |
| Plateformes | iOS et Android ensemble ; Android est la cible de test principale |
| Frontend mobile | Expo (React Native, TypeScript) |
| Site et admin | Next.js |
| Backend | TypeScript, NestJS, architecture orientée services (un seul code) |
| Base de données | PostgreSQL avec PostGIS ; Redis pour files, quotas et temps réel |
| Hébergement | Railway ; photos sur Cloudflare R2 ; Cloudflare devant |
| Authentification | OTP téléphone et OAuth (Apple, Google) |
| Vérification de profil v1 | Selfie avec défi aléatoire, pré-tri automatique, validation humaine dans l'admin. AWS Rekognition préparé derrière une interface commune, désactivé |
| Modération photo | Google Cloud Vision SafeSearch à l'upload |
| Profil | Calqué sur Hinge : 3 à 6 photos, 3 prompts, Vitals, Virtues, Vices. Ni politique ni ethnie en v1. Religion optionnelle |
| Design | Noir et blanc, photos en couleur, clair par défaut avec mode sombre |
| Typographie | Instrument Serif (titres, prénoms, prompts) + Inter (interface) |
| Logo | Deux anneaux entrelacés + mot « Joga » |
| Ton | Tutoiement dans l'app, vouvoiement dans les pages légales (à confirmer) |
| Monétisation | Non décidée. Piste : freemium (quota de likes, filtres avancés payants). Quotas et filtres avancés derrière des drapeaux de configuration |
| Calendrier | Pas de date imposée. Le projet peut glisser |

## 4. Hors périmètre v1

Paiement et abonnement · messages vocaux · appels audio et vidéo · vérification d'identité par pièce · orientations autres qu'hétérosexuelle · événements, groupes, fonctions sociales · politique et ethnie dans le profil.

## 5. Règles non négociables (toutes interfaces)

1. **Pas de chaîne de texte en dur** : tout passe par l'i18n (clés), français livré, lingala préparé.
2. **Pas de valeur de design en dur** : couleurs, tailles, rayons, espaces viennent de `design/tokens.json`.
3. **`gender` et `looking_for` sont des champs séparés**, même si la v1 n'autorise que le croisement hétérosexuel.
4. **Quotas, poids de matching et filtres avancés sont de la configuration**, pas du code.
5. **Chaque écran définit ses états** : chargement, vide, erreur, hors-ligne, et succès quand c'est pertinent.
6. **Aucun emoji dans l'interface.** Les icônes sont des traits fins de 1,6 sur une grille de 24.
7. **Aucun secret, aucune donnée personnelle dans les journaux ni dans le code.**
8. **Chaque action de modération est tracée** (qui, quoi, quand, pourquoi).
9. **Tout ce qui est partagé entre repos passe par l'OpenAPI du backend et par `tokens.json`**, jamais par copier-coller.
10. **Les textes de l'interface suivent la voix de la charte** : direct, chaleureux, sans pression.

## 6. Définition de « terminé » (pour toute fonctionnalité)

- Fonctionne en clair et en sombre, sur Android milieu de gamme et sur iOS.
- Tous les états de l'écran sont traités (chargement, vide, erreur, hors-ligne).
- Aucun texte en dur, aucune valeur de design en dur.
- Contrastes AA, zones tactiles ≥ 44 px, libellés d'accessibilité sur les icônes seules.
- Testé sur connexion lente.
- Les données sensibles sont couvertes (consentement, rétention, suppression).
- La documentation et ce registre sont à jour si une décision a changé.

## 7. Comment travailler

1. Relire ce document et la guideline de l'interface concernée avant de commencer.
2. Si la demande contredit une décision ci-dessus, le dire clairement et demander avant d'agir.
3. Ne pas ajouter de fonctionnalité hors périmètre sans validation.
4. Quand une décision change, mettre à jour le registre (§3) et le journal (§9).
5. Pour tout choix de design, partir de la charte graphique, puis des composants existants, avant d'inventer.

## 8. Questions ouvertes

- Nom définitif : vérification de marque et de disponibilité (stores, domaine).
- Tutoiement : confirmé ou non.
- Lingala : les polices contiennent-elles les lettres ɛ et ɔ ?
- OTP : délivrabilité SMS en RDC (Twilio, WhatsApp, agrégateur local).
- Monétisation : modèle, prix, moyens de paiement (mobile money).
- Ville et communes de lancement : liste exacte.
- Vérification : seuil à partir duquel passer d'une validation manuelle à AWS.
- Cadre légal : conformité des données personnelles en RDC et dans les stores.

## 9. Journal des décisions

| Date | Décision |
|---|---|
| 2026-11-09 | Cadrage : app type Hinge, Kinshasa, hétéro, relations sérieuses, fr + i18n, iOS + Android, Expo + Next.js, backend TypeScript + Postgres, Railway. Pas de date imposée |
| 2026-11-09 | Architecture orientée services, vérification selfie manuelle assistée (AWS préparé), modération photo avec Google Cloud Vision |
| 2026-11-09 | Nom retenu : Joga. Direction visuelle : mélange éditorial + nuit, noir et blanc, photos en couleur |
| 2026-11-10 | Charte graphique v0.1 (marque, fondations, composants) et `tokens.json` |
| 2026-11-10 | Guidelines par interface et inventaire des écrans |
