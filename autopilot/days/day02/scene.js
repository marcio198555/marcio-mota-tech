// Jour 2 — « 3 instruments de mesure cachés dans ton iPhone » (mécanique : la fonction cachée).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, phone, followCTA, bookmark, font } = ENG;
  const END = E('s11') + 0.55;

  function iconRuler(ctx, x, y, s, rot = -0.5) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    roundRect(ctx, -110, -34, 220, 68, 12); ctx.fillStyle = C.gold2; ctx.fill();
    ctx.strokeStyle = '#3a2d08'; ctx.lineWidth = 5;
    for (let i = -90; i <= 90; i += 20) { ctx.beginPath(); ctx.moveTo(i, -34); ctx.lineTo(i, i % 40 === 10 || i % 40 === -30 ? -6 : -16); ctx.stroke(); }
    ctx.restore();
  }
  function iconLevel(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -120, -40, 240, 80, 40); ctx.fillStyle = '#16233b'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.fg; ctx.stroke();
    ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.fg; ctx.lineWidth = 4; [-40, 40].forEach(dx => { ctx.beginPath(); ctx.moveTo(dx, -26); ctx.lineTo(dx, 26); ctx.stroke(); });
    ctx.restore();
  }
  function iconMountain(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-120, 70); ctx.lineTo(-30, -60); ctx.lineTo(10, 0); ctx.lineTo(50, -40); ctx.lineTo(120, 70); ctx.closePath();
    ctx.fillStyle = '#1f3b66'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.fg; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-30, -60); ctx.lineTo(-52, -28); ctx.lineTo(-12, -32); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
    ctx.strokeStyle = C.gold2; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(95, -10); ctx.lineTo(95, -80); ctx.moveTo(75, -58); ctx.lineTo(95, -80); ctx.lineTo(115, -58); ctx.stroke();
    ctx.restore();
  }
  function step(ctx, n, label) { chip(ctx, n + ' · ' + label, 520, 305, { color: C.gold, size: 34, dot: C.red }); }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE
      block(ctx, t, 0, S('s03'), () => {
        const k = ease.out(prog(t, 0, 0.4));
        text(ctx, '3', 520, 560, { size: 460, weight: 900, color: C.gold2, shadow: 'rgba(201,168,76,0.55)', shadowBlur: 60 });
        const pops = [[250, 470, iconRuler, 0.75], [800, 450, iconLevel, 0.62], [790, 690, iconMountain, 0.62]];
        pops.forEach(([x, y, fn, s], i) => {
          const pk = ease.back(prog(t, 0.15 + i * 0.35, 0.35));
          if (pk > 0) fn(ctx, x, y + Math.sin(t * 2 + i) * 8, s * pk);
        });
        text(ctx, 'INSTRUMENTS', 520, 860, { size: 104, weight: 900, color: C.white });
        text(ctx, 'CACHÉS', 520, 965, { size: 104, weight: 900, color: C.white });
        chip(ctx, 'DANS TON IPHONE', 520, 1085, { color: C.gold, size: 34 });
        const lk = prog(t, S('s02'), 0.3);
        if (lk > 0) text(ctx, 'jamais ouverts ?', 520, 1180, { size: 54, weight: 800, color: C.muted, alpha: lk });
      });

      // 1. RÈGLE
      block(ctx, t, S('s03'), S('s05'), () => {
        step(ctx, '1', 'RÈGLE');
        phone(ctx, 520, 790, 470, 880, { draw: (x, y, w, h) => {
          const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#1b2433'); g.addColorStop(1, '#0d131d'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
          // objet (boîte) en perspective
          ctx.fillStyle = '#3b4a63'; ctx.beginPath(); ctx.moveTo(-150, 40); ctx.lineTo(150, 40); ctx.lineTo(190, 160); ctx.lineTo(-190, 160); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#2a3548'; ctx.fillRect(-190, 160, 380, 120);
          // réticule
          ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -150, 22, 0, Math.PI * 2); ctx.stroke();
          // trait de mesure
          const mk = ease.inOut(prog(t, S('s04') + 0.6, 1.4));
          const x0 = -190, x1 = lerp(-190, 190, mk);
          ctx.strokeStyle = C.white; ctx.lineWidth = 6; ctx.setLineDash([]);
          ctx.beginPath(); ctx.moveTo(x0, 160); ctx.lineTo(x1, 160); ctx.stroke();
          ctx.fillStyle = C.white; [x0, x1].forEach(px => { ctx.beginPath(); ctx.arc(px, 160, 11, 0, Math.PI * 2); ctx.fill(); });
          if (mk > 0.98) {
            roundRect(ctx, -80, 70, 160, 64, 32); ctx.fillStyle = C.white; ctx.fill();
            text(ctx, '42 cm', 0, 103, { size: 40, family: F.mono, weight: 700, color: '#05080f' });
          }
          text(ctx, 'MESURES', 0, y + 90, { size: 30, family: F.mono, weight: 700, color: C.muted, letter: 4 });
        } });
        text(ctx, 'exemple', 840, 1210, { size: 28, family: F.mono, weight: 400, color: C.muted });
      });

      // 2. NIVEAU À BULLE
      block(ctx, t, S('s05'), S('s07'), () => {
        step(ctx, '2', 'NIVEAU À BULLE');
        const lv = ease.inOut(prog(t, S('s06') + 1.6, 1.0));
        const ang = lerp(2, 0, lv);
        const r = -ang * Math.PI / 180;
        // étagère
        ctx.save(); ctx.translate(520, 1060); ctx.rotate(r);
        roundRect(ctx, -420, 0, 840, 46, 8); ctx.fillStyle = '#6b4f2e'; ctx.fill(); ctx.fillStyle = '#4e391f'; ctx.fillRect(-420, 34, 840, 12);
        ctx.restore();
        phone(ctx, 520 + Math.sin(r) * 320, 1060 - Math.cos(r) * 320, 330, 640, { rot: r, draw: (x, y, w, h) => {
          ctx.fillStyle = lv > 0.99 ? '#0f5a33' : '#0b1220'; ctx.fillRect(x, y, w, h);
          ctx.save(); ctx.rotate(-r);
          ctx.strokeStyle = C.white; ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(150, 0); ctx.stroke();
          text(ctx, Math.round(ang) + '°', 0, -110, { size: 120, family: F.mono, weight: 700, color: lv > 0.99 ? C.white : C.gold2 });
          ctx.restore();
        } });
      });

      // 3. ALTIMÈTRE
      block(ctx, t, S('s07'), S('s09'), () => {
        step(ctx, '3', 'ALTIMÈTRE');
        phone(ctx, 520, 790, 470, 880, { draw: (x, y, w, h) => {
          ctx.fillStyle = '#05080f'; ctx.fillRect(x, y, w, h);
          const rot = Math.sin(t * 0.8) * 0.15;
          ctx.save(); ctx.translate(0, -90); ctx.rotate(rot);
          ctx.strokeStyle = C.fg; ctx.lineWidth = 3;
          for (let i = 0; i < 72; i++) { const a = i * Math.PI / 36, r1 = 175, r2 = i % 6 === 0 ? 145 : 160; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); ctx.stroke(); }
          ctx.fillStyle = C.red2; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(-14, -176); ctx.lineTo(14, -176); ctx.closePath(); ctx.fill();
          text(ctx, 'N', 0, -122, { size: 40, weight: 800, color: C.red2 });
          ctx.restore();
          const hk = ease.out(prog(t, S('s08') + 1.2, 0.4));
          roundRect(ctx, -190, 200, 380, 150, 24); ctx.fillStyle = hk > 0 ? 'rgba(201,168,76,' + (0.25 * hk) + ')' : 'rgba(0,0,0,0)'; ctx.fill();
          text(ctx, 'ALTITUDE', 0, 238, { size: 26, family: F.mono, weight: 700, color: C.muted, letter: 4 });
          text(ctx, '1 250 m', 0, 300, { size: 70, family: F.mono, weight: 700, color: C.gold2 });
          text(ctx, 'BOUSSOLE', 0, y + 90, { size: 30, family: F.mono, weight: 700, color: C.muted, letter: 4 });
        } });
        text(ctx, 'exemple', 840, 1210, { size: 28, family: F.mono, weight: 400, color: C.muted });
      });

      // BONUS : taille d'une personne
      block(ctx, t, S('s09'), S('s10'), () => {
        chip(ctx, 'BONUS', 520, 305, { color: C.gold, size: 34, dot: C.gold });
        // silhouette
        ctx.save(); ctx.translate(430, 0); ctx.fillStyle = '#2b3850';
        ctx.beginPath(); ctx.arc(0, 480, 62, 0, Math.PI * 2); ctx.fill();
        roundRect(ctx, -95, 560, 190, 380, 70); ctx.fill();
        roundRect(ctx, -85, 900, 75, 300, 30); ctx.fill(); roundRect(ctx, 10, 900, 75, 300, 30); ctx.fill();
        ctx.restore();
        const hk = ease.inOut(prog(t, S('s09') + 0.4, 1.2));
        ctx.save(); ctx.strokeStyle = C.gold2; ctx.lineWidth = 6; ctx.lineCap = 'round';
        const yb = 1200, yt = lerp(1200, 418, hk);
        ctx.beginPath(); ctx.moveTo(640, yb); ctx.lineTo(640, yt); ctx.moveTo(610, yb); ctx.lineTo(670, yb); ctx.moveTo(610, yt); ctx.lineTo(670, yt); ctx.stroke(); ctx.restore();
        if (hk > 0.98) text(ctx, '1,78 m', 760, 800, { size: 76, family: F.mono, weight: 700, color: C.gold2, align: 'left' });
        chip(ctx, 'MODÈLES COMPATIBLES', 520, 1250, { color: C.fg, size: 28 });
      });

      // ENREGISTRER
      block(ctx, t, S('s10'), S('s11'), () => {
        const k = ease.back(prog(t, S('s10'), 0.35));
        bookmark(ctx, 520, 620, 1.6 * Math.max(0.01, k), C.gold2);
        text(ctx, 'ENREGISTRE', 520, 900, { size: 120, weight: 900, color: C.white });
        text(ctx, 'pour ta prochaine étagère', 520, 1010, { size: 58, weight: 800, color: C.gold2 });
      });

      // S'ABONNER
      block(ctx, t, S('s11'), END + 1, () => followCTA(ctx, t, S('s11')));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
