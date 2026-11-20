# Vidéo 82 — Frigo « classe B » : la nouvelle étiquette énergie
Format V « chiffre de la boîte », jeudi 26.11.2026 à 10 h. Sources lues le 20.11.2026 (pages officielles uniquement).
Aucune marque citée (pas de marque de r_queue.json). Tarif : médiane ElCom 2026, 27,7 ct./kWh hors TVA (déjà utilisée, voir days/day7x).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Nouvelle étiquette des appareils frigorifiques | « entrée en vigueur le 1er mars 2021. Elle prévoit une échelle allant de A à G » | https://www.suisseenergie.ch/habiter/appareils-menagers/refrigerateurs-congelateurs/ | vérifié, officiel SuisseEnergie |
| C contre A | « Un appareil neuf de la classe C consomme jusqu'à 40 % d'électricité en plus qu'un appareil de la classe A. » | idem | vérifié, officiel |
| Ancienne échelle | classes A+, A++, A+++ ajoutées ; « retour à l'échelle initiale de A à G » ; règlement-cadre (UE) 2017/1369 | https://commission.europa.eu/news-and-media/news/focus-new-generation-eu-energy-labels-2020-08-13_fr | vérifié, officiel Commission européenne (13.08.2020) |
| A+++ → C | « un réfrigérateur muni actuellement de l'étiquette A+++ pourrait passer dans la classe C, même s'il est aussi efficace qu'auparavant » | idem | vérifié, officiel |
| Classe A vide au départ | « au départ, la classe A sera vide et très peu de produits se trouveront dans les classes B et C » | idem | vérifié, officiel (intention annoncée) |
| Date en magasin | réfrigérateurs : nouvelles étiquettes « à partir du 1er mars 2021 » | idem | vérifié, officiel |
| Ancienne échelle « de G à A+++ » ; A+++ « peut passer dans la classe C » | « Des classes supérieures avaient dû être ajoutées pour aboutir à une échelle allant de G à A+++ » | https://www.info.gouv.fr/actualite/une-nouvelle-etiquette-energie-pour-l-equipement-de-la-maison | vérifié, officiel gouvernement français (confirmation) |
| Règlements et Suisse | règlement délégué (UE) 2019/2016 du 11 mars 2019 (étiquetage) et (UE) 2019/2019 (écoconception), « repris par la Suisse dans l'ordonnance sur les exigences relatives à l'efficacité énergétique (OEEE, RS 730.02) » ; exigences « en Suisse, identiques à celles applicables dans l'UE » | https://pubdb.bfe.admin.ch/fr/publication/download/6303 | vérifié, officiel OFEN/SuisseEnergie, fiche 03.2026 |
| Seuils de l'indice (IEE) | A ≤ 41 ; B 41–51 ; C 51–64 ; D 64–80 ; E 80–100 ; F 100–125 ; G > 125 | idem | vérifié, officiel |
| Minimum depuis 2024 | « Depuis le 1er mars 2024, l'IEE des appareils de réfrigération et des congélateurs ne peut excéder la valeur de 100, ce qui correspond à la classe d'efficacité énergétique E. » Exceptions : stockage du vin et appareils à faible niveau de bruit (minibars) : toujours A à G | idem | vérifié, officiel |
| Parc suisse | environ 7 millions d'appareils, près de 1,8 milliard de kWh par an | idem | vérifié, non utilisé |
| Tarif | 27,7 ct./kWh, médiane 2026, ménage H4, hors TVA (déduit, cf. days/day7x/facts.md) | https://www.admin.ch/fr/newnsb/8nuE_fvwnfqCu8OHNOwKu | repris tel quel |

## Calculs
- Exemple (valeur d'exemple, pas une mesure) : 150 kWh/an × 0,277 CHF = 41,55 CHF/an → « environ 41 francs », hors TVA.
- Jusqu'à 40 % de plus (SuisseEnergie, C contre A) : 150 × 1,4 = 210 kWh/an ; 210 × 0,277 = 58,17 CHF → « 58 francs ». Écart 16,62 CHF/an. Les deux chiffres portent « exemple » à l'écran.
- Classe E = IEE ≤ 100 → depuis le 1.3.2024, F (100–125) et G (> 125) impossibles pour un frigo/congélateur neuf classique.

## Limites
- « La classe A devait rester vide » : c'est l'intention écrite par la Commission en 2020, pas un relevé du marché.
- « Un ancien A+++ pouvait passer en C » : exemple de la Commission (« pourrait »), pas une règle de conversion. Aucune table officielle ancienne → nouvelle classe trouvée sur les pages OFEN/SuisseEnergie : on n'en donne pas.
- F et G : exceptions (cave à vin, minibar silencieux) → le script dit « frigo neuf classique ».
- 150 kWh/an est une valeur d'exemple.

## Script (14 segments, 169 mots)
s01 : Ton frigo neuf est classé B. Tu trouves ça moyen ?
s02 : Non. Au départ, la classe A devait rester vide.
s03 : À la fin, tu sauras quelles lettres ont disparu des frigos neufs.
s04 : Avant deux mille vingt et un : de G à A triple plus.
s05 : Depuis mars deux mille vingt et un : retour de A à G.
s06 : Selon la Commission européenne, un ancien A triple plus pouvait passer en C.
s07 : En Suisse, l'ordonnance fédérale reprend ces règles.
s08 : Surprise : depuis mars deux mille vingt-quatre, un frigo neuf doit être au moins en E.
s09 : F et G restent dessinés, mais pas pour un frigo neuf classique.
s10 : Selon SuisseEnergie, un C consomme jusqu'à quarante pour cent de plus qu'un A.
s11 : Exemple : cent cinquante kilowattheures par an, environ quarante et un francs. Plus quarante pour cent : cinquante-huit.
s12 : Avant d'acheter, regarde les kilowattheures par an.
s13 : Ton frigo affiche quelle lettre ? Écris-la en commentaire.
s14 : Et abonne-toi : ce soir, le SSD à sept mille mégaoctets par seconde… seulement au début.
