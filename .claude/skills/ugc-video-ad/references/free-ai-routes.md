# Free AI routes that work (and the ones that don't)

These recipes were proven on a real job. The sandbox can't reach most hosts directly, so files reach
remote models as public URLs (Cloudinary), and results come back through a relay (vidIQ upload, then
curl from storage.googleapis.com).

## Contents
1. Public URLs for your files (Cloudinary)
2. Calling any Hugging Face Space (Gradio) through Zapier Webhooks
3. Getting a result file back into the sandbox (vidIQ relay)
4. Models that worked
5. Voice, music, sound effects (ElevenLabs)
6. Stock footage (Pexels)
7. Dead ends to skip

## 1. Public URLs for your files (Cloudinary)
- `Cloudinary upload-asset` accepts a remote URL, such as an official product photo or a file
  another tool returned. Use it to host keyframes and the voice-over.
- Delivery transformations make derived public URLs for free, so nothing needs re-uploading:
  - crop an image: `.../image/upload/c_crop,x_0,y_180,w_620,h_620/v123/folder/kf.jpg` (a square
    around the face for a talking-head model);
  - trim audio: `.../video/upload/so_47.70,eo_50.90/v123/folder/vo.mp3`. The start may snap about
    25 ms earlier to an MP3 frame, so measure the real offset afterwards
    (`scripts/lipsync_check.py --find-offset`).
- `Cloudinary generate-image-from-images` (Nano Banana 2 Edit) gives photoreal product-in-context
  keyframes. Pass 1-3 official product photos as references. Check the logo, the buttons and the
  screen shape against the photos, and regenerate if anything drifts.

## 2. Calling any Hugging Face Space (Gradio) through Zapier Webhooks
The Hugging Face connector can find Spaces but cannot run them. Zapier's "Webhooks by Zapier"
custom request can. Enable it once with `enable_zapier_action`:
- selected_api `WebHookCLIAPI`;
- action `custom`;
- tool `webhooks_by_zapier_custom_request`.

Then call it with `execute_zapier_write_action`:

1. Read the API (endpoint names and parameter names):
   ```json
   {"method":"GET","url":"https://<owner>-<space>.hf.space/gradio_api/info","return_raw_response":"yes"}
   ```
2. Start a job. Use named parameters, and pass files as `gradio.FileData` with a public URL:
   ```json
   {"method":"POST",
    "url":"https://hugging-apps-leaptalk-talking-head.hf.space/gradio_api/call/v2/generate",
    "headers":{"Content-Type":"application/json"},
    "data":"{\"portrait_image\":{\"path\":\"<img url>\",\"url\":\"<img url>\",\"meta\":{\"_type\":\"gradio.FileData\"},\"orig_name\":\"head.jpg\"},\"speech_audio\":{\"path\":\"<mp3 url>\",\"url\":\"<mp3 url>\",\"meta\":{\"_type\":\"gradio.FileData\"},\"orig_name\":\"vo.mp3\"},\"max_seconds\":3.4,\"num_inference_steps\":1,\"guidance_scale\":1.0,\"seed\":42,\"auto_crop_face\":false}",
    "unflatten":"no","return_raw_response":"yes"}
   ```
   The response contains an `event_id`.
3. Fetch the result. Poll until the stream contains `event: complete`; its data holds a
   `.../gradio_api/file=/tmp/gradio/<hash>/<name>.mp4` URL.
   ```json
   {"method":"GET","url":"https://<space>.hf.space/gradio_api/call/generate/<event_id>","return_raw_response":"yes"}
   ```
ZeroGPU Spaces have a daily GPU quota per account. Keep each job short: a 3-4 s talking shot costs
seconds of GPU. Generate only the shots that need a model.

## 3. Getting a result file back into the sandbox (vidIQ relay)
`vidIQ vidiq_video_upload` takes the result URL and returns a signed `storage.googleapis.com` URL,
which `curl` can download from the sandbox. Arguments: `url` set to the `.../gradio_api/file=...mp4`
URL, and `title` set to any short label. It needs a direct MP4 with a Content-Length.

For images, attach them to an ElevenLabs flow (`creative_attach_reference_file`) or host them on
Cloudinary.

## 4. Models that worked
| Need | Space / model | Notes |
|---|---|---|
| Talking presenter, lip-synced to your voice | `hugging-apps/leaptalk-talking-head` (LeapTalk, built on SoulX-FlashHead 1.3B, all Apache-2.0) | Output is 512x512 at 25 fps in 28-frame chunks. Input: a square around the head (about 620 px of a 768-wide keyframe), `auto_crop_face:false` so the framing stays known. It gives a real mouth, teeth, blinks and head motion. Put the head back with `scripts/talking.py`. |
| Re-lip-sync an existing clip | `fffiloni/LatentSync` | Video is cut to 10 s, audio to 8 s. |
| Image to short video | `zerogpu-aoti/wan2-2-fp8da-aoti-faster` (Wan 2.2) | Good for product-in-scene motion. Check that the product shape holds. |
| Depth for 2.5D camera moves | Depth Anything V2 small (ONNX), run locally | See pipeline.md. |

## 5. Voice, music, sound effects (ElevenLabs)
- Voice: `creative_list_voices`, then `creative_generate_speech`, then poll `creative_get_flow_run_status`.
  Choose a voice that matches the presenter (gender, age, accent). One take of the whole script
  keeps the prosody natural.
- Music: generate one track with a clear drop; place the drop on the product reveal. Sound effects:
  generate specific foley (typing, window, beep, footsteps).
- Commercial use needs a paid ElevenLabs plan. Tell the user.

## 6. Stock footage (Pexels)
Free for commercial use, but the person filmed must not seem to endorse the product. Prefer hands,
backs, profiles and silhouettes. Download the direct file URL (`videos.pexels.com/video-files/...`)
and record the author and page in CREDITS.md.

## 7. Dead ends to skip
- ElevenLabs video generation: paid plan only.
- Descript avatars: static and watermarked.
- vidIQ video generation: needs credits. Its upload relay is free.
- A "living photo" (blinks plus a camera move, no speech): the user rejected it as fake. Use LeapTalk.
- The HF connector's own Space invocation: disabled. Use the Zapier route above.
- Higgsfield and Canva connectors exist in this workspace but needed reconnecting. If the user
  reconnects Higgsfield, it is a strong alternative for image-to-video and avatars (credits apply).
