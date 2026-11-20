// Vidéo 83 — lampe torche « 10 000 lumens » : mesurés comment ? (ANSI/PLATO FL1, fiche Fenix LR35R). Chiffres : days/day83/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, head, comment, clock } = KIT;
  const END = E('s15') + 0.6;
  // lampe torche dessinée, faisceau vers la droite ; beam = intensité 0..1
  function torch(ctx, x, y, s, beam, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    if (beam > 0) { const g = ctx.createLinearGradient(110, 0, 620, 0); g.addColorStop(0, `rgba(255,244,190,${0.75 * beam})`); g.addColorStop(1, 'rgba(255,244,190,0)');
      ctx.beginPath(); ctx.moveTo(110, -70); ctx.lineTo(620, -260); ctx.lineTo(620, 260); ctx.lineTo(110, 70); ctx.closePath(); ctx.fillStyle = g; ctx.fill(); }
    roundRect(ctx, -230, -48, 250, 96, 22); ctx.fillStyle = '#2b3242'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#4b5670'; ctx.stroke();
    for (let i = 0; i < 6; i++) { ctx.fillStyle = '#394257'; ctx.fillRect(-200 + i * 32, -48, 14, 96); }
    ctx.beginPath(); ctx.moveTo(20, -55); ctx.lineTo(110, -80); ctx.lineTo(110, 80); ctx.lineTo(20, 55); ctx.closePath(); ctx.fillStyle = '#353e52'; ctx.fill(); ctx.stroke();
    roundRect(ctx, 104, -80, 16, 160, 6); ctx.fillStyle = `rgba(255,248,210,${0.4 + 0.6 * beam})`; ctx.fill();
    roundRect(ctx, -110, -66, 50, 20, 8); ctx.fillStyle = RED; ctx.fill();
    ctx.restore();
  }
  // courbe schématique de lumière dans le temps (pas de valeurs mesurées) ; pts = [[x0..1, y0..1], ...]
  function curve(ctx, x, y, w, h, pts, t, t0, col, o = {}) {
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke();
    const k = ease.inOut ? ease.inOut(prog(t, t0, 1.2)) : prog(t, t0, 1.2);
    ctx.beginPath(); pts.forEach(([u, v], i) => { const px = x + w * u, py = y + h * (1 - v); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
    ctx.lineWidth = 10; ctx.strokeStyle = col; ctx.setLineDash([w * 2 * k, w * 4]); ctx.stroke(); ctx.restore();
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['flashlight', 'stopwatch', 'thermometer', 'magnifying_glass_tilted_left', 'check_mark_button', 'warning', 'fire', 'label']),
    draw(ctx, t) {
      background(ctx, t);
      // s01 : image 0 — lampe + 10 000 lumens + ?
      block(ctx, t, 0, S('s02'), () => {
        head(ctx, 'TA LAMPE TORCHE', 360, t, undefined, { size: 56 });
        torch(ctx, 330, 560, 0.95, 0.9 + 0.1 * Math.sin(t * 6));
        big(ctx, '10 000', 470, 820, t, undefined, { size: 190, color: GOLD });
        line(ctx, 'LUMENS', 470, 960, undefined, undefined, { size: 70, weight: 900, color: WHITE });
        big(ctx, '?', 880, 690, t, undefined, { size: 180, color: RED });
        line(ctx, 'PENDANT COMBIEN DE TEMPS ?', 500, 1110, t, 0.8, { size: 52, weight: 900, color: GOLD, dx: 0 });
      });
      // s02 : NON
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'NON', 500, 400, t, S('s02'), { size: 110 });
        CHR.emo(ctx, 'stopwatch', 500, 680, 260, t, S('s02') + 0.15);
        line(ctx, "PAS TOUTE L'AUTONOMIE", 500, 920, t, f('s02', 0.4), { size: 58, weight: 900, color: RED, dx: 0 });
        line(ctx, 'DE LA FICHE', 500, 1000, t, f('s02', 0.5), { size: 58, weight: 900, color: WHITE, dx: 0 });
      });
      // s03 : promesse, astérisque
      block(ctx, t, S('s03'), S('s04'), () => {
        line(ctx, 'À LA FIN :', 500, 400, t, S('s03'), { size: 58, weight: 900, color: GOLD, dx: 0 });
        big(ctx, '*', 500, 700, t, S('s03') + 0.15, { size: 360, color: GOLD });
        line(ctx, 'TURBO 1 h 25 *', 500, 960, t, f('s03', 0.4), { size: 72, weight: 900, family: F.mono, color: WHITE, dx: 0 });
      });
      // s04 : norme, 30 s – 2 min
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'NORME ANSI/PLATO FL1', 500, 360, t, S('s04'), { size: 44, color: CYAN });
        clock(ctx, 500, 640, 170, (t - S('s04')) * 2);
        big(ctx, '30 s → 2 min', 500, 930, t, f('s04', 0.35), { size: 110, color: GOLD });
        line(ctx, "après l'allumage", 500, 1050, t, f('s04', 0.5), { size: 46, weight: 800, color: C.muted, dx: 0 });
      });
      // s05 : autonomie jusqu'à 10 %
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'AUTONOMIE SELON FL1', 500, 360, t, S('s05'), { size: 42, color: CYAN });
        curve(ctx, 170, 470, 680, 420, [[0, 1], [0.2, 0.92], [0.5, 0.6], [0.8, 0.3], [1, 0.1]], t, S('s05') + 0.1, GOLD);
        line(ctx, '100 % à 30 s', 330, 450, t, S('s05') + 0.2, { size: 40, weight: 800, color: WHITE, dx: 0 });
        line(ctx, 'fin : 10 %', 660, 860, t, f('s05', 0.6), { size: 44, weight: 900, color: RED, dx: 0 });
        line(ctx, 'schéma', 500, 1000, t, S('s05') + 0.1, { size: 40, weight: 800, color: 'rgba(255,255,255,0.8)', dx: 0 });
      });
      // s06 : 10 % de 10 000
      block(ctx, t, S('s06'), S('s07'), () => {
        calc(ctx, ['10 % × 10 000 lm', '= 1 000 lm'], 500, 560, t, [S('s06') + 0.05, f('s06', 0.4)], { lastSize: 112, color: RED });
        torch(ctx, 330, 1000, 0.6, 0.12);
      });
      // s07 : Fenix LR35R
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'EXEMPLE RÉEL · FICHE FENIX LR35R', 500, 360, t, S('s07'), { size: 38, color: GOLD });
        torch(ctx, 300, 560, 0.75, 1);
        big(ctx, '10 000 lm', 500, 800, t, f('s07', 0.3), { size: 120, color: GOLD });
        big(ctx, 'TURBO : 1 h 25 *', 500, 970, t, f('s07', 0.55), { size: 72, color: WHITE });
      });
      // s08 : astérisque
      block(ctx, t, S('s08'), S('s09'), () => {
        pop(ctx, t, S('s08') + 0.1, 500, 680, () => { panel(ctx, -400, -260, 800, 520, { border: GOLD });
          text(ctx, '* FICHE FENIX', 0, -180, { size: 44, weight: 900, color: GOLD });
          text(ctx, 'autonomie turbo', 0, -80, { size: 54, weight: 800, color: WHITE });
          text(ctx, 'y compris les niveaux', 0, 10, { size: 54, weight: 800, color: WHITE });
          text(ctx, 'RÉDUITS', 0, 110, { size: 80, weight: 900, color: RED });
          text(ctx, '(température, protection)', 0, 200, { size: 42, weight: 700, color: C.muted }); });
      });
      // s09 : 65 °C
      block(ctx, t, S('s09'), S('s10'), () => {
        CHR.emo(ctx, 'thermometer', 300, 640, 260, t, S('s09'));
        big(ctx, '65 °C', 620, 600, t, f('s09', 0.2), { size: 120, color: RED });
        line(ctx, 'puissance ↓', 640, 760, t, f('s09', 0.45), { size: 64, weight: 900, color: WHITE, dx: 0 });
        line(ctx, 'selon Fenix', 500, 980, t, f('s09', 0.55), { size: 44, weight: 800, color: C.muted, dx: 0 });
      });
      // s10 : surprise — fort 3 000 lm : 1 h 35 > turbo
      block(ctx, t, S('s10'), S('s11'), () => {
        stamp(ctx, 'SURPRISE', 500, 380, t, S('s10'), { size: 64, color: GOLD });
        const k1 = ease.out(prog(t, f('s10', 0.2), 0.6)), k2 = ease.out(prog(t, f('s10', 0.45), 0.6));
        text(ctx, 'TURBO 10 000 lm', 160, 540, { size: 44, weight: 900, color: GOLD, align: 'left' });
        roundRect(ctx, 160, 575, 640 * (85 / 95) * k1, 70, 16); ctx.fillStyle = GOLD; ctx.fill();
        if (k1 > 0.8) text(ctx, '1 h 25', 175 + 640 * (85 / 95) - 20, 612, { size: 48, weight: 900, family: F.mono, color: '#071018', align: 'right' });
        if (k2 > 0) { text(ctx, 'FORT 3 000 lm', 160, 730, { size: 44, weight: 900, color: GREEN, align: 'left' });
          roundRect(ctx, 160, 765, 640 * k2, 70, 16); ctx.fillStyle = GREEN; ctx.fill();
          if (k2 > 0.8) text(ctx, '1 h 35', 780, 802, { size: 48, weight: 900, family: F.mono, color: '#071018', align: 'right' }); }
        line(ctx, 'plus long que le turbo', 500, 960, t, f('s10', 0.7), { size: 54, weight: 900, color: WHITE, dx: 0 });
      });
      // s11 : donc pas 1 h 25 à 10 000
      block(ctx, t, S('s11'), S('s12'), () => {
        big(ctx, '1 h 25', 500, 560, t, S('s11'), { size: 140, color: WHITE });
        big(ctx, '≠', 500, 720, t, f('s11', 0.2), { size: 140, color: RED });
        big(ctx, 'à 10 000 lm', 500, 880, t, f('s11', 0.35), { size: 96, color: GOLD });
      });
      // s12 : FL1-2025 boost court
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, 'ANSI/PLATO FL 1-2025', 500, 360, t, S('s12'), { size: 42, color: CYAN });
        CHR.emo(ctx, 'stopwatch', 500, 580, 200, t, S('s12') + 0.1);
        line(ctx, 'BOOST TRÈS COURT :', 500, 790, t, f('s12', 0.3), { size: 56, weight: 900, color: WHITE, dx: 0 });
        big(ctx, '1 → 10 s', 500, 930, t, f('s12', 0.45), { size: 130, color: GOLD });
      });
      // s13 : conseil
      block(ctx, t, S('s13'), S('s14'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 360, t, S('s13'), { size: 44, color: GREEN });
        pop(ctx, t, S('s13') + 0.15, 500, 680, () => { panel(ctx, -360, -220, 720, 440);
          text(ctx, '✓ mention FL1', 0, -80, { size: 66, weight: 900, color: GREEN });
          text(ctx, "✓ lis l'astérisque", 0, 60, { size: 66, weight: 900, color: GOLD }); });
      });
      block(ctx, t, S('s14'), S('s15'), () => { comment(ctx, t, S('s14'), ['Ta lampe :', 'combien', 'de lumens ?'], { color: GOLD }); });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'CE SOIR', next: ['ta console en repos :', 'combien de francs par an ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
