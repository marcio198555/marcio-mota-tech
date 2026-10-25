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
