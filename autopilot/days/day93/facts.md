# Vidéo 93 — Console en mode repos : combien en francs par an ?
Format V « quotidien en francs », vendredi 27.11.2026 à 18 h. Sources lues le 20.11.2026 (pages officielles uniquement).
Sony/PlayStation n'est pas dans r_queue.json (vérifié le 20.11 : seule marque de jeu présente, GameSir, manette ; pas de Sony). Tarif : médiane ElCom 2026, 27,7 ct./kWh hors TVA (déjà sourcé, voir days/day82/facts.md).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| PS5 CFI-2016 : repos par défaut | « Repos* : 0,31 W » ; « *L'option « Faible consommation d'énergie » est le réglage par défaut du mode repos sur PS5 » ; date du test 26/01/2024 | https://www.playstation.com/fr-ch/legal/ecodesign/ | vérifié, officiel fabricant |
| PS5 CFI-2016 : repos avec options | USB : 3,6 W ; Internet : 1,2 W ; « Repos (tout) : 3,8 W » | idem | vérifié, officiel |
| PS5 CFI-2016 : jeu | « Active gaming (PS5 games: three game average): 216.8 W » (HD) | https://www.playstation.com/en-in/legal/ecodesign (même tableau que la page fr-ch) | vérifié, officiel |
| Autres modèles (non utilisés) | Pro CFI-7021 : 0,3 W / tout 3,6 W ; CFI-21 : 0,30 W / tout 4,71 W (page fr-ch ; la page en-lb donne 3,6 W pour CFI-21 numérique : désaccord, donc modèle non retenu) | https://www.playstation.com/fr-ch/legal/ecodesign/ | vérifié, non utilisé |
| Le piège des options | « Si vous activez l'une de ces fonctionnalités, votre console PS5 ne réduira pas automatiquement sa consommation électrique en-dessous de 0,5 W en mode repos. Plus vous activez de fonctionnalités, plus votre console PS5 consomme d'énergie en mode repos. » | https://www.playstation.com/fr-ch/support/hardware/power-saving/ | vérifié, officiel |
| Chemin du réglage | « Paramètres > Système > Gestion de l'alimentation » puis « Fonctionnalités disponibles en mode repos » (options « Fournir l'alimentation aux ports USB », « Rester connecté à Internet ») | idem | vérifié, officiel |
| Tarif | 27,7 ct./kWh, médiane 2026, ménage H4, hors TVA | https://www.admin.ch/fr/newnsb/8nuE_fvwnfqCu8OHNOwKu | repris tel quel (days/day82) |

## Calculs
- Rapport : 3,8 / 0,31 = 12,26 → « environ douze fois plus ».
- 216,8 W / 3,8 W = 57,05 → une heure de jeu PS5 (moyenne Sony de trois jeux) ≈ 57 heures de repos « tout activé ».
- **Exemple** (valeur d'exemple : 20 h de repos par jour, pas une mesure) :
  - tout activé : 3,8 W × 20 h × 365 = 27,74 kWh/an × 0,277 = **7,68 CHF/an** ;
  - par défaut : 0,31 W × 20 h × 365 = 2,263 kWh/an × 0,277 = **0,63 CHF/an** ;
  - écart : 7,06 CHF/an → « environ sept francs par an » (hors TVA).
  L'écran porte la puce « exemple » sur ces trois montants.

## Limites
- Valeurs de Sony pour le modèle CFI-2016 (PS5 « slim » 2023, testée le 26.01.2024) ; les autres modèles diffèrent un peu (0,3 à 0,38 W par défaut ; 3,2 à 4,71 W tout activé).
- 20 h de repos par jour est une valeur d'exemple ; montants hors TVA.
- Xbox : la page officielle d'aide (support.xbox.com) n'a pas donné de valeur en watts lisible aujourd'hui ; Nintendo Switch 2 (sleep 0,5 W ; avec LAN filaire 5 W, page nintendo.com) : non utilisée pour garder une seule console.

## Script (16 segments, 166 mots comptés avec la ponctuation isolée, 153 mots réels)
s01 : Toi, ta PlayStation 5 dort en mode repos, tout activé.
s02 : Ton collègue, réglage par défaut. Attends : combien il gagne par an ?
s03 : À la fin, l'écart en francs. Et un piège.
s04 : Sony publie ses mesures, modèle CFI deux mille seize.
s05 : Et ce n'est pas tout : par défaut, zéro virgule trente et un watt.
s06 : Tout activé : trois virgule huit watts.
s07 : Environ douze fois plus que ton collègue.
s08 : Le piège : une option activée, et elle ne descend plus sous zéro virgule cinq watt.
s09 : Surprise : une heure de jeu vaut environ cinquante-sept heures de repos tout activé.
s10 : Conseil : Paramètres, Système, Gestion de l'alimentation, Fonctionnalités disponibles en mode repos.
s11 : Désactive le superflu.
s12 : Ta console dort avec quelles options ? Écris-le en commentaire.
s13 : Exemple : vingt heures de repos par jour, vingt-sept virgule sept centimes le kilowattheure.
s14 : Tout activé : sept francs soixante-huit par an. Par défaut : soixante-trois centimes.
s15 : L'écart : environ sept francs par an.
s16 : Et abonne-toi : demain, un nouveau chiffre vérifié.
(Prononciation dans le job : « Plèïstéïcheune », « cé-èf-i ».)
