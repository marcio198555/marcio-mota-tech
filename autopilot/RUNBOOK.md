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
- **Metricool** : ne jamais modifier ni supprimer les publications Instagram de Marcio.
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
5. Page « Autopilot TikTok Marcio » (https://claude.ai/artifact/CQgM5XPZHfUc79ymWhYdgB) : lire la page
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
1. Note de la semaine (R1) : score = min(médiane des vues / objectif, abonnés gagnés / objectif) ;
   VERT ≥ 1, ORANGE 0,5–1, ROUGE < 0,5.
2. VERT (R2) : on garde ; « suite » des 2 meilleures vidéos. ORANGE (R3) : une seule chose change (prochaine
   expérience de la réserve). ROUGE (R4) : plan suivant de l'échelle (A → B si rétention < 25 %, A → C si rétention
   ≥ 35 %, puis D) et on l'explique à Marcio.
3. Test de format (R5) : médiane ≥ 1,3 × l'autre sans rétention plus faible de plus de 10 points → 10 créneaux sur 14 ;
   perdant 2 semaines de suite → abandonné. Pépite (R6) : ≥ 3 × la médiane → « Partie 2 » + proposer de l'épingler.
4. Écrire la décision (learnings.md + `strategy.json`), puis planifier (§ 3) et produire.
5. Message à Marcio : la note de la semaine (VERT/ORANGE/ROUGE), le chiffre clé contre l'objectif, ce qui change.

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
