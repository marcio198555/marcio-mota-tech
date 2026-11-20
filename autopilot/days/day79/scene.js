// Vidéo 79 — Chargeur sans fil « 15 W » : ton téléphone en prend peut-être moins. Sources : days/day79/facts.md (WPC Qi, Google Store CH).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, bars, comment, head } = KIT;
  const END = E('s15') + 0.6;
  // chargeur à induction générique (sans logo) : galette ronde + câble
  function pad(ctx, x, y, s, t, glow = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = '#3a465c'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(150, 30); ctx.quadraticCurveTo(260, 60, 300, 140); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 30, 170, 52, 0, 0, 7); ctx.fillStyle = '#1b2230'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 10, 170, 52, 0, 0, 7); ctx.fillStyle = '#2b3446'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#4a5878'; ctx.stroke();
    const a = 0.35 + 0.35 * Math.sin(t * 4);
    ctx.save(); ctx.globalAlpha *= a * glow; ctx.strokeStyle = CYAN; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, 10, 110, 32, 0, 0, 7); ctx.stroke(); ctx.restore();
    ctx.restore();
  }
  // téléphone générique posé (sans logo)
  function phone(ctx, x, y, s, label, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -95, -190, 190, 380, 30); ctx.fillStyle = '#0b0f17'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#8a96ad'; ctx.stroke();
    roundRect(ctx, -80, -172, 160, 344, 20); const g = ctx.createLinearGradient(0, -172, 0, 172); g.addColorStop(0, '#1f3b66'); g.addColorStop(1, '#2a1c4a'); ctx.fillStyle = g; ctx.fill();
    if (label) text(ctx, label, 0, 0, { size: 62, family: F.mono, weight: 900, color: col || WHITE, maxWidth: 150 });
    ctx.restore();
  }
  function arrow(ctx, x, y0, y1, col, w) {
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1 + (y1 > y0 ? -20 : 20)); ctx.stroke();
    const d = y1 > y0 ? 1 : -1; ctx.beginPath(); ctx.moveTo(x - w * 1.6, y1 - d * 30); ctx.lineTo(x + w * 1.6, y1 - d * 30); ctx.lineTo(x, y1 + d * 6); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['high_voltage', 'thinking_face', 'mobile_phone', 'magnifying_glass_tilted_left', 'hourglass_done', 'exploding_head', 'clipboard', 'red_question_mark']),
    draw(ctx, t) {
      background(ctx, t);
      // image 0 : chargeur + « 15 W ? » en très gros
      block(ctx, t, 0, S('s02'), () => {
        tag(ctx, 'CHARGEUR SANS FIL', 500, 330, t, undefined, { size: 44, color: CYAN });
        text(ctx, '15 W', 470, 560, { size: 230, family: F.mono, weight: 900, color: GOLD, stroke: 'rgba(0,0,0,0.6)', shadow: GOLD + '66', shadowBlur: 30 });
        text(ctx, '?', 830, 560, { size: 230, weight: 900, color: RED, stroke: 'rgba(0,0,0,0.6)' });
        pad(ctx, 500, 980, 1.3, t); phone(ctx, 500, 830, 0.75 + 0.03 * prog(t, 2.5, 0.4), null);
        head(ctx, 'TON TÉLÉPHONE EN PREND ?', 1190, t, f('s01', 0.55), { size: 50 });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'PAS UNE PROMESSE', 500, 430, t, S('s02'), { size: 70, color: RED });
        CHR.emo(ctx, 'thinking_face', 500, 700, 230, t, f('s02', 0.2));
        line(ctx, 'À LA FIN : QUOI VÉRIFIER', 500, 950, t, f('s02', 0.55), { size: 54, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        big(ctx, 'NORME Qi', 500, 560, t, S('s03'), { size: 150, family: F.display, color: CYAN });
        tag(ctx, 'WIRELESS POWER CONSORTIUM', 500, 760, t, f('s03', 0.4), { size: 40 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        phone(ctx, 500, 560, 0.7, null); pad(ctx, 500, 1020, 1.0, t);
        pop(ctx, t, S('s04') + 0.2, 500, 380, () => chip(ctx, 'LE TÉLÉPHONE DEMANDE', 0, 0, { color: GOLD, size: 42 }));
        if (t > f('s04', 0.25)) arrow(ctx, 380, 760, 960, GOLD, 10);
        if (t > f('s04', 0.6)) arrow(ctx, 620, 960, 760, CYAN, 10);
        pop(ctx, t, f('s04', 0.6), 500, 1160, () => chip(ctx, 'LE CHARGEUR ENVOIE', 0, 0, { color: CYAN, size: 42 }));
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        phone(ctx, 300, 640, 0.75, '5 W', GOLD); pad(ctx, 680, 860, 0.85, t);
        text(ctx, '15 W', 680, 700, { size: 90, family: F.mono, weight: 900, color: CYAN });
        stamp(ctx, '= 5 W MAX', 500, 1100, t, f('s05', 0.65), { size: 84, color: GOLD });
        tag(ctx, 'WPC · QI SPECIFICATION', 500, 380, t, S('s05'), { size: 38 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'EXEMPLE', 500, 380, t, S('s06'), { size: 44, color: GOLD });
        phone(ctx, 500, 720, 0.95, '9a', WHITE);
        line(ctx, 'GOOGLE PIXEL 9a', 500, 1010, t, f('s06', 0.3), { size: 66, weight: 900, dx: 0 });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'GOOGLE STORE · FICHE PIXEL 9a', 500, 380, t, S('s07'), { size: 38, color: GOLD });
        tag(ctx, 'SANS FIL, JUSQU\'À', 500, 520, t, f('s07', 0.2), { size: 46 });
        big(ctx, '7,5 W', 500, 720, t, f('s07', 0.05), { size: 190, color: GREEN });
        tag(ctx, 'CHARGEUR EPP CERTIFIÉ Qi', 500, 900, t, f('s07', 0.7), { size: 40 });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        bars(ctx, [{ label: 'Boîte du chargeur (exemple)', v: 1, value: '15 W', color: GOLD, t0: S('s08') }, { label: 'Pixel 9a, sans fil', v: 0.5, value: '7,5 W', color: GREEN, t0: S('s08') + 0.4 }], 120, 470, 760, t, { size: 44 });
        stamp(ctx, 'LA MOITIÉ', 500, 960, t, f('s08', 0.45), { size: 90, color: RED });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, '2e SURPRISE', 500, 380, t, S('s09'), { size: 66, color: GOLD });
        phone(ctx, 500, 700, 0.85, '10a', WHITE);
        big(ctx, '10 W', 500, 1030, t, f('s09', 0.6), { size: 170, color: CYAN });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        big(ctx, '10 ≠ 15', 500, 640, t, S('s10'), { size: 190, color: RED });
        CHR.emo(ctx, 'exploding_head', 500, 950, 200, t, f('s10', 0.3));
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'GOOGLE STORE · FICHE PIXEL 10a', 500, 380, t, S('s11'), { size: 38, color: GOLD });
        CHR.emo(ctx, 'hourglass_done', 500, 620, 230, t, f('s11', 0.1));
        line(ctx, '« LES TEMPS RÉELS', 500, 880, t, f('s11', 0.4), { size: 54, weight: 900, dx: 0 });
        line(ctx, 'PEUVENT ÊTRE PLUS LONGS »', 500, 960, t, f('s11', 0.55), { size: 54, weight: 900, dx: 0 });
      });
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, 'CONSEIL', 500, 380, t, S('s12'), { size: 46, color: GREEN });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 500, 610, 230, t, f('s12', 0.1));
        line(ctx, 'FICHE DE TON TÉLÉPHONE', 500, 860, t, f('s12', 0.35), { size: 56, weight: 900, dx: 0 });
        line(ctx, '→ « RECHARGE SANS FIL »', 500, 950, t, f('s12', 0.6), { size: 56, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s13'), S('s14'), () => {
        pop(ctx, t, S('s13'), 500, 640, () => { panel(ctx, -360, -170, 720, 340, { r: 30, border: GREEN, lw: 6 }); text(ctx, 'Recharge sans fil', 0, -80, { size: 46, weight: 800, color: WHITE }); text(ctx, 'jusqu\'à 7,5 W', 0, 40, { size: 84, family: F.mono, weight: 900, color: GREEN }); });
        stamp(ctx, 'SON MAXIMUM', 500, 960, t, f('s13', 0.5), { size: 80, color: GOLD });
      });
      block(ctx, t, S('s14'), S('s15'), () => { comment(ctx, t, S('s14'), ['Ton téléphone :', 'combien de W', 'sans fil ?'], { color: GOLD }); });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'CE SOIR', next: ['la montre « 14 jours »', 'sans GPS ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
