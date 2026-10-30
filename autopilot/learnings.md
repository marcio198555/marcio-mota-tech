# Enseignements — TikTok @marcio.mota8

Journal tenu par l'autopilote. Chaque vendredi : une section datée avec les chiffres de la semaine,
ce qui est **constaté** (données Metricool) et ce qui reste une **hypothèse à tester**. Objectif : abonnés et vues.

## 2026-10-25 — Point de départ (aucune donnée encore)
Compte TikTok neuf côté contenu faceless ; première vidéo publiée le 25.10 à 10 h.

Choix de départ (hypothèses, à confirmer ou corriger par les chiffres) :
- Format 31–40 s, accroche chiffrée lisible et dite dès la 1re seconde (mécaniques : le calcul qui choque,
  la fonction cachée, le mythe démonté). Source : synthèse Opus Clip 2026 et vidéos de référence R1–R8 du plan.
- Sous-titres incrustés calés sur la voix, 2 lignes max par carton (meilleure rétention attendue).
- Fin de vidéo : annonce du sujet du lendemain (« Abonne-toi : demain, … ») au lieu d'un « abonne-toi »
  générique, à partir de la vidéo du 26.10. But : donner une raison concrète de s'abonner.
- Miniature : image d'accroche (videoCoverMilliseconds ≈ 1200) — ignorée si le compte TikTok est personnel.
- Heure : 10 h (meilleur créneau Metricool) ; **test** : mercredi 28.10 à 18 h.
- Hashtags : 8 à 10, niche + génériques.

À mesurer au premier bilan (vendredi 30.10) :
1. Vues et temps moyen regardé par vidéo → quelles accroches retiennent le mieux.
2. Abonnés gagnés et visites du profil : la vidéo du 25.10 (fin générique) contre celles du 26 au 29
   (fin « demain »).
3. 18 h contre 10 h (une seule vidéo test : à confirmer la semaine suivante avant de conclure).

## 2026-10-27 — Passage à 2 vidéos par jour (demande de Marcio)
- Décision : 10 h et 18 h, 14 vidéos par semaine, toutes produites par l'autopilote. Les vidéos de 10 h annoncent
  celle du soir (« ce soir… »), celles de 18 h celle du lendemain matin (« demain… »).
- Des publications TikTok créées le 27.10 hors autopilote (17 h « mèche en coton », 19 h « joint de frigo », plus
  des brouillons) ont été remises en brouillon à la demande de Marcio : elles ne venaient pas de lui.
- À mesurer vendredi : 10 h contre 18 h (on a maintenant les deux créneaux chaque jour) et l'effet du doublement
  du rythme sur les vues moyennes par vidéo (hypothèse : légère baisse par vidéo, hausse du total).

