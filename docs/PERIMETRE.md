# Joga — Périmètre et architecture (v1)

Statut : brouillon de travail, à valider. Dernière mise à jour : 2026-11-10. (Ancien nom de travail : Lipapu.) Documents associés : `ADMIN-SCOPE.md`, `BUSINESS.md`.

## 1. Vision

Joga est une application mobile de rencontres orientée **relations sérieuses**, dans l'esprit de Hinge : profils riches (photos + prompts), interaction ciblée (on réagit à un élément précis du profil), likes limités, conversation uniquement après un match.

- **Marché de lancement** : Kinshasa (RDC), puis d'autres villes.
- **Cible** : hétérosexuelle exclusivement.
- **Langues** : français en priorité ; i18n dès le premier écran (`fr`, `ln` lingala, `en`, `sw` plus tard).
- **Plateformes** : iOS et Android ensemble ; Android = cible de test principale.
- **Le site web** ne sert qu'à présenter l'app. Toute l'expérience est dans l'app mobile.
- **Calendrier** : pas de date imposée. Publication publique sur les stores quand la v1 est prête.

## 2. Repos

| Repo | Contenu |
|---|---|
| `mobile` | App Expo (React Native, TypeScript) |
| `backend` | Monorepo TypeScript : api-core, realtime-gateway, workers |
| `admin-panel` | Next.js : modération, vérifications, signalements |
| `lipapu-website` | Next.js : vitrine, blog, liste d'attente, pages légales |

Contrat entre repos : le backend publie une spécification **OpenAPI** ; les clients (mobile, admin, site) génèrent leurs types TypeScript depuis cette spécification.

## 3. Périmètre v1

### 3.1 Dans le périmètre

**Compte et authentification**
- Inscription et connexion par **OTP téléphone**.
- **OAuth** : Apple et Google.
- Un compte = un numéro de téléphone unique.
- Suppression de compte et export des données.

