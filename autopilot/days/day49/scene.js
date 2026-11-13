// Vidéo 49 — TV 65 pouces : largeur réelle. Chiffres : days/day49/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, tv, head, comment } = KIT;
  const END = E('s13') + 0.6;
  // flèche cotée entre (x1,y1) et (x2,y2), avec texte
  function dim(ctx, x1, y1, x2, y2, label, col, k = 1, o = {}) {
    if (k <= 0.01) return;
    const xe = lerp(x1, x2, k), ye = lerp(y1, y2, k);
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(xe, ye); ctx.stroke();
    const a = Math.atan2(ye - y1, xe - x1);
    [[x1, y1, a + Math.PI], [xe, ye, a]].forEach(([x, y, b]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 30 * Math.cos(b - 0.45), y - 30 * Math.sin(b - 0.45)); ctx.lineTo(x - 30 * Math.cos(b + 0.45), y - 30 * Math.sin(b + 0.45)); ctx.closePath(); ctx.fill(); });
    ctx.restore();
    if (label && k > 0.9) text(ctx, label, (x1 + x2) / 2 + (o.dx || 0), (y1 + y2) / 2 + (o.dy || -50), { size: o.size || 70, weight: 900, family: F.mono, color: col, stroke: 'rgba(0,0,0,0.7)' });
  }
  const TX = 500, TY = 760, TW = 820, TH = TW * 0.6;
  function screen(ctx, t, on = 1) { tv(ctx, TX, TY, TW, { on, led: false }); }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thinking_face', 'television', 'clipboard', 'warning', 'eyes', 'couch_and_lamp']),
    draw(ctx, t) {
      background(ctx, t);
      block(ctx, t, 0, S('s02'), () => {
        big(ctx, '65"', 500, 400, t, undefined, { size: 170, color: GOLD });
        const z = 1 + 0.02 * Math.sin(t * 2); ctx.save(); ctx.translate(500, 760); ctx.scale(z, z); ctx.translate(-500, -760); screen(ctx, t); ctx.restore();
        dim(ctx, TX - TW / 2, TY + TH / 2 + 110, TX + TW / 2, TY + TH / 2 + 110, '165 cm ?', RED, 1, { dy: 80, size: 84 });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        screen(ctx, t);
        stamp(ctx, 'NON', 500, 400, t, S('s02'), { size: 110 });
        const k = ease.out(prog(t, f('s02', 0.4), 0.6));
        dim(ctx, TX - TW / 2 + 20, TY + TH / 2 - 20, TX + TW / 2 - 20, TY - TH / 2 + 20, '165 cm', GOLD, k, { dx: -110, dy: -110, size: 80 });
        tag(ctx, 'LA DIAGONALE', 500, 1110, t, f('s02', 0.6), { size: 52, color: GOLD });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        screen(ctx, t, 0.6);
        const k = ease.inOut(prog(t, S('s03') + 0.1, 1.0));
        dim(ctx, TX - TW / 2 + 20, TY + TH / 2 - 20, TX + TW / 2 - 20, TY - TH / 2 + 20, '', GOLD, k);
        [[TX - TW / 2 + 20, TY + TH / 2 - 20], [TX + TW / 2 - 20, TY - TH / 2 + 20]].forEach(([x, y], i) => { const p = clamp((t - S('s03') - i * 0.5) * 3); ctx.save(); ctx.globalAlpha *= p; ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(x, y, 22 + 6 * Math.sin(t * 6), 0, 7); ctx.fill(); ctx.restore(); });
        line(ctx, "D'UN COIN À L'AUTRE", 500, 340, t, S('s03'), { size: 64, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        CHR.emo(ctx, 'television', 500, 470, 260, t, S('s04'));
        calc(ctx, ['1 pouce = 2,54 cm', '65 × 2,54', '= 165,1 cm'], 500, 700, t, [S('s04') + 0.05, f('s04', 0.45), f('s04', 0.7)], { lastSize: 130 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'FORMAT 16:9', 500, 360, t, S('s05'), { size: 48, color: CYAN });
        pop(ctx, t, S('s05') + 0.1, 500, 560, () => { ctx.strokeStyle = CYAN; ctx.lineWidth = 6; ctx.strokeRect(-320, -180, 640, 360); text(ctx, '16', 0, 225, { size: 60, weight: 900, color: CYAN }); text(ctx, '9', 365, 0, { size: 60, weight: 900, color: CYAN }); });
        line(ctx, 'largeur =', 500, 860, t, f('s05', 0.35), { size: 62, family: F.mono, weight: 700, dx: 0 });
        line(ctx, 'diagonale × 16 / √337', 500, 960, t, f('s05', 0.5), { size: 60, family: F.mono, weight: 700, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        screen(ctx, t);
        const k = ease.out(prog(t, S('s06') + 0.1, 0.6));
        dim(ctx, TX - TW / 2, TY + TH / 2 + 100, TX + TW / 2, TY + TH / 2 + 100, '143,9 cm', GREEN, k, { dy: 80, size: 90 });
        tag(ctx, 'CALCUL · LARGEUR DE L\'ÉCRAN', 500, 340, t, S('s06'), { size: 40, color: GREEN });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'FICHE OFFICIELLE LG · OLED65C54LA', 500, 360, t, S('s07'), { size: 38, color: GOLD });
        pop(ctx, t, S('s07') + 0.15, 500, 680, () => { panel(ctx, -380, -200, 760, 400); text(ctx, 'SANS PIED', 0, -120, { size: 44, weight: 800, color: C.muted }); text(ctx, '1 441 × 826 mm', 0, -10, { size: 76, family: F.mono, weight: 700, color: WHITE }); text(ctx, 'largeur × hauteur', 0, 90, { size: 40, weight: 700, color: C.muted }); });
        big(ctx, '144,1 cm', 500, 1010, t, f('s07', 0.6), { size: 120, color: GOLD });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        big(ctx, '143,9', 290, 600, t, S('s08'), { size: 110, color: GREEN }); big(ctx, '144,1', 710, 600, t, S('s08') + 0.15, { size: 110, color: GOLD });
        tag(ctx, 'CALCUL', 290, 720, t, S('s08'), { size: 38 }); tag(ctx, 'FICHE', 710, 720, t, S('s08') + 0.15, { size: 38 });
        stamp(ctx, '+ 2 mm', 500, 930, t, f('s08', 0.4), { size: 90, color: CYAN, rot: 0 });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, 'VERDICT', 500, 340, t, S('s09'), { size: 70, color: GOLD });
        big(ctx, '≈ 144 cm', 500, 600, t, f('s09', 0.2), { size: 160, color: GREEN });
        big(ctx, '165 cm', 500, 860, t, f('s09', 0.55), { size: 110, color: RED, glow: false });
        const k = ease.out(prog(t, f('s09', 0.65), 0.3)); if (k > 0) { ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(300, 860); ctx.lineTo(300 + 400 * k, 860); ctx.stroke(); ctx.restore(); }
        tag(ctx, 'DE LARGE', 500, 1010, t, f('s09', 0.4), { size: 42 });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        // meuble + TV + mètre
        tv(ctx, 500, 590, 560, { on: 0.7, led: false });
        roundRect(ctx, 170, 860, 660, 120, 14); ctx.fillStyle = '#6b4a2f'; ctx.fill();
        dim(ctx, 170, 1040, 830, 1040, 'TON MEUBLE ?', GOLD, ease.out(prog(t, f('s10', 0.2), 0.6)), { dy: 70, size: 56 });
        tag(ctx, 'LARGEUR SANS PIED · SUR LA FICHE', 500, 340, t, f('s10', 0.45), { size: 38, color: GREEN });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'BONUS', 500, 340, t, S('s11'), { size: 46, color: CYAN });
        tv(ctx, 500, 640, 700, { on: 1, led: false });
        big(ctx, '55"', 500, 640, t, S('s11') + 0.1, { size: 150, color: WHITE });
        dim(ctx, 150, 920, 850, 920, '121,8 cm', CYAN, ease.out(prog(t, f('s11', 0.4), 0.5)), { dy: 80, size: 80 });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Ton meuble TV,', 'combien de large ?', '??? cm'], { color: GOLD }); });
      block(ctx, t, S('s13'), END + 1, () => followCTA(ctx, t, S('s13'), { when: 'CE SOIR', next: ['ampoule allumée toute la nuit :', 'combien en francs ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
