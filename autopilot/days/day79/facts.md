# Vidéo 79 — Chargeur sans fil « 15 W » : ton téléphone en prend peut-être moins
Format V, lundi 23.11.2026, 10 h. Pages lues le vendredi 20.11.2026. Téléphones d'exemple : Google Pixel (ni Apple ni Samsung).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Profils Qi | « Baseline Power Profile (≤ 5 W) and in the Extended Power Profile (up to 15 W) » | https://www.wirelesspowerconsortium.com/media/cd4ljryt/qi-v13-introduction.pdf | lu le 20.11.2026, officiel (Wireless Power Consortium, Qi Specification Introduction v1.3) |
| Négociation : c'est le téléphone qui demande | « The Power Receiver requests a certain amount of power appropriate for the device to be charged, and the Power Transmitter will deliver the requested amount. » | même PDF | lu le 20.11.2026 |
| Exemple 5 W sur 15 W | « if a 5 W Power Receiver is placed on a 15 W Power Transmitter, the Power Receiver will instruct the Power Transmitter to send no more than 5 W of power. » | même PDF | lu le 20.11.2026 |
| Google Pixel 9a | « Recharge sans fil (certifiée Qi) » ; note 9 : « Recharge sans fil jusqu'à 7,5 W avec les chargeurs EPP certifiés Qi (vendus séparément). » | https://store.google.com/ch/product/pixel_9a_specs?hl=fr | lu le 20.11.2026, officiel (Google Store Suisse) |
| Google Pixel 10a | note 9 : « Recharge sans fil jusqu'à 10 W avec les chargeurs EPP certifiés Qi (vendus séparément). Les temps réels de recharge peuvent être plus longs. » | https://store.google.com/ch/product/pixel_10a_specs?hl=fr | lu le 20.11.2026, officiel (Google Store Suisse) |
| Chargeur « 15 W » | valeur de la boîte prise comme cas d'école (= maximum du profil EPP) | — | exemple, aucune marque de chargeur citée |

## Calculs
| Calcul | Résultat |
|---|---|
| 7,5 / 15 | 0,5 → « la moitié des quinze watts » (Pixel 9a) |
| 10 / 15 | 0,67 → « toujours pas quinze » (Pixel 10a) |

## Limites
- On ne dit rien des pertes ni du rendement : aucune valeur officielle chiffrée trouvée (WPC et Google n'en donnent pas sur ces pages). Point « pertes » du plan abandonné, pas de chiffre inventé.
- « Jusqu'à » : ce sont des maximums selon Google ; la puissance réelle peut être plus faible (dit en s11).
- s13 « C'est son maximum sans fil » : traduction de « jusqu'à 7,5 W » de la fiche Google.
- Ne vaut pas pour les recharges filaires (non traitées).

## Script (voix, 15 segments, 158 mots)
s01 : Ton chargeur sans fil affiche quinze watts ? Ton téléphone n'en prend peut-être pas autant.
s02 : Non, le chiffre de la boîte n'est pas une promesse. À la fin, tu sauras quoi vérifier.
s03 : La norme Tchi l'explique.
s04 : C'est le téléphone qui demande la puissance. Le chargeur envoie ce qu'il demande.
s05 : Un téléphone de cinq watts sur un chargeur de quinze ? Cinq watts maximum.
s06 : Exemple : le Google Pixel neuf-A.
s07 : Selon Google, jusqu'à sept virgule cinq watts sans fil, avec un chargeur certifié.
s08 : La moitié des quinze watts de la boîte.
s09 : Deuxième surprise : le Pixel dix-A, plus récent, monte jusqu'à dix watts.
s10 : Toujours pas quinze.
s11 : Et Google précise : la recharge réelle peut être plus lente.
s12 : Conseil : avant d'acheter, lis la fiche de ton téléphone, ligne recharge sans fil.
s13 : Elle dit sept virgule cinq ? C'est son maximum sans fil.
s14 : Et ton téléphone, il accepte combien de watts sans fil ? Écris-le en commentaire.
s15 : Et abonne-toi : ce soir, la montre connectée « quatorze jours »… sans jé-pé-èss ?
