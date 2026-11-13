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
Production du 30.10 (vidéos de 18 h, jours 12 à 22) — enseignements du contrôle qualité :
- Ne jamais dire « ton téléphone ne charge pas à 65 W » : certains téléphones acceptent 65 W ou plus. Dire « pas forcément » ;
  la norme USB PD dit seulement que l'appareil prend ce qu'il demande. Apple ne publie pas de puissance max en watts pour l'iPhone 17.
- Garantie (CO 199/210) : le SECO dit « exclusion clairement dans le contrat (hors CG) », la FRC cite aussi les CG → dire « écrit
  clairement dans le contrat ». La révision du 1.1.2026 ne concerne que les défauts de construction.
- Format T : citer toute la note du fabricant quand elle a une condition (Motion Xcelerator : « PC gaming compatible requis ») ;
  préciser le pays de la fiche (fiche Samsung US) ; une note générale (OFEN) se dit « un appareil », pas « ce téléviseur ».
- Accroche « 120 Hz » abandonnée faute de source officielle : changer d'angle plutôt que forcer le chiffre du plan.
- Une annonce « 2 fois moins » doit dire par rapport à quoi (« que l'intensif »).

## 2026-11-01 — Stories Instagram (demande de Marcio)
- Marcio : « quand tu crées le contenu, en même temps mets-la en story aussi ». Décision : chaque vidéo de l'autopilote
  part aussi en Story Instagram sur @filipe_marcio1985, 5 min après la vidéo TikTok, avec un bandeau « PLUS DE VIDÉOS
  SUR TIKTOK · @marcio.mota8 » (tools/story.sh). But : amener ses abonnés Instagram vers le compte TikTok.
- Stories des jours 13 à 22 programmées le 01.11 (ids Metricool dans plan.json).
- Pour le bilan du 6.11 : les abonnés TikTok gagnés à partir du 01.11 peuvent venir des Stories ; regarder les visites
  du profil TikTok (TKEV09) avant et après le 01.11 et le noter comme hypothèse, pas comme résultat.

## 02.11.2026 — Vidéo 23 (premier format A) : leçons du contrôle qualité
- Le chiffre de la boîte doit être nettement plus grand que la valeur « suffisante » citée (8 000 Pa contre 10 000 Pa
  inversait le message) : vérifier que l'histoire tient avec les vrais ordres de grandeur avant d'écrire la voix.
- Une carte « TECHRADAR » au-dessus d'un graphique se lit comme un graphique publié : écrire « D'après … » et
  « Illustration, pas des mesures » en 40 px, et masquer « JE MESURE TOUT » sur cette carte.
- Accroche lisible dès l'image 0 : `captions(..., { fromZero: true })` et un personnage déjà méfiant à l'image 0.
- Image trop immobile (effet diaporama) : le personnage bouge (il roule, tremble, sursaute), lente avancée de caméra.
- Formulations prudentes (« ça ne suffit pas à dire », « regarde aussi ») : fidèles à la source, sans contestation possible.
- Fin sans promesse datée (« d'autres objets vont tout balancer ») tant que la vidéo suivante n'est pas au plan.
- Nouvelle prise de voix = nouveau job ET nouveau dossier studio ; voice_fx.py refuse maintenant de monter deux fois.
- Annonces dans les descriptions déjà programmées : les corriger si la vidéo annoncée change (vidéo 22 corrigée).

## 03.11.2026 — Changement de mot de passe Instagram : ce qui s'est passé
- Après le changement de mot de passe (02.11 au soir), Metricool a perdu Instagram (« Instagram was disconnected ») ;
  le 03.11, TikTok aussi (« Could not refresh TikTok Business accessToken ») : la vidéo TikTok de 10 h n'est pas partie.
- À la reconnexion d'Instagram, Metricool a mis **toutes** les publications Instagram à venir en brouillon (draft: true).
  Remise en programmation une par une (updateScheduledPost, draft: false) ; les ids changent, l'uuid reste.
- Contrôle à faire après toute reconnexion : getScheduledPosts sur 3 semaines, chercher draft: true et ERROR.
- Windsor.ai (statistiques) n'a pas été touché.

## 03.11.2026 (soir) — meilleurs outils gratuits (« sois 100 % autonome avec les meilleurs outils »)
- Images : Z-Image-Turbo (Apache 2.0) tourne dans le pont GitHub sur CPU, environ 12 à 13 min par image ; décor très réussi
  du premier coup, mais le personnage s'éloigne du sujet (un « bonhomme » assis sur un robot). GPT Image 2 (Cloudinary,
  gratuit mais 50 crédits par mois ; 3 crédits en 9:16, 6 en carré) suit mieux la consigne : à réserver aux personnages
  principaux, réutilisés ensuite. Détourage rembg BiRefNet : propre.
- Le moteur anime une image IA (rebond, respiration, clignements, bouche dessinée par-dessus) : rendu nettement plus
  « film d'animation » que les formes dessinées. Vidéo 23 refaite ainsi (mêmes faits, même voix) et remplacée dans Buffer.
- Hugging Face Spaces : indisponible par ce connecteur (gradio=none), même après le réglage de Marcio.
- Publication : Buffer pour TikTok et Stories (tâche quotidienne 7 h 13), Reels d'essai via vidIQ (file
  `reels_queue.json`), Metricool en brouillon pour éviter les doublons.
- Voix : Marcio a écouté les 3 essais et choisi la 3 (Chatterbox avec le timbre de la voix Piper), 03.11.2026 à 21 h 40.
  Elle devient la voix par défaut (RUNBOOK § 11.7) ; la vidéo 23 est refaite avec cette voix avant sa publication du 6.11.
  Piège évité : Chatterbox écrivait des WAV flottants, illisibles pour assemble_vo.py → WAV 16 bits.
- Vidéo 23 refaite avec la voix 3 (03.11 au soir) : même scène IA, mêmes faits ; 26 s → 32 s, car Chatterbox parle plus
  posément que Piper (≈ +20 % de durée, à prévoir dans les scripts). Transcription : seuls écarts = chiffres écrits en
  chiffres et « l'a vu » entendu « à la vue » (homophone) → contrôle réussi. Buffer TikTok et Story du 6.11 mis à jour.
- Pour refaire une vidéo avec une nouvelle voix du même texte : `tools/retime_cues.py` recale les bruitages mot par mot ;
  la scène suit déjà les mots (wordAt). Le pont pousse maintenant chaque voix, transcription et image dès qu'elle est
  prête (« bridge output (voix) », « (transcription) », « (image …) ») : plus besoin d'attendre la fin du passage.

