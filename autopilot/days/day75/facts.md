# Vidéo 75 — Robot aspirateur : un passage par jour, combien en francs par an ?
Format A (objet qui parle), jeudi 19.11.2026 à 18 h. Relevés du 13.11.2026. Personnage : perso_robot (bibliothèque),
décor decor_salon. **Robot fictif** : chiffres pris sur des modèles réels de marques dont Marcio n'a rien reçu
(Xiaomi, Ecovacs ; vérifié dans r_queue.json : 0 mention). Jamais iRobot/Roomba, Dreame, Dyson.
Angle différent du jour 23 (« 25 000 Pa » sur la boîte) : ici, l'électricité en francs.

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Xiaomi Robot Vacuum S40 (modèle OV81) : tension nominale 14,4 V DC ; batterie 5 200 mAh (nominal) ; puissance nominale 70 W ; station OV81CDZ sortie 20 V 1,2 A | fiche Xiaomi | https://www.mi.com/za/product/xiaomi-robot-vacuum-s40/specs/ | vérifié, fabricant |
| Ecovacs DEEBOT OZMO T8 (DLX11-44), notice française : « mode arrêt » moins de 0,50 W ; « veille en réseau » moins de 2,00 W ; station CH1822 sortie 20 V 1 A | notice Ecovacs (site officiel) | https://site-static.ecovacs.com/upload/be/file/support/2023/02/15/190746_9915-DEEBOTOZMOT8-Français-French.pdf | vérifié, fabricant |
| Aspirateurs (UE, règlement 666/2013) : max. 900 W et 43 kWh/an dès 2017 ; consommation normalisée moyenne estimée à 35 kWh/an en 2020 (usage normalisé de 50 h/an ; estimation, rapport Ecodesign Impact Accounting 2024) ; robots et aspirateurs à batterie hors du champ | Commission européenne | https://energy-efficient-products.ec.europa.eu/product-list/vacuum-cleaners_en | vérifié, officiel |
| Tarif médian H4 2026 : 27,7 ct/kWh, hors TVA (déduit) | ElCom | https://www.admin.ch/fr/newnsb/8nuE_fvwnfqCu8OHNOwKu | vérifié (days/day58, day59) |
| **Calculs** | Batterie : 14,4 V × 5,2 Ah = 74,88 Wh (« environ 75 Wh »). Un passage qui vide la batterie : 0,07488 kWh × 27,7 ct = 2,074 ct (« au moins 2 centimes » : pertes de charge non comptées). 365 passages : 74,88 × 365 = 27 331 Wh = 27,33 kWh ; × 0,277 = 7,571 CHF (« au moins 7 fr. 50 »). Veille en réseau : < 2 W × 8 760 h = < 17,52 kWh ; × 0,277 = < 4,853 CHF (« jusqu'à 4 fr. 85 », majorant : les heures de charge sont comptées comme veille). Traîneau : 35 kWh × 0,277 = 9,695 CHF (« environ 9 fr. 70 »). Robot : de 7,57 à 12,42 CHF (7,571 + 4,853) hors pertes de charge → « en ordre de grandeur, une dizaine de francs par an chacun ». | | exacts ; hypothèse « une batterie pleine vidée par passage » marquée « schéma » |
| Limites | Pertes du chargeur inconnues (aucune fiche officielle) ; un passage ne vide pas toujours la batterie ; stations avec vidage automatique ou lavage (530 à 1 600 W sur la fiche du Xiaomi Robot Vacuum 5) non comptées : station de charge simple seulement | https://www.mi.com/za/product/xiaomi-robot-vacuum-5/specs/ | dit à l'écran (« station simple », « sans les pertes ») |

## Script (16 segments, ≈ 171 mots)
s01 : Toi, tu passes l'aspirateur à la main. Ton collègue me fait tourner chaque jour. Qui paie le plus d'électricité ?
s02 : Reste : tu vas connaître le prix d'un de mes passages.
s03 : Je suis un robot fictif, mais mes chiffres viennent de vrais modèles.
s04 : Ma batterie, comme sur un Chaomi S quarante : quatorze virgule quatre volts, cinq mille deux cents milliampères-heure.  → Xiaomi S40
s05 : Pleine, environ soixante-quinze wattheures.  → 74,88 Wh
s06 : Un passage qui la vide : au moins deux centimes.  → 2,07 ct, sans pertes
s07 : Chaque jour, toute l'année : au moins sept francs cinquante.  → 7,57 CHF
s08 : Surprise : sur ma station, je consomme même sans rien faire.  → notice Ecovacs (veille en réseau)
s09 : Une notice d'Écovacs annonce moins de deux watts en veille connectée.  → Ecovacs « moins de 2,00 W »
s10 : Sur un an : jusqu'à quatre francs quatre-vingt-cinq.  → < 4,85 CHF
s11 : Et ton aspirateur traîneau ? L'Union européenne estime sa moyenne à trente-cinq kilowattheures par an.  → CE (2020, usage normalisé)
s12 : Environ neuf francs soixante-dix.  → 9,70 CHF
s13 : Conseil : programme-moi les jours utiles, et éteins-moi pendant tes vacances.  → arrêt < 0,5 W (Ecovacs), à l'écran
s14 : Ton robot passe tous les jours ? Écris-le en commentaire.
s15 : Toi et ton collègue : en ordre de grandeur, une dizaine de francs par an chacun.  → 7,57–12,42 contre 9,70
s16 : Abonne-toi : d'autres objets vont tout balancer.
