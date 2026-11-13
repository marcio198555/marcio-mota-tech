// Vidéo 25 — chauffage : un degré de moins (SuisseEnergie). Chiffres : days/day25/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, calc, thermometer, coin, coins, duelFrame, head, comment } = KIT;
  const HOT = '#ff7a45', COOL = '#5aa9ff';
  const END = E('s14') + 0.6;
  // vanne thermostatique vue de face : graduation * 1 2 3 4 5, repère qui tourne
  function valve(ctx, x, y, r, pos, o = {}) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = '#d9dde6'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
    ctx.lineWidth = r * 0.06; ctx.strokeStyle = '#9aa3b5'; ctx.stroke();
    for (let i = 0; i < 18; i++) { ctx.save(); ctx.rotate(i * Math.PI / 9); ctx.fillStyle = '#b8bfcc'; ctx.fillRect(-r * 0.03, -r * 0.98, r * 0.06, r * 0.16); ctx.restore(); }
    const labels = ['*', '1', '2', '3', '4', '5'];
    labels.forEach((l, i) => { const a = (i - pos) * Math.PI * 0.3; const hl = Math.abs(i - pos) < 0.5;
      text(ctx, l, Math.sin(a) * r * 0.62, -Math.cos(a) * r * 0.62, { size: r * (hl ? 0.34 : 0.24), weight: 900, color: hl ? (o.color || RED) : '#3a4252' }); });
    ctx.restore();
    ctx.fillStyle = o.color || RED; ctx.beginPath(); ctx.moveTo(x, y - r - 6); ctx.lineTo(x - 22, y - r - 44); ctx.lineTo(x + 22, y - r - 44); ctx.closePath(); ctx.fill();
  }
  function radiator(ctx, x, y, w, heat) {
    const n = 7, cw = w / n; ctx.save(); ctx.translate(x - w / 2, y);
    for (let i = 0; i < n; i++) { roundRect(ctx, i * cw + 4, 0, cw - 8, 190, 14); ctx.fillStyle = `rgb(${lerp(200, 255, heat)},${lerp(205, 160, heat)},${lerp(215, 120, heat)})`; ctx.fill(); }
    ctx.restore();
  }
  function room(ctx, cx, temp, col, t, o = {}) {
    big(ctx, temp + ' °C', cx, 590, t, o.t0, { size: 96, color: col });
    thermometer(ctx, cx, 950, 270, (temp - 14) / 10, col);
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thinking_face', 'money_bag', 'bed', 'bathtub', 'couch_and_lamp', 'warning', 'eyes']),
    draw(ctx, t) {
      background(ctx, t);
      block(ctx, t, 0, S('s02'), () => {
        head(ctx, 'COMBIEN IL GAGNE ?', 360, t, undefined, { size: 58, color: HOT });
        duelFrame(ctx, { y0: 470 });
        room(ctx, 275, 21, HOT, t); room(ctx, 725, 20, COOL, t);
        radiator(ctx, 275, 1075 + 6 * Math.sin(t * 2), 300, 0.9); radiator(ctx, 725, 1075, 300, 0.6);
        text(ctx, '?', 500, 820, { size: 120, weight: 900, color: GOLD, alpha: 0.6 + 0.4 * Math.sin(t * 5) });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        valve(ctx, 500, 720, 250, 3 + 1.2 * Math.sin((t - S('s02')) * 2.5));
        line(ctx, 'SUR QUEL CHIFFRE ?', 500, 1080, t, f('s02', 0.3), { size: 70, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        pop(ctx, t, S('s03') + 0.05, 500, 640, () => { panel(ctx, -360, -170, 720, 340, { border: RED }); text(ctx, 'SUISSE', 0, -60, { size: 84, weight: 900, color: WHITE }); text(ctx, 'ÉNERGIE', 0, 40, { size: 84, weight: 900, color: RED }); });
        tag(ctx, 'CONFÉDÉRATION · OFEN', 500, 900, t, f('s03', 0.45), { size: 40, color: GOLD });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        line(ctx, '1 °C EN MOINS', 500, 420, t, S('s04'), { size: 76, weight: 900, color: COOL, dx: 0 });
        big(ctx, '−6 %', 500, 680, t, f('s04', 0.4), { size: 240, color: GREEN });
        tag(ctx, 'DE FRAIS DE CHAUFFAGE', 500, 900, t, f('s04', 0.55), { size: 42 });
        tag(ctx, 'SUISSEENERGIE, 2021', 500, 1000, t, f('s04', 0.7), { size: 36, color: GOLD });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        stamp(ctx, 'EXEMPLE', 500, 380, t, S('s05'), { size: 56, color: GOLD, rot: -0.04 });
        calc(ctx, ['1 000 CHF / an', '× 6 %', '= 60 CHF'], 500, 530, t, [f('s05', 0.15), f('s05', 0.4), f('s05', 0.65)], { lastSize: 150 });
        coins(ctx, t, f('s05', 0.72), 4, 250, 750, 1180, 'CHF');
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        stamp(ctx, 'EXEMPLE', 500, 380, t, S('s06'), { size: 56, color: GOLD, rot: -0.04 });
        big(ctx, '60 CHF', 500, 560, t, undefined, { size: 170, color: GREEN });
        line(ctx, 'POUR 1 SEUL DEGRÉ', 500, 760, t, S('s06') + 0.1, { size: 64, weight: 900, dx: 0 });
        stamp(ctx, 'RIEN À ACHETER', 500, 960, t, f('s06', 0.5), { size: 60, color: GREEN });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        line(ctx, '1 °C EN PLUS', 500, 420, t, S('s07'), { size: 76, weight: 900, color: HOT, dx: 0 });
        big(ctx, '+6 %', 500, 680, t, f('s07', 0.4), { size: 240, color: RED });
        thermometer(ctx, 860, 860, 300, 0.5 + 0.4 * ease.out(prog(t, f('s07', 0.3), 0.8)), HOT);
        tag(ctx, 'SUISSEENERGIE : 6 À 10 % PAR DEGRÉ EN PLUS', 470, 1080, t, f('s07', 0.6), { size: 36, color: GOLD });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        stamp(ctx, 'SURPRISE', 500, 380, t, S('s08'), { size: 76 });
        CHR.emo(ctx, 'bed', 500, 650, 300, t, f('s08', 0.2));
        big(ctx, '17 °C', 380, 1000, t, f('s08', 0.5), { size: 130, color: COOL });
        line(ctx, 'pas 20', 740, 1000, t, f('s08', 0.65), { size: 70, weight: 900, color: RED, dx: 0 });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        CHR.emo(ctx, 'couch_and_lamp', 270, 640, 260, t, S('s09'));
        big(ctx, '20 °C', 270, 900, t, f('s09', 0.2), { size: 110, color: GOLD });
        valve(ctx, 700, 700, 190, 3, { color: GOLD });
        tag(ctx, 'POSITION 3', 700, 1000, t, f('s09', 0.5), { size: 44, color: GOLD });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        const k = ease.inOut(prog(t, f('s10', 0.45), 0.4));
        valve(ctx, 500, 650, 210, lerp(2, 4, k), { color: k < 0.5 ? COOL : HOT });
        CHR.emo(ctx, 'bed', 230, 1000, 170, t, S('s10')); line(ctx, '17 °C · 2', 230, 1130, t, S('s10') + 0.1, { size: 50, weight: 900, color: COOL, dx: 0 });
        CHR.emo(ctx, 'bathtub', 770, 1000, 170, t, f('s10', 0.45)); line(ctx, '23 °C · 4', 770, 1130, t, f('s10', 0.5), { size: 50, weight: 900, color: HOT, dx: 0 });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'CHAUFFAGE CENTRAL · RÈGLE GÉNÉRALE', 500, 380, t, S('s11'), { size: 36, color: GOLD });
        // courbe de chauffe qui descend
        const k = ease.inOut(prog(t, f('s11', 0.3), 0.7));
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(150, 480); ctx.lineTo(150, 840); ctx.lineTo(860, 840); ctx.stroke();
        ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.strokeStyle = HOT; ctx.beginPath(); ctx.moveTo(170, 520 + 120 * k); ctx.lineTo(840, 760 + 60 * k); ctx.stroke(); ctx.restore();
        big(ctx, 'COURBE −3 °C', 500, 960, t, f('s11', 0.35), { size: 86, color: HOT, family: F.display });
        big(ctx, 'PIÈCE −1 °C', 500, 1090, t, f('s11', 0.65), { size: 86, color: COOL, family: F.display });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Ta vanne,', 'sur quel chiffre ?', '* 1 2 3 4 5'], { color: GOLD }); });
      block(ctx, t, S('s13'), S('s14'), () => {
        head(ctx, '60 CHF D\'ÉCART · EXEMPLE', 360, t, f('s13', 0.4), { size: 52, color: GREEN });
        duelFrame(ctx, { y0: 470 });
        room(ctx, 275, 21, HOT, t); room(ctx, 725, 20, COOL, t);
        radiator(ctx, 275, 1075, 300, 0.9); radiator(ctx, 725, 1075, 300, 0.6);
      });
      block(ctx, t, S('s14'), END + 1, () => followCTA(ctx, t, S('s14'), { when: 'CE SOIR', next: ['micro-ondes : pourquoi le centre', 'de ton plat reste froid ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
