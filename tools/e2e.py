"""End-to-end test: plays the built game in a phone-sized browser with real
touches and checks every flow. Exit code 1 on any failure.

Usage: python3 tools/e2e.py
"""
import os, sys, json
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'file://' + os.path.join(ROOT, 'game', 'dist', 'index.html') + '?debug'
fails = []
errors = []
passed = 0


def check(cond, label):
    global passed
    if cond:
        passed += 1
        print('  ok   ' + label)
    else:
        fails.append(label)
        print('  FAIL ' + label)


HEAD_XY = """(id) => { const p = __g.play; const a = p.board.get(id); const w = p.level.w; const c = a.cells[a.cells.length - 1];
  const r = document.getElementById('board').getBoundingClientRect();
  return [r.left + __g.view.sx((c % w) + 0.5), r.top + __g.view.sy(Math.floor(c / w) + 0.5)]; }"""
BODY_XY = """(id) => { const p = __g.play; const a = p.board.get(id); const w = p.level.w; const c = a.cells[0];
  const r = document.getElementById('board').getBoundingClientRect();
  return [r.left + __g.view.sx((c % w) + 0.5), r.top + __g.view.sy(Math.floor(c / w) + 0.5)]; }"""


def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        ctx = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2,
                                  has_touch=True, is_mobile=True, locale='fr-CH')
        page = ctx.new_page()
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append('PAGEERROR ' + str(e)))
        page.goto(URL)
        page.wait_for_timeout(800)
        ev = page.evaluate

        def tap_arrow(aid, tail=False):
            x, y = ev(BODY_XY if tail else HEAD_XY, aid)
            page.touchscreen.tap(x, y)

        def solve_by_touch(gap=70, limit=400):
            n = 0
            while ev("__g.play && !__g.play.done") and n < limit:
                aid = ev("__g.play.board.bestHint()")
                before = ev("__g.play.board.remaining")
                tap_arrow(aid, tail=(n % 2 == 1))
                page.wait_for_timeout(gap)
                if ev("__g.play.board.remaining") != before - 1:
                    return False
                n += 1
            return True

        print('home')
        check(page.is_visible('#a-play'), 'home screen shows the play button')
        check('Jouer' in page.inner_text('#a-play'), 'French is picked from the phone language')
        page.tap('#a-play')
        page.wait_for_timeout(300)
        check(ev("__g.play.kind === 'level' && __g.play.n === 1"), 'play starts level 1')
        check(page.is_visible('#banner'), 'level 1 shows the how-to tip')
        check(ev("__g.view.hint >= 0"), 'level 1 highlights a free arrow')

        print('level 1 by touch')
        check(solve_by_touch(), 'every touch on a free arrow removes it (head and tail)')
        page.wait_for_timeout(2000)
        check(page.is_visible('#modal'), 'win dialog appears')
        check(len(page.query_selector_all('#sheet .stars i.on')) == 3, 'three stars without mistakes')
        check(ev("__g.store.data.level") == 2, 'level 2 is unlocked')
        page.tap('#sheet .mbtn.primary')
        page.wait_for_timeout(400)
        check(ev("__g.play.n") == 2, 'next level button starts level 2')

        print('blocked arrow')
        blocked = ev("(() => { const p = __g.play; for (const a of p.board.arrows) if (a && !p.board.isFree(a.id)) return a.id; return -1; })()")
        check(blocked >= 0, 'level 2 has a blocked arrow')
        tap_arrow(blocked)
        page.wait_for_timeout(200)
        check(ev("__g.play.hearts") == 2, 'touching a blocked arrow costs one heart')
        check(ev("__g.play.board.get(%d) !== null" % blocked), 'the blocked arrow stays on the board')
        check(ev("__g.store.data.seen.blocked"), 'the blocked tip is shown once')
        page.wait_for_timeout(600)

        print('forgiving touch')
        res = ev("""(() => { const p = __g.play; const w = p.level.w; const v = __g.view; const r = document.getElementById('board').getBoundingClientRect();
          // find a free arrow cell next to a blocked arrow cell, then touch the border between them
          for (const a of p.board.arrows) { if (!a || !p.board.isFree(a.id)) continue;
            for (const c of a.cells) { const x = c % w, y = Math.floor(c / w);
              for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy;
                if (nx < 0 || ny < 0 || nx >= w || ny >= p.level.h) continue;
                const o = p.board.owner[ny * w + nx];
                if (o >= 0 && o !== a.id && !p.board.isFree(o)) {
                  const px = v.sx(x + 0.5 + dx * 0.5), py = v.sy(y + 0.5 + dy * 0.5);
                  return { free: a.id, picked: v.pick(px, py) }; } } } }
          return null; })()""")
        check(res is None or res['picked'] == res['free'], 'a touch between a free and a blocked arrow picks the free one')

        print('running out of hearts')
        for _ in range(2):
            b = ev("(() => { const p = __g.play; for (const a of p.board.arrows) if (a && !p.board.isFree(a.id)) return a.id; return -1; })()")
            tap_arrow(b)
            page.wait_for_timeout(500)
        page.wait_for_timeout(900)
        check(ev("__g.play.hearts") == 0 and page.is_visible('#modal'), 'no hearts left opens the dialog')
        check(len(page.query_selector_all('#sheet .mbtn')) == 2, 'dialog offers a video and a retry')
        page.tap('#sheet .mbtn.primary')
        page.wait_for_timeout(300)
        check(page.is_visible('#veil'), 'demo notice shows where the video ad plays')
        page.wait_for_timeout(2400)
        check(ev("__g.play.hearts") == 3 and not ev("__g.play.over"), 'video gives all the hearts back')

        print('hints')
        ev("__g.store.data.hints = 0")
        ev("__g.play.freeHint = true; __g.refreshHints()")
        check(page.inner_text('#b-hint-n') == '1', 'badge counts the free hint of the level')
        page.tap('#b-hint')
        page.wait_for_timeout(150)
        hinted = ev("__g.view.hint")
        check(hinted >= 0 and ev("__g.play.board.isFree(%d)" % hinted), 'hint points at an arrow that can leave')
        check(page.inner_text('#b-hint-n') == '0', 'free hint is used up')
        tap_arrow(hinted)
        page.wait_for_timeout(250)
        page.tap('#b-hint')
        page.wait_for_timeout(250)
        check(page.is_visible('#modal'), 'no hints left opens the offer')
        page.tap('#sheet .mbtn.primary')
        page.wait_for_timeout(2700)
        check(ev("__g.store.data.hints") == 1 and ev("__g.view.hint") >= 0, 'video gives two hints and uses one at once')

        print('ad break between levels')
        ev("__g.store.data.wins = 5; __g.store.data.ads = { lastAt: 0, since: 2 }")
        check(solve_by_touch(), 'level 2 can be finished')
        page.wait_for_timeout(2000)
        page.tap('#sheet .mbtn.primary')
        page.wait_for_timeout(250)
        check(page.is_visible('#veil'), 'ad break notice shows between two levels')
        page.wait_for_timeout(1800)
        check(ev("__g.play.n") == 3 and not page.is_visible('#veil'), 'level 3 starts after the break')
        check(ev("__g.store.data.ads.since") == 0, 'ad counter is reset')
        ev("__g.begin('level', 4, 0)")
        page.wait_for_timeout(200)
        check(solve_by_touch(), 'level 4 can be finished')
        page.wait_for_timeout(2000)
        page.tap('#sheet .mbtn.primary')
        page.wait_for_timeout(300)
        check(not page.is_visible('#veil'), 'no second ad break right after the first')

        print('zoom')
        ev("__g.begin('level', 60, 0)")
        page.wait_for_timeout(300)
        page.mouse.move(195, 420)
        page.mouse.wheel(0, -400)
        page.wait_for_timeout(200)
        check(ev("__g.view.zoomed"), 'wheel or pinch zooms the board')
        aid = ev("__g.play.board.bestHint()")
        x, y = ev(HEAD_XY, aid)
        if 0 < x < 390 and 90 < y < 740:
            before = ev("__g.play.board.remaining")
            page.touchscreen.tap(x, y)
            page.wait_for_timeout(150)
            check(ev("__g.play.board.remaining") == before - 1, 'touches still land on the right arrow when zoomed')
        page.tap('#b-fit')
        page.wait_for_timeout(150)
        check(not ev("__g.view.zoomed"), 'fit button resets the zoom')

        print('back and persistence')
        page.keyboard.press('Escape')
        page.wait_for_timeout(300)
        check(page.is_visible('#a-play'), 'back returns to the home screen')
        level_before = ev("__g.store.data.level")
        ev("__g.store.flush()")
        page.reload()
        page.wait_for_timeout(700)
        check(ev("__g.store.data.level") == level_before and level_before >= 5, 'progress survives closing the game')

        print('daily challenge')
        page.tap('#a-daily')
        page.wait_for_timeout(250)
        check(page.is_visible('#d-play'), 'daily screen opens')
        page.tap('#d-play')
        page.wait_for_timeout(300)
        check(ev("__g.play.kind === 'daily'"), 'daily board starts')
        ev("(() => { const p = __g.play; let g = 0; while (p.board.remaining > 0 && g++ < 2000) __g.tap(p.board.bestHint()); })()")
        page.wait_for_timeout(2600)
        check(page.is_visible('#modal') and ev("__g.store.data.daily.streak") == 1, 'daily win is recorded with a streak of 1')
        page.tap('#sheet .mbtn.primary')
        page.wait_for_timeout(300)
        check(page.query_selector('#a-daily .done') is not None, 'home shows the daily challenge as done')

        print('settings')
        page.tap('#a-settings')
        page.wait_for_timeout(200)
        page.select_option('#s-lang', 'en')
        page.wait_for_timeout(200)
        check('Settings' in page.inner_text('#scr-settings h2'), 'language switches at once')
        page.tap('#s-theme [data-v=light]')
        page.wait_for_timeout(150)
        check(ev("document.documentElement.dataset.theme") == 'light', 'theme switches to day')
        page.tap('#s-howto')
        page.wait_for_timeout(200)
        check(page.is_visible('#modal') and len(page.query_selector_all('#sheet .lines li')) == 5, 'how to play lists five rules')
        page.keyboard.press('Escape')
        page.wait_for_timeout(150)
        check(not page.is_visible('#modal'), 'back closes a dialog')
        page.tap('#s-reset')
        page.wait_for_timeout(150)
        page.tap('#sheet .mbtn.danger')
        page.wait_for_timeout(300)
        check(ev("__g.store.data.level") == 1 and ev("__g.store.data.settings.theme") == 'light', 'erase resets progress but keeps settings')

        print('levels list')
        ev("__g.store.data.level = 40; __g.openLevels()")
        page.wait_for_timeout(250)
        check(len(page.query_selector_all('.tile')) == 40, 'level list shows every unlocked level')
        page.tap('.tile[data-n="17"]')
        page.wait_for_timeout(250)
        check(ev("__g.play.n") == 17, 'a finished level can be replayed')

        print('small and wide screens')
        for (w, h) in [(320, 568), (360, 640), (412, 915), (800, 1280), (915, 412)]:
            page.set_viewport_size({'width': w, 'height': h})
            ev("__g.begin('level', 200, 0)")
            page.wait_for_timeout(250)
            box = ev("""(() => { const v = __g.view, l = __g.play.level; const t = document.getElementById('hud-top').offsetHeight, b = document.getElementById('hud-bottom').offsetHeight;
              return { x0: v.sx(0), x1: v.sx(l.w), y0: v.sy(0), y1: v.sy(l.h), top: t, bottom: window.innerHeight - b, w: window.innerWidth }; })()""")
            ok = box['x0'] >= 0 and box['x1'] <= box['w'] and box['y0'] >= box['top'] - 1 and box['y1'] <= box['bottom'] + 1
            check(ok, f'big board fits between the bars at {w}x{h}')
        browser.close()

    check(not errors, 'no console error' + ('' if not errors else ': ' + json.dumps(errors[:5], ensure_ascii=False)))
    print(f'\n{passed} passed, {len(fails)} failed')
    sys.exit(1 if fails else 0)


main()
