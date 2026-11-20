// Vidéo 89 — Suisse contre France : Spotify Premium sur un an. Prix relevés le 20.11.2026 (spotify.com/ch-fr et /fr), BNS du 19.11.
// Calculs : days/day89/facts.md. Palette « écran partagé » rouge suisse / bleu français, accent violet ; lecteur générique sans logo.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect, phone } = ENG;
  const { GOLD, GREEN, WHITE, f, pop, stamp, panel, big, line, tag, calc, head, comment, flagCH, flagFR } = KIT;
  const CH = '#ff5a5f', FR = '#5aa9ff', VIO = '#b48cff';
  const END = E('s16') + 0.6;
  function split(ctx, t, o = {}) {
    const y0 = o.y0 || 440, y1 = o.y1 || 1200;
    ctx.save(); ctx.globalAlpha *= 0.16; ctx.fillStyle = CH; ctx.fillRect(40, y0, 460, y1 - y0); ctx.fillStyle = FR; ctx.fillRect(500, y0, 440, y1 - y0); ctx.restore();
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(180,140,255,0.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, y0 + 10); ctx.lineTo(500, y1 - 10); ctx.stroke(); ctx.restore();
    flagCH(ctx, 275, y0 + 75, 86); flagFR(ctx, 725, y0 + 75, 72);
    chip(ctx, 'TOI', 275, y0 + 170, { color: WHITE, size: 38 }); chip(ctx, 'TON COLLÈGUE', 725, y0 + 170, { color: WHITE, size: 36 });
  }
  // lecteur de musique générique (aucun logo)
  function player(ctx, x, y, w, t, col) {
    phone(ctx, x, y, w, w * 2, { draw: (px, py, pw, ph) => {
      const g = ctx.createLinearGradient(px, py, px, py + ph); g.addColorStop(0, col); g.addColorStop(1, '#0b0f1a'); ctx.fillStyle = g; ctx.fillRect(px, py, pw, ph);
      roundRect(ctx, px + pw * 0.15, py + ph * 0.12, pw * 0.7, pw * 0.7, 12); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fill();
      text(ctx, '♪', px + pw / 2, py + ph * 0.12 + pw * 0.35, { size: pw * 0.4, weight: 900, color: WHITE, family: F.body });
      const k = (t * 0.12) % 1; roundRect(ctx, px + pw * 0.12, py + ph * 0.66, pw * 0.76, 8, 4); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill();
      roundRect(ctx, px + pw * 0.12, py + ph * 0.66, pw * 0.76 * k, 8, 4); ctx.fillStyle = WHITE; ctx.fill();
      ctx.beginPath(); ctx.arc(px + pw / 2, py + ph * 0.8, pw * 0.11, 0, 7); ctx.fillStyle = WHITE; ctx.fill();
      ctx.beginPath(); ctx.moveTo(px + pw / 2 - pw * 0.035, py + ph * 0.8 - pw * 0.055); ctx.lineTo(px + pw / 2 + pw * 0.06, py + ph * 0.8); ctx.lineTo(px + pw / 2 - pw * 0.035, py + ph * 0.8 + pw * 0.055); ctx.closePath(); ctx.fillStyle = '#0b0f1a'; ctx.fill();
    } });
  }
  function price(ctx, s, x, y, t, t0, col, o = {}) {
    pop(ctx, t, t0, x, y, () => { ctx.rotate(o.rot ?? -0.03); panel(ctx, -(o.w || 200), -78, (o.w || 200) * 2, 156, { r: 22, border: col, lw: 7, bg: '#0d1020' }); text(ctx, s, 0, 4, { size: o.size || 76, family: F.mono, weight: 700, color: col, maxWidth: (o.w || 200) * 2 - 30 }); });
  }
  function browser(ctx, x, y, url, col, t, t0) {
    pop(ctx, t, t0, x, y, () => {
      panel(ctx, -380, -90, 760, 180, { r: 20, border: col, lw: 5, bg: '#0d1020' });
      [0, 1, 2].forEach((i) => { ctx.beginPath(); ctx.arc(-345 + i * 30, -58, 9, 0, 7); ctx.fillStyle = ['#ff5f57', '#febc2e', '#28c840'][i]; ctx.fill(); });
      text(ctx, url, 0, 20, { size: 46, family: F.mono, weight: 700, color: WHITE, maxWidth: 700 });
    });
  }
  function person(ctx, x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(0, -40, 26, 0, 7); ctx.fill(); roundRect(ctx, -36, -8, 72, 70, 30); ctx.fill(); ctx.restore();
  }
  // 12 cases de mois qui se remplissent (n = 0..12)
  function months(ctx, x, y, n, col) {
    for (let i = 0; i < 12; i++) { const cx = x + (i % 4) * 92, cy = y + Math.floor(i / 4) * 70;
      roundRect(ctx, cx, cy, 80, 56, 10); ctx.fillStyle = i < n ? col : 'rgba(255,255,255,0.08)'; ctx.fill(); }
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thinking_face', 'magnifying_glass_tilted_left', 'money_with_wings', 'package', 'warning', 'headphone', 'exploding_head', 'couch_and_lamp']),
    draw(ctx, t) {
      background(ctx, t);
      // ---- image 0 : écran partagé, prix suisse qui monte vers 15.95, prix français caché, question
      block(ctx, t, 0, S('s03'), () => {
        big(ctx, 'Spotify Premium', 500, 350, t, undefined, { size: 82, family: F.display, color: WHITE });
        split(ctx, t);
        player(ctx, 275, 790, 150, t, CH); player(ctx, 725, 790, 150, t, FR);
        const v = lerp(12, 15.95, ease.out(clamp(t / 2.2)));
        text(ctx, v.toFixed(2), 275, 1020, { size: 130, family: F.mono, weight: 900, color: CH, stroke: 'rgba(0,0,0,0.6)', shadow: CH + '77' });
        text(ctx, 'CHF / mois', 275, 1110, { size: 44, weight: 900, color: CH });
        text(ctx, '? €', 725, 1020, { size: 130, family: F.mono, weight: 900, color: FR, stroke: 'rgba(0,0,0,0.6)' });
        text(ctx, '/ mois', 725, 1110, { size: 44, weight: 900, color: FR });
        head(ctx, 'QUI PAIE LE PLUS SUR UN AN ?', 1205, t, undefined, { size: 50, color: VIO, bg: 'rgba(180,140,255,0.2)' });
      });
      // ---- s03 : promesse, 12 mois
      block(ctx, t, S('s03'), S('s04'), () => {
        line(ctx, 'À LA FIN :', 500, 400, t, S('s03'), { size: 62, weight: 900, color: VIO, dx: 0 });
        const n = Math.floor(12 * clamp((t - S('s03') - 0.2) / 1.6));
        months(ctx, 316, 500, n, VIO);
        line(ctx, "L'ÉCART EN FRANCS", 500, 820, t, f('s03', 0.3), { size: 66, weight: 900, dx: 0 });
        line(ctx, 'SUR 12 MOIS', 500, 910, t, f('s03', 0.45), { size: 66, weight: 900, color: GOLD, dx: 0 });
      });
      // ---- s04 : sources
      block(ctx, t, S('s04'), S('s05'), () => {
        stamp(ctx, 'ATTENDS', 500, 380, t, S('s04'), { size: 64, color: VIO });
        browser(ctx, 500, 590, 'spotify.com/ch-fr', CH, t, S('s04') + 0.15);
        browser(ctx, 500, 820, 'spotify.com/fr', FR, t, f('s04', 0.4));
        tag(ctx, 'RELEVÉ LE 20.11.2026', 500, 1020, t, f('s04', 0.55), { size: 42, color: GOLD });
      });
      // ---- s05 : prix France
      block(ctx, t, S('s05'), S('s06'), () => {
        flagFR(ctx, 500, 420, 110); player(ctx, 500, 720, 140, t, FR);
        price(ctx, '12,14 €', 500, 1030, t, f('s05', 0.35), FR, { w: 230, size: 92 });
        tag(ctx, 'PREMIUM PERSONNEL · PAR MOIS', 500, 1160, t, f('s05', 0.2), { size: 36 });
      });
      // ---- s06 : conversion BNS
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'BNS · 19.11.2026 · 1 € = 0,9263 CHF', 500, 380, t, S('s06'), { size: 38, color: GOLD });
        calc(ctx, ['12,14 € × 0,9263', '11,25 CHF'], 500, 560, t, [S('s06') + 0.15, f('s06', 0.5)], { lastSize: 160, color: FR, lastDy: 90 });
        line(ctx, 'par mois', 500, 870, t, f('s06', 0.6), { size: 52, weight: 800, color: C.muted, dx: 0 });
      });
      // ---- s07 : la réponse, la Suisse paie plus
      block(ctx, t, S('s07'), S('s08'), () => {
        split(ctx, t);
        price(ctx, '15.95', 275, 860, t, S('s07'), CH, { w: 180, size: 96 }); price(ctx, '11,25', 725, 860, t, S('s07') + 0.1, FR, { w: 180, size: 96 });
        text(ctx, 'CHF / mois', 500, 980, { size: 44, weight: 800, color: C.muted });
        stamp(ctx, 'TOI : PLUS CHER', 500, 1110, t, f('s07', 0.45), { size: 66, color: CH });
      });
      // ---- s08 : même offre d'essai
      block(ctx, t, S('s08'), S('s09'), () => {
        CHR.emo(ctx, 'package', 500, 520, 220, t, S('s08'));
        big(ctx, '3 MOIS À 0', 500, 760, t, f('s08', 0.25), { size: 120, family: F.display, color: GREEN });
        pop(ctx, t, f('s08', 0.35), 330, 900, () => flagCH(ctx, 0, 0, 80)); pop(ctx, t, f('s08', 0.42), 670, 900, () => flagFR(ctx, 0, 0, 66));
        tag(ctx, 'PREMIUM PERSONNEL · 1er ESSAI', 500, 1030, t, f('s08', 0.5), { size: 36 });
        tag(ctx, 'JUSQU\'AU 31.12.2026', 500, 1120, t, f('s08', 0.6), { size: 36, color: GOLD });
      });
      // ---- s09 : 2e surprise, Famille 6 comptes
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, '2e SURPRISE', 500, 380, t, S('s09'), { size: 66, color: VIO });
        big(ctx, 'FAMILLE', 500, 540, t, f('s09', 0.15), { size: 110, family: F.display, color: WHITE });
        for (let i = 0; i < 6; i++) pop(ctx, t, f('s09', 0.3) + i * 0.1, 225 + i * 110, 760, () => person(ctx, 0, 0, 1.1, [CH, VIO, FR, GOLD, GREEN, '#ff9ecb'][i]));
        line(ctx, "jusqu'à 6 comptes", 500, 920, t, f('s09', 0.5), { size: 56, weight: 900, dx: 0 });
        line(ctx, 'à la même adresse', 500, 1000, t, f('s09', 0.6), { size: 50, weight: 800, color: C.muted, dx: 0 });
      });
      // ---- s10 : prix Famille
      block(ctx, t, S('s10'), S('s11'), () => {
        split(ctx, t); tag(ctx, 'FAMILLE · PAR MOIS', 500, 380, t, S('s10'), { size: 40, color: VIO });
        price(ctx, '26.95 CHF', 275, 860, t, S('s10') + 0.1, CH, { w: 200, size: 66 }); price(ctx, '21,24 €', 725, 860, t, f('s10', 0.5), FR, { w: 190, size: 70 });
        line(ctx, '= 19,67 CHF (BNS)', 725, 990, t, f('s10', 0.7), { size: 40, family: F.mono, weight: 700, color: FR, dx: 0 });
      });
      // ---- s11 : écart Famille > 7 CHF / mois
      block(ctx, t, S('s11'), S('s12'), () => {
        line(ctx, '26,95 − 19,67', 500, 480, t, S('s11'), { size: 70, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '> 7 CHF', 500, 700, t, f('s11', 0.3), { size: 170, color: CH });
        line(ctx, 'de plus par mois', 500, 880, t, f('s11', 0.45), { size: 56, weight: 900, dx: 0 });
        CHR.emo(ctx, 'money_with_wings', 500, 1060, 160, t, f('s11', 0.55));
      });
      // ---- s12 : conseil, 26,95 / 6
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, 'CONSEIL · À 6, MÊME ADRESSE', 500, 380, t, S('s12'), { size: 40, color: GREEN });
        CHR.emo(ctx, 'couch_and_lamp', 500, 580, 220, t, S('s12') + 0.1);
        calc(ctx, ['26,95 CHF ÷ 6', '< 4,50 CHF'], 500, 790, t, [f('s12', 0.25), f('s12', 0.5)], { lastSize: 130, color: GREEN });
        line(ctx, 'par compte et par mois', 500, 1080, t, f('s12', 0.6), { size: 48, weight: 800, dx: 0 });
      });
      // ---- s13 : commentaire
      block(ctx, t, S('s13'), S('s14'), () => { comment(ctx, t, S('s13'), ['Tu paies combien', 'par mois ?', '🇨🇭 ou 🇫🇷'], { color: VIO }); });
      // ---- s14-s15 : retour au duel, la promesse tenue
      block(ctx, t, S('s14'), S('s16'), () => {
        head(ctx, 'SUR UN AN', 360, t, undefined, { size: 56, color: VIO, bg: 'rgba(180,140,255,0.2)' });
        split(ctx, t);
        const n = Math.floor(12 * clamp((t - S('s14') - 0.2) / 2.0));
        months(ctx, 92, 680, n, CH); months(ctx, 542, 680, n, FR);
                text(ctx, (15.95 * n).toFixed(2), 275, 960, { size: 92, family: F.mono, weight: 900, color: CH, stroke: 'rgba(0,0,0,0.6)' });
        text(ctx, (n === 12 ? 134.94 : 11.2453 * n).toFixed(2).replace('.', ','), 725, 960, { size: 92, family: F.mono, weight: 900, color: FR, stroke: 'rgba(0,0,0,0.6)' });
        text(ctx, 'CHF', 275, 1040, { size: 44, weight: 900, color: CH }); text(ctx, 'CHF (≈ 135)', 725, 1040, { size: 44, weight: 900, color: FR });
        stamp(ctx, '+ 56 CHF / AN', 500, 1160, t, S('s15') + 0.1, { size: 70, color: GOLD });
      });
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'DEMAIN', next: ['ton frigo classé B…', 'vraiment moyen ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
