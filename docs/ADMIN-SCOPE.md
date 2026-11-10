# Joga — Panneau d'administration : périmètre, rôles, configuration

> Statut : **validé le 2026-11-10** (rôles et matrice, connexion par e-mail avec second facteur ; textes de l'interface non modifiables à distance). Remplace la version « modération seule » du panneau.
> Lire avec `GUIDELINES.md` et `guidelines/admin-panel.md`. Statut : aucune ligne de code tant que ce périmètre n'est pas validé.

## 1. Rôle du panneau

Le panneau d'administration est le **poste de commande de tout Joga**. Il sert à trois choses :

1. **Faire vivre la communauté** : modérer, vérifier, aider les membres.
2. **Piloter le produit** : régler le moindre paramètre de l'app sans redéployer.
3. **Piloter le business** : offres, prix, abonnements, paiements.

Ce qu'il ne fait pas : le design visuel (couleurs, polices, composants) reste dans le code via `tokens.json`. Les secrets (clés d'API, mots de passe de services) restent dans l'environnement, jamais dans l'admin.

## 2. Organisation par thème (menu)

| Thème | Pages |
|---|---|
| **Travail du jour** | Accueil (files à traiter, délais) |
| **Modération** | Vérifications · Signalements · Photos signalées · Appels des membres |
| **Membres** | Recherche et fiches comptes · Suspensions et bannissements · Demandes de données (export, suppression) · Liste d'attente |
| **Produit** | Configuration (par catégorie) · Listes et référentiels · Gabarits de messages · Fonctionnalités (drapeaux) · Villes et zones · Notifications · Version de l'app et maintenance |
| **Business** | Offres et prix · Abonnements · Paiements · Remboursements · Revenus |
| **Contenu** | Blog · Conseils de sécurité · Annonces dans l'app |
| **Statistiques** | Tableaux agrégés (jamais de données personnelles) |
| **Équipe et sécurité** | Utilisateurs de l'admin · Rôles et permissions · Sessions · Journal d'audit |

Chaque utilisateur ne voit que les pages que son rôle autorise.

## 3. Rôles et permissions

Principes : **moindre privilège** ; une permission = une ressource + une action ; un rôle est un ensemble de permissions ; toute consultation de donnée personnelle est motivée et tracée ; les actions sensibles demandent un **second avis** (« quatre yeux »).

### Rôles proposés

| Rôle | Mission | Nombre prévu |
|---|---|---|
| **Propriétaire** | Responsabilité totale. Gère les administrateurs, accès légal, fournisseurs | 1 à 2 |
| **Administrateur** | Gère l'équipe, la configuration et le business au quotidien | 1 à 3 |
| **Responsable modération** | Encadre les modérateurs, traite les cas difficiles, les appels et les bannissements | 1 à 2 |
| **Modérateur** | Traite les files : vérifications, photos, signalements simples | selon l'activité |
| **Support** | Aide les membres : accès perdu, demandes de données, questions | 1 à 3 |
| **Éditeur de contenu** | Blog, conseils, textes, listes (aucune donnée de membre) | 1 à 2 |
| **Analyste** | Statistiques agrégées en lecture seule | 0 à 2 |
| **Finance** | Abonnements, paiements, remboursements, revenus | 0 à 1 |

