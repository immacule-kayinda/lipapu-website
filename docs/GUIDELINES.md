# Joga — Guideline générale

> À relire au début de chaque étape de travail (conception, design, code, contenu).
> Ce document est la mémoire du projet. Si une demande contredit un point ici, **on le signale avant d'agir**, puis on met ce document à jour si la décision change.
> Documents liés : `PERIMETRE.md` (périmètre et architecture), `ECRANS.md` (écrans et parcours), `ADMIN-SCOPE.md` (admin : rôles et configuration), `BUSINESS.md` (business model), `DATA-MODEL.md` (modèle de données), `design/tokens.json` (design tokens), `INTERFACE.md` (guideline de ce repo ; les autres interfaces ont leur propre repo).

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
| Hébergement | Railway ; photos et selfies sur Google Cloud Storage (décision du 2026-11-11, remplace Cloudflare R2) ; Cloudflare devant (DNS, WAF) |
| Authentification | OTP téléphone et OAuth (Apple, Google) |
| Vérification de profil v1 | Selfie avec défi aléatoire, pré-tri automatique, validation humaine dans l'admin. AWS Rekognition préparé derrière une interface commune, désactivé |
| Modération photo | Google Cloud Vision SafeSearch à l'upload |
| Profil | Calqué sur Hinge : 3 à 6 photos, 3 prompts, Vitals, Virtues, Vices. Ni politique ni ethnie en v1. Religion optionnelle |
| Design | Noir et blanc, photos en couleur, clair par défaut avec mode sombre |
| Typographie | Instrument Serif (titres, prénoms, prompts) + Inter (interface) |
| Logo | Deux anneaux entrelacés + mot « Joga » |
| Ton | Tutoiement partout (app et site), vouvoiement dans les pages légales seulement. Confirmé |
| Monétisation | Freemium (abonnement « Joga+ ») comme piste principale, à tester après le lancement ; la v1 est gratuite. La sécurité n'est jamais payante, pas de publicité. Voir `BUSINESS.md`. Recherche faite le 2026-11-10 (résultats au §9 de `BUSINESS.md`) |
| Paiement de Joga+ | Achats intégrés Apple et Google d'abord (obligatoire pour les abonnements dans l'app) ; mobile money comme second canal à étudier (pawaPay en premier candidat), à travers une interface `PaymentProvider`. Pas de bouton mobile money dans l'app pour l'instant |
| Codes de connexion | Recommandation de la recherche, à confirmer : WhatsApp en canal principal, SMS en repli, plafonds anti-fraude |
| Calendrier | Pas de date imposée. Le projet peut glisser |
| Admin : rôles | 8 rôles validés (propriétaire, administrateur, responsable modération, modérateur, support, éditeur de contenu, analyste, finance) avec matrice de permissions et second avis pour les actions sensibles. Voir `ADMIN-SCOPE.md` |
| Admin : connexion | Compte nominatif (un compte par personne, créé sur invitation), e-mail + second facteur obligatoire. Pas de compte partagé ni d'inscription libre |
| Configuration | Tout réglage de l'app est un paramètre défini une fois, versionné, avec portée, bornes et audit ; l'admin génère ses formulaires depuis ces définitions. Les garde-fous de sécurité restent dans le code |
| Textes de l'interface | Embarqués dans l'app, pas de textes distants. Les corrections de traduction (lingala) passent par une mise à jour de l'app, y compris à distance via EAS Update |
| Espace couple | Idée pour plus tard : quelques mini-jeux simples à jouer à distance à deux. Non construit en v1, mais à préparer (relation de couple dans le modèle de données, temps réel disponible) |
| « Nous sommes en couple » | Dans la v1 : proposition puis confirmation par les deux personnes, d'un commun accord. Les deux profils sont alors mis en pause. Chacune peut mettre fin au couple seule |
| Âge et date de naissance | Date exacte stockée. Affichage au choix : âge seul, ou âge avec jour et mois d'anniversaire |
| Localisation | Commune seulement. Aucune position précise stockée ; distance entre communes |
| Likes | Un seul like par personne |
| Suppression de compte | Délai de grâce de 14 jours (réglable) |
| Changement de numéro | Autonome, nouveau numéro seul vérifié ; délai de carence, notification et journal pour limiter la prise de contrôle |
| Numéro de téléphone | Chiffré par l'application (clé hors base), unicité par empreinte HMAC |
| Appareils | 3 appareils actifs par compte (réglable) |
| Rétention | Messages supprimés 30 jours après unmatch ou rupture (sauf signalement) ; signalements clos 12 mois (à valider par un juriste) |
| Partitionnement | Mensuel dès le départ : messages, impressions, audit_log, outbox_events |

