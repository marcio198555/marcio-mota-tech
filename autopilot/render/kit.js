// Briques communes des scènes « vérité du quotidien » (depuis le 06.11.2026). Objet global KIT.
// Tampon, cartes, calcul ligne à ligne, barres, thermomètre, batterie, pièces, horloge, duel, drapeaux, commentaire, personnages.
window.KIT = (function () {
  const { C, F, clamp, lerp, ease, prog, S, E, text, roundRect, chip } = ENG;
  const RED = '#ff4d5a', GOLD = '#e6c66a', GREEN = '#58d68d', BLUE = '#5aa9ff', CYAN = '#39c6d8', WHITE = '#ffffff';
  const f = (id, u) => S(id) + (E(id) - S(id)) * u;
  function pop(ctx, t, t0, x, y, fn, d = 0.32) {
    const k = ease.back(prog(t, t0, d)); if (k <= 0.001) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha *= clamp(k * 2); fn(); ctx.restore();
  }
  function stamp(ctx, label, x, y, t, t0, o = {}) {
    const k = ease.back(prog(t, t0, 0.3)); if (k <= 0.001) return;
    const size = o.size || 64, col = o.color || RED;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.06); const s = lerp(1.5, 1, k); ctx.scale(s, s); ctx.globalAlpha *= clamp(k * 2.5);
    ctx.font = `900 ${size}px InterDisplay`; const w = ctx.measureText(label).width + 56, h = size + 34;
    roundRect(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = 'rgba(3,4,8,0.72)'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = col; ctx.stroke();
    text(ctx, label, 0, 2, { size, weight: 900, color: col }); ctx.restore();
  }
  function panel(ctx, x, y, w, h, o = {}) {
    roundRect(ctx, x, y, w, h, o.r || 30); ctx.fillStyle = o.bg || 'rgba(8,16,30,0.9)'; ctx.fill();
    ctx.lineWidth = o.lw || 4; ctx.strokeStyle = o.border || 'rgba(230,198,106,0.5)'; ctx.stroke();
  }
  // grand nombre qui arrive d'un coup
  function big(ctx, str, x, y, t, t0, o = {}) {
    const k = t0 === undefined ? 1 : ease.back(prog(t, t0, 0.3)); if (k <= 0.001) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha *= clamp(k * 2);
    text(ctx, str, 0, 0, { size: o.size || 150, weight: 900, family: o.family || F.mono, color: o.color || GOLD, stroke: 'rgba(0,0,0,0.55)', shadow: o.glow === false ? undefined : (o.color || GOLD) + '66', shadowBlur: 30, maxWidth: o.maxWidth || 840 });
    ctx.restore();
  }
  function line(ctx, str, x, y, t, t0, o = {}) {
    const a = t0 === undefined ? 1 : ease.out(prog(t, t0, 0.22)); if (a <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - a) * (o.dx ?? 30), 0);
    text(ctx, str, x, y, { size: o.size || 54, weight: o.weight || 800, color: o.color || WHITE, family: o.family, align: o.align, maxWidth: o.maxWidth || 830, stroke: o.stroke }); ctx.restore();
  }
  function tag(ctx, str, x, y, t, t0, o = {}) {
    const a = t0 === undefined ? 1 : ease.out(prog(t, t0, 0.25)); if (a <= 0.001) return;
    chip(ctx, str, x, y, { color: o.color || WHITE, size: o.size || 32, alpha: a, align: o.align, dot: o.dot });
  }
  // calcul : lignes qui s'écrivent, la dernière en grand ; times[i] = début de la ligne i
  function calc(ctx, lines, x, y, t, times, o = {}) {
    const gap = o.gap || 96;
    lines.forEach((ln, i) => {
      const last = i === lines.length - 1;
      if (last) big(ctx, ln, x, y + i * gap + (o.lastDy ?? 40), t, times[i], { size: o.lastSize || 112, color: o.color || GOLD });
      else line(ctx, ln, x, y + i * gap, t, times[i], { size: o.size || 58, family: F.mono, weight: 700, color: C.white });
    });
  }
  // barres horizontales : items = [{label, v (0..1), value, color, t0}]
  function bars(ctx, items, x, y, w, t, o = {}) {
    const rh = o.rh || 170;
    items.forEach((it, i) => {
      const yy = y + i * rh, k = ease.out(prog(t, it.t0 ?? 0, 0.55)); if (prog(t, it.t0 ?? 0, 0.01) <= 0) return;
      text(ctx, it.label, x, yy, { size: o.size || 42, weight: 800, color: C.white, align: 'left', maxWidth: w });
      roundRect(ctx, x, yy + 36, w, 62, 16); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
      const iw = Math.max(16, w * clamp(it.v) * k);
      roundRect(ctx, x, yy + 36, iw, 62, 16); ctx.fillStyle = it.color || GOLD; ctx.fill();
      if (k > 0.75) text(ctx, it.value, x + (it.v > 0.62 ? iw - 18 : iw + 18), yy + 68, { size: 46, family: F.mono, weight: 700, color: it.v > 0.62 ? '#071018' : (it.color || GOLD), align: it.v > 0.62 ? 'right' : 'left' });
    });
  }
  function battery(ctx, x, y, w, level, o = {}) {
    const h = w * 0.46; ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -w / 2, -h / 2, w, h, h * 0.22); ctx.fillStyle = '#060b14'; ctx.fill();
    ctx.lineWidth = Math.max(5, w * 0.03); ctx.strokeStyle = o.border || C.fg; ctx.stroke();
    roundRect(ctx, w / 2 + 4, -h * 0.18, w * 0.06, h * 0.36, 6); ctx.fillStyle = o.border || C.fg; ctx.fill();
    const m = w * 0.05, iw = (w - 2 * m) * clamp(level);
    if (iw > 2) { roundRect(ctx, -w / 2 + m, -h / 2 + m, iw, h - 2 * m, h * 0.14); ctx.fillStyle = o.color || GREEN; ctx.fill(); }
    if (o.label) text(ctx, o.label, 0, 4, { size: o.size || w * 0.2, family: F.mono, weight: 700, color: WHITE, stroke: 'rgba(0,0,0,0.6)' });
    ctx.restore();
  }
  function thermometer(ctx, x, y, h, frac, color) {
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -30, -h, 60, h + 20, 30); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.fg; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 40, 52, 0, Math.PI * 2); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 40, 39, 0, Math.PI * 2); ctx.fill();
    const fh = (h - 26) * clamp(frac); roundRect(ctx, -15, 12 - fh, 30, fh + 20, 15); ctx.fill(); ctx.restore();
  }
  function coin(ctx, x, y, r, label, o = {}) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, '#fbe9a8'); g.addColorStop(1, o.dark || '#b8902e');
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = Math.max(3, r * 0.08); ctx.strokeStyle = '#7d5f18'; ctx.stroke();
    if (label) text(ctx, label, x, y + 2, { size: r * 0.8, weight: 900, color: '#4c3a0c' }); ctx.restore();
  }
  // pièces qui tombent à partir de t0 (n pièces, positions déterministes)
  function coins(ctx, t, t0, n, x0, x1, yEnd, label) {
    for (let i = 0; i < n; i++) {
      const d = t - t0 - i * 0.09; if (d < 0) continue;
      const x = lerp(x0, x1, ((i * 37) % 11) / 10), k = ease.out(clamp(d / 0.45));
      coin(ctx, x, lerp(yEnd - 420, yEnd - ((i * 13) % 5) * 22, k), 40, label);
    }
  }
  function clock(ctx, x, y, r, spin, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = '#0a1322'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = o.color || GOLD; ctx.stroke();
    for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate(i * Math.PI / 6); ctx.fillStyle = C.fg; ctx.fillRect(-3, -r + 10, 6, 18); ctx.restore(); }
    ctx.strokeStyle = WHITE; ctx.lineCap = 'round'; ctx.lineWidth = 10;
    ctx.save(); ctx.rotate(spin / 12); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * 0.5); ctx.stroke(); ctx.restore();
    ctx.lineWidth = 6; ctx.strokeStyle = o.color || GOLD; ctx.save(); ctx.rotate(spin); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * 0.78); ctx.stroke(); ctx.restore();
    ctx.restore();
  }
  function toggle(ctx, x, y, on, o = {}) {
    const w = o.w || 170, h = w * 0.52; ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = on > 0.5 ? (o.color || GREEN) : '#2b3850'; ctx.fill();
    const kx = lerp(-w / 2 + h / 2, w / 2 - h / 2, ease.inOut(clamp(on)));
    ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(kx, 0, h / 2 - 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function flagCH(ctx, x, y, s) {
    roundRect(ctx, x - s / 2, y - s / 2, s, s, s * 0.1); ctx.fillStyle = '#d52b1e'; ctx.fill();
    ctx.fillStyle = WHITE; ctx.fillRect(x - s * 0.1, y - s * 0.31, s * 0.2, s * 0.62); ctx.fillRect(x - s * 0.31, y - s * 0.1, s * 0.62, s * 0.2);
  }
  function flagFR(ctx, x, y, s) {
    const w = s * 1.4, h = s; ctx.save(); roundRect(ctx, x - w / 2, y - h / 2, w, h, s * 0.08); ctx.clip();
    ctx.fillStyle = '#0055a4'; ctx.fillRect(x - w / 2, y - h / 2, w / 3, h); ctx.fillStyle = WHITE; ctx.fillRect(x - w / 6, y - h / 2, w / 3, h);
    ctx.fillStyle = '#ef4135'; ctx.fillRect(x + w / 6, y - h / 2, w / 3, h); ctx.restore();
  }
  // cadre du duel : ligne centrale, TOI à gauche, TON COLLÈGUE à droite
  function duelFrame(ctx, o = {}) {
    const y0 = o.y0 || 480, y1 = o.y1 || 1200;
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(230,198,106,0.45)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, y0); ctx.lineTo(500, y1); ctx.stroke(); ctx.restore();
    chip(ctx, o.left || 'TOI', 275, y0 + 10, { color: WHITE, size: 38 });
    chip(ctx, o.right || 'TON COLLÈGUE', 725, y0 + 10, { color: WHITE, size: 34 });
  }
  function head(ctx, str, y, t, t0, o = {}) {
    const k = t0 === undefined ? 1 : ease.back(prog(t, t0, 0.3)); if (k <= 0) return;
    ctx.save(); ctx.translate(500, y); ctx.scale(k, k);
    ctx.font = `900 ${o.size || 62}px InterDisplay`; const w = Math.min(ctx.measureText(str).width + 60, 880);
    roundRect(ctx, -w / 2, -(o.size || 62) * 0.85, w, (o.size || 62) * 1.7, 28); ctx.fillStyle = o.bg || 'rgba(230,198,106,0.18)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = o.color || GOLD; ctx.stroke();
    text(ctx, str, 0, 2, { size: o.size || 62, weight: 900, color: WHITE, maxWidth: 830 }); ctx.restore();
  }
  // carte commentaire : grande bulle + 💬 ; fn = contenu en plus
  function comment(ctx, t, t0, lines, o = {}) {
    pop(ctx, t, t0 + 0.05, 500, o.y || 720, () => {
      panel(ctx, -410, -230, 820, 460, { r: 54, border: o.color || GOLD, lw: 6 });
      ctx.beginPath(); ctx.moveTo(-210, 228); ctx.lineTo(-290, 330); ctx.lineTo(-90, 228); ctx.closePath(); ctx.fillStyle = 'rgba(8,16,30,0.9)'; ctx.fill(); ctx.strokeStyle = o.color || GOLD; ctx.lineWidth = 6; ctx.stroke();
      lines.forEach((ln, i) => text(ctx, ln, 0, (i - (lines.length - 1) / 2) * 84, { size: o.size || 66, weight: 900, color: WHITE, maxWidth: 760 }));
    });
    text(ctx, '💬', 800, (o.y || 720) - 270, { size: 110 + 8 * Math.sin((t - t0) * 6), family: F.emoji, weight: 400, alpha: clamp((t - t0) * 4) });
  }
  // personnages détourés (bouche et yeux mesurés dans assets/ai/SOURCES.md)
  const FRIDGE = { mouth: [0.435, 0.335, 0.13], eyes: [[0.296, 0.267, 0.085, 0.06], [0.581, 0.27, 0.087, 0.06]], skin: '#e6e7ec', lid: '#e6e7ec', lip: '#55586a' };
  const MICRO = { mouth: [0.447, 0.558, 0.14], eyes: [[0.31, 0.423, 0.075, 0.108], [0.567, 0.423, 0.075, 0.108]], skin: '#2d2d2f', lid: '#2d2d2f', lip: '#101014' };
  // écran de téléviseur simple
  function tv(ctx, x, y, w, o = {}) {
    const h = w * 0.6; ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = '#1c2433'; ctx.fillRect(-w * 0.09, h / 2, w * 0.18, w * 0.06); roundRect(ctx, -w * 0.24, h / 2 + w * 0.05, w * 0.48, w * 0.03, 6); ctx.fill();
    roundRect(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = '#05080f'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#34425c'; ctx.stroke();
    const on = o.on ?? 0;
    if (on > 0.01) {
      ctx.save(); ctx.globalAlpha *= on; roundRect(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#2c6bd6'); g.addColorStop(1, '#7c3bc9'); ctx.fillStyle = g; ctx.fill(); ctx.restore();
    }
    if (o.led !== false) { ctx.fillStyle = o.ledColor || RED; ctx.shadowColor = o.ledColor || RED; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(w / 2 - 30, h / 2 - 22, 9 + (o.pulse || 0), 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; }
    ctx.restore();
  }
  // ondes Wi-Fi
  function wifi(ctx, x, y, s, color, t) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = s * 0.11;
    for (let i = 0; i < 3; i++) { ctx.globalAlpha *= 1; ctx.strokeStyle = color; ctx.save(); ctx.globalAlpha *= 0.45 + 0.55 * Math.abs(Math.sin(t * 2.2 - i * 0.7)); ctx.beginPath(); ctx.arc(x, y, s * (0.32 + i * 0.3), -Math.PI * 0.76, -Math.PI * 0.24); ctx.stroke(); ctx.restore(); }
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, s * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  return { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, bars, battery, thermometer, coin, coins, clock, toggle, flagCH, flagFR, duelFrame, head, comment, FRIDGE, MICRO, tv, wifi };
})();
