// Rendu image par image d'une scène canvas en vidéo (Playwright + ffmpeg).
// node render.js --scene scene.js --timeline timeline.json --out video.mp4 [--fps 30] [--duration s]
//                [--stills 0,1.5,3 --stillsDir dir]   (images de contrôle au lieu de la vidéo)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const scene = path.resolve(opt('scene'));
const timeline = JSON.parse(fs.readFileSync(path.resolve(opt('timeline')), 'utf8'));
const out = opt('out') ? path.resolve(opt('out')) : null;
const fps = Number(opt('fps', 30));
const stills = opt('stills') ? opt('stills').split(',').map(Number) : null;
const stillsDir = path.resolve(opt('stillsDir', 'stills'));
const engine = path.join(__dirname, 'engine.js');

const IN = '/usr/share/fonts/opentype/inter/';
const faces = [
  ['InterDisplay', 'InterDisplay-Black.otf', 900], ['InterDisplay', 'InterDisplay-ExtraBold.otf', 800],
  ['InterDisplay', 'InterDisplay-Bold.otf', 700], ['InterDisplay', 'InterDisplay-SemiBold.otf', 600],
  ['InterText', 'Inter-Regular.otf', 400], ['InterText', 'Inter-Medium.otf', 500], ['InterText', 'Inter-SemiBold.otf', 600],
  ['InterText', 'Inter-Bold.otf', 700], ['InterText', 'Inter-ExtraBold.otf', 800]
];
let css = faces.map(([fam, file, w]) => `@font-face{font-family:"${fam}";src:url("file://${IN}${file}");font-weight:${w};}`).join('\n');
css += `\n@font-face{font-family:"MonoData";src:url("file:///usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf");font-weight:700;}`;
css += `\n@font-face{font-family:"MonoData";src:url("file:///usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf");font-weight:400;}`;
css += `\n@font-face{font-family:"EmojiColor";src:url("file:///usr/share/fonts/truetype/noto/NotoColorEmoji.ttf");}`;
const loads = faces.map(([fam, , w]) => `${w} 40px "${fam}"`).concat(['700 40px "MonoData"', '400 40px "MonoData"', '40px "EmojiColor"']);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}
html,body{margin:0;background:#000;overflow:hidden} canvas{display:block}</style></head>
<body><canvas id="c" width="1080" height="1920"></canvas>
<script>window.TL = ${JSON.stringify(timeline)};</script>
<script src="file://${engine}"></script>
<script src="file://${scene}"></script>
<script>
window.__ready = (async () => { await Promise.all(${JSON.stringify(loads)}.map(f => document.fonts.load(f, 'AZaz09%°🌧👇'))); return true; })();
window.renderFrame = (t, frame) => {
  const ctx = document.getElementById('c').getContext('2d');
  ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.filter = 'none';
  SCENE.draw(ctx, t, frame); ENG.grainPass(ctx, frame);
};
</script></body></html>`;

(async () => {
  const tmp = path.join(path.dirname(scene), '.render.html');
  fs.writeFileSync(tmp, html);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
  page.on('pageerror', e => console.error('[pageerror]', e.message));
  await page.goto('file://' + tmp);
  await page.evaluate(() => window.__ready);
  const duration = Number(opt('duration', 0)) || await page.evaluate(() => SCENE.duration);
  const shot = () => page.screenshot({ type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: 1080, height: 1920 } });

  if (stills) {
    fs.mkdirSync(stillsDir, { recursive: true });
    for (const t of stills) {
      await page.evaluate(([t, f]) => window.renderFrame(t, f), [t, Math.round(t * fps)]);
      fs.writeFileSync(path.join(stillsDir, `t${t.toFixed(2)}.jpg`), await shot());
    }
    console.log('stills', stills.length, '->', stillsDir);
  } else {
    const n = Math.ceil(duration * fps);
    const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let i = 0; i < n; i++) {
      await page.evaluate(([t, f]) => window.renderFrame(t, f), [i / fps, i]);
      const buf = await shot();
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log(`frame ${i}/${n} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log('video', out, n, 'frames', ((Date.now() - t0) / 1000).toFixed(0), 's');
  }
  await browser.close();
  fs.unlinkSync(tmp);
})().catch(e => { console.error(e); process.exit(1); });
