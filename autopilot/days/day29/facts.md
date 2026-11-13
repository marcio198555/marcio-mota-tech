# Vidéo 29 — Wi-Fi 2,4 GHz ou 5 GHz : lequel traverse les murs ?
Format V, mercredi 18.11.2026 à 18 h. Relevés du 13.11.2026. Angle différent du jour 14 (« AX3000 » sur la boîte)
et du jour 56 (box allumée la nuit, en francs) : ici, le choix de la bande selon la pièce.
Marques évitées : FRITZ!/AVM et devolo (produits reçus par Marcio, r_queue.json), Apple, Samsung.

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| « 5GHz signal is less powerful than 2.4GHz to go through walls » ; repère « range of 2.4GHz is about 60 feet (20 meters) and 5GHz is within 45 feet (15 meters) » pour une bonne expérience ; la portée réelle dépend de l'environnement | citation TP-Link (FAQ 2291, mise à jour 24.09.2021) | https://www.tp-link.com/us/support/faq/2291/ | vérifié, fabricant |
| « Usually, it is very hard for a wireless router to transmit three thick concrete walls » ; « Metal can totally block the transmission » | citation TP-Link (FAQ 427) | https://www.tp-link.com/en/support/faq/427 | vérifié, fabricant |
| « Place the device in an elevated, central location » ; chaque mur ou plafond réduit le signal ; 5 GHz « faster speeds but shorter range » ; éloigner des micro-ondes | citation TP-Link (FAQ 468) | https://www.tp-link.com/us/support/faq/468/?app=deco | vérifié, fabricant |
| 2,4 GHz : « provides the most coverage but transmits data at slower speeds » ; 5 GHz : « less coverage but … faster speeds » ; « higher frequencies cannot penetrate solid objects, such as walls and floors » ; les micro-ondes utilisent la bande 2,4 GHz | citation Netgear (KB 29396) | https://kb.netgear.com/29396/What-is-the-difference-between-2-4-GHz-and-5-GHz-wireless-frequencies | vérifié, fabricant (la vidéo dit « moins bien », plus faible que « cannot ») |
| 5 GHz « bietet in der Regel schnellere Geschwindigkeiten » (canaux plus larges) ; « bei gleicher Leistung » portée effective plus courte qu'en 2,4 GHz ; micro-ondes (Mikrowellen), frigos, lampes fluorescentes peuvent causer des interférences en 2,4 GHz ; recommandation : 5 GHz près du routeur, 2,4 GHz dans une pièce éloignée | citation Asus (FAQ 1044838) | https://www.asus.com/de/support/FAQ/1044838/ | vérifié, fabricant |
| Suisse (OFCOM/BAKOM) : 2,4–2,4835 GHz, puissance rayonnée max. 100 mW ; 5,15–5,35 GHz intérieur seulement, 200 mW (100 mW sans TPC sur 5,25–5,35) ; 5,47–5,725 GHz, max. 1 W avec TPC (500 mW sans) | citation OFCOM | https://www.bakom.admin.ch/en/wlan-rlan-4 | vérifié, officiel |
| Netflix : HD (720p) 3 Mbit/s ou plus ; 4K UHD 15 Mbit/s ou plus | citation Netflix | https://help.netflix.com/fr/node/306 | vérifié (service) |
| **Calcul** | 1 W / 100 mW = 10 → « jusqu'à dix fois plus de puissance permise » (limite légale max., pas la puissance réelle d'un routeur ; seulement sur 5,47–5,725 GHz avec TPC) | | exact |
| Francs | aucun calcul en francs : rien de sourcé ne s'y prête (objet concret : pièces, mètres, débit d'une vidéo) | | choix |

Non utilisé : fréquence exacte des micro-ondes (2 450 MHz) — pages FDA et CCOHS non accessibles cette fois ; la vidéo dit
seulement « peut brouiller » (Asus, Netgear).

## Script (15 segments, ≈ 169 mots)
s01 : Toi, ouaï-faï cinq giga-hertz. Ton collègue, deux virgule quatre. Lequel passe le mieux les murs ?
s02 : Reste : tu sauras lequel choisir dans chaque pièce.
s03 : Réponse : le deux virgule quatre.
s04 : Plus la fréquence est haute, moins le signal passe les murs, écrivent les fabricants.  → Netgear, TP-Link, Asus
s05 : Un fabricant donne : environ vingt mètres en deux virgule quatre, quinze en cinq.  → TP-Link 2291 (« about », bonne expérience)
s06 : Mais le cinq est en général plus rapide.  → Asus « in der Regel », Netgear, TP-Link
s07 : Surprise : en Suisse, l'Ofcom permet jusqu'à un watt en cinq, contre cent milliwatts en deux virgule quatre.  → OFCOM (1 W : partie haute de la bande, avec TPC ; écrit à l'écran)
s08 : Dix fois plus de puissance permise, et il traverse quand même moins bien.  → calcul ; TP-Link 2291
s09 : Autre piège : ton micro-ondes peut brouiller le deux virgule quatre.  → Asus, Netgear
s10 : Pour la quatre-ka, Nètflix recommande au moins quinze mégabits par seconde.  → Netflix
s11 : Donc : près du routeur, le cinq ; au fond, le deux virgule quatre.  → Asus (recommandation)
s12 : Et pose ton routeur haut, au centre, loin du métal.  → TP-Link 468 et 427
s13 : Ta pièce la plus mal couverte ? Écris-la en commentaire.
s14 : Toi, la vitesse. Ton collègue, la portée. Un point chacun.  → Netgear (2,4 : plus de couverture ; 5 : plus rapide)
s15 : Abonne-toi : demain, ta batterie externe de dix mille milliampères-heure : combien de recharges, vraiment ?
