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
**Du 30.10 au 5.12.2026 (prolongée le 05.11) : stratégie du mois (§ 10 et `strategy.json`)**, demandée par Marcio le 29.10 : chaque vendredi,
on mesure, on note la semaine (VERT / ORANGE / ROUGE) et on applique les règles ; si ça ne marche pas, on change de stratégie.

> **Changements du 05.11.2026 : ils priment sur tout le reste (blocs du 04.11 et du 03.11, sections plus bas, texte
> des tâches).** Marcio (05.11, 8 h 48) : « je n'ai pas de vues, je pense que ça ne marche pas, tu ne peux pas revoir ta
> stratégie ? ». Constat chiffré (Buffer + Metricool, 05.11 ; 20 vidéos de l'autopilote du 25.10 au 4.11) :
> - 16 sur 20 entre 246 et 293 vues (le premier groupe test de TikTok) ; temps moyen regardé : 3 à 11 s.
> - Seules 2 vidéos sont sorties, toutes deux **format V long « chiffre-piège de fiche technique »** : jour 1
>   « 45 % de pente ≠ 45° » (37 s, 1 013 vues, 12 s regardées en moyenne) et jour 3 « 20 000 mAh ≠ 5 recharges » (40 s,
>   785 vues, 27 j'aime). Sur les 3 vidéos V de 35–40 s de ce type, 2 sont sorties ; aucune des 5 vidéos T (11 s) ni
>   des vidéos V de 21–23 s.
> - Jamais sortis : format T « ce que la marque écrit en petit » (246–284 vues, 3 à 5 s regardées), loi suisse, conseils
>   sans produit (aération, bouilloire, applis). Format R (1er essai, Roomba, 4.11 à 18 h : produit reçu, présentation de
>   marque) : 79 vues après 16 h. L'aide de Buffer déconseille les modèles presque identiques publiés en série.
> **Choix de Marcio (05.11, 9 h)** : « 2 chiffres-pièges par jour » (100 % automatique, rien à déclarer) ; il ne filme
> pas de mesures (« Non, pas le temps ») ; image de fin TikTok dans les Stories (« Oui, ajoute-la »).
> 1. **Rythme dès le 7.11 : 2 vidéos créées par jour, à 10 h ET à 18 h, toutes les deux « chiffre-piège »** (plus de
>    format R, § 12 en pause). 5 h 37 : bilan, plan des 14 créneaux, 7 vidéos de 10 h. 11 h 37 : les 7 vidéos de 18 h,
>    avec la même recette. Sleepal (5.11, 18 h) et Aeotec (6.11, 18 h) sont les derniers essais R : les comparer au bilan.
>    Chaque vidéo a de nouveau sa Story (5 min après) et son Reel d'essai (vidIQ), aux deux créneaux.
> 2. **La recette** — copier la structure des jours 1 et 3 (`days/day01/timeline_words.json`,
>    `days/day03/studio/timeline_words.json`) :
>    - **Sujet** : un chiffre écrit sur la boîte, la fiche ou la pub d'un produit que beaucoup de gens ont, et qui trompe.
>      Pistes : batterie externe (mAh), montre « étanche 50 m » (5 ATM), lampe torche (lumens), enceinte (W crête et
>      W RMS), aspirateur robot (Pa), chargeur (W), appareil photo (Mpx), écran (ms, Hz), clé USB (« USB 3.2 »), robot
>      tondeuse (m²), purificateur (m²), trottinette (km d'autonomie)… Toujours vérifier sur sources (§ 4).
>    - **Jamais** : loi, prix barrés, garanties, conseil sans produit, format texte « écrit en petit », sujet déjà fait
>      (`plan.json`), produit que Marcio a reçu d'une marque (il faudrait la divulgation TikTok).
>    - **Phrase 1 (dite à 0,12 s, finie vers 2,5 s)** : le chiffre de la boîte, en question, adressé à la personne
>      (« Ton robot tondeuse grimpe quarante-cinq pour cent ? », « Ta montre est étanche à cinquante mètres ? »).
>      **Phrase 2 (avant 4 s)** : « Non. » + le contre-pied (« Tu ne peux pas plonger à cinquante mètres avec. »).
>      À l'image 0 : le produit + le chiffre de la boîte en très gros (≥ 160 px) avec « ? » ou « ≠ ».
>    - **Puis** : pourquoi le chiffre trompe (1 phrase) ; la vraie valeur ou le vrai calcul, avec la source (2–3 phrases,
>      chiffres à l'écran) ; le verdict, court (« Pour un robot, c'est un mur. », « Résultat : trois à quatre recharges.
>      Pas cinq. ») ; le conseil avant d'acheter (1 phrase) ; un bonus (1 phrase) ; la fin : une question pour les
>      commentaires (« Écris l'angle de ton jardin en commentaire. ») et « abonne-toi » avec l'annonce (§ 5).
>    - **Longueur : 10 à 13 phrases, 100 à 120 mots, 35 à 40 s.** Remplace les 18–25 s du § 5, les 18–27 s du § 11, les
>      « 15 s au plus » et les « 20–40 s » du bloc du 04.11.
>    - **Rythme d'image** : un changement à l'écran toutes les 2 s environ (au moins 16 : chiffre qui arrive, schéma,
>      zoom, objet qui bouge), comme les jours 1 et 3 (18 et 21 repères sonores).
>    - **Formats** : V (moteur et dessins, celui des 2 vidéos sorties) et A (personnage IA, § 11 ; la vidéo 23 du 6.11 est
>      son premier essai sur TikTok). Au moins 8 V sur 14 tant que A n'a pas fait mieux au bilan. **Format T abandonné.**
>      Chaque vidéo diffère des autres (produit, couleurs, schéma) : jamais de modèle presque identique.
>    - **Voix** : version 3 (Chatterbox, § 11.7, choix de Marcio). Environ 1 min de calcul par phrase : lancer les voix de
>      toutes les vidéos tôt et relancer le pont si besoin. Une voix pas prête à temps : Piper (§ 5, la voix des
>      2 vidéos sorties) plutôt qu'un créneau vide.
>    - **Légende** : 1re ligne = la phrase-choc avec le nom du produit (« 20 000 mAh ≠ 5 recharges : le piège des
>      batteries externes ») ; 1 à 2 phrases avec la vraie valeur et la source ; une question précise pour les
>      commentaires ; 3 à 5 hashtags précis (produit, catégorie, #astucetech ou #astucemaison, #blackfriday jusqu'au
>      27.11) ; jamais #fyp, #pourtoi, #viral, « like si ». Couverture (`thumbnailOffset`) sur l'image où le chiffre et
>      « ≠ » sont lisibles. `isAiGenerated: true`.
> 2 bis. **Mise à jour du 05.11 (10 h 40) : ce que les gens aiment vraiment (données vidIQ). Elle remplace dans le point 2
>    le sujet, les phrases 1–2 et la longueur ; le reste du point 2 tient.** Marcio (10 h 20) : « regarde bien si c'est ça
>    que les gens aiment… tu peux changer de sujet… je veux juste être connu sur Instagram et TikTok ». Vidéos en français
>    publiées depuis le 1.10, 500 000 à 6 M de vues, souvent sur de petits comptes : (a) explications animées « ce que ton
>    objet du quotidien te cache » : chargeur 1,3 M (@histoire.pixelise, 16 000 abonnés, 72 s), chargeur secteur 1,2 M
>    (@5sigmascience), machine à laver 857 000 (@askleonm, 9 400 abonnés, 72 s) ; (b) démonstrations de nettoyage avec
>    résultat visible (jusqu'à 3,1 M ; il faut filmer, donc pas pour l'instant) ; (c) « Suisse contre France » (environ 1 M
>    pour de petits comptes romands) ; (d) feuilletons IA de fruits (1 à 1,7 M ; outils vidéo payants et sans lien avec
>    Marcio : non). Chez Marcio, les 2 mêmes vidéos (robot tondeuse, batterie externe) gagnent aussi en Reels d'essai
>    Instagram (1 182 et 518 vues contre environ 150). Page pour Marcio : https://claude.ai/artifact/8TanF5TUe8BKggdWRNFyra.
>    - **Sujet** : un objet ou une habitude de tous les jours que tout le monde a (téléphone, chargeur, frigo, machine à
>      laver, lave-vaisselle, box internet, télé, chauffage, micro-ondes, ampoule…) avec une vérité qui surprend, un mythe
>      démonté ou un chiffre de la boîte qui trompe (les pistes du point 2 restent bonnes). Toujours traduire les chiffres
>      en francs (tarif moyen ElCom de l'année) ou en objet concret (une douche, un café, une raclette).
>    - **Structure** (2 vidéos virales analysées image par image ; modèle : `days/day55`) : 0–3 s, un duel « toi / ton
>      collègue » (ou deux situations côte à côte) et une question ou une phrase qui contredit ce que tout le monde croit ;
>      avant 10 s, une promesse (« dans trois ans, lequel… ? », « à la fin, tu sauras pourquoi… ») ; la réponse vers le
>      milieu ; une 2e surprise ; 1 ou 2 conseils ; une question pour les commentaires ; retour à l'image du duel ;
>      « abonne-toi ». Le « non » immédiat n'est plus obligatoire si la question ouvre une attente.
>    - **Longueur : 50 à 70 s** (13 à 16 phrases, **150 à 190 mots** : mesuré sur le jour 55, 182 mots = 64,5 s de voix
>      Chatterbox avec `--gap 0.1`, soit environ 2,8 mots par seconde). Remplace les 35–40 s ci-dessus.
>    - **Mesure du 06.11** : avec beaucoup de nombres, 180 mots font 72 à 82 s de voix : viser 150 à 165 mots pour une vidéo chiffrée. Ne jamais faire défiler un compteur sur des valeurs inventées.
   - **Image** : un changement toutes les 2 s environ (compteurs qui défilent, étiquettes, tampons rouges, courbes,
>      personnes 3D `man_technologist` et `woman_technologist`), même style sombre « JE MESURE TOUT ». Les briques de
>      `days/day55/scene.js` (tampon, batterie, duel, thermomètre, compteur) se copient dans la scène suivante.
>    - **Force des affirmations** (contrôle du jour 55) : chaque phrase dit exactement ce que dit la source, pas plus :
>      « conçu pour garder … en conditions idéales », « peut », « à activer » (une fonction pas active par défaut),
>      « température ambiante ». Jamais de classement (« le vrai ennemi, ce n'est pas X ») qu'aucune source ne fait.
>      Relire le script phrase par phrase contre facts.md AVANT d'envoyer la voix au pont.
>    - **Série « Suisse contre France »** : 2 créneaux sur 14 par semaine. Comparaison chiffrée avec les prix officiels
>      des deux pays (site officiel en CHF et en EUR, date du relevé, taux de change du jour avec sa source, TVA 8,1 % et
>      20 % si utile), écran partagé avec les deux drapeaux, même structure (question, promesse, réponse au milieu,
>      surprise). Jamais un prix de mémoire. Pistes dans `plan.json` (idées 70 à 73).
> 3. **Stories** : `story.sh` ajoute 2 s de fin « NOUVELLE VIDÉO SUR TIKTOK · @marcio.mota8 » (`tools/story_endcard.py`).
>    Une Story publiée par l'API dure 60 s au plus : au-delà de 58 s de vidéo, `story.sh` coupe à la fin de la dernière
>    phrase finie avant 57,5 s (fondu 0,3 s), puis ajoute la fin (jour 55 : 64,8 s → Story de 58,4 s).
> 4. **Suite** : une vidéo au-dessus de 600 vues → une « partie 2 » (même piège, autre produit ou autre chiffre) dans les
>    48 h, à la place d'un sujet du plan.
> 5. **Bilan du 13.11** : médiane des vues des vidéos de la nouvelle recette contre celle des 20 vidéos d'avant (≈ 265),
>    part des vidéos au-dessus de 400 vues, temps moyen regardé, abonnés gagnés ; V contre A ; Sleepal et Aeotec à
>    part. On garde ce qui dépasse 400 vues. Si la médiane reste sous 300 : changer soi-même de recette d'après les
>    données (autre type de sujet, autre format, autre durée) et le dire honnêtement à Marcio (point 6).
> 6. **Autonomie et durée (Marcio, 05.11, 10 h 47 et 10 h 48)** : « je veux que tu sois 100 % autonome », puis « et
>    pendant un mois tu crées du contenu ». Donc : aucune validation à attendre, aucune question, rien à lui montrer avant
>    de publier ; chaque vendredi, l'autopilote change lui-même ce qui ne marche pas (sujets, formats, durée, heures,
>    rythme) dans les règles du § 0 (il ne filme pas ; outils gratuits ; aucun chiffre inventé), puis le dit à Marcio.
>    **La période est prolongée jusqu'au samedi 5.12.2026** : S5 = 28.11 → 5.12 ; le vendredi 27.11, les deux tâches
>    produisent comme d'habitude, 8 vidéos chacune (28.11 → 5.12) ; **bilan final le vendredi 4.12.2026** (§ 10.3).

> **Changements du 04.11.2026** (remplacés en partie par le bloc du 05.11 ci-dessus : rythme, durée, format R).
> Marcio (04.11, 8 h 23) : « je n'ai pas de vues sur TikTok, ta méthode ne marche pas très bien ». Constat chiffré
> (Metricool, 04.11) : 14 des 16 vidéos de l'autopilote publiées du 25.10 au 2.11 sont restées entre 246 et 293 vues ;
> seules les 2 premières « pièges de fiche technique » sont sorties (1 010 et 785) ; 2 partages et 1 commentaire en tout ;
> abonnés 68 → 74 ; voix contre texte seul : aucune différence. Les vraies vidéos de Marcio (juin-juillet, 5–12 s) :
> 3 sur 8 au-dessus de 780 vues. Nouvelle règle, à partir du 4.11 :
> 1. **10 h = autopilote, 1 vidéo par jour** : format A uniquement, **15 s au plus** (3 ou 4 phrases courtes), un
>    chiffre ou un fait surprenant **dès la première seconde**, et **seulement des produits** qu'on achète (plus de lois,
>    de prix barrés, de sujets abstraits). Story Instagram et Reel d'essai comme avant.
> 2. **18 h = format R « Réel » : une vraie vidéo de Marcio** tirée de ses Reels Instagram (accord de Marcio le 04.11 :
>    « Oui, toutes », y compris les produits reçus, avec la mention). Procédure § 12. Pas de Story ni de Reel d'essai
>    pour le format R (c'est déjà son contenu Instagram).
> 3. **Bilan du vendredi** : comparer R (18 h) et A (10 h) ; le format qui fait le plus de vues prend plus de créneaux.
>    Si R l'emporte nettement, passer à R aux deux créneaux.
>
> **Méthode de recherche du 04.11 (rapport complet : `autopilot/recherche/methode_tiktok_2026.md`, sources citées).**
> Marcio a choisi « 1 vraie + 1 créée » par jour (04.11, 8 h 50) : on garde ce rythme. Règles qui remplacent les points 1–2 :
> - **Durée** : jamais sous 15–20 s (les vidéos de 5–10 s ont la pire portée, Buffer 1,1 M de vidéos). Viser **20–40 s**
>   pour un chiffre choc, **60–120 s** pour un test complet. Remplace le « 15 s au plus » du point 1.
> - **Accroche** : le chiffre ou le duel visible **dès l'image 1**, 8 mots au plus à l'écran (« Annoncé : X. Mesuré : ? »,
>   « A contre B : lequel tient le plus ? »). Les accroches « produit en action » et « duel » sont les mieux classées.
> - **Légende** : 1re ligne = ce qu'on taperait dans la recherche TikTok, en français ; une question ouverte à la fin
>   (+26 % de commentaires, Metricool) ; jamais « like si… » ; **3 à 5 hashtags précis** (1 produit, 1 catégorie,
>   #testproduit pour R ou #apprendresurtiktok pour A, #blackfriday jusqu'au 27.11) ; jamais #fyp, #pourtoi, #viral.
> - **Produits reçus (presque toutes les vidéos R)** : légende qui commence par « Publicité · produit reçu de … » (règle
>   suisse et française) ET réglage TikTok « Divulgation du contenu commercial » (sinon TikTok peut retirer la vidéo du
>   fil Pour toi). Buffer ne transmet pas ce réglage : **Marcio l'active lui-même après la publication** (profil → la
>   vidéo → ⋯ → Paramètres publicitaires → Divulgation du contenu commercial → Contenu de marque → Enregistrer). Le
>   rappeler à Marcio le jour de chaque vidéo R de produit reçu.
> - **Vidéos créées (10 h)** : étiquette IA toujours (`isAiGenerated` true, impossible à ajouter après), thème « je mesure
>   tout » (mythe ou réalité, duel chiffré, piège de fiche technique), faits sourcés. Au bilan du **20.11**, si le créneau
>   créé a une médiane de vues ET une durée de visionnage plus basses que le créneau R, **proposer à Marcio** de passer à
>   2 vraies vidéos par jour (le rapport le recommande ; c'est sa décision).
> - **Reprise Instagram** : fichier d'origine sans logo ni bandes, musique Instagram coupée (Buffer la ferait couper),
>   son réel ou voix gardés, accroche et légende refaites en français.
> - **Ne pas** supprimer ni republier une vidéo qui plafonne (doublon) ; **ne pas** changer d'horaire chaque semaine.
> - **Bilan du vendredi** : médiane des vues par créneau (vidéos de 7 à 14 jours), vidéos au-dessus de 1 000 vues (→ une
>   « partie 2 » dans les 48 h), durée moyenne de visionnage, partages + enregistrements pour 1 000 vues, part du trafic
>   recherche, abonnés gagnés, avis d'inéligibilité (TikTok Studio). Décisions : 13.11 première lecture, 20.11 comparaison
>   A contre R, 27.11 bilan de S4, 4.12 bilan du mois (prolongation du 05.11).

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
  Format V (voix) : 35–40 s depuis le 05.11 (bloc du 05.11), sous-titres incrustés. Format T : abandonné le 05.11. Zones sûres : rien d'important dans les 200 px du haut, les 380 px du bas,
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
- **Depuis le 05.11 : les 14 créneaux sont des « chiffres-pièges »** (bloc du 05.11 : sujet, recette, formats V et A,
  au moins 8 V sur 14 tant que A n'a pas fait mieux). La règle R5 ci-dessus ne s'applique plus qu'entre V et A.
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
- Script V (depuis le 05.11, structure des jours 1 et 3) : **10 à 13 segments, 100 à 120 mots, 35 à 40 s**.
  Segment 1 = le chiffre de la boîte en question, adressé à la personne, dit dès 0,12 s et lisible à l'image 0 avec le
  produit visible ; segment 2 = « Non. » + le contre-pied. Puis le détail du bloc du 05.11, une phrase par idée.
  (Avant le 05.11 : 6 à 7 segments, 18 à 25 s ; ces vidéos plus courtes n'ont jamais dépassé 293 vues.)
  Pas de segment « envoie ça à… » (l'appel au partage va dans la description) ; la question pour les commentaires
  (« Écris … en commentaire ») reste dans la voix, comme aux jours 1 et 3.
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
   VIDÉOS SUR TIKTOK · @marcio.mota8 » en bas + 2 s de fin « NOUVELLE VIDÉO SUR TIKTOK », depuis le 05.11). Commit + push, Cloudinary `upload-asset` depuis raw.githubusercontent
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

## 10. Stratégie du mois (30.10 → 5.12.2026 ; prolongée le 05.11, voir le bloc du 05.11, point 6) — `strategy.json`
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
| S5 | 28.11 → 5.12 (8 jours, prolongation du 05.11) | ven. 4.12 (bilan final) | 1 300 · 40 % · +150 |
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
- **Vendredi 27.11** (prolongation du 05.11) : bilan de S4 comme un vendredi normal, puis les deux tâches produisent
  **8 vidéos chacune** (du samedi 28.11 au samedi 5.12 inclus).
- **Vendredi 4.12 à 5 h 37 : bilan final du mois.** Pas de production (le 5.12 est déjà prêt). Bilan de S5 et du mois
  (départ → arrivée, ce qui a marché, ce qui n'a pas marché, recommandations), page mise à jour, message à Marcio avec
  la question « on continue ? ». Puis désactiver les deux tâches du vendredi (outil `update_trigger`, `enabled: false`) :
  « Autopilot TikTok : bilan + 7 vidéos du matin (vendredi) » et « Autopilot TikTok : 7 vidéos du soir (vendredi) ».
- **Vendredi 4.12 à 11 h 37** (si la tâche du soir tourne encore) : ne rien produire ; vérifier que le bilan final
  existe, sinon le faire ; désactiver les deux tâches ; message d'une phrase.
- La tâche quotidienne « Autopilot : programmation Buffer » s'arrête le 6.12.

### 10.4 Produire une vidéo format T (texte seul, en boucle) — abandonné le 05.11.2026 (jamais au-dessus de 284 vues)
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
1. **Script** : depuis le 05.11, **10–13 segments, 100–120 mots, 35–40 s** (bloc du 05.11 ; avant : 6–7 segments,
   18–27 s). Segment 1 = l'objet dit le chiffre de sa boîte (« Ils ont écrit vingt-cinq
   mille pascals sur ma boîte. En énorme. »). Ton : sarcastique, vexé, complice ; parler à « tu ». Chaque fait = une source
   (fabricant, test indépendant, loi), dite à voix haute si c'est un avis (« Une testeuse de TechRadar… »). Dernier
   segment : « Abonne-toi : ce soir / demain, <l'objet suivant> balance sa boîte. » seulement si cette vidéo est
   au plan ; sinon « Abonne-toi : d'autres objets vont tout balancer. » Le chiffre de la boîte doit rester cohérent
   avec la conclusion (vidéo 23 : 25 000 Pa sur la boîte, « 10 000 Pa suffisent » selon la source). Prononciation : écrire les marques
   comme elles se disent (« Tèk Radar », « aïe-fone »), nombres en lettres.
2. **Voix** (depuis le 03.11.2026 : Chatterbox, § 11.7 ; secours : job Piper comme § 5, voix tom, length_scale 0.9), puis `assemble_vo.py … --lead 0.12 --gap 0.1`, puis (Piper seulement)
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

### 11.7 Voix (choix de Marcio le 03.11.2026 : version 3)
- **Par défaut depuis le 03.11.2026 : Chatterbox Multilingual avec le timbre de la voix Piper** (Resemble AI, licence MIT ;
  filigrane audio Perth inaudible qui signale une voix de synthèse). Marcio a écouté 3 versions et choisi la 3
  (« 3 », 03.11.2026, 21 h 40). Job `autopilot/tts/cb_jobs/dayNN.json` : mêmes segments que Piper,
  `{"engine": "chatterbox", "lang": "fr", "ref": "autopilot/tts/refs/tom_ref.wav", "exaggeration": 0.55, "cfg": 0.5,
  "temperature": 0.8, "seed": 7, "segments": [...]}` ; push sans `[skip-bridge]` ; sortie `autopilot/tts/out/dayNN/`
  au même format que Piper (manifest.json, un WAV 16 bits par segment). Compter environ 1 minute de calcul par phrase
  (8 minutes pour une vidéo de 7 phrases) : envoyer les jobs de voix de plusieurs vidéos dans le même push.
  Le pont pousse chaque voix dès qu'elle est prête (commit « bridge output (voix dayNN) ») : monter la première vidéo
  sans attendre les autres. Au-delà de 40 minutes de voix, le passage s'arrête et les voix restantes passent au
  passage suivant : le relancer avec `gh workflow run tiktok-bridge.yml --ref tiktok-autopilot`. Une voix
  Chatterbox est environ 20 % plus longue que Piper. Recette du 05.11 (point 2 bis) : 50 à 70 s une fois montée, soit
  13 à 16 phrases, 150 à 190 mots (jour 55 : 182 mots = 64,5 s) et 15 à 20 minutes de calcul par vidéo.
- Ensuite comme avant : `assemble_vo.py … --lead 0.12 --gap 0.1`, **sans `voice_fx.py`** (la version choisie par Marcio
  n'a pas d'effet), champs `display`, transcription Whisper obligatoire (§ 11.5) : corriger tout mot mal dit
  (réécrire la phrase ou changer `seed`, puis nouveau job sous un nouveau nom). Méthode du jour 55 (« débanche » entendu
  au lieu de « débranche ») : 3 jobs `dayNNb`, `dayNNc`, `dayNNd` avec seulement la phrase fautive et 3 graines
  (11, 23, 42), puis leurs WAV dans `autopilot/vo/` et `asr/todo.txt` pour Whisper ; garder une prise juste, la copier
  avec les autres phrases dans un dossier de travail du studio et relancer `assemble_vo.py` sur ce dossier.
- Piper reste la solution de secours si le pont échoue (voix tom, `voice_fx.py --factor 1.12`).

## 12. Format R « Réel » : les vraies vidéos de Marcio (04.11.2026 → 6.11.2026 ; EN PAUSE)
**En pause depuis le 05.11.2026** (choix de Marcio : « 2 chiffres-pièges par jour ») : ne plus produire de vidéo R. Les
derniers essais sont Sleepal (5.11) et Aeotec (6.11). Procédure gardée ci-dessous au cas où Marcio la redemande.
Accord de Marcio le 04.11.2026 : ses propres Reels Instagram (ses mains, ses produits) peuvent passer sur TikTok,
repris avec une accroche, y compris les produits reçus des marques (avec la mention « Publicité » et la divulgation TikTok, bloc du 04.11). Rien n'est modifié sur Instagram.
1. **Choisir** dans `autopilot/r_queue.json` la prochaine source « à faire » (vues Instagram décroissantes). Sauter
   toute vidéo qui contient des images d'un autre créateur ou de la marque (légende : « images de », « footage »,
   texte anglais de la marque ; regarder la planche) : **jamais republier la vidéo d'un autre**. Sauter celles déjà
   publiées sur TikTok (juin-juillet) et celles en allemand ou en anglais.
2. **Récupérer** : Windsor `get_data` (connector instagram, account 17841468820761900, champs media_shortcode,
   media_url, filtre `["media_shortcode","in","[...]"]`) donne l'adresse du fichier (valable quelques jours) ;
   l'ajouter à `bridge/urls.txt` (`ig_<shortcode>.mp4 <url>`), push sans `[skip-bridge]` ; le fichier arrive dans
   `bridge/out/` ; retirer ensuite la ligne de `urls.txt`.
3. **Choisir les passages** : `python3 autopilot/tools/ig_cut.py bridge/out/ig_X.mp4 --scan planche.jpg` (une image
   par seconde), puis regarder la planche. Garder 20 à 40 s (jamais sous 15–20 s ; 60–120 s pour un test complet) : l'action la plus visuelle et la mesure ou le résultat (le produit qui marche, le
   résultat), pas le déballage lent ; si la vidéo a une voix off, couper entre deux phrases (les sous-titres de
   Marcio aident) ; sauter les plans d'ouverture et de fin (carte « lien en bio »).
4. **Monter** : `ig_cut.py source sortie --seg a-b [--seg c-d] --hook "accroche" [--hook-y 860] [--speed 1.1]
   [--mute --music bed.wav] --sheet planche.jpg`. Accroche : un fait tiré de la vidéo ou de la légende, jamais
   inventé ; ne pas la poser sur un texte déjà écrit dans la vidéo (`--hook-y` pour la déplacer) ; pas d'accroche si
   la vidéo commence déjà par un grand titre. Son : garder la voix off de Marcio ; sinon (musique seule, souvent une
   musique de la bibliothèque Instagram) `--mute --music` avec `audio/synth.py bed`. Vérifier la planche.
5. **Publier** : `media/r/rNN_<produit>.mp4`, commit, Cloudinary (`tiktok-autopilot/r/rNN_<produit>`), puis Buffer TikTok à
   18 h : légende courte en français (question oui/non, « Produit reçu de … » ou « Produits offerts par … »,
   « Voix off générée par IA » si c'est le cas, 5 hashtags), titre = l'accroche, `isAiGenerated` true si la vidéo
   contient une voix ou des images générées par IA, sinon false. Noter dans `plan.json` (`format_R`) et passer la
   source à « faite » dans `r_queue.json`.

