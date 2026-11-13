# Vidéo 28 — Le couvercle sur la casserole : combien d'énergie en moins ?
Format A (la casserole parle, dessinée dans le moteur, décor `decor_cuisine`), mardi 17.11.2026 à 18 h. Relevés du 13.11.2026. Cadrage : énergie de la plaque et francs (pas un sujet « eau »).

## Faits

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| « Avec le couvercle sur la casserole, vous économiserez 30 % d'énergie. » | 30 % | Brochure SuisseEnergie / Office fédéral de l'énergie OFEN « Économiser l'énergie au quotidien », 06.2021, n° d'article 805.170.F : https://pubdb.bfe.admin.ch/fr/publication/download/7190 | vérifié, officiel (lu le 13.11.2026 avec Firecrawl et Parallel) |
| Même brochure : « Les bouilloires nécessitent 50 % d'électricité en moins, jusqu'à ce que l'eau soit en ébullition. » | 50 % | même PDF | vérifié (non utilisé : on reste sur le couvercle) |
| « Pour maintenir 1,5 litre d'eau en ébullition, la plaque tire ici 750 watts » (sans couvercle) | 750 W | Services cantonaux de l'énergie et de l'environnement, « Cuisson et casseroles » (mise à jour 13.05.2025) : https://www.energie-environnement.ch/maison/cuisine/cuisson-et-casseroles | vérifié, officiel (cantons) |
| « Une casserole munie d'un couvercle maintient 1,5 litre d'eau en ébullition avec moins de 200 watts – presque 4 fois moins que sans couvercle. » | < 200 W ; ≈ 4 × moins | même page | vérifié, officiel |
| « Sur une cuisinière électrique, on gagnera toujours à éteindre la plaque quelques minutes avant la fin du temps de cuisson : la plaque a assez de chaleur pour maintenir la cuisson sans consommer d'électricité. » | conseil | même page | vérifié |
| … « en éteignant les plaques et le four avant la fin de cuisson pour profiter de la chaleur résiduelle (sauf pour les cuisinières à induction) » | réserve induction | https://www.energie-environnement.ch/maison/armoire-a-menage/l-electricite-du-menage | vérifié → la voix dit « sur une plaque classique » |
| « Si le fond est bombé ou déformé, il n'entre pas en contact étroit avec la plaque de cuisson. Résultat : beaucoup de chaleur est gaspillée. » | conseil | page « Cuisson et casseroles » | vérifié |
| « Cuisiner avec un couvercle : une grande partie de l'énergie s'évapore pendant la cuisson. Pour limiter ce phénomène, placez toujours un couvercle sur la casserole. » | mécanisme | Dépliant « 5 recommandations pour économiser l'énergie dans le ménage » (campagne stop-gaspillage.ch), publié par la commune de Collombey-Muraz : https://www.collombey-muraz.ch/data/documents/Prospectus_A5_Menage_Web1.pdf | vérifié (extrait du moteur de recherche Parallel, PDF non ouvert en entier) |
| Tarif médian ElCom 2026, ménage H4, hors TVA (déduit) | 27,7 ct/kWh | https://www.admin.ch/fr/newnsb/8nuE_fvwnfqCu8OHNOwKu (voir days/day71/facts.md pour le « hors TVA ») | vérifié |
| Contexte (non dit) : consommation annuelle moyenne estimée des plaques de cuisson neuves | 302 kWh/an | Étude pour SuisseEnergie « Verkaufszahlenbasierte Energieeffizienzanalyse von Elektrogeräten 2024 », rapport du 14.11.2024 : https://pubdb.bfe.admin.ch/de/publication/download/11945 | vérifié (non utilisé dans la voix) |

## Calculs (valeurs d'exemple : 20 minutes d'ébullition, 1,5 l, une fois par jour)

