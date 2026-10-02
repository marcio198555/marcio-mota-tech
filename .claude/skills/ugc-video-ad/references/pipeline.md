# Pipeline details

Read the section for the step you're on. Commands assume the skill's `scripts/` folder is at `$SK/scripts`
and the project folder is the current directory.

## Contents
1. Project layout and budget
2. Facts and script
3. Voice and word timing
4. Product keyframes, exact screens, motion
5. Talking presenter (LeapTalk + talking.py)
6. Edit: shot list and picture track
7. Overlay: captions, chips, CTA, end card
8. Sound: mix and master
9. Final picture, share copy, delivery
10. Variants (no avatar, other lengths, other languages)

## 1. Project layout and budget
```
ugc/<product>/
  temtop-...-9x16.mp4          final masters (+ cover.jpg), README.md
  source-vN/
    facts.md  script.txt  timeline.json  timeline.js
    kf/        keyframes (png) + screen quads (npy)
    talk/      talking-head outputs from the Space (small, keep them: not reproducible)
    clips/ stock/ work/ models/       gitignored (re-downloadable or rendered)
    shots.json  mix.json  overlay/index.html  build.sh  CREDITS.md
```
Budget for a 50 s ad, aiming for the first full cut within about 1.5 h:

| Stage | Time |
|---|---|
| Facts and script | 15 min |
| Voice | 5 min |
| Keyframes and animation | 30-45 min |
| Edit, overlay and sound | 30 min |
| Render | 10 min |

Post a one-line status at each stage.

## 2. Facts and script
- Sources, in order: the brand's product page, then the manual (PDF), then the spec sheet, then the
  retailer listings. Search with Firecrawl or Parallel. Save the exact wording and units in `facts.md`.
- If the product has a display, list each page shown in the manual (screenshots) with its values,
  units and colour thresholds. These drive the HTML replica, and the values must stay consistent
  across the whole ad: the same morning temperature everywhere, and an alarm colour that matches
  the threshold.
- Write the script one line per breath; `align_words.py` maps one pause-separated region to one
  line. 110-150 words fit 45-55 s. Keep it first person, concrete and spoken. Numbers are read the
  way people say them ("mille mètres"); the captions can show digits.
- Structure:
  - hook (0-3 s), then a pivot ("et en fait…");
  - reveal ("Voici la …") on the music drop;
  - features grouped by place (outside / inside);
  - 2-3 scenes from daily life (morning, cooking, home office);
  - proof features (history, forecast, app);
  - CTA.

## 3. Voice and word timing
- ElevenLabs: pick the voice (gender and age as requested), generate the whole script in one take,
  then download it.
- Then convert and time the words:
  ```bash
  ffmpeg -i vo.mp3 -ar 48000 -ac 1 audio/vo.wav
  python3 $SK/scripts/align_words.py audio/vo.wav script.txt timeline.json --js timeline.js --offset 0.25 --special syl.json
  ```
  `--offset` is where the voice starts in the video. 0.25 s gives the hook a breath of picture first.
- If the region count doesn't match the line count: split or merge lines where the voice pauses, or
  change `--min-pause`.

## 4. Product keyframes, exact screens, motion
- **Keyframes**: Cloudinary `generate-image-from-images` with official photos as references, 9:16
  (768x1376 is fine). Describe the scene, lighting, lens and hands, and ask for the exact product
  from the reference. Check logo, buttons, proportions and screen bezel, and regenerate on any
  drift.
- **Exact screen**:
  1. Rebuild each needed page in HTML (`screen/ui/index.html`) from the manual's screenshots, at
     the device's aspect ratio, with real fonts and data in the right units.
  2. Render the frames: Playwright at 2x, f_0000.png...
  3. Track the screen in the shot and replace it:
     ```bash
     python3 $SK/scripts/screen_replace.py clips/shot.mp4 ui/frames_home clips/shot_home.mp4 refs/flat_home.png 3,2,959,557
     ```
     The reference is a flat capture of what the shot's screen shows: SIFT finds the screen in each
     frame. If a finger touches the screen, keep the finger with a skin/difference matte inside the
     quad.
  4. For a still keyframe, give `talking.py` a quad (`.npy`, 4 corners TL, TR, BR, BL in keyframe
     pixels), or composite the screen once.
