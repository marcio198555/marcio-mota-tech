# Vidéo 50 — Batterie externe 10 000 mAh : combien de recharges ? (partie 2 de « 20 000 mAh ≠ 5 recharges »)
Format « chiffre de la boîte », 19.11.2026. Sources relues le 13.11.2026.
Samsung et Apple exclus (produits reçus, r_queue.json). Batterie : Anker ; téléphone : Google Pixel 9a (absents de r_queue.json).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Anker : tension des cellules | « The 10,000mAh rating refers to the total charge capacity of the power bank's internal battery cells », tension « around 3.7V » | https://service.anker.com/article-description/Why-Is-the-Rated-Capacity-Marked-on-a-Power-Bank-Lower-Than-Expected | vérifié, officiel Anker (support) |
| Anker : conversion | « 10Ah × 3.7V = 37Wh » ; « 37Wh / 5V = 7.4Ah = 7,400mAh » | idem | vérifié, officiel |
| Anker : pertes du circuit élévateur | « typically around 82% efficiency » | idem | vérifié, officiel |
| Anker : capacité nominale (rated capacity) | « Rated Capacity = 7,400mAh × 0.82 = 6,068mAh » ; « around 6,000mAh » | idem | vérifié, officiel |
| Anker blog (09.10.2021 (date relue au contrôle)) | « A portable charger with a 10,000mAh power bank will have an actual capacity of 6,000mAh to 6,500mAh » ; meilleurs convertisseurs « roughly 85% to 90% efficiency » ; exemple : téléphone de 5000 mAh, on espère 2 recharges, « The charger doesn't have enough juice to do a second cycle » ; FAQ : une 10 000 mAh remplit « just about any current smartphone from empty to full—at least once » | https://www.anker.com/blogs/power-banks/why-10000mah-power-bank-not-actually-10000mah | vérifié, officiel Anker |
| Google Pixel 9a, batterie | « Typical 5,100 mAh (Minimum 5,000 mAh) » | https://store.google.com/gb/product/pixel_9a_specs?hl=en-UK | vérifié, officiel Google Store |
| Tension / Wh de la batterie du Pixel 9a | non publiée (fiche Google Store et guide sécurité/réglementation lus : aucune valeur) | https://support.google.com/product-documentation/answer/15475035 | limite |
| Fairphone (Gen. 6) | « 4415mAh » ; pas de tension ni Wh sur la page | https://support.fairphone.com/hc/en-us/articles/38046290703122 | vérifié, non utilisé ; pages batterie Fairphone (fairphone.com/shop/…) bloquées : accès refusé |

