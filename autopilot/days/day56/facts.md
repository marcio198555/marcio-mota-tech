# Jour 56 — Faut-il éteindre sa box internet la nuit ?
Vidéo du mardi 10.11.2026 à 10 h, format V (point 2 bis du RUNBOOK). Sources relues le 06.11.2026.

## Faits utilisés dans le script
| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Internet-Box 5, « Stand-by » (appareils WLAN et Ethernet connectés, pas de transmission de données) | 11,9 W en fibre XGS-PON et en cuivre G.fast (11,6 W en fibre BX) ; service normal : 11,9 W en XGS-PON | https://www.swisscom.ch/fr/clients-prives/aide/applis-et-services/consommation-denergie.html | vérifié |
| Tarif 2026, ménage type H4 (4 500 kWh par an) | 27,7 ct/kWh, **valeur médiane** ElCom, « les prix varient parfois considérablement » selon le gestionnaire | https://www.admin.ch/fr/newnsb/8nuE_fvwnfqCu8OHNOwKu | vérifié (toujours en vigueur le 10.11.2026) |
| Téléphone fixe et autres services | « La téléphonie fixe, les systèmes d'alarme, les caméras de surveillance et d'autres services fonctionnent uniquement si le routeur est allumé. » | https://www.swisscom.ch/fr/clients-prives/aide/applis-et-services/conseils-economie-energie.html | vérifié |
| Multiprise | « Nous recommandons de ne pas brancher le routeur sur une multiprise. » | même page | vérifié |
| Pause du Wi-Fi | Dans My Swisscom, « vous décidez quand le WLAN de l'Internet-Box est coupé automatiquement, par exemple la nuit » | même page et https://www.swisscom.ch/fr/clients-prives/aide/internet/wlan-verwalten.html | vérifié ; gain en watts non chiffré par Swisscom, donc non annoncé |
| Mode d'économie d'énergie (uniquement Internet-Box 5 Pro) | 0,3 W ; heures définies dans My Swisscom ; « ni Internet ni les appels téléphoniques ne fonctionnent » ; retour en service en 2 min environ après appui sur une touche | page consommation et page conseils ci-dessus | vérifié |
| Café crème | 4,65 CHF en moyenne dans les établissements suisses en 2025, annonce de CafetierSuisse | https://www.20min.ch/fr/story/suisse-le-prix-du-cafe-n-en-finit-plus-de-grimper-103456833 | vérifié dans la presse (20 minutes et 24 heures) ; pas de page de l'association lue |

## Calculs (exacts, montrés à l'écran)
| Calcul | Détail | Résultat |
|---|---|---|
| Énergie évitée, box débranchée 8 h par nuit (hypothèse du script : 8 h, 0 W) | 11,9 W × 8 h × 365 = 34 748 Wh | 34,75 kWh par an (« presque trente-cinq ») |
| Gain annuel | 34,748 kWh × 0,277 CHF | 9,6252 → **9,63 CHF par an** |
| Gain par nuit | 0,0952 kWh × 27,7 ct | 2,64 ct → « moins de trois centimes » |
| Objet concret | 9,63 / 4,65 = 2,07 | « environ deux cafés crème » |

## Faits vérifiés, hors script (légendes ou contrôle)
| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Tarif médian 2027 | 26,5 ct/kWh dès le 1.1.2027 → 34,748 × 0,265 = 9,21 CHF par an | https://www.admin.ch/fr/newnsb/1miE201yRzoA | vérifié (extrait de recherche du communiqué) ; dans la légende Instagram seulement |
| Internet-Box 5 Pro, stand-by | 15,6 W → 15,6 × 8 × 365 = 45,55 kWh → 12,62 CHF par an | page consommation | vérifié, non utilisé |
| « Jusqu'à 98 % » d'électricité en moins (5 Pro) | Swisscom ; 0,3 / 15,6 = 1,9 %, cohérent | https://www.swisscom.ch/fr/clients-prives/abonnement-internet/internet-box-5-pro.html | vérifié, non utilisé |
| Salt Fiber Box | Minimum 7,99 W sans appareil connecté ; autre cas cité : 14,91 à 21 W | https://www.salt.ch/fr/help/home/internet | extrait partiel de la page, non utilisé |

## Abandonnés
| Fait | Raison |
|---|---|
| Consommation d'une box Sunrise | Aucune fiche officielle trouvée (seulement un blog de 2022) |
| Mises à jour perdues la nuit | Swisscom dit seulement que le micrologiciel se met à jour automatiquement ; rien sur la nuit |
| TV perdue en débranchant | Aucune phrase de l'opérateur sur la TV quand le routeur est coupé |
| Économies chiffrées de l'Arcep, EDF, Bouygues | Sources françaises, autres box et autres tarifs |
| Gain en watts de la pause Wi-Fi | Non publié pour ce cas (les 7,39 W de la fiche supposent aussi le DECT coupé) |

## À ne pas dire
« Tarif moyen » seul (l'ElCom publie une médiane) ; « le plus simple » ou tout classement ; « la pause Wi-Fi ne coupe pas le téléphone » (non écrit par Swisscom) ; « Swisscom déconseille de débrancher » (elle conseille de couper en cas d'absence longue ou sans besoin d'Internet).

## Point à surveiller
Un client écrit sur le forum Swisscom (mai 2026) que son mode d'économie ne coupe que le WLAN : https://community.swisscom.ch/fr/d/868104-stromsparmodus-internet-box-5-pro. Témoignage isolé, non officiel ; le script suit la page officielle.

## Relecture du script, phrase par phrase
| Phrase | Appui |
|---|---|
| s01–s04 | Duel, question et promesse : aucun chiffre |
| s05 | 11,9 W, appareils connectés, sans transfert |
| s06 | Calcul 34,75 kWh (« presque trente-cinq ») |
| s07 | Médiane ElCom 27,7 ct ; calcul 9,63 CHF |
| s08 | 2,64 ct par nuit ; 9,63 / 4,65 = 2,07 cafés |
| s09 | Citation Swisscom (téléphonie fixe, alarmes, caméras) |
| s10 | Citation Swisscom (multiprise) |
| s11 | Horaires de pause du WLAN dans My Swisscom |
| s12–s13 | 0,3 W, heures choisies, uniquement 5 Pro ; ni Internet ni appels |
| s14 | Question en commentaire : aucun fait |
| s15 | Reprend 9,63 CHF et la citation sur la téléphonie fixe |
| s16 | Phrase de fin imposée |
