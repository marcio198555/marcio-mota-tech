"""Makes the Google Play pictures from the real game.

  store/screens/<lang>/1..6.png   phone screenshots, 1080 x 1920, with a caption
  store/feature-graphic.png        the 1024 x 500 banner shown at the top of the store page

Usage: python3 tools/store.py [lang ...]     (default: en fr pt)
Every picture is a real screen of the game: nothing is drawn by hand.
"""
import base64, os, sys, tempfile, html
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME = 'file://' + os.path.join(ROOT, 'game', 'dist', 'index.html') + '?ads=off&debug'
OUT = os.path.join(ROOT, 'store')
LANGS = [a for a in sys.argv[1:] if not a.startswith('-')] or ['en', 'fr', 'pt']

# Screen inside the picture: 900 x 1520 device pixels.
VW, VH = 390, 659
DSF = 900 / VW

CAPTIONS = {
    'en': [
        ('Free every arrow', 'No timer. No ads in the middle of a level.'),
        ('Not sure? Look first', 'Press and hold to see the path. It is free.'),
        ('Boards of every shape', 'Each one is built to be solvable.'),
        ('A new challenge every day', 'Keep your streak alive.'),
        ('Three stars for a clean run', 'One video gives all your hearts back.'),
        ('Dark or light', 'Colours by direction, or a single colour.'),
    ],
    'fr': [
        ('Libère chaque flèche', 'Pas de chrono. Aucune pub en plein niveau.'),
        ('Un doute ? Regarde d\'abord', 'Garde le doigt appuyé pour voir le chemin. C\'est gratuit.'),
        ('Des plateaux de toutes les formes', 'Chacun est construit pour avoir une solution.'),
        ('Un nouveau défi chaque jour', 'Entretiens ta série.'),
        ('Trois étoiles sans erreur', 'Une vidéo recharge tous tes cœurs.'),
        ('Sombre ou clair', 'Couleurs par direction, ou couleur unique.'),
    ],
    'pt': [
        ('Liberta todas as setas', 'Sem cronómetro. Sem anúncios a meio do nível.'),
        ('Com dúvidas? Vê primeiro', 'Mantém o dedo para veres o caminho. É grátis.'),
        ('Tabuleiros de todas as formas', 'Todos são construídos para terem solução.'),
        ('Um novo desafio todos os dias', 'Mantém a tua série.'),
        ('Três estrelas sem erros', 'Um vídeo devolve todos os corações.'),
        ('Escuro ou claro', 'Cores por direção, ou cor única.'),
    ],
    'es': [
        ('Libera todas las flechas', 'Sin cronómetro. Sin anuncios a mitad de nivel.'),
        ('¿Dudas? Mira primero', 'Mantén el dedo para ver el camino. Es gratis.'),
        ('Tableros de todas las formas', 'Todos se construyen para tener solución.'),
        ('Un reto nuevo cada día', 'Mantén tu racha.'),
        ('Tres estrellas sin errores', 'Un vídeo te devuelve todos los corazones.'),
        ('Oscuro o claro', 'Colores por dirección, o un solo color.'),
    ],
    'de': [
        ('Befreie jeden Pfeil', 'Keine Uhr. Keine Werbung mitten im Level.'),
        ('Unsicher? Erst schauen', 'Finger halten und den Weg sehen. Gratis.'),
        ('Felder in allen Formen', 'Jedes ist so gebaut, dass es lösbar ist.'),
        ('Jeden Tag eine neue Aufgabe', 'Halte deine Serie am Leben.'),
        ('Drei Sterne ohne Fehler', 'Ein Video füllt alle Herzen auf.'),
        ('Dunkel oder hell', 'Farben nach Richtung oder eine einzige Farbe.'),
    ],
    'it': [
        ('Libera ogni freccia', 'Niente cronometro. Niente pubblicità a metà livello.'),
        ('Un dubbio? Prima guarda', 'Tieni premuto per vedere il percorso. È gratis.'),
        ('Griglie di ogni forma', 'Ognuna è costruita per avere una soluzione.'),
        ('Una nuova sfida ogni giorno', 'Mantieni la tua serie.'),
        ('Tre stelle senza errori', 'Un video ricarica tutti i cuori.'),
        ('Scuro o chiaro', 'Colori per direzione, o colore unico.'),
    ],
}