## 4. Hors périmètre v1

Paiement et abonnement · messages vocaux · appels audio et vidéo · vérification d'identité par pièce · orientations autres qu'hétérosexuelle · événements, groupes, fonctions sociales · politique et ethnie dans le profil · espace couple et mini-jeux (prévus plus tard).

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
11. **Les champs à contour (`border-strong`) se posent sur le fond d'écran, jamais sur une carte grise** : sur `surface`, le contraste tombe sous 3:1.
12. **La sécurité n'est jamais payante** : vérification, signalement, blocage, suppression de compte restent gratuits pour tous.

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
- Espace web « Mon compte » après le lancement (suppression de compte, export, abonnement, par code SMS) : à confirmer.
- Lingala : les polices contiennent-elles les lettres ɛ et ɔ ?
- OTP : délivrabilité SMS en RDC (Twilio, WhatsApp, agrégateur local).
- Business : prix de Joga+, devise, seuil d'ouverture de l'offre payante, choix de l'agrégateur de mobile money. Vérifications listées dans `BUSINESS.md` §9.
- Cadre légal congolais (Code du numérique, TVA numérique, rapatriement des fonds, société) : à valider par un juriste local.
- Ville et communes de lancement : liste exacte.
- Vérification : seuil à partir duquel passer d'une validation manuelle à AWS.
- Cadre légal : conformité des données personnelles en RDC et dans les stores.
- Modèle de données : brouillon dans `DATA-MODEL.md`, à valider. Dix décisions prises ; migrations de l'étape 1 écrites et testées.
- Espace couple (plus tard) : liste des mini-jeux, forme (mode « Nous » dans la même app).

## 9. Journal des décisions

| Date | Décision |
|---|---|
| 2026-11-09 | Cadrage : app type Hinge, Kinshasa, hétéro, relations sérieuses, fr + i18n, iOS + Android, Expo + Next.js, backend TypeScript + Postgres, Railway. Pas de date imposée |
| 2026-11-09 | Architecture orientée services, vérification selfie manuelle assistée (AWS préparé), modération photo avec Google Cloud Vision |
| 2026-11-09 | Nom retenu : Joga. Direction visuelle : mélange éditorial + nuit, noir et blanc, photos en couleur |
| 2026-11-10 | Charte graphique v0.1 (marque, fondations, composants) et `tokens.json` |
| 2026-11-10 | Guidelines par interface et inventaire des écrans |
| 2026-11-10 | Initialisation des 4 projets (mobile, backend, site, admin) |
| 2026-11-10 | Validé : 8 rôles de l'admin et matrice de permissions ; connexion par e-mail + second facteur ; tutoiement partout sauf pages légales |
| 2026-11-10 | Refusé : textes de l'interface modifiables à distance (trop lourd). Corrections de traduction via mise à jour de l'app |
| 2026-11-10 | Business model posé comme sujet de premier plan (`BUSINESS.md`) ; recherche lancée sur paiements, stores et marché |
| 2026-11-10 | Espace couple : idée de mini-jeux simples à distance, à préparer sans le construire en v1 |
| 2026-11-10 | Recherche business terminée (stores, mobile money, marché, concurrents, cadre légal, codes de connexion). Conclusions dans `BUSINESS.md` §9 : achats intégrés d'abord, mobile money en second canal à étudier, v1 gratuite |
| 2026-11-10 | Brouillon du modèle de données (`DATA-MODEL.md`) |
| 2026-11-10 | Décisions sur le modèle : date de naissance exacte à affichage limité ; suppression avec 14 jours de grâce ; commune seulement ; « Nous sommes en couple » dès la v1 d'un commun accord ; un seul like par personne |
| 2026-11-10 | Réponses aux six questions du modèle de données ; migrations de l'étape 1 écrites et testées (backend) |
| 2026-11-11 | Les photos et selfies sont stockés sur Google Cloud Storage (au lieu de Cloudflare R2) ; la modération reste Google Cloud Vision. Interface `StorageProvider` inchangée |
