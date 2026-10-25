# Autopilot TikTok @marcio.mota8 — procédure quotidienne

Ce document est suivi par la tâche programmée « Autopilot TikTok : vidéo du lendemain ».
Chaque exécution démarre dans une session neuve : tout ce qu'il faut savoir est ici.

## 0. Règles non négociables
- **Honnêteté** : aucune mesure inventée. Un chiffre affiché ou dit vient d'une source officielle
  (fabricant, Confédération, norme) ou d'un calcul exact montré à l'écran. Toute valeur d'illustration
  porte la mention « exemple » en grand (≥ 36 px). Jamais « j'ai testé » sans vraie mesure de Marcio.
- **Originalité** : on reprend la mécanique d'une vidéo virale (accroche, rythme, révélation), jamais ses
  images, son texte ou sa musique. Pas de sujets déjà traités (voir `plan.json` et la liste d'exclusion).
- **Conformité TikTok** : `isAigc: true` (voix de synthèse) ; `commercialContentThirdParty: true` si un
  produit offert ou une marque partenaire apparaît ; pas de lien affilié sans programme réellement actif.
- **Format** : 1080×1920, 30 i/s, 30–40 s, accroche lisible dès l'image 0, sous-titres incrustés,
  −14 LUFS, crête ≤ −1 dBTP. Zones sûres : rien d'important dans les 200 px du haut, les 380 px du bas,
  ni à droite de x = 940 entre y = 800 et 1600.

## 1. Préparer
1. `add_repo` marcio198555/marcio-mota-tech (accès push), cloner dans /home/claude/marcio-mota-tech,
   `git fetch origin tiktok-autopilot` puis `git switch tiktok-autopilot`.
2. Lire `autopilot/plan.json` : prendre le premier jour dont la date est ≥ demain et dont le statut
   n'est pas « programmée ». Vérifier dans Metricool (`getScheduledPosts`, blogId 6563196,
   Europe/Zurich) qu'aucune publication TikTok n'existe déjà à cette date.

## 2. Vérifier les faits
- Chercher chaque point de `a_verifier` (WebSearch puis WebFetch sur la page officielle).
- Noter dans `autopilot/days/dayNN/facts.md` : fait | valeur | URL | statut. Sans source fiable : on
  reformule ou on change d'angle, on n'invente pas.

## 3. Écrire
- Script : 9 à 11 segments, 85 à 105 mots, 30 à 38 s. Segment 1 = l'accroche (le chiffre ou le contre-pied).
  Avant-dernier segment = appel à commenter, enregistrer ou partager. Dernier = « Et abonne-toi : je mesure tout. »
- Nombres écrits en toutes lettres dans le texte dit (Piper les lit mieux).
- Job voix : `autopilot/tts/jobs/dayNN.json` (voix `fr_FR-tom-medium`, `length_scale` 0.88).
- Commit + push : le pont GitHub Actions (`.github/workflows/tiktok-bridge.yml`) synthétise la voix et
  la committe dans `autopilot/tts/out/dayNN/` (1 à 3 min). Attendre avec une boucle `until` sur `git fetch`.

## 4. Monter
1. `python3 autopilot/assemble_vo.py autopilot/tts/out/dayNN <studio>/vo.wav <studio>/timeline.json --lead 0.12 --gap 0.1`
2. Ajouter à chaque segment de timeline.json un champ `display` (sous-titre en chiffres : « 20 000 mAh », « 27,7 ct »),
   avec des espaces insécables fines (U+202F) entre nombre et unité.
3. Écrire la scène `autopilot/days/dayNN/scene.js` avec le moteur (voir `ENGINE.md` et les jours 1 à 7 comme modèles).
4. Images de contrôle : `node autopilot/render/render.js --scene … --timeline … --stills 0,2,5,… --stillsDir …`,
   faire une planche et la regarder (Read). Corriger : chevauchements, textes trop petits, zones sûres.
5. Rendu : `node autopilot/render/render.js --scene … --timeline … --out silent.mp4`
6. Musique et bruitages : `python3 autopilot/audio/synth.py bed bed.wav --duration <durée+0,4> --bpm 104 --seed <jour>`
   et `python3 autopilot/audio/synth.py sfx <dossier>` ; repères dans cues.json (whoosh à chaque changement de bloc).
7. Mixage : `python3 autopilot/mix.py --video silent.mp4 --vo vo.wav --music bed.wav --music-db -17 --duck-db 9 --sfx cues.json --out final.mp4`

## 5. Contrôler
- Agent de contrôle qualité neuf (n'a rien vu de la production) : faits recalculés, image 0, lisibilité,
  zones sûres, sous-titres, audio (ebur128), conformité, appel à l'action. Corriger tout défaut CRITIQUE ou MAJEUR.

## 6. Publier
1. Copier la vidéo dans `media/dayNN_<slug>.mp4`, commit `[skip-bridge]`, push ; noter le hash du commit.
2. Cloudinary `upload-asset` depuis `https://raw.githubusercontent.com/marcio198555/marcio-mota-tech/<hash>/media/<fichier>`
   (public_id `tiktok-autopilot/dayNN_<slug>`).
3. Metricool `createScheduledPost` : blogId 6563196, réseau tiktok, date du jour prévu à 10:00 Europe/Zurich,
   `tiktokData.title` obligatoire, `isAigc: true`, description = 2-3 phrases + question + 8 à 10 hashtags
   (niche + génériques, dont #apprendresurtiktok #pourtoi #fyp).
4. Mettre `statut: "programmée"` dans plan.json ; écrire `autopilot/days/dayNN/post.json` ; commit + push.
5. Page « Autopilot TikTok Marcio » (https://claude.ai/artifact/CQgM5XPZHfUc79ymWhYdgB) : lire la page,
   téléverser la vidéo comme asset, ajouter la carte du jour dans les données, republier.

## 7. Apprendre (le lundi)
- Metricool `getAnalyticsDataByMetrics` réseau tiktok, connecteur posts : vues, durée de visionnage, partages,
  enregistrements, commentaires des 7 derniers jours.
- 3 enseignements → ajuster les sujets et les accroches des 7 jours suivants dans plan.json.

## 8. Message à Marcio
Deux phrases maximum : la vidéo programmée (titre, jour, heure) et, le lundi, le chiffre clé de la semaine.
