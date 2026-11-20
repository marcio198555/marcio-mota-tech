# Vidéo 81 — Clé « USB 3.2 » : peut-être 5 Gbit/s seulement
Format « chiffre de la boîte », mercredi 25.11.2026, 10 h. Sources relues le 20.11.2026.
Source norme : USB-IF (USB Implementers Forum). Clé d'exemple : Kingston DataTraveler Kyson (Kingston absent de r_queue.json).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| USB-IF : USB 3.2 = 3 débits | « USB 3.2 identifies three transfer rates – 20Gbps, 10Gbps, and 5Gbps » ; « The USB 3.2 specification absorbed all prior 3.x specifications » | https://www.usb.org/usb-32-0 | vérifié, officiel USB-IF |
| USB-IF : Gen 1 / Gen 2 / Gen 2x2 | USB 3.2 Gen 1 : « product signals at 5Gbps » ; Gen 2 : « product signals at 10Gbps » ; Gen 2x2 : « product signals at 20Gbps » ; « USB 3.2 only defines the transfer rate of a product » | https://www.usb.org/sites/default/files/usb_3_2_language_product_and_packaging_guidelines_final.pdf | vérifié, officiel USB-IF |
| USB-IF : rétrocompatibilité | « Backwards compatible with all existing USB products; will operate at lowest common speed capability » | https://www.usb.org/usb-32-0 | vérifié, officiel |
| USB-IF : noms actuels | noms recommandés : USB 80Gbps, USB 40Gbps, USB 20Gbps, USB 10Gbps, USB 5Gbps ; les termes « USB 3.2 », « SuperSpeed Plus »… « are not intended to be used in product names, messaging, packaging or any other consumer-facing content » | https://www.usb.org/sites/default/files/usb_data_performance_language_usage_guidelines_jan_2024.pdf | vérifié, officiel USB-IF (janv. 2024) |
| USB-IF : guide des noms (2023) | « USB-IF strongly discourages its members and the industry at-large from using specification names/terminology in consumer-facing branding, packaging, advertisements » | https://usb.org/sites/default/files/USB-IF%20Integrators%20List%20Marketing%20Name%20Guidance_January%202023.pdf | vérifié, officiel |
| Kingston DataTraveler Kyson | « USB 3.2 Gen 1 speeds » ; « 64GB: 200MB/s read » ; « 128GB-512GB: 200MB/s read, 60MB/s write » ; note : « Speed may vary due to host hardware, software and usage. » | https://www.kingston.com/datasheets/DTKN_us.pdf | vérifié, officiel Kingston (fiche technique) |

## Calculs
- 200 Mo/s × 8 = 1 600 Mbit/s = 1,6 Gbit/s (lecture annoncée, « jusqu'à » au sens de la fiche).
- 1,6 / 20 = 8 % de 20 Gbit/s ; 1,6 / 5 = 32 % du signal Gen 1 (non dits).
- 5 Gbit/s = 625 Mo/s de signal brut (débit de signalisation, avant codage : non dit pour éviter de le confondre avec un débit utile).
- Écriture : 60 Mo/s × 8 = 480 Mbit/s (non dit).

## Limites
- « 5 Gbit/s » est le débit de signal Gen 1 (« signals at »), pas un débit utile : le script dit « un signal à cinq gigabits, au maximum ».
- 200 et 60 Mo/s sont des valeurs « jusqu'à » du fabricant, variables selon l'ordinateur (note Kingston) ; pas de mesure de Marcio.
- Le 64 Go n'a pas de vitesse d'écriture publiée sur la fiche : d'où « dès cent vingt-huit gigas ».
- On ne dit pas que toutes les clés « USB 3.2 » sont en Gen 1 : « peut-être », « pas forcément ».

## Script (relu phrase par phrase contre ce tableau, 15 segments, 163 mots)
s01 : Ta clé u-èss-bé trois point deux va à vingt gigabits ?
s02 : Pas forcément. Peut-être cinq, au maximum.
s03 : À la fin, tu sauras quoi chercher sur la boîte.
s04 : Selon l'organisme de la norme, trois point deux, c'est trois vitesses.
s05 : Djène un : cinq gigabits. Djène deux : dix. Djène deux fois deux : vingt.
s06 : Et l'organisme écrit : ce nom n'est pas fait pour les boîtes ni la pub.
s07 : Exemple : la Kaïsonne de Kingston. Fiche : trois point deux, Djène un.
s08 : Donc un signal à cinq gigabits, au maximum.
s09 : En lecture, la fiche annonce jusqu'à deux cents mégaoctets par seconde.
s10 : Fois huit : un virgule six gigabit. Loin de vingt.
s11 : En écriture, dès cent vingt-huit gigas : soixante mégaoctets par seconde.
s12 : Deuxième piège : sur un port plus lent, elle suit le plus lent.
s13 : Avant d'acheter, cherche les mégaoctets par seconde, lecture et écriture.
s14 : Ta clé écrit à combien ? Écris-le en commentaire.
s15 : Et abonne-toi : ce soir, Suisse contre France, Spotify Premium.