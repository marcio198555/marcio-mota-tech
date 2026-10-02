---
name: ugc-video-ad
description: Make realistic, ready-to-post UGC-style vertical video ads (9:16, 30-60 s, TikTok / Instagram Reels / YouTube Shorts) for a physical product. Covers product facts taken only from official sources, voice-over, word-by-word captions, music and sound effects, exact product screens, and an optional AI presenter who really talks (lip-synced), all with free connectors and open-source models. Use this skill whenever the user asks for a product video, a video ad, a "pub", "vidéo UGC", "vidéo produit", "réel", "TikTok", "Short", a talking avatar or presenter, or a faceless voice-over ad. Also use it to remake, improve, shorten or translate such a video, even if they never say "UGC".
---

# UGC product video ads

This skill turns a product (a link, a name, photos) into a vertical ad that looks shot by a real
person: a hook in the first 2-3 s, the product shown exactly as it is, real-life use cases,
captions, sound design and a call to action. It packages a pipeline that was built and refined on
a real job (Temtop W100 weather station + air-quality monitor). The scripts in `scripts/` are generic;
`references/` holds the details you load only when you reach that step.

## What the user cares about (learned the hard way)

These came from a real client's feedback. Each one cost a re-render when it was missed.

- **Realism first.** Anything that reads as AI breaks the ad, for example:
  - a frozen face that only blinks ("living photo") was rejected: the presenter must really talk, with
    lips synced to the voice;
  - a product floating in mid-air;
  - text on a device screen that changes from frame to frame;
  - a seam around a pasted face.
  Look at every shot as a viewer would before delivering.
- **The product must be identical to the original.** Same shape, logo, colours and buttons. If it has a
  screen, show the real interface: rebuild it from the manual and track it onto the screen
  (`scripts/screen_replace.py`). Keep the values on it coherent from shot to shot, in the right units
  (°C in Europe).
- **Every claim comes from the official product page or manual.** Write a fact sheet first and tie
  each script line to a fact. Quote ranges with their conditions (e.g. "1000 m in open field").
- **Respect explicit choices**: duration (e.g. "at least 45 s"), presenter gender ("un homme, pas une
  femme"), language and tone. Ask once if they are missing; otherwise use sensible defaults: 45-55 s,
  the user's language, a casual first-person tone.
- **Speed and visibility.** The user hates waiting without news. Give a one-line status at each
  milestone. Send a first complete cut early, then improve it. Don't disappear for hours.
- **Offer the variant before they ask.** Some users want the same ad without an AI person. Keep the
  edit parameterised (see "variants" in `references/pipeline.md`) so it is a cheap re-render.
- Talk to the user in their language (French for this client). Keep messages short, concrete and
  non-technical.

## Pipeline at a glance

Work in a project folder such as `ugc/<product>/source-vN/`, with a `work/` folder for renders
(gitignored). Each step has details, commands and pitfalls in `references/pipeline.md`.

1. **Facts.** Pull the official product page, manual and spec sheet (Firecrawl or Parallel search /
   fetch). Write `facts.md`: features, numbers, units, conditions, and the screens or pages of any
   display. Collect the official product photos, which are the references for every generated image.
2. **Script.** Write one line per breath, 110-150 words for about 50 s. The arc:
   - hook (2-3 s, a surprise or a pain point);
   - reveal (on the music drop);
   - 3-5 features, each matched to a shot;
   - 2-3 everyday scenes;
   - CTA ("le lien est juste en dessous").
   No claim may be absent from `facts.md`.
3. **Voice.** ElevenLabs `creative_list_voices`, then pick a voice that matches the presenter, then
   `creative_generate_speech`. Commercial use of ElevenLabs output needs a paid plan: tell the user.
4. **Word timing.** `scripts/align_words.py vo.wav script.txt timeline.json` splits the voice at its
   pauses, one region per script line, and times every word. Re-cut the lines if the region count
   does not match.
5. **Pictures.** Pick the cheapest route that stays realistic. `references/free-ai-routes.md` has the
   exact recipes.
   - Product in context: generate photoreal keyframes from the official photos (Cloudinary
     `generate-image-from-images`). Then animate them with a free image-to-video Space, or with a
     2.5D parallax if motion is subtle.
   - People: Pexels stock (hands, backs, profiles) for the everyday scenes.
   - Presenter that talks: LeapTalk Space, called through Zapier Webhooks, then
     `scripts/talking.py` to put the head back at full resolution with the exact screen and a
     handheld camera.
   - Clean-ups: `scripts/clean_plate.py` removes an unwanted or floating object.
6. **Edit.** Describe the cut as a shot list (JSON) and build the picture track with
   `scripts/build_base.py`. It handles 1080x1920 @ 30 fps, cover crop, slow push-in, a punch-in on
   cuts, pans across landscape stock and a blurred end-card background.
7. **Graphics and captions.** Copy `assets/overlay_template.html`. It gives word-by-word CapCut-style
   captions, feature chips, a CTA button and an end card. Render it to transparent PNGs with
   `scripts/render_overlay.js`. Keep text off the product: the caption height is set per shot.
8. **Sound.** Mix the voice, music (ElevenLabs Music, ducked about 6.5 dB under the voice), sound
   effects (ElevenLabs SFX plus the stock clips' own audio) and ambience. Master with
   `scripts/master.sh` (-14 LUFS, -1.5 dBTP).
9. **Final picture.** `scripts/composite.py` combines footage, light film grain, the overlay and the
   master into H.264/AAC (BT.709). Then `scripts/share_copy.sh` makes a ~27 MB copy (3.8 Mb/s for
   54 s), because files above about 30 MB cannot be sent in the chat.
10. **QA, then deliver.** Run through `references/qa-checklist.md`: contact sheet, facts,
    screens, caption placement, lip sync (`scripts/lipsync_check.py`), loudness and size. Then send
    the share copy with SendUserFile, commit the sources, and tell the user what changed in a few lines.

## Helpers

- `references/agents/` holds two optional sub-agents. **ugc-fact-checker** builds and checks the fact
  sheet. **ugc-video-qa** reviews a render frame by frame. In Claude Code, copy them to
  `.claude/agents/` of the working repo, then delegate: research and QA run while you edit.
- Dependencies: python3 with numpy, scipy, opencv-python and onnxruntime; ffmpeg with libx264; node 18+
  with playwright-core and a Chromium. The Depth Anything V2 small ONNX model is used by
  `talking.py`; its download URL is in `references/pipeline.md`.

## When things are blocked

- A connector or model is paywalled: say so in one line, take the next free route, and keep going.
- Generated faces or products drift from the reference: regenerate with stricter references, or
  composite the real product back in. Don't ship a different-looking product.
- `git push` returns 403 ("Claude doesn't have GitHub access…"): the GitHub app is read-only on that
  repo. Explain it once with the reconnect link, then hand over the files with SendUserFile (a share
  copy of the video plus a zip of the sources). Don't retry in a loop.
- Never probe or scan hosts to find a way out of the sandbox. Use the connectors and the relays
  documented in `references/free-ai-routes.md`.
