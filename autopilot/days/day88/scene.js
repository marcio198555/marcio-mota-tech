// Vidéo 88 — Four : faut-il vraiment préchauffer ? (SuisseEnergie/OFEN, fiche OFEN 2015, tarif ElCom 2026). Chiffres : days/day88/facts.md.
// Palette « braise » : orange, ambre, bleu froid pour le four éteint. Four générique, sans marque.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, WHITE, f, pop, stamp, panel, big, line, tag, calc, head, comment, clock, toggle } = KIT;
  const HOT = '#ff8a3d', EMBER = '#ffb347', COLD = '#6cc4ff';
  const END = E('s15') + 0.6;
  // four dessiné : heat 0..1 (lueur), fan = rotation du ventilateur (ou null)
  function oven(ctx, x, y, s, t, o = {}) {
    const heat = o.heat ?? 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -170, -150, 340, 300, 26); ctx.fillStyle = '#2a3140'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#4d5870'; ctx.stroke();
    roundRect(ctx, -170, -150, 340, 56, 26); ctx.fillStyle = '#1c222e'; ctx.fill();
    [-110, -60].forEach((kx, i) => { ctx.beginPath(); ctx.arc(kx, -122, 15, 0, 7); ctx.fillStyle = '#9aa6bd'; ctx.fill();
      ctx.save(); ctx.translate(kx, -122); ctx.rotate(i ? 0.5 : -0.4 + heat * 1.8); ctx.fillStyle = '#1c222e'; ctx.fillRect(-2, -13, 4, 11); ctx.restore(); });
    ctx.fillStyle = heat > 0.05 ? HOT : '#3c4658'; ctx.beginPath(); ctx.arc(120, -122, 8, 0, 7); ctx.fill();
    roundRect(ctx, -140, -78, 280, 26, 13); ctx.fillStyle = '#9aa6bd'; ctx.fill(); // poignée
    roundRect(ctx, -135, -40, 270, 170, 18); ctx.fillStyle = '#0b0f17'; ctx.fill();
    if (heat > 0.01) { ctx.save(); ctx.globalAlpha *= heat; const g = ctx.createRadialGradient(0, 45, 10, 0, 45, 170); g.addColorStop(0, '#ffd27a'); g.addColorStop(0.5, HOT); g.addColorStop(1, 'rgba(120,30,0,0.2)');
      roundRect(ctx, -135, -40, 270, 170, 18); ctx.fillStyle = g; ctx.fill(); ctx.restore(); }
    else { ctx.save(); ctx.globalAlpha *= 0.35; roundRect(ctx, -135, -40, 270, 170, 18); ctx.fillStyle = COLD; ctx.fill(); ctx.restore(); }
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-120, 30); ctx.lineTo(120, 30); ctx.stroke(); // grille
    if (o.fan !== undefined && o.fan !== null) { ctx.save(); ctx.translate(0, 45); ctx.rotate(o.fan); ctx.fillStyle = 'rgba(255,255,255,0.8)';
      for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.ellipse(0, -30, 13, 30, 0.4, 0, 7); ctx.fill(); } ctx.restore(); }
    ctx.restore();
    if (heat > 0.2) { // ondes de chaleur au-dessus
      ctx.save(); ctx.strokeStyle = EMBER; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.globalAlpha *= heat * 0.8;
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); const bx = x + i * 60 * s, by = y - 170 * s;
        for (let k = 0; k <= 10; k++) { const yy = by - k * 9 * s, xx = bx + Math.sin(t * 5 + k * 0.8 + i) * 9 * s; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
      ctx.restore();
    }
  }
  function cake(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -110, -40, 220, 90, 18); ctx.fillStyle = '#c98a4b'; ctx.fill();
    roundRect(ctx, -110, -60, 220, 40, 18); ctx.fillStyle = '#fbe3c4'; ctx.fill();
    ctx.fillStyle = '#e8505b'; ctx.beginPath(); ctx.arc(0, -78, 20, 0, 7); ctx.fill();
    ctx.restore();
  }
  function souffle(ctx, x, y, s, rise) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.ellipse(0, -40 - 60 * rise, 105, 70 + 30 * rise, 0, Math.PI, 0); ctx.fillStyle = '#f2c46d'; ctx.fill();
    roundRect(ctx, -110, -40, 220, 110, 14); ctx.fillStyle = '#f4f6fa'; ctx.fill();
    ctx.strokeStyle = '#c9d0dc'; ctx.lineWidth = 4; for (let i = -90; i <= 90; i += 30) { ctx.beginPath(); ctx.moveTo(i, -30); ctx.lineTo(i, 60); ctx.stroke(); }
    ctx.restore();
  }
  // anneau de part (frac 0..1)
  function ring(ctx, x, y, r, frac, col) {
    ctx.save(); ctx.lineWidth = 46; ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.stroke(); ctx.restore();
  }
  function duel(ctx, t, o = {}) {
    ctx.save(); ctx.globalAlpha *= 0.14; ctx.fillStyle = HOT; ctx.fillRect(40, 450, 460, 700); ctx.fillStyle = COLD; ctx.fillRect(500, 450, 440, 700); ctx.restore();
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(255,179,71,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 460); ctx.lineTo(500, 1150); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 275, 490, { color: WHITE, size: 40 }); chip(ctx, 'TON COLLÈGUE', 725, 490, { color: WHITE, size: 36 });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thermometer', 'thinking_face', 'magnifying_glass_tilted_left', 'check_mark_button', 'cross_mark', 'money_bag', 'high_voltage', 'stopwatch', 'electric_plug']),
    draw(ctx, t) {
      background(ctx, t);
      // ---- image 0 : duel TOI (four qui chauffe, compteur qui monte) / TON COLLÈGUE (four froid) + question
      block(ctx, t, 0, S('s03'), () => {
        head(ctx, 'PRÉCHAUFFER TON FOUR ?', 360, t, undefined, { size: 58, color: HOT, bg: 'rgba(255,138,61,0.18)' });
        duel(ctx, t);
        const k = ease.inOut(clamp(t / 2.6));
        oven(ctx, 275, 750, 0.74, t, { heat: lerp(0.45, 1, k) });
        oven(ctx, 725, 750, 0.74, t, { heat: 0 });
        const deg = Math.round(lerp(120, 200, k));
        text(ctx, `${deg}°C`, 275, 950, { size: 120, family: F.mono, weight: 900, color: EMBER, stroke: 'rgba(0,0,0,0.6)', shadow: HOT + '88' });
        tag(ctx, 'EXEMPLE', 275, 1050, t, undefined, { size: 36, color: EMBER });
        text(ctx, 'FOUR FROID', 725, 950, { size: 66, weight: 900, color: COLD });
        pop(ctx, t, S('s02') + 0.2, 725, 1045, () => text(ctx, 'direct', 0, 0, { size: 52, weight: 800, color: WHITE }));
        line(ctx, 'LEQUEL A RAISON ?', 500, 1175, t, undefined, { size: 64, weight: 900, color: GOLD, dx: 0 });
      });
      // ---- s03 : promesse
      block(ctx, t, S('s03'), S('s04'), () => {
        line(ctx, 'À LA FIN :', 500, 400, t, S('s03'), { size: 62, weight: 900, color: EMBER, dx: 0 });
        pop(ctx, t, S('s03') + 0.15, 500, 680, () => { ctx.rotate(0.04 * Math.sin(t * 3)); KIT.coin(ctx, 0, 0, 170, '?'); });
        line(ctx, 'LE PRÉCHAUFFAGE', 500, 940, t, f('s03', 0.3), { size: 64, weight: 900, dx: 0 });
        line(ctx, 'EN FRANCS PAR AN', 500, 1030, t, f('s03', 0.45), { size: 64, weight: 900, color: GOLD, dx: 0 });
      });
      // ---- s04 : près de 7 % (four + cuisinière)
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'SUISSEENERGIE', 500, 360, t, S('s04'), { size: 42, color: EMBER });
        ring(ctx, 500, 700, 210, 0.07 * ease.out(prog(t, f('s04', 0.3), 0.8)), HOT);
        big(ctx, '≈ 7 %', 500, 700, t, f('s04', 0.35), { size: 130, color: EMBER });
        line(ctx, "de l'électricité des ménages", 500, 1000, t, f('s04', 0.5), { size: 50, weight: 800, dx: 0 });
        line(ctx, '= cuisson (four + cuisinière)', 500, 1080, t, f('s04', 0.62), { size: 44, weight: 700, color: C.muted, dx: 0 });
      });
      // ---- s05 : four de l'exemple
      block(ctx, t, S('s05'), S('s06'), () => {
        stamp(ctx, "CE N'EST PAS TOUT", 500, 380, t, S('s05'), { size: 56, color: EMBER });
        oven(ctx, 400, 720, 1.0, t, { heat: 0 });
        pop(ctx, t, f('s05', 0.45), 760, 620, () => { roundRect(ctx, -90, -70, 180, 140, 18); ctx.fillStyle = '#2db34a'; ctx.fill(); text(ctx, 'A', 0, 4, { size: 110, weight: 900, color: WHITE }); });
        pop(ctx, t, f('s05', 0.65), 760, 820, () => text(ctx, '50 L', 0, 0, { size: 72, family: F.mono, weight: 900, color: WHITE }));
        tag(ctx, 'EXEMPLE · FICHE OFEN', 500, 1020, t, f('s05', 0.3), { size: 40, color: WHITE });
      });
      // ---- s06 : 0,72 kWh par cuisson
      block(ctx, t, S('s06'), S('s07'), () => {
        CHR.emo(ctx, 'high_voltage', 500, 500, 200, t, S('s06'));
        big(ctx, '0,72 kWh', 500, 760, t, S('s06') + 0.15, { size: 150, color: GOLD });
        line(ctx, 'par cuisson (étiquette)', 500, 900, t, f('s06', 0.4), { size: 52, weight: 800, dx: 0 });
        tag(ctx, 'EXEMPLE · CLASSE A · 50 L', 500, 1010, t, f('s06', 0.2), { size: 38 });
      });
      // ---- s07 : -20 % sans préchauffage (la réponse)
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'SUISSEENERGIE · OFEN', 500, 360, t, S('s07'), { size: 40, color: EMBER });
        line(ctx, 'SANS PRÉCHAUFFAGE', 500, 470, t, S('s07') + 0.1, { size: 62, weight: 900, dx: 0 });
        const k = ease.inOut(prog(t, f('s07', 0.45), 0.7));
        roundRect(ctx, 150, 580, 700, 110, 22); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
        roundRect(ctx, 150, 580, 700 * lerp(1, 0.8, k), 110, 22); ctx.fillStyle = HOT; ctx.fill();
        text(ctx, 'énergie', 190, 635, { size: 48, weight: 800, color: '#1a0d04', align: 'left' });
        big(ctx, '−20 %', 500, 880, t, f('s07', 0.55), { size: 190, color: GREEN });
      });
      // ---- s08 : le collègue a raison, gâteaux aussi bons
      block(ctx, t, S('s08'), S('s09'), () => {
        duel(ctx, t);
        oven(ctx, 275, 720, 0.7, t, { heat: 1 }); oven(ctx, 725, 720, 0.7, t, { heat: 0.6 });
        pop(ctx, t, S('s08') + 0.1, 725, 930, () => CHR.emo(ctx, 'check_mark_button', 0, 0, 140, t, S('s08')));
        cake(ctx, 725, 1090, 0.75); cake(ctx, 275, 1090, 0.75);
        line(ctx, 'AUSSI BONS', 500, 1185, t, f('s08', 0.45), { size: 56, weight: 900, color: GOLD, dx: 0 });
      });
      // ---- s09 : l'exception (soufflés)
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, 'EXCEPTION', 500, 380, t, S('s09'), { size: 64, color: GOLD });
        souffle(ctx, 500, 760, 1.2, ease.out(prog(t, f('s09', 0.2), 1.2)));
        line(ctx, 'quelques plats, comme les soufflés', 500, 1000, t, f('s09', 0.3), { size: 48, weight: 800, dx: 0 });
        line(ctx, 'réussissent mieux four chaud', 500, 1080, t, f('s09', 0.5), { size: 48, weight: 800, color: EMBER, dx: 0 });
      });
      // ---- s10 : 2e surprise, chaleur tournante -15 %
      block(ctx, t, S('s10'), S('s11'), () => {
        stamp(ctx, '2e SURPRISE', 500, 380, t, S('s10'), { size: 64, color: EMBER });
        oven(ctx, 320, 690, 0.85, t, { heat: 0.8, fan: t * 6 });
        line(ctx, 'CHALEUR', 720, 620, t, f('s10', 0.2), { size: 54, weight: 900, dx: 0 });
        line(ctx, 'TOURNANTE', 720, 690, t, f('s10', 0.25), { size: 54, weight: 900, dx: 0 });
        big(ctx, '−15 %', 500, 960, t, f('s10', 0.45), { size: 150, color: GREEN });
        line(ctx, 'face à voûte ou sole · SuisseEnergie', 500, 1090, t, f('s10', 0.6), { size: 40, weight: 700, color: C.muted, dx: 0 });
      });
      // ---- s11 : conseil, éteindre 5 min avant
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'CONSEIL', 500, 360, t, S('s11'), { size: 46, color: GREEN });
        clock(ctx, 330, 700, 170, -t * 2.5, { color: EMBER });
        pop(ctx, t, f('s11', 0.3), 700, 640, () => text(ctx, '−5 min', 0, 0, { size: 96, family: F.mono, weight: 900, color: GOLD }));
        pop(ctx, t, f('s11', 0.45), 700, 780, () => toggle(ctx, 0, 0, clamp(1 - (t - f('s11', 0.55)) * 3), { color: HOT }));
        line(ctx, 'et profite de la chaleur résiduelle', 500, 1010, t, f('s11', 0.5), { size: 44, weight: 800, color: C.muted, dx: 0 });
      });
      // ---- s12 : commentaire
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Tu préchauffes', 'pour quel plat ?'], { color: EMBER }); });
      // ---- s13 : calcul (exemple)
      block(ctx, t, S('s13'), S('s14'), () => {
        tag(ctx, 'EXEMPLE · FICHE OFEN', 500, 360, t, S('s13'), { size: 40, color: EMBER });
        calc(ctx, ['150 cuissons/an', '× 0,72 kWh', '108 kWh/an'], 500, 500, t, [S('s13') + 0.1, f('s13', 0.3), f('s13', 0.6)], { lastSize: 130, color: GOLD });
      });
      // ---- s14 : la promesse tenue
      block(ctx, t, S('s14'), f('s14', 0.62), () => {
        tag(ctx, 'EXEMPLE · 27,7 ct./kWh HORS TVA', 500, 360, t, S('s14'), { size: 38, color: GOLD });
        calc(ctx, ['20 % de 108 = 21,6 kWh', '× 0,277 CHF', '≈ 6 CHF/an'], 500, 500, t, [S('s14') + 0.05, f('s14', 0.2), f('s14', 0.38)], { lastSize: 140, color: GREEN });
      });
      // ---- retour au duel avant la fin
      block(ctx, t, f('s14', 0.62), S('s15'), () => {
        head(ctx, 'PRÉCHAUFFER : ≈ 6 CHF/AN', 360, t, undefined, { size: 54, color: HOT, bg: 'rgba(255,138,61,0.18)' });
        duel(ctx, t);
        oven(ctx, 275, 720, 0.7, t, { heat: 1 }); oven(ctx, 725, 720, 0.7, t, { heat: 0 });
        text(ctx, '+ 6 CHF', 275, 960, { size: 92, family: F.mono, weight: 900, color: RED });
        text(ctx, '0', 725, 960, { size: 92, family: F.mono, weight: 900, color: GREEN });
        tag(ctx, 'EXEMPLE · PAR AN', 500, 1090, t, undefined, { size: 38 });
      });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: ['ta clé « USB 3.2 »…', 'peut-être 5 Gbit/s ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
