# QA before sending a video

Do this pass on every render. Each item caught a real problem once.

## Picture
- [ ] **Contact sheet** every 0.5-1 s and at each cut. Read it as a viewer would: does each shot
  show what the voice says at that moment?
- [ ] **Product fidelity**: shape, logo, buttons, colours and screen bezel match the official photos
  in every shot.
- [ ] **Screens**: the exact UI, in the right units (°C/°F), with consistent values. The same
  morning reading appears everywhere, and colours match the official thresholds (e.g. CO₂ above
  1500 ppm is red). Watch numbers that tick between shots: a caption chip must not contradict the
  screen; use "en hausse" rather than a number that drifts.
- [ ] **AI tells**:
  - floating objects;
  - melting fingers;
  - boiling on-screen text;
  - frozen faces;
  - seams around a pasted region (zoom 2x on its edges);
  - identity drift between the presenter's shots.
- [ ] **Presenter**: talks, blinks and moves naturally. Lip sync is within ±1 frame
  (`lipsync_check.py sync`). The first held frame (before the voice) is under 0.3 s.
- [ ] **People in stock footage** don't appear to endorse the product (hands, backs, profiles).

## Text
- [ ] Captions follow the voice word by word, with no typos and correct accents. Chunks are 3 words
  or 17 characters at most.
- [ ] Captions never cover the product's key detail, a face, or the CTA. Check the caption height on
  every shot.
- [ ] Everything sits in the safe zone (y 250-1550, x 60-1020).
- [ ] Every claim in a chip or caption is in `facts.md`, with its condition shown where needed
  ("*en terrain dégagé").

## Sound
- [ ] -14 LUFS integrated (±0.5), true peak ≤ -1.5 dBTP:
  `ffmpeg -i out.mp4 -af ebur128=peak=true -f null -`.
- [ ] Music ducks under the voice; the drop lands on the reveal; the last hit lands on the end card.
- [ ] No clicks at cuts. The sound effects match the picture (a beep when the screen alarms).

## File
- [ ] 1080x1920, 30 fps, H.264 High, AAC 48 kHz, BT.709, faststart. Duration as requested.
- [ ] The share copy is under about 26 MiB and plays from start to end.
- [ ] Credits, licences and the AI disclosure are written in the README.
