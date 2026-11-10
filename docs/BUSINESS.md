# Joga — Business model (cadre de travail)

> Document de cadrage, pas une prévision. **Aucun chiffre de marché n'est inventé ici** : tout ce qui est marqué « à étudier » doit être mesuré ou recherché avant décision.
> Ce sujet conditionne le produit, l'architecture et l'admin. Il fait partie du périmètre et ne doit plus être traité comme un détail.

## 1. Principes

1. **La sécurité n'est jamais payante.** Vérification, signalement, blocage, suppression de compte : gratuits pour tout le monde, toujours.
2. **Les revenus suivent la réussite des membres**, pas leur frustration. Pas de mécanique qui profite de la pression ou de la solitude.
3. **Pas de publicité ciblée** : elle contredit le positionnement premium et la protection des données.
4. **D'abord la densité, ensuite l'argent.** Une app de rencontres sans membres ne vaut rien. La monétisation arrive quand il y a assez de monde à Kinshasa.
5. **Tout est paramétrable** : offres, prix, droits et quotas sont de la configuration, jamais du code.

## 2. Sources de revenus possibles

| Option | Principe | Pour | Contre | Avis |
|---|---|---|---|---|
| **Abonnement « Joga+ »** (freemium) | Gratuit avec quotas ; payant : plus de likes, voir qui t'a aimé, filtres avancés | Modèle éprouvé (Hinge) ; revenu récurrent | Conversion incertaine ici ; paiement à résoudre | **Piste principale à tester** |
| **Achats ponctuels** (boosts, super-likes) | Payer pour être plus visible | Simple | Pousse à la pression et à l'inégalité ; contraire à notre ton | À éviter |
| **Espace couple payant** | Le mode « Nous » (souvenirs, animal partagé) en abonnement | Valeur durable ; clientèle qui reste | Il faut d'abord des couples | **À étudier pour la phase 3** |
| **Partenariats locaux** | Restaurants, lieux, événements pour rendez-vous | Utile aux membres ; revenus indépendants des cartes | Nécessite une équipe commerciale | À étudier, plus tard |
| **Événements** | Soirées organisées par Joga | Image de marque, rencontres réelles | Logistique, sécurité | À étudier, plus tard |
| **Publicité** | Annonceurs | Rapide | Contredit les principes 2 et 3 | Écarté |

## 3. Le paiement : le vrai sujet à Kinshasa

Questions à résoudre **avant** de promettre un abonnement :

- **Les stores** (Apple App Store, Google Play) imposent en général leur système de paiement pour les abonnements numériques dans l'app, avec une commission (autour de 15 à 30 % selon les cas : à confirmer au moment du lancement). Les cartes bancaires sont peu répandues chez nous.
- **Le mobile money** (M-Pesa, Airtel Money, Orange Money) est le moyen réel de beaucoup d'utilisateurs. Comment l'intégrer, directement ou via un agrégateur, et ce que les règles des stores autorisent ou non : **à étudier avec précision** (ne pas supposer).
- **Devise** : dollars ou francs congolais, prix psychologiques, volatilité. À décider.
- **Fiscalité et cadre légal** de la vente numérique en RDC : à faire valider par un juriste local.
- **Alternatives de paiement** : codes prépayés vendus en point de vente, abonnement court (semaine), micro-paiements. À tester.

Conséquence technique : une abstraction `PaymentProvider` (comme `VerificationProvider`) pour brancher plusieurs moyens de paiement, et une table de **droits** (entitlements) indépendante du moyen de paiement.

## 4. Les coûts à modéliser

Postes de dépense identifiés (aucun montant inventé) :

- SMS ou WhatsApp pour les codes de connexion (par inscription et par tentative).
- Vérification de profil : temps humain, puis service payant (AWS à 0,015 $ la vérification en tarif public, à confirmer).
- Modération : temps humain, outils.
- Hébergement (Railway), base de données, stockage et diffusion des photos, sauvegardes.
- Notifications, e-mails.
- Commissions des stores et des moyens de paiement.
- Support, juridique, comptabilité.
- Acquisition : marketing, parrainage, événements.

À produire : un **modèle financier simple** (coût par membre actif, point d'équilibre, hypothèses de conversion). Il demande des hypothèses que tu dois fournir ou que nous devons rechercher.

## 5. Ce qui est mesuré (et ce qui compte vraiment)

- Activation : inscription terminée, profil validé.
- Rétention à 7 et 30 jours.
- Taux de match, de conversation, de rencontre.
- **Couples formés** : l'indicateur le plus important pour la mission.
- Conversion vers l'offre payante, revenu par membre, désabonnements.
- Coût d'acquisition et recommandation par les membres.

## 6. Phases

| Phase | Contenu | Monétisation |
|---|---|---|
| **0 · Bêta fermée** | Petit groupe à Kinshasa | Gratuit. On observe |
| **1 · Lancement** | Ouverture publique | Gratuit. Objectif : densité et confiance |
| **2 · Joga+** | Quotas, filtres avancés, « qui t'a aimé » | Test de prix et de moyens de paiement |
| **3 · Espace couple** | Mode « Nous » | Offre dédiée à tester |

## 7. Impact sur le produit et l'architecture

- **Droits** : table `entitlements` (qui a droit à quoi, jusqu'à quand), lue partout (quotas, filtres).
- **Offres et prix** : catalogue en configuration (admin), par devise et par ville.
- **Paiements** : `PaymentProvider` interchangeable ; journal des transactions ; remboursements.
- **Admin** : pages Offres et prix, Abonnements, Paiements, Remboursements, Revenus (rôle Finance).
- **App** : écran « Joga+ » et écran de paiement à concevoir ; aucun mur de paiement sur les fonctions de sécurité.
- **Site** : page tarifs au moment de la phase 2.
- **Données** : consentement de facturation, rétention comptable.

## 8. Décisions à prendre

1. Principe : abonnement freemium comme piste principale, espace couple comme piste secondaire ?
2. Calendrier : gratuit jusqu'à quel seuil de membres (ou de maturité) avant d'ouvrir l'offre payante ?
3. Paiement : quelle priorité entre les stores et le mobile money ? Veux-tu que je lance une **recherche approfondie** (règles des stores pour la RDC, agrégateurs de mobile money, concurrents présents à Kinshasa) avant de décider ?
4. Devise et niveau de prix : à définir après la recherche.
5. Hypothèses financières : qui les fournit, ou on les construit à partir de la recherche ?
