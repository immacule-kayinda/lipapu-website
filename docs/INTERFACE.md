# Guideline — Site web (repo `lipapu-website`)

> Lire d'abord `GUIDELINES.md`. Ce document précise les règles propres au site vitrine.

## Mission

Le site **présente** l'app et **rassure**. Il ne reproduit aucune fonction de l'app : tout se passe dans l'app mobile. Il sert à : donner envie, renvoyer vers les stores, collecter une liste d'attente, et publier les pages légales exigées par les stores.

## Stack

- **Next.js** (App Router), **TypeScript strict**, rendu statique chaque fois que possible.
- i18n : **next-intl**, français livré, structure prête pour `ln` et `en`.
- Styles : variables CSS générées depuis `design/tokens.json` (clair et sombre).
- Hébergement : Vercel ou Railway (à décider), Cloudflare devant.

## Pages de la v1

| Page | Contenu |
|---|---|
| Accueil | Promesse, comment ça marche (3 étapes), sécurité, boutons stores, liste d'attente |
| Sécurité et confiance | Vérification des profils, modération, signalement, conseils anti-arnaque |
| Blog | Articles courts (conseils, conseils de sécurité, actualité) |
| À propos / contact | Équipe, contact, modération |
| CGU, confidentialité, cookies | Textes légaux (vouvoiement) |
| Suppression de compte et de données | Page exigée par les stores, avec la marche à suivre |
| 404 et erreurs | Ton de la charte |

## Règles de design

1. **Même identité que l'app** : noir et blanc, Instrument Serif + Inter, logo à deux anneaux. Les photos apportent la couleur.
2. **Sobre et éditorial** : beaucoup d'espace, titres en serif, peu de blocs, un seul appel à l'action par écran.
3. **Photos et visuels** reflétant les personnes réelles de Kinshasa. Pas de banque d'images occidentale. Consentement et droits d'image clairs.
4. **Mobile d'abord** : la plupart des visiteurs viendront d'un téléphone Android avec un réseau lent.
5. **Aucune valeur de design en dur** : tokens uniquement.
6. **Voix** : directe, chaleureuse, sans promesse excessive. Pas de « trouve l'amour en 5 minutes ». Rappeler le positionnement sérieux.

## Règles techniques

- **Performance** : Core Web Vitals au vert sur mobile 4G lent. Images en WebP/AVIF aux bonnes tailles, polices limitées à Instrument Serif (400, italique) et Inter (400, 500, 600), pas de scripts tiers superflus.
- **Accessibilité** : contrastes AA, navigation au clavier, balises sémantiques, alternatives textuelles, respect de « réduire les animations ».
- **SEO** : balises, données structurées, sitemap, pages rapides. Titres et descriptions en français.
- **Liste d'attente** : formulaire minimal (téléphone ou e-mail), consentement explicite, protection anti-spam, données envoyées à l'API du backend (jamais stockées dans le site).
- **Liens stores** : un seul composant qui choisit le bon store ; liens profonds vers l'app quand elle est installée.
- **Mesure** : outil respectueux de la vie privée, sans cookies tiers. Bandeau de consentement seulement si nécessaire.
- **Sécurité** : en-têtes HTTP stricts, pas de secrets côté client, formulaires validés côté serveur.

## À ne pas faire

- Ne pas ajouter de connexion, de profils ou de messagerie sur le site.
- Ne pas utiliser de couleur de marque : l'identité est noir et blanc.
- Ne pas écrire de texte légal sans validation d'un juriste.
- Ne pas publier de photos de personnes sans accord écrit.
