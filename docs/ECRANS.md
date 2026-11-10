# Joga — Inventaire des écrans et parcours (v1)

> Lire avec `GUIDELINES.md` et `INTERFACE.md`. Les identifiants (ONB-03, DEC-01…) sont utilisés dans les wireframes, les tickets et le code.
> Chaque écran traite ses états : **chargement, vide, erreur, hors-ligne**. Seuls les cas particuliers sont notés ci-dessous.
> Wireframes sur le canvas « Joga — directions visuelles » : feuilles F1 à F5.

## Parcours

1. **Onboarding** : ONB-01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13 → 14 → 15 → DEC-01
2. **Découverte** : DEC-01 → DEC-02 → DEC-03 → (si réciproque) MAT-01 ; DEC-01 → DEC-05 (filtres) ; fin du lot → DEC-04
3. **Likes reçus** : LIK-01 → LIK-02 → aimer en retour (→ MAT-01) ou passer
4. **Conversation** : MAT-01 → MSG-02 ; MSG-01 → MSG-02 → MSG-03 → SAF-01 ou SAF-02
5. **Profil et réglages** : PRO-01 → PRO-02, PRO-03, SET-01 → SET-02 à SET-06
6. **Sécurité et états** : SAF-01 à SAF-03 ; SYS-01 à SYS-04

## Onboarding

| ID | Écran | Contenu et règles | Wireframe |
|---|---|---|---|
| ONB-01 | Bienvenue | Créer un compte, se connecter, continuer avec Apple ou Google. Conditions et confidentialité | direction A+B |
| ONB-02 | Langue | Français, lingala, anglais. Modifiable ensuite dans les réglages | — |
| ONB-03 | Téléphone | Préfixe +243 par défaut. Erreurs : numéro invalide, trop de tentatives | F1 |
| ONB-04 | Code SMS | 6 chiffres, lecture automatique sur Android, renvoi après 45 s, 5 essais puis blocage 15 min, option WhatsApp | F1 |
| ONB-05 | Identité | Prénom, date de naissance. Refus si moins de 18 ans | — |
| ONB-06 | Genre | « Je suis » un homme ou une femme ; la recherche en découle (hétérosexuel v1) | — |
| ONB-07 | Photos | 3 à 6 photos, réorganiser, supprimer. Redimensionnement sur l'appareil, flou de chargement | F1 |
| ONB-08 | Prompts | 3 questions à choisir, réponse de 225 caractères maximum, compteur | F1 |
| ONB-09 | Infos de profil | Vitals, Virtues, Vices. Tout est facultatif et masquable. Religion avec consentement explicite | F2 |
| ONB-10 | Intention | Ce que je cherche, type de relation, enfants | — |
| ONB-11 | Commune | Commune de Kinshasa et distance maximale | — |
| ONB-12 | Permissions | Localisation et notifications, expliquées. Refus accepté | F2 |
| ONB-13 | Vérification, introduction | Pourquoi vérifier, ce qu'on conserve (rien après 7 jours), consentement | — |
| ONB-14 | Selfie | Défi aléatoire à montrer, cadre guidé, reprise possible | F2 |
| ONB-15 | En attente de validation | Photos et selfie en cours de contrôle. Découverte possible en attendant | F2 |

## Découverte

| ID | Écran | Contenu et règles | Wireframe |
|---|---|---|---|
| DEC-01 | Découvrir | Carte profil du lot du jour : photo, prénom, âge, commune, premier prompt. Aimer, passer | F3 |
| DEC-02 | Profil complet | Toutes les photos, prompts et infos. Chaque élément peut être aimé | F3 |
| DEC-03 | Like avec commentaire | Feuille : élément aimé, commentaire facultatif, likes restants (quota serveur) | F3 |
| DEC-04 | Fin du lot | État vide : « C'est tout pour aujourd'hui », modifier les filtres | — |
| DEC-05 | Filtres | Âge, distance ou commune, filtres avancés (drapeau de configuration) | F3 |
| DEC-06 | Pick du jour | Profil le plus compatible, quand la base d'utilisateurs le permet | — |

## Likes, matchs, messages

| ID | Écran | Contenu et règles | Wireframe |
|---|---|---|---|
| LIK-01 | Likes reçus | Liste des personnes qui t'ont aimé, avec l'élément et le commentaire | F4 |
| LIK-02 | Profil d'un like | Profil complet (comme DEC-02), aimer en retour ou passer | — |
| MAT-01 | Match | Deux photos, « C'est un match », écrire un message ou continuer | F4 |
| MSG-01 | Conversations | Nouveaux matchs, liste des conversations, non lus | F4 |
| MSG-02 | Chat | Messages, statuts (envoyé, distribué, lu), « en train d'écrire », envoi en file hors-ligne | F4 |
| MSG-03 | Menu du chat | Voir le profil, signaler, bloquer, supprimer le match | — |

## Profil et réglages

| ID | Écran | Contenu et règles | Wireframe |
|---|---|---|---|
| PRO-01 | Mon profil | Aperçu, complétude, statut de vérification, accès à l'édition | F5 |
| PRO-02 | Édition du profil | Photos, prompts, infos, ordre, visibilité | — |
| PRO-03 | Préférences | Âge, distance, commune | — |
| SET-01 | Réglages | Compte, notifications, langue, confidentialité, sécurité, aide, déconnexion, suppression | F5 |
| SET-02 | Notifications | Par catégorie : likes, matchs, messages, rappels | — |
| SET-03 | Confidentialité et données | Consentements, export des données | — |
| SET-04 | Langue | Français, lingala, anglais | — |
| SET-05 | Supprimer mon compte | Explication claire, confirmation, délai de grâce | — |
| SET-06 | Aide et contact | Questions fréquentes, contacter l'équipe | — |

## Sécurité et états système

| ID | Écran | Contenu et règles | Wireframe |
|---|---|---|---|
| SAF-01 | Signaler | Feuille avec motifs, option de bloquer en même temps, confidentialité rappelée | F5 |
| SAF-02 | Bloquer | Confirmation, effets expliqués | — |
| SAF-03 | Conseils de sécurité | Anti-arnaque, premiers rendez-vous, signaux d'alerte | — |
| SYS-01 | Photo refusée | Motif clair, remplacer la photo | F5 |
| SYS-02 | Compte suspendu | Motif, durée, faire appel | — |
| SYS-03 | Mise à jour requise | Lien vers le store | — |
| SYS-04 | Hors-ligne et erreur | Bandeau hors-ligne, erreur serveur, réessayer | — |

## Composition des feuilles de wireframes

- **F1** : ONB-03, ONB-04, ONB-07, ONB-08
- **F2** : ONB-09, ONB-12, ONB-14, ONB-15
- **F3** : DEC-01, DEC-02, DEC-03, DEC-05
- **F4** : LIK-01, MAT-01, MSG-01, MSG-02
- **F5** : PRO-01, SET-01, SAF-01, SYS-01

Les wireframes sont en basse fidélité : structure, hiérarchie et règles. Le style final suit la charte et sera appliqué à l'étape des maquettes.
