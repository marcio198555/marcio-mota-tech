# Vidéo 52 — Aspirateur sans fil « 60 min » : en mode éco seulement
Format « chiffre de la boîte », 17.11.2026. Sources relues le 13.11.2026.
Marques exclues (produits reçus, r_queue.json) : Dyson, Kärcher, iRobot, Dreame, Samsung, Apple, Philips… L'exemple est donc Bosch (absent de r_queue.json).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Produit | « Aspirateur rechargeable, Unlimited 10, Gris », réf. BSS1041GHF ; batterie Power For All 18 V, 4,0 Ah, 1 batterie incluse | https://media3.bsh-group.com/Documents/specsheet/fr-FR/BSS1041GHF.pdf | vérifié, fiche officielle Bosch (BSH) |
| Autonomie Eco, accessoire non électrique | « Jusqu'à 80 min. en mode Eco avec un accessoire non électrique » ; autonomie maximale 80 min, « Valable uniquement pour l'aspirateur rechargeable : sans accessoire électrique » | idem | vérifié, officiel |
| Autonomie Eco, brosse motorisée | « Jusqu'à 65 min. en mode Eco avec brosse motorisée » | idem | vérifié, officiel |
| Autonomie Auto, brosse motorisée | « Jusqu'à 25 min. en mode Auto avec brosse motorisée » | idem | vérifié, officiel |
| Autonomie Turbo, brosse motorisée | « Jusqu'à 11 min. en mode Turbo avec brosse motorisée » | idem | vérifié, officiel |
| Batterie interchangeable (système Power For All 18 V) | « Système Alliance Power For All 18 V » ; autre fiche Bosch : « batterie interchangeable 3Ah » (Unlimited 7, BBS711W) | https://media3.bosch-home.com/Documents/specsheet/fr-FR/BBS711W.pdf | vérifié, officiel |
| Contrôle (non utilisé dans le script) : Unlimited 7 BBS711W, 18 V 3 Ah : Eco sans brosse motorisée 40 min, Eco avec 30, Auto 15, Turbo 10 | | https://media3.bosch-home.com/Documents/specsheet/fr-FR/BBS711W.pdf | vérifié ; même schéma : le gros chiffre = éco sans brosse motorisée |

## Calculs
- 80 / 11 = 7,27 → « plus de sept fois moins » en turbo qu'en éco sans accessoire électrique.
- 11 / 80 = 13,75 % ; 25 / 80 = 31,25 %.
- Seul le mode Eco dépasse 60 min (80 et 65) ; Auto 25 et Turbo 11 en sont loin.

## Limites
- Toutes les valeurs sont « jusqu'à », mesurées par le fabricant ; batterie neuve. Le script garde « jusqu'à ».
- La fiche est la version fr-FR ; le site Bosch Suisse (bosch-home.com/ch/fr/shop/aspirateurs/unlimited-10) ne donne aucune autonomie en minutes, seulement « jusqu'à 220 m² » en mode Eco (note 9). Disponibilité et référence exacte en Suisse non vérifiées : on dit « Bosch Unlimited dix », pas le prix.
- L'angle « 60 min » est générique : aucun modèle relu n'affiche exactement 60 min. Le script dit donc « soixante minutes ? Seulement en mode éco » à partir de l'exemple à 80 min (seul le mode Eco dépasse 60).
- Le bonus (« avec une deuxième, tu continues sans attendre ») découle de « batterie interchangeable » ; la fiche ne chiffre pas une deuxième batterie.

## Script
s01 : Ton aspirateur sans fil tient soixante minutes ?
s02 : Non. Seulement en mode éco.
s03 : Le gros chiffre, c'est le réglage le plus faible, avec l'accessoire le plus simple.
s04 : Exemple : le Bosch Unlimited dix. Sa fiche annonce jusqu'à quatre-vingts minutes.
s05 : Mais en mode éco, avec un accessoire non électrique.
s06 : Avec la brosse motorisée, toujours en éco : jusqu'à soixante-cinq.
s07 : En mode auto : jusqu'à vingt-cinq minutes.
s08 : En turbo : jusqu'à onze. Plus de sept fois moins.
s09 : Verdict : soixante minutes, oui. Mais en éco seulement.
s10 : Avant d'acheter, cherche l'autonomie en mode turbo sur la fiche technique, pas sur la boîte.
s11 : Bonus : sa batterie est interchangeable. Avec une deuxième, tu continues sans attendre la charge.
s12 : Et toi, tu aspires en quel mode ? Écris-le en commentaire.
s13 : Et abonne-toi : ce soir, le couvercle sur la casserole, combien ça change ?

## Display
s01 : Ton aspirateur sans fil | tient 60 minutes ?
s02 : Non. | Seulement en mode éco.
s03 : Le gros chiffre = | le réglage le plus faible, | l'accessoire le plus simple.
s04 : Bosch Unlimited 10 : | jusqu'à 80 min | selon la fiche.
s05 : … en mode Eco, | avec un accessoire | non électrique.
s06 : Brosse motorisée, mode Eco : | jusqu'à 65 min.
s07 : Mode Auto : | jusqu'à 25 min.
s08 : Mode Turbo : jusqu'à 11 min. | Plus de 7 fois moins.
s09 : Verdict : 60 min, oui. | En éco seulement.
s10 : Avant d'acheter : | l'autonomie en mode Turbo, | sur la fiche technique.
s11 : Bonus : batterie interchangeable. | Une 2e = tu continues | sans attendre.
s12 : Tu aspires en quel mode ? | Écris-le en commentaire.
s13 : Abonne-toi : ce soir, | le couvercle sur la casserole, | combien ça change ?

## Légende TikTok
Ton aspirateur sans fil tient 60 minutes ? Seulement en mode éco.
Bosch Unlimited 10, fiche officielle : jusqu'à 80 min en mode Eco avec un accessoire non électrique, 65 min en Eco avec brosse motorisée, 25 min en Auto, 11 min en Turbo. Valeurs « jusqu'à » du fabricant.
Et toi, tu aspires en quel mode la plupart du temps ?
#aspirateursansfil #autonomie #blackfriday #fichetechnique
Voix de synthèse.

## Légende Reel Instagram
Aspirateur sans fil : les 80 min de la fiche, c'est en mode éco seulement

Fiche officielle Bosch Unlimited 10 (BSS1041GHF, batterie 18 V 4,0 Ah) : jusqu'à 80 min en mode Eco avec un accessoire non électrique, 65 min en Eco avec brosse motorisée, 25 min en Auto, 11 min en Turbo.

En turbo, c'est plus de 7 fois moins que le chiffre maximal. Toutes les valeurs sont des « jusqu'à » du fabricant.

Voix de synthèse.

Abonne-toi : chaque jour, un chiffre vérifié sur les objets de ta maison.

#aspirateursansfil #autonomie #blackfriday #suisseromande #jemesuretout