Un rôle technique en lecture seule (journaux d'exploitation, sans donnée personnelle) pourra s'ajouter. Des rôles personnalisés sont possibles plus tard.

### Matrice (V = voir · A = agir · P = publier · — = aucun accès)

| Domaine | Propriétaire | Admin | Resp. modération | Modérateur | Support | Éditeur | Analyste | Finance |
|---|---|---|---|---|---|---|---|---|
| File vérifications | V A | V A | V A | V A | — | — | — | — |
| Photos signalées | V A | V A | V A | V A | — | — | — | — |
| Signalements | V A | V A | V A | V A (limité) | V | — | — | — |
| Avertir / suspendre | A | A | A | A (courte durée) | — | — | — | — |
| Bannir (définitif) | A* | A* | A* | — | — | — | — | — |
| Appels des membres | V A | V A | V A | — | V | — | — | — |
| Fiche compte | V A | V A | V A | V (limité) | V (limité) | — | — | V (facturation) |
| Révéler un numéro | A* | A* | A* | — | A* | — | — | — |
| Demandes de données | V A | V A | — | — | V A | — | — | — |
| Liste d'attente | V A | V A | — | — | V | — | V | — |
| Configuration produit | V A P* | V A P* | V | — | — | V | V | — |
| Listes et référentiels | V A P | V A P | V | — | — | V A P | — | — |
| Gabarits de messages | V A P | V A P | — | — | — | V A P | — | — |
| Drapeaux, villes, version | V A P* | V A P* | — | — | — | — | V | — |
| Notifications (modèles) | V A P | V A P | — | — | — | V A | — | — |
| Offres, prix | V A P* | V A P* | — | — | — | — | V | V A |
| Abonnements, paiements | V A | V | — | — | V | — | V | V A |
| Remboursements | A* | A* | — | — | — | — | — | A* |
| Contenu (blog, annonces) | V A P | V A P | — | — | — | V A P | — | — |
| Statistiques | V | V | V | — | — | — | V | V |
| Utilisateurs de l'admin | V A | V A (sauf propriétaires) | — | — | — | — | — | — |
| Rôles et permissions | V A | V | — | — | — | — | — | — |
| Journal d'audit | V | V | V (son équipe) | — | — | — | — | — |

`*` = demande une **validation par une seconde personne** habilitée, ou un motif obligatoire selon le cas.

Cette matrice est une base de discussion : à ajuster avec toi, puis elle devient la configuration initiale des rôles.

## 4. Authentification : ce que « compte nominatif » veut dire

**Nominatif** = chaque membre de l'équipe a **son propre compte**, relié à son identité (nom, adresse e-mail professionnelle), au lieu d'un compte partagé du genre « admin / mot de passe commun ».

Pourquoi : pour savoir **qui** a pris chaque décision (audit), pour retirer l'accès d'une personne qui part sans toucher aux autres, et pour appliquer des rôles différents.

### Comment on se connecte

Proposition, du plus simple au plus complet :

1. **Invitation par un administrateur** : il saisit l'e-mail et choisit le rôle. La personne reçoit un lien d'activation à durée limitée. **Aucune inscription libre.**
2. **Connexion** : e-mail + mot de passe fort **et** second facteur (application d'authentification), ou **clé d'accès** (passkey) quand l'appareil le permet.
3. **Si l'équipe utilise Google Workspace** : connexion avec le compte Google professionnel, second facteur imposé par Google. C'est l'option la plus simple à exploiter.
4. **Premier compte propriétaire** : créé une seule fois par une commande sécurisée à l'installation (jamais par une page web ouverte).
5. **Perte d'accès** : récupération par un administrateur, jamais en libre-service pour un rôle sensible.
6. **Sessions courtes**, déconnexion automatique, liste des appareils connectés, déconnexion à distance.

**Décision : e-mail + second facteur** (application d'authentification ou clé d'accès). Google Workspace pourra s'ajouter plus tard si l'équipe en a besoin.

## 5. Configuration : « paramétrer la moindre chose »

### Principe

Tout ce qui est un **réglage** (et pas du design ni un secret) est un **paramètre** défini quelque part, avec : une clé, un type, une valeur par défaut, des bornes, une description, une catégorie. L'admin **génère ses formulaires à partir de ces définitions** : ajouter un paramètre = ajouter sa définition, l'écran apparaît tout seul. L'app et le site lisent la configuration publiée (mise en cache, valeurs par défaut embarquées pour le hors-ligne).

### Ce que gère chaque paramètre

- **Portée** : global, par ville, par plateforme (iOS/Android), par version d'app, par groupe de test ou pourcentage d'utilisateurs.
- **Versions** : chaque publication crée une version numérotée, attribuée, avec motif ; **retour en arrière** en un clic ; **date d'effet programmable**.
- **Validation** : bornes et cohérence vérifiées ; les paramètres sensibles demandent un second avis.
- **Aperçu d'impact** quand c'est possible (par exemple « ce quota concerne environ N membres actifs »).
- **Audit** : qui, quoi, quand, pourquoi.
- **Garde-fous non modifiables** : l'âge minimum de 18 ans, la suppression du selfie, les obligations de sécurité sont dans le code, jamais dans la configuration.

### Catalogue des catégories

| Catégorie | Exemples de paramètres |
|---|---|
| **Règles de l'app** | Likes par jour · taille du lot · photos min et max · longueur des prompts, commentaires, messages · distance maximale · tranche d'âge · délais d'OTP · essais avant blocage · durée du délai de grâce à la suppression |
| **Matching** | Poids de chaque critère · filtres éliminatoires · élargissement automatique · diversité · plafond d'exposition · version active et tests A/B |
| **Listes et référentiels** | Questions de prompts (avec traductions) · communes · religions · langues · études · enfants · intentions · motifs de signalement · motifs de refus · gestes du selfie |
| **Gabarits de messages** | Modèles de notifications, SMS et e-mails par langue. **Les textes de l'interface restent dans l'app** (pas de textes distants) ; une correction de traduction passe par une mise à jour de l'app, y compris à distance via EAS Update |
| **Fonctionnalités** | Drapeaux pour activer ou couper chaque fonction, par ville, plateforme, version ou pourcentage · interrupteurs d'urgence |
| **Business** | Offres, prix, devises, durées, essais, promotions · droits par offre (quotas, filtres avancés) · moyens de paiement actifs |
| **Notifications** | Modèles par événement et par langue · canaux (push, SMS, WhatsApp, e-mail) · heures calmes · fréquence maximale |
| **Modération** | Seuils de détection des photos · barème des sanctions (avertissement, durées de suspension, bannissement) · délais cibles de traitement · règles anti-arnaque (liens, numéros, mots) |
| **Vérification** | Fournisseur actif (manuel ou AWS) · durée de conservation du selfie dans la limite légale · seuils |
| **Villes et zones** | Villes ouvertes · communes · ouverture progressive par ville · liste d'attente par ville |
| **App et maintenance** | Version minimale (mise à jour forcée) · mode maintenance · liens des stores · versions des CGU et re-consentement · annonces dans l'app |
| **Intégrations** | Ordre de repli des fournisseurs d'OTP · fournisseurs actifs. **Les clés restent dans l'environnement** |
| **Site web** | Liens, textes d'accueil, état de la liste d'attente |

### Pour la technique

Un service de configuration dans le backend : définitions typées, versions, portées, lecture par l'app avec cache. L'admin est un client de ce service. C'est la fondation à poser avant les écrans de configuration.

## 6. Ce qui reste hors admin

Design (tokens), secrets, code des règles de sécurité, conformité minimale. Tout le reste est réglable.

## 7. Décisions prises (2026-11-10)

1. Rôles et matrice : **validés**.
2. Authentification : **e-mail + second facteur**, comptes nominatifs sur invitation.
3. Textes de l'interface modifiables à distance : **non** (trop lourd). Les textes restent dans l'app.

## 8. À décider

- Ordre de construction de l'admin : modération d'abord (indispensable au lancement), puis configuration, puis business. Proposé, à confirmer.
