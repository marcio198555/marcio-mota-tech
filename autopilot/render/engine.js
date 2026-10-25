// Moteur de rendu des vidéos Autopilot TikTok (canvas 1080x1920, rendu image par image).
// Une scène définit window.SCENE = { duration, draw(ctx, t) } et utilise les aides ci-dessous.
(function () {
  const W = 1080, H = 1920;
  const C = {
    bg: '#030408', navy: '#0b1220', navy2: '#111b2e', navy3: '#16233b', line: '#1d2a44',
    fg: '#e9edf5', muted: '#8e9ab3', gold: '#c9a84c', gold2: '#e6c66a', red: '#c82030', red2: '#ff3b4e',
    green: '#3fb47a', grass: '#2f8f5b', black: '#000000', white: '#ffffff'
  };
  const F = { display: 'InterDisplay', body: 'InterText', mono: 'MonoData', emoji: 'EmojiColor' };
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = {
    lin: t => t,
    out: t => 1 - Math.pow(1 - t, 3),
    in: t => t * t * t,
    inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    elastic: t => (t === 0 || t === 1) ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1
  };
  const prog = (t, start, dur) => clamp((t - start) / Math.max(1e-6, dur));
  const TL = window.TL || { segments: [] };
  const segById = id => TL.segments.find(s => s.id === id);
  const S = id => (segById(id) || { start: 0 }).start;
  const E = id => (segById(id) || { end: 0 }).end;

  // bruit de grain (évite le banding H.264)
  let grain = null;
  function makeGrain() {
    grain = document.createElement('canvas'); grain.width = 256; grain.height = 256;
    const g = grain.getContext('2d'); const img = g.createImageData(256, 256);
    let seed = 1234567;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    for (let i = 0; i < img.data.length; i += 4) { const v = Math.floor(rnd() * 255); img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  }

  function background(ctx, t, opts = {}) {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    const gx = W * 0.45, gy = H * 0.36;
    const rg = ctx.createRadialGradient(gx, gy, 40, gx, gy, 1100);
    rg.addColorStop(0, opts.glow || 'rgba(32,52,92,0.55)'); rg.addColorStop(0.55, 'rgba(12,20,36,0.35)'); rg.addColorStop(1, 'rgba(3,4,8,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    // grille « plan technique »
    const step = 60, off = (t * 6) % step;
    ctx.save(); ctx.globalAlpha = opts.gridAlpha ?? 0.22; ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -step + off; x < W + step; x += step) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
    for (let y = -step + off * 0.5; y < H + step; y += step) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
    ctx.stroke(); ctx.restore();
    // vignette
    const vg = ctx.createRadialGradient(W / 2, H / 2, 500, W / 2, H / 2, 1250);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }

  function grainPass(ctx, frame) {
    if (!grain) makeGrain();
    ctx.save(); ctx.globalAlpha = 0.035; ctx.globalCompositeOperation = 'overlay';
    const ox = (frame * 73) % 256, oy = (frame * 151) % 256;
    for (let x = -ox; x < W; x += 256) for (let y = -oy; y < H; y += 256) ctx.drawImage(grain, x, y);
    ctx.restore();
  }

  function font(weight, size, family) { return `${weight} ${size}px "${family}", "${F.emoji}", sans-serif`; }

  function text(ctx, str, x, y, o = {}) {
    ctx.save();
    ctx.font = font(o.weight || 800, o.size || 64, o.family || F.display);
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
    if (o.letter) ctx.letterSpacing = o.letter + 'px';
    if (o.maxWidth) {
      const w = ctx.measureText(str).width;
      if (w > o.maxWidth) { const s = o.size * o.maxWidth / w; ctx.font = font(o.weight || 800, s, o.family || F.display); }
    }
    ctx.globalAlpha = o.alpha ?? 1;
    if (o.shadow) { ctx.shadowColor = o.shadow; ctx.shadowBlur = o.shadowBlur ?? 30; }
    if (o.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = o.strokeWidth || 10; ctx.strokeStyle = o.stroke; ctx.strokeText(str, x, y); }
    ctx.fillStyle = o.color || C.fg; ctx.fillText(str, x, y);
    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function chip(ctx, label, x, y, o = {}) {
    ctx.save();
    ctx.font = font(700, o.size || 30, F.mono); ctx.letterSpacing = (o.letter ?? 3) + 'px';
    const w = ctx.measureText(label).width + (o.padX || 28) * 2 + (o.dot ? 26 : 0), h = (o.size || 30) + 30;
    const x0 = o.align === 'left' ? x : x - w / 2;
    ctx.globalAlpha = o.alpha ?? 1;
    roundRect(ctx, x0, y - h / 2, w, h, h / 2);
    ctx.fillStyle = o.bg || 'rgba(11,18,32,0.88)'; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = o.border || C.line; ctx.stroke();
    let tx = x0 + (o.padX || 28);
    if (o.dot) { ctx.fillStyle = o.dot; ctx.beginPath(); ctx.arc(tx + 8, y, 8, 0, Math.PI * 2); ctx.fill(); tx += 26; }
    ctx.fillStyle = o.color || C.gold; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(label, tx, y + 1);
    ctx.restore();
    return w;
  }

  // Sous-titres façon TikTok : phrase du segment, mot courant en or.
  function wordsFor(seg) {
    if (seg.words && seg.words.length) return seg.words;
    const toks = (seg.display || seg.text).split(/ +/).filter(Boolean);
    const total = toks.filter(w => w !== '|').reduce((a, w) => a + w.length + 1, 0);
    let acc = 0; const d = seg.end - seg.start;
    return toks.map(w => { if (w === '|') { const s = seg.start + d * acc / total; return [s, s, '|']; } const s = seg.start + d * acc / total; acc += w.length + 1; return [s, seg.start + d * acc / total, w]; });
  }
  // découpe en cartons sur le jeton « | » ; renvoie le carton affiché à l'instant t
  function pageAt(words, t) {
    const pages = [[]];
    words.forEach(w => { if (w[2] === '|') { if (pages[pages.length - 1].length) pages.push([]); } else pages[pages.length - 1].push(w); });
    let cur = pages[0];
    pages.forEach(p => { if (p.length && t >= p[0][0] - 0.05) cur = p; });
    return cur;
  }
  function captions(ctx, t, o = {}) {
    const segs = TL.segments;
    let seg = null;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i], next = segs[i + 1];
      const until = next ? Math.min(next.start - 0.05, s.end + 0.45) : s.end + (o.hold ?? 0.3);
      if (t >= s.start - 0.05 && t < Math.max(until, s.end)) { seg = s; break; }
    }
    if (!seg) return;
    const words = pageAt(wordsFor(seg), t);
    const size = o.size || 66, maxW = o.maxWidth || 820, cx = o.x || 510, cy = o.y || 1330;
    ctx.save();
    ctx.font = font(900, size, F.display); ctx.textBaseline = 'middle';
    const space = ctx.measureText(' ').width;
    const widths = words.map(wd => ctx.measureText(wd[2]).width);
    const total = widths.reduce((a, b) => a + b, 0) + space * Math.max(0, words.length - 1);
    // découpe équilibrée : nombre minimal de lignes, puis largeur maximale la plus petite possible
    const m = widths.length;
    const lineW = (i, j) => { let sw = 0; for (let q = i; q < j; q++) sw += widths[q]; return sw + space * (j - i - 1); };
    let n = 1, gw = 0;
    for (let i = 0; i < m; i++) { const w = widths[i]; if (gw > 0 && gw + space + w > maxW) { n++; gw = w; } else gw += (gw > 0 ? space : 0) + w; }
    const INF = 1e9, best = [], prev = [];
    for (let q = 0; q <= n; q++) { best.push(new Array(m + 1).fill(INF)); prev.push(new Array(m + 1).fill(-1)); }
    best[0][0] = 0;
    for (let q = 1; q <= n; q++) for (let j = 1; j <= m; j++) for (let i = q - 1; i < j; i++) {
      if (best[q - 1][i] >= INF) continue;
      const w = lineW(i, j); if (w > maxW && j - i > 1) continue;
      const v = Math.max(best[q - 1][i], w); if (v < best[q][j]) { best[q][j] = v; prev[q][j] = i; }
    }
    const lines = [];
    if (best[n][m] < INF) { let j = m; for (let q = n; q >= 1; q--) { const i = prev[q][j]; lines.unshift(words.slice(i, j).map((wd, r) => ({ wd, w: widths[i + r] }))); j = i; } }
    else { lines.push(words.map((wd, r) => ({ wd, w: widths[r] }))); }
    const k = ease.back(prog(t, (words.length ? words[0][0] : seg.start) - 0.05, 0.16));
    const scale = 0.86 + 0.14 * k;
    ctx.translate(cx, cy); ctx.scale(scale, scale);
    const lh = size * 1.18; const y0 = -(lines.length - 1) * lh / 2;
    lines.forEach((line, li) => {
      const tw = line.reduce((a, x) => a + x.w, 0) + space * (line.length - 1);
      let x = -tw / 2; const y = y0 + li * lh;
      line.forEach(({ wd, w }) => {
        const active = t >= wd[0] - 0.02 && t < (wd[1] + 0.08);
        const said = t >= wd[0] - 0.02;
        ctx.lineJoin = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(0,0,0,0.92)';
        ctx.textAlign = 'left';
        ctx.strokeText(wd[2], x, y);
        ctx.fillStyle = active ? C.gold2 : (said ? C.white : 'rgba(255,255,255,0.78)');
        ctx.fillText(wd[2], x, y);
        x += w + space;
      });
    });
    ctx.restore();
  }

  function brand(ctx, t, o = {}) {
    chip(ctx, 'JE MESURE TOUT', 70, o.y || 262, { align: 'left', dot: C.red, size: 30, alpha: o.alpha ?? 0.95 });
  }

  // compteur numérique façon instrument
  function readout(ctx, label, value, x, y, o = {}) {
    const w = o.w || 520, h = o.h || 210;
    ctx.save(); ctx.globalAlpha = o.alpha ?? 1;
    roundRect(ctx, x - w / 2, y - h / 2, w, h, 26); ctx.fillStyle = '#060b14'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = o.border || C.gold; ctx.stroke();
    ctx.font = font(700, o.labelSize || 32, F.mono); ctx.fillStyle = C.muted; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.letterSpacing = '3px';
    ctx.fillText(label, x - w / 2 + 28, y - h / 2 + 22);
    ctx.letterSpacing = '0px';
    ctx.font = font(700, o.size || 110, F.mono); ctx.fillStyle = o.color || C.gold2; ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = 'rgba(201,168,76,0.45)'; ctx.shadowBlur = 24;
    ctx.fillText(value, x + w / 2 - 30, y + h / 2 - 34);
    ctx.restore();
  }

  // Bloc de scène : fondu + léger zoom en entrée/sortie (le bloc qui commence à 0 est complet dès l'image 0).
  function block(ctx, t, start, end, fn) {
    if (t < start - 0.001 || t >= end + 0.001) return;
    const fin = start <= 0 ? 1 : ease.out(prog(t, start, 0.18));
    const a = Math.min(fin, 1 - ease.in(prog(t, end - 0.12, 0.12)));
    if (a <= 0) return;
    const k = start <= 0 ? 1 : ease.out(prog(t, start, 0.35));
    ctx.save(); ctx.globalAlpha = a;
    ctx.translate(540, 900); ctx.scale(0.965 + 0.035 * k, 0.965 + 0.035 * k); ctx.translate(-540, -900 + (1 - k) * 26);
    fn(t - start);
    ctx.restore();
  }

  // Téléphone générique (sans marque). Retourne le rectangle de l'écran.
  function phone(ctx, cx, cy, w, h, o = {}) {
    ctx.save(); ctx.translate(cx, cy); if (o.rot) ctx.rotate(o.rot);
    roundRect(ctx, -w / 2, -h / 2, w, h, w * 0.14); ctx.fillStyle = '#05080f'; ctx.fill();
    ctx.lineWidth = 8; ctx.strokeStyle = o.border || '#2b3850'; ctx.stroke();
    const m = w * 0.055;
    roundRect(ctx, -w / 2 + m, -h / 2 + m, w - 2 * m, h - 2 * m, w * 0.1); ctx.fillStyle = o.screen || '#0b1220'; ctx.fill();
    roundRect(ctx, -w * 0.13, -h / 2 + m + 14, w * 0.26, 26, 13); ctx.fillStyle = '#000'; ctx.fill();
    if (o.draw) { ctx.save(); roundRect(ctx, -w / 2 + m, -h / 2 + m, w - 2 * m, h - 2 * m, w * 0.1); ctx.clip(); o.draw(-w / 2 + m, -h / 2 + m, w - 2 * m, h - 2 * m); ctx.restore(); }
    ctx.restore();
  }

  // Fin : appel à s'abonner (identique sur toutes les vidéos).
  function followCTA(ctx, t, t0) {
    text(ctx, '@marcio.mota8', 520, 560, { size: 104, weight: 900, color: C.white, maxWidth: 880 });
    chip(ctx, 'JE MESURE TOUT', 520, 690, { color: C.gold, dot: C.red, size: 42 });
    text(ctx, 'avant que tu achètes', 520, 810, { size: 62, weight: 800, color: C.gold2 });
    const p = 1 + 0.05 * Math.sin((t - t0) * 7);
    ctx.save(); ctx.translate(520, 960); ctx.scale(p, p);
    roundRect(ctx, -220, -58, 440, 116, 58); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, "S'ABONNER", 0, 2, { size: 54, weight: 900, color: C.white });
    ctx.restore();
  }

  // Icône « enregistrer » (signet) pour l'appel à sauvegarder.
  function bookmark(ctx, x, y, s, color) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-60, -80); ctx.lineTo(60, -80); ctx.lineTo(60, 90); ctx.lineTo(0, 45); ctx.lineTo(-60, 90); ctx.closePath();
    ctx.fillStyle = color || C.gold2; ctx.fill();
    ctx.restore();
  }

  window.ENG = { W, H, C, F, clamp, lerp, ease, prog, S, E, segById, background, grainPass, font, text, roundRect, chip, captions, brand, readout, block, phone, followCTA, bookmark, TL };
})();
