# Crédits et sources : version 3 (présentateur, 54 s)

## Le produit et ses écrans

- **Écrans de la W100** : réplique fidèle des pages de l'appareil, reconstruite en HTML d'après les captures du manuel officiel (V1.0) : accueil météo, qualité de l'air, historique PM2.5, prévisions à 7 jours et réglage des alertes. Le fichier est `screen/ui/index.html`.
  - L'écran d'accueil est en °C et daté du vendredi 2 octobre 2026, à 7 h 42.
  - Les seuils de couleur (vert, orange, rouge) sont ceux du manuel.
- **Plans du produit** : plans IA de la v2 (K03, K04, K05, K07, voir `../source-v2/CREDITS.md`). Leur écran est remplacé image par image par la réplique, grâce à un suivi SIFT et une homographie (`screen/screen_replace.py`). Sur le plan du doigt, le doigt est conservé devant l'écran (`screen/screen_replace_occ.py`).
- **Carte de fin** : photo officielle du kit Temtop (capteur et écran), avec le même écran d'accueil incrusté (`assets/hero_v3@2x.png`).

## Le présentateur

- Deux images clés générées par IA (`kf/`) avec Nano Banana 2 Edit (Cloudinary) : `m_kf01` (selfie avec la W100) et `m_kf02_cta` (il pointe vers le lien).
- Animation locale (`screen/presenter.py`) :
  - écran exact incrusté ;
  - clignements des yeux ;
  - caméra de selfie tenue à la main en 2,5D (profondeur Depth Anything V2).
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
| `dustB` | Poussière dans un rayon de soleil | Havvanur Akın | https://www.pexels.com/video/ethereal-dust-particles-in-sunbeam-39513793/ |
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
