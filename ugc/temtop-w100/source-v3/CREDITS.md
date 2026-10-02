# Crédits et sources : version 3 (présentateur, 54 s)

## Le produit et ses écrans

- **Écrans de la W100** : réplique fidèle des pages de l'appareil, reconstruite en HTML d'après les captures du manuel officiel (V1.0) : accueil météo, qualité de l'air, historique PM2.5, prévisions à 7 jours et réglage des alertes. Le fichier est `screen/ui/index.html`.
  - L'écran d'accueil est en °C et daté du vendredi 2 octobre 2026, à 7 h 42.
  - Les seuils de couleur (vert, orange, rouge) sont ceux du manuel.
- **Plans du produit** : plans IA de la v2 (K03, K04, K05, K07, voir `../source-v2/CREDITS.md`). Leur écran est remplacé image par image par la réplique, grâce à un suivi SIFT et une homographie (`screen/screen_replace.py`). Sur le plan du doigt, le doigt est conservé devant l'écran (`screen/screen_replace_occ.py`).
- **Carte de fin** : photo officielle du kit Temtop (capteur et écran), avec le même écran d'accueil incrusté (`assets/hero_v3@2x.png`).

## Le présentateur

- **Images clés** (`kf/`) : deux images générées par IA avec Nano Banana 2 Edit (Cloudinary) :
  - `m_kf01` : selfie avec la W100 ;
  - `m_kf02_cta` : il pointe vers le lien.
  - Dans `m_kf02_cta_clean.png`, la W100 qui flottait sous son doigt a été effacée (`screen/clean_plate.py`, remplissage de l'arrière-plan flou).
- **Il parle** grâce à [LeapTalk](https://huggingface.co/z-rx/leaptalk), via le Space Hugging Face gratuit [`hugging-apps/leaptalk-talking-head`](https://huggingface.co/spaces/hugging-apps/leaptalk-talking-head). Le modèle repose sur SoulX-FlashHead 1.3B et wav2vec2, tous sous licence Apache-2.0.
  - Entrées : le carré 620×620 en (0, 180) de chaque image clé et la voix off. Pour l'accroche, la voix est prise depuis le début (max_seconds 3,4). Pour la fin, l'extrait va de 47,70 à 50,90 s (max_seconds 3,3).
  - Réglages : 1 pas, guidance 1,0, seed 42, recadrage du visage désactivé.
  - Sorties : `talk/lt_hook.mp4` et `talk/lt_cta.mp4`, en 512×512 et 25 i/s.
  - Le Space a été appelé par son API Gradio (`/gradio_api/call/v2/generate`).
- **Intégration** (`screen/talking.py`) :
  - le visage animé est recollé en pleine résolution, avec une couleur ajustée sur l'image clé ;
  - l'écran exact de la W100 est incrusté, et l'appareil reste rigide dans la main ;
  - autour du carré généré, le corps suit les mouvements de la tête : le flux optique est prolongé avec une atténuation, sans couture ;
  - les images sont recalées de 25 à 30 i/s par interpolation de mouvement ;
  - la synchro lèvres/voix est vérifiée à une image près ;
  - la caméra de selfie tenue à la main est simulée en 2,5D (profondeur Depth Anything V2).
- C'est une personne fictive, générée par IA : il faut le signaler (étiquette « contenu généré par IA »).

## Plans réels (Pexels)

[Licence Pexels](https://www.pexels.com/license/) : usage gratuit, y compris commercial. Ne pas faire croire que les personnes filmées recommandent le produit. Ici, on voit surtout des mains et des personnes de dos ou de profil.

| Fichier | Plan | Auteur | Page Pexels |
|---|---|---|---|
| `run2` | Homme qui court au bord d'un lac | Pressmaster | https://www.pexels.com/video/a-man-jogging-by-the-lakeside-3209300/ |
| `pan` | Mains qui cuisinent au wok | 宇航 钱 | https://www.pexels.com/video/man-frying-noodles-on-a-frying-pan-12837557/ |
| `window2` | Homme de dos qui ouvre la fenêtre | Ron Lach | https://www.pexels.com/video/back-view-of-a-man-opening-a-window-9902447/ |
| `typing` | Mains qui tapent sur un portable | Darlene Alderson | https://www.pexels.com/video/man-typing-on-the-laptop-on-his-desk-7967182/ |
| `phone` | Main d'homme avec un smartphone | Ketut Subiyanto | https://www.pexels.com/video/close-up-shot-of-a-man-s-hand-using-a-phone-4333086/ |
| `sun` | Soleil au-dessus des nuages | Altaf Shah | https://www.pexels.com/video/sun-and-clouds-12279773/ |

## Son

- **Voix off** : ElevenLabs `eleven_v3`, voix « Kevin – Création de contenus » (`audio/vo_v3.mp3`). L'usage commercial exige un abonnement ElevenLabs payant.
- **Musique** : celle de la v2 (ElevenLabs Music, `../source-v2/audio/music_el.mp3`), recalée pour que :
  - le drop tombe sur l'apparition de la W100 ;
  - le dernier coup du morceau tombe sur la carte de fin.
- **Bruitages** :
  - ElevenLabs Sound Effects (`audio/sfx_*.mp3`) : clavier, fenêtre, pas de course, bip d'alarme ;
  - le son d'origine des plans K05 (pluie, vent) et du wok ;
  - synthèse (`audio_v3.py`) : vent, oiseaux, grésillement, pops, tap, impacts.
- **Sous-titres** : le minutage mot à mot est calculé depuis la voix (`align.py`) : pauses, syllabes, creux d'énergie.

## Polices

- Montserrat (sous-titres et habillage) et Barlow / Saira Semi Condensed (réplique de l'écran).
- Licence SIL Open Font License.
