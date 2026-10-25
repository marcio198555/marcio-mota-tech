# Autopilot TikTok — @marcio.mota8

Chaîne de production quotidienne des vidéos TikTok de Marcio (tech, maison connectée, jardin, audio).

- `autopilot/tts/` : voix off françaises générées avec Piper (synthèse vocale libre, hors ligne).
  Un job JSON par vidéo dans `jobs/`, les fichiers audio sortent dans `out/<job>/`.
- `bridge/` : pont GitHub Actions. Chaque push sur cette branche télécharge les URL de `urls.txt`,
  exécute `job.sh`, puis committe les résultats.
- `media/` : vidéos finales (1080×1920, H.264, AAC), publiées sur TikTok via Metricool.

Voix : Piper (rhasspy/piper, MIT) avec le modèle `fr_FR-tom-medium`.
