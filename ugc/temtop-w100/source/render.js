// Frame-accurate renderer: drives window.renderFrame(t) in headless Chromium and
// pipes screenshots into ffmpeg (or saves stills for review).
//   node render.js stills <html> <outdir> <t1,t2,...>
//   node render.js video  <html> <out.mp4> [fps] [t0] [t1]
const { chromium } = require('playwright-core');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

async function open(html) {
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--allow-file-access-from-files', '--disable-web-security', '--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'],
  });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  await page.goto('file://' + path.resolve(html));
  await page.waitForFunction(() => window.ready !== undefined);
  await page.evaluate(() => window.ready);
  return { browser, page };
}

async function stills(html, outdir, times) {
  fs.mkdirSync(outdir, { recursive: true });
  const { browser, page } = await open(html);
  for (const t of times) {
    await page.evaluate((tt) => window.renderFrame(tt), t);
    await page.screenshot({ path: path.join(outdir, `f_${t.toFixed(2)}.png`) });
  }
  await browser.close();
}

async function video(html, out, fps = 30, t0 = 0, t1 = null) {
  const { browser, page } = await open(html);
  const dur = t1 ?? (await page.evaluate(() => window.DUR));
  const n = Math.round((dur - t0) * fps);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
    '-profile:v', 'high', '-level', '4.2', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const started = Date.now();
  for (let i = 0; i < n; i++) {
    const t = t0 + i / fps;
    await page.evaluate((tt) => window.renderFrame(tt), t);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 60 === 0) console.log(`frame ${i}/${n}  t=${t.toFixed(2)}s  ${((Date.now() - started) / 1000).toFixed(0)}s elapsed`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
  console.log(`done: ${n} frames in ${((Date.now() - started) / 1000).toFixed(0)}s -> ${out}`);
}

// Numbered PNG frames [i0, i1) — lets several workers render one timeline in parallel.
async function frames(html, outdir, fps, i0, i1) {
  fs.mkdirSync(outdir, { recursive: true });
  const { browser, page } = await open(html);
  const started = Date.now();
  for (let i = i0; i < i1; i++) {
    await page.evaluate((tt) => window.renderFrame(tt), i / fps);
    await page.screenshot({ path: path.join(outdir, `f_${String(i).padStart(5, '0')}.png`) });
    if ((i - i0) % 50 === 0) console.log(`[${i0}-${i1}] frame ${i}  ${((Date.now() - started) / 1000).toFixed(0)}s`);
  }
  await browser.close();
}

(async () => {
  const [mode, html, out, a, b, c] = process.argv.slice(2);
  if (mode === 'frames') await frames(html, out, Number(a), Number(b), Number(c));
  else if (mode === 'stills') await stills(html, out, a.split(',').map(Number));
  else if (mode === 'video') await video(html, out, a ? Number(a) : 30, b ? Number(b) : 0, c ? Number(c) : null);
  else { console.error('usage: render.js stills|video ...'); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
