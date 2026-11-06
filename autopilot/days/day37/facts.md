# Jour 37 — Linge au salon ou sèche-linge : qui paie vraiment ?
Dimanche 8.11, 10 h, format V. Recette du point 2 bis (RUNBOOK). Faits vérifiés le 06.11.2026. Fait | valeur | source | statut

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| Tarif ménage 2026 (ElCom) | « Un ménage type paiera l'année prochaine 27,7 centimes par kilowattheure » (valeur médiane, H4, 4 500 kWh/an), newsletter du 25.09.2025 | https://www.elcom.admin.ch/dam/fr/sd-web/znXqHISH0pFP/Newsletter_09-2025_FR.pdf | vérifié |
| Recoupement 2026 | Communiqué du 08.09.2026 : 26,5 ct en 2027, « baisse de 1,2 ct./kWh » : 26,5 + 1,2 = 27,7 ct en 2026 | https://www.admin.ch/fr/newnsb/1miE201yRzoA | vérifié |
| Sèche-linge à pompe à chaleur (Suisse) | Bosch WTW87680CH, 8 kg, classe C, IEE 58 : 0,99 kWh par cycle (consommation pondérée, programme eco, pleine et demi-charge), gaz R290, condensation 88 %, 2 h 28 pleine charge ; fiche it-CH du 29.11.2025 ; « la consommation effective dépend de l'usage » (traduit de l'italien) | https://media3.bsh-group.com/Documents/eudatasheet/it-CH/WTW87680CH.pdf | vérifié |
| Sèche-linge à condensation (Belgique) | Bosch WTN83203FG, 8 kg, classe G, IEE 181 : 3,08 kWh par cycle (même mesure), 2 h 30 ; fiche fr-BE du 01.01.2026. La fiche ne dit pas « sans pompe à chaleur » : on dit seulement « à condensation classé G » | https://media3.bsh-group.com/Documents/eudatasheet/fr-BE/WTN83203FG.pdf | vérifié |
| Minimum légal en Suisse | Depuis le 1.7.2025 : sèche-linge domestiques ≤ 4 kg/h au moins classe C (IEE ≤ 60) ; pour immeubles collectifs > 4 kg/h, classe E. Transition de fourniture finie le 30.6.2026 (OFEN, fiche 07.2026) | https://pubdb.bfe.admin.ch/fr/publication/download/6307 | vérifié |
| Eau libérée par une machine | « En moyenne, 2 kg d'eau sont transférés dans l'air intérieur au cours du séchage » ; « environ 2000 g d'eau par machine » (étude Q-Wash pour l'ADEME, IMT Nord Europe et CSTB) | https://hal.science/hal-05318299v1/file/%5BQ-Wash%5D%20Qualit%C3%A9%20de%20l%27air%20int%C3%A9rieur%20et%20s%C3%A9chage%20du%20linge.pdf | vérifié (lu par extraits) |
| Classement de l'humidité | Séchage en intérieur « activité la plus émettrice » : « double » de la cuisine, « quadruple de la quantité émise par un bain ou une douche » (même étude, Figure 1) | même URL | vérifié (lu par extraits) |
| Pièce plus froide | « diminution de 1 à 2 degrés de la température de la pièce » (L'essentiel à retenir) ; essais : -0,4 à -3,9 °C sur les deux premières heures ; hausse d'humidité « significative mais temporaire » | même URL | vérifié (lu par extraits) |
| Conseil OFSP sur le linge | « Evitez de sécher le linge dans les pièces habitables. » (Attention aux moisissures) | https://www.bag.admin.ch/dam/fr/sd-web/wBJWq1KVfpS-/vorsicht-schimmel.pdf | vérifié |
| Humidité recommandée | OFSP : « entre 30 et 50 % » ; « Les jours très froids, elle ne devrait pas dépasser les 40 % » | même URL | vérifié |
| Aération | OFSP : aérer par courant d'air « le matin, à midi et avant d'aller se coucher » ; « au moins 5 minutes » en période de chauffage | https://www.bag.admin.ch/fr/aeration-et-chauffage-appropries | vérifié |

## Calculs montrés à l'écran
| Calcul | Résultat |
|---|---|
| 0,99 kWh × 27,7 ct/kWh | 27,423 ct → 27 ct |
| 3,08 kWh × 27,7 ct/kWh | 85,316 ct → 85 ct |
| Étendoir | 0 kWh → 0 fr. d'électricité (lave-linge identique des deux côtés, non compté) |

## Abandonné
| Fait | Raison |
|---|---|
| Coût du chauffage en francs | L'étude donne 650 Wh pris à la pièce par machine, mais SuisseEnergie donne env. 0,7 kWh par litre évaporé (https://pubdb.bfe.admin.ch/fr/publication/download/166), soit 1,4 kWh pour 2 litres : sources en désaccord, et le prix dépend du chauffage. Dit en légende : non chiffré |
| « +6 % d'humidité relative » dans 40 m³ (Q-Wash) | Le rapport passe de 60 000 ppm à 6 % : non retenu, chiffre douteux (pièce sans renouvellement d'air, conversion non vérifiable) |
| Bosch WTH85V91CH (1,32 kWh, classe E) | Fiche « par condensation » : impossible de confirmer pompe à chaleur ou non |
| Bosch WTW87460CH (1,42 kWh pleine charge) | Ancienne étiquette : mesure non comparable aux 3,08 kWh |
| Calcul 8 kg × 53 % d'humidité résiduelle = 4,24 L (Bosch WAY287W4CH) | Non nécessaire : une source sur le sujet donne 2 kg en moyenne. Non dit, pour éviter deux chiffres |
| ADEME 40 à 60 % d'humidité | Différent de l'OFSP : on garde l'OFSP (Suisse) |

## Contrôle du script, phrase par phrase
| Phrase | Source | Contrôle |
|---|---|---|
| s04 « Un Bosh suisse à pompe à chaleur » | fiche it-CH, gaz R290 | fiche suisse (identifiant CH) ; 0,99 kWh pondéré, conditions eco |
| s05 | ElCom | 27,423 → 27 ct |
| s06 « Un Bosh belge à condensation classé G » | fiche fr-BE | 85,316 → 85 ct |
| s07 « modèle de ménage neuf… au moins classé C » | OFEN | ≤ 4 kg/h : précisé à l'écran |
| s08 | calcul | électricité seulement, dit dans la phrase |
| s09 « environ deux litres » | Q-Wash | 2 kg ≈ 2 L, « environ », « étude pour l'Adème » |
| s10 « quadruple d'un bain ou d'une douche » | Q-Wash | formulation de l'étude |
| s11 « d'un à deux degrés » | Q-Wash | formulation de l'étude ; « pendant le séchage » à l'écran |
| s12 | OFSP | citation |
| s13 | OFSP | 5 minutes : période de chauffage (le 8.11, c'est le cas) ; 30–50 % |
| s15 « tu paies en eau dans l'air » | image, Q-Wash | aucun classement entre les deux ; hausse d'humidité temporaire : pas dit le contraire |
