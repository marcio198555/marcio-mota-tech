# Autopilot TikTok @marcio.mota8 — procédure hebdomadaire (chaque vendredi)

Ce document est suivi par deux tâches programmées, chaque vendredi (heure de Zurich), qui démarrent chacune
dans une session neuve : tout ce qu'il faut savoir est ici, dans `strategy.json` (stratégie du mois, § 10),
`ENGINE.md`, `plan.json` et `learnings.md`.
- **5 h 37 — « Autopilot TikTok : bilan + 7 vidéos du matin (vendredi) »** : bilan de la semaine (§ 2), plan des
  14 créneaux de la semaine (§ 3), puis production et programmation des 7 vidéos de **10 h** (vendredi → jeudi).
- **11 h 37 — « Autopilot TikTok : 7 vidéos du soir (vendredi) »** : lit le plan fixé à 5 h 37 et produit les
  7 vidéos de **18 h** (vendredi → jeudi). Ne refait ni le bilan ni le plan, sauf si le plan du matin manque
  (alors : le faire d'abord, en suivant § 3).

**Rythme voulu par Marcio (27.10.2026)** : **2 vidéos par jour, à 10 h et 18 h**, soit 14 par semaine, toutes
produites par l'autopilote (aucune autre source de vidéos TikTok). Jamais plus de 7 jours d'avance.
Si Metricool contient des publications TikTok qui ne viennent pas de l'autopilote, ne pas y toucher et le
signaler à Marcio dans le message final.
**Objectif n° 1 : gagner des abonnés et des vues.** Chaque décision se juge à cette aune.
**Du 30.10 au 27.11.2026 : stratégie du mois (§ 10 et `strategy.json`)**, demandée par Marcio le 29.10 : chaque vendredi,
on mesure, on note la semaine (VERT / ORANGE / ROUGE) et on applique les règles ; si ça ne marche pas, on change de stratégie.

> **Changements du 03.11.2026 : ils priment sur le texte des tâches programmées** (« fais de ton mieux, avec les
> meilleurs outils », Marcio, 03.11.2026). Si la consigne d'une tâche dit autre chose, c'est ce bloc qui compte :
> 1. **Publication TikTok et Stories : Buffer**, plus Metricool (§ 8, partie Buffer), parce que Metricool gratuit
>    est limité à 20 publications par mois et que la limite de novembre est atteinte. Les tâches du vendredi
>    programment elles-mêmes dans Buffer tout ce qui tient (10 publications au plus par canal), dans l'ordre des
>    dates, et remplissent `post.json` (statut « prête ») pour le reste.
> 2. **Reels d'essai Instagram** : Buffer ne sait pas les faire et Metricool est à sa limite jusqu'au 1er décembre.
>    **Ils passent par vidIQ** (gratuit, Instagram relié par Marcio le 03.11 : compte 28790973810544181,
>    publishingAvailable true). Les tâches du vendredi produisent le Reel (`reel_cut.sh`, Cloudinary, légende
>    Instagram § 8.5b) et l'ajoutent à **`autopilot/reels_queue.json`** (id, prevu, video_url, caption,
>    isAiGenerated, statut « en attente »). La tâche de 7 h 13 publie chaque matin les entrées dues (aujourd'hui ou
>    avant, 3 au plus) : `vidiq_video_upload` (url = video_url, 0 crédit) puis `vidiq_instagram_publish_reel`
>    (platformAccountId 28790973810544181, `trialParams: {graduationStrategy: "SS_PERFORMANCE"}`, `isAiGenerated`
>    de l'entrée, légende), appels de suite jusqu'à PUBLISHED ; puis statut « publié », date et lien. Jamais deux
>    fois la même entrée, jamais un Reel normal.
> 3. **Images : les meilleurs outils gratuits** pour le format A (§ 11.6) : décors et personnages générés par IA,
>    animés par le moteur. Jamais de texte ni de chiffre dans une image IA : le moteur les écrit.
> 4. **Voix** : voir § 11.7.

## 0. Règles non négociables
- **Honnêteté** : aucune mesure inventée. Un chiffre affiché ou dit vient d'une source officielle
  (fabricant, Confédération, norme) ou d'un calcul exact montré à l'écran. Toute valeur d'illustration
  porte la mention « exemple » ou « valeur d'exemple » en grand (≥ 40 px, blanc 80 %). Jamais « j'ai testé »
  sans vraie mesure de Marcio.
- **Originalité** : on reprend la mécanique d'une vidéo virale (accroche, rythme, révélation), jamais ses
  images, son texte ou sa musique. Jamais un sujet déjà traité (voir `plan.json`), jamais un sujet repris
  des vidéos Instagram de Marcio.
- **Conformité TikTok** : `isAigc: true` (voix de synthèse) ; `commercialContentThirdParty: true` si un
  produit offert ou une marque partenaire apparaît ; pas de lien affilié sans programme réellement actif.
- **Outils gratuits uniquement.** Pas d'ElevenLabs gratuit (licence non commerciale).
- **Dépôt** : aucune commande destructive (pas de `rm -rf`, pas de réécriture d'historique, pas de force-push).
- **Metricool** : ne jamais modifier ni supprimer les publications Instagram de Marcio. Seule exception, demandée par
  Marcio le 01.11.2026 : on **ajoute** une Story Instagram pour chaque vidéo de l'autopilote (§ 8.5).
- **Format** : 1080×1920, 30 i/s, accroche lisible dès l'image 0, −14 LUFS, crête ≤ −1 dBTP.
  Format V (voix) : 18–25 s, sous-titres incrustés. Format T (texte seul) : 10–13 s, en boucle, sans voix (§ 10.4). Zones sûres : rien d'important dans les 200 px du haut, les 380 px du bas,
  ni à droite de x = 940 entre y = 800 et 1600.

## 1. Préparer
1. `add_repo` marcio198555/marcio-mota-tech (accès push), cloner dans /home/claude/marcio-mota-tech,
   `git fetch origin '+refs/heads/tiktok-autopilot:refs/remotes/origin/tiktok-autopilot'` puis `git switch tiktok-autopilot`.
2. Commits : terminer le message par `[skip-bridge]` sauf quand on veut lancer la synthèse vocale.
   Toujours committer avant `git pull --rebase origin tiktok-autopilot`.
3. Studio de travail : `/home/claude/studio/dayNN/` (hors dépôt). Bruitages : `python3 autopilot/audio/synth.py sfx /home/claude/studio/sfx`.
   Outils : `autopilot/tools/produce.sh NN` (sous-titres + rendu + musique + mixage → `/home/claude/studio/dayNN/dayNN_final.mp4`),
   `autopilot/tools/swap_end.py NN <job_voix> ["display"]` (remplace le dernier segment de voix en gardant les blancs),
   `autopilot/tools/build_page.py` (page de suivi). Après chaque vidéo, copier `timeline.json`, `cues.json` et `vo.wav`
   dans `autopilot/days/dayNN/studio/` pour pouvoir la refaire plus tard.
4. Vidéos déjà montées (ex. jours 6 et 7) : copier `autopilot/days/dayNN/studio/*` dans `/home/claude/studio/dayNN/`,
   écrire le job voix de la nouvelle fin (`tts/jobs/dayNNcta.json`, même id que le dernier segment), le synthétiser,
   puis `swap_end.py`, ajouter `{ next: [...] }` au `followCTA` de la scène, ajouter un repère `ui_pop` et `produce.sh NN`.

## 2. Bilan hebdo (avant toute production) — voir aussi § 10.2 (notes et règles de la stratégie du mois)
1. Metricool `getAnalyticsDataByMetrics`, blogId 6563196, du vendredi précédent à hier (Europe/Zurich) :
   - par vidéo (connecteur posts) : TKPO02 date, TKPO05 description, TKPO06 durée, TKPO07 vues, TKPO08 j'aime,
     TKPO09 commentaires, TKPO10 partages, TKPO11 portée, TKPO13 visionnage complet, TKPO15 temps moyen regardé,
     TKPO16 part « Pour toi », TKPO21 part recherche ;
   - compte (connecteur evolution) : TKEV07 abonnés, TKEV08 nouveaux abonnés, TKEV09 visites du profil.
   Certaines métriques peuvent manquer (compte personnel) : le noter, ne rien inventer.
2. Classer les vidéos par vues et par temps moyen regardé / durée (rétention). Relever ce qui distingue
   les meilleures : type d'accroche, sujet, durée, heure, présence d'un chiffre choc dans la 1re seconde.
3. Écrire dans `learnings.md` une section datée : chiffres clés, 3 à 5 enseignements (en séparant
   « constaté » et « hypothèse à tester »), et les décisions pour la semaine (sujets, accroches, durée,
   heure, hashtags, fin de vidéo). Garder un test A/B à la fois (ex. heure 10 h contre 18 h).
4. Visites du profil élevées mais peu d'abonnés → proposer à Marcio une bio plus claire (il la colle lui-même).
5. Stratégie du mois : calculer les 4 indicateurs de `strategy.json` (`kpi`) pour la semaine écoulée et pour chaque
   format (V, T…), appliquer les règles R1 à R7, puis remplir dans `strategy.json` la semaine écoulée (`resultat`,
   `verdict`, `decision`, `statut: "terminée"`), passer la suivante en `"en cours"` avec son `plan` et son `experience`,
   et ajouter une ligne au `journal` (date, verdict, décision en une phrase).

## 3. Choisir les 14 sujets (tâche de 5 h 37)
- Semaine S1 (30.10 → 5.11) : déjà planifiée le 29.10 dans `plan.json` (jours 10 à 22, champ `format`), à ne pas
  refaire ; seulement remplacer un sujet dont les faits ne tiennent pas. Jours 6 et 10 déjà produits et programmés.
- À partir de S2 : répartir les formats selon la règle R5 (gagnant 10 créneaux, perdant 4), en alternant les formats
  entre 10 h et 18 h ; noter `format` et `semaine` dans chaque entrée.
- Priorité (bilan du 29.10) : les pièges des fiches techniques et des emballages de produits qu'on achète
  (« le chiffre sur la boîte ment »), surtout avant le Black Friday. Les sujets abstraits ou de réglages ont fait
  3 à 10 fois moins de vues.
- Partir des entrées « idée » de `plan.json` et des enseignements ; remplacer celles qui ressemblent aux vidéos
  qui ont le moins marché. 2 ou 3 recherches web sur les formats TikTok tech / maison / gadgets qui marchent
  en ce moment (mécaniques : le calcul qui choque, la fonction cachée, le mythe démonté, le comparatif chiffré,
  « tu le fais mal depuis toujours »). Sujets utiles et vérifiables, ancrés Suisse quand c'est possible.
- Le sujet du vendredi 10 h est déjà annoncé à la fin de la vidéo du jeudi 18 h : vérifier `plan.json`
  (`annoncee: true`) et le garder.
- Écrire les 14 entrées de `plan.json` (une par créneau : `jour` = numéro de vidéo, `date`, `heure` « 10:00 » ou
  « 18:00 », sujet, mécanique, accroche, a_verifier, argent, `annonce` = sujet de la vidéo suivante, statut
  « à produire »), commit + push AVANT de produire : la tâche de 11 h 37 en dépend.
- Alterner les mécaniques dans la journée (ex. matin « mythe démonté », soir « calcul qui choque »).

## 4. Vérifier les faits
- Chaque point de `a_verifier` : WebSearch puis WebFetch sur la page officielle.
- Noter dans `autopilot/days/dayNN/facts.md` : fait | valeur | URL | statut. Sans source fiable : on reformule
  ou on change d'angle, on n'invente pas.

## 5. Écrire
- Format T : voir § 10.4 (pas de voix, pas de script).
- Script V (décision du bilan du 29.10) : **6 à 7 segments, 50 à 65 mots, 18 à 25 s**. Segment 1 = la révélation
  chiffrée (le chiffre choc ou le contre-pied), dite dès 0,12 s et lisible à l'image 0 avec le produit visible.
  Puis 3 à 4 segments d'explication, une phrase par idée. Pas de segment « envoie ça à… » (l'appel au partage
  va dans la description).
- **Dernier segment = annonce de la vidéo suivante** : vidéo de 10 h → « Et abonne-toi : ce soir, <sujet de
  18 h en curiosité>. » ; vidéo de 18 h → « Et abonne-toi : demain, <sujet du lendemain 10 h>. » (c'est la raison
  concrète de s'abonner). Carte de fin : `followCTA(..., { when: 'CE SOIR' ou 'DEMAIN', next: [ligne 1, ligne 2] })`.
  La vidéo du jeudi 18 h annonce celle du vendredi 10 h : marquer cette entrée `annoncee: true`.
- Nombres écrits en toutes lettres dans le texte dit (Piper les lit mieux).
- Job voix : `autopilot/tts/jobs/dayNN.json` (voix `fr_FR-tom-medium`, `length_scale` 0.88).
  On peut mettre plusieurs jours dans un seul push. Commit sans `[skip-bridge]` + push : le pont GitHub Actions
  (`.github/workflows/tiktok-bridge.yml`) synthétise la voix et la committe dans `autopilot/tts/out/dayNN/`
  (1 à 3 min). Attendre avec une boucle `until` sur `git fetch` puis `git pull --rebase`.
  Le pont saute un job déjà synthétisé (manifest présent) : pour refaire une prise, créer un **nouveau** job
  (ex. `day06cta2.json`), ne pas modifier l'ancien.
- Prononciation Piper (voix tom) : écrire « aïe-fone » pour iPhone dans le texte dit (sinon « i-fone »),
  garder « iPhone » dans `display`. Même logique pour tout nom de marque anglais : l'écrire comme il se prononce.

## 6. Monter
1. `python3 autopilot/assemble_vo.py autopilot/tts/out/dayNN <studio>/vo.wav <studio>/timeline.json --lead 0.12 --gap 0.1 [--gaps s02=0.3,…]`
2. Ajouter à chaque segment de timeline.json un champ `display` (sous-titre en chiffres : « 20 000 mAh », « 27,7 ct »).
   Un « | » dans `display` force un changement de carton (ex. « Abonne-toi : demain, | le piège des… »).
3. Sous-titres mot à mot : `python3 autopilot/captime.py --timeline timeline.json --vo vo.wav --out timeline_words.json`.
   Lire le rapport : chaque carton doit faire 2 lignes au plus et ne jamais couper une expression ; sinon
   ajouter des « | » dans `display` et relancer. Les unités, la ponctuation et « je mesure tout » restent collés automatiquement.
4. Scène `autopilot/days/dayNN/scene.js` avec le moteur (voir `ENGINE.md` et les jours 2 à 5 comme modèles).
   Fin de vidéo : `followCTA(ctx, t, S('sNN'), { next: ['ligne 1', 'ligne 2'] })` affiche la carte « DEMAIN ».
5. Images de contrôle : `node autopilot/render/render.js --scene … --timeline timeline_words.json --stills 0,2,5,… --stillsDir …`,
   faire une planche avec les zones interdites en rouge et la regarder (Read). Corriger : chevauchements,
   textes trop petits (≥ 36 px pour tout texte utile), zones sûres, valeurs d'exemple étiquetées.
6. Rendu : `node autopilot/render/render.js --scene … --timeline timeline_words.json --out silent.mp4`
7. Musique : `python3 autopilot/audio/synth.py bed bed.wav --duration <durée+0,4> --bpm 104 --seed 1NN` ;
   repères dans cues.json (whoosh à chaque changement de bloc, ui_pop quand la carte DEMAIN apparaît).
8. Mixage : `python3 autopilot/mix.py --video silent.mp4 --vo vo.wav --music bed.wav --music-db -17 --duck-db 9 --sfx cues.json --out final.mp4`
   (normalisation −14 LUFS + limiteur). Vérifier : `ffmpeg -i final.mp4 -af ebur128=peak=true -f null -`.

## 7. Contrôler
- Agent de contrôle qualité neuf (n'a rien vu de la production), un agent pour 2 à 3 vidéos : faits recalculés,
  image 0, lisibilité, zones sûres, sous-titres, audio, conformité, appel à l'action. Corriger tout défaut
  CRITIQUE ou MAJEUR, puis refaire le rendu.

## 8. Publier
**Depuis le 03.11.2026 : Buffer (gratuit) publie TikTok et les Stories ; Metricool ne garde que les Reels d'essai.**
Metricool gratuit = 20 publications par mois, tous réseaux confondus, compteur remis à zéro le 1er du mois ; limite
atteinte le 04.11. Buffer gratuit (connecteur « BUFFER », organisation « My organization » 6aea1a8cfdbf7224ffc79066) :
TikTok marcio.mota8 = canal 6aea1b96e29c69a1714dcae0, Instagram filipe_marcio1985 = canal 6aea1b6ce29c69a1714dc95c ;
**10 publications programmées au maximum par canal à la fois** (une place se libère à chaque publication) ;
Buffer ne fait PAS les Reels d'essai (types Instagram : post, story, reel).
- **TikTok** : `create_post` channelId TikTok, schedulingType automatic, mode customScheduled, dueAt
  « AAAA-MM-JJT10:00:00+01:00 », text = description (règles ci-dessous), assets [{video: {url: Cloudinary,
  metadata: {thumbnailOffset: 1200 (format T : 11000)}}}], metadata {tiktok: {title, isAiGenerated: true}}.
- **Story Instagram** : channelId Instagram, même chose avec assets [{video: {url: Story Cloudinary}}], pas de texte,
  metadata {instagram: {type: "story", shouldShareToFeed: false, isAiGenerated: true}}, 5 min après la vidéo TikTok.
- **Programmation au fil de l'eau** : la tâche quotidienne « Autopilot : programmation Buffer » programme chaque
  matin tout ce qui tombe dans les 3 jours suivants (vidéos prêtes dans plan.json) sans dépasser 10 par canal.
  Les tâches du vendredi produisent les vidéos, les mettent sur Cloudinary et remplissent `days/dayNN/post.json`
  (video_url, story_url, title, caption, cover_ms, heure) avec `statut: "prête"` ; elles ne programment rien
  chez Metricool pour TikTok ni pour les Stories.
- **Reels d'essai** : Metricool seulement, dans la limite de 20 publications par mois (dès le 1er décembre ; en
  novembre la limite est atteinte). Ne jamais publier un Reel normal à la place.
- Noter les ids Buffer dans plan.json (`buffer_id`, `story_instagram.buffer_id`).

Ancienne méthode (Metricool, jusqu'au 03.11) :
1. Copier la vidéo dans `media/dayNN_<slug>.mp4`, commit `[skip-bridge]`, push ; noter le hash du commit.
2. Cloudinary `upload-asset` depuis `https://raw.githubusercontent.com/marcio198555/marcio-mota-tech/<hash>/media/<fichier>`
   (public_id `tiktok-autopilot/dayNN_<slug>`).
3. Metricool `createScheduledPost` : blogId 6563196, providers tiktok, date prévue à l'heure retenue
   (10:00 ou 18:00 selon le créneau, Europe/Zurich), `tiktokData` : `title` (obligatoire), `isAigc: true`,
   `privacyOption: PUBLIC_TO_EVERYONE` ; `videoCoverMilliseconds` sur l'image d'accroche (≈ 1200) ;
   texte (depuis le 29.10) = la question que les gens tapent dans la recherche (« Pourquoi mon iPhone 256 Go n'a pas
   256 Go de libre ? ») + 1 phrase avec les mots-clés + « Enregistre-la avant d'acheter » + une question oui/non pour
   les commentaires + 4 à 6 hashtags précis, sans #fyp ni #pourtoi (un seul hashtag refusé fait disparaître toute
   la description : rester sur des mots simples, sans accent). Format T : terminer par « Demain 10 h : … » ou
   « Ce soir 18 h : … » (annonce de la vidéo suivante) et prendre la couverture sur l'image finale (toutes les lignes).
4. `statut: "programmée"` dans plan.json ; `autopilot/days/dayNN/post.json` (id Metricool, url, heure) ;
   `captions.json` ; commit + push.
5. **Story Instagram de chaque vidéo** (demande de Marcio, 01.11.2026 : « quand tu crées le contenu, mets-la en story
   aussi ») : `bash autopilot/tools/story.sh NN` → `media/stories/dayNN_story.mp4` (même vidéo + bandeau « PLUS DE
   VIDÉOS SUR TIKTOK · @marcio.mota8 » en bas). Commit + push, Cloudinary `upload-asset` depuis raw.githubusercontent
   (public_id `tiktok-autopilot/stories/dayNN_story`), puis Metricool `createScheduledPost` : providers
   [{network: instagram}], **5 minutes après la vidéo TikTok** (10:05 ou 18:05, Europe/Zurich), `text: ""` (une Story
   n'a pas de légende), `instagramData: {type: "STORY", isAiGenerated: true}`, autoPublish true. Noter l'id dans
   plan.json (`story_instagram`). Une Story par vidéo, jamais d'autre type de publication Instagram ici
   (les Reels d'essai sont gérés par la tâche « Autopilot Instagram » du lundi).
5b. **Reel d'essai Instagram de chaque vidéo** (demande de Marcio, 02.11.2026 : « au moins 2 contenus par jour sur TikTok
   et en Reels Instagram », « Reel d'essai, pas Reel normal ») : `bash autopilot/tools/reel_cut.sh NN` →
   `media/reels/dayNN_reel.mp4` (formats V et A : fin TikTok coupée ; regarder l'image de contrôle). Commit + push,
   Cloudinary (public_id `tiktok-autopilot/reels/dayNN_reel`), Metricool : providers [{network: instagram}],
   **1 h après la vidéo TikTok (11:00 ou 19:00)**, `instagramData: {type: "TRIAL_REEL", isAiGenerated: true}`,
   `videoCoverMilliseconds` 1200 (format T : 11000). Légende Instagram (pas celle de TikTok) : ligne 1 < 125 caractères
   avec le mot-clé dans les 55 premiers ; 1 à 2 paragraphes courts avec seulement les faits vérifiés et leurs sources ;
   un seul appel à l'action (enregistrer ou envoyer à quelqu'un) ; exactement 5 hashtags : sujet, catégorie, audience,
   #suisseromande, #jemesuretout. Jamais « Demain… », « Ce soir… », « abonne-toi », #fyp, #pourtoi. Noter l'id dans
   plan.json (`reel_instagram`). Story TikTok : impossible à automatiser (Marcio la fait lui-même depuis l'app).
6. Page « Autopilot TikTok Marcio » (https://claude.ai/artifact/CQgM5XPZHfUc79ymWhYdgB) : lire la page
   (Artifact read), téléverser chaque vidéo comme asset (Artifact publish `asset: true` + `url`), noter les
   `/_blob/<id>` dans `tools/assets.json` et les statuts/heures dans `tools/scheduled.json` (clé = numéro du jour),
   (`tools/build_page.py` lit `strategy.json` : semaine en cours, vidéos de la semaine, notes et règles), lancer
   `python3 autopilot/tools/build_page.py /home/claude/studio/autopilot.html`, vérifier la page à 390 px de large,
   puis republier ce fichier avec `url` = l'adresse de la page.

## 9. Message à Marcio
Court, en français : le chiffre clé de la semaine écoulée (vues, abonnés gagnés), ce qui a changé et pourquoi,
les 7 vidéos programmées (jour, heure, titre). Pas de jargon technique.

## 10. Stratégie du mois (30.10 → 27.11.2026) — `strategy.json`
Demande de Marcio (29.10) : « trouve les solutions pour cartonner, fais ça pendant 1 mois, chaque semaine analyse
les résultats et si ça ne marche pas change de stratégie ». `strategy.json` contient tout : point de départ, objectifs
par semaine, indicateurs, formats, règles, échelle des plans, réserve d'expériences, actions possibles de Marcio.

### 10.1 Semaines (production du vendredi au jeudi)
| Semaine | Dates | Bilan | Objectifs (médiane vues · rétention · abonnés gagnés) |
|---|---|---|---|
| S1 | 30.10 → 5.11 | ven. 6.11 | 400 · 35 % · +30 |
| S2 | 6.11 → 12.11 | ven. 13.11 | 600 · 40 % · +60 |
| S3 | 13.11 → 19.11 | ven. 20.11 | 900 · 40 % · +100 |
| S4 | 20.11 → 27.11 (Black Friday, 8 jours) | ven. 27.11 | 1 300 · 40 % · +150 |
Les objectifs sont des cibles, pas des promesses : ne jamais les présenter comme des résultats.

### 10.2 Chaque vendredi à 5 h 37 (après le bilan § 2)
Demande de Marcio (02.11.2026) : « après chaque semaine, tu fais une analyse du contenu, les statistiques, tout,
regarde ce qui a marché, ce qui n'a pas marché, et comme ça tu peux changer les choses ».
0. Analyse complète de la semaine, avant la note :
   - **TikTok** (Metricool, connecteurs posts et evolution) : par vidéo, vues, temps moyen regardé, visionnage complet,
     partages, enregistrements, commentaires ; abonnés gagnés sur la semaine.
   - **Instagram** (Windsor.ai `get_data`, connector instagram, account 17841468820761900, `last_14dT`) : Reels d'essai
     et Stories de la semaine (timestamp, media_permalink, media_product_type, media_reach, media_views, media_shares,
     media_saved), follower_count par jour, followers_count. Retrouver chaque publication par sa date et son heure (UTC).
   - **Contenu** : indicateurs de `strategy.json` globalement, par format (V / T / A), par heure, par type de sujet et
     par réseau ; comparer les 3 meilleures et les 3 moins bonnes vidéos (accroche de l'image 0, sujet, durée, format,
     rétention) ; écrire en clair « ce qui a marché » et « ce qui n'a pas marché », chiffres à l'appui (learnings.md).
   - Données manquantes : le dire, ne rien estimer.
1. Note de la semaine (R1) : score = min(médiane des vues / objectif, abonnés gagnés / objectif) ;
   VERT ≥ 1, ORANGE 0,5–1, ROUGE < 0,5.
2. VERT (R2) : on garde ; « suite » des 2 meilleures vidéos. ORANGE (R3) : une seule chose change (prochaine
   expérience de la réserve). ROUGE (R4) : plan suivant de l'échelle (A → B si rétention < 25 %, A → C si rétention
   ≥ 35 %, puis D) et on l'explique à Marcio.
3. Test de format (R5) : médiane ≥ 1,3 × l'autre sans rétention plus faible de plus de 10 points → 10 créneaux sur 14 ;
   perdant 2 semaines de suite → abandonné. Pépite (R6) : ≥ 3 × la médiane → « Partie 2 » + proposer de l'épingler.
4. Écrire la décision (learnings.md + `strategy.json`), puis planifier (§ 3) et produire.
5. Message à Marcio : la note de la semaine (VERT/ORANGE/ROUGE), le chiffre clé contre l'objectif (TikTok et
   Instagram), ce qui a marché, ce qui n'a pas marché, ce qui change et pourquoi.

### 10.3 Dates particulières
- **Vendredi 20.11** : les deux tâches produisent **8 vidéos chacune** (jusqu'au vendredi 27.11, Black Friday, inclus).
- **Vendredi 27.11 à 5 h 37 : bilan final du mois.** Pas de production. Bilan de S4 et du mois (départ → arrivée,
  ce qui a marché, ce qui n'a pas marché, recommandations), page mise à jour, message à Marcio avec la question
  « on continue ? ». Puis désactiver les deux tâches du vendredi (outil `update_trigger`, `enabled: false`) :
  « Autopilot TikTok : bilan + 7 vidéos du matin (vendredi) » et « Autopilot TikTok : 7 vidéos du soir (vendredi) ».
- **Vendredi 27.11 à 11 h 37** (si la tâche du soir tourne encore) : ne rien produire ; vérifier que le bilan final
  existe, sinon le faire ; désactiver les deux tâches ; message d'une phrase.

### 10.4 Produire une vidéo format T (texte seul, en boucle)
1. Sujet « écrit en gros → écrit en petit » : une affirmation de la fiche, de la boîte ou de la promo, et ce que
   disent les notes officielles du fabricant, la norme ou la loi. Chaque ligne « en petit » est une note réelle
   (citée ou fidèlement résumée) ou un calcul exact ; jamais une moquerie ou une accusation.
2. `autopilot/days/dayNN/texte.json` (modèle : `days/day10/texte.json`) : `chip` = « SOURCE : … » (la source est
   visible), `title` = [accroche en 2 à 3 mots forts, « en petit »] ou une autre accroche courte, 4 lignes au plus
   si un « en petit » fait 2 lignes (5 si toutes tiennent sur une ligne), `|` = retour à la ligne, ≤ 34 caractères
   par ligne, `cta` « 🔖 Enregistre-la avant d'acheter ».
3. `bash autopilot/tools/produce_texte.sh NN` → `/home/claude/studio/dayNN/dayNN_final.mp4` (rendu, bruitages,
   musique sans creux, mixage −14 LUFS). Images de contrôle :
   `node autopilot/render/render.js --scene scene_texte.js --timeline /home/claude/studio/dayNN/timeline.json --stills 0,1.2,5.8,9.4 --stillsDir …`
   (depuis `autopilot/render`), planche avec zones interdites, regarder.
4. Copier `timeline.json` et `cues.json` dans `autopilot/days/dayNN/studio/`. Publication comme § 8
   (`isAigc: true` : le texte est écrit par une IA ; couverture ≈ dernière seconde).

## 11. Format A « Les objets balancent » (dès S2 — demande de Marcio du 02.11.2026 : plus d'images, de personnages, d'animation)
Le format viral de 2026 « l'objet qui parle » (OpusClip, 2026 : objet avec visage, monologue sarcastique, 8–25 s),
appliqué à nos sujets : l'objet du sujet devient un personnage qui **balance ce qu'on écrit sur sa boîte**.
Tout est gratuit et libre : personnages dessinés dans le moteur (`render/characters.js`, objet `CHR`), images 3D de
personnes et de réactions (Fluent Emoji de Microsoft, licence MIT, `autopilot/assets/emoji3d/`, 84 images ; on peut en
ajouter : dépôt github.com/microsoft/fluentui-emoji, dossier `assets/<Nom>/3D/`), voix Piper montée (voix de personnage).
Ne jamais reprendre la vidéo, l'image, le texte ou la musique d'un autre créateur.
1. **Script** : 6–7 segments, 55–75 mots, 18–27 s. Segment 1 = l'objet dit le chiffre de sa boîte (« Ils ont écrit vingt-cinq
   mille pascals sur ma boîte. En énorme. »). Ton : sarcastique, vexé, complice ; parler à « tu ». Chaque fait = une source
   (fabricant, test indépendant, loi), dite à voix haute si c'est un avis (« Une testeuse de TechRadar… »). Dernier
   segment : « Abonne-toi : ce soir / demain, <l'objet suivant> balance sa boîte. » seulement si cette vidéo est
   au plan ; sinon « Abonne-toi : d'autres objets vont tout balancer. » Le chiffre de la boîte doit rester cohérent
   avec la conclusion (vidéo 23 : 25 000 Pa sur la boîte, « 10 000 Pa suffisent » selon la source). Prononciation : écrire les marques
   comme elles se disent (« Tèk Radar », « aïe-fone »), nombres en lettres.
2. **Voix** : job Piper comme § 5 (voix tom, length_scale 0.9), puis `assemble_vo.py … --lead 0.12 --gap 0.1`, puis
   `python3 autopilot/tools/voice_fx.py <studio>/vo.wav <studio>/timeline.json --factor 1.12` (voix de personnage, plus
   aiguë et plus rapide ; une seule fois), puis les champs `display` (nombres avec espace fine U+202F : « 25 000 Pa »).
3. **Scène** `days/dayNN/scene.js` (modèle : `days/day23/scene.js`) : `CHR.room` (salon), `CHR.camera` (zooms sur les mots
   forts), le personnage (`CHR.robotVacuum` ou un nouvel objet dessiné : l'ajouter à `characters.js` pour les vidéos
   suivantes, avec `CHR.face(...)` pour les yeux et la bouche), `CHR.box` (la boîte avec le chiffre, visible dès
   l'image 0), `CHR.emo` (personnes et réactions 3D), `CHR.bubble` (question d'un client), `CHR.gauge`, cartes et
   schémas (toujours « schéma » si pas de mesure). Humeur du visage par moment : `mood` neutre / malin / surpris / fache
   / content, regard `look` vers ce qui apparaît. Planche de contrôle comme § 6.5.
4. **Rendu** : repères sonores dans `<studio>/cues.json` (pop à chaque apparition, impact sur le mot fort, whoosh entre
   les plans), puis `bash autopilot/tools/produce_anime.sh NN` (sous-titres, bouche synchronisée, rendu, musique, mixage).
5. **Contrôle** : agent neuf (faits, image 0, lisibilité, zones sûres, bouche qui bouge quand l'objet parle). Pour
   vérifier la voix : copier `vo.wav` dans `autopilot/vo/dayNN_vo_fx.wav`, l'ajouter à `autopilot/asr/todo.txt`, push sans
   `[skip-bridge]` : le pont écrit la transcription Whisper dans `autopilot/asr/out/` ; corriger tout mot mal compris.
6. **Publication** : TikTok (§ 8), Story Instagram (§ 8.5), Reel d'essai Instagram (§ 8.5b).

### 11.6 Images IA : décors et personnages (depuis le 03.11.2026)
Demande de Marcio (03.11.2026) : « fais de ton mieux, avec les meilleurs outils », gratuits. Les images IA donnent le
décor et le personnage ; le moteur garde l'animation (caméra, rebonds, bouche synchronisée, clignements), les textes et
les chiffres. **Jamais de texte, de chiffre, de logo ni de marque réelle dans une image IA**, jamais le visage d'une
personne réelle, jamais l'image d'un autre créateur. La vidéo reste marquée contenu IA (isAigc / isAiGenerated).
Trois sources, toutes gratuites :
1. **Open source, sans limite (par défaut)** : Z-Image-Turbo (Tongyi-MAI, Apache 2.0) dans le pont GitHub (CPU, dépôt
   public = minutes gratuites). Un fichier `autopilot/img/jobs/<nom>.json` par image :
   `{"prompt": "...", "w": 576, "h": 1024, "steps": 8, "seed": 11, "cut": false}` ; push sans `[skip-bridge]` ;
   résultat dans `bridge/out/img/<nom>.png` (et `<nom>_cut.png`, fond transparent, si `"cut": true`). Un nom déjà fait
   n'est jamais refait (nouvelle version = nouveau nom). Le pont s'arrête après 45 min d'images : les images finies
   sont gardées, les autres partent au push suivant. Détourer une image existante : `autopilot/img/cut_todo.txt`
   (« chemin/entree.png nom_sortie »).
2. **Meilleurs modèles du moment, quota limité** : Cloudinary `generate-image` (déjà connecté ; plan gratuit = 50 crédits
   « Image Generation » par mois ; `gpt-image-2` = 3 crédits en 9:16 « 1K » et 6 crédits en carré « 1K » (mesuré le
   03.11.2026), n° 1 des votes à l'aveugle au 03.11.2026 ;
   aussi `nano-banana-2`, `seedream-5-pro`, `recraft-v4` pour l'illustration). Réservé aux personnages principaux
   (créés une fois, réutilisés) et aux couvertures. Toujours `target: {target_type: "temporary"}`, puis récupérer le
   fichier par le pont : ligne « nom.png URL » dans `bridge/urls.txt`, push sans `[skip-bridge]` → `bridge/out/nom.png`
   (le conteneur ne peut pas ouvrir les liens Cloudinary). Vérifier le solde avant (`get-usage-details`,
   `image_generation`) et garder 6 crédits de réserve.
3. **Hugging Face Spaces** (`dynamic_space`) : indisponible par ce connecteur (03.11.2026 : « invoke is disabled because
   gradio=none is set », même après le réglage de Marcio). Ne pas compter dessus ; le pont GitHub fait le même travail.
Licences interdites (non commerciales ou « recherche ») : Qwen-Image 2.1, FLUX.2 [klein] 9B, FLUX.2 [dev],
FLUX.1 [dev] et Krea. ElevenLabs gratuit : interdit (pas d'usage commercial).
**Prompts** (en anglais) : même style pour toute la série : « stylized 3D animated film look, Pixar-like render, soft
light » ; toujours « no text, no letters, no logo ». Décor 9:16 (576×1024) avec « empty floor space in the lower half ».
Personnage : « full body, centered, isolated on a plain pure white background », 768×768, `"cut": true`, avec de grands
yeux et une petite bouche fermée (le moteur dessine la bouche qui parle par-dessus).
Temps mesuré (03.11.2026, pont GitHub, CPU) : environ 12 à 13 minutes par image Z-Image-Turbo (Q6_K, 8 étapes),
donc 3 images par passage du pont : préparer les images tôt et réutiliser la bibliothèque.
**Bibliothèque** : `python3 autopilot/tools/ai_asset.py <image> <nom>` range l'image dans `autopilot/assets/ai/<nom>.png`
(un personnage détouré est recadré sur ses bords pour que sa base touche le sol) ; noms courts et stables :
`decor_salon`, `perso_robot`) ; noter chaque image dans `autopilot/assets/ai/SOURCES.md` (modèle, licence, prompt,
seed, date). Réutiliser un décor ou un personnage déjà fait avant d'en générer un nouveau.
**Scène** : `SCENE.load = () => Promise.all([CHR.load([...]), CHR.loadArt(['decor_salon', 'perso_robot'])])`, puis
`CHR.backdrop(ctx, t, 'decor_salon', {blur: 1.5, z0: 1.04, z1: 1.14, focus: [0.5, 0.65]})` et
`CHR.art(ctx, 'perso_robot', 540, 1330, 560, t, {mouth: [mx, my, mw], eyes: [[ex, ey, rx, ry], …], skin, lid, t0})`
(bouche et yeux en fraction de l'image : les mesurer sur l'image détourée et les noter dans SOURCES.md).
Modèle de scène : `autopilot/days/_ai_demo/scene.js`.

### 11.7 Voix (03.11.2026)
- **Par défaut : Piper** (voix tom, § 11.2 : `assemble_vo.py`, puis `voice_fx.py --factor 1.12`).
- **Essai Chatterbox Multilingual** (Resemble AI, licence MIT, filigrane audio Perth inaudible qui signale une voix de
  synthèse) dans le pont GitHub : un fichier `autopilot/tts/cb_jobs/<job>.json` (même liste de segments que Piper,
  `"lang": "fr"`, `"ref"` optionnel = voix de référence d'environ 10 à 15 s, `"exaggeration"`, `"cfg"`, `"seed"`) ;
  sortie `autopilot/tts/out/<job>/` au même format que Piper (manifest.json, un WAV par segment), donc
  `assemble_vo.py` et la suite marchent sans changement. Compter environ 1 minute de calcul par phrase.
  Essais du 03.11 : `cbtest_noref` (voix par défaut) et `cbtest_tomref` (référence `tts/refs/tom_ref.wav` = timbre
  Piper), transcription Whisper dans `asr/out/cbtest_*.json`.
- On passe à Chatterbox seulement quand Marcio a choisi une version après écoute (vidéo d'essai envoyée le 03.11) ;
  noter son choix dans `learnings.md`. Toujours vérifier chaque voix par la transcription Whisper (§ 11.5).
