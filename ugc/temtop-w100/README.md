# Pub UGC — Temtop W100 (Reels / TikTok / Shorts)

**Vidéo :** [`temtop-w100-ugc-9x16.mp4`](temtop-w100-ugc-9x16.mp4) — 1080×1920 (9:16), 30 i/s, 29 s, H.264 + AAC, son masterisé à −14 LUFS.
**Couverture suggérée :** [`cover.jpg`](cover.jpg)

Format « faceless UGC » : voix off naturelle, sous-titres mot à mot façon CapCut, visuels produit animés, musique et bruitages. Les textes restent hors des zones couvertes par l'interface d'Instagram et de TikTok (environ 230 → 1540 px en hauteur).

## Script (voix off)

| Temps | Voix off |
|---|---|
| 0:00 | Tu sais vraiment ce que tu respires chez toi ? |
| 0:02 | Regarde ça : la Temtop W100 ! |
| 0:04 | Une station météo ET un moniteur de qualité de l'air, dans un seul appareil. |
| 0:08 | Dehors, elle mesure le vent, la pluie, les UV et la luminosité. |
| 0:12 | Dedans, elle surveille le CO₂, les particules fines et les COV, en temps réel. |
| 0:17 | Tout s'affiche sur un écran tactile de 7 pouces, avec les prévisions météo. |
| 0:21 | Si l'air devient trop chargé… elle t'alerte. |
| 0:23 | Et tu suis tout depuis l'appli, même quand t'es pas là. |
| 0:26 | Je te mets le lien juste en dessous ! |

Toutes les fonctions citées sont reprises de la fiche produit officielle (temtopus.com) : PM2.5/PM10, CO₂, COV (TVOC), AQI, vent (vitesse et direction), pluie, UV, luminosité, écran tactile 7", prévisions, alertes de seuil, suivi à distance par appli WiFi.

## Storyboard

| Temps | Scène | À l'écran |
|---|---|---|
| 0:00–0:02 | Accroche | Poussière dans un rayon de lumière, texte géant « … ce que tu **RESPIRES** chez toi ? 😳 » |
| 0:02–0:04 | Révélation | Flash, apparition du kit, titre « TEMTOP W100 » |
| 0:04–0:08 | 2 en 1 | Capteur et écran entrent séparément (« Station météo », « Qualité de l'air »), puis tampon « 2 EN 1 » |
| 0:08–0:12 | Dehors | Capteur sur un ciel animé : rafales (vent), gouttes (pluie), soleil (UV, luminosité) |
| 0:12–0:17 | Dedans | Écran dans un intérieur chaleureux : CO₂, particules fines, COV, badge « en temps réel » |
| 0:17–0:21 | Écran tactile | Zoom sur l'écran, tap du doigt, « Prévisions météo » |
| 0:21–0:23 | Alerte | L'air se charge (fumée), bannière « ⚠️ Air trop chargé », ondes d'alerte |
| 0:23–0:26 | Appli | Smartphone et ondes WiFi, « Où que tu sois » |
| 0:26–0:29 | Appel à l'action | Fond orange, « TEMTOP W100 », bouton « 👇 Lien juste en dessous » |

## Légende proposée pour le post

```
Tu sais vraiment ce que tu respires chez toi ? 😳
La Temtop W100 = station météo + moniteur de qualité de l'air (CO₂, particules fines, COV) sur un écran tactile 7".
👉 Lien en bio
#pub #temtop #stationmeteo #qualitedelair #maisonconnectee #techsuisse
```

Si la vidéo est payée ou le produit offert, garde la mention **#pub** et active le label « Partenariat rémunéré » sur Instagram (et « Contenu de marque » sur TikTok).

## À savoir avant de publier

- **Voix off** : générée avec ElevenLabs (modèle `eleven_v3`, voix « Kevin – Création de contenus »). L'usage commercial demande un abonnement ElevenLabs payant, car l'offre gratuite ne l'autorise pas.
- **Visuels produit** : détourés des images officielles Temtop. Dans le cadre d'une collaboration, fais-les valider par la marque.
- **Écran du smartphone** : c'est une maquette d'illustration (valeurs fictives), pas une capture de la vraie appli. Si possible, remplace-la par une capture d'écran réelle.
- **Musique et bruitages** : synthétisés spécialement pour cette vidéo, sans aucun sample externe, donc libres de droits.
- **Police** : Montserrat (SIL Open Font License, voir `source/fonts/OFL.txt`).

## Version tournée face caméra (optionnel)

Le même script fonctionne pour une version filmée par toi :

1. **Accroche** : gros plan sur toi, écran en main, regard caméra (0–2 s).
2. **Révélation** : déballage rapide en 2 ou 3 plans courts.
3. **Dehors** : pose du capteur sur un mât ou un balcon, puis plan large avec le ciel.
4. **Dedans** : l'écran sur une étagère ou dans la cuisine, avec des taps sur l'écran tactile.
5. **Appli** : enregistrement d'écran de la vraie appli sur ton téléphone.
6. **CTA** : face caméra, tu pointes vers le bas.

## Modifier ou regénérer la vidéo

Tout le montage est du code : `source/index.html` (composition animée, une fonction `renderFrame(t)` par image), `source/timeline.json` (timings mot à mot), `source/audio.py` (musique, bruitages, mixage) et `source/vo_edit.py` (resserrage des pauses de la voix off).

```bash
cd source
./build.sh        # python3 (numpy, scipy), node 18+, ffmpeg et Chromium (variable CHROME)
```
