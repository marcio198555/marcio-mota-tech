# Autopilot TikTok @marcio.mota8 — procédure hebdomadaire (chaque vendredi)

Ce document est suivi par la tâche programmée « Autopilot TikTok : bilan + 7 vidéos de la semaine (vendredi) »
(chaque vendredi à 5 h 37, heure de Zurich). Chaque exécution démarre dans une session neuve : tout ce qu'il
faut savoir est ici, dans `ENGINE.md`, `plan.json` et `learnings.md`.

**Rythme voulu par Marcio** : une vidéo par jour. Chaque vendredi : bilan de la semaine écoulée, puis
production et programmation des 7 vidéos du vendredi au jeudi suivant. Jamais plus de 7 jours d'avance.
**Objectif n° 1 : gagner des abonnés et des vues.** Chaque décision se juge à cette aune.

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
- **Format** : 1080×1920, 30 i/s, 30–40 s, accroche lisible dès l'image 0, sous-titres incrustés,
  −14 LUFS, crête ≤ −1 dBTP. Zones sûres : rien d'important dans les 200 px du haut, les 380 px du bas,
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

## 2. Bilan hebdo (avant toute production)
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

## 3. Choisir les 7 sujets
- Partir des entrées « idée » de `plan.json` et des enseignements ; remplacer celles qui ressemblent aux vidéos
  qui ont le moins marché. 2 ou 3 recherches web sur les formats TikTok tech / maison / gadgets qui marchent
  en ce moment (mécaniques : le calcul qui choque, la fonction cachée, le mythe démonté, le comparatif chiffré,
  « tu le fais mal depuis toujours »). Sujets utiles et vérifiables, ancrés Suisse quand c'est possible.
- Le sujet du vendredi est déjà annoncé à la fin de la vidéo du jeudi : vérifier `plan.json` (`annoncee: true`)
  et le garder.
- Mettre à jour les 7 entrées de `plan.json` (date, sujet, mécanique, accroche, a_verifier, argent, statut « à produire »).

## 4. Vérifier les faits
- Chaque point de `a_verifier` : WebSearch puis WebFetch sur la page officielle.
- Noter dans `autopilot/days/dayNN/facts.md` : fait | valeur | URL | statut. Sans source fiable : on reformule
  ou on change d'angle, on n'invente pas.

## 5. Écrire
- Script : 9 à 11 segments, 85 à 105 mots, 30 à 38 s. Segment 1 = l'accroche (le chiffre ou le contre-pied),
  dite dès 0,12 s. Avant-dernier segment = appel à commenter, enregistrer ou partager.
- **Dernier segment = annonce du lendemain** : « Et abonne-toi : demain, <sujet du lendemain formulé en
  curiosité>. » (c'est la raison concrète de s'abonner). La vidéo du jeudi annonce celle du vendredi suivant :
  marquer cette entrée `annoncee: true` dans `plan.json`.
- Nombres écrits en toutes lettres dans le texte dit (Piper les lit mieux).
- Job voix : `autopilot/tts/jobs/dayNN.json` (voix `fr_FR-tom-medium`, `length_scale` 0.88).
  On peut mettre plusieurs jours dans un seul push. Commit sans `[skip-bridge]` + push : le pont GitHub Actions
  (`.github/workflows/tiktok-bridge.yml`) synthétise la voix et la committe dans `autopilot/tts/out/dayNN/`
  (1 à 3 min). Attendre avec une boucle `until` sur `git fetch` puis `git pull --rebase`.

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
   (10:00 par défaut, Europe/Zurich), `tiktokData` : `title` (obligatoire), `isAigc: true`,
   `privacyOption: PUBLIC_TO_EVERYONE` ; `videoCoverMilliseconds` sur l'image d'accroche (≈ 1200) ;
   texte = 2-3 phrases avec les mots que les gens tapent dans la recherche + question + 8 à 10 hashtags
   (niche + génériques, dont #apprendresurtiktok #pourtoi #fyp).
4. `statut: "programmée"` dans plan.json ; `autopilot/days/dayNN/post.json` (id Metricool, url, heure) ;
   `captions.json` ; commit + push.
5. Page « Autopilot TikTok Marcio » (https://claude.ai/artifact/CQgM5XPZHfUc79ymWhYdgB) : lire la page
   (Artifact read), téléverser chaque vidéo comme asset (Artifact publish `asset: true` + `url`), noter les
   `/_blob/<id>` dans `tools/assets.json` et les statuts/heures dans `tools/scheduled.json` (clé = numéro du jour),
   adapter `tools/build_page.py` (titre de la semaine, plage de jours `range(...)`), lancer
   `python3 autopilot/tools/build_page.py /home/claude/studio/autopilot.html`, vérifier la page à 390 px de large,
   puis republier ce fichier avec `url` = l'adresse de la page.

## 9. Message à Marcio
Court, en français : le chiffre clé de la semaine écoulée (vues, abonnés gagnés), ce qui a changé et pourquoi,
les 7 vidéos programmées (jour, heure, titre). Pas de jargon technique.
