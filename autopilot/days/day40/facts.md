# Vidéo 40 — Montre « étanche 50 m » : tu ne peux pas plonger à 50 m
Format « chiffre de la boîte », 18.11.2026. Sources relues le 13.11.2026.
Apple est exclu (produits Apple reçus, r_queue.json : MacBook « #complimentary @apple », bracelet Apple Watch Bandletic) ; Samsung aussi. Exemples retenus : Garmin, Casio, Xiaomi (absents de r_queue.json).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Garmin, définition de 5 ATM (manuel Approach S50) | Water rating « 5 ATM » ; note : « The device withstands pressure equivalent to a depth of 50 m. » | https://www8.garmin.com/manuals/webhelp/GUID-C3D54BBE-3966-4DA1-B60C-AD69DA5CC163/EN-US/GUID-81D0F73A-FAFD-4BB1-8E11-FD3EEDFE715F.html | vérifié, officiel Garmin |
| Même note dans un 2e manuel Garmin (D2 Air X15) | « The device withstands pressure equivalent to a depth of 50 m. » | https://www8.garmin.com/manuals/webhelp/GUID-49EC93CF-DA3F-4514-817F-4098FC4A71AE/EN-US/GUID-908C47B7-AB03-4C5B-A66F-188E053BE453.html | vérifié, officiel |
| Casio : normes | « The water resistance of CASIO watches is standard-compliant as per DIN 8310/ISO 22810. » | https://www.casio.com/europe/watches/technology/waterresist/ | vérifié, officiel Casio Europe |
| Casio : les mètres ne sont pas une profondeur | « Watches with metre indications for water resistance cannot be used immediately in this water depth » ; « water resistance metre indications are merely a pictorial representation of the test pressure » | idem | vérifié, officiel |
| Casio : pression statique / dynamique | « A wristwatch resists the influence of water at the static pressure indicated on the watch (e.g. 10BAR) » ; mouvement dans l'eau : « dynamic pressure that exceeds the specified static pressure many times over » | idem | vérifié, officiel |
| Casio : tableau « Water Resist 5 bar » | éclaboussures, pluie : oui ; bain, lavage, douche : oui ; natation, snorkeling : non ; apnée sans équipement : non. Natation dès 10 bar, apnée seulement à 20 bar | idem | vérifié, officiel |
| Casio : vieillissement | les joints s'usent avec le temps ; chaleur, froid, solvants, cosmétiques accélèrent l'usure | idem | vérifié, officiel |
| Xiaomi : 5ATM | « suitable for shallow water activities such as swimming in a pool or at the beach » ; « not suitable for high-humidity and high-temperature environments like saunas, hot springs, or showers » ; « not suitable for high-speed water activities such as diving, surfing, or deep-water activities » | https://www.mi.com/global/support/faq/details/KA-257490/ | vérifié, officiel Xiaomi (FAQ support global) |
| www.garmin.com/waterrating (tableau des activités Garmin) | | https://www.garmin.com/waterrating | NON LU : accès refusé (autorisation non accordée). Aucun chiffre ni activité Garmin n'est dit au-delà de la note « pressure equivalent to a depth of 50 m » |

## Calculs
Aucun calcul. Unités : 5 ATM (Garmin, Xiaomi) et 5 bar (Casio) sont presque identiques (1 atm = 1,013 bar) mais ce ne sont pas exactement les mêmes libellés : le script attribue chaque règle à sa marque et ne mélange pas.

## Limites
- s02 « Tu ne peux pas plonger à cinquante mètres avec » : confirmé par Casio (les mètres ne sont qu'une représentation de la pression de test, pas utilisables à cette profondeur ; apnée seulement à 20 bar) et Xiaomi (5ATM non adapté à la plongée ni aux activités en eau profonde). La page Garmin des activités n'a pas pu être lue : Garmin n'est cité que pour la définition « pression équivalente à 50 m ».
- Les marques ne disent pas toutes la même chose : Xiaomi autorise la natation en piscine à 5ATM mais pas la douche ; Casio interdit la natation à 5 bar mais autorise la douche. Le script le dit tel quel (« chaque marque a sa liste »).
- Pas de mention ISO 22810 côté Apple (marque exclue). La norme est citée seulement via Casio.

## Script
s01 : Ta montre est étanche à cinquante mètres ?
s02 : Non. Tu ne peux pas plonger à cinquante mètres avec.
s03 : Ces cinquante mètres, c'est une pression de test, pas une profondeur.
s04 : Garmine l'écrit : cinq ATM, c'est une pression équivalente à cinquante mètres.
s05 : Mais Casio précise : on ne peut pas l'utiliser à cette profondeur.
s06 : En mouvement, la pression peut dépasser plusieurs fois celle du test.
s07 : Chez Chaomi, cinq ATM : piscine ou plage, oui. Plongée, douche ou sauna, non.
s08 : Chez Casio, une montre à cinq bars, c'est douche oui, natation non.
s09 : Verdict : le chiffre de la boîte n'est pas une profondeur.
s10 : Avant d'acheter, lis la liste d'activités de la marque.
s11 : Bonus : selon Casio, les joints s'usent avec le temps.
s12 : Ta montre affiche combien ? Écris-le en commentaire.
s13 : Et abonne-toi : ce soir, Wi-Fi deux virgule quatre ou cinq gigahertz, lequel traverse les murs ?

## Display
s01 : Ta montre est étanche | à 50 mètres ?
s02 : Non. | Tu ne peux pas plonger | à 50 m avec.
s03 : 50 m = une pression de test, | pas une profondeur.
s04 : Garmin, 5 ATM : | pression équivalente | à 50 m de profondeur.
s05 : Casio : pas utilisable | à cette profondeur.
s06 : En mouvement, la pression | peut dépasser plusieurs fois | celle du test.
s07 : Xiaomi, 5 ATM : | piscine, plage : oui. | Plongée, douche, sauna : non.
s08 : Casio, 5 bar : | douche : oui. | Natation : non.
s09 : Verdict : | le chiffre de la boîte | n'est pas une profondeur.
s10 : Avant d'acheter : | la liste des activités | de la marque.
s11 : Bonus : les joints | s'usent avec le temps | (Casio).
s12 : Ta montre affiche combien ? | Écris-le en commentaire.
s13 : Abonne-toi : ce soir, | Wi-Fi 2,4 ou 5 GHz, | lequel traverse les murs ?

## Légende TikTok
Ta montre « étanche 50 m » ne descend pas à 50 m.
Garmin : 5 ATM = la montre résiste à une pression équivalente à 50 m. Casio : les mètres ne sont qu'une représentation de la pression de test ; à 5 bar, douche oui, natation non. Xiaomi : 5ATM = piscine ou plage, pas plongée, douche ni sauna.
Ta montre affiche quel chiffre au dos : 3, 5, 10 ou 20 bar ?
#montreconnectee #etancheite #5atm #blackfriday
Voix de synthèse.

## Légende Reel Instagram
Montre étanche à 50 m : tu ne peux pas plonger à 50 m avec

Garmin définit 5 ATM comme une pression équivalente à 50 m de profondeur. Casio (normes DIN 8310 / ISO 22810) précise que les mètres ne sont qu'une représentation de la pression de test, pas une profondeur utilisable.

Chaque marque a sa liste : Casio 5 bar, douche oui, natation non. Xiaomi 5ATM, piscine ou plage oui, plongée, douche et sauna non.

Voix de synthèse.

Envoie-la à ton ami qui veut aller en plongée avec sa montre de sport.

#montreconnectee #etancheite #montre #suisseromande #jemesuretout
