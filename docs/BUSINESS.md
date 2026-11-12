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

Les résultats de la recherche du 2026-11-10 sont dans le §9. Questions restantes **avant** de promettre un abonnement :

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
3. Paiement : **recherche faite (voir §9)**. Décision appuyée : achats intégrés des stores pour Joga+, mobile money comme second canal à étudier (pawaPay en premier candidat).
4. Devise et niveau de prix : à définir après la recherche.
5. Hypothèses financières : qui les fournit, ou on les construit à partir de la recherche ?

## 9. Résultats de la recherche (2026-11-10)

Rapport complet : `Paiements et marché Joga Kinshasa 2.md` (dans le repo `backend`, `docs/research/`). Beaucoup de sources sont secondaires (presse, blogs, pages de prestataires) : **tout chiffre ci-dessous est à revérifier avant décision définitive**.

### Décisions appuyées par les preuves

1. **Joga+ se vend d'abord par les achats intégrés d'Apple et de Google.** Apple impose son système pour les abonnements et interdit de promouvoir un autre moyen de paiement dans l'app hors des États-Unis. Google ne propose le paiement alternatif que dans une liste de pays qui n'inclut pas la RDC.
2. **Commissions** : Google 15 % sur les abonnements (barème en vigueur pour la RDC) ; Apple 15 à 30 % selon le Small Business Program (à confirmer).
3. **La v1 reste gratuite.**
4. **`PaymentProvider` et table des droits** : à construire dès maintenant. **pawaPay** est le premier candidat pour un second canal : il couvre Vodacom (M-Pesa), Airtel et Orange en dollars et en francs congolais, avec un bac à sable gratuit. Frais annoncés en RDC : 2,5 à 3,2 % (vendeur), contre 15 à 30 % pour les stores. Règlement local : 2 à 11 jours ouvrés.
5. **Pas de bouton « payer par mobile money » dans l'app** tant que la politique Google Play Payments n'est pas relue et que l'interprétation d'Apple n'est pas validée. Vendre hors de l'app, sans lien ni appel à l'action dans l'app, semble possible : à valider.
6. **Abonnement mensuel mobile money** : chaque paiement est approuvé sur le téléphone de la personne. Joga+ serait donc plutôt un pass mensuel renouvelé par rappel qu'un prélèvement automatique. **Déduction à confirmer auprès de pawaPay.**
7. **Codes de connexion (recommandation, à confirmer)** : WhatsApp en canal principal (environ 0,012 $ par inscription, prix d'une source tierce), SMS en repli (Twilio : 0,2994 $ par SMS, environ 0,39 $ par inscription avec renvois), plafonds anti-fraude.

### Chiffres de contexte (avec leur année)

- Kinshasa : 9,85 millions d'utilisateurs d'internet mobile (T2 2026, ARPTC via presse).
- Salaire minimum journalier : 21 500 CDF depuis janvier 2026, soit environ 7 à 9 $.
- Change 2026 : environ 2 150 à 2 330 CDF pour 1 $ (banque centrale, via presse) ; interdiction annoncée des transactions en espèces en devises étrangères le 9 avril 2027 (portée non vérifiée).
- Android : environ 85 à 87 % du trafic web (StatCounter, 2026) ; biais possible vers les plus aisés.
- Déséquilibre : les hommes représentent 67 % des identités sur les réseaux sociaux en RDC (2025), pour 50 % de la population.
- Repères de revenus : Hinge, 31,81 $ par payeur (Match Group, T3 2026) ; Badoo et autres, environ 11 $ par payeur (Bumble, T3 2026). À revérifier dans les dépôts de la SEC.
- Concurrents : aucune donnée de téléchargement pour la RDC. Tinder et Badoo ressortent sur le continent ; Badoo est fort en Afrique francophone (sondage 2024, sans séparer la RDC du Congo-Brazzaville). Aucune application locale trouvée. **L'absence de preuve n'est pas une preuve d'absence.**

### Cadre légal : ce qui touche le produit

- Texte de base : Code du numérique (ordonnance-loi 23/010 du 13 mars 2023), titre III sur les données personnelles.
- **Consentement préalable et explicite**, que le responsable doit pouvoir prouver.
- **La religion est en principe une donnée interdite**, avec des exceptions dont le consentement pour une finalité précise. Cela confirme notre choix : religion optionnelle, consentement explicite.
- **Transfert à l'étranger** (Railway, Google Cloud Storage) : protection équivalente exigée.
- L'autorité de protection des données prévue par le Code n'est probablement pas en place (sources contradictoires). Amendes administratives de 3 000 à 70 000 $, sans cas d'application connu.
- Paiements : la banque centrale régule ; un agrégateur agréé (Paymetrust, juillet 2025) existe. Utiliser un agrégateur agréé évite probablement d'avoir sa propre licence, **non confirmé**.
- TVA standard : 16 %. Le régime applicable aux services numériques de non-résidents est **contradictoire dans les sources**.
- **À faire valider par un juriste congolais** : lecture du Code du numérique, biométrie et rétention, TVA numérique, rapatriement des fonds, création de la société.

### Ce que les preuves ne permettent pas de décider

Le prix de Joga+, la devise, la taille du marché des 22 à 40 ans, la forme récurrente de l'abonnement mobile money, et le choix final de l'agrégateur.

### Vérifications à mener

1. Pages « supported locations » de Google Play et tableau des pays d'Apple pour la RDC (devise, moyens de paiement, cartes cadeaux).
2. Taux du Small Business Program d'Apple sur les abonnements en première année.
3. Texte de la politique Google Play Payments pour les pays hors programmes.
4. pawaPay : abonnements et récurrence, statut auprès de la banque centrale, exigences d'inscription de la société, devise de règlement.
5. Autres agrégateurs : CinetPay, DPO, Paystack, Cellulant (Flutterwave semble ne pas couvrir la RDC).
6. Règles de la banque centrale pour un commerçant étranger, rapatriement, TVA numérique.
7. Parts des opérateurs de mobile money à Kinshasa, taux d'échec des paiements.
8. Prix WhatsApp d'authentification pour la RDC (grille de Meta).