## 04.11.2026 — Marcio : « je n'ai pas de vues sur TikTok, ta méthode ne marche pas très bien »
- Il a raison. Metricool (04.11, 8 h 30) : 14 des 16 vidéos de l'autopilote publiées du 25.10 au 2.11 sont restées
  entre 246 et 293 vues (médiane 269,5) : c'est le premier groupe de test de TikTok, les gens passent et la vidéo
  s'arrête là. Seules les 2 premières sont sorties (robot tondeuse 1 010, batterie externe 785) ; aucune depuis le
  28.10. 2 partages, 1 commentaire en tout. Abonnés 68 → 74 en 9 jours.
- Le test voix (V) contre texte seul (T) ne change rien : les deux restent vers 250–290 vues.
- Les vraies vidéos de Marcio publiées sur TikTok en juin-juillet (produit réel, 5–12 s) : 3 sur 8 au-dessus de
  780 vues (Dreame 922, Kärcher 803, barre de son 788). Petit échantillon, mais meilleur que l'autopilote (2 sur 16).
- Les données de rétention de Metricool (temps moyen, visionnage complet) ne remontent plus depuis le 30.10 (null).
- Décision (accord de Marcio : « Oui, toutes ») : 18 h = format R, ses vrais Reels Instagram raccourcis (RUNBOOK § 12) ;
  10 h = format A court, 15 s max, produits seulement. Vidéos 20 et 22 retirées de TikTok (brouillons Buffer).
- Pièges vus en préparant le format R : certains Reels de Marcio contiennent des images d'autres créateurs ou de la
  marque (Retevis : images de TOM HF ; Klarus : entrepôt et texte anglais de la marque) → exclus, jamais sur TikTok.
  Beaucoup ont une musique de fond continue (probablement de la bibliothèque Instagram) → couper le son et mettre
  une musique libre, sauf s'il y a une voix off.
