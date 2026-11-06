# Jour 62 — Douche ou bain : combien en francs ? (format A, jeudi 12.11, 10 h)
Point 2 bis du RUNBOOK. Baignoire fictive. Vérifié le 06.11.2026. Fait | valeur | source | statut

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Douche de 5 min, pommeau labellisé Energy | « une douche de 5 minutes consomme 60 litres, soit 1/4 de ce que demande un bain » (donc 12 l/min) | https://www.eau-de-fribourg.ch/eau-pour-demain/une-consommation-intelligente | vérifié (fournisseur d'eau) |
| Bain plein | « entre 200 et 250 litres d'eau suivant la taille de la baignoire » ; petit bain 125-150 l | https://www.energie-environnement.ch/air-eau-alimentation-sante/douche-et-bain | vérifié (services cantonaux de l'énergie et de l'environnement) |
| Pomme ordinaire | « 10 minutes de douche munie d'un pommeau ordinaire, la toilette peut consommer davantage d'eau qu'un bain » ; débit annoncé 20-30 l/min (page ancienne : le débit n'est pas dit à voix haute) | même page | vérifié |
| Mesure du débit | récipient gradué + secondes pour le remplir : litres ÷ secondes × 60 | même page | vérifié |
| Température | eau froide 12 °C, eau de la douche 37 °C (schéma SuisseEnergie) | https://pubdb.bfe.admin.ch/fr/publication/download/8753.pdf | vérifié (brochure SuisseEnergie) |
| Bain à 37 °C | même température que la douche | — | **hypothèse, marquée « exemple »** |
| Pomme économique | « entre 5 et 8 litres d'eau par minute », classes A et B | https://pubdb.bfe.admin.ch/fr/publication/download/8753.pdf | vérifié |
| Classe A | limite le débit à 4-6 l/min, à 3 bars | https://www.tcs.ch/fr/tests-conseils/tests/home/pommeaux-douche-economiques.php | vérifié (TCS ; la page OFEN ne donne pas les litres) |
| Tarif électricité 2026 | **médiane** 27,7 ct/kWh, ménage type H4 (4 500 kWh/an) : dire « médian », pas « moyen » | https://www.admin.ch/fr/newnsb/8nuE_fvwnfqCu8OHNOwKu | vérifié |
| Tarif électricité 2027 | médiane 26,5 ct/kWh, soit 1,2 ct de moins qu'en 2026 (confirme les 27,7) | https://www.admin.ch/fr/newnsb/1miE201yRzoA | vérifié (non utilisé dans le calcul) |
| Eau à Lausanne | taxe de consommation 1,68 HT, **1,72 fr./m³ TTC** (état au 27.01.2026) | https://www.lausanne.ch/vie-pratique/energies-et-eau/eau/proprietaires-et-professionnels/taxes-et-facturation.html (PDF « Taxes et redevances de l'eau dès le 1er janvier 2025 ») | vérifié |
| Épuration à Lausanne | traitement 1,60 HT, **1,73 fr./m³ TTC** | même page (PDF « Taxes d'évacuation et de traitement des eaux dès le 1er janvier 2025 ») | vérifié |
| Part variable retenue | 1,72 + 1,73 = **3,45 fr./m³** ; taxes fixes annuelles et contributions facultatives non comptées (un bain de plus ne les change pas) | calcul | exact |
| Mode de chauffage | environ la moitié de l'eau chaude en Suisse est chauffée au fossile, à peine 30 % à l'électricité (pompe à chaleur ou directe) : le coût dépend du mode de chauffage | https://www.save-water.ch/ | vérifié (pas dit à voix haute) |

## Calculs (exemple : chauffe-eau électrique supposé, 1 kWh d'électricité = 1 kWh de chaleur, sans pertes)
Énergie par litre : 1,16 Wh × (37 − 12) °C = **29 Wh**.

| | Volume | Énergie | Électricité (× 0,277 fr.) | Eau (× 3,45 fr./m³) | Par fois | × 365 |
|---|---|---|---|---|---|---|
| Douche 5 min, 12 l/min | 60 l | 1,74 kWh | 0,4820 fr. | 0,2070 fr. | **0,69 fr.** | 251,48 fr. → **≈ 250 fr.** |
| Bain plein (bas de la fourchette) | 200 l | 5,80 kWh | 1,6066 fr. | 0,6900 fr. | **2,30 fr.** | 838,26 fr. → **≈ 840 fr.** |
| Douche 5 min, 6 l/min | 30 l | 0,87 kWh | 0,2410 fr. | 0,1035 fr. | 0,34 fr. | 125,74 fr. |

- Écart : 838,26 − 251,48 = 586,78 fr. → « presque 600 fr. », à l'écran « ≈ 590 fr. ».
- Économie à 6 l/min : 251,48 − 125,74 = 125,74 fr. par an → « environ 125 fr. » (exemple, par rapport à 12 l/min).
- Rattrapage : 200 l ÷ 12 l/min = 16,67 min → « en moins de 17 minutes » (même température, donc même coût).
- Avec le tarif 2027 (26,5 ct) : ≈ 244 fr. contre ≈ 813 fr. ; ordre de grandeur inchangé.

## Relecture phrase par phrase
| Phrase | Base | Contrôle |
|---|---|---|
| s01-s02 | question, promesse | aucun fait |
| s03 | hypothèses ; tarif ElCom, Lausanne | dit « exemple » et « médian » |
| s04 | Eau de Fribourg | 5 × 12 = 60 l |
| s05 | services cantonaux | « au moins 200 » = bas de 200-250, attribué à voix haute |
| s06 | SuisseEnergie + 1,16 Wh | 29 Wh |
| s07-s09 | calculs | 0,69 ; 2,30 ; ≈ 250 ; ≈ 840 ; 586,78 = « presque six cents » |
| s10 | calcul | 16,67 < 17 |
| s11 | services cantonaux | « peuvent », « pomme ordinaire », attribué |
| s12 | services cantonaux | méthode de la source |
| s13 | TCS + calcul | « six litres maximum » = haut de 4-6 l/min à 3 bars ; 125,74 → « environ » |
| s14-s16 | question, retour, fin | aucun nouveau fait |

## Non retenu
| Élément | Raison |
|---|---|
| Consommation « SVGW 36 l/jour bains et douches » | vérifié (https://www.svgw.ch/fr/eau/outils-de-communication/distribution-deau/utilisation) mais inutile au duel |
| « Douche de 10 minutes = recharge du smartphone pendant 1 an » (SuisseEnergie) | vérifié, coupé pour la longueur |
| Pertes de maintien du boiler, tarif de nuit | pas de chiffre officiel trouvé : exclus du calcul et signalés à l'écran (les pertes augmenteraient le coût, un bas tarif le baisserait) |