- **Motion**:
  - image-to-video Space (Wan 2.2) for product shots;
  - otherwise a 2.5D parallax from a depth map (as in `talking.py`'s camera) or a slow push-in in
    `build_base.py`;
  - Pexels for everyday scenes, cropped to 9:16 with `crop_x`.
- **Clean-up**: `clean_plate.py in.png out.png '[[x,y],...]' '[[no-source polygon]]'` removes an
  object and fills the hole from the out-of-focus background with a membrane fill plus matched
  grain. Ban adjacent surfaces (sweater, hand) as sources so they don't bleed in.
- Depth model for `talking.py`:
  `curl -L -o models/depth_anything_v2_vits.onnx https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model.onnx`

## 5. Talking presenter (LeapTalk + talking.py)
1. Keyframe of the presenter in selfie framing, with the product held if relevant (768x1376).
2. Crop a square around the head and shoulders, about 620 px with the face in its upper half. For
   example `c_crop,x_0,y_180,w_620,h_620` on the Cloudinary URL.
3. Audio for that shot: a Cloudinary `so_<start>,eo_<end>` trim of the voice-over in raw voice
   time, or the whole voice-over from 0 with `max_seconds` set.
4. Call the Space (see free-ai-routes.md §2), relay the MP4 back (§3), then measure where its
   audio sits:
   ```bash
   python3 $SK/scripts/lipsync_check.py offset talk/lt_cta.mp4 audio/vo.wav --near 47.70
   ```
5. Paste the head back into the full-resolution frame:
   ```bash
   python3 $SK/scripts/talking.py kf/hook.png kf/hook_quad.npy ui/home.png talk/lt_hook.mp4 0,180,620 -0.25 clips/P_hook.mp4 3.55 30 '<device polygon json>' 0.07
   python3 $SK/scripts/talking.py kf/cta.png - - talk/lt_cta.mp4 0,180,620 0.065 clips/P_cta.mp4 3.5 30 - 0.06
   ```
   - `t0` is the LeapTalk time at the shot's first frame:
     `(shot start in video) - (voice offset in video) - (clip start in raw voice)`. It is negative
     when the shot starts before the voice; the first frame is then held.
   - Add a frame or two (about 40 ms) if the measured sync shows the picture late. LeapTalk can lag
     its own audio by about a frame.
   - The device polygon keeps a held product rigid and exact. Without it, the generated pixels
     would boil the on-screen text.
6. Check it:
   ```bash
   python3 $SK/scripts/lipsync_check.py sync work/final.mp4 audio/vo.wav --vo-offset 0.25 --t0 47.95 --t1 51.35 --mouth 300,830,520,990
   ```
   Look at a contact sheet and zoomed crops of the square's edges (seams) and the jaw/device contact.

## 6. Edit: shot list and picture track
`shots.json` (see the header of `build_base.py`): contiguous shots, 1.2-3.5 s each.
- Cut on the voice: each feature word lands on its shot. Use a punch-in on most cuts but not on the
  presenter.
- Put a `split` for anything with two ends (sensor outside / display inside). Make the end-card
  backdrop the product shot, blurred.
```bash
python3 $SK/scripts/build_base.py shots.json work/base.mp4
```

## 7. Overlay: captions, chips, CTA, end card
1. Copy the template next to `timeline.js`:
   - `assets/overlay_template.html` to `overlay/index.html`;
   - the `assets/fonts/` folder to `overlay/fonts/`.
2. Edit `CFG`:
   - `cuts` (same as the shot list) and `capY` per shot: caption centre at 455 (top), 1120 (middle)
     or about 1500 (bottom), whichever doesn't cover the product or a face;
   - `chips` (2-6 words, emoji, timed on words);
   - CTA;
   - end card (product name, one-line promise, hero image, CTA).
3. Add custom sections, such as a range badge or an alarm sticker, in `renderFrame` with `pop()`.
4. Render: `NODE_PATH=<playwright node_modules> node $SK/scripts/render_overlay.js frames overlay/index.html work/oframes 30 0 1620`.
   Split it into 4 ranges in parallel for speed, and check a few stills first with
   `render_overlay.js stills ... 1.0,5.2,20.5`.

## 8. Sound: mix and master
`mix.json` (see the header of `mix_audio.py`):
- voice at its offset;
- music with `song_drop` (the drop's time in the track) on `video_drop` (the reveal cut);
- a whoosh on most cuts, a pop on each chip, a riser into the reveal plus an impact;
- foley for the scenes (keys, window, footsteps, sizzle, beep);
- ambience beds per location (room tone, wind, birds, rain, or the stock clip's own sound).
Then master it:
```bash
python3 $SK/scripts/mix_audio.py mix.json work/mix_pre.wav && bash $SK/scripts/master.sh work/mix_pre.wav work/mix_master.wav
```
Target -14 LUFS integrated and -1.5 dBTP. The voice must stay intelligible over everything.

## 9. Final picture, share copy, delivery
```bash
python3 $SK/scripts/composite.py work/base.mp4 work/oframes work/mix_master.wav ../<name>-9x16.mp4
bash $SK/scripts/share_copy.sh ../<name>-9x16.mp4 work/<name>-partage.mp4      # ~25 MiB, sendable in chat
```
- Send the share copy with SendUserFile; files of about 30 MB or more are refused.
- Commit the master, the cover, `source-vN/` and the README.
- In the README, record the script table, the sources of every claim, and what to know before
  publishing: AI disclosure, stock licence, voice and music licence.

## 10. Variants
- **No avatar**: replace the presenter shots in the shot list (product close-up for the hook, an
  ambience shot for the pivot line, a wide product shot for the CTA). Move the captions with
  `capY`, add a whoosh on any new cut, and keep the same voice and music. Select it with a
  `noavatar` argument or a `?noavatar` query so both versions build from one source.
- **Shorter cut (15-30 s)**: keep hook, reveal, the two best features and the CTA. Re-time the music
  drop.
- **Other language**: new voice, `align_words.py` with the translated `script.txt`. Check that
  caption chunks still fit 17 characters.