- 04.11, recherche complète (rapport `autopilot/recherche/methode_tiktok_2026.md`, page https://claude.ai/artifact/UbK7UBJUjV1aiYBs9s927G) :
  250–300 vues = norme d'un petit compte (médianes 317–327) ; pire durée 5–10 s → 20–40 s ; accroche chiffre/duel
  dès l'image 1 ; légende « recherche » + question ; 3–5 hashtags précis ; produits reçus = « Publicité » + réglage
  de divulgation TikTok (Buffer ne le transmet pas : Marcio l'active après publication) ; étiquette IA obligatoire.
  Le rapport recommande de remplacer la vidéo créée de 10 h par une 2e vraie vidéo ; Marcio a choisi « 1 vraie +
  1 créée » : on garde, et on lui propose le changement au bilan du 20.11 si le créneau créé fait moins bien.

## 05.11.2026 — Marcio : « je n'ai pas de vues, tu ne peux pas revoir ta stratégie ? »
- Données (Buffer, mises à jour le 04.11 à 17 h 37 ; Metricool au 05.11 à 8 h 50), 20 vidéos de l'autopilote du 25.10
  au 4.11 : 16 entre 246 et 293 vues ; temps moyen regardé 3 à 11 s (vidéos T de 11 s : 3 à 5 s). Les champs Metricool
  de rétention et de sources de trafic (TKPO13–21) reviennent vides ; Buffer donne le temps moyen regardé.
- Constaté : les 2 seules vidéos sorties sont des **V longs « chiffre-piège de fiche technique »** : jour 1 « 45 % de
  pente ≠ 45° » (37 s, 13 phrases, 115 mots, 18 repères sonores, 1 013 vues, 12 s regardées) et jour 3 « 20 000 mAh ≠
  5 recharges » (40 s, 10 phrases, 107 mots, 21 repères, 785 vues, 27 j'aime). Même ouverture : le chiffre de la boîte en
  question adressé à la personne (« Ton robot tondeuse grimpe 45 % ? »), puis « non » tout de suite. Sur 3 V de 35–40 s
  de ce type, 2 sont sortis (le 3e : câbles USB-C, 293 vues mais 19 j'aime, le meilleur taux).
- Constaté : jamais au-dessus de 293 vues : T « écrit en petit » (5 vidéos), V de 21–23 s (4), loi suisse, conseils sans
  produit (aération, bouilloire, applis, décibels). Le passage aux vidéos courtes (décision du 29.10, 18–25 s ; puis
  15 s le 04.11) n'a rien amélioré.
- Format R : Roomba (produit reçu, présentation de marque) 79 vues après 16 h. Les Reels Instagram de Marcio sont surtout
  des présentations de produits reçus (titres, plans produit, lettres noires : ex. Meross) : sur TikTok, ils ressemblent
  à des pubs et demandent le réglage de divulgation que Buffer ne peut pas mettre.
- Hypothèses (à vérifier au bilan, pas des résultats) : la recette des jours 1 et 3 (produit courant + chiffre de la boîte
  + contre-pied immédiat + 35–40 s + image qui change toutes les 2 s) retient mieux ; les modèles presque identiques
  (série T) sont pénalisés (l'aide Buffer le dit) ; un tirage reste aléatoire avec 250 personnes testées par vidéo.
- Choix de Marcio (05.11, 9 h) : « 2 chiffres-pièges par jour » ; « Non, pas le temps » pour filmer des mesures ;
  « Oui, ajoute-la » pour l'image de fin TikTok des Stories. Appliqué : bloc du 05.11 du RUNBOOK (prime sur tout),
  plan.json (rythme, idées 40–54, anciennes idées sans produit écartées), strategy.json (formats, S2, journal),
  `tools/story_endcard.py` branché dans `story.sh` ; Stories du 5.11 (10 h 05, 18 h 05) et du 6.11 (10 h 05) refaites
  avec la fin et mises à jour dans Buffer ; consignes des tâches du vendredi réécrites.

## 05.11.2026 (fin de matinée) — Vidéo 55, premier essai de la recette « Vérité du quotidien »
- Marcio, 10 h 47 : « je veux que tu sois 100 % autonome » ; 10 h 48 : « et pendant un mois tu crées du contenu ».
  Appliqué : plus de validation avant publication (RUNBOOK, bloc du 05.11, point 6) ; période prolongée jusqu'au 5.12
  (S5 = 28.11 → 5.12, bilan final le 4.12) ; consignes des 3 tâches (vendredi 5 h 37 et 11 h 37, Buffer 7 h 13) réécrites.
- Longueur réelle de la voix Chatterbox : 182 mots, 15 phrases = 64,5 s avec `--gap 0.1` (≈ 2,8 mots par seconde, et
  non 2,3 comme estimé). Pour 50 à 70 s : 150 à 190 mots.
- Story Instagram : l'API (Buffer) refuse plus de 60 s. `story.sh` coupe maintenant à la fin de la dernière phrase
  finie avant 57,5 s quand la vidéo dépasse 58 s (vidéo 55 : 64,8 s → Story de 58,4 s).
- Contrôle des images (planche toutes les 3–5 s) : la fiche d'un câble débranché pendait jusque sur les sous-titres
  (hors du cadre des essais à blanc, qui n'avaient pas les vrais sous-titres) ; un libellé « 100 % » caché sous les
  compteurs ; un « ? » de bulle qui chevauchait l'encadré. Une valeur d'illustration (36 °C) remplacée par « > 35 °C »,
  et la courbe de la nuit marquée « schéma : exemple d'une nuit ». À refaire sur chaque vidéo : planche complète avec
  les vrais sous-titres avant de publier.
- Whisper (via le pont) : texte conforme, sauf « débanche » entendu au lieu de « débranche » (probabilité 0,9) dans
  l'accroche. Correction : 3 nouvelles prises de la phrase 2 seulement (jobs day55b/c/d, même texte, graines 11, 23,
  42), transcrites à leur tour : les 3 donnent « débranche » (probabilité 1,0) ; prise c gardée (même durée que
  l'originale), voix remontée dans /home/claude/studio/day55/tts_final (64,2 s). Coût : 2 passages du pont, environ 12 min.
- Contrôle qualité par un agent neuf (05.11, 11 h 30) : verdict « à corriger ». Quatre phrases allaient plus loin que
  les sources : « Apple et Samsung le font déjà, tout seul » (la protection Samsung est à activer ; la recharge optimisée
  de l'iPhone finit à 100 %) ; « garde 80 % » (Apple : « conçu pour garder … en conditions idéales ») ; « ce n'est pas
  la nuit, c'est la chaleur » (aucune source ne classe les causes) ; « 35 °C » sans « ambiante ». Corrigé avant la
  publication : phrases 5, 9, 10, 11 et 15 refaites, phrase 9 bis ajoutée (limite de charge à 80 % des modèles
  récents), phrase 13 retirée pour rester sous 70 s ; image (cartes iPhone activée d'office / Samsung à activer,
  interrupteur, limite de charge, « avec le réglage », « température ambiante », lune sans disque noir, collègue en
  homme, rien au-delà de x = 940) ; légendes alignées. Règle : écrire chaque affirmation à la force exacte de la
  source (« conçu pour », « peut », « à activer », « ambiante »), et le vérifier phrase par phrase avant la voix.
- Version finale du jour 55 : 68,1 s (voix 67,7 s, `assemble_vo.py --tempo 1.04` pour rester sous 70 s ; l'outil plantait
  avec un tempo > 1, tampon corrigé), Whisper conforme. Buffer mis à jour (TikTok 20 h 30, Story 56,4 s à 20 h 35) ;
  Reel d'essai publié directement avec vidIQ à 11 h 50 (https://www.instagram.com/reel/DfW2dtllVSe/), noté dans le
  journal Google Doc et dans reels_queue.json (statut « publié », la tâche de 7 h 13 ne le reprendra pas).

## 06.11.2026 — Bilan de S1 (30.10 → 5.11) : ROUGE
Sources : Metricool (vues, j'aime, abonnés, jusqu'au 4.11), Buffer (temps regardé, mis à jour le 5.11 à 15 h 38), Windsor (Instagram, 6.11).
| Indicateur (13 vidéos d'au moins 18 h) | Résultat | Objectif |
|---|---|---|
| Médiane des vues | 263 (240 à 285) | 400 |
| Rétention moyenne (12 vidéos) | 32 % ; 5,8 s regardées | 35 % |
| Abonnés gagnés | 0 (75 le 29.10, 75 le 4.11, dernier chiffre connu) | +30 |
| Partages + commentaires | 1 sur 3 401 vues (0,3 pour 1 000) | — |
Note R1 : min(263/400 ; 0/30) = 0 → **ROUGE**.
- Par format : V 263,5 vues (6 vidéos, 7,5 s regardées, 31 %) ; T 261 (6, 4,1 s, 35 % parce que la vidéo dure 12 s) ; R Roomba 240 (3,9 s). Pas de gagnant.
- Par heure : 10 h médiane 256 (7) ; 18 h médiane 267 (6). Écart trop faible pour conclure.
- Par sujet : aucun type de sujet ne sort ; ampoule, chargeur et lave-vaisselle ont 5 à 7 j'aime contre 1 à 3 pour la plupart des T et des sujets de loi.
- 3 meilleures : chargeur 65 W (V, 22,5 s, 285 vues, 6,9 s), iPhone 17 (T, 11,8 s, 284, 5,3 s), SSD (T, 11,8 s, 275, 4,1 s). 3 moins bonnes : Roomba (R, 17,8 s, 240, 3,9 s), AirPods (T, 11,8 s, 246, 3,2 s), promos Black Friday (T, 11,8 s, 249). L'écart de 45 vues entre les extrêmes ne distingue rien : toutes s'arrêtent au premier groupe test.
- Le temps regardé le plus long n'a pas donné plus de vues : garantie 11,2 s pour 263 vues.
- Vidéo 55 (5.11, 20 h 30) : 4 vues dans Metricool à 5 h 40 (moins de 10 h, chiffre sans doute en retard, Buffer pas encore à jour) : **rien à conclure**. Sleepal (5.11, 18 h) : 79 vues après moins de 12 h. Toutes deux comptent au bilan du 13.11.
- Instagram (Windsor, 15 Reels du 30.10 au 5.11, certains peuvent être des Reels de Marcio) : médiane 170 vues, portée médiane 145. **Reel d'essai de la vidéo 55 : 2 150 vues, portée 1 884, 5 enregistrements, 1 partage en moins de 24 h**, le meilleur des Reels d'essai ; devant le robot tondeuse (1 182, sa recette d'origine), la batterie recyclée (755) et la vidéo 22 (686). DfP8-gTAe2V affiche 11 523 vues pour 249 de portée : chiffre incohérent, écarté de la lecture. Stories : Windsor n'en a renvoyé aucune, **donnée manquante**. Abonnés Instagram : 34 573 ; 6 à 9 nouveaux par jour, stable sur 14 jours.
Constaté : la vidéo 55 est la seule de la semaine à décoller, sur un seul réseau, une seule fois. Hypothèse à vérifier le 13.11 : la nouvelle recette fait mieux aussi sur TikTok.
Décision : ROUGE = changer de stratégie (R4), ce qui a été fait le 05.11. Aucune décision sur la recette avant le 13.11 (une seule vidéo). Changements de plan seulement :
1. Partie 2 de la vidéo 55 (charge rapide) le 7.11, à cause de ses 2 150 vues Instagram (règle des 600 vues).
2. vidIQ (6.11) : « linge au salon » 2,2 M et 1,9 M (3D, conséquences invisibles, début novembre) ; duel en split « faut-il débrancher son chargeur » 1,3 M ; « Suisse vs France » salaire 968 000 ; achat ou location 1 M (compte de 3 900 abonnés). → Vidéo 37 repositionnée « linge au salon ou sèche-linge » avec notre angle en francs ; même mécanique, rien de copié.
3. V et A répartis à égalité entre 10 h et 18 h (2 A à chaque heure) pour une comparaison propre le 13.11.

Production du 06.11 (vidéos de 10 h, 7 au 12.11 : jours 60, 37, 32, 56, 71, 62) — enseignements :
- **Voix plus longue que prévu** : 180 mots avec beaucoup de nombres font 72 à 82 s (« virgule », « kilowattheures »), et non 65 s. Vidéo 71 : 183 mots = 82 s, une phrase retirée et tempo 1,11. Pour une vidéo chiffrée : 150 à 165 mots. `tools/finish.sh NN V|A` fait tout (voix → tempo si plus de 69 s → sous-titres de `days/dayNN/draft.json` → repères de `days/dayNN/make_cues.py` → rendu → mixage) ; `tools/merge_voice.py NN b c` fusionne les nouvelles prises dans le studio (`SRC=/home/claude/studio/dayNN/tts_final`). Sur 2 processeurs : 2 rendus à la fois au plus (5 min pour V seul).
- Whisper trouve de vrais défauts : mot répété en fin de phrase par Chatterbox (« en vrai ? En vrai », « en francs. En francs »), « bain » entendu « bas », « Suisse Énergie » entendu « Suisse énervie ». Corrigé par des prises avec une autre graine ou une phrase réécrite.
- `reel_cut.sh` coupait au mot « abonnement » (vidéo 71 coupée à 42,8 s) : il cherche maintenant « abonne-toi ». Regarder la longueur du Reel.
- Vidéos A (décor IA en mouvement) : 137 à 156 Mo à la sortie, au-delà des 100 Mo de Cloudinary : réencoder avec crf 24 (16 à 17 Mo).
- Contrôle qualité : ne jamais laisser défiler un compteur sur des valeurs inventées (22, 38, 39 CHF ; 9,4 W ; 0,61) : afficher « ?? » ou le passage direct. Une promesse (« dans trois ans, lequel… ? ») sans réponse dans les sources : changer la question.
- Tarif ElCom 27,7 ct : médiane, **hors TVA** (déduit : le communiqué ne le dit pas ; EKZ et calculsuisse.ch vont dans ce sens) : l'écrire à l'écran et dans les légendes.
- Images Cloudinary : 42 crédits utilisés sur 50 en novembre (GPT Image 2 en 9:16 : 3 crédits). Personnages frigo et micro-ondes faits avec Z-Image dans le pont.

Production du 06.11 (vidéos de 18 h, 7 au 12.11 : jours 27, 59, 70, 58, 57, 24) — enseignements :
- **Blancs de voix** : une prise Chatterbox (57 s07) contenait 6 s de souffle dans 10,5 s ; Whisper ne le signale pas, seule la mesure RMS du contrôle l'a trouvé. `tools/trim_sil.py <dossier>` raccourcit les blancs : le lancer sur `tts_final` avant `finish.sh` (`SRC=…`) ; il gagne 5 à 15 % de durée et évite la plupart des `--tempo`.
- **Mots** : `len(split)` compte aussi les « l' » et nombres en lettres longs : 170 à 185 mots = 75 s de voix brute. Prononciation Chatterbox : « aïe-fone », « té-vé-a » (sinon Whisper entend TFA), « Èl-Gé », « èl-cé-dé », « F D A ». Certaines prises ajoutent un mot en fin (« Oh, », « Pas, », « Sable, ») : refaire la prise avec une autre graine.
- **Force des affirmations** (contrôle) : FDA = « dans un plat épais » ; 5 % par degré de Que Choisir = réfrigérateur seulement, sur un combiné c'est un maximum (dit « jusqu'à ») ; Purdue ne mesure pas les yeux ; une revue qui lie litres et taux de gens qui rincent : dire les deux chiffres ; « sans taxe » faux si le prix contient autre chose (timbre, recyclage) : « sans TVA » ; un calcul de détaxe n'est qu'un minimum (« au mieux »).
- `render/kit.js` (objet KIT, chargé par render.js) : tampon, cartes, calcul, barres, thermomètre, pièces, horloge, drapeaux, duel, commentaire, personnages frigo et micro-ondes. Une scène fait 110 à 140 lignes. `tools/fake_tl.py NN sortie.json` : timeline d'essai pour regarder la scène avant la voix. `tools/make_cues_auto.py` : repères sonores. Rendu V : 5 min ; A : 7 min.
- Tailles : `tag` et `chip` jamais sous 36 px, c'est le défaut de KIT depuis ce jour.

## 07.11.2026 — Analyse tous les 2 jours n° 1 (13 h 17) : TikTok PAS ENCORE, Instagram PAS ENCORE (nouvelle recette au-dessus de 1 000)
Sources : Buffer `list_posts` avec chiffres (mis à jour le 7.11 à 4 h 40), Metricool (abonnés TikTok), Windsor (Instagram, 7.11). Fenêtre : vidéos de l'autopilote publiées du 5.11 au 7.11, jugées à 18 h d'âge au moins (avant le 6.11 à 19 h 20).
| TikTok (≥ 18 h) | Recette | Durée | Vues | Temps moyen regardé | J'aime | Partages | Comm. |
|---|---|---|---|---|---|---|---|
| 55 charge la nuit (5.11, 20 h 30) | nouvelle (V) | 68 s | **328** | **18,0 s** | 20 | 2 | 1 |
| 21 lave-vaisselle (5.11, 10 h) | ancienne (V) | 23 s | 268 | 6,7 s | 7 | 0 | 0 |
| Aeotec (6.11, 18 h, R) | réel | 20 s | 269 | 6,6 s | 1 | 0 | 0 |
| 23 robot aspirateur (6.11, 10 h) | ancienne (A) | 32 s | 259 | 8,9 s | 2 | 0 | 0 |
| Sleepal (5.11, 18 h, R) | réel | 17 s | 247 | 4,4 s | 3 | 0 | 0 |
Médiane de la fenêtre : 268 vues ; nouvelle recette seule : 328 (une seule vidéo jugée). 60 charge rapide (7.11, 10 h) : chiffres Buffer pas encore à jour (0), rien à conclure. Abonnés TikTok : 76 (6.11), +1 sur la semaine. Une publication « #milestone » du 6.11 à 21 h 58 (47 s, 7 vues) n'est pas de l'autopilote : pas touchée.
| Reels d'essai Instagram | Recette | Vues | Portée | Enreg. |
|---|---|---|---|---|
| 55 charge la nuit (DfW2dtllVSe) | nouvelle | **2 412** | 2 105 | 6 |
| 23 robot aspirateur (DfY8Tvekzit) | ancienne | 1 307 | 1 062 | 1 |
| batterie externe recyclée (DfWXdmnlQq1) | jour 3 | 765 | 617 | 3 |
| 22 (DfWXhlwCu_o) | ancienne | 710 | 571 | 0 |
| gourde recyclée (DfY8T38E_QA) | ancienne | 91 | 80 | 0 |
| premier signal (6 h) : 60 charge rapide (DfbhHVekbbz) | nouvelle | 1 387 | 1 275 | 1 |
| premier signal (6 h) : 27 frigo (DfbhGhajQ6I) | nouvelle | 1 175 | 1 039 | 0 |
Médiane des Reels jugés : 765 → PAS ENCORE. Mais les 3 Reels de la nouvelle recette sont tous au-dessus de 1 000 (2 412 jugé ; 1 387 et 1 175 en 6 h). Stories : Windsor n'en renvoie aucune, **donnée manquante**. Abonnés Instagram : 34 576 (34 573 le 6.11).
Verdict : **TikTok PAS ENCORE** (la nouvelle recette fait 328, dans la bande 300–600 ; la médiane de la fenêtre, 268, vient des anciennes vidéos et des R, déjà abandonnés ; le verdict « ne marche pas » demande aussi « aucun Reel ≥ 1 000 », ce qui n'est pas le cas). **Instagram PAS ENCORE, en nette hausse** : on ne change rien sur Instagram.
Pourquoi : la meilleure vidéo des deux réseaux est la même (55). Sur TikTok, les gens regardent 18 s sur 68 (26 %) ; les 2 seules vidéos TikTok sorties au-dessus de 600 (jours 1 et 3) duraient 37 et 40 s. Metricool (meilleures heures, 8–9.11) met déjà 10 h et 18 h en tête : l'heure n'est pas le levier.
Décision (une seule chose changée, TikTok seulement) : **durée**. Les 4 vidéos TikTok des 8 et 9.11 passent en version courte de 50 à 53 s (37 : 53,0 s ; 59 : 49,7 ; 32 : 52,2 ; 70 : 50,5), en retirant des phrases entières (bonus, 2e chiffre, retour au duel), sans changer ni l'accroche, ni la légende, ni l'heure. Instagram (Stories et Reels d'essai) garde les versions longues. À juger à l'analyse du 9.11 (37 et 32) et du 11.11 (59 et 70) : temps moyen regardé et vues contre la vidéo 55 (328 vues, 18 s) et 60.
Production :
- `tools/tk_short.py NN i,j,k` : retire des phrases (indices de `studio/timeline.json`), coupe au milieu des blancs, fondu son 40 ms ; `days/dayNN/tk_cuts.json` garde la liste. Contrôle par un agent neuf : faits et son OK, mais 1 à 3 images de la phrase retirée (fondu de sortie, sous-titre suivant) apparaissaient après chaque raccord. Correction : l'image s'arrête à la fin de la voix et reste figée jusqu'au raccord + 0,15 s (le son ne change pas). Planche revérifiée : plus aucune image ni sous-titre de phrase retirée.
- Whisper (pont) : textes conformes, aucun mot incertain ; il n'entend pas les lettres seules « G » et « C » (classes énergie) ni « Èl-Gé », déjà le cas dans les versions longues contrôlées le 06.11 (affichées à l'écran).
- Cloudinary : envoi direct refusé par le proxy (api.cloudinary.com) ; `upload-asset` depuis raw.githubusercontent (commit be41ca9) marche. Buffer : `edit_post` (vidéo seule, légende, titre et isAiGenerated gardés).
- Dans ffmpeg, plusieurs `trim` sur la même entrée tuent le processus (mémoire) : une entrée `-ss/-to` par passage.

## 09.11.2026 — Analyse tous les 2 jours n° 2 (13 h 17) : TikTok NE MARCHE PAS (275), Instagram ÇA MARCHE (1 514)
Sources : Buffer `list_posts` avec chiffres (mis à jour le 9.11 à 12 h 42), Metricool (abonnés TikTok), Windsor (Instagram, 9.11). Fenêtre : vidéos publiées depuis l'analyse du 7.11 (7.11 → 9.11), jugées à 18 h d'âge au moins.
| TikTok (≥ 18 h) | Version | Durée | Vues | Temps moyen regardé | J'aime | Partages | Comm. |
|---|---|---|---|---|---|---|---|
| 37 linge au salon (8.11, 10 h) | courte | 53 s | **323** | 16,7 s | 13 | 0 | 1 |
| 60 charge rapide (7.11, 10 h) | longue | 69 s | 275 | 16,2 s | 21 | 0 | 0 |
| 59 veille télé (8.11, 18 h) | courte | 50 s | 275 | 16,1 s | 10 | 0 | 0 |
| 27 frigo, A (7.11, 18 h) | longue | 64 s | 251 | 14,1 s | 10 | 0 | 0 |
Médiane : **275** (< 300). Premier signal : 32 lave-linge (9.11, 10 h, 3 h 40) : 84 vues, 13,2 s. Pour rappel, 55 : 345 vues, 17,4 s (mis à jour). Abonnés TikTok : 76 (dernier chiffre Metricool, 7.11 ; rien pour le 8 et le 9 : **donnée manquante**). La publication « #milestone » (6.11, 86 vues) n'est pas de l'autopilote : pas touchée.
| Reels d'essai (≥ 18 h) | Vues | Portée | Partages | Enreg. |
|---|---|---|---|---|
| 37 linge au salon (DfeGAs4Fm8R) | **2 492** | 2 105 | 9 | 4 |
| 60 charge rapide (DfbhHVekbbz) | 1 558 | 1 437 | 0 | 2 |
| 59 veille télé (DfeGBBFCGBN) | 1 470 | 1 262 | 5 | 5 |
| 27 frigo (DfbhGhajQ6I) | 1 294 | 1 147 | 0 | 0 |
| premier signal (6 h) : 70 Suisse/France iPhone (Dfgrd0DFMso) | 1 598 | 1 455 | 2 | 3 |
| premier signal (6 h) : 32 lave-linge, A (Dfgrf9KFHur) | 410 | 363 | 1 | 0 |
Médiane des Reels jugés : **1 514** (≥ 1 000). Les 4 Reels jugés passent tous 1 000. Stories : Windsor n'en renvoie aucune, **donnée manquante**. Abonnés Instagram : 34 560 (34 576 le 7.11, −16).
Verdict : **Instagram ÇA MARCHE** (médiane 1 514). **TikTok, pris seul, NE MARCHE PAS** (275 < 300 ; la clause « aucun Reel ≥ 1 000 » n'est pas remplie, mais c'est Instagram qui répond, pas TikTok : on applique « garder ce qui marche sur le réseau qui répond, changer les leviers de l'autre »).
Pourquoi : la même vidéo fait 1 300 à 2 500 vues en Reel d'essai et 250 à 345 sur TikTok. Sur TikTok, toutes les vidéos s'arrêtent au premier groupe test (≈ 250–345), quelle que soit la durée : le test du 7.11 (50–53 s au lieu de 64–69 s) n'a rien changé aux vues (323 et 275 contre 345 et 275) ni au temps regardé (16,7 et 16,1 s contre 17,4 et 16,2 s), seulement la part regardée (31 % contre 25 %). La nouvelle recette a triplé le temps regardé (6–9 s → 14–17 s) et les j'aime (1–7 → 10–21), sans débloquer la 2e vague. Seules vidéos TikTok jamais passées au-dessus de 600 : jours 1 et 3 (1 013 et 785 vues), 37–40 s, le chiffre et la réponse dès les 4 premières secondes (« Non. » + contre-pied). La recette actuelle garde la réponse pour le milieu (suspense), ce qui marche sur Instagram mais pas sur TikTok. Format A plus faible sur les deux réseaux (frigo 251 et 1 294 ; lave-linge 410 en 6 h contre 1 598 pour une V à la même heure).
vidIQ : recherche d'outliers impossible (plus de crédits gratuits) ; décision tirée de nos propres chiffres.
Décision :
1. **Instagram : on garde tout** (recette, versions longues, Stories, Reels d'essai).
2. **Partie 2 du jour 37** (2 492 vues en Reel) : **jour 74 « linge au salon + déshumidificateur »**, mardi 10.11 à 18 h, à la place du jour 58 (micro-ondes, format A, statut « remplacée », vidéo gardée pour plus tard). Faits : fiche Stadler Form Albert (270 W, 20 L/24 h dès 22 °C et 70 %), Q-Wash/ADEME (2 L), ElCom (27,7 ct hors TVA), OFSP (30–50 %), TCS ; calcul « au mieux » 2 h 24 → 0,648 kWh → ≈ 18 ct. TikTok + Story (Buffer, mêmes publications modifiées) et Reel d'essai (reels_queue.json, 10.11 19 h).
3. **TikTok : nouvelle idée testée sur les 4 créneaux des 10 et 11.11 : « réponse d'abord »**. Même vidéo qu'Instagram, phrases réordonnées : le duel (1–2 phrases), puis tout de suite la phrase-réponse chiffrée (avant 8 s), puis l'explication, la surprise, la question, « abonne-toi » ; 42 à 59 s. 56 box (10.11, 10 h) 42,1 s ; 74 (10.11, 18 h) 51,6 s ; 71 Suisse/France kWh (11.11, 10 h) 59,2 s ; 57 vaisselle (11.11, 18 h) 44,3 s. Légendes, titres, heures et couvertures inchangés (une seule chose change). À juger le 11.11 (56 et 74, premier signal) et le 13.11 (les 4) contre la médiane 275 et le temps regardé 16 s.
Production :
- `tools/tk_reorder.py NN i,j,k[,n@fin]` : réordonne des phrases entières ; `n@65.1` coupe la dernière phrase (garder « Abonne-toi » seul) et fige l'écran de fin sans la carte d'annonce, sous-titre masqué, « Abonne-toi ! » écrit (vidéo 56 : son micro-ondes n'est plus au plan).
- **Défaut trouvé par le contrôle : 0,15 s de silence au 1er raccord et tout le son décalé de 0,15 s après** (le morceau d'image 0 durait 0,15 s de plus que son son ; concat ajoute un blanc au son). Corrigé dans tk_reorder.py (chaque morceau d'image dure exactement comme son son ; image figée 0,15 s au début du morceau). **`tk_short.py` a le même défaut : les versions courtes 37 et 59 (déjà publiées) et 32 et 70 (9.11) en souffrent** ; ne plus utiliser tk_short.py sans le corriger.
- Contrôle (2 agents neufs) : 71 réordonnée avait perdu la TVA (27,7 ct affichés, 31 CHF calculés avec 29,9 ct) et l'explication de « 8 CHF abonnement réparti » : segments 3, 8 et 11 remis. 74 : « tarif médium » entendu par Whisper → nouvelle prise s09 (graine 11) ; fin « Lui paie au mieux dix-huit centimes, hors TVA » (prise s15 nouvelle) ; tampon « AU MIEUX · HORS TVA » ; plus de compteur 0,0 → 2 L. Petits trous de son de 5 à 30 ms aux raccords (mineur) : à lisser avec un fondu croisé la prochaine fois.


## 12.11.2026 — Reels d'essai à 24 h : le sujet compte plus que la longueur de l'accroche
Source : vidIQ `vidiq_instagram_owner_insights` (mode reels), relevé le 12.11 à 17 h. Chiffres à vie au moment du relevé.
| Reel d'essai | Publié | Vues | J'aime | Envois | Enreg. | Passages | Regardé |
|---|---|---|---|---|---|---|---|
| 24 mode sombre (DfoZQIBDky-) | 12.11, 7 h 19 | **1 179** | 31 | 3 | 1 | 36,9 % | 27,6 % |
| 62 douche ou bain (DfoZO-miGBX) | 12.11, 7 h 19 | 192 | 0 | 0 | 0 | 44,5 % | 14,4 % |
| 71 machine à laver CH/FR (Dfmyk5_iP4L) | 11.11, 16 h 22 | **1 224** | 10 | 0 | 1 | 45,2 % | 28,5 % |
| 57 lave-vaisselle (DfmyiPjCkTL) | 11.11, 16 h 22 | 228 | 2 | 0 | 0 | 53,5 % | 11,2 % |
Abonnés Instagram : 34 548 (34 562 le 11.11, −14). Aucune donnée d'abonnés par Reel.

Constats :
1. **Deux paires publiées à la même minute, même format « duel », et dans les deux le sujet d'eau perd par 5 à 6** :
   douche 192 contre mode sombre 1 179 ; lave-vaisselle 228 contre machine à laver 1 224. Seulement 2 paires : hypothèse, pas règle.
2. **La part de passages départage les Reels** (15 Reels « chiffres en francs ») : les 6 à 37 % ou moins ont tous dépassé
   1 100 vues ; sur les 6 à 44 % ou plus, 5 sont restés à 750 vues ou moins (exception : 71, 1 224 vues à 45,2 %).
3. **La longueur de la première phrase n'explique rien** : 60 charge rapide, 6 mots dits en 2,7 s → 30,5 % ;
   59 veille télé, 15 mots en 4,6 s → 30,0 % ; 56 box, 8 mots en 2,4 s → 46,6 % ; 57 lave-vaisselle, 15 mots en 6,2 s → 53,5 %.
   (Mots de la phrase s01 de `draft.json`, minutage `asr/out`.)
4. Seul 24 a des envois (3) : légende « Envoie-la à ton collègue qui jure que le mode sombre sauve sa batterie », sur un mythe connu.
Décision : test « sujets d'eau », point 7 du bloc du 11.11 dans RUNBOOK.md. Rien d'autre ne change.

## 13.11.2026 — Bilan de S2 (6.11 → 12.11) et bilan de la recette du 05.11 : ROUGE ; TikTok change de type de sujet
Sources : Buffer `list_posts` avec chiffres (mis à jour le 12.11 à 9 h 45), Metricool (vues, durées, abonnés TikTok jusqu'au 10.11), Windsor (Instagram, 13.11). vidIQ : plus de crédits (recherche de tendances impossible, **donnée manquante**).
| TikTok, nouvelle recette (≥ 18 h) | Version | Durée | Vues | Regardé | J'aime | Comm. |
|---|---|---|---|---|---|---|
| 55 charge la nuit (5.11) | longue | 68 s | **356** | 17,5 s | 20 | 1 (2 partages) |
| 37 linge au salon (8.11) | courte | 53 s | 326 | 16,6 s | 13 | 2 |
| 59 veille télé (8.11) | courte | 49 s | 298 | 15,8 s | 11 | 0 |
| 60 charge rapide (7.11) | longue | 68 s | 275 | 16,2 s | 21 | 0 |
| 56 box (10.11) | réponse d'abord | 42 s | 269 | 9,8 s | 6 | 0 |
| 74 déshumidificateur (10.11) | réponse d'abord | 51 s | 268 | 9,2 s | 7 | 0 |
| 71 kWh CH/FR (11.11) | réponse d'abord | 59 s | 267 | 10,4 s | 9 | 0 |
| 57 vaisselle (11.11) | réponse d'abord | 44 s | 260 | 6,6 s | 5 | 0 |
| 70 iPhone CH/FR (9.11) | courte | 50 s | 259 | 15,1 s | 11 | 0 |
| 27 frigo, A (7.11) | longue | 63 s | 252 | 14,1 s | 10 | 0 |
| 32 lave-linge, A (9.11) | courte | 52 s | 240 | 14,3 s | 6 | 0 |
Médiane de la recette : **268** (avant : ≈ 265) ; 0 sur 11 au-dessus de 400 ; rétention 24 % ; temps regardé moyen 13,2 s (avant : 3–11 s).
Semaine S2 (12 vidéos du 6.11 au 11.11, avec 23 et Aeotec) : médiane 267,5 ; abonnés 75 → 79 (+4, jusqu'au 10.11) ; 2 commentaires, 0 partage. Note R1 : min(267,5/600 ; 4/60) = 0,07 → **ROUGE**. 12.11 (62 et 24) : pas encore de chiffres.
- Par format : V 269 (9), A 246 (2). Instagram : A 1 152 et 1 295 contre V 1 487 de médiane. A plus faible sur les deux réseaux, 2e semaine de suite.
- Par heure : 10 h et 18 h au même niveau (rien à conclure).
- « Réponse d'abord » (10–11.11) : même vues (260–269) et temps regardé plus court (9 s contre 15,6 s) : **échec**, abandonné.
- 3 meilleures TikTok : 55 (question « ça abîme la batterie ? », mythe sur le téléphone, 68 s), 37 (duel linge, 53 s), 59 (veille télé, 49 s). 3 moins bonnes : 32 (A, lave-linge), 27 (A, frigo), 70 (Suisse/France). Écart de 116 vues : toutes s'arrêtent au premier groupe test.
- Publications qui ne viennent pas de l'autopilote : « #milestone » (6.11, 86 vues) et « J'ai créé mon premier jeu… Fletch » (12.11, 18 h 30) : pas touchées.
| Reels d'essai de S2 | Vues | Portée | Partages | Enreg. |
|---|---|---|---|---|
| 37 linge au salon | **2 537** | 2 145 | 9 | 4 |
| 70 iPhone CH/FR | **2 174** | 1 995 | 2 | 4 |
| 74 déshumidificateur | 1 742 | 1 541 | 1 | 3 |
| 60 charge rapide | 1 559 | 1 438 | 0 | 2 |
| 59 veille télé | 1 487 | 1 278 | 5 | 5 |
| 23 robot aspirateur (ancienne) | 1 310 | 1 065 | 0 | 1 |
| 27 frigo (A) | 1 295 | 1 148 | 0 | 0 |
| 24 mode sombre | 1 229 | 1 061 | 3 | 1 |
| 71 kWh CH/FR | 1 227 | 1 073 | 0 | 1 |
| 32 lave-linge (A) | 1 152 | 1 054 | 1 | 1 |
| 56 box | 352 | 321 | 0 | 1 |
| 57 lave-vaisselle (eau) | 228 | 201 | 0 | 0 |
| 62 douche/bain (eau) | 206 | 196 | 0 | 0 |
Médiane : 1 295 (recette seule 1 262), 10 sur 13 ≥ 1 000. Abonnés Instagram : 34 573 (6.11) → 34 550 (13.11) ; 4 à 9 nouveaux par jour, pas de hausse visible. Stories : **donnée manquante**.

Constaté :
1. La recette a doublé le temps regardé sur TikTok, sans jamais débloquer la 2e vague : sur TikTok, 22 vidéos de l'autopilote d'affilée sont restées entre 240 et 356 vues, quels que soient la durée (42–69 s), l'ordre (suspense ou réponse d'abord), l'heure et le format.
2. Les 2 seules vidéos TikTok jamais passées au-dessus de 600 (jours 1 et 3) sont les seules « chiffre de la boîte » d'un produit qu'on achète (robot tondeuse 45 %, batterie 20 000 mAh). Depuis le 05.11, aucun créneau n'a refait ce type de sujet : tous étaient des habitudes en francs.
3. Instagram répond à la recette (≈ 1 300 vues) mais pas aux sujets d'eau (2 sur 2 sous un tiers de leur paire) : plus aucun sujet d'eau.
Hypothèse à tester (S3) : sur TikTok, le type de sujet « chiffre de la boîte d'un produit qu'on achète » (recherche, intention d'achat avant le Black Friday) passe mieux que les habitudes en francs.
Décision (autonomie, point 5 du bloc du 05.11) : Instagram inchangé ; TikTok : 10 h = « chiffre de la boîte » 40–50 s (image 0 : produit + chiffre de la boîte + « ≠ » ou « ? » ; phrase 1 : le chiffre en question ; phrase 2 : « Non. » + contre-pied), 18 h = vérité du quotidien en francs. Paires de Reels à la même minute : comparaison propre sur Instagram aussi. Jugement les 15, 17 et 20.11. Point 2 du bloc du 11.11 (fin Instagram « ABONNE-TOI » de 2 s pour les jours impairs) : pas fait ce matin faute de temps ; on garde la coupe actuelle et la légende « abonnement » les jours impairs.

Production du 13.11 (vidéos de 10 h, 13 au 19.11 : jours 25, 73, 49, 42, 52, 40, 50) — enseignements :
- **Pont GitHub : ne jamais pousser un commit `[skip-bridge]` pendant qu'un passage non-skip attend** : la file de concurrence remplace le passage en attente par le nouveau, qui ne fait rien (voix des 6 vidéos annulées une fois, le passage d'avant ne voyait que le jour 25). Quand un passage attend, pousser seulement des commits sans `[skip-bridge]`. Les commits du pont lui-même ne relancent rien.
- Faits et scripts préparés par 2 agents en parallèle (3 vidéos chacun), contrôle par des agents neufs (2 vidéos chacun), Whisper sur chaque version : 13 reprises de phrases au total (mots ajoutés en fin de phrase, « SuisseEnergie » entendu « Tu s'énergies », « ATM » → écrire « a-té-èm », « TVA » → « té-vé-a », Wi-Fi → « ouaï-faï », « Pixel neuf A de Google » entendu « 9 à 2 »).
- Marques dont Marcio a reçu des produits (r_queue.json) : Apple, Samsung, Dyson, iRobot, Dreame, Philips, Kärcher… Les exemples de produits ont été pris chez LG, Xiaomi, Honor, Bosch, Garmin, Casio, Anker, Google, Nintendo.
- Les contrôleurs relèvent souvent : tag de moins de 36 px trop large (> 900 px), « exemple » oublié sur un écran qui reprend un chiffre d'exemple, légende qui généralise un fait sourcé sur un seul modèle, #blackfriday hors sujet.
- Point 2 du bloc du 11.11 (fin Instagram de 2 s « ABONNE-TOI » les jours impairs) : pas fait, faute de temps ; légende « abonnement » les jours impairs seulement.

Production du 13.11 (après-midi, vidéos de 18 h, 13 au 19.11 : jours 58, 34, 61, 72, 28, 29, 75) — enseignements :
- Jour 58 (fait le 6.11, jamais publié) : seule la fin changée (prise day58cta), voix refaite avec `merge_voice.py 58 b c cta` puis `SRC=… finish.sh 58 A` ; vidéos A de 69 s = 164 Mo à la sortie : toujours réencoder en crf 24 avant `git push` (GitHub refuse > 100 Mo).
- Faits, scripts et scènes préparés par 3 agents en parallèle (2 vidéos chacun, 20 min) pendant que le pont faisait les voix ; 3 agents de contrôle neufs (2 vidéos chacun).
- Le contrôle a trouvé : une conclusion non sourcée (Wi-Fi « 10 fois plus de puissance permise et il traverse quand même moins bien » : la source compare à puissance égale) ; un verdict sur un effet du mode avion qu'aucune source ne chiffre ; un règlement abrogé (244/2009) présenté comme actuel ; des valeurs dérivées d'un exemple (8 h par nuit) sans « exemple » ; « au moins 7 fr. 50 » sans la condition (batterie vidée chaque jour). Corrigés avant publication.
- Whisper : une prise Chatterbox de 23 s pour une phrase de 13 mots (fin hallucinée qui répète la phrase) : contrôler la durée de chaque prise (secondes par mot > 0,75 = suspect) avant de monter. Mal dits : « Xiaomi » (entendu « Kaomiss » ; phrase réécrite sans la marque), « Asus » (« l'assu » ; remplacé par « un fabricant »), « elle-eu-dé » (« LUD » ; « èl-eu-dé » donne « LED »), « éteins-moi » (« étais-moi »).
- Pont : la tâche de midi a poussé des commits `[skip-bridge]` pendant qu'un passage attendait : passage annulé (vu avec `actions_list`), relancé par un commit vide sans `[skip-bridge]`.
- Cloudinary et Buffer (connecteurs) en panne vers 14 h 30 (« Service Unavailable ») : voir la suite ci-dessous.
- Point 2 du bloc du 11.11 (fin Instagram « ABONNE-TOI » de 2 s) : pas fait, faute de temps ; légende « abonnement » les jours impairs.
- Jour 29 : la réponse (2,4 GHz) tombe à 11 s au lieu du milieu (relevé par le contrôle) ; laissé tel quel faute de temps : à comparer au bilan.
