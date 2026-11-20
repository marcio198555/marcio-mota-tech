# Vidéo 77 — Purificateur « jusqu'à 50 m² » : avec combien de renouvellements d'air ?
Format V « chiffre de la boîte », samedi 21.11.2026, 10 h. Sources lues le 20.11.2026.
Marques exclues : Philips, Dyson, Samsung, Xiaomi (prononciation), toutes celles de r_queue.json. Marque utilisée : Levoit (absente de r_queue.json).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Levoit Core 300S, CADR | « CADR 240 m³/h » | https://m.media-amazon.com/images/I/C11rQB3BPVL.pdf (notice utilisateur Levoit Core 300S, anglais ; copie du PDF du fabricant hébergée par Amazon) | vérifié, notice officielle du fabricant |
| Levoit Core 300S, surface | « Ideal Room Size » : « 50 m² » ; « Effective for larger rooms, but purification will take longer » | idem | vérifié |
| Levoit, base de la surface | « Ideal Room Size is based on 2 air changes per hour (ACH) » | idem | vérifié |
| Levoit, hauteur de plafond | « Air changes per hour (ACH) are calculated on the recommended room size assuming 2.4 m / 8 ft ceilings » | idem | vérifié |
| AHAM (Association of Home Appliance Manufacturers, organisme de normes accrédité ANSI) : base de la « Suggested Room Size » | « An AHAM Verifide® air cleaner, when used in a room of its Suggested Room Size, will deliver 4.8 eACH » ; « AHAM rounds the 4.816 eACH down to 4.8 eACH » (80 % de réduction des polluants en continu) | https://ahamverifide.org/wp-content/uploads/2026/02/AHAM-White-Paper_Air-Cleaner-ACH_2025.pdf (« Consumer Room Air Cleaners and Equivalent Air Changes per Hour », version 2025, publiée 01.2026) | vérifié, organisme |
| AHAM : minimum | « AHAM does not recommend, based on Table 2, that the Suggested Room Size coverage be based on less than 2.2 eACH » | idem | vérifié |
| AHAM : formule | eACH = CADR × 60 / V (en cfm et ft³) ; surface = 60 × CADR / (eACH × 8 ft) ; Suggested Room Size [ft²] = 1,55 × smoke CADR | idem | vérifié ; en m³/h : renouvellements = CADR / (surface × hauteur) |
| Exemple Blueair Blue 3210 (non utilisé) | CADR fumée 210 m³/h ; « Recommended room size 41 m2 » ; « Air changes per hour (ACH) 2 » ; « about 4,8x an hour … in a 17 m² room » ; mais note « 5 Air Changes per Hour in a room with the recommended room size » contradictoire | https://www.blueair.com/gb/blue/blue-3210/8318.html | vérifié mais page incohérente → non utilisé |

## Calculs
- Surface = CADR / (hauteur × renouvellements).
- Levoit : 240 / (2,4 × 2) = 240 / 4,8 = 50 m² (retrouve le chiffre de la boîte : exact).
- À 4,8 renouvellements (base AHAM) : 240 / (2,4 × 4,8) = 240 / 11,52 = 20,8 m² → « environ vingt et un mètres carrés ».
- Au minimum AHAM de 2,2 : 240 / (2,4 × 2,2) = 45,5 m² (non dit). 2 < 2,2 → la surface de la boîte est calculée sous le minimum que l'AHAM recommande.
- Rapport : 50 / 20,8 = 2,4 fois plus grand (non dit).

## Limites
- Le Core 300S est un exemple ; d'autres fabricants utilisent d'autres bases (AHAM 4,8, parfois 5). Levoit précise que l'appareil marche dans une pièce plus grande, « mais plus lentement » : on ne dit pas qu'il est inutile.
- L'AHAM est un organisme américain ; sa recommandation n'est pas une loi suisse. Dit tel quel : « ne recommande pas de descendre sous 2,2 ».
- Le calcul AHAM part du CADR « fumée » en cfm ; la notice Levoit donne un seul CADR en m³/h : on applique la formule générale (renouvellements = débit / volume), avec la hauteur de 2,4 m de Levoit.

## Script (job tts/cb_jobs/day77.json, 14 segments, 164 mots)
s01 : Ton purificateur est fait pour cinquante mètres carrés ? Pour combien de renouvellements d'air ?
s02 : Non : cinquante, ce n'est pas fixe. À la fin, tu sauras calculer ta vraie surface.
s03 : Exemple : le Core trois cents S de Lé-voït annonce cinquante mètres carrés.
s04 : Son débit d'air propre, le cé-a-dé-èr : deux cent quarante mètres cubes par heure.
s05 : Petite ligne de la notice : calculé pour deux renouvellements par heure.
s06 : Avec un plafond de deux mètres quarante.
s07 : Deux cent quarante, divisé par deux virgule quatre, divisé par deux : cinquante.
s08 : Mais l'a-ache-a-èm, l'association américaine des fabricants d'électroménager, vise quatre virgule huit.
s09 : Même appareil, même calcul : environ vingt et un mètres carrés.
s10 : Deuxième surprise : l'a-ache-a-èm ne recommande pas de descendre sous deux virgule deux renouvellements.
s11 : Les cinquante mètres carrés sont donc calculés en dessous.
s12 : Avant d'acheter, cherche le cé-a-dé-èr en mètres cubes par heure, pas les mètres carrés.
s13 : Ta pièce fait combien de mètres carrés ? Écris-le en commentaire.
s14 : Et abonne-toi : ce soir, l'écran « une milliseconde » qui ne répond pas en une milliseconde.
