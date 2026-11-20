# Vidéo 80 — Trottinette « 40 km d'autonomie » : dans les conditions du test
Format « chiffre de la boîte », mardi 24.11.2026, 10 h. Sources relues le 20.11.2026.
Marque : Segway-Ninebot (absente de r_queue.json ; aucune trottinette dans r_queue.json). Modèle : Ninebot F2 D, site suisse (ch-de.segway.com).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| F2 D : autonomie annoncée | « Maximum range up to 40 km » ; tableau : « Max. Reichweite : Ca. 40 km (25 Meilen) bei 15 km/h » ; « Theoretical Range : Up to 40 km » | https://ch-de.segway.com/ekickscooter/products/f2-d.html | vérifié, officiel Segway (site suisse) |
| F2 D : conditions du test | « [1] Theoretical Range: Tested while riding with a full battery, 75 kg load, 25°C (77°F), at the speed of 1 5km/h on average on pavement. » | idem | vérifié, officiel |
| F2 D : autre note de la même page | « Theoretical Range: Tested while riding with a full battery, 75 kg (165 lbs) load, 25°C (77°F), at the speed of 16 km/h (9.9 mph) on average on pavement. » | idem | vérifié ; contradiction 15 / 16 km/h sur la page (voir Limites) |
| F2 D : autonomie à vitesse max. | « Range at Max Speed : Up to 36 km (20 km/h) » ; « Ca. 36 km (22 Meilen) bei 20 km/h » ; note [2] : batterie pleine, 75 kg, 25 °C, « at the maximum speed on average on pavement » | idem | vérifié, officiel |
| F2 D : vitesse max. | « Up to 20 km/h » | idem | vérifié |
| F2 D : pente max. | « Max. Steigungswinkel (75 kg) : Ca. 18 % » ; « Up to 18% easy climbing » | idem | vérifié |
| F2 D : batterie | « 367 Wh (10200 mAh) / 36V » | idem | vérifié, non dit |
| F2 D : charge après le froid | « Wenn die Umgebungstemperatur für die Lagerung unter 0℃ (32℉) liegt, sollten Sie den eKickScooter zunächst in eine warme Umgebung (über 5℃ (41℉)) bringen, bevor Sie ihn aufladen. » | idem | vérifié, officiel |
| F2 D : charge utile max. | « Max. Nutzlast : 120 kg » | idem | vérifié, non dit |
| Segway, guide d'hiver | « Cold weather will affect the battery performance, which may lead to reduced mileage. This is a normal effect of low temperatures. » | https://service.segway.com/us-en/manual/questionDetail?problemId=1875117841531314177&problemName=Winter+Maintenance+Guide+for+Your+Scooters&problemCategoryName=Riding+Experience&problemCategoryId=9&subCategoryCode=H1&seriesName=Segway+ZT3+Series&seriesCode=K139&esId=z3buBU3D0zLf3s0IAWSnSxhn43JpSXDP&id=48091&knowledgeType=paper | vérifié, officiel Segway (support) |
| Segway, manuel KickScooter ES | « using it at temperatures below 32°F (0°C) can decrease range and performance. Typically, at -4°F (-20°C) range can be half that of the same battery at 70°F (22°C). Battery range will recover when temperature rises. » | https://store.segway.com/media/wysiwyg/warranty/kickscooter-es-user-manual.pdf | vérifié, officiel Segway (manuel de la série ES, pas du F2) |
| Segway, manuel ES : condition du test | « Typical Range: tested while riding under full power, 165 lbs (75 kg) load, 77°F (25°C), 60% of max. speed on average on pavement. » | idem | vérifié, non dit (montre que 75 kg / 25 °C est la règle chez Segway) |

## Calculs
- 36 / 40 = 0,90 : à vitesse max. (20 km/h), 10 % d'autonomie en moins sur la fiche, toujours à 25 °C et 75 kg (non dit en pourcentage).
- Moitié à −20 °C (manuel ES, appliqué à titre d'illustration au F2 D) : 40 / 2 = 20 km. **Non dit ni affiché comme valeur du F2 D** : le manuel ES ne parle pas du F2 D ; la scène montre seulement « jusqu'à ÷ 2 » avec la mention « manuel Segway (série ES) ».
- 367 Wh / 40 km = 9,2 Wh/km (non utilisé).

## Limites
- La page du F2 D se contredit : note [1] et tableau = 15 km/h, note en bas de page = 16 km/h. Le script dit « quinze kilomètres-heure » (tableau technique + note [1]) ; l'écran porte « 15 km/h » seulement.
- Aucune source Segway trouvée avec une phrase sur l'effet du poids ou des côtes sur l'autonomie : le script ne dit donc rien de cet effet ; il dit seulement que le test et la pente max. sont donnés pour 75 kg.
- Le « moins vingt degrés → moitié » vient du manuel de la série ES (« Typically… can be half »), pas du F2 D : dit « dans un manuel Segway » et « peut ».
- « Sur chaussée » = « on pavement » ; la page ne dit pas « plat ».
- Règles suisses (OFROU/TCS) : non utilisées (le F2 D suisse est déjà bridé à 20 km/h ; pas nécessaire au sujet).

## Script (relu phrase par phrase contre ce tableau, 15 segments, 163 mots)
s01 : Ta trottinette fait quarante kilomètres avec une charge ?
s02 : Oui. Mais dans les conditions du test.
s03 : À la fin, tu sauras lire la petite ligne sous ce chiffre.
s04 : Exemple : la Naïnbotte F deux D de Ségouè. Jusqu'à quarante kilomètres.
s05 : Note du fabricant : batterie pleine, soixante-quinze kilos.
s06 : Vingt-cinq degrés, quinze kilomètres-heure de moyenne, sur chaussée.
s07 : À fond, vingt kilomètres-heure : jusqu'à trente-six. Toujours à vingt-cinq degrés.
s08 : Toi, en novembre, tu roules à vingt-cinq degrés ?
s09 : Ségouè l'écrit : le froid peut réduire l'autonomie. C'est normal.
s10 : Dans un manuel Ségouè : à moins vingt degrés, l'autonomie peut tomber à moitié.
s11 : Et la pente maximale, dix-huit pour cent : avec soixante-quinze kilos.
s12 : Avant d'acheter, lis la note sous l'autonomie : poids, vitesse, température.
s13 : Bonus : stockée sous zéro ? Ségouè dit de la mettre au-dessus de cinq degrés avant de charger.
s14 : Ta trottinette fait combien de kilomètres en hiver ? Écris-le en commentaire.
s15 : Et abonne-toi : ce soir, faut-il vraiment préchauffer le four ?