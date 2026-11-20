# Contrôle qualité indépendant d'une vidéo (20.11.2026)

Tu n'as rien vu de la production. En français. **Ne modifie rien, ne fais ni commit ni push.**
Vidéo : /home/claude/studio/dayNN/dayNN_final.mp4 (1080×1920). Fichiers : /home/claude/marcio-mota-tech/autopilot/days/dayNN/
(facts.md, draft.json, scene.js), timeline : /home/claude/studio/dayNN/timeline_words.json (ou timeline.json), job voix :
autopilot/tts/cb_jobs/dayNN.json. Règles : autopilot/RUNBOOK.md, bloc du 05.11 (points 2 et 2 bis) et § 0.

Vérifie et rends une liste CRITIQUE / MAJEUR / MINEUR, avec pour chaque point la correction exacte (texte de remplacement) :
1. **Faits** : chaque phrase dite et chaque chiffre affiché correspondent à facts.md ET à la source (ouvre les 2–3 URL
   principales, recalcule tous les calculs). Aucune affirmation plus forte que la source ; valeur d'illustration marquée
   « exemple » à l'écran (≥ 40 px). Légendes `caption` et `reel_caption` de draft.json : mêmes exigences.
2. **Recette** : image 0 (t = 0) avec l'objet et le chiffre de la boîte en très gros + « ? » ou « ≠ » ; promesse ou
   question ouverte avant 10 s ; réponse vers le milieu ; 2e surprise ; question pour les commentaires ; fin « abonne-toi » ;
   50 à 70 s ; au moins 20 changements à l'écran (compte-les approximativement).
3. **Image** : extrais des images avec ffmpeg (par ex. une toutes les 2 s : `ffmpeg -i … -vf fps=0.5,scale=360:-1 /tmp/qcNN/%02d.jpg`,
   puis une planche) et regarde-les (Read). Zones sûres : rien d'important dans les 200 px du haut, 380 px du bas, ni à
   droite de x = 940 entre y = 800 et 1600 ; textes ≥ 36 px ; chevauchements ; sous-titres de 2 lignes max, synchrones,
   sans faute ; aucun logo de marque.
4. **Audio** : `ffmpeg -i … -af ebur128=peak=true -f null -` : environ −14 LUFS, crête ≤ −1 dBTP.
Sois bref et concret.
