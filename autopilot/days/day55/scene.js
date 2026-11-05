// Jour 55 — « Charger son téléphone toute la nuit : ça abîme la batterie ? »
// Nouvelle recette (05.11, données vidIQ) : duel « toi / ton collègue » dès l'image 0, question ouverte, réponse au
// milieu, 2e surprise (la chaleur), chiffres concrets, un changement à l'écran toutes les 2 s, retour au duel à la fin.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, phone, followCTA, readout } = ENG;
  const END = E('s15') + 0.6;
  const RED = C.red2 || '#e0414f', GOLD = C.gold2 || '#e6c66a', GREEN = C.green || '#3fbf7f';

  // ---------- petites briques ----------
  function stamp(ctx, label, x, y, t, t0, o = {}) {
    const k = ease.back(prog(t, t0, 0.32));
    if (k <= 0.001) return;
    const size = o.size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.07); ctx.scale(lerp(1.5, 1, k), lerp(1.5, 1, k));
    ctx.globalAlpha *= clamp(k * 2.5);
    ctx.font = `900 ${size}px InterDisplay`; const w = ctx.measureText(label).width + 56, h = size + 34;
    roundRect(ctx, -w / 2, -h / 2, w, h, 16); ctx.lineWidth = 8; ctx.strokeStyle = o.color || RED; ctx.stroke();
    ctx.fillStyle = 'rgba(3,4,8,0.55)'; ctx.fill();
    text(ctx, label, 0, 2, { size, weight: 900, color: o.color || RED });
    ctx.restore();
  }
  // batterie horizontale ; level 0..1
  function battery(ctx, x, y, w, level, o = {}) {
    const h = w * 0.46;
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -w / 2, -h / 2, w, h, h * 0.22); ctx.fillStyle = '#060b14'; ctx.fill();
    ctx.lineWidth = Math.max(5, w * 0.03); ctx.strokeStyle = o.border || C.fg; ctx.stroke();
    roundRect(ctx, w / 2 + 4, -h * 0.18, w * 0.06, h * 0.36, 6); ctx.fillStyle = o.border || C.fg; ctx.fill();
    const m = w * 0.05, iw = (w - 2 * m) * clamp(level);
    if (iw > 2) { roundRect(ctx, -w / 2 + m, -h / 2 + m, iw, h - 2 * m, h * 0.14); ctx.fillStyle = o.color || GREEN; ctx.fill(); }
    if (o.label !== false) text(ctx, o.label || `${Math.round(level * 100)} %`, 0, 4, { size: o.size || w * 0.24, family: F.mono, weight: 700, color: o.labelColor || C.white, stroke: 'rgba(0,0,0,0.6)' });
    ctx.restore();
  }
  const moonCache = {};
  function moon(ctx, x, y, r, alpha = 1) {
    let c = moonCache[r];
    if (!c) {
      c = document.createElement('canvas'); c.width = c.height = Math.ceil(r * 2 + 4);
      const g = c.getContext('2d'); g.translate(r + 2, r + 2);
      g.fillStyle = '#f2e6b8'; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
      g.globalCompositeOperation = 'destination-out';
      g.beginPath(); g.arc(r * 0.45, -r * 0.25, r * 0.88, 0, Math.PI * 2); g.fill();
      moonCache[r] = c;
    }
    ctx.save(); ctx.globalAlpha *= alpha; ctx.shadowColor = 'rgba(242,230,184,0.55)'; ctx.shadowBlur = 40;
    ctx.drawImage(c, x - r - 2, y - r - 2); ctx.restore();
  }
  // interrupteur (on = 0..1)
  function toggle(ctx, x, y, on, o = {}) {
    const w = o.w || 170, h = w * 0.52;
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = on > 0.5 ? GREEN : '#2b3850'; ctx.fill();
    const kx = lerp(-w / 2 + h / 2, w / 2 - h / 2, ease.inOut(clamp(on)));
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(kx, 0, h / 2 - 8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function stars(ctx, t, alpha = 1) {
    const pts = [[120, 360], [860, 330], [960, 420], [700, 280], [380, 390], [560, 340], [150, 520], [930, 560]];
    pts.forEach(([x, y], i) => {
      const tw = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.7);
      ctx.save(); ctx.globalAlpha *= alpha * (0.35 + 0.65 * tw); ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x, y, 3 + (i % 3), 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });
  }
  function plugWall(ctx, x, y) {
    roundRect(ctx, x - 46, y - 46, 92, 92, 18); ctx.fillStyle = '#e9edf5'; ctx.fill();
    ctx.fillStyle = '#3a4458'; ctx.beginPath(); ctx.arc(x - 16, y, 7, 0, Math.PI * 2); ctx.arc(x + 16, y, 7, 0, Math.PI * 2); ctx.fill();
  }
  // câble entre la prise (px,py) et le téléphone (qx,qy) ; off = 0..1 (débranché)
  function cable(ctx, px, py, qx, qy, off, t) {
    const ex = lerp(px, px + 95, off), ey = lerp(py, py + 30, off);
    ctx.save(); ctx.strokeStyle = '#cfd6e4'; ctx.lineWidth = 9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(qx, qy); ctx.bezierCurveTo(qx, qy + 110, ex, ey + lerp(140, 50, off), ex, ey); ctx.stroke();
    roundRect(ctx, ex - 22, ey - 30, 44, 44, 10); ctx.fillStyle = '#cfd6e4'; ctx.fill();
    if (off < 0.05) { // courant qui circule
      const k = (t * 1.6) % 1;
      const bx = lerp(ex, qx, k), by = lerp(ey, qy, k) + Math.sin(k * Math.PI) * 90;
      ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(bx, by, 9, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function thermometer(ctx, x, y, h, frac, color) {
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -34, -h, 68, h + 20, 34); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.fg; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 40, 58, 0, Math.PI * 2); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 40, 44, 0, Math.PI * 2); ctx.fill();
    const fh = (h - 30) * clamp(frac);
    roundRect(ctx, -18, 10 - fh, 36, fh + 20, 18); ctx.fill();
    ctx.restore();
  }
  function num(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function duel(ctx, t, t0, o = {}) {
    // séparation
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(230,198,106,0.45)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(540, 420); ctx.lineTo(540, 1200); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 290, 470, { color: C.white, size: 38, border: GOLD });
    chip(ctx, 'TON COLLÈGUE', 790, 470, { color: C.white, size: 34, border: GOLD });
    CHR.emo(ctx, 'woman_technologist', 290, 625, 230, t, o.pop ? t0 : undefined, { phase: 0.3 });
    CHR.emo(ctx, 'man_technologist', 790, 625, 230, t, o.pop ? t0 + 0.12 : undefined, { phase: 1.4 });
    // téléphones + prises
    phone(ctx, 290, 935, 186, 330, { draw: (x, y, w, h) => battery(ctx, x + w / 2, y + h / 2, w * 0.86, o.leftLevel ?? 1, { size: 40 }) });
    phone(ctx, 790, 935, 186, 330, { draw: (x, y, w, h) => battery(ctx, x + w / 2, y + h / 2, w * 0.86, o.rightLevel ?? 0.8, { size: 40, color: GOLD }) });
    plugWall(ctx, 130, 1170); plugWall(ctx, 630, 1170);
    cable(ctx, 130, 1170, 290, 1100, 0, t);
    cable(ctx, 630, 1170, 790, 1100, o.rightOff ?? 1, t);
  }

  window.SCENE = {
    duration: END,
    load: () => CHR.load(['man_technologist', 'woman_technologist', 'thinking_face', 'bed', 'thermometer', 'fire', 'cross_mark',
      'check_mark_button', 'mobile_phone', 'stopwatch', 'warning']),
    draw(ctx, t) {
      background(ctx, t);

      // 1. ACCROCHE (image 0 complète) : toi / ton collègue
      block(ctx, t, 0, S('s03'), () => {
        const night = 1 - prog(t, S('s02'), 0.4) * 0.35;
        stars(ctx, t, night); moon(ctx, 975, 255, 34, night);
        text(ctx, 'TOUTE LA NUIT', 470, 378, { size: 88, weight: 900, color: GOLD, shadow: 'rgba(201,168,76,0.45)', shadowBlur: 30 });
        text(ctx, '?', 840, 375, { size: 104, weight: 900, color: RED });
        const off = ease.inOut(prog(t, S('s02') + 0.35, 0.6));
        const rl = lerp(1, 0.8, off);
        duel(ctx, t, 0, { leftLevel: 1, rightLevel: 0.8, rightOff: off });
        if (t >= S('s02') + 0.8) stamp(ctx, 'STOP À 80 %', 760, 1045, t, S('s02') + 0.8, { size: 46, color: GOLD, rot: 0.06 });
        void rl;
      });

      // 2. Dans 3 ans ?
      block(ctx, t, S('s03'), S('s04'), () => {
        text(ctx, 'DANS 3 ANS', 520, 420, { size: 104, weight: 900, color: C.white });
        const yr = Math.round(lerp(2026, 2029, ease.inOut(prog(t, S('s03') + 0.2, 1.3))));
        readout(ctx, 'ANNÉE', String(yr), 520, 610, { w: 460, h: 190, size: 100 });
        chip(ctx, 'CAPACITÉ DE LA BATTERIE', 520, 768, { color: C.muted, size: 28 });
        battery(ctx, 290, 900, 300, 0.62, { label: '? %', color: '#3a4660', size: 66 });
        battery(ctx, 760, 900, 300, 0.62, { label: '? %', color: '#3a4660', size: 66 });
        text(ctx, 'TOI', 290, 1040, { size: 42, weight: 800, color: C.muted });
        text(ctx, 'TON COLLÈGUE', 760, 1040, { size: 42, weight: 800, color: C.muted });
        CHR.emo(ctx, 'thinking_face', 520, 1135, 150, t, S('s03') + 0.5);
      });

      // 3. Chaque cycle use un peu
      block(ctx, t, S('s04'), S('s05'), () => {
        const lt = t - S('s04');
        const lvl = 0.5 + 0.5 * Math.cos(lt * 3.2);
        battery(ctx, 520, 620, 520, lvl, { label: false });
        // flèche circulaire
        ctx.save(); ctx.translate(520, 620); ctx.rotate(lt * 2.2); ctx.strokeStyle = GOLD; ctx.lineWidth = 12; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, 0, 330, 0.2, Math.PI * 1.6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(330 * Math.cos(Math.PI * 1.6) - 26, 330 * Math.sin(Math.PI * 1.6) - 10);
        ctx.lineTo(330 * Math.cos(Math.PI * 1.6), 330 * Math.sin(Math.PI * 1.6)); ctx.lineTo(330 * Math.cos(Math.PI * 1.6) + 12, 330 * Math.sin(Math.PI * 1.6) - 30); ctx.stroke();
        ctx.restore();
        const cyc = 1 + Math.floor(lt * 3.2 / (Math.PI * 2) + 0.5);
        text(ctx, `CYCLE ${cyc}`, 520, 1040, { size: 72, family: F.mono, weight: 700, color: GOLD });
        chip(ctx, 'ÇA S\'USE UN PEU À CHAQUE FOIS', 520, 1140, { color: C.white, size: 32 });
      });

      // 4. Apple : 80 % après 1 000 cycles
      block(ctx, t, S('s05'), S('s06'), () => {
        const k = ease.inOut(prog(t, S('s05') + 0.3, 2.0));
        readout(ctx, 'CYCLES', num(lerp(0, 1000, k)), 520, 470, { w: 560, h: 200, size: 110 });
        const cap = lerp(1, 0.8, k);
        const x = 150, y = 680, w = 740, h = 130;
        roundRect(ctx, x, y, w, h, 28); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.line; ctx.stroke();
        roundRect(ctx, x + 10, y + 10, (w - 20) * cap, h - 20, 20); ctx.fillStyle = GREEN; ctx.fill();
        if (k > 0.02) { roundRect(ctx, x + 10 + (w - 20) * cap, y + 10, (w - 20) * (1 - cap), h - 20, 20); ctx.fillStyle = 'rgba(224,65,79,0.35)'; ctx.fill(); }
        text(ctx, 'CAPACITÉ', x, y - 34, { size: 38, family: F.mono, weight: 700, color: C.muted, align: 'left' });
        const pk = ease.back(prog(t, S('s05') + 5.2, 0.35));
        text(ctx, `${Math.round(cap * 100)} %`, x + w, y - 34, { size: lerp(52, 66, pk), family: F.mono, weight: 700, color: GOLD, align: 'right' });
        const ck = ease.out(prog(t, S('s05') + 2.0, 0.4));
        text(ctx, 'CONÇU POUR GARDER', 520, 880, { size: 40, weight: 800, color: C.muted, alpha: ck });
        text(ctx, '80 % après 1 000 cycles', 520, 950, { size: 62, weight: 900, color: C.white, alpha: ck });
        chip(ctx, 'SOURCE : APPLE · iPHONE 15', 520, 1040, { color: GOLD, size: 32, alpha: ck });
        stamp(ctx, 'EN CONDITIONS IDÉALES', 520, 1150, t, S('s05') + 3.4, { size: 44, color: GOLD, rot: -0.04 });
      });

      // 5. Presque 3 ans
      block(ctx, t, S('s06'), S('s07'), () => {
        const labels = ['1 AN', '2 ANS', '2,7 ANS'];
        labels.forEach((lb, i) => {
          const k = ease.back(prog(t, S('s06') + 0.25 + i * 0.45, 0.35));
          if (k <= 0) return;
          ctx.save(); ctx.translate(220 + i * 300, 560); ctx.scale(k, k);
          roundRect(ctx, -125, -110, 250, 220, 26); ctx.fillStyle = i === 2 ? 'rgba(201,168,76,0.18)' : '#0b1220'; ctx.fill();
          ctx.lineWidth = 4; ctx.strokeStyle = i === 2 ? GOLD : C.line; ctx.stroke();
          roundRect(ctx, -125, -110, 250, 56, 26); ctx.fillStyle = i === 2 ? GOLD : '#2b3850'; ctx.fill();
          text(ctx, lb, 0, 20, { size: 54, weight: 900, color: i === 2 ? GOLD : C.white });
          ctx.restore();
        });
        const fk = ease.out(prog(t, S('s06') + 1.6, 0.4));
        text(ctx, '1 000 ÷ 365 ≈ 2,7', 520, 800, { size: 70, family: F.mono, weight: 700, color: C.white, alpha: fk });
        text(ctx, 'PRESQUE 3 ANS', 520, 960, { size: 100, weight: 900, color: GOLD, alpha: fk, shadow: 'rgba(201,168,76,0.4)', shadowBlur: 30 });
        text(ctx, 'à 1 cycle complet par jour', 520, 1070, { size: 42, weight: 700, color: 'rgba(255,255,255,0.85)', alpha: fk });
      });

      // 6. La nuit : sa parade
      block(ctx, t, S('s07'), S('s08'), () => {
        stars(ctx, t, 1); moon(ctx, 780, 470, 90, 1);
        CHR.emo(ctx, 'bed', 430, 820, 340, t, S('s07') + 0.1);
        phone(ctx, 700, 860, 120, 210, { draw: (x, y, w, h) => battery(ctx, x + w / 2, y + h / 2, w * 0.8, 0.8, { size: 26, color: GOLD }) });
        const z = (t - S('s07')) % 1.6;
        text(ctx, 'Z', 560 + z * 60, 640 - z * 90, { size: 60 + z * 20, weight: 900, color: 'rgba(255,255,255,0.8)', alpha: 1 - z / 1.6 });
        chip(ctx, 'SA PARADE', 520, 1110, { color: GOLD, dot: GREEN, size: 40 });
      });

      // 7. Courbe de charge de la nuit : 80 %, pause, 100 % au réveil
      block(ctx, t, S('s08'), S('s09'), () => {
        const x0 = 130, x1 = 910, yb = 1095, yt = 600;
        const lt = prog(t, S('s08') + 0.1, Math.max(1.5, E('s08') - S('s08') - 0.5));
        ctx.save(); ctx.strokeStyle = C.line; ctx.lineWidth = 3;
        [0, 0.8, 1].forEach(v => { const y = lerp(yb, yt, v); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); });
        ctx.restore();
        text(ctx, '100 %', x0 - 10, yt - 34, { size: 34, family: F.mono, weight: 700, color: C.muted, align: 'left' });
        text(ctx, '80 %', x0 - 10, lerp(yb, yt, 0.8) - 34, { size: 34, family: F.mono, weight: 700, color: GOLD, align: 'left' });
        text(ctx, '23:00', x0, yb + 50, { size: 36, family: F.mono, weight: 700, color: C.muted, align: 'left' });
        text(ctx, '07:00', x1, yb + 50, { size: 36, family: F.mono, weight: 700, color: C.muted, align: 'right' });
        // courbe : 30 % → 80 % (0 → 0.2), plateau (0.2 → 0.8), 80 → 100 % (0.8 → 0.97)
        const pts = [[0, 0.3], [0.2, 0.8], [0.8, 0.8], [0.97, 1]];
        const val = u => { for (let i = 1; i < pts.length; i++) { if (u <= pts[i][0]) { const a = pts[i - 1], b = pts[i]; return lerp(a[1], b[1], (u - a[0]) / (b[0] - a[0])); } } return 1; };
        ctx.save(); ctx.strokeStyle = GREEN; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
        const n = 80;
        for (let i = 0; i <= n; i++) { const u = (i / n) * lt; const X = lerp(x0, x1, u), Y = lerp(yb, yt, val(u)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke(); ctx.restore();
        const cur = val(lt);
        const hh = 23 + Math.floor(lt * 8), mm = Math.floor((lt * 8 % 1) * 60);
        readout(ctx, 'HEURE', `${String(hh % 24).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, 300, 400, { w: 380, h: 150, size: 70, labelSize: 26 });
        readout(ctx, 'BATTERIE', `${Math.round(cur * 100)} %`, 740, 400, { w: 380, h: 150, size: 70, labelSize: 26, color: cur >= 0.99 ? GREEN : GOLD });
        if (lt > 0.25 && lt < 0.8) text(ctx, '⏸ ATTEND', lerp(x0, x1, 0.5), lerp(yb, yt, 0.8) + 70, { size: 46, weight: 900, color: GOLD });
        chip(ctx, "SCHÉMA : EXEMPLE D'UNE NUIT", 520, 1218, { color: C.muted, size: 26 });
        if (lt > 0.9) CHR.emo(ctx, 'stopwatch', x1 - 40, yt - 58, 110, t, S('s08') + 0.1 + 0.9 * Math.max(1.5, E('s08') - S('s08') - 0.5));
      });

      // 8. iPhone : activée d'office ; Samsung : à activer
      block(ctx, t, S('s09'), S('s09b'), () => {
        const cards = [[285, 'iPHONE', "ACTIVÉE D'OFFICE", 0.1], [735, 'SAMSUNG', 'À ACTIVER', 0.5 * (E('s09') - S('s09'))]];
        cards.forEach(([x, name, state, d], i) => {
          const k = ease.back(prog(t, S('s09') + d, 0.35));
          if (k <= 0) return;
          ctx.save(); ctx.translate(x, 760); ctx.scale(k, k);
          roundRect(ctx, -195, -300, 390, 600, 34); ctx.fillStyle = '#0b1220'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = i ? GOLD : GREEN; ctx.stroke();
          text(ctx, name, 0, -225, { size: 52, weight: 900, color: C.white });
          text(ctx, i ? 'PROTECTION DE' : 'RECHARGE', 0, -150, { size: 32, weight: 800, color: C.muted });
          text(ctx, i ? 'LA BATTERIE' : 'OPTIMISÉE', 0, -108, { size: 32, weight: 800, color: C.muted });
          const on = i ? prog(t, S('s09') + d + 1.0, 0.35) : 1;
          toggle(ctx, 0, 20, on, { w: 190 });
          text(ctx, state, 0, 150, { size: 38, weight: 900, color: i ? GOLD : GREEN, maxWidth: 360 });
          ctx.restore();
        });
        CHR.emo(ctx, 'check_mark_button', 285, 1110, 90, t, S('s09') + 0.6);
        CHR.emo(ctx, 'check_mark_button', 735, 1110, 90, t, S('s09') + 0.5 * (E('s09') - S('s09')) + 1.1);
      });

      // 8 bis. Modèles récents : la limite de charge à 80 %, comme le collègue
      block(ctx, t, S('s09b'), S('s10'), () => {
        const lt = t - S('s09b');
        const lvl = Math.min(0.8, lerp(0.35, 0.8, ease.inOut(prog(t, S('s09b') + 0.2, 1.6))));
        text(ctx, 'LIMITE DE CHARGE', 520, 430, { size: 78, weight: 900, color: C.white });
        text(ctx, `${Math.round(lvl * 100)} %`, 470, 560, { size: 92, family: F.mono, weight: 700, color: GOLD });
        battery(ctx, 470, 745, 520, lvl, { color: GOLD, label: false });
        ctx.save(); ctx.setLineDash([14, 12]); ctx.strokeStyle = RED; ctx.lineWidth = 6;
        const bx = 470 - 260 + 26 + (520 - 52) * 0.8;
        ctx.beginPath(); ctx.moveTo(bx, 605); ctx.lineTo(bx, 885); ctx.stroke(); ctx.restore();
        stamp(ctx, 'STOP À 80 %', 500, 965, t, S('s09b') + 1.8, { size: 54, color: GOLD, rot: 0.04 });
        chip(ctx, 'iPHONE 15 ET + : LIMITE DE CHARGE', 520, 1070, { color: C.white, size: 28, dot: GREEN });
        chip(ctx, 'SAMSUNG : MODE MAXIMUM', 520, 1140, { color: C.white, size: 28, dot: GREEN });
        CHR.emo(ctx, 'man_technologist', 850, 960, 140, t, S('s09b') + 2.4, { phase: 0.8 });
        void lt;
      });

      // 9. Le vrai ennemi : la chaleur
      block(ctx, t, S('s10'), S('s11'), () => {
        const k = ease.out(prog(t, S('s10') + 0.2, 0.4));
        moon(ctx, 300, 540, 110, 1);
        text(ctx, 'AVEC LE RÉGLAGE', 300, 740, { size: 44, weight: 900, color: C.white, alpha: k });
        chip(ctx, "LA NUIT L'USE MOINS", 300, 815, { color: GREEN, size: 30, dot: GREEN, alpha: k });
        const lt = t - S('s10');
        const tm = S('s10') + 0.55 * (E('s10') - S('s10'));
        chip(ctx, 'MAIS APPLE INSISTE SURTOUT SUR…', 520, 420, { color: GOLD, size: 30, alpha: ease.out(prog(t, tm, 0.3)) });
        CHR.emo(ctx, 'fire', 760, 560, 240, t, E('s10') - 1.3, { phase: 0.4 });
        const hk = ease.back(prog(t, E('s10') - 1.0, 0.4));
        ctx.save(); ctx.translate(520, 990); ctx.scale(Math.max(0.01, hk), Math.max(0.01, hk));
        text(ctx, 'LA CHALEUR', 0, 0, { size: 124, weight: 900, color: RED, shadow: 'rgba(224,65,79,0.55)', shadowBlur: 40 });
        ctx.restore();
        void lt;
      });

      // 10. Au-delà de 35 °C
      block(ctx, t, S('s11'), S('s12'), () => {
        const k = ease.inOut(prog(t, S('s11') + 0.2, 1.4));
        const temp = lerp(22, 35, k);
        const col = temp >= 35 ? RED : temp > 30 ? '#e8914a' : GOLD;
        thermometer(ctx, 220, 900, 420, (temp - 10) / 30, col);
        readout(ctx, 'TEMPÉRATURE AMBIANTE', k >= 1 ? '> 35 °C' : `${Math.round(temp)} °C`, 640, 520, { w: 470, h: 180, size: 92, color: col, border: col, labelSize: 24 });
        chip(ctx, 'DANS LA PIÈCE', 640, 655, { color: C.white, size: 30, alpha: ease.out(prog(t, S('s11') + 1.6, 0.3)) });
        CHR.emo(ctx, 'warning', 220, 395, 110, t, S('s11') + 2.6);
        const cap = lerp(1, 0.86, ease.inOut(prog(t, E('s11') - 2.2, 1.0)));
        battery(ctx, 640, 810, 340, cap, { label: 'CAPACITÉ', size: 46, color: temp >= 35 ? RED : GREEN });
        stamp(ctx, 'POUR DE BON', 640, 1000, t, E('s11') - 1.0, { size: 62 });
        chip(ctx, 'SOURCE : APPLE', 640, 1130, { color: GOLD, size: 32 });
      });

      // 11. Pas sous l'oreiller, pas dans une coque qui chauffe
      block(ctx, t, S('s12'), S('s14'), () => {
        const cards = [[280, "SOUS L'OREILLER"], [730, 'COQUE QUI CHAUFFE']];
        cards.forEach(([x, lb], i) => {
          const k = ease.back(prog(t, S('s12') + 0.15 + i * 0.55, 0.35));
          if (k <= 0) return;
          ctx.save(); ctx.translate(x, 760); ctx.scale(k, k);
          roundRect(ctx, -205, -300, 410, 600, 34); ctx.fillStyle = '#0b1220'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.line; ctx.stroke();
          if (i === 0) {
            CHR.emo(ctx, 'bed', 0, -60, 260, t, undefined);
          } else {
            roundRect(ctx, -95, -230, 190, 330, 40); ctx.fillStyle = '#5b3a2a'; ctx.fill();
            phone(ctx, 0, -65, 150, 290, {});
            for (let j = 0; j < 3; j++) { // ondes de chaleur
              const ph = (t * 1.5 + j * 0.33) % 1;
              ctx.save(); ctx.strokeStyle = `rgba(232,145,74,${1 - ph})`; ctx.lineWidth = 7; ctx.beginPath();
              const yy = -250 - ph * 60; ctx.moveTo(-60 + j * 60, yy); ctx.bezierCurveTo(-80 + j * 60, yy - 20, -40 + j * 60, yy - 40, -60 + j * 60, yy - 60); ctx.stroke(); ctx.restore();
            }
          }
          text(ctx, lb, 0, 200, { size: 40, weight: 900, color: C.white, maxWidth: 380 });
          ctx.restore();
          CHR.emo(ctx, 'cross_mark', x + 140, 520, 130, t, S('s12') + 0.5 + i * 0.55);
        });
      });

      // 13. Retour au duel + question
      block(ctx, t, S('s14'), S('s15'), () => {
        duel(ctx, t, S('s14'), { leftLevel: 0.8, rightLevel: 0.8, rightOff: 1 });
        const k = ease.back(prog(t, S('s14') + 0.2, 0.35));
        ctx.save(); ctx.translate(500, 360); ctx.scale(Math.max(0.01, k), Math.max(0.01, k));
        roundRect(ctx, -395, -60, 790, 120, 40); ctx.fillStyle = 'rgba(201,168,76,0.16)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = GOLD; ctx.stroke();
        text(ctx, 'IL DORT OÙ, TON TÉLÉPHONE ?', 0, 4, { size: 47, weight: 900, color: C.white, maxWidth: 730 });
        ctx.restore();
        text(ctx, '💬', 958, 360, { size: 64 * (1 + 0.08 * Math.sin((t - S('s14')) * 6)), family: F.emoji, weight: 400, alpha: clamp(k) });
      });

      // 14. Abonne-toi
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'ABONNE-TOI', next: ['je vérifie tout ce que', 'tu crois savoir'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
