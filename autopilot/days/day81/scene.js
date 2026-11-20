// Vidéo 81 — clé « USB 3.2 » : peut-être 5 Gbit/s seulement (USB-IF, Kingston DataTraveler Kyson). Chiffres : days/day81/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, bars, head, comment } = KIT;
  const END = E('s15') + 0.6;
  // clé USB dessinée (sans logo), connecteur à gauche
  function stick(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    roundRect(ctx, -250, -50, 110, 100, 8); ctx.fillStyle = '#b9c2d3'; ctx.fill();
    ctx.fillStyle = '#5a6578'; ctx.fillRect(-225, -25, 26, 18); ctx.fillRect(-180, -25, 26, 18);
    roundRect(ctx, -150, -75, 380, 150, 34); ctx.fillStyle = o.body || '#2b3446'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = '#59657e'; ctx.stroke();
    ctx.beginPath(); ctx.arc(190, 0, 18, 0, 7); ctx.fillStyle = '#060b14'; ctx.fill();
    if (o.label) text(ctx, o.label, 20, 4, { size: 52, weight: 900, family: F.mono, color: GOLD, maxWidth: 300 });
    ctx.restore();
  }
  // compteur de débit (barre horizontale)
  function gauge(ctx, x, y, w, frac, col, label, t, t0) {
    const k = ease.out(prog(t, t0, 0.6));
    roundRect(ctx, x, y, w, 56, 28); ctx.fillStyle = '#0a1120'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#3a4560'; ctx.stroke();
    const iw = Math.max(0, (w - 12) * frac * k); if (iw > 4) { roundRect(ctx, x + 6, y + 6, iw, 44, 22); ctx.fillStyle = col; ctx.fill(); }
    if (label) text(ctx, label, x + w / 2, y + 100, { size: 44, weight: 900, color: col });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thinking_face', 'magnifying_glass_tilted_left', 'package', 'label', 'warning', 'stopwatch', 'laptop', 'link', 'check_mark_button', 'clipboard']),
    draw(ctx, t) {
      background(ctx, t);
      // s01 — image 0 : clé + 20 Gbit/s ?
      block(ctx, t, 0, S('s02'), () => {
        head(ctx, 'TA CLÉ « USB 3.2 »', 350, t, undefined, { size: 56, color: GOLD });
        stick(ctx, 500, 560, 1.1 + 0.02 * Math.sin(t * 2), { label: 'USB 3.2' });
        big(ctx, '20', 380, 860, t, undefined, { size: 220, color: GOLD });
        line(ctx, 'Gbit/s', 380, 1010, undefined, undefined, { size: 64, weight: 900, color: WHITE, dx: 0 });
        big(ctx, '?', 740, 880, t, undefined, { size: 220, color: RED });
      });
      // s02 — peut-être 5
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'PAS FORCÉMENT', 500, 400, t, S('s02'), { size: 80 });
        big(ctx, '5', 500, 720, t, f('s02', 0.45), { size: 240, color: RED });
        line(ctx, 'Gbit/s AU MAXIMUM ?', 500, 900, t, f('s02', 0.55), { size: 60, weight: 900, color: WHITE, dx: 0 });
      });
      // s03 — promesse
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'À LA FIN, TU SAURAS…', 500, 380, t, S('s03'), { size: 44, color: CYAN });
        CHR.emo(ctx, 'package', 500, 680, 280, t, S('s03') + 0.1);
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 700, 800, 170, t, f('s03', 0.4));
        line(ctx, 'QUOI CHERCHER SUR LA BOÎTE', 500, 1000, t, f('s03', 0.5), { size: 54, weight: 900, color: GOLD, dx: 0 });
      });
      // s04 — USB-IF : 3 vitesses
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, "USB-IF · L'ORGANISME DE LA NORME", 500, 360, t, S('s04'), { size: 40, color: GOLD });
        big(ctx, 'USB 3.2', 500, 560, t, S('s04') + 0.1, { size: 130, color: WHITE });
        big(ctx, '= 3 VITESSES', 500, 760, t, f('s04', 0.5), { size: 100, color: CYAN });
      });
      // s05 — Gen 1 / Gen 2 / Gen 2x2
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'USB 3.2 · SELON USB-IF', 500, 360, t, S('s05'), { size: 42, color: GOLD });
        [['Gen 1', '5 Gbit/s', 0.25, RED, 0.0], ['Gen 2', '10 Gbit/s', 0.5, GOLD, 0.33], ['Gen 2x2', '20 Gbit/s', 1, GREEN, 0.62]].forEach(([g, v, fr, col, u], i) => {
          const t0 = f('s05', u), y = 500 + i * 200;
          line(ctx, g, 220, y + 28, t, t0, { size: 52, weight: 900, color: WHITE, dx: 0 });
          if (t >= t0) gauge(ctx, 360, y, 560, fr, col, null, t, t0);
          line(ctx, v, 640, y + 110, t, t0 + 0.2, { size: 50, weight: 900, color: col, dx: 0 });
        });
      });
      // s06 — pas pour les boîtes
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'USB-IF (GUIDE, JANV. 2024)', 500, 360, t, S('s06'), { size: 40, color: C.muted });
        pop(ctx, t, S('s06') + 0.1, 500, 640, () => { panel(ctx, -380, -170, 760, 340);
          text(ctx, '« USB 3.2 »', 0, -60, { size: 90, weight: 900, family: F.mono, color: WHITE });
          text(ctx, 'pas fait pour les boîtes', 0, 50, { size: 48, weight: 800, color: RED });
          text(ctx, 'ni la pub', 0, 115, { size: 48, weight: 800, color: RED }); });
        CHR.emo(ctx, 'warning', 500, 960, 170, t, f('s06', 0.55));
      });
      // s07 — exemple Kingston Kyson
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'KINGSTON DATATRAVELER KYSON', 500, 360, t, S('s07'), { size: 40, color: GOLD });
        stick(ctx, 500, 600, 1, { body: '#3a3f4a' });
        pop(ctx, t, f('s07', 0.45), 500, 900, () => { panel(ctx, -360, -80, 720, 160);
          text(ctx, 'FICHE : USB 3.2 Gen 1', 0, 4, { size: 54, weight: 900, color: WHITE }); });
      });
      // s08 — 5 Gbit/s max
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'Gen 1 = SIGNAL À', 500, 380, t, S('s08'), { size: 46, color: CYAN });
        big(ctx, '5 Gbit/s', 500, 620, t, S('s08') + 0.1, { size: 150, color: RED });
        line(ctx, 'AU MAXIMUM', 500, 790, t, f('s08', 0.5), { size: 60, weight: 900, color: WHITE, dx: 0 });
        gauge(ctx, 220, 900, 640, 0.25, RED, 'sur 20', t, f('s08', 0.4));
      });
      // s09 — lecture 200 Mo/s
      block(ctx, t, S('s09'), S('s10'), () => {
        tag(ctx, 'LECTURE · FICHE KINGSTON', 500, 360, t, S('s09'), { size: 42, color: GOLD });
        CHR.emo(ctx, 'stopwatch', 500, 560, 200, t, S('s09') + 0.05);
        line(ctx, "JUSQU'À", 500, 740, t, f('s09', 0.35), { size: 50, weight: 900, color: C.muted, dx: 0 });
        big(ctx, '200 Mo/s', 500, 880, t, f('s09', 0.4), { size: 140, color: WHITE });
      });
      // s10 — × 8 = 1,6 Gbit/s
      block(ctx, t, S('s10'), S('s11'), () => {
        calc(ctx, ['200 Mo/s × 8', '= 1,6 Gbit/s'], 500, 540, t, [S('s10') + 0.05, f('s10', 0.3)], { lastSize: 110, color: GOLD });
        gauge(ctx, 220, 900, 640, 1.6 / 20, GOLD, 'loin de 20 Gbit/s', t, f('s10', 0.55));
      });
      // s11 — écriture 60 Mo/s
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'ÉCRITURE · DÈS 128 Go', 500, 360, t, S('s11'), { size: 44, color: CYAN });
        big(ctx, '60 Mo/s', 500, 620, t, S('s11') + 0.15, { size: 150, color: CYAN });
        line(ctx, 'lecture : 200 Mo/s', 500, 820, t, f('s11', 0.5), { size: 50, weight: 900, color: C.muted, dx: 0 });
      });
      // s12 — 2e piège : port plus lent
      block(ctx, t, S('s12'), S('s13'), () => {
        stamp(ctx, '2e PIÈGE', 500, 380, t, S('s12'), { size: 80, color: GOLD });
        CHR.emo(ctx, 'laptop', 300, 700, 240, t, S('s12') + 0.1);
        stick(ctx, 700, 700, 0.6, { body: '#3a3f4a' });
        line(ctx, 'PORT PLUS LENT', 500, 920, t, f('s12', 0.4), { size: 56, weight: 900, color: WHITE, dx: 0 });
        line(ctx, '→ ELLE SUIT LE PLUS LENT', 500, 1020, t, f('s12', 0.6), { size: 52, weight: 900, color: RED, dx: 0 });
      });
      // s13 — conseil
      block(ctx, t, S('s13'), S('s14'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 360, t, S('s13'), { size: 46, color: GREEN });
        pop(ctx, t, S('s13') + 0.1, 500, 720, () => { panel(ctx, -380, -230, 760, 460);
          text(ctx, 'CHERCHE LES Mo/s', 0, -140, { size: 50, weight: 900, color: GOLD }); });
        line(ctx, '✓ LECTURE', 500, 700, t, f('s13', 0.35), { size: 60, weight: 900, color: WHITE, dx: 0 });
        line(ctx, '✓ ÉCRITURE', 500, 810, t, f('s13', 0.5), { size: 60, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s14'), S('s15'), () => { comment(ctx, t, S('s14'), ['Ta clé', 'écrit à combien', 'de Mo/s ?'], { color: GOLD }); });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'CE SOIR', next: ['Suisse contre France :', 'Spotify Premium'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