## 2026-10-29 — Premier bilan (données Metricool du 29.10 à midi, vidéos de 1 à 4 jours)
| Vidéo | Heure | Durée | Vues | J'aime | Temps moyen regardé |
|---|---|---|---|---|---|
| Pente robot tondeuse | dim. 10 h | 37 s | 1 002 | 20 | 12 s |
| Batterie externe 20 000 mAh | mar. 10 h | 40 s | 780 | 27 | 8 s |
| Instruments cachés iPhone | lun. 10 h | 34 s | 269 | 4 | 6 s |
| Fermer ses applis | mar. 18 h | 36 s | 244 | 6 | 8 s |
| +10 dB | mer. 10 h | 42 s | 73 | 1 | 4 s |
(+ « 45 % n'est pas 45° », 15 s, publiée le 27.10 à 9 h hors autopilote : 253 vues, 5 s.) Fenêtre (mer. 18 h) et
mots de passe (jeu. 10 h) : pas encore de données. Abonnés : 63 → 71 en 4 jours. 95 à 100 % des vues viennent de « Pour toi ».

Constaté :
- La diffusion fonctionne (Pour toi), mais les gens partent vite : 4 à 12 s regardées sur 34 à 42 s, visionnage complet
  quasi nul, 0 partage, 0 commentaire.
- Les 2 meilleures vidéos sont « le piège du chiffre sur la fiche / la boîte » d'un produit qu'on achète
  (robot tondeuse, batterie externe). Les sujets abstraits (décibels, réglages iPhone) font 3 à 10 fois moins.
- Plus la vidéo est longue, plus elle a été quittée tôt (la plus longue, 42 s, a le pire temps moyen).
Hypothèses à tester (semaine du 30.10) :
- Vidéos de 18 à 25 s (6 à 7 segments, 50 à 65 mots), révélation chiffrée dans les 3 premières secondes.
- Fin raccourcie : une seule phrase « Abonne-toi : ce soir / demain, … » (≤ 3 s) ; plus de segment « envoie ça à… »
  (0 partage), l'appel au partage reste dans la description.
- Sujets : priorité aux pièges des fiches techniques et emballages avant le Black Friday (produits qu'on achète).
- 10 h contre 18 h : trop peu de données pour conclure, garder les deux créneaux.

## 2026-10-29 (après-midi) — Stratégie du mois (demande de Marcio) : `strategy.json`
Marcio : « trouve les solutions pour cartonner, fais ça pendant 1 mois, chaque semaine analyse les résultats et si
ça ne marche pas change de stratégie ». Recherche faite le 29.10 :
- Constaté ailleurs (sources) : TikTok donne plus de poids au fait de finir une vidéo et dit que le nombre d'abonnés
  n'est pas un facteur direct (TikTok Newsroom). Dans un index de 2,4 M de TikToks populaires, les vidéos sans visage
  et avec très peu de paroles ont les meilleures médianes de vues, et 16–30 s la meilleure médiane (Revid.ai, 2026 :
  corrélations, pas des causes). En français, des formats « texte seul en boucle, musique seule » font plus d'un
  million de vues sur de petits comptes (vidIQ, ex. « Traduction des annonces immobilières », 1,9 M vues).
- Hypothèse principale à tester en S1 : notre problème est la rétention (4–12 s regardées) ; une vidéo courte à lire,
  en boucle, sans voix de synthèse, peut retenir mieux.
Décisions :
- **S1 (30.10 → 5.11) = test A/B** : format V (voix, 18–25 s) contre format T (texte seul « écrit en gros → écrit en
  petit », 10–13 s, en boucle), 7 créneaux chacun, alternés entre 10 h et 18 h. Tous les sujets restent dans la
  famille gagnante « pièges des fiches techniques et des promos » avant le Black Friday.
- Appliqué partout dès S1 : description en question (recherche TikTok), « Enregistre-la avant d'acheter », question
  oui/non, 4 à 6 hashtags précis ; couverture lisible dans la grille.
- Règles de décision (R1–R7), objectifs par semaine et échelle des plans (A pièges d'achat → B zéro voix → C Suisse
  pratique → D avec la voix de Marcio) : voir `strategy.json` et RUNBOOK § 10.
- Vidéo 6 (bouilloire, ven. 10 h) : fin refaite (« ce soir… ») et vidéo 10 (pilote T, iPhone 17) produites le 29.10.
- Contrôle qualité du 29.10 : la voix Piper tom lit « iPhone » « i-fone » → écrire « aïe-fone » dans le texte dit,
  garder « iPhone » à l'écran (même chose pour tout nom de marque anglais). Une nouvelle prise de voix = un nouveau job
  (le pont saute les jobs déjà synthétisés). Format T : recopier les mots exacts du fabricant (« jusqu'à », « max »).

## 2026-10-30 (5 h 40) — Bilan de départ de la stratégie du mois (Metricool, données au 30.10 tôt le matin)
Pas encore de note VERT / ORANGE / ROUGE : S1 commence aujourd'hui, première note le vendredi 6.11.
| Vidéo (autopilote, format V) | Heure | Durée | Vues | J'aime | Comm. | Temps moyen | Rétention |
|---|---|---|---|---|---|---|---|
| Pente robot tondeuse (25.10) | 10 h | 37 s | 1 002 | 20 | 0 | 12 s | 32 % |
| Batterie externe (27.10) | 10 h | 40 s | 782 | 27 | 0 | 8 s | 20 % |
| Fenêtre oscillo-battant (28.10) | 18 h | 33 s | 277 | 8 | 1 | 9 s | 27 % |
| Instruments iPhone (26.10) | 10 h | 34 s | 269 | 4 | 0 | 6 s | 18 % |
| +10 dB (28.10) | 10 h | 42 s | 254 | 5 | 0 | 5 s | 12 % |
| Fermer ses applis (27.10) | 18 h | 36 s | 252 | 6 | 0 | 8 s | 22 % |
| Mot de passe (29.10, < 24 h) | 10 h | 36 s | 159 | 4 | 0 | 6 s | 17 % |
(« 45 % ≠ 45° » publiée hors autopilote le 27.10 : 253 vues, 5 s. USB-C du 29.10 18 h : pas encore dans les données.)
- Indicateurs (7 vidéos autopilote) : **médiane 269 vues** (moyenne 428), **rétention moyenne 21 %**, 0 partage,
  1 commentaire → **engagement 0,3 pour 1 000 vues**. Abonnés : 63 (24.10) → 72 (28.10), **+9**.
- Par heure : 10 h médiane 269 (5 vidéos), 18 h médiane 265 (2 vidéos) → pas de différence mesurable.
- Par format : tout est en V jusqu'ici ; le premier T (iPhone 17) sort ce soir à 18 h.
- 90 à 98 % des vues viennent de « Pour toi », 0 % de la recherche (les descriptions-questions commencent aujourd'hui).
Constaté :
- Les deux vidéos au-dessus de 700 vues sont des pièges de chiffre sur une fiche/boîte (tondeuse, batterie). La tondeuse
  fait 3,7 × la médiane (critère « pépite » R6 rempli, mais avant le début du test).
- La meilleure rétention (32 %) va avec la meilleure vidéo ; les plus longues (40–42 s) retiennent le moins.
Décisions (R7 : rien de nouveau en plus du test V/T déjà lancé) :
- S1 reste tel que planifié le 29.10 (test V contre T, sujets « pièges d'achat »). Les 6 vidéos de 10 h sont produites ce matin.
- Proposer à Marcio d'épingler la tondeuse et la batterie externe. Une « Partie 2 » de la tondeuse (autre chiffre trompeur
  de robot tondeuse) est mise en réserve pour S2 si S1 confirme la famille « pièges d'achat ».
- Hypothèse à vérifier le 6.11 : le format T (boucle, 10–13 s) dépasse 35 % de rétention.
Production du 30.10 (vidéos de 10 h, jours 11 à 21) — enseignements du contrôle qualité :
- OIP art. 16 a changé au 1.1.2025 : « moitié de la durée, 2 mois max. » seulement pour un prix pratiqué juste avant ;
  un prix pratiqué ≥ 30 jours consécutifs peut être affiché sans limite. Ne jamais dire « 2 mois max. » seul.
- Pas de durée maximale légale du programme éco des lave-vaisselle (règl. UE 2019/2022).
- AirPods : « 30 h » ne vaut que pour les AirPods 4 (les AirPods 5 annoncent 22 h avec réduction de bruit) : nommer le modèle.
- Éviter les généralisations (« le plus long consomme le moins ») : dire exactement ce que la source compare.
- Format T avec prix d'illustration : écrire XX / X plutôt que des prix inventés.