| Calcul | Détail | Résultat | Dit / affiché |
|---|---|---|---|
| Sans couvercle, 20 min | 0,750 kW × 20/60 h = 0,25 kWh ; × 27,7 ct | 6,925 ct | « environ sept centimes », écran 6,9 ct |
| Avec couvercle, 20 min | < 0,200 kW × 1/3 h = < 0,0667 kWh ; × 27,7 ct | < 1,847 ct | « moins de deux », écran < 1,9 ct |
| Rapport | 750 / 200 | 3,75 | « presque quatre fois moins » (dit par la source) |
| Économie par cuisson | > 6,925 − 1,847 | > 5,08 ct | écran |
| Par an, une fois par jour | > 0,1833 kWh × 365 = > 66,9 kWh ; × 0,277 | > 18,53 CHF | « plus de dix-huit francs par an », hors TVA, marqué « exemple » |
| Avec TVA 8,1 % (non dit) | 18,53 × 1,081 | 20,03 CHF | non dit |

Les 30 % (SuisseEnergie, cuisson en général) et le « presque 4 fois moins » (cantons, maintien de l'ébullition) ne mesurent pas la même chose : la voix les présente comme deux chiffres distincts (« quand ça bout, l'écart grandit »).

## Prudence
- « Selon Suisse Énergie » : la brochure l'affirme sans détail de mesure ; on garde « trente pour cent d'énergie », sans « toujours ».
- Le calcul en francs est un **exemple** (durée, fréquence choisies) : chip « EXEMPLE » à l'écran, « exemple » dit.
- On ne parle pas d'eau du robinet, de douche ni de vaisselle.
- Personnage : casserole dessinée (formes simples + CHR.face), aucune marque.

## Script (texte dit ; 14 segments, 175 mots)
s01 : Toi, sans couvercle. Ton collègue, avec. Qui paie le moins de courant ?
s02 : Je suis ta casserole : à la fin, tu sauras combien ça vaut en francs.
s03 : Sans couvercle, une grande partie de l'énergie s'évapore avec ma vapeur.
s04 : Selon Suisse Énergie, le couvercle fait économiser trente pour cent d'énergie.
s05 : Réponse : ton collègue paie moins.
s06 : Quand ça bout, l'écart grandit : sans couvercle, la plaque tire sept cent cinquante watts pour garder un litre et demi en ébullition.
s07 : Avec : moins de deux cents. Presque quatre fois moins, selon les services cantonaux de l'énergie.
s08 : Exemple : vingt minutes d'ébullition. Environ sept centimes sans couvercle, moins de deux avec.
s09 : Tous les jours, ça fait plus de dix-huit francs par an.
s10 : Conseil : sur une plaque classique, coupe-la quelques minutes avant la fin.
s11 : Et mon fond doit être bien plat, sinon la chaleur se perd.
s12 : Et toi, couvercle ou pas ? Écris-le en commentaire.
s13 : Toi, ton énergie part en vapeur. Ton collègue, lui, économise trente pour cent.
s14 : Abonne-toi : demain, la montre « étanche cinquante mètres »… avec laquelle tu ne peux pas plonger à cinquante mètres.

## Relecture phrase par phrase
- s01 duel, question ouverte. OK.
- s03 « une grande partie de l'énergie s'évapore » = dépliant stop-gaspillage. OK.
- s04 30 % SuisseEnergie/OFEN, citation directe. OK.
- s05 conséquence directe de s04 (moins d'énergie = moins de courant sur une plaque électrique). OK.
- s06 750 W pour maintenir 1,5 l en ébullition sans couvercle (cantons). OK.
- s07 < 200 W, « presque 4 fois moins » (cantons). OK.
- s08 6,925 ct et < 1,85 ct, exemple de 20 min au tarif ElCom hors TVA. OK.
- s09 > 18,53 CHF, exemple quotidien. OK (« plus de »).
- s10 « sur une cuisinière électrique… quelques minutes avant la fin » ; « sauf induction » → « plaque classique ». OK.
- s11 fond bombé ou déformé → « beaucoup de chaleur est gaspillée ». OK.
- s13 reprend s03 et s04. OK.
- s14 annonce du 18.11 à 10 h (plan : « Montre étanche 50 m »). Pas de chiffre affirmé.
