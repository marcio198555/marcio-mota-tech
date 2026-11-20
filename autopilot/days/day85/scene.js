// Vidéo 85 — écran « 1 ms » : ce n'est pas le vrai temps de réponse (guides Dell G2724D et SE2426H, VESA ClearMR). Chiffres : days/day85/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, head, comment, toggle } = KIT;
  const END = E('s16') + 0.6;
  const NEON = '#b06cff', PINK = '#ff4fd8', SKY = '#4fd8ff';
  // écran générique (sans marque) ; trail = longueur de la traînée de flou de la barre qui défile
  function monitor(ctx, cx, cy, w, t, o = {}) {
    const h = w * 0.58;
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = '#1a1f2e'; ctx.fillRect(-w * 0.05, h / 2, w * 0.1, w * 0.12); roundRect(ctx, -w * 0.2, h / 2 + w * 0.11, w * 0.4, w * 0.035, 8); ctx.fill();
    roundRect(ctx, -w / 2, -h / 2, w, h, 18); ctx.fillStyle = '#05070d'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = o.border || NEON; ctx.stroke();
    ctx.save(); roundRect(ctx, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 12); ctx.clip();
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#141a3a'); g.addColorStop(1, '#2a1240'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
    if (o.bar !== false) {
      const span = w - 40, bx = -span / 2 + ((t * (o.speed || 0.6)) % 1) * span, bw = w * 0.08, tr = o.trail ?? 0;
      if (tr > 0) { const gr = ctx.createLinearGradient(bx - tr, 0, bx, 0); gr.addColorStop(0, 'rgba(79,216,255,0)'); gr.addColorStop(1, 'rgba(79,216,255,0.75)'); ctx.fillStyle = gr; ctx.fillRect(bx - tr, -h * 0.3, tr, h * 0.6); }
      ctx.fillStyle = SKY; ctx.fillRect(bx, -h * 0.3, bw, h * 0.6);
      if (o.ghost) { ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(bx + bw, -h * 0.3, 10, h * 0.6); ctx.fillStyle = 'rgba(255,79,216,0.5)'; ctx.fillRect(bx - 16, -h * 0.3, 10, h * 0.6); }
    }
    if (o.draw) o.draw(w, h);
    ctx.restore(); ctx.restore();
  }
  function ms(ctx, str, x, y, t, t0, size, color) { big(ctx, str, x, y, t, t0, { size, color }); }
  // menu OSD « Response Time »
  function osd(ctx, x, y, t, t0, hi) {
    const rows = [['Fast', '4 ms'], ['Super Fast', '2 ms'], ['Extreme', '1 ms']];
    pop(ctx, t, t0, x, y, () => {
      panel(ctx, -360, -200, 720, 400, { border: NEON, bg: 'rgba(14,10,30,0.92)' });
      text(ctx, 'RESPONSE TIME', 0, -140, { size: 42, weight: 900, color: C.muted, family: F.mono });
      rows.forEach((r, i) => {
        const yy = -55 + i * 95, on = i === hi;
        if (on) { roundRect(ctx, -320, yy - 38, 640, 76, 16); ctx.fillStyle = 'rgba(176,108,255,0.35)'; ctx.fill(); }
        text(ctx, r[0], -290, yy, { size: 46, weight: 800, color: on ? WHITE : C.muted, align: 'left' });
        text(ctx, r[1].replace(' ', ' '), 290, yy, { size: 50, weight: 900, family: F.mono, color: on ? GOLD : C.muted, align: 'right' });
      });
    });
  }
  function duelScreens(ctx, t, o = {}) {
    KIT.duelFrame(ctx, { y0: 430, y1: o.y1 || 1020 });
    monitor(ctx, 275, 650, 360, t, { trail: 60, border: NEON });
    monitor(ctx, 725, 650, 360, t + 0.3, { trail: 60, border: PINK });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['magnifying_glass_tilted_left', 'warning', 'light_bulb', 'red_question_mark', 'check_mark_button', 'stopwatch']),
    draw(ctx, t) {
      background(ctx, t, { glow: 'rgba(70,30,120,0.55)' });
      // s01–s02 : image 0 — duel des deux écrans, « 1 ms » qui pulse, la question
      block(ctx, t, 0, S('s03'), () => {
        head(ctx, 'SUR LA BOÎTE', 345, t, undefined, { size: 46, color: NEON, bg: 'rgba(176,108,255,0.18)' });
        duelScreens(ctx, t);
        const pul = 1 + 0.06 * Math.sin(t * 7);
        ctx.save(); ctx.translate(275, 940); ctx.scale(pul, pul); text(ctx, '1 ms', 0, 0, { size: 170, weight: 900, family: F.mono, color: GOLD, stroke: 'rgba(0,0,0,0.6)', shadow: GOLD + '66' }); ctx.restore();
        const k2 = t < S('s02') ? 0.45 : 1;
        ctx.save(); ctx.globalAlpha *= k2; text(ctx, '4 ms', 725, 940, { size: 130, weight: 900, family: F.mono, color: PINK, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        big(ctx, 'LEQUEL EST LE PLUS RAPIDE ?', 500, 1120, t, undefined, { size: 62, family: F.display, color: WHITE, glow: false });
      });
      // s03 : promesse — le logo reste caché
      block(ctx, t, S('s03'), S('s04'), () => {
        stamp(ctx, 'ATTENDS', 500, 400, t, S('s03'), { size: 80, color: GOLD });
        pop(ctx, t, f('s03', 0.25), 500, 690, () => {
          roundRect(ctx, -220, -140, 440, 280, 30); ctx.fillStyle = 'rgba(14,10,30,0.9)'; ctx.fill(); ctx.setLineDash([18, 14]); ctx.lineWidth = 6; ctx.strokeStyle = NEON; ctx.stroke(); ctx.setLineDash([]);
          text(ctx, '?', 0, 10, { size: 200, weight: 900, color: NEON });
        });
        line(ctx, 'À LA FIN : LE LOGO', 500, 960, t, f('s03', 0.35), { size: 60, weight: 900, dx: 0 });
        line(ctx, 'QUI MESURE VRAIMENT LE FLOU', 500, 1045, t, f('s03', 0.5), { size: 50, weight: 900, color: GOLD, dx: 0 });
      });
      // s04 : gris à gris
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, '« GRAY TO GRAY » (GtG)', 500, 360, t, S('s04'), { size: 42, color: SKY });
        const k = ease.inOut(prog(t, f('s04', 0.35), 0.8));
        const g1 = Math.round(lerp(60, 200, k));
        pop(ctx, t, S('s04') + 0.1, 500, 640, () => { roundRect(ctx, -170, -170, 340, 340, 24); ctx.fillStyle = `rgb(${g1},${g1},${g1})`; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = WHITE; ctx.stroke(); });
        text(ctx, 'GRIS', 210, 640, { size: 56, weight: 900, color: '#8a8a8a' });
        text(ctx, '→', 500, 880, { size: 80, weight: 900, color: WHITE });
        text(ctx, 'GRIS', 790, 640, { size: 56, weight: 900, color: '#d8d8d8' });
        line(ctx, 'un pixel qui change de gris', 500, 1000, t, f('s04', 0.4), { size: 50, weight: 900, color: WHITE, dx: 0 });
      });
      // s05 : 1 ms… en mode Extreme
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'GUIDE DELL · G2724D', 500, 340, t, S('s05'), { size: 42, color: SKY });
        monitor(ctx, 500, 590, 520, t, { trail: 20, speed: 0.9 });
        ms(ctx, '1 ms', 500, 960, t, f('s05', 0.3), 180, GOLD);
        pop(ctx, t, f('s05', 0.6), 500, 1110, () => chip(ctx, 'EN MODE EXTREME', 0, 0, { color: PINK, size: 44 }));
      });
      // s06 : le menu, Fast = 4 ms
      block(ctx, t, S('s06'), S('s07'), () => {
        osd(ctx, 500, 620, t, S('s06'), t < f('s06', 0.3) ? 2 : 0);
        ms(ctx, '4 ms', 500, 1010, t, f('s06', 0.35), 170, PINK);
        line(ctx, 'en mode Fast, même écran', 500, 1135, t, f('s06', 0.5), { size: 44, weight: 800, color: C.muted, dx: 0 });
      });
      // s07 : peut-être le même écran
      block(ctx, t, S('s07'), S('s08'), () => {
        duelScreens(ctx, t);
        text(ctx, '1 ms', 275, 930, { size: 110, weight: 900, family: F.mono, color: GOLD });
        text(ctx, '4 ms', 725, 930, { size: 110, weight: 900, family: F.mono, color: PINK });
        stamp(ctx, 'MÊME ÉCRAN ?', 500, 1090, t, f('s07', 0.2), { size: 70, color: GREEN, rot: -0.04 });
      });
      // s08 : avertissement de Dell
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'NOTE DE DELL · MODE EXTREME', 500, 340, t, S('s08'), { size: 40, color: GOLD });
        monitor(ctx, 500, 620, 560, t, { trail: 10, speed: 0.8, ghost: true });
        CHR.emo(ctx, 'warning', 760, 470, 150, t, f('s08', 0.2));
        line(ctx, 'légers défauts visibles', 500, 980, t, f('s08', 0.35), { size: 58, weight: 900, color: GOLD, dx: 0 });
        line(ctx, 'possibles', 500, 1060, t, f('s08', 0.45), { size: 58, weight: 900, color: GOLD, dx: 0 });
      });
      // s09 : surprise — 1 ms MPRT
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, 'SURPRISE', 500, 380, t, S('s09'), { size: 70, color: PINK });
        tag(ctx, 'GUIDE DELL · SE2426H', 500, 520, t, f('s09', 0.15), { size: 40, color: SKY });
        ms(ctx, '1 ms', 500, 740, t, f('s09', 0.3), 200, GOLD);
        pop(ctx, t, f('s09', 0.55), 500, 920, () => text(ctx, 'MPRT', 0, 0, { size: 120, weight: 900, color: WHITE }));
        line(ctx, 'mode réservé à 120 Hz ou plus', 500, 1060, t, f('s09', 0.7), { size: 40, weight: 800, color: C.muted, dx: 0 });
      });
      // s10 : scintillement et FreeSync coupé
      block(ctx, t, S('s10'), S('s11'), () => {
        const fl = 0.55 + 0.45 * (Math.sin(t * 40) > 0 ? 1 : 0.3);
        ctx.save(); ctx.globalAlpha *= fl; CHR.emo(ctx, 'light_bulb', 300, 600, 240, t, S('s10')); ctx.restore();
        line(ctx, 'léger', 300, 820, t, S('s10') + 0.1, { size: 50, weight: 900, color: GOLD, dx: 0 });
        line(ctx, 'scintillement', 300, 885, t, S('s10') + 0.15, { size: 50, weight: 900, color: GOLD, dx: 0 });
        line(ctx, '(possible)', 300, 945, t, S('s10') + 0.2, { size: 40, weight: 800, color: C.muted, dx: 0 });
        text(ctx, 'FreeSync', 700, 520, { size: 56, weight: 900, color: WHITE });
        toggle(ctx, 700, 640, 1 - prog(t, f('s10', 0.5), 0.35), { w: 200, color: GREEN });
        line(ctx, 'COUPÉ', 700, 790, t, f('s10', 0.7), { size: 64, weight: 900, color: RED, dx: 0 });
        line(ctx, 'en mode MPRT · guide Dell', 500, 1060, t, S('s10') + 0.2, { size: 40, weight: 800, color: C.muted, dx: 0 });
      });
      // s11 : chacun sa méthode
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'ARTICLE DIFFUSÉ PAR VESA (2024)', 500, 340, t, S('s11'), { size: 38, color: SKY });
        ['MÉTHODE A', 'MÉTHODE B', 'MÉTHODE C'].forEach((m, i) => pop(ctx, t, S('s11') + 0.15 + i * 0.25, 500, 520 + i * 150, () => {
          roundRect(ctx, -330, -55, 660, 110, 22); ctx.fillStyle = 'rgba(14,10,30,0.9)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = [NEON, PINK, SKY][i]; ctx.stroke();
          text(ctx, m, -150, 2, { size: 46, weight: 900, color: WHITE }); text(ctx, '… ms', 190, 2, { size: 50, weight: 900, family: F.mono, color: [NEON, PINK, SKY][i] });
        }));
        line(ctx, 'chaque fabricant a la sienne', 500, 1020, t, f('s11', 0.6), { size: 50, weight: 900, color: GOLD, dx: 0 });
      });
      // s12 : conseil
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 360, t, S('s12'), { size: 44, color: GREEN });
        pop(ctx, t, S('s12') + 0.15, 500, 680, () => {
          panel(ctx, -390, -200, 780, 400, { border: GREEN });
          text(ctx, 'SUR LA FICHE', 0, -120, { size: 44, weight: 800, color: C.muted });
          text(ctx, '1 ms (gray-to-gray', 0, -10, { size: 54, weight: 900, family: F.mono, color: WHITE });
          text(ctx, 'extreme)', 0, 70, { size: 54, weight: 900, family: F.mono, color: GOLD });
        });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 720, 900, 200, t, f('s12', 0.4));
        line(ctx, 'quel mode ?', 400, 960, t, f('s12', 0.45), { size: 60, weight: 900, color: GREEN, dx: 0 });
      });
      // s13 : commentaire
      block(ctx, t, S('s13'), S('s14'), () => { comment(ctx, t, S('s13'), ['Ton écran :', 'quel mode ?'], { color: NEON }); });
      // s14 : retour au duel + logo ClearMR (promesse tenue)
      block(ctx, t, S('s14'), S('s15'), () => {
        duelScreens(ctx, t);
        pop(ctx, t, S('s14') + 0.2, 500, 980, () => {
          roundRect(ctx, -330, -110, 660, 220, 30); ctx.fillStyle = 'rgba(14,10,30,0.95)'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = GREEN; ctx.stroke();
          text(ctx, 'VESA', 0, -45, { size: 50, weight: 900, color: C.muted });
          text(ctx, 'ClearMR', 0, 35, { size: 96, weight: 900, color: GREEN });
        });
        line(ctx, 'pixels nets contre pixels flous', 500, 1150, t, f('s14', 0.5), { size: 44, weight: 900, color: WHITE, dx: 0 });
      });
      // s15 : ClearMR 7000 = 65 à 75 fois plus de pixels nets
      block(ctx, t, S('s15'), S('s16'), () => {
        tag(ctx, 'VESA CLEARMR 7000', 500, 340, t, S('s15'), { size: 44, color: GREEN });
        text(ctx, 'SCHÉMA', 840, 420, { size: 38, weight: 900, color: C.muted, family: F.mono });
        const n = Math.round(70 * ease.out(prog(t, S('s15') + 0.1, 1.2)));
        for (let i = 0; i < 70; i++) { if (i >= n) break; const cx = 175 + (i % 10) * 72, cy = 470 + Math.floor(i / 10) * 60; ctx.fillStyle = SKY; ctx.fillRect(cx - 26, cy - 22, 52, 44); }
        ctx.save(); ctx.filter = 'blur(6px)'; ctx.fillStyle = PINK; ctx.fillRect(810, 860, 60, 50); ctx.restore();
        text(ctx, '1 flou', 840, 950, { size: 38, weight: 800, color: PINK });
        big(ctx, '65 à 75 ×', 450, 1030, t, f('s15', 0.45), { size: 110, color: GOLD, maxWidth: 700 });
        line(ctx, 'plus de pixels nets que flous', 450, 1130, t, f('s15', 0.6), { size: 44, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'DEMAIN', next: ['tes AirPods Pro 3…', 'moins chers en France ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
