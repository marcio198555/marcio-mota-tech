# Vidéo 85 — Écran « 1 ms » : ce n'est pas le vrai temps de réponse
Format V « chiffre de la boîte », samedi 21.11.2026 à 18 h (TikTok : carrousel `tools/carousel85.py` ; vidéo pour la Story et le Reel d'essai).
Sources lues le 20.11.2026 (extraits Parallel des pages officielles). Écrans d'exemple : Dell (absent de r_queue.json ; Samsung, présent, exclu).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Dell G2724D (27 po, 165 Hz) : temps de réponse | « 4 ms gray to gray in Fast mode / 2 ms gray to gray in Super Fast mode / 1 ms gray to gray in Extreme mode* » | https://dl.dell.com/content/manual65349921-dell-g2724d-monitor-user-s-guide.pdf?language=en-us | vérifié, officiel Dell (guide utilisateur, rév. A00, 2023) |
| Dell G2724D : astérisque | « The 1 ms gray-to-gray mode is achievable in the Extreme mode to reduce visible motion blur … However this may introduce some slight and noticeable visual artifacts into the image. » | idem | vérifié, officiel |
| Dell G2724D : fiche boutique | « Response Time 1 ms (gray-to-gray extreme) » | https://www.dell.com/en-us/shop/dell-27-gaming-monitor-g2724d/apd/210-bhxc/monitors-monitor-access | vérifié, officiel Dell |
| Dell SE2426H : MPRT | « MPRT mode: 1 ms / Fast mode: 4 ms (gray to gray) / Normal mode: 8 ms (gray to gray) » ; « MPRT helps to reduce visible motion blur. Some users may notice slight brightness flicker. AMD FreeSync will not be supported. » ; « To turn on MPRT, source refresh rate needs to be 120 Hz or higher. » | https://dl.dell.com/content/manual85683692-dell-24-monitor-se2426h-user-s-guide.pdf | vérifié, officiel Dell (guide utilisateur, 2025) |
| Méthodes de mesure | « there are a number of response time metrics, such as gray-to-gray (GtG) and moving picture response time (MPRT); however, the results are all displayed in ms, and manufacturers each have their own method for testing. The advertised number should be a worst-case maximum, but this is more often a typical value at a particular test condition that is rarely cited » | https://vesa.org/wp-content/uploads/2024/05/ID-Mag_2024_May_ClearMR_Article_Reprint.pdf | vérifié, article (F. Seto, D. Stolitzka, Information Display mai-juin 2024) diffusé sur vesa.org |
| ClearMR | métrique CMR = rapport pixels nets / pixels flous ; « CMR replaces Motion Picture Response Time (MPRT) and other methods of blur characterization since these other metrics do not accurately reflect the true nature of blur » ; ClearMR 7000 = « 65-75 times (6500 to 7500 percent) more clear pixels than blurry pixels » ; paliers 3000 à 9000 (2022) | https://vesa.org/featured-articles/vesa-brings-clarity-to-motion-blur-in-digital-displays-with-new-compliance-test-specification-and-logo-program | vérifié, officiel VESA (22.08.2022) |
| ClearMR : paliers et 60 Hz | paliers 10000 à 13000 ajoutés en décembre 2022 ; « most 60 Hz office displays would not qualify » pour ClearMR 3000 ; MPRT : « testing only between 10% and 90% » | https://www.clearmr.org/faq | vérifié, officiel VESA |

## Calculs
- 1 ms contre 4 ms sur le même Dell G2724D : seul le réglage « Response Time » change (Extreme / Fast).
- ClearMR 7000 : 65 à 75 fois plus de pixels nets que de pixels flous (définition VESA, aucun calcul).

## Limites
- « Gris à gris » : le nom de la mesure (gray to gray) ; aucune définition chiffrée officielle lue (pas de seuils 10–90 % pour GtG sur une page officielle : la FAQ ClearMR les cite pour le MPRT). La voix dit seulement « un pixel qui change de gris ».
- On ne dit pas que le mode « Fast » est le réglage d'usine (non vérifié).
- « Chaque fabricant a sa propre méthode » : phrase d'un article de deux auteurs de ClearMR diffusé par VESA, pas une décision formelle de VESA.
- Aucun écran n'est testé ; aucune mesure indépendante d'un modèle précis n'est citée.

## Script (16 segments, 165 mots)
s01 : Toi, ton écran annonce une milliseconde.
s02 : Ton collègue, quatre millisecondes. Lequel est le plus rapide ?
s03 : Attends : à la fin, le logo qui mesure vraiment le flou.
s04 : Souvent, c'est du « gris à gris » : un pixel qui change de gris.
s05 : Et ce n'est pas tout : chez Dèl, un écran annonce une milliseconde… en mode Extrême.
s06 : En mode Fâste : quatre millisecondes.
s07 : Vous avez peut-être le même écran.
s08 : Dèl prévient : légers défauts visibles possibles.
s09 : Surprise : une autre fiche annonce une milliseconde èm-pé-èr-té.
s10 : Avec un léger scintillement possible, et sans Fri-Sinc.
s11 : Selon Vésa, chaque fabricant a sa propre méthode de test.
s12 : Avant d'acheter, regarde le mode de la milliseconde.
s13 : Ton écran est réglé sur quel mode ? Écris-le en commentaire.
s14 : Le logo promis : Vésa Clir-èm-èr, qui compte les pixels nets contre les flous.
s15 : Clir-èm-èr sept mille : soixante-cinq à soixante-quinze fois plus de pixels nets que flous.
s16 : Et abonne-toi : demain, tes Èr-Pods Pro trois… moins chers en France ?
