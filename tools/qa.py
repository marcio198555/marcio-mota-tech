"""Layout check in every language: no text may be cut off or spill out of the screen.

Opens the main screens in the 6 languages on a small and a regular phone and
reports any visible element that is wider than its box or leaves the viewport.
Usage: python3 tools/qa.py
"""
import os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'file://' + os.path.join(ROOT, 'game', 'dist', 'index.html') + '?ads=off&debug'
LANGS = ['en', 'fr', 'pt', 'es', 'de', 'it']
SIZES = [(320, 568), (360, 740), (412, 915)]

OVERFLOW = """() => {
  const bad = [];
  const vw = window.innerWidth, vh = window.innerHeight;
  const all = document.querySelectorAll('#app *');
  for (const el of all) {
    if (el.id === 'board' || el.tagName === 'CANVAS' || el.tagName === 'svg' || el.closest('svg')) continue;
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    let hiddenParent = false;
    for (let p = el.parentElement; p; p = p.parentElement) { const ps = getComputedStyle(p); if (ps.display === 'none' || ps.visibility === 'hidden') { hiddenParent = true; break; } }
    if (hiddenParent) continue;
    const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (!own) continue;
    const text = el.textContent.trim().slice(0, 40);
    let clipped = false;
    for (let p = el.parentElement; p && p.id !== 'app'; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (ps.overflowX === 'visible') continue;
      const pr = p.getBoundingClientRect();
      if (r.right > pr.right + 1 || r.left < pr.left - 1) { clipped = true; break; }
    }
    if (clipped) { bad.push('cut off by its box: ' + text); continue; }
    if (el.id === 'h-name' && r.height > 30) { bad.push('level name on two lines: ' + text); continue; }
    if (r.right > vw + 1 || r.left < -1) bad.push('outside screen: ' + text);
    else if (el.scrollWidth > el.clientWidth + 1 && st.overflowX !== 'visible') bad.push('cut off: ' + text);
    else if (r.bottom > vh + 1 && !el.closest('.scroll, #scr-levels, #scr-settings, #scr-daily, #sheet')) bad.push('below screen: ' + text);
  }
  return bad;
}"""


def main():
    problems = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for lang in LANGS:
            for (w, h) in SIZES:
                ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, has_touch=True, is_mobile=True, locale=lang)
                page = ctx.new_page()
                errs = []
                page.on('pageerror', lambda e: errs.append(str(e)))
                page.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
                page.goto(URL)
                page.wait_for_timeout(900)
                ev = page.evaluate

                def check(name):
                    page.wait_for_timeout(350)
                    for b in ev(OVERFLOW):
                        problems.append(f'{lang} {w}x{h} [{name}] {b}')

                check('home')
                ev("__g.store.data.daily.streak = 12; __g.store.data.daily.best = 31; __g.store.data.daily.last = __g.today() - 1")
                ev("__g.begin('level', 1, 0)"); check('level 1 tip')
                ev("__g.begin('level', 2, 0)"); check('level 2 tip')
                ev("__g.begin('level', 3, 0)"); check('level 3 tip (hold)')
                ev("__g.store.data.seen.peek = true; __g.begin('level', 60, 0)"); check('level 60 expert + zoom tip')
                ev("__g.store.data.hints = 0; __g.play.freeHint = false; __g.hint()"); check('hint offer')
                ev("__g.ui.closeModal(false)")
                # lose all hearts
                ev("""(() => { const p = __g.play; for (let k = 0; k < 3; k++) { for (const a of p.board.arrows) { if (a && !p.board.isFree(a.id)) { __g.tap(a.id); break; } } } })()""")
                page.wait_for_timeout(1300); check('out of hearts')
                ev("__g.ui.closeModal(false)")
                ev("__g.begin('level', 4, 0)")
                left = ev("__g.play.board.remaining")
                for _ in range(left):
                    ev("__g.tap(__g.play.board.bestHint())"); page.wait_for_timeout(90)
                page.wait_for_timeout(1500); check('win')
                ev("__g.ui.closeModal(false)")
                ev("__g.openDaily()"); check('daily')
                ev("__g.openSettings()"); check('settings')
                ev("__g.howTo()"); check('how to play')
                ev("__g.ui.closeModal(false)")
                ev("__g.askReset()"); check('reset question')
                ev("__g.ui.closeModal(false)")
                ev("__g.store.data.level = 137; __g.openLevels()"); check('levels')
                for e in errs:
                    problems.append(f'{lang} {w}x{h} console: {e[:120]}')
                ctx.close()
        browser.close()
    seen = set()
    for pr in problems:
        if pr not in seen:
            seen.add(pr); print(pr)
    print(f'{len(seen)} problem(s) in {len(LANGS) * len(SIZES)} language/size combinations')
    sys.exit(1 if seen else 0)


if __name__ == '__main__':
    main()
