// Vidéo 97 — Écran « HDR 400 » contre « HDR 1000 » : ce que le label VESA DisplayHDR garantit (critères CTS 1.2). Chiffres : days/day97/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, roundRect } = ENG;
  const { RED, GOLD, GREEN, WHITE, f, pop, stamp, panel, big, line, tag, comment, head } = KIT;
  const END = E('s15') + 0.6;
  const A = '#ff9f43', B = '#4fd8ff'; // HDR 400 (orange), HDR 1000 (cyan)
  // écran générique (sans marque) ; o.glow = intensité de la tache lumineuse centrale, o.black = gris du noir (0..1)
  function monitor(ctx, cx, cy, w, t, o = {}) {
    const h = w * 0.58;
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = '#1a1f2e'; ctx.fillRect(-w * 0.05, h / 2, w * 0.1, w * 0.12); roundRect(ctx, -w * 0.2, h / 2 + w * 0.11, w * 0.4, w * 0.035, 8); ctx.fill();
    roundRect(ctx, -w / 2, -h / 2, w, h, 18); ctx.fillStyle = '#05070d'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = o.border || A; ctx.stroke();
    ctx.save(); roundRect(ctx, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 12); ctx.clip();
    const bl = Math.round(255 * (o.black ?? 0.08)); ctx.fillStyle = `rgb(${bl},${bl},${bl + 4})`; ctx.fillRect(-w / 2, -h / 2, w, h);
    if (o.corners) { ctx.fillStyle = '#ffffff'; ctx.fillRect(-w / 2 + 10, -h / 2 + 10, w * 0.22, h * 0.25); ctx.fillRect(w / 2 - 10 - w * 0.22, h / 2 - 10 - h * 0.25, w * 0.22, h * 0.25); }
    if (o.glow) {
      const r = w * 0.32, g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * (0.8 + o.glow * 0.7));
      g.addColorStop(0, `rgba(255,255,255,${0.35 + 0.65 * o.glow})`); g.addColorStop(0.35, `rgba(255,245,220,${0.25 + 0.5 * o.glow})`); g.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = `rgba(255,255,255,${0.6 + 0.4 * o.glow})`; ctx.fillRect(-w * 0.07, -h * 0.07, w * 0.14, h * 0.14);
    }
    if (o.zones) { // rétroéclairage par zones : les zones s'éteignent là où l'image est noire
      const nx = 8, ny = 5, zw = (w - 20) / nx, zh = (h - 20) / ny;
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const px = -w / 2 + 10 + i * zw, py = -h / 2 + 10 + j * zh;
        const d = Math.hypot(i - (nx - 1) / 2 - 1.5 * Math.sin(t * 1.3), j - (ny - 1) / 2);
        const on = d < 1.6;
        ctx.fillStyle = on ? 'rgba(255,248,225,0.95)' : 'rgba(0,0,0,0.95)'; ctx.fillRect(px + 2, py + 2, zw - 4, zh - 4);
      }
    }
    if (o.draw) o.draw(w, h);
    ctx.restore(); ctx.restore();
  }
  function logo(ctx, label, x, y, col, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -172, -50, 344, 100, 18); ctx.fillStyle = '#0a1322'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = col; ctx.stroke();
    text(ctx, label, 0, 4, { size: 64, family: F.mono, weight: 900, color: col });
    ctx.restore();
  }
  function duel(ctx, t, o = {}) {
    KIT.duelFrame(ctx, { y0: 430, y1: o.y1 || 1080 });
    monitor(ctx, 275, 720, 380, t, { border: A, glow: o.ga ?? 0.4, black: o.ba, corners: o.corners });
    monitor(ctx, 725, 720, 380, t, { border: B, glow: o.gb ?? 1, black: o.bb, corners: o.corners });
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
    load: () => CHR.load(['thinking_face', 'light_bulb', 'magnifying_glass_tilted_left', 'check_mark_button', 'exploding_head', 'television']),
    draw(ctx, t) {
      background(ctx, t);
      // image 0 : deux écrans, deux logos en très gros qui battent, « ? » qui tourne
      block(ctx, t, 0, S('s03'), () => {
        duel(ctx, t, { ga: 0.35 + 0.1 * Math.sin(t * 4), gb: 0.9 + 0.1 * Math.sin(t * 4) });
        const b = 1 + 0.06 * Math.sin(t * 5);
        ctx.save(); ctx.translate(275, 1000); ctx.scale(b, b); logo(ctx, 'HDR 400', 0, 0, A, 0.95); ctx.restore();
        ctx.save(); ctx.translate(725, 1000); ctx.scale(2 - b, 2 - b); logo(ctx, 'HDR 1000', 0, 0, B, 0.95); ctx.restore();
        ctx.save(); ctx.translate(500, 1000); ctx.rotate(0.2 * Math.sin(t * 3)); text(ctx, '?', 0, 0, { size: 130, weight: 900, color: GOLD, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        head(ctx, 'COMBIEN DE FOIS MIEUX ?', 1195, t, 1.0, { size: 50 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'À LA FIN', 500, 430, t, S('s03'), { size: 46, color: GOLD });
        logo(ctx, 'HDR 1000', 500, 640, B, 1.4);
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 690, 760, 200, t, S('s03') + 0.2);
        big(ctx, 'LE CHIFFRE CACHÉ', 500, 960, t, f('s03', 0.35), { size: 90, family: F.display, color: GOLD });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'VESA · LABEL DisplayHDR', 500, 420, t, S('s04'), { size: 42, color: GOLD });
        logo(ctx, 'HDR 400', 500, 620, A, 1.1); logo(ctx, 'HDR 1000', 500, 790, B, 1.1);
        line(ctx, 'CRITÈRES OFFICIELS · VERSION 1.2 (2024)', 500, 960, t, f('s04', 0.5), { size: 40, weight: 900, color: '#c9d2e3', dx: 0 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        monitor(ctx, 500, 720, 760, t, { border: GOLD, glow: 0.6 + 0.4 * clamp((t - S('s05')) * 0.8) });
        tag(ctx, 'LUMIÈRE MAXIMALE', 500, 420, t, S('s05'), { size: 46, color: GOLD });
        tag(ctx, 'PETIT CARRÉ AU CENTRE (8 %)', 500, 1080, t, f('s05', 0.4), { size: 38 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        duel(ctx, t, { ga: 0.4, gb: 1 });
        big(ctx, '400', 275, 1000, t, S('s06'), { size: 110, color: A }); big(ctx, '1000', 725, 1000, t, S('s06') + 0.25, { size: 110, color: B });
        tag(ctx, 'cd/m² (MINIMUM)', 500, 1085, t, S('s06') + 0.3, { size: 36 });
        stamp(ctx, '× 2,5', 500, 1215, t, f('s06', 0.6), { size: 90, color: GOLD });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        CHR.emo(ctx, 'light_bulb', 330, 650, 220, t, S('s07'));
        pop(ctx, t, f('s07', 0.5), 680, 650, () => { ctx.beginPath(); ctx.arc(0, 0, 120, 0, 7); ctx.fillStyle = '#000'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#555c6b'; ctx.stroke(); });
        line(ctx, 'LUMIÈRE', 330, 880, t, S('s07') + 0.2, { size: 56, weight: 900, color: GOLD, dx: 0 });
        line(ctx, 'NOIR', 680, 880, t, f('s07', 0.55), { size: 56, weight: 900, color: WHITE, dx: 0 });
        big(ctx, '+', 505, 650, t, f('s07', 0.4), { size: 120, color: WHITE });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'TEST OFFICIEL DU NOIR', 500, 420, t, S('s08'), { size: 44, color: GOLD });
        monitor(ctx, 500, 720, 760, t, { border: GOLD, corners: true, black: 0.03 });
        pop(ctx, t, f('s08', 0.55), 500, 720, () => { ctx.beginPath(); ctx.arc(0, 0, 48, 0, 7); ctx.lineWidth = 8; ctx.strokeStyle = GREEN; ctx.stroke(); ctx.beginPath(); ctx.moveTo(34, 34); ctx.lineTo(90, 90); ctx.stroke(); });
        tag(ctx, 'ON MESURE ICI', 500, 1080, t, f('s08', 0.6), { size: 38, color: GREEN });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        duel(ctx, t, { ga: 0, gb: 0, corners: true, ba: 0.16, bb: 0.02 });
        big(ctx, '0,4', 275, 1000, t, S('s09'), { size: 110, color: A }); big(ctx, '0,05', 725, 1000, t, f('s09', 0.5), { size: 110, color: B });
        tag(ctx, 'cd/m² AU MAXIMUM', 500, 1110, t, S('s09') + 0.3, { size: 36 });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        duel(ctx, t, { ga: 0, gb: 0, corners: true, ba: 0.16, bb: 0.02 });
        stamp(ctx, '× 8 PLUS SOMBRE', 500, 1000, t, S('s10') + 0.1, { size: 72, color: GREEN });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'HDR 1000 : GRADATION LOCALE 2D', 500, 420, t, S('s11'), { size: 38, color: B });
        monitor(ctx, 500, 730, 760, t, { border: B, zones: true });
        tag(ctx, 'SCHÉMA', 500, 1080, t, f('s11', 0.3), { size: 34 });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Ton écran,', 'il a quel logo HDR ?', '400 ? 1000 ?'], { color: GOLD, size: 60 }); });
      block(ctx, t, S('s13'), S('s14'), () => {
        tag(ctx, 'CONTRASTE MINIMUM, MÊME IMAGE', 500, 420, t, S('s13'), { size: 40, color: GOLD });
        KIT.duelFrame(ctx, { y0: 500, y1: 1150 });
        const ka = ease.out(prog(t, S('s13') + 0.3, 0.6)), kb = ease.out(prog(t, f('s13', 0.5), 0.9));
        roundRect(ctx, 215, 1080 - 18 * ka, 120, 18 * ka + 4, 10); ctx.fillStyle = A; ctx.fill();
        roundRect(ctx, 665, 1080 - 415 * kb, 120, 415 * kb + 4, 10); ctx.fillStyle = B; ctx.fill();
        line(ctx, '1300 : 1', 275, 980, t, S('s13') + 0.4, { size: 58, family: F.mono, weight: 900, color: A, dx: 0 });
        line(ctx, '30 000 : 1', 725, 620, t, f('s13', 0.6), { size: 58, family: F.mono, weight: 900, color: B, dx: 0 });
      });
      block(ctx, t, S('s14'), S('s15'), () => {
        big(ctx, '× 23', 500, 640, t, S('s14'), { size: 220, color: GREEN });
        line(ctx, 'PAS × 2,5', 500, 850, t, f('s14', 0.45), { size: 80, weight: 900, color: A, dx: 0 });
        tag(ctx, '30 000 ÷ 1300 · CRITÈRES VESA 1.2', 500, 980, t, f('s14', 0.55), { size: 36 });
        CHR.emo(ctx, 'exploding_head', 500, 1110, 120, t, f('s14', 0.6));
      });
      block(ctx, t, S('s15'), END + 1, () => igEnd(ctx, t, S('s15')));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
