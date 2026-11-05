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
  function moon(ctx, x, y, r, alpha = 1) {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y);
    ctx.fillStyle = '#f2e6b8'; ctx.shadowColor = 'rgba(242,230,184,0.55)'; ctx.shadowBlur = 40;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(r * 0.45, -r * 0.25, r * 0.88, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function stars(ctx, t, alpha = 1) {
    const pts = [[120, 360], [230, 300], [860, 330], [960, 420], [700, 280], [380, 390], [560, 340], [150, 520], [930, 560]];
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
    CHR.emo(ctx, 'man_technologist', 290, 625, 230, t, o.pop ? t0 : undefined, { phase: 0.3 });
    CHR.emo(ctx, 'woman_technologist', 790, 625, 230, t, o.pop ? t0 + 0.12 : undefined, { phase: 1.4 });
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
        text(ctx, 'TOUTE LA NUIT', 470, 345, { size: 88, weight: 900, color: GOLD, shadow: 'rgba(201,168,76,0.45)', shadowBlur: 30 });
        text(ctx, '?', 840, 342, { size: 104, weight: 900, color: RED });
        const off = ease.inOut(prog(t, S('s02') + 0.35, 0.6));
        const rl = lerp(1, 0.8, off);
        duel(ctx, t, 0, { leftLevel: 1, rightLevel: 0.8, rightOff: off });
        if (t >= S('s02') + 0.8) stamp(ctx, 'STOP À 80 %', 790, 1045, t, S('s02') + 0.8, { size: 46, color: GOLD, rot: 0.06 });
        void rl;
      });

      // 2. Dans 3 ans ?
      block(ctx, t, S('s03'), S('s04'), () => {
        text(ctx, 'DANS 3 ANS', 520, 420, { size: 104, weight: 900, color: C.white });
        const yr = Math.round(lerp(2026, 2029, ease.inOut(prog(t, S('s03') + 0.2, 1.3))));
        readout(ctx, 'ANNÉE', String(yr), 520, 610, { w: 460, h: 190, size: 100 });
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
        text(ctx, `${Math.round(cap * 100)} %`, x + w, y - 34, { size: 52, family: F.mono, weight: 700, color: GOLD, align: 'right' });
        const ck = ease.out(prog(t, S('s05') + 2.0, 0.4));
        text(ctx, '80 % après 1 000 cycles', 520, 920, { size: 62, weight: 900, color: C.white, alpha: ck });
        chip(ctx, 'SOURCE : APPLE · iPHONE 15', 520, 1030, { color: GOLD, size: 32, alpha: ck });
        text(ctx, 'en conditions idéales', 520, 1115, { size: 38, weight: 700, color: 'rgba(255,255,255,0.8)', alpha: ck });
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
        text(ctx, 'PRESQUE 3 ANS', 520, 960, { size: 110, weight: 900, color: GOLD, alpha: fk, shadow: 'rgba(201,168,76,0.4)', shadowBlur: 30 });
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

      // 8. Apple et Samsung le font déjà
      block(ctx, t, S('s09'), S('s10'), () => {
        const k1 = ease.back(prog(t, S('s09') + 0.1, 0.35)), k2 = ease.back(prog(t, S('s09') + 0.45, 0.35));
        ctx.save(); ctx.globalAlpha *= clamp(k1 * 2);
        chip(ctx, 'iPHONE : RECHARGE OPTIMISÉE', 520, 420, { color: C.white, size: 34, dot: GREEN, border: GOLD }); ctx.restore();
        ctx.save(); ctx.globalAlpha *= clamp(k2 * 2);
        chip(ctx, 'SAMSUNG : PROTECTION ADAPTATIVE', 520, 515, { color: C.white, size: 34, dot: GREEN, border: GOLD }); ctx.restore();
        battery(ctx, 290, 760, 280, 0.8, { color: GOLD, size: 60 });
        text(ctx, '=', 520, 770, { size: 120, weight: 900, color: C.white });
        battery(ctx, 750, 760, 280, 0.8, { color: GOLD, size: 60 });
        text(ctx, 'TON TÉLÉPHONE', 290, 900, { size: 38, weight: 800, color: C.muted });
        text(ctx, 'TON COLLÈGUE', 750, 900, { size: 38, weight: 800, color: C.muted });
        stamp(ctx, 'IL LE FAIT DÉJÀ TOUT SEUL', 520, 1080, t, S('s09') + 1.3, { size: 50, color: GREEN });
      });

      // 9. Le vrai ennemi : la chaleur
      block(ctx, t, S('s10'), S('s11'), () => {
        const k = ease.out(prog(t, S('s10') + 0.2, 0.4));
        moon(ctx, 300, 560, 110, 1);
        ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.globalAlpha *= k;
        ctx.beginPath(); ctx.moveTo(170, 430); ctx.lineTo(lerp(170, 430, k), lerp(430, 690, k)); ctx.stroke(); ctx.restore();
        text(ctx, 'PAS LA NUIT', 300, 760, { size: 52, weight: 900, color: C.muted });
        const lt = t - S('s10');
        CHR.emo(ctx, 'fire', 760, 560, 260, t, S('s10') + 0.9, { phase: 0.4 });
        const hk = ease.back(prog(t, S('s10') + 1.1, 0.4));
        ctx.save(); ctx.translate(520, 960); ctx.scale(Math.max(0.01, hk), Math.max(0.01, hk));
        text(ctx, 'LA CHALEUR', 0, 0, { size: 140, weight: 900, color: RED, shadow: 'rgba(224,65,79,0.55)', shadowBlur: 40 });
        ctx.restore();
        void lt;
      });

      // 10. Au-delà de 35 °C
      block(ctx, t, S('s11'), S('s12'), () => {
        const k = ease.inOut(prog(t, S('s11') + 0.2, 1.4));
        const temp = lerp(22, 35, k);
        const col = temp >= 35 ? RED : temp > 30 ? '#e8914a' : GOLD;
        thermometer(ctx, 220, 900, 420, (temp - 10) / 30, col);
        readout(ctx, 'TEMPÉRATURE', k >= 1 ? '> 35 °C' : `${Math.round(temp)} °C`, 640, 520, { w: 470, h: 180, size: 92, color: col, border: col });
        const cap = lerp(1, 0.86, ease.inOut(prog(t, S('s11') + 1.5, 1.0)));
        battery(ctx, 640, 790, 340, cap, { label: 'CAPACITÉ', size: 46, color: temp >= 35 ? RED : GREEN });
        stamp(ctx, 'POUR DE BON', 640, 990, t, S('s11') + 1.7, { size: 62 });
        chip(ctx, 'SOURCE : APPLE', 640, 1130, { color: GOLD, size: 32 });
      });

      // 11. Pas sous l'oreiller, pas dans une coque qui chauffe
      block(ctx, t, S('s12'), S('s13'), () => {
        const cards = [[290, "SOUS L'OREILLER"], [750, 'COQUE QUI CHAUFFE']];
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

      // 12. Zone idéale : 16 à 22 °C
      block(ctx, t, S('s13'), S('s14'), () => {
        const x0 = 120, x1 = 920, y = 760, tmin = 0, tmax = 40;
        const X = v => lerp(x0, x1, (v - tmin) / (tmax - tmin));
        roundRect(ctx, x0, y - 40, x1 - x0, 80, 40); ctx.fillStyle = '#0b1220'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke();
        const k = ease.out(prog(t, S('s13') + 0.3, 0.6));
        roundRect(ctx, X(16), y - 40, (X(22) - X(16)) * k, 80, 20); ctx.fillStyle = GREEN; ctx.fill();
        roundRect(ctx, X(35), y - 40, x1 - X(35), 80, 40); ctx.fillStyle = 'rgba(224,65,79,0.55)'; ctx.fill();
        [0, 16, 22, 35, 40].forEach(v => text(ctx, `${v}°`, X(v), y + 80, { size: 36, family: F.mono, weight: 700, color: v === 16 || v === 22 ? GREEN : v === 35 ? RED : C.muted }));
        text(ctx, '16 – 22 °C', 520, 520, { size: 130, weight: 900, color: GREEN, shadow: 'rgba(63,191,127,0.45)', shadowBlur: 30 });
        chip(ctx, 'ZONE IDÉALE (APPLE)', 520, 1010, { color: GREEN, size: 34 });
        CHR.emo(ctx, 'check_mark_button', 520, 1140, 120, t, S('s13') + 0.8);
      });

      // 13. Retour au duel + question
      block(ctx, t, S('s14'), S('s15'), () => {
        duel(ctx, t, S('s14'), { leftLevel: 0.8, rightLevel: 0.8, rightOff: 1 });
        const k = ease.back(prog(t, S('s14') + 0.2, 0.35));
        ctx.save(); ctx.translate(500, 360); ctx.scale(Math.max(0.01, k), Math.max(0.01, k));
        roundRect(ctx, -395, -60, 790, 120, 40); ctx.fillStyle = 'rgba(201,168,76,0.16)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = GOLD; ctx.stroke();
        text(ctx, 'IL DORT OÙ, TON TÉLÉPHONE ?', 0, 4, { size: 47, weight: 900, color: C.white, maxWidth: 730 });
        ctx.restore();
        text(ctx, '💬', 958, 360, { size: 64, family: F.emoji, weight: 400, alpha: clamp(k) });
      });

      // 14. Abonne-toi
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'ABONNE-TOI', next: ['je mesure tout ce que', 'tu crois savoir'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
