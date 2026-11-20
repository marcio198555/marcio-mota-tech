# Vidéo 83 — Lampe torche « 10 000 lumens » : mesurés comment ?
Format V « chiffre de la boîte », vendredi 27.11.2026 (Black Friday) à 10 h. Sources lues le 20.11.2026.
Lampe d'exemple : Fenix LR35R (Fenix absent de r_queue.json ; Klarus, présent dans r_queue.json, exclu).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| ANSI/PLATO FL 1 : mesure de la lumière | « Measurements for Peak Beam Intensity, Beam Distance and Light Output continue to be taken between 30 seconds and two minutes after the light is activated » (modes qui ne sont pas des SDEB) | https://plato-usa.org/ansi-plato-fl-1-2025-getting-the-testing-right/ | vérifié, officiel PLATO (organisme de la norme), article du 04.10.2026 |
| FL 1 : autonomie | « Runtime begins with the output measured at 30 seconds and continues until the light reaches 10 percent of that initial value. » | idem | vérifié, officiel |
| FL 1-2025 : modes boost courts (SDEB) | mesures « taken between one and 10 seconds after activation » ; autonomie jusqu'à 90 % du maximum mesuré | idem | vérifié, officiel |
| Fenix LR35R : turbo | ANSI/PLATO FL1 : Turbo 10 000 lumens, autonomie « 1 hour 25 minutes* » | https://www.fenixlight.com/wp-content/uploads/2025/05/Fenix_LR35R_Multilingual_User_Manual.pdf | vérifié, officiel Fenix (manuel, lu via extraction Parallel ; WebFetch direct refusé) |
| Fenix LR35R : astérisque | « *The Turbo output is measured in total of runtime including output at reduced levels due to temperature or protection mechanism in the design » (FR : « L'autonomie en mode Turbo incorpore les durées à puissance réduite dues à la température et au système de protection ») | idem | vérifié, officiel |
| Fenix LR35R : mode fort (High) | 3 000 lumens, « 1 hour 35 minutes » ; Med 1 200 lm 3 h 15 ; Low 450 lm 8 h 20 ; Eco 50 lm 80 h | idem | vérifié, officiel |
| Fenix LR35R : chaleur | « When the light reaches a temperature of 65°C or above, the light will automatically step down a few lumens to reduce the temperature. » | https://www.fenixlight.com/product/lr35r/ | vérifié, officiel Fenix |
| Fenix LR35R : batteries | essais avec les batteries fournies ARB-L21-4000P ; « around 8800 - 9000 lumens » avec deux ARB-L21-5000 | idem + manuel | vérifié, non dit (à l'écran en petit : non) |

## Calculs
- Seuil de fin d'autonomie FL 1 : 10 % × 10 000 lm = 1 000 lm.
- Turbo 1 h 25 = 85 min < High 1 h 35 = 95 min, alors que le turbo démarre à 10 000 lm contre 3 000 : avec l'astérisque, l'heure vingt-cinq n'est pas passée à 10 000 lm.

## Limites
- Fenix ne publie pas au bout de combien de minutes le turbo baisse, ni à quel niveau : on ne le dit pas (pas de courbe chiffrée à l'écran ; la courbe dessinée est marquée « schéma »).
- On ne dit pas que la LR35R est certifiée par un tiers : son tableau est titré « ANSI/PLATO FL1 », d'après les essais du laboratoire de Fenix.
- « Pas une heure vingt-cinq à dix mille » se déduit de l'astérisque ; pas de durée inventée.

## Script (15 segments, 169 mots)
s01 : Ta lampe torche fait dix mille lumens ? Pendant combien de temps ?
s02 : Non. Pas toute l'autonomie de la fiche.
s03 : À la fin, tu sauras lire l'astérisque du mode turbo.
s04 : La norme èf-èl un mesure les lumens entre trente secondes et deux minutes.
s05 : L'autonomie s'arrête quand il ne reste que dix pour cent.
s06 : Dix pour cent de dix mille : mille lumens.
s07 : Exemple : la Fénix L R trente-cinq R. Dix mille lumens, une heure vingt-cinq en turbo.
s08 : L'astérisque : ce temps inclut les niveaux réduits par la chaleur.
s09 : À soixante-cinq degrés, elle baisse sa puissance, dit Fénix.
s10 : Surprise : en fort, trois mille lumens, une heure trente-cinq. Plus que le turbo.
s11 : Donc pas une heure vingt-cinq à dix mille.
s12 : Version deux mille vingt-cinq : un boost très court se mesure entre une et dix secondes.
s13 : Avant d'acheter, cherche èf-èl un et lis l'astérisque.
s14 : Ta lampe affiche combien de lumens ? Écris-le en commentaire.
s15 : Et abonne-toi : ce soir, ta console en repos, combien de francs par an ?
