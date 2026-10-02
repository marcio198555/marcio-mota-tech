// Renders the transparent overlay composition to RGBA PNGs (omitBackground) so it can be
// composited over real footage.
//   node render_ov.js stills <html> <outdir> <t1,t2,...>
//   node render_ov.js frames <html> <outdir> <fps> <i0> <i1>
const { chromium } = require('playwright-core');
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
  const [file, query] = html.split('?');                     // e.g. overlay/index.html?noavatar
  await page.goto('file://' + path.resolve(file) + (query ? '?' + query : ''));
  await page.waitForFunction(() => window.ready !== undefined);
  await page.evaluate(() => window.ready);
  return { browser, page };
}

(async () => {
  const [mode, html, out, a, b, c] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const { browser, page } = await open(html);
  const shot = async (t, file) => {
    await page.evaluate((tt) => window.renderFrame(tt), t);
    await page.screenshot({ path: file, omitBackground: true });
  };
  const started = Date.now();
  if (mode === 'stills') {
    for (const t of a.split(',').map(Number)) await shot(t, path.join(out, `o_${t.toFixed(2)}.png`));
  } else if (mode === 'frames') {
    const fps = Number(a), i0 = Number(b), i1 = Number(c);
    for (let i = i0; i < i1; i++) {
      await shot(i / fps, path.join(out, `o_${String(i).padStart(5, '0')}.png`));
      if ((i - i0) % 50 === 0) console.log(`[${i0}-${i1}] frame ${i}  ${((Date.now() - started) / 1000).toFixed(0)}s`);
    }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