## Calculs
- 10 000 mAh × 3,7 V = 37 000 mWh = 37 Wh.
- 37 Wh / 5 V = 7,4 Ah = 7 400 mAh à 5 V.
- 7 400 × 0,82 = 6 068 mAh à 5 V (capacité nominale, calcul d'Anker, refait : exact).
- 6 068 / 5 100 = 1,19 → « une recharge complète, et un petit bout ». Avec le minimum Google (5 000 mAh) : 6 068 / 5 000 = 1,21.
- Pour 3 recharges du Pixel 9a, il faudrait 3 × 5 100 = 15 300 mAh utiles (non dit dans le script).
- 6 000 et 6 500 (fourchette du blog Anker) / 5 100 = 1,18 et 1,27.

## Limites
- Le calcul compare des mAh à 5 V (sortie de la batterie externe) aux mAh de la batterie du téléphone, exprimés à la tension de sa cellule, que Google ne publie pas. C'est la même simplification qu'Anker dans son propre exemple (6 000 mAh contre un téléphone de 5 000 mAh). En Wh, avec une cellule de téléphone vers 3,8 V, la marge serait plus grande, mais la recharge du téléphone a aussi des pertes, non publiées. D'où les mots « environ » et « une, pas deux » repris d'Anker, sans chiffre de recharges au-delà.
- 82 % est un rendement « typique » donné par Anker ; son blog parle de 85 à 90 % pour les meilleurs convertisseurs. On garde 82 %, la valeur du calcul officiel.
- 3,7 V est la tension « around 3.7V » d'Anker ; certaines batteries utilisent 3,6 ou 3,85 V : non vérifié ici, donc non dit.
- Le Pixel 9a est un exemple ; un téléphone avec une plus petite batterie aurait plus de recharges.

## Script
s01 : Ta batterie de dix mille milliampères-heure, c'est trois recharges de téléphone ?
s02 : Non. Plutôt une seule, et un petit bout.
s03 : Dix mille, c'est dans les cellules, à trois virgule sept volts. Pas à la sortie, en cinq volts.
s04 : Ankeur fait le calcul : ça fait trente-sept wattheures.
s05 : À cinq volts : sept mille quatre cents milliampères-heure.
s06 : Puis la conversion en perd : rendement typique, quatre-vingt-deux pour cent.
s07 : Reste environ six mille milliampères-heure.
s08 : Un Pixel neuf A de Google : cinq mille cent milliampères-heure.
s09 : Verdict : une recharge complète, pas deux. Ankeur le dit lui-même.
s10 : Avant d'acheter, cherche la capacité nominale sur la fiche, pas le gros chiffre.
s11 : Bonus : selon Ankeur, une dix mille remplit presque tout téléphone actuel au moins une fois.
s12 : Combien de recharges tu obtiens vraiment ? Écris-le en commentaire.
s13 : Et abonne-toi : ce soir, un robot aspirateur qui tourne chaque jour, combien en francs ?

## Display
s01 : 10 000 mAh = | 3 recharges de téléphone ?
s02 : Non. | Plutôt 1, et un petit bout.
s03 : 10 000 mAh = dans les cellules, à 3,7 V. | Pas à la sortie, en 5 V.
s04 : Anker : | 10 000 mAh × 3,7 V = 37 Wh
s05 : 37 Wh ÷ 5 V = | 7 400 mAh
s06 : Pertes de conversion : | rendement typique 82 %
s07 : 7 400 × 0,82 = 6 068 | Reste environ 6 000 mAh.
s08 : Google Pixel 9a : | 5 100 mAh
s09 : Verdict : | 1 recharge complète, pas 2. | (Anker le dit aussi)
s10 : Avant d'acheter : | la capacité nominale, | pas le gros chiffre.
s11 : Bonus, selon Anker : | presque tout téléphone actuel, | au moins 1 fois.
s12 : Combien de recharges | tu obtiens vraiment ? | Écris-le en commentaire.
s13 : Abonne-toi : ce soir, | un robot aspirateur chaque jour, | combien en francs ?

## Légende TikTok
Ta batterie externe de 10 000 mAh ne fait pas 3 recharges.
Calcul d'Anker : 10 000 mAh × 3,7 V = 37 Wh, soit 7 400 mAh à 5 V, puis 82 % de rendement typique : environ 6 068 mAh. Un Pixel 9a a 5 100 mAh selon Google : une recharge complète, pas deux.
Ta batterie externe affiche quelle capacité nominale au dos ?
#batterieexterne #powerbank #mah #blackfriday
Voix de synthèse.

## Légende Reel Instagram
Batterie externe 10 000 mAh : une recharge complète de téléphone, pas trois

Calcul publié par Anker : 10 000 mAh × 3,7 V = 37 Wh. À 5 V, cela fait 7 400 mAh ; avec un rendement typique de 82 %, il reste environ 6 068 mAh.

Le Google Pixel 9a a une batterie de 5 100 mAh (typique) selon Google. Anker l'écrit lui-même : avec un téléphone de 5 000 mAh, pas assez pour une deuxième recharge.

Voix de synthèse.

Abonne-toi : chaque jour, un chiffre vérifié sur les objets de ta maison.

#batterieexterne #powerbank #blackfriday #suisseromande #jemesuretout
