// Vidéo 29 — Wi-Fi 2,4 GHz ou 5 GHz : lequel traverse les murs ? Chiffres : days/day29/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, duelFrame, head, comment, tv, wifi, flagCH } = KIT;
  const END = E('s15') + 0.6;
  const G24 = GOLD, G5 = BLUE;

  // routeur générique (sans marque) : boîtier + 2 antennes + voyants
  function router(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = '#9aa7c0'; ctx.lineWidth = 9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-55, -20); ctx.lineTo(-75, -120); ctx.moveTo(55, -20); ctx.lineTo(75, -120); ctx.stroke();
    roundRect(ctx, -110, -30, 220, 70, 20); ctx.fillStyle = '#1d2638'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#46546e'; ctx.stroke();
    for (let i = 0; i < 4; i++) { ctx.fillStyle = (Math.sin(t * 6 + i * 1.3) > -0.2) ? GREEN : '#1f4d33'; ctx.beginPath(); ctx.arc(-54 + i * 36, 5, 7, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  // mur de briques vertical
  function wall(ctx, x, y0, y1, w = 46) {
    ctx.save(); ctx.fillStyle = '#7a4a3a'; ctx.fillRect(x - w / 2, y0, w, y1 - y0);
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 3;
    for (let yy = y0, r = 0; yy < y1; yy += 30, r++) { ctx.beginPath(); ctx.moveTo(x - w / 2, yy); ctx.lineTo(x + w / 2, yy); ctx.stroke();
      const bx = x + (r % 2 ? -4 : 8); ctx.beginPath(); ctx.moveTo(bx, yy); ctx.lineTo(bx, Math.min(yy + 30, y1)); ctx.stroke(); }
    ctx.restore();
  }
  // ondes qui partent du routeur vers la droite ; au-delà du mur (wx), l'onde s'affaiblit selon loss (0..1)
  function waves(ctx, x, y, maxR, color, t, o = {}) {
    const gap = o.gap || 48, n = Math.ceil(maxR / gap), sp = o.speed || 90;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = o.lw || 9; ctx.strokeStyle = color;
    for (let i = 0; i < n; i++) {
      const r = ((t * sp) + i * gap) % maxR; if (r < 30) continue;
      let a = 1 - r / maxR; if (o.wx !== undefined && x + r > o.wx) a *= (1 - (o.loss || 0));
      ctx.globalAlpha = clamp(a) * (o.alpha ?? 1);
      ctx.beginPath(); ctx.arc(x, y, r, -(o.spread || 0.55), (o.spread || 0.55)); ctx.stroke();
    }
    ctx.restore();
  }
  function micro(ctx, x, y, s, t) { // micro-ondes générique
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -200, -120, 400, 240, 22); ctx.fillStyle = '#2b3242'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#56637e'; ctx.stroke();
    roundRect(ctx, -175, -95, 260, 190, 14); ctx.fillStyle = '#ffb347'; ctx.globalAlpha = 0.55 + 0.25 * Math.sin(t * 8); ctx.fill(); ctx.globalAlpha = 1;
    for (let i = 0; i < 3; i++) { ctx.fillStyle = '#9aa7c0'; ctx.beginPath(); ctx.arc(140, -60 + i * 50, 14, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  // plan d'appartement : 3 pièces en enfilade
  function plan(ctx, t, o = {}) {
    const x0 = 90, y0 = 470, w = 820, h = 430;
    ctx.save(); ctx.strokeStyle = WHITE; ctx.lineWidth = 8; ctx.strokeRect(x0, y0, w, h);
    [x0 + 270, x0 + 550].forEach(xx => { ctx.beginPath(); ctx.moveTo(xx, y0); ctx.lineTo(xx, y0 + h * 0.62); ctx.stroke(); });
    ctx.restore();
    text(ctx, 'SALON', x0 + 135, y0 + h - 40, { size: 36, weight: 800, color: '#aeb8cc' });
    text(ctx, 'CUISINE', x0 + 410, y0 + h - 40, { size: 36, weight: 800, color: '#aeb8cc' });
    text(ctx, 'CHAMBRE', x0 + 685, y0 + h - 40, { size: 36, weight: 800, color: '#aeb8cc' });
    router(ctx, x0 + 110, y0 + 190, 0.55, t);
  }
  function duel(ctx, t, o = {}) {
    duelFrame(ctx, { y0: 470, y1: 1170 });
    // gauche : 5 GHz, s'arrête au mur
    router(ctx, 140, 820, 0.7, t); wall(ctx, 360, 620, 1010, 50);
    waves(ctx, 140, 810, 390, G5, t, { wx: 360, loss: 0.9, gap: 34, lw: 10 });
    // droite : 2,4 GHz, passe le mur
    router(ctx, 590, 820, 0.7, t); wall(ctx, 790, 620, 1010, 50);
    waves(ctx, 590, 810, 345, G24, t, { wx: 790, loss: 0.1, gap: 62, lw: 11 });
    if (!o.noLabels) {
      big(ctx, '5 GHz', 275, 1120, t, undefined, { size: 96, color: G5 });
      big(ctx, '2,4 GHz', 725, 1120, t, undefined, { size: 96, color: G24 });
    }
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['high_voltage', 'television', 'check_mark_button', 'cross_mark', 'man_technologist', 'woman_technologist', 'warning', 'magnifying_glass_tilted_left']),
    draw(ctx, t) {
      background(ctx, t);
      // accroche : duel + question, complet dès l'image 0
      block(ctx, t, 0, S('s03'), () => {
        duel(ctx, t);
        if (t < S('s02')) head(ctx, 'LEQUEL PASSE LES MURS ?', 360, t, undefined, { size: 56 });
        else head(ctx, 'LEQUEL CHOISIR, PIÈCE PAR PIÈCE ?', 360, t, S('s02'), { size: 48 });
        if (t >= S('s02')) { CHR.emo(ctx, 'woman_technologist', 150, 600, 150, t, f('s02', 0.2)); CHR.emo(ctx, 'man_technologist', 600, 600, 150, t, f('s02', 0.4)); }
      });
      // réponse
      block(ctx, t, S('s03'), S('s04'), () => {
        router(ctx, 230, 700, 1, t); wall(ctx, 560, 470, 940, 60);
        waves(ctx, 230, 690, 680, G24, t, { wx: 560, loss: 0.3, gap: 70, lw: 12, spread: 0.6 });
        stamp(ctx, '2,4 GHz', 500, 1080, t, f('s03', 0.35), { size: 110, color: G24 });
        tag(ctx, 'PASSE MIEUX LES MURS', 500, 400, t, S('s03') + 0.1, { size: 40, color: GOLD });
      });
      // fréquence haute = murs plus durs
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'NETGEAR · TP-LINK · ASUS', 500, 380, t, S('s04'), { size: 36 });
        wall(ctx, 700, 470, 1110, 60);
        const sine = (y, wl, col, amp, stopAt, t0) => { const k = ease.out(prog(t, t0, 0.8)); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.beginPath();
          for (let x = 110; x <= 110 + (860 - 110) * k; x += 4) { const a = x > 700 ? amp * stopAt : amp; const yy = y + a * Math.sin((x - t * 220) * 2 * Math.PI / wl); x === 110 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); ctx.restore(); };
        sine(600, 70, G5, 55, 0.15, S('s04') + 0.1);
        sine(930, 150, G24, 55, 0.6, f('s04', 0.3));
        line(ctx, '5 GHz', 110, 500, t, S('s04') + 0.1, { size: 54, color: G5, align: 'left', family: F.mono, weight: 700 });
        line(ctx, '2,4 GHz', 110, 830, t, f('s04', 0.3), { size: 54, color: G24, align: 'left', family: F.mono, weight: 700 });
        tag(ctx, 'SCHÉMA', 840, 1150, t, S('s04'), { size: 38 });
      });
      // 20 m / 15 m
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'REPÈRE TP-LINK · ENVIRON', 500, 380, t, S('s05'), { size: 38 });
        for (let m = 0; m <= 20; m += 5) { const x = 110 + m * 38; ctx.fillStyle = WHITE; ctx.fillRect(x - 3, 470, 6, 40); text(ctx, String(m), x, 545, { size: 40, family: F.mono, weight: 700, color: WHITE }); }
        ctx.fillStyle = WHITE; ctx.fillRect(110, 470, 760, 6); text(ctx, 'm', 905, 545, { size: 38, family: F.mono, weight: 700, color: '#aeb8cc' });
        KIT.bars(ctx, [{ label: '2,4 GHz', v: 1, value: '≈ 20 m', color: G24, t0: S('s05') + 0.25 }, { label: '5 GHz', v: 0.75, value: '≈ 15 m', color: G5, t0: f('s05', 0.4) }], 110, 620, 760, t, { rh: 190 });
        tag(ctx, 'SELON L\'ENVIRONNEMENT', 500, 1060, t, f('s05', 0.75), { size: 36, color: GOLD });
      });
      // 5 GHz plus rapide
      block(ctx, t, S('s06'), S('s07'), () => {
        head(ctx, 'VITESSE', 400, t, S('s06'), { size: 60 });
        KIT.bars(ctx, [{ label: '5 GHz', v: 1, value: 'PLUS RAPIDE', color: G5, t0: S('s06') + 0.2 }, { label: '2,4 GHz', v: 0.45, value: 'PLUS LENT', color: G24, t0: f('s06', 0.45) }], 110, 540, 760, t, { rh: 200 });
        tag(ctx, 'EN GÉNÉRAL · SCHÉMA', 500, 1000, t, f('s06', 0.6), { size: 38 });
      });
      // OFCOM
      block(ctx, t, S('s07'), S('s08'), () => {
        flagCH(ctx, 200, 420, 110); line(ctx, 'OFCOM · PUISSANCE MAX.', 290, 420, t, S('s07'), { size: 44, align: 'left' });
        pop(ctx, t, S('s07') + 0.3, 500, 620, () => { panel(ctx, -410, -110, 820, 220, { border: G5 });
          text(ctx, '5 GHz', -370, -40, { size: 52, weight: 900, color: G5, align: 'left' }); text(ctx, "jusqu'à 1 W", 370, -40, { size: 72, family: F.mono, weight: 700, color: WHITE, align: 'right' });
          text(ctx, '5,47–5,725 GHz, avec TPC', 0, 55, { size: 36, weight: 700, color: '#aeb8cc' }); });
        pop(ctx, t, f('s07', 0.5), 500, 900, () => { panel(ctx, -410, -90, 820, 180, { border: G24 });
          text(ctx, '2,4 GHz', -370, 0, { size: 52, weight: 900, color: G24, align: 'left' }); text(ctx, '100 mW', 370, 0, { size: 72, family: F.mono, weight: 700, color: WHITE, align: 'right' }); });
        stamp(ctx, 'SURPRISE', 500, 1100, t, S('s07') + 0.05, { size: 44 });
      });
      // × 10, quand même
      block(ctx, t, S('s08'), S('s09'), () => {
        line(ctx, '1 W ÷ 100 mW', 500, 420, t, S('s08'), { size: 60, family: F.mono, weight: 700 });
        stamp(ctx, '× 10', 500, 560, t, f('s08', 0.15), { size: 130, color: G5 });
        router(ctx, 230, 860, 0.8, t); wall(ctx, 560, 690, 1040, 60);
        waves(ctx, 230, 850, 600, G5, t, { wx: 560, loss: 0.85, gap: 38, lw: 10, spread: 0.5 });
        stamp(ctx, 'À PUISSANCE ÉGALE : MOINS LOIN', 500, 1130, t, f('s08', 0.55), { size: 40 });
      });
      // micro-ondes
      block(ctx, t, S('s09'), S('s10'), () => {
        micro(ctx, 340, 700, 1, t);
        wifi(ctx, 780, 760, 210, G24, t * (t > f('s09', 0.4) ? 5 : 1));
        CHR.emo(ctx, 'high_voltage', 600, 560, 170, t, f('s09', 0.35));
        tag(ctx, 'PEUT BROUILLER LE 2,4 GHz', 500, 1000, t, f('s09', 0.5), { size: 40, color: GOLD });
        tag(ctx, 'ASUS · NETGEAR', 500, 1090, t, f('s09', 0.6), { size: 36 });
      });
      // 4K : 15 Mbit/s
      block(ctx, t, S('s10'), S('s11'), () => {
        tv(ctx, 500, 640, 600, { on: 1, led: false });
        big(ctx, '4K', 500, 640, t, S('s10') + 0.1, { size: 150, color: WHITE });
        big(ctx, '≥ 15 Mbit/s', 500, 1000, t, f('s10', 0.5), { size: 110 });
        tag(ctx, 'RECOMMANDATION NETFLIX', 500, 1110, t, f('s10', 0.6), { size: 36 });
      });
      // plan : 5 près, 2,4 au fond
      block(ctx, t, S('s11'), S('s12'), () => {
        plan(ctx, t);
        waves(ctx, 200, 660, 250, G5, t, { gap: 30, lw: 7, spread: 0.4 });
        pop(ctx, t, S('s11') + 0.2, 200, 560, () => chip(ctx, '5 GHz', 0, 0, { size: 44, color: G5 }));
        waves(ctx, 200, 660, 760, G24, t, { gap: 70, lw: 7, alpha: prog(t, f('s11', 0.5), 0.3), spread: 0.35 });
        pop(ctx, t, f('s11', 0.55), 775, 560, () => chip(ctx, '2,4 GHz', 0, 0, { size: 44, color: G24 }));
        tag(ctx, 'SCHÉMA', 500, 400, t, S('s11'), { size: 38 });
      });
      // placement
      block(ctx, t, S('s12'), S('s13'), () => {
        ctx.fillStyle = '#5a4632'; ctx.fillRect(320, 640, 360, 24); router(ctx, 500, 610, 0.8, t);
        waves(ctx, 500, 600, 290, G24, t, { gap: 55, lw: 7, spread: Math.PI });
        [['EN HAUTEUR', 0.1], ['AU CENTRE', 0.35], ['LOIN DU MÉTAL', 0.6]].forEach(([s, u], i) =>
          pop(ctx, t, f('s12', u), 500, 860 + i * 115, () => { panel(ctx, -330, -50, 660, 100, { border: GREEN }); text(ctx, s, 0, 2, { size: 52, weight: 900, color: WHITE }); }));
        CHR.emo(ctx, 'check_mark_button', 820, 450, 130, t, f('s12', 0.2));
      });
      block(ctx, t, S('s13'), S('s14'), () => comment(ctx, t, S('s13'), ['Ta pièce la plus', 'mal couverte ?'], { y: 700 }));
      // retour au duel : verdict
      block(ctx, t, S('s14'), S('s15'), () => {
        duel(ctx, t, { noLabels: true });
        stamp(ctx, 'VITESSE', 275, 1050, t, S('s14') + 0.1, { size: 64, color: G5 });
        stamp(ctx, 'PORTÉE', 725, 1050, t, f('s14', 0.35), { size: 64, color: G24 });
        head(ctx, 'UN POINT CHACUN', 360, t, f('s14', 0.6), { size: 56 });
      });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: ['batterie de 10 000 mAh :', 'combien de recharges ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
