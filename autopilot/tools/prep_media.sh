#!/bin/bash
# prep_media.sh NN : copie la vidéo finale dans media/ (réencodée crf 24), fait la Story et le Reel d'essai, commit + push.
set -e
D=$1; R=/home/claude/marcio-mota-tech; cd $R
S=$(python3 -c "import json;print(json.load(open('autopilot/days/day$D/draft.json'))['slug'])")
ffmpeg -v error -y -i /home/claude/studio/day$D/day${D}_final.mp4 -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p -c:a copy -movflags +faststart media/day${D}_$S.mp4
bash autopilot/tools/story.sh $D | tail -1
bash autopilot/tools/reel_cut.sh $D | tail -1
git add media/day${D}_$S.mp4 media/stories/day${D}_story.mp4 media/reels/day${D}_reel.mp4 autopilot/days/day$D
git commit -qm "Jour $D : vidéo, Story et Reel d'essai"
git pull -q --rebase origin tiktok-autopilot && git push -q origin tiktok-autopilot
echo "BASE https://raw.githubusercontent.com/marcio198555/marcio-mota-tech/$(git rev-parse HEAD)"
echo "V media/day${D}_$S.mp4  public_id tiktok-autopilot/day${D}_$S"
