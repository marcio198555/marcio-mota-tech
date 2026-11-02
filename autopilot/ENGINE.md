# Moteur de rendu — référence pour écrire une scène

Une scène est un fichier JS qui définit `window.SCENE = { duration, draw(ctx, t) }`.
`render.js` charge `engine.js`, la timeline (`window.TL`) et la scène, puis dessine image par image
sur un canvas 1080×1920 (30 i/s) avec Chromium (Playwright), et encode en H.264 avec ffmpeg.

## Aides disponibles (`const { … } = ENG;`)
| Aide | Rôle |
|---|---|
| `C` | couleurs : `bg #030408`, `navy`, `navy2`, `line`, `fg`, `muted`, `gold #c9a84c`, `gold2`, `red #c82030`, `red2`, `green`, `grass`, `white` |
| `F` | polices : `F.display` (Inter Display), `F.body` (Inter), `F.mono` (DejaVu Sans Mono), `F.emoji` (Noto Color Emoji) |
| `S(id)`, `E(id)` | début et fin d'un segment de voix (s01, s02…) en secondes |
| `prog(t, début, durée)` | avancement 0 → 1 ; `ease.out / in / inOut / back / elastic` |
| `lerp`, `clamp` | interpolation, bornage |
| `background(ctx, t)` | fond bleu nuit, grille « plan technique », vignette |
| `block(ctx, t, début, fin, fn)` | un plan : fondu d'entrée et de sortie ; le bloc qui commence à 0 est complet dès l'image 0 |
| `text(ctx, str, x, y, {size, weight, color, family, align, maxWidth, stroke, shadow, alpha, letter})` | texte |
| `chip(ctx, label, x, y, {size, color, dot, align})` | étiquette arrondie (taille ≥ 30 pour rester lisible) |
| `readout(ctx, label, valeur, x, y, {w, h, size, border, color})` | afficheur d'instrument |
| `phone(ctx, cx, cy, w, h, {rot, draw})` | téléphone générique sans marque ; `draw(x, y, w, h)` dessine l'écran |
| `bookmark(ctx, x, y, échelle)` | icône « enregistrer » |
| `followCTA(ctx, t, t0)` | fin standard : @marcio.mota8, JE MESURE TOUT, bouton S'ABONNER |
| `brand(ctx, t)` | badge « JE MESURE TOUT » en haut à gauche |
| `captions(ctx, t, {y: 1335, size: 64, maxWidth: 800, x: 515})` | sous-titres mot à mot (champ `words` ou `display` de la timeline), lignes équilibrées |

## Mise en page
- Zone de travail : x 60–900, y 300–1200. Sous-titres centrés sur y = 1335.
- Un bloc par idée, calé sur les segments : `block(ctx, t, S('s03'), S('s05'), () => { … })`.
- Accroche (bloc qui commence à 0) : le message complet visible à l'image 0, puis un mouvement léger
  (zoom lent, élément qui bouge) pendant les 3 premières secondes.
- Chiffres en mono doré, mots-clés en Inter Display 900, contre-pied en rouge.
- Valeurs d'illustration : mention « exemple » en `chip` taille ≥ 36.
- Terminer `draw` par `brand(ctx, t)` puis `captions(ctx, t, {…})`.

## Commandes
```
node autopilot/render/render.js --scene autopilot/days/dayNN/scene.js --timeline <timeline.json> --stills 0,2,5 --stillsDir <dossier>
node autopilot/render/render.js --scene autopilot/days/dayNN/scene.js --timeline <timeline.json> --out silent.mp4
```

## Format A « Les objets balancent » (`render/characters.js`, objet `CHR`)
| Aide | Rôle |
|---|---|
| `CHR.load([noms])` | à mettre dans `SCENE.load` : charge les images 3D `assets/emoji3d/<nom>.png` |
| `CHR.room(ctx, t, {dim})` | salon dessiné (fenêtre, canapé, plante, parquet, tapis), flou de profondeur, léger mouvement ; `dim` assombrit (fin) |
| `CHR.camera(ctx, t, [[t, force]...], {cy})` | zooms « punch » + léger tremblé ; fermer avec `ctx.restore()` avant les sous-titres |
| `CHR.robotVacuum(ctx, x, y, s, t, {squash, face})` | robot aspirateur personnage (brosse qui tourne, lidar) |
| `CHR.face(ctx, x, y, s, t, {mood, look, talk, open})` | yeux, sourcils, bouche synchronisée sur la voix (`TL.mouth`, tools/mouth.py) |
| `CHR.box(ctx, x, y, s, label, sous-titre, {rot})` | carton de produit avec l'étiquette du chiffre |
| `CHR.emo(ctx, nom, x, y, taille, t, t0)` | image 3D qui apparaît avec rebond (taille ≤ 380 px) |
| `CHR.bubble(ctx, x, y, [lignes], t, t0, {side})` | bulle de dialogue (x, y = pointe) |
| `CHR.gauge(ctx, x, y, r, v, label)` | manomètre ; `CHR.seriesChip` : bandeau « LES OBJETS BALANCENT » |
Personnage au centre (x 540, y ≈ 1000), sous-titres à y = 1385. Pour un nouvel objet : une fonction de dessin dans
`characters.js` (formes simples, dégradés, ombre portée, une partie qui bouge), puis `face(...)` posé dessus.
