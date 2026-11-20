# Vidéo 92 — SSD « jusqu'à 7 000 Mo/s » : seulement au début
Format V « chiffre de la boîte », jeudi 26.11.2026 à 18 h. Sources lues le 20.11.2026 (pages officielles de fabricants uniquement).
Marques citées : Kingston, Sabrent, Sandisk (WD_BLACK), Kioxia, Crucial (Micron) — aucune dans r_queue.json (seule marque de stockage reçue : Samsung, exclue).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Kingston KC3000 : vitesses séquentielles par capacité | « Lecture/écriture séquentielle : 512 Go – 7 000/3 900 Mo/s ; 1 024 Go – 7 000/6 000 Mo/s ; 2 048 Go – 7 000/7 000 Mo/s ; 4 096 Go – 7 000/7 000 Mo/s » | https://www.kingston.com/fr/ssd/kc3000-nvme-m2-solid-state-drive | vérifié, officiel fabricant |
| Kingston KC3000 : accroche | « des vitesses […] pouvant atteindre 7 000 Mo/s en lecture et en écriture » ; NAND 3D TLC | idem | vérifié, officiel |
| Kingston : conditions de mesure | note 1 : « Based on "out-of-box performance" using a PCIe 4.0 motherboard. Speed may vary due to host hardware, software and usage. » | https://www.kingston.com/datasheets/KC3000_en.pdf | vérifié, officiel (fiche PDF) |
| Kingston : vitesse après le cache | **non donnée** sur la fiche ni la page produit | idem | vérifié (absence) |
| Crucial T500 : conditions de mesure | « Fresh out-of-box (FOB) state is assumed » ; mesuré « with default settings […] and write cache enabled » | https://assets.micron.com/adobe/assets/urn:aaid:aem:6b046d5a-4382-4018-b81e-28421f19b2cc/renditions/original/as/crucial-T500-b2c-product-flyer-en-combination.pdf | vérifié, officiel (confirmation, non cité à l'écran) |
| Sabrent : cache SLC = mémoire de base en mode 1 bit | « It's actually the base flash - whether 3-bit TLC or 4-bit QLC - switched to a single-bit mode. This single-bit mode, also known as pseudo-SLC, is faster » ; « if you're running 3-bit TLC cells in a single-bit pSLC mode, you only have 1/3rd the effective capacity » | https://sabrent.com/blogs/storage/slc-caching | vérifié, officiel fabricant (blog, 09.06.2022) |
| Sabrent : chiffres marketing | « reported speeds for SSDs are misleading as manufacturers will use SLC write performance instead of native when marketing their drives » | idem | vérifié, non dit (formulation trop générale pour la voix) |
| Sabrent : cache plein, puis retour | « your SSD uses a portion of its memory as a high-speed write cache. […] Once the cache fills during sustained writes of several gigabytes, the drive switches to its base write speed, which is slower. After the transfer finishes and the drive sits idle for a bit, the cache speed comes back. » ; « Every manufacturer's drive of this class works the same way. » | https://sabrent.com/blogs/troubleshooting/slow-transfer-speeds-explained | vérifié, officiel fabricant (09.06.2026) |
| Sandisk nCache 4.0 : partie dynamique du cache | « Hybrid SLC Cache: […] the dynamic component offers variable capacity that decreases as user data fills the drive » ; équipe WD_BLACK SN8100, SN850X, SN7100, WD Blue SN5100 | https://www.sandisk.com/tools/documentRequestHandler?docPath=%2Fcontent%2Fdam%2Fasset-library%2Fen_us%2Fassets%2Fpublic%2Fsandisk%2Fcollateral%2Fsolution-brief%2Fsolution-brief-ncache-4-bridging-speed-capacity-reliability.pdf | vérifié, officiel fabricant |
| Kioxia XG8 : mesure « cache activé » | lecture/écriture jusqu'à 7 000/5 800 Mo/s ; « Read and write speed, tested on the state of "SLC cache=ON" » | https://www.kioxia.com/content/dam/kioxia/shared/business/ssd/client-ssd/asset/productbrief/cSSD-XG8-product-brief.pdf | vérifié, officiel (retiré de la voix pour la longueur ; sert de preuve) |

## Calculs
- 7 000 / 3 900 = 1,79 → « presque deux fois plus vite » (écriture séquentielle annoncée, 2 To contre 512 Go, même modèle KC3000). Dit « sur la fiche ».

## Limites
- **Aucune vitesse après le cache publiée par un fabricant** pour ces modèles (Kingston, Sandisk, Kioxia, Crucial, Sabrent : rien trouvé). Les valeurs qui circulent (TechPowerUp, Tom's Hardware) sont des mesures de testeurs, pas des fiches officielles : non utilisées. La vidéo dit donc « vitesse de base, plus lente » (Sabrent) et « la fiche ne dit pas laquelle » (Kingston), sans chiffre.
- « 7 000 Mo/s » est avant tout la **lecture** ; l'écriture annoncée dépend de la capacité (KC3000). La voix dit « lecture » et « écriture » séparément.
- « Une partie de ce cache rétrécit » : c'est la description de Sandisk pour sa technologie nCache 4.0 (cache hybride : partie fixe + partie dynamique). Dit « selon Sandisk ».
- Sabrent décrit son propre comportement et dit que les disques de cette classe font de même : dit « selon Sabrent ».
- Le duel (toi 512 Go / collègue 2 To) est une mise en scène ; les chiffres viennent de la fiche Kingston.

## Script (15 segments, 166 mots comptés avec la ponctuation isolée, 154 mots réels)
s01 : Toi, ton SSD : jusqu'à sept mille mégaoctets par seconde.
s02 : Attends. Ton collègue, le même en deux téraoctets. Qui copie plus vite ?
s03 : À la fin : ce qui arrive quand sa zone rapide est pleine.
s04 : Fiche Kingston : en cinq cent douze gigaoctets, lecture sept mille.
s05 : Et ce n'est pas tout : écriture, trois mille neuf cents.
s06 : En deux téraoctets : écriture sept mille. Sur la fiche, presque deux fois plus vite.
s07 : Mesuré sur un disque neuf.
s08 : Le secret : le cache SLC.
s09 : Selon Sabrent, une partie de la mémoire passe en mode rapide.
s10 : Surprise : selon Sandisk, une partie de ce cache rétrécit quand le disque se remplit.
s11 : Avant d'acheter, compare l'écriture, pas seulement la lecture.
s12 : Ton SSD fait combien de gigaoctets ? Écris-le en commentaire.
s13 : Cache plein ? Selon Sabrent, il passe à sa vitesse de base, plus lente.
s14 : La fiche ne dit pas laquelle. Au repos, elle revient.
s15 : Et abonne-toi : demain, la lampe torche à dix mille lumens… mesurés comment ?
(Prononciation dans le job : « èsse-èsse-dé », « èsse-èl-cé », « Sébrennt », « Sanndisk ».)
