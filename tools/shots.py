"""Drives the built game in a real browser (phone-sized) and saves screenshots.

Usage: python3 tools/shots.py [outdir] [--lang fr]
Prints any console error, so it doubles as a smoke test.
"""
import sys, os, json, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else os.path.join(ROOT, 'shots')
LANG = sys.argv[sys.argv.index('--lang') + 1] if '--lang' in sys.argv else 'fr'
os.makedirs(OUT, exist_ok=True)
URL = 'file://' + os.path.join(ROOT, 'game', 'dist', 'index.html') + '?ads=off&debug'

errors = []


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2,
                                  has_touch=True, is_mobile=True, locale=LANG)
        page = ctx.new_page()
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append('PAGEERROR ' + str(e)))
        page.goto(URL)
        page.wait_for_timeout(1500)

        def shot(name, wait=350):
            page.wait_for_timeout(wait)
            page.screenshot(path=os.path.join(OUT, name + '.png'))

        shot('01-home', 900)

        def begin(n):
            page.evaluate(f"__g.begin('level', {n}, 0)")

        def tap_free(k=1, gap=120):
            for _ in range(k):
                page.evaluate("(() => { const p = __g.play; const id = p.board.bestHint(); if (id >= 0) __g.tap(id); })()")
                page.wait_for_timeout(gap)

        def tap_blocked():
            return page.evaluate("""(() => { const p = __g.play; for (const a of p.board.arrows) { if (a && !p.board.isFree(a.id)) { __g.tap(a.id); return a.id; } } return -1; })()""")

        begin(1); shot('02-level1', 600)
        begin(2); shot('03-level2', 500)
        begin(12); shot('04-level12', 500)
        begin(37); shot('05-level37', 500)
        tap_free(6); shot('06-level37-playing', 60)
        tap_blocked(); shot('07-level37-bump', 140)
        shot('08-level37-after-bump', 700)
        page.evaluate("__g.hint()"); shot('09-level37-hint', 400)
        begin(75); shot('10-level75-heart', 500)
        begin(100); shot('11-level100-expert', 500)
        begin(200); shot('12-level200-big', 500)

        # win a small level for the dialog
        begin(5)
        page.wait_for_timeout(300)
        n = page.evaluate("__g.play.total")
        tap_free(n, 90)
        shot('13-win', 1900)
        page.evaluate("__g.ui.closeModal(false)")

        # fail dialog
        begin(37)
        page.wait_for_timeout(300)
        for _ in range(3):
            tap_blocked(); page.wait_for_timeout(520)
        shot('14-fail', 900)
        page.evaluate("__g.ui.closeModal(false)")

        page.evaluate("__g.openLevels()"); shot('15-levels', 400)
        page.evaluate("__g.openDaily()"); shot('16-daily', 400)
        page.evaluate("__g.begin('daily', 0, __g.today())"); shot('17-daily-board', 600)
        page.evaluate("__g.openSettings()"); shot('18-settings', 400)
        page.evaluate("__g.howTo()"); shot('19-howto', 400)
        page.evaluate("__g.ui.closeModal(false)")
        page.evaluate("__g.change({theme: 'light'})"); shot('20-settings-light', 400)
        begin(37); shot('21-level37-light', 500)
        page.evaluate("__g.change({colors: 'mono'})")
        begin(37); shot('22-level37-light-mono', 500)
        page.evaluate("__g.change({theme: 'dark', colors: 'dir'})")
        page.evaluate("__g.showHome()"); shot('23-home-again', 1200)
        browser.close()
    print('screenshots in', OUT)
    print('console errors:', json.dumps(errors[:10], ensure_ascii=False) if errors else 'none')


main()