HEAD_XY = """(id) => { const p = __g.play; const a = p.board.get(id); const w = p.level.w; const c = a.cells[a.cells.length - 1];
  const r = document.getElementById('board').getBoundingClientRect();
  return [r.left + __g.view.sx((c % w) + 0.5), r.top + __g.view.sy(Math.floor(c / w) + 0.5)]; }"""

# The blocked arrow with the longest free run in front of it: the nicest path to show.
LONG_BLOCKED = """(() => { const p = __g.play; let best = -1, run = -1;
  for (const a of p.board.arrows) { if (!a) continue; const pr = p.board.probe(a.id);
    if (!pr.free && pr.steps > run) { run = pr.steps; best = a.id; } }
  return best; })()"""

FRAME = """<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;overflow:hidden;font-family:'Poppins','Inter',sans-serif;color:#fff;
  background:radial-gradient(1200px 900px at 50% -10%, #263a8f 0%, #141b3f 45%, #0a0e22 100%)}
.cap{position:absolute;left:70px;right:70px;top:74px;height:250px;display:flex;flex-direction:column;justify-content:center;text-align:center}
h1{font-weight:700;font-size:__SIZE__px;line-height:1.08;letter-spacing:-1.5px}
p{margin-top:20px;font-family:'Inter',sans-serif;font-weight:500;font-size:35px;line-height:1.25;color:#b9c3f2}
.bar{position:absolute;left:50%;top:342px;width:232px;margin-left:-116px;height:8px;display:flex;gap:8px}
.bar i{flex:1;border-radius:4px}
.phone{position:absolute;left:90px;top:384px;width:900px;height:1520px;border-radius:54px;overflow:hidden;
  box-shadow:0 0 0 3px rgba(255,255,255,.14),0 40px 90px rgba(0,0,0,.55)}
.phone img{display:block;width:900px;height:1520px}
</style></head><body>
<div class="cap"><h1>__TITLE__</h1><p>__SUB__</p></div>
<div class="bar"><i style="background:#58C4FF"></i><i style="background:#FFD166"></i><i style="background:#FF6B8B"></i><i style="background:#5FE3A1"></i></div>
<div class="phone"><img src="__IMG__"></div>
</body></html>"""

FEATURE = """<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1024px;height:500px;overflow:hidden;font-family:'Poppins',sans-serif;color:#fff;
  background:radial-gradient(900px 600px at 20% 0%, #2a3f9c 0%, #141b3f 50%, #0a0e22 100%)}
.art{position:absolute;right:-30px;top:-95px;width:640px;height:690px;transform:rotate(-8deg);opacity:.97}
.art img{width:100%;height:100%;object-fit:contain}
.fade{position:absolute;left:0;top:0;width:560px;height:500px;background:linear-gradient(90deg,#10173a 0%,#10173af0 55%,#10173a00 100%)}
.txt{position:absolute;left:64px;top:0;height:500px;display:flex;flex-direction:column;justify-content:center}
h1{font-weight:700;font-size:132px;line-height:1;letter-spacing:-5px}
.bar{margin-top:26px;width:236px;height:9px;display:flex;gap:9px}
.bar i{flex:1;border-radius:5px}
</style></head><body>
<div class="art"><img src="__IMG__"></div>
<div class="fade"></div>
<div class="txt"><h1>Fletch</h1>
<div class="bar"><i style="background:#58C4FF"></i><i style="background:#FFD166"></i><i style="background:#FF6B8B"></i><i style="background:#5FE3A1"></i></div></div>
</body></html>"""


def data_uri(path):
    # Pictures are inlined: a page made on the fly may not read local files.
    with open(path, 'rb') as f:
        return 'data:image/png;base64,' + base64.b64encode(f.read()).decode('ascii')


