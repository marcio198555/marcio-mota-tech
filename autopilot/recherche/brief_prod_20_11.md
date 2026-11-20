# Brief de préparation — vidéos de 10 h de S4 (20.11.2026)

Tu prépares des vidéos TikTok/Instagram (format V, 100 % sans visage) pour l'autopilote de Marcio.
Dépôt : /home/claude/marcio-mota-tech (branche tiktok-autopilot). **Ne fais NI commit NI push** : le coordinateur s'en charge
(pousser ferait tourner le pont GitHub au mauvais moment). Tout en français.

## À lire d'abord (rapidement)
- `autopilot/RUNBOOK.md` : bloc du 05.11 (point 2 et 2 bis = la recette), § 0 (règles), § 4–6, § 11.7 (voix Chatterbox).
- Modèle complet à copier : `autopilot/days/day50/` (facts.md, draft.json, scene.js, make_cues.py) et `autopilot/tts/cb_jobs/day50.json`.
  Autre modèle : `autopilot/days/day55/`. Moteur : `autopilot/ENGINE.md`, `autopilot/render/engine.js`, `autopilot/render/kit.js`.
- Entrée de ta vidéo dans `autopilot/plan.json` (champ `jour`) : sujet, accroche, a_verifier, annonce.

## Pour CHAQUE vidéo NN, produire
1. `autopilot/days/dayNN/facts.md` : tableau fait | valeur | URL | statut, puis les calculs refaits. **Sources officielles
   seulement** (fabricant, Confédération/OFEN/ElCom/SuisseEnergie/BNS/OFDF, norme, organisme). Vérifie chaque chiffre en
   lisant la page (WebSearch/WebFetch ou outils de recherche dispo). Aucun chiffre de mémoire, aucun chiffre inventé ; une
   valeur d'illustration est marquée « exemple ». Tarif électricité : médiane ElCom 2026, 27,7 ct/kWh hors TVA (déjà utilisée).
   **Marques interdites** (produits reçus par Marcio, voir `autopilot/r_queue.json`) : Apple (sauf prix officiels pour la
   série Suisse/France), Samsung, Dyson, iRobot, Dreame, Philips, Kärcher, Sony (à vérifier dans r_queue), et toute marque de
   r_queue.json. Préférer : Xiaomi (mais Whisper prononce mal « Xiaomi » : éviter de le dire), Anker, Bosch, LG, Google,
   Garmin, Casio, Segway, Ninebot, JBL, Sandisk, Kingston, Crucial, Nitecore, Fenix, Levoit, Blueair…
2. `autopilot/tts/cb_jobs/dayNN.json` : même forme que day50.json (engine chatterbox, ref tom_ref.wav, seed 7…).
   **Recette** : 13 à 16 segments (s01…), **150 à 170 mots** au total (vidéo chiffrée : viser 150–165), 50 à 70 s.
   - s01 (dit à 0,12 s) : le chiffre de la boîte en question, adressé à « tu », ou un duel « toi / ton collègue » ;
     s02 : « Non. » + contre-pied OU une question ouverte ; avant 10 s une promesse (« à la fin, tu sauras… ») ;
     la réponse vers le milieu ; une 2e surprise ; 1 conseil avant d'acheter ; une question pour les commentaires
     (« Écris … en commentaire. ») ; dernier segment = « Et abonne-toi : ce soir, <sujet de l'annonce en curiosité>. »
   - Nombres en toutes lettres dans le texte dit. Marques écrites comme elles se prononcent (« Ankeur », « Djé-bé-èl »,
     « ouaï-faï »). Sigles : « té-vé-a », « a-té-èm ». Chaque phrase dit exactement ce que dit la source, pas plus
     (« jusqu'à », « selon le fabricant », « peut »). Pas de classement non sourcé.
3. `autopilot/days/dayNN/draft.json` : comme day50 : `display` (sous-titre par segment, chiffres écrits « 100 W »,
   espace fine U+202F dans les milliers, « | » pour couper en cartons de 2 lignes max), `title` (≤ 60 car.), `slug`,
   `format` "V", `caption` (TikTok : 1re ligne = phrase-choc avec le produit ; 1–2 phrases avec la vraie valeur et la
   source ; une question précise ; 3–5 hashtags précis, #blackfriday autorisé jusqu'au 27.11 si pertinent ; jamais #fyp,
   #pourtoi, #viral, « like si » ; finir par « Voix de synthèse. »), `reel_caption` (Instagram, § 8.5b du RUNBOOK :
   ligne 1 < 125 car. avec mot-clé, 1–2 paragraphes de faits sourcés, « Voix de synthèse. », un seul appel :
   jours PAIRS du mois → « Envoie-la à <quelqu'un de précis>. » ; jours IMPAIRS → « Abonne-toi : chaque jour, un chiffre
   vérifié sur les objets de ta maison. » ; exactement 5 hashtags dont #suisseromande #jemesuretout ; jamais « ce soir »,
   « demain », #fyp).
4. `autopilot/days/dayNN/scene.js` : scène du moteur, en copiant les briques de day50/day55 (KIT : pop, stamp, panel, big,
   line, tag, calc, battery, head, comment ; ENG.followCTA en fin avec { when: 'CE SOIR', next: [ligne1, ligne2] }).
   Image 0 (t = 0) : l'objet dessiné + le chiffre de la boîte en très gros (≥ 160 px) + « ? » ou « ≠ », lisible.
   **Un changement à l'écran toutes les 2 s environ (≥ 20 sur la vidéo)**, un bloc par segment (`block(ctx,t,S('sXX'),S('sYY'),…)`).
   Zones sûres : rien d'important dans les 200 px du haut, 380 px du bas, ni à droite de x = 940 entre y = 800 et 1600.
   Texte utile ≥ 36 px. Toute valeur d'exemple porte « exemple » (≥ 40 px). Ne dessine aucun logo de marque.
   Emoji 3D disponibles : `ls autopilot/assets/emoji3d/`.
5. `autopilot/days/dayNN/make_cues.py` : comme day50 (3 ids de segments où mettre un repère fort).
6. **Test de la scène sans voix** : `python3 autopilot/tools/fake_tl.py` (lis son en-tête pour l'usage) produit une timeline
   factice depuis le job ; puis depuis `autopilot/render` :
   `node render.js --scene ../days/dayNN/scene.js --timeline <tl.json> --stills 0,3,8,15,25,35,45 --stillsDir /tmp/stillsNN`
   et regarde les images (Read) : corrige chevauchements, débordements, zones sûres. Pas d'erreur JS.

## Carrousel TikTok (seulement si on te le demande pour ta vidéo)
Script `autopilot/tools/carouselNN.py` en copiant `autopilot/tools/carousel75.py` (sans image IA : fond sombre uni ou
dessin simple ; texte et chiffres écrits par le script) : 6 à 8 images 1080×1920 ; image 1 = l'objet + la question en très
gros ; une image par chiffre (chiffre ≥ 140 px, source en petit) ; image verdict ; dernière image = question pour les
commentaires + « Abonne-toi ». Rien sous y = 1500 ni au-dessus de y = 230. Lance-le vers /home/claude/studio/carNN/ et
regarde les images. Écris aussi dans draft.json un champ `carousel_caption` : 1re ligne = la question + « Glisse jusqu'au
verdict », puis sources, question, 3–5 hashtags, et `carousel_title`.

## Rendu final attendu dans ton message de fin (court)
Pour chaque vidéo : nombre de segments et de mots, les 3 sources principales, toute réserve (fait non trouvé → sujet
reformulé). Aucun chiffre non vérifié.
