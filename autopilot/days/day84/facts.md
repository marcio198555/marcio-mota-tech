# Vidéo 84 — Guirlande LED de Noël : combien en francs pour tout décembre ?
Format V « quotidien en francs », vendredi 20.11.2026 à 18 h (TikTok : carrousel `tools/carousel84.py` ; vidéo pour la Story et le Reel d'essai).
Sources lues le 20.11.2026. Aucune marque de r_queue.json (Philips exclu). Guirlande LED d'exemple : Konstsmide (absent de r_queue.json), citée à l'écran seulement.

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Guirlande LED de 100 diodes (Konstsmide 6304-100, « LED Minilichterkette, 100 warm weiße Dioden, 230V ») | Energieverbrauch 3 kW / 1000 h (soit 3 W) ; classe F ; 100 sources lumineuses | https://www.konstsmide.se/de/sortiment/innen/lichterketten/kleine-birnen/led-minilichterkette-100-warm-6304-100 | vérifié, officiel fabricant (page lue via l'extrait Parallel ; WebFetch direct non autorisé à temps) |
| Ancienne guirlande miniature à incandescence | « Miniature & Icicle Lights » : guirlande à incandescence 42 W (moyenne) ; « energy saver » 24 W ; LED 5,0 W (tableau 2-10) | https://www1.eere.energy.gov/buildings/publications/pdfs/ssl/nichefinalreport_october2008.pdf | vérifié, officiel US DOE (rapport d'octobre 2008, marché américain 120 V) |
| LED contre incandescence (confirmation) | une guirlande certifiée ENERGY STAR « uses approximately 70% less energy than an incandescent light string » | https://www.energystar.gov/products/holiday/light_strings | vérifié, officiel EPA (non utilisé à l'écran) |
| Minuterie | « Une minuterie permet de bien contrôler la plupart des dispositifs, réduisant les émissions lumineuses et la consommation d'énergie. » | https://www.suisseenergie.ch/stories/eclairage-exterieur | vérifié, officiel SuisseEnergie |
| Tribunal fédéral 2013 (illuminations jusqu'à 1 h, 1er dimanche de l'Avent → 6 janvier) | idem | idem | vérifié, non utilisé (segment retiré pour la longueur) |
| Tarif | 27,7 ct./kWh, médiane 2026, ménage H4, hors TVA (cf. days/day82/facts.md) | https://www.admin.ch/fr/newnsb/8nuE_fvwnfqCu8OHNOwKu | repris tel quel |

## Calculs
- Décembre : 31 jours × 24 h = 744 h (scénario « jour et nuit », pas une mesure).
- 42 W ÷ 3 W = 14 → « quatorze fois plus ».
- LED : 3 W × 744 h = 2,232 kWh ; × 0,277 = 0,618 CHF → « soixante-deux centimes ».
- Ancienne : 42 W × 744 h = 31,248 kWh ; × 0,277 = 8,656 CHF → « huit francs soixante-six ».
- Exemple minuterie (6 h par soir, valeur d'exemple) : 6 × 31 = 186 h = 744 ÷ 4 → facture ÷ 4.
  LED : 3 × 186 = 0,558 kWh × 0,277 = 0,155 CHF → « quinze centimes ». (Ancienne : 7,812 kWh → 2,16 CHF, carrousel seulement.)
- Tous les montants hors TVA.

## Limites
- 42 W est une moyenne américaine (2008, guirlandes 120 V), pas la fiche d'une guirlande précise vendue en Suisse ; le nombre d'ampoules n'est pas fixé (la voix ne dit pas « cent ampoules » pour l'ancienne).
- 3 W = consommation pondérée de l'étiquette énergie (kWh / 1000 h, arrondie) d'un modèle précis ; d'autres guirlandes LED consomment plus (DOE : 5 W en moyenne).
- « Jour et nuit » et « 6 h par soir » sont des scénarios ; 6 h porte « exemple » à l'écran et dans la voix.
- Le facteur 4 vient uniquement des heures (744 → 186), pas d'une source.

## Script (14 segments, 163 mots)
s01 : Toi, ta vieille guirlande à ampoules reste allumée tout décembre.
s02 : Ton collègue, sa guirlande èl-eu-dé, pareil. Qui paie combien ?
s03 : Attends : à la fin, le geste qui peut diviser la facture par quatre.
s04 : D'abord, les watts écrits sur la fiche.
s05 : Chez un fabricant, cent èl-eu-dé : trois watts.
s06 : Une ancienne guirlande miniature à incandescence : quarante-deux watts en moyenne, selon le département américain de l'énergie.
s07 : Quatorze fois plus. Et ce n'est pas tout.
s08 : Jour et nuit, décembre, c'est sept cent quarante-quatre heures.
s09 : Au tarif médian suisse, vingt-sept virgule sept centimes le kilowattheure hors taxe, la guirlande èl-eu-dé coûte soixante-deux centimes.
s10 : Surprise : l'ancienne coûte huit francs soixante-six pour le même mois.
s11 : Et SuisseEnergie conseille une minuterie.
s12 : Ta guirlande brille combien d'heures par soir ? Écris-le en commentaire.
s13 : Promis : exemple, six heures par soir avec minuterie. La guirlande èl-eu-dé coûte quinze centimes pour tout décembre.
s14 : Et abonne-toi : demain, ton purificateur « cinquante mètres carrés »… avec combien de renouvellements d'air ?
