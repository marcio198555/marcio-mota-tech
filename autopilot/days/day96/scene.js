// Vidéo 96 — Suisse contre France : bibliothèque BILLY 80x28x202 (Reel d'essai Instagram). Prix relevés le 25.11.2026 ; calculs : days/day96/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, roundRect } = ENG;
  const { RED, GOLD, GREEN, WHITE, f, pop, stamp, panel, big, line, tag, flagCH, flagFR, comment, head } = KIT;
  const FR = '#5aa9ff', CH = '#ff5a5f';
  const END = E('s15') + 0.6;
  function split(ctx) {
    ctx.save(); ctx.globalAlpha *= 0.16; ctx.fillStyle = CH; ctx.fillRect(0, 440, 500, 760); ctx.fillStyle = FR; ctx.fillRect(500, 440, 580, 760); ctx.restore();
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(230,198,106,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 450); ctx.lineTo(500, 1190); ctx.stroke(); ctx.restore();
    flagCH(ctx, 275, 520, 90); flagFR(ctx, 725, 520, 76);
    chip(ctx, 'TOI', 275, 615, { color: WHITE, size: 38 }); chip(ctx, 'TON COLLÈGUE', 725, 615, { color: WHITE, size: 36 });
  }
  // bibliothèque blanche générique (sans logo) : 1 tablette fixe + 4 réglables, livres colorés qui glissent en place
  const BOOKS = ['#e05a4f', '#4f8fe0', '#e6c66a', '#58d68d', '#b06cff', '#ff8a3d', '#4fd8ff'];
  function shelf(ctx, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const w = 160, h = 400;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, h / 2 + 8, w * 0.75, 16, 0, 0, 7); ctx.fill();
    roundRect(ctx, -w / 2, -h / 2, w, h, 6); ctx.fillStyle = '#f3f4f7'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#aab1bd'; ctx.stroke();
    ctx.fillStyle = '#dfe2e8'; ctx.fillRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20);
    for (let i = 1; i <= 5; i++) {
      const yy = -h / 2 + i * (h - 20) / 6 + 10;
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-w / 2 + 8, yy - 5, w - 16, 10); ctx.strokeStyle = '#c3c8d1'; ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 8, yy - 5, w - 16, 10);
      if (o.books !== false) {
        for (let b = 0; b < 6; b++) {
          const k = clamp((t * 1.2 - b * 0.08 - i * 0.05) % 3, 0, 1);
          const bh = 42 + ((b * 7 + i * 3) % 4) * 5, bw = 16;
          ctx.fillStyle = BOOKS[(b + i) % BOOKS.length];
          ctx.fillRect(-w / 2 + 16 + b * (bw + 3), yy - 5 - bh * (0.85 + 0.15 * k), bw, bh * (0.85 + 0.15 * k));
        }
      }
    }
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-w / 2, h / 2 - 22, w, 22); ctx.strokeStyle = '#aab1bd'; ctx.strokeRect(-w / 2, h / 2 - 22, w, 22);
    ctx.restore();
  }
  function wall(ctx, x, y, n, s, t, t0) {
    for (let i = 0; i < n; i++) {
      const k = ease.back(prog(t, t0 + i * 0.25, 0.35));
      if (k <= 0) continue;
      ctx.save(); ctx.globalAlpha *= clamp(k * 2); shelf(ctx, x + (i - (n - 1) / 2) * 170 * s, y + (1 - k) * 80, s, t + i * 0.4); ctx.restore();
    }
  }
  function price(ctx, s, x, y, t, t0, col, o = {}) {
    pop(ctx, t, t0, x, y, () => { ctx.rotate(o.rot ?? -0.03); panel(ctx, -(o.w || 215), -82, (o.w || 215) * 2, 164, { r: 22, border: col, lw: 7, bg: '#0a1322' }); text(ctx, s, 0, 4, { size: o.size || 80, family: F.mono, weight: 700, color: col, maxWidth: (o.w || 215) * 2 - 30 }); });
  }
  // fin propre à Instagram : pas d'@, pas de « ce soir », pas de carte TikTok
  function igEnd(ctx, t, t0) {
    const k = ease.back(prog(t, t0 + 0.25, 0.35));
    ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(500, 800); ctx.scale(0.9 + 0.1 * k, 0.9 + 0.1 * k);
    panel(ctx, -420, -190, 840, 380, { r: 40, border: GOLD, lw: 4, bg: 'rgba(201,168,76,0.12)' });
    text(ctx, 'CHAQUE JOUR', 0, -110, { size: 44, family: F.mono, weight: 700, color: GOLD, letter: 6 });
    text(ctx, 'un chiffre vérifié', 0, -10, { size: 72, weight: 900, color: WHITE, maxWidth: 780 });
    text(ctx, 'sur les objets', 0, 75, { size: 60, weight: 800, color: WHITE, maxWidth: 780 });
    text(ctx, 'de ta maison', 0, 145, { size: 60, weight: 800, color: WHITE, maxWidth: 780 });
    ctx.restore();
    const p = 1 + 0.05 * Math.sin((t - t0) * 7);
    pop(ctx, t, t0 + 0.5, 500, 1110, () => { ctx.scale(p, p); roundRect(ctx, -230, -58, 460, 116, 58); ctx.fillStyle = RED; ctx.fill(); text(ctx, 'ABONNE-TOI', 0, 2, { size: 56, weight: 900, color: WHITE }); });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thinking_face', 'package', 'receipt', 'money_with_wings', 'check_mark_button', 'warning']),
    draw(ctx, t) {
      background(ctx, t);
      // image 0 : deux bibliothèques, les deux prix en très gros (qui battent), « ? » qui tourne
      block(ctx, t, 0, S('s03'), () => {
        big(ctx, 'BILLY 80×28×202', 500, 345, t, undefined, { size: 76, family: F.display, color: WHITE });
        split(ctx); shelf(ctx, 275, 830, 0.62, t); shelf(ctx, 725, 830, 0.62, t + 0.7);
        const b = 1 + 0.06 * Math.sin(t * 5);
        ctx.save(); ctx.translate(275, 1022); ctx.scale(b, b); text(ctx, '59.95', 0, 0, { size: 118, family: F.mono, weight: 900, color: CH, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        ctx.save(); ctx.translate(725, 1022); ctx.scale(2 - b, 2 - b); text(ctx, '59,99', 0, 0, { size: 118, family: F.mono, weight: 900, color: FR, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        text(ctx, 'CHF', 275, 1108, { size: 52, weight: 900, color: CH }); text(ctx, '€', 725, 1108, { size: 60, weight: 900, color: FR });
        ctx.save(); ctx.translate(500, 760); ctx.rotate(0.25 * Math.sin(t * 3)); text(ctx, '?', 0, 0, { size: 170, weight: 900, color: GOLD, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        head(ctx, 'QUI PAIE LE MOINS ?', 1195, t, 1.0, { size: 52 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'À LA FIN', 500, 430, t, S('s03'), { size: 46, color: GOLD });
        wall(ctx, 500, 760, 4, 0.7, t, S('s03') + 0.1);
        ctx.save(); ctx.globalAlpha *= clamp((t - f('s03', 0.5)) * 3); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(500 + 1.5 * 170 * 0.7, 760, 92, 0, 7); ctx.stroke(); ctx.restore();
        big(ctx, 'LA 4e ÉTAGÈRE', 500, 1070, t, f('s03', 0.35), { size: 80, family: F.display, color: GOLD });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        flagCH(ctx, 500, 405, 130); shelf(ctx, 500, 770, 0.95, t);
        tag(ctx, 'IKEA SUISSE · 25.11.2026', 500, 520, t, S('s04') + 0.1, { size: 38 });
        price(ctx, '59.95 CHF', 500, 1100, t, f('s04', 0.4), CH, { w: 250, size: 84 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        flagFR(ctx, 500, 405, 110); shelf(ctx, 500, 770, 0.95, t);
        tag(ctx, 'IKEA FRANCE · 25.11.2026', 500, 520, t, S('s05') + 0.1, { size: 38 });
        price(ctx, '59,99 €', 500, 1100, t, f('s05', 0.4), FR, { w: 250, size: 84 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'BNS 24.11.2026 : 1 € = 0,9197 CHF', 500, 400, t, S('s06'), { size: 36, color: GOLD });
        line(ctx, '59,99 × 0,9197', 500, 580, t, S('s06') + 0.2, { size: 72, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '55.17 CHF', 500, 790, t, f('s06', 0.55), { size: 150, color: FR });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        split(ctx);
        price(ctx, '59.95', 275, 860, t, S('s07') - 1, CH, { w: 195, size: 90 }); price(ctx, '55.17', 725, 860, t, S('s07') - 1, FR, { w: 195, size: 90 });
        stamp(ctx, '− 4.78 CHF', 725, 1075, t, f('s07', 0.3), { size: 72, color: GREEN });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'OFDF · FRANCHISE-VALEUR', 500, 400, t, S('s08'), { size: 40, color: GOLD });
        CHR.emo(ctx, 'package', 500, 620, 230, t, S('s08') + 0.1);
        big(ctx, '150 CHF', 500, 850, t, f('s08', 0.35), { size: 140, color: GREEN });
        line(ctx, 'PAR PERSONNE ET PAR JOUR', 500, 1000, t, f('s08', 0.6), { size: 50, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        line(ctx, 'VALEUR SANS TVA FRANÇAISE (20 %)', 500, 400, t, S('s09'), { size: 44, weight: 900, color: '#c9d2e3', dx: 0 });
        wall(ctx, 500, 680, 3, 0.62, t, f('s09', 0.3));
        line(ctx, '3 × 59,99 € / 1,2 × 0,9197 = 137.93', 500, 920, t, f('s09', 0.45), { size: 42, family: F.mono, weight: 700, color: WHITE, dx: 0 });
        stamp(ctx, '< 150 CHF', 500, 1020, t, f('s09', 0.55), { size: 52, color: GREEN }); big(ctx, '− 14.33 CHF', 500, 1150, t, f('s09', 0.75), { size: 90, color: GREEN });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        wall(ctx, 500, 760, 4, 0.62, t, S('s10') - 0.9);
        stamp(ctx, '+ 1', 500 + 1.5 * 170 * 0.62, 470, t, f('s10', 0.3), { size: 80, color: GOLD });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        line(ctx, '4 × 59,99 € / 1,2 × 0,9197 = 183.91', 500, 420, t, S('s11'), { size: 42, family: F.mono, weight: 700, color: '#c9d2e3', dx: 0 });
        stamp(ctx, '> 150 CHF', 500, 560, t, S('s11') + 0.3, { size: 70, color: RED });
        CHR.emo(ctx, 'warning', 500, 740, 180, t, f('s11', 0.35));
        line(ctx, '183.91 × 8,1 %', 500, 900, t, f('s11', 0.5), { size: 66, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '+ 14.90 CHF', 500, 1060, t, f('s11', 0.7), { size: 120, color: CH });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Tes étagères,', 'tu les achètes où ?', '🇨🇭 ou 🇫🇷'], { color: GOLD, size: 62 }); });
      block(ctx, t, S('s13'), S('s14'), () => {
        split(ctx);
        tag(ctx, '4 BILLY', 500, 700, t, S('s13'), { size: 44, color: GOLD });
        price(ctx, '239.80', 275, 900, t, S('s13'), CH, { w: 200, size: 84 }); price(ctx, '235.59', 725, 900, t, f('s13', 0.45), FR, { w: 200, size: 84 });
        tag(ctx, 'TVA SUISSE COMPRISE', 725, 1040, t, f('s13', 0.55), { size: 36 });
      });
      block(ctx, t, S('s14'), S('s15'), () => {
        tag(ctx, '4 ÉTAGÈRES', 500, 420, t, S('s14'), { size: 42, color: GOLD });
        big(ctx, '4.21 CHF', 500, 620, t, f('s14', 0.2), { size: 150, color: GREEN });
        line(ctx, "D'ÉCART SEULEMENT", 500, 790, t, f('s14', 0.35), { size: 62, weight: 900, dx: 0 });
        line(ctx, '1 étagère : 4.78 · 3 étagères : 14.33', 500, 900, t, f('s14', 0.55), { size: 46, family: F.mono, weight: 700, color: '#c9d2e3', dx: 0 });
        tag(ctx, 'EXEMPLE DE CALCUL', 500, 1020, t, f('s14', 0.6), { size: 42 });
        tag(ctx, 'SANS AUTRE ACHAT CE JOUR-LÀ', 500, 1095, t, f('s14', 0.6), { size: 42 });
      });
      block(ctx, t, S('s15'), END + 1, () => igEnd(ctx, t, S('s15')));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
