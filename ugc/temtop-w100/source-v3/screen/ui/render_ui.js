// Render the W100 screen replica: node render_ui.js <page> <scene> <dur> <fps> <outdir> [stillTimes]
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path');
(async () => {
  const [page_, scene, dur, fps, out, stills] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files', '--font-render-hinting=none', '--force-color-profile=srgb'] });
  const page = await browser.newPage({ viewport: { width: 1024, height: 600 }, deviceScaleFactor: 2 });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  await page.goto('file://' + path.resolve(__dirname, 'index.html') + `?page=${page_}&scene=${scene}${process.env.NOTOUCH ? '&notouch=1' : ''}`);
  await page.waitForFunction(() => window.ready !== undefined); await page.evaluate(() => window.ready);
  const times = stills ? stills.split(',').map(Number) : [...Array(Math.round(Number(dur) * Number(fps))).keys()].map((i) => i / Number(fps));
  for (let i = 0; i < times.length; i++) {
    await page.evaluate((t) => window.renderFrame(t), times[i]);
    await page.screenshot({ path: path.join(out, stills ? `s_${times[i].toFixed(2)}.png` : `f_${String(i).padStart(4, '0')}.png`) });
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