def main():
    tmp = tempfile.mkdtemp()
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        composer = browser.new_context(viewport={'width': 1080, 'height': 1920}, device_scale_factor=1).new_page()

        for lang in LANGS:
            ctx = browser.new_context(viewport={'width': VW, 'height': VH}, device_scale_factor=DSF,
                                      has_touch=True, is_mobile=True, locale=lang)
            page = ctx.new_page()
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            page.on('pageerror', lambda e: errors.append('PAGEERROR ' + str(e)))
            page.goto(GAME)
            page.wait_for_timeout(1200)
            cdp = ctx.new_cdp_session(page)
            ev = page.evaluate
            # A player who has been at it for a while.
            ev("""(() => { const s = __g.store.data; s.level = 76; s.hints = 5; s.wins = 80; s.seen.peek = true; s.seen.blocked = true; s.seen.zoom = true;
                 const t = __g.today(); for (let k = 1; k <= 6; k++) s.daily.done[String(t - k)] = 3; s.daily.done[String(t - 9)] = 2; s.daily.done[String(t - 10)] = 3;
                 s.daily.streak = 6; s.daily.best = 9; s.daily.last = t - 1; })()""")

            def begin(n):
                ev(f"__g.begin('level', {n}, 0)")
                page.wait_for_timeout(500)

            def free(k, gap=140):
                for _ in range(k):
                    ev("(() => { const p = __g.play; const id = p.board.bestHint(); if (id >= 0) __g.tap(id); })()")
                    page.wait_for_timeout(gap)

            raw = []

            def snap(wait=450):
                page.wait_for_timeout(wait)
                path = os.path.join(tmp, f'{lang}-{len(raw) + 1}.png')
                page.screenshot(path=path)
                raw.append(path)

            # 1. a board in play
            begin(37)
            free(5)
            snap(700)
            # 2. path preview on a blocked arrow
            begin(52)
            free(4)
            page.wait_for_timeout(600)
            x, y = ev(HEAD_XY, ev(LONG_BLOCKED))
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]})
            snap(520)
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            # 3. a shaped board
            begin(75)
            snap(500)
            # 4. the daily challenge
            ev("__g.openDaily()")
            snap(600)
            # 5. three stars
            begin(9)
            ev("__g.play.start -= 41000")  # a believable time on the clock
            left = ev("__g.play.board.remaining")
            free(left, 170)
            snap(2600)
            ev("document.querySelector('#sheet .mbtn.primary') && __g.ui.closeModal(false)")
            # 6. light theme
            ev("__g.change({theme: 'light'})")
            begin(48)
            free(3)
            snap(700)
            ev("__g.change({theme: 'dark'})")
            ctx.close()

            out = os.path.join(OUT, 'screens', lang)
            os.makedirs(out, exist_ok=True)
            for i, path in enumerate(raw):
                title, sub = CAPTIONS[lang][i]
                size = 76 if len(title) <= 22 else (66 if len(title) <= 28 else 58)
                doc = (FRAME.replace('__TITLE__', html.escape(title)).replace('__SUB__', html.escape(sub))
                       .replace('__IMG__', data_uri(path)).replace('__SIZE__', str(size)))
                composer.set_content(doc)
                composer.wait_for_timeout(250)
                composer.screenshot(path=os.path.join(out, f'{i + 1}.png'))
            print(lang, 'ok', len(raw), 'screens')

        # Feature graphic: a real board, without the buttons around it.
        ctx = browser.new_context(viewport={'width': 420, 'height': 460}, device_scale_factor=2, has_touch=True, is_mobile=True, locale='en')
        page = ctx.new_page()
        page.goto(GAME)
        page.wait_for_timeout(1000)
        page.evaluate("__g.store.data.seen.peek = true; __g.store.data.seen.blocked = true; __g.store.data.seen.zoom = true; __g.begin('level', 58, 0)")
        page.add_style_tag(content="html,body,#app{background:transparent!important}#hud-top,#hud-bottom,#banner{display:none!important}")
        page.evaluate("window.dispatchEvent(new Event('resize'))")
        page.wait_for_timeout(700)
        art = os.path.join(tmp, 'art.png')
        page.screenshot(path=art, omit_background=True)
        ctx.close()
        fg = browser.new_context(viewport={'width': 1024, 'height': 500}, device_scale_factor=1).new_page()
        fg.set_content(FEATURE.replace('__IMG__', data_uri(art)))
        fg.wait_for_timeout(300)
        fg.screenshot(path=os.path.join(OUT, 'feature-graphic.png'))
        print('feature graphic ok')
        browser.close()
    if errors:
        print('CONSOLE ERRORS:', errors[:5])
        sys.exit(1)


if __name__ == '__main__':
    main()