**Profil (calqué sur Hinge)**
- 3 à 6 photos ; 3 prompts (225 caractères max chacun, à choisir dans une liste d'au moins 30 au lancement, extensible).
- *Vitals* : prénom, âge, genre, taille, commune, métier, études, enfants / projets familiaux.
- *Virtues* : religion, langues parlées, ville d'origine, intention de rencontre (*dating intentions*), type de relation.
- *Vices* : alcool, tabac, cannabis, autres drogues.
- Chaque champ peut être affiché ou masqué.
- Politique et ethnie : **non collectés en v1** (sensibilité locale, données sensibles).
- Religion : optionnelle, avec consentement explicite.

**Découverte et matching**
- Préférences : tranche d'âge, zone (commune/distance), filtres avancés (taille, enfants, alcool, tabac, éducation…).
- Feed quotidien : un lot de profils par jour, pas de flux infini.
- Like avec commentaire sur une photo ou un prompt précis ; passer.
- Quota de likes quotidien, **configurable** (permet un futur abonnement).
- Écran « Likes reçus ».
- Match mutuel → conversation.

**Chat**
- Texte en temps réel (WebSocket), historique persistant.
- Indicateurs : envoyé / distribué / lu, « en train d'écrire ».
- Fonctionnement tolérant aux coupures réseau (file d'envoi, reconnexion, retry).

**Notifications**
- Push : nouveau like, nouveau match, nouveau message, rappel du feed.
- Réglages fins par catégorie.

**Sécurité, modération, conformité**
- Signaler, bloquer, désinscrire un profil.
- Modération automatique des photos à l'upload (Google Cloud Vision SafeSearch).
- **Vérification du profil par selfie** (voir §6) : badge « profil vérifié ».
- Détection de signaux d'arnaque dans le chat (liens, numéros, demandes d'argent envoyés trop tôt).
- Panneau d'admin : voir `ADMIN-SCOPE.md` (modération, membres, configuration complète, business, équipe et rôles).
- Pages légales : CGU, confidentialité, suppression de compte (exigées par les stores).

**Site web**
- Page d'accueil, liens stores, liste d'attente, pages légales, blog, SEO de base.

### 3.2 Hors périmètre v1

- Paiement et abonnement (prévus ensuite ; voir §9).
- Messages vocaux, appels audio/vidéo.
- Vérification d'identité par pièce d'identité.
- Orientations autres qu'hétérosexuelle.
- Événements, groupes, fonctionnalités sociales.
- Politique et ethnie dans le profil.

## 4. Architecture

Principe : architecture **orientée services**, un seul code backend, frontières de modules strictes. Pas de microservices avec une base par service (complexité sans gain à ce stade).

```
Mobile (Expo) ──► Cloudflare (DNS, WAF, rate limiting, CDN)
Admin / Site  ──►        │
                         ├─► api-core ───────► PostgreSQL (+PostGIS)
                         │    (auth, profils, likes,        │
                         │     matchs, vérification,        ├─ outbox
                         │     modération)                  ▼
                         ├─► realtime-gateway        File d'événements
                         │    (WebSocket, chat)       (BullMQ / Redis)
                         │         │                        │
                         │         ▼                        ▼
                         │       Redis            Workers asynchrones :
                         │   (pub/sub, présence)   • matching / feed
                         │                         • médias + modération
                         └─► Cloudflare R2 + CDN   • notifications
                              (photos, selfies)    • anti-fraude / analytics
```

### Composants

- **api-core** (NestJS) : REST + OpenAPI. Auth, profils, likes, matchs, signalements, vérifications.
- **realtime-gateway** : service sans état pour le chat ; scale indépendamment ; Redis pub/sub entre instances ; messages persistés avec accusés de réception.
- **Workers** : tout ce qui est lent ou asynchrone (images, notifications, feeds), avec retries et dead-letter queue.
- **Outbox** : chaque action métier écrit son événement dans la même transaction (`LikeCreated`, `MatchCreated`, `MessageSent`, `MediaUploaded`, `ReportFiled`, `VerificationSubmitted`). Un relais le publie ensuite.
- **PostgreSQL + PostGIS** : source de vérité ; table des messages partitionnée ; PostGIS pour ouvrir d'autres villes sans refonte.
- **Médias** : upload direct vers R2 par URL signée → pipeline asynchrone (redimensionnement, WebP, SafeSearch, hash anti-doublons) → profil visible seulement après validation.
- **Push** : Expo Push Service (FCM / APNs).
- **Observabilité** : OpenTelemetry, Sentry, logs structurés, PostHog (analytics produit).

### Hébergement (Railway)

- Un service Railway par application (api-core, realtime-gateway, workers, cron) ; réseau privé entre eux.
- Postgres Railway (PostGIS via template) : **sauvegardes quotidiennes automatisées vers R2** et plan de restauration testé (pas de haute disponibilité managée).
- L'architecture ne dépend pas de Railway : migration vers un Postgres managé possible.

### Contraintes terrain (Kinshasa)

- Android milieu/bas de gamme dominant → app légère, images WebP redimensionnées côté client.
- Réseau lent et instable → pagination courte, payloads petits, retries, mode dégradé.
- **OTP** : délivrabilité à tester tôt. Recommandation de la recherche (à confirmer) : WhatsApp en canal principal, SMS en repli (Twilio), plafonds anti-fraude ; voir `BUSINESS.md` §9.
- Paiement : cartes bancaires peu répandues → mobile money (M-Pesa, Airtel Money, Orange Money) à étudier avant la monétisation.

## 5. Algorithme de matching

Pas de machine learning en v1 (pas de données). Pipeline en trois étapes, exécuté de façon asynchrone.

1. **Filtres éliminatoires** (SQL + PostGIS) : genre / recherche mutuels, tranche d'âge acceptée des deux côtés, zone, jamais vu ni liké, pas de blocage ni de signalement, compte actif, photos validées.
2. **Scoring** (worker nocturne, liste classée stockée par utilisateur) : somme pondérée de
   - intention relationnelle compatible (poids le plus fort) ;
   - projets familiaux, religion, langues en commun ;
   - proximité (commune / distance) ;
   - profil complet, récemment actif, profil vérifié ;
   - bonus de réciprocité (a liké des profils semblables au mien).
   Poids dans un fichier de configuration versionné.
3. **Feed du jour** : lot de N profils, avec diversité et plafond d'exposition par profil (évite la surexposition des profils populaires).

**Pick du jour** (« Most Compatible ») : appariement de type Gale-Shapley sur les listes de préférences, quand la base d'utilisateurs le permet.

**Amorçage** : tant que la base est petite, relâchement progressif des filtres (zone, âge) plutôt qu'un feed vide.

**Apprentissage** : toutes les impressions, likes et passes sont journalisés ; plus tard, remplacement des poids manuels par un modèle appris, avec A/B testing des versions de score.

## 6. Vérification de profil par selfie

### v1 : manuelle assistée

1. L'app demande un selfie avec un **défi aléatoire** (geste ou code à montrer).
2. **Pré-tri automatique** (IA) : défi présent, un seul visage, image nette, pas de photo d'écran. Cette étape **ne décide pas de l'identité**.
3. **Revue humaine** dans le `admin-panel` : le modérateur compare le selfie aux photos du profil, approuve ou refuse (avec motif).
4. Le selfie est **supprimé après décision** (rétention max 7 jours) ; seul le résultat est conservé.
5. Badge « profil vérifié » visible sur le profil. Facultatif en v1, pas une barrière à l'inscription.

### Préparé pour plus tard : AWS Rekognition Face Liveness

Le backend définit une interface `VerificationProvider` :

```ts
interface VerificationProvider {
  createSession(userId: string): Promise<{ sessionId: string; challenge?: string; uploadUrl?: string }>;
  submit(sessionId: string, evidence: Evidence): Promise<void>;
  getResult(sessionId: string): Promise<{
    status: 'pending' | 'needs_review' | 'approved' | 'rejected';
    reasons?: string[];
  }>;
}
```

- `ManualProvider` (v1) : alimente la file d'admin.
- `AwsRekognitionProvider` (préparé, désactivé) : Face Liveness + CompareFaces (selfie vs photos du profil).
- Sélection par configuration (`VERIFICATION_PROVIDER=manual|aws`), sans changement côté app.
- Coût indicatif AWS : environ 0,015 $ par vérification de liveness (tarif public, à confirmer).
- Avant de basculer : tester la précision sur des visages locaux (risque de biais démographiques).

### Données et vie privée

- Aucun gabarit biométrique (embedding) stocké par Joga.
- Consentement explicite avant la vérification ; chiffrement au repos ; accès restreint aux modérateurs.

## 7. Modèle de données (haut niveau)

Détail et questions ouvertes : voir `DATA-MODEL.md`. Entités principales :

- `users`, `auth_identities` (téléphone, Apple, Google), `devices`
- `profiles`, `profile_fields`, `photos`, `prompts`, `prompt_answers`
- `preferences`
- `impressions`, `likes`, `passes`, `matches`
- `conversations`, `messages`, `message_receipts`
- `reports`, `blocks`, `moderation_actions`
- `verifications` (provider, statut, motif, dates ; pas de média conservé)
- `notifications`, `push_tokens`
- `outbox_events`
- Admin : `admin_users`, `roles`, `permissions`, `admin_sessions`, `audit_log`
- Configuration : `config_definitions`, `config_versions`, `config_overrides` (portée : ville, plateforme, segment)
- Business : `products`, `prices`, `entitlements`, `subscriptions`, `payments`, `refunds`
- Plus tard (couple) : `couples` (état : aucune, active, terminée ; date du match), `couple_games`

Règles de conception : `gender` et `looking_for` séparés (extensible), toutes les chaînes d'interface traduites via clés i18n, quotas configurables.

## 8. Phases de construction

1. **Fondations** : monorepo, CI/CD, Postgres, auth OTP + OAuth, i18n, observabilité, service de configuration, rôles et authentification de l'admin.
2. **Profil et médias** : édition de profil, upload, pipeline photo, modération photo.
3. **Vérification** : défi selfie, pré-tri, file d'admin, interface `VerificationProvider`.
4. **Découverte** : préférences, workers de feed, likes, quotas, likes reçus, matchs.
5. **Chat et notifications** : realtime-gateway, accusés, indicateurs, push, réglages.
6. **Sécurité et modération** : signalements, blocages, anti-arnaque, panneau d'admin complet.
7. **Site web** : vitrine, blog, liste d'attente, pages légales.
8. **Bêta fermée à Kinshasa** : tests terrain, correctifs, durcissement.
9. **Soumission aux stores** : review Apple / Google, puis lancement public.

## 9. Monétisation (à décider avant le lancement)

- Voir `BUSINESS.md`. Piste principale : freemium (« Joga+ ») à tester après le lancement ; la v1 est gratuite. La sécurité n'est jamais payante.
- Gratuit : quota de likes quotidien. « Joga+ » : plus de likes, filtres avancés, voir qui a liké.
- Options de paiement à étudier : stores (Apple/Google, via RevenueCat) et mobile money local.
- En v1 : tout gratuit, mais quotas et filtres avancés derrière des drapeaux de configuration.

## 10. Risques et points ouverts

| Sujet | Risque / question |
|---|---|
| Amorçage | Une app de rencontre vide n'a pas de valeur : liste d'attente, lancement ciblé par commune. |
| OTP | Délivrabilité SMS en RDC à valider tôt. |
| Arnaques sentimentales | Signal fort : vérification, détection de contenu suspect dans le chat. |
| Review des stores | Dating + contenu utilisateur : signalement, blocage, suppression de compte obligatoires. |
| Données sensibles | Religion, photos, selfies : consentement, rétention minimale, droit à la suppression. |
| Équilibre hommes/femmes | Souvent déséquilibré : suivre dès la bêta. |
| Langues | Lingala : traductions à faire valider par des locuteurs. |
| Postgres Railway | Pas de haute dispo managée : sauvegardes à tester. |
| Biais de la reconnaissance faciale | À mesurer sur des visages locaux avant d'automatiser avec AWS. |

## 11. Espace couple (idée pour plus tard)

Quand deux personnes deviennent un couple, elles peuvent jouer ensemble, à distance, à quelques mini-jeux simples. Hors v1, mais à préparer :
- une relation de couple dans le modèle de données (état, date du match) ;
- des jeux au tour par tour (asynchrones), adaptés aux réseaux lents, qui s'appuient sur le temps réel existant ;
- aucune fonction de surveillance (pas de localisation partagée) ; une rupture se gère simplement ;
- forme envisagée : mode « Nous » dans la même app. À valider.

## 12. Prochaines étapes

1. Valider ce document (corrections, ajouts, retraits).
2. Rédiger et valider le modèle de données, puis le contrat d'API (OpenAPI).
3. Résultats de la recherche business (paiements, stores, concurrents), puis décision sur l'offre.
4. Choisir la liste initiale de prompts et les libellés des champs de profil en français.
5. Maquettes finales avec le style de la charte.
