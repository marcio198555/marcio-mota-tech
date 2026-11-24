# Crédits et sources : version 2 (vrais plans vidéo)

## Plans du produit, générés par IA

Ces plans montrent la vraie Temtop W100. Chaque image clé a été générée dans ElevenLabs avec le modèle Gemini 3.1 Flash Image (« Nano Banana 2 »), en partant de la photo officielle du produit.

| Fichier | Plan | Comment il a été fait |
|---|---|---|
| `clips/K04_omni.mp4` | Écran posé sur un buffet, vue montagne (révélation, zooms écran) | Image clé `kf/K04.jpg`, animée en vidéo avec Gemini Omni Flash via vidIQ |
| `clips/K05_omni.mp4` | Capteur extérieur sous la pluie, coupelles qui tournent | Image clé `kf/K05.jpg`, animée avec Gemini Omni Flash via vidIQ. Le son de pluie et de vent vient du même rendu |
| `clips/K03_par.mp4` | Capteur extérieur, paysage alpin | Image clé `kf/K03.jpg` plus mouvement de caméra 2,5D (`parallax.py`, carte de profondeur Depth Anything V2) |
| `clips/K07_par.mp4` | Doigt qui touche l'écran | Image clé `kf/K07.jpg` plus mouvement de caméra 2,5D (`parallax.py`) |

## Plans d'archive (Pexels)

[Licence Pexels](https://www.pexels.com/license/) : usage gratuit, y compris commercial. L'attribution est facultative mais appréciée.

À respecter :
- ne pas revendre les clips tels quels ;
- ne pas faire croire que les personnes filmées recommandent le produit.

| Fichier | Plan | Auteur | Page Pexels |
|---|---|---|---|
| `dustB` | Poussière dorée dans un rayon de soleil | Havvanur Akın | https://www.pexels.com/video/ethereal-dust-particles-in-sunbeam-39513793/ |
| `waking` | Homme qui s'étire au réveil | Monstera Production | https://www.pexels.com/video/man-waking-up-and-stretching-6845756/ |
| `sun` | Soleil au-dessus des nuages | Altaf Shah | https://www.pexels.com/video/sun-and-clouds-12279773/ |
| `gasstove` | Homme âgé qui allume la gazinière | Mike Jones | https://www.pexels.com/video/elderly-man-turning-on-the-gas-stove-8806241/ |
| `stove` | Poêle flambée sur le gaz | Kuiyibo Campos | https://www.pexels.com/video/a-stove-with-a-pan-on-it-and-a-pan-on-the-stove-18105251/ |
| `smoke` | Fumée de cuisson | Cemrecan Yurtman | https://www.pexels.com/video/moody-cinematic-cooking-with-smoke-30728863/ |
| `window` | Femme qui ouvre la fenêtre | cottonbro studio | https://www.pexels.com/video/happy-pregnant-woman-opening-window-5853208/ |
| `hikers` | Couple dehors qui regarde un téléphone | Yaroslav Shuraev | https://www.pexels.com/video/a-couple-checking-their-location-on-global-positioning-system-4763827/ |

Les clips ne sont pas inclus dans le dépôt. `build_v2.sh` les télécharge depuis les liens de `stock.txt`.

## Son

- **Voix off** : ElevenLabs (`eleven_v3`, voix « Kevin – Création de contenus »), la même qu'en v1 (`../source/audio/vo_elevenlabs.mp3`).
- **Musique** : ElevenLabs Music, modèle `eleven_music_v2_5` (`audio/music_el.mp3`). Le drop du morceau tombe pile sur la révélation du produit, et la fin enchaîne, calée sur le temps, sur la vraie conclusion du morceau.
- **Bruitages et ambiances** :
  - pluie et vent : son d'origine du plan IA K05 ;
  - tout le reste est synthétisé dans `audio_v2.py` : allumage du gaz, grésillement, flammes, loquet de fenêtre, oiseaux, vent, pops, alarme, notification.

## Police

Montserrat (SIL Open Font License), dans `../source/fonts/`.
