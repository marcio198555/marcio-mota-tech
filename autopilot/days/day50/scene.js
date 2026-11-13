// Vidéo 50 — batterie externe 10 000 mAh : combien de recharges (calcul Anker, Pixel 9a). Chiffres : days/day50/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect, phone } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, battery, head, comment } = KIT;
  const END = E('s13') + 0.6;
  function bank(ctx, x, y, s, label, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    roundRect(ctx, -140, -240, 280, 480, 40); ctx.fillStyle = '#232b3b'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#46526b'; ctx.stroke();
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-60 + i * 40, 170, 10, 0, 7); ctx.fillStyle = i < (o.leds ?? 4) ? GREEN : '#3a4458'; ctx.fill(); }
    text(ctx, label, 0, -40, { size: 62, weight: 900, family: F.mono, color: GOLD, maxWidth: 250 });
    text(ctx, 'mAh', 0, 30, { size: 46, weight: 800, color: WHITE });
    ctx.restore();
  }
  function phones(ctx, n, y, t, t0, col) {
    for (let i = 0; i < n; i++) { const k = ease.back(prog(t, t0 + i * 0.25, 0.3)); if (k <= 0) continue;
      ctx.save(); ctx.translate(260 + i * 240, y); ctx.scale(k, k); phone(ctx, 0, 0, 170, 320, { draw: (x, yy, w, h) => { ctx.fillStyle = col; ctx.fillRect(x, yy + h * 0.3, w, h * 0.7); } }); ctx.restore(); }
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['battery', 'low_battery', 'high_voltage', 'magnifying_glass_tilted_left', 'mobile_phone', 'thinking_face', 'check_mark_button']),
    draw(ctx, t) {
      background(ctx, t);
      block(ctx, t, 0, S('s02'), () => {
        bank(ctx, 300, 780, 1.1 + 0.02 * Math.sin(t * 2), '10 000');
        big(ctx, '= 3', 720, 640, t, undefined, { size: 170, color: GOLD });
        line(ctx, 'RECHARGES', 720, 790, undefined, undefined, { size: 56, weight: 900, color: WHITE, dx: 0 });
        big(ctx, '?', 720, 980, t, undefined, { size: 170, color: RED });
        head(ctx, 'TA BATTERIE EXTERNE', 380, t, undefined, { size: 56, color: GOLD });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'NON', 500, 400, t, S('s02'), { size: 110 });
        phones(ctx, 1, 720, t, f('s02', 0.2), GREEN);
        pop(ctx, t, f('s02', 0.5), 500, 720, () => { phone(ctx, 0, 0, 170, 320, { draw: (x, y, w, h) => { ctx.fillStyle = GOLD; ctx.fillRect(x, y + h * 0.82, w, h * 0.18); } }); });
        line(ctx, '1 RECHARGE + UN PETIT BOUT', 500, 1000, t, f('s02', 0.6), { size: 56, weight: 900, color: GREEN, dx: 0 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        bank(ctx, 280, 760, 0.9, '10 000');
        line(ctx, 'DANS LES CELLULES', 700, 600, t, S('s03'), { size: 50, weight: 900, color: GOLD, dx: 0 });
        big(ctx, '3,7 V', 700, 720, t, S('s03') + 0.15, { size: 110, color: GOLD });
        line(ctx, 'SORTIE USB', 700, 880, t, f('s03', 0.5), { size: 50, weight: 900, color: CYAN, dx: 0 });
        big(ctx, '5 V', 700, 1000, t, f('s03', 0.6), { size: 110, color: CYAN });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'CALCUL PUBLIÉ PAR ANKER', 500, 360, t, S('s04'), { size: 42, color: GOLD });
        calc(ctx, ['10 000 mAh × 3,7 V', '= 37 Wh'], 500, 600, t, [S('s04') + 0.1, f('s04', 0.5)], { lastSize: 150 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        calc(ctx, ['37 Wh ÷ 5 V', '= 7 400 mAh'], 500, 560, t, [S('s05') + 0.05, f('s05', 0.4)], { lastSize: 140, color: CYAN });
        tag(ctx, 'À LA SORTIE, EN 5 V', 500, 900, t, f('s05', 0.6), { size: 40 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        CHR.emo(ctx, 'high_voltage', 500, 520, 220, t, S('s06'));
        big(ctx, '82 %', 500, 760, t, f('s06', 0.35), { size: 170, color: GOLD });
        tag(ctx, 'RENDEMENT TYPIQUE · ANKER', 500, 920, t, f('s06', 0.5), { size: 40 });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        calc(ctx, ['7 400 × 0,82', '≈ 6 000 mAh'], 500, 540, t, [S('s07') + 0.05, f('s07', 0.35)], { lastSize: 140, color: GREEN });
        battery(ctx, 500, 980, 380, 0.6 * ease.out(prog(t, f('s07', 0.4), 0.6)), { color: GREEN });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'GOOGLE PIXEL 9A · FICHE OFFICIELLE', 500, 360, t, S('s08'), { size: 38, color: GOLD });
        phone(ctx, 330, 760, 260, 500, { draw: (x, y, w, h) => { ctx.fillStyle = BLUE; ctx.fillRect(x, y + h * 0.15, w, h * 0.85); } });
        big(ctx, '5 100', 720, 700, t, f('s08', 0.3), { size: 130, color: WHITE });
        line(ctx, 'mAh', 720, 820, t, f('s08', 0.4), { size: 60, weight: 900, dx: 0 });
        tag(ctx, 'TYPIQUE', 720, 920, t, f('s08', 0.5), { size: 38 });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, 'VERDICT', 500, 380, t, S('s09'), { size: 70, color: GOLD });
        big(ctx, '6 000 ÷ 5 100', 500, 580, t, f('s09', 0.1), { size: 90, color: WHITE });
        big(ctx, '1 RECHARGE', 500, 760, t, f('s09', 0.3), { size: 130, color: GREEN, family: F.display });
        line(ctx, 'pas 2 · Anker le dit aussi', 500, 920, t, f('s09', 0.55), { size: 54, weight: 900, color: RED, dx: 0 });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 360, t, S('s10'), { size: 44, color: GREEN });
        pop(ctx, t, S('s10') + 0.15, 500, 700, () => { panel(ctx, -360, -220, 720, 440); text(ctx, 'FICHE TECHNIQUE', 0, -140, { size: 44, weight: 800, color: C.muted });
          text(ctx, 'Capacité nominale', 0, -30, { size: 58, weight: 900, color: GREEN }); text(ctx, '(rated capacity)', 0, 50, { size: 44, weight: 700, color: WHITE }); text(ctx, 'pas le gros chiffre', 0, 140, { size: 46, weight: 800, color: RED }); });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'BONUS · SELON ANKER', 500, 360, t, S('s11'), { size: 42, color: CYAN });
        CHR.emo(ctx, 'check_mark_button', 500, 620, 260, t, S('s11') + 0.1);
        line(ctx, 'PRESQUE TOUT TÉLÉPHONE ACTUEL', 500, 870, t, f('s11', 0.3), { size: 50, weight: 900, dx: 0 });
        line(ctx, 'AU MOINS 1 FOIS', 500, 960, t, f('s11', 0.45), { size: 66, weight: 900, color: GREEN, dx: 0 });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Ta batterie,', 'combien de recharges', 'en vrai ?'], { color: GOLD }); });
      block(ctx, t, S('s13'), END + 1, () => followCTA(ctx, t, S('s13'), { when: 'CE SOIR', next: ['un robot aspirateur chaque', 'jour : combien en francs ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
