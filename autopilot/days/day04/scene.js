// Jour 4 — « Oscillo-battant en hiver : mauvaise idée » (mécanique : tu le fais mal / contre-pied, source OFSP).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA } = ENG;
  const END = E('s10') + 0.55;

  // Fenêtre vue de face. mode : 'tilt' (oscillo-battant), 'open' (grande ouverte), 'closed'. k = avancement.
  function windowFrame(ctx, cx, cy, w, h, mode, k = 1) {
    ctx.save(); ctx.translate(cx, cy);
    // mur
    roundRect(ctx, -w / 2 - 40, -h / 2 - 40, w + 80, h + 80, 18); ctx.fillStyle = '#121a2a'; ctx.fill();
    // ciel froid
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#20324f'); g.addColorStop(1, '#3d5a80');
    ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 26; i++) { const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * w - w / 2, y = ((Math.sin(i * 33.1) * 0.5 + 0.5) * h + (Date.now() * 0) ) - h / 2; ctx.beginPath(); ctx.arc(x, y, 3 + (i % 3), 0, Math.PI * 2); ctx.fill(); }
    ctx.lineWidth = 16; ctx.strokeStyle = '#d9dee8';
    if (mode === 'tilt') {
      // battant basculé : le haut s'ouvre vers l'intérieur (trapèze)
      const d = 70 * k;
      ctx.beginPath(); ctx.moveTo(-w / 2 - d, -h / 2 - d * 0.4); ctx.lineTo(w / 2 + d, -h / 2 - d * 0.4); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath();
      ctx.fillStyle = 'rgba(180,210,240,0.18)'; ctx.fill(); ctx.stroke();
    } else if (mode === 'open') {
      const a = k;
      [-1, 1].forEach(sd => {
        ctx.beginPath(); const x0 = sd * w / 2, xm = sd * lerp(w / 2 - w / 2, w / 2 + 40, 0);
        const inner = lerp(0, sd * (w / 2 - 30), a);
        ctx.moveTo(x0, -h / 2); ctx.lineTo(inner, -h / 2 + 30 * a); ctx.lineTo(inner, h / 2 - 30 * a); ctx.lineTo(x0, h / 2); ctx.closePath();
        ctx.fillStyle = 'rgba(180,210,240,0.18)'; ctx.fill(); ctx.stroke();
      });
    } else {
      ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.lineTo(0, h / 2); ctx.stroke();
      ctx.fillStyle = 'rgba(180,210,240,0.12)'; ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }
  function heatWaves(ctx, x, y, t, n = 3, color = '#ff6b4a') {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 9; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const ox = x + (i - (n - 1) / 2) * 70, ph = (t * 1.6 + i * 0.33) % 1;
      ctx.globalAlpha = 1 - ph;
      ctx.beginPath();
      for (let s = 0; s <= 20; s++) { const yy = y - ph * 160 - s * 9, xx = ox + Math.sin(s * 0.7 + t * 6 + i) * 12; s ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
    }
    ctx.restore();
  }
  function clock(ctx, x, y, r, frac, label, color) {
    ctx.save(); ctx.translate(x, y);
    ctx.lineWidth = 16; ctx.strokeStyle = '#1d2a44'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = color || C.gold2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.stroke();
    text(ctx, label, 0, 4, { size: r * 0.62, family: F.mono, weight: 700, color: C.white });
    ctx.restore();
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE
      block(ctx, t, 0, S('s03'), () => {
        windowFrame(ctx, 520, 720, 400, 480, 'tilt', 1);
        heatWaves(ctx, 520, 470, t, 3);
        text(ctx, 'OSCILLO-BATTANT', 520, 1030, { size: 84, weight: 900, color: C.white, maxWidth: 820 });
        chip(ctx, 'EN HIVER', 520, 1120, { color: C.fg, size: 36, dot: '#7fb3ff' });
        const xk = 1;
        if (xk > 0) { ctx.save(); ctx.translate(790, 520); ctx.scale(xk, xk); ctx.strokeStyle = C.red2; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-60, -60); ctx.lineTo(60, 60); ctx.moveTo(60, -60); ctx.lineTo(-60, 60); ctx.stroke(); ctx.restore(); }
        const sk = prog(t, S('s02'), 0.3);
        if (sk > 0) text(ctx, 'énergie perdue', 520, 1205, { size: 54, weight: 800, color: '#ff8a6b', alpha: sk });
      });

      // OFSP
      block(ctx, t, S('s03'), S('s04'), () => {
        roundRect(ctx, 130, 520, 780, 420, 36); ctx.fillStyle = 'rgba(11,18,32,0.95)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke();
        text(ctx, '🇨🇭', 520, 620, { size: 90, family: F.emoji, weight: 400 });
        text(ctx, 'Office fédéral', 520, 740, { size: 64, weight: 800, color: C.white });
        text(ctx, 'de la santé publique', 520, 820, { size: 64, weight: 800, color: C.white, maxWidth: 740 });
        chip(ctx, 'RECOMMANDATION', 520, 1010, { color: C.gold, size: 36 });
      });

      // 3 fois par jour
      block(ctx, t, S('s04'), S('s05'), () => {
        text(ctx, '3×', 520, 520, { size: 240, weight: 900, color: C.gold2 });
        text(ctx, 'PAR JOUR', 520, 690, { size: 70, weight: 900, color: C.white });
        const items = [['🌅', 'MATIN'], ['☀️', 'MIDI'], ['🌙', 'SOIR']];
        items.forEach(([em, lb], i) => {
          const k = ease.back(prog(t, S('s04') + 0.6 + i * 0.55, 0.35));
          if (k <= 0) return;
          ctx.save(); ctx.translate(250 + i * 270, 900); ctx.scale(k, k);
          roundRect(ctx, -110, -120, 220, 240, 30); ctx.fillStyle = 'rgba(17,27,46,0.95)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke();
          text(ctx, em, 0, -30, { size: 90, family: F.emoji, weight: 400 });
          text(ctx, lb, 0, 70, { size: 36, family: F.mono, weight: 700, color: C.fg });
          ctx.restore();
        });
      });

      // Grand ouvert, 5 minutes
      block(ctx, t, S('s05'), S('s06'), () => {
        const ok = ease.inOut(prog(t, S('s05') + 0.1, 0.8));
        windowFrame(ctx, 380, 700, 360, 460, 'open', ok);
        const frac = clamp((t - S('s05') - 0.6) / 2.4);
        const left = Math.max(0, 300 - Math.round(frac * 300));
        clock(ctx, 790, 700, 150, frac, '5:00', C.gold2);
        text(ctx, 'GRAND OUVERT', 520, 1040, { size: 84, weight: 900, color: C.white });
        chip(ctx, 'AU MOINS 5 MINUTES', 520, 1140, { color: C.gold, size: 36 });
      });

      // Très froid : 3 minutes
      block(ctx, t, S('s06'), S('s07'), () => {
        text(ctx, '❄️', 330, 640, { size: 200, family: F.emoji, weight: 400 });
        text(ctx, '💨', 720, 640, { size: 200, family: F.emoji, weight: 400 });
        text(ctx, 'AU MOINS', 520, 800, { size: 56, weight: 900, color: C.fg });
        text(ctx, '3 MIN', 520, 930, { size: 200, weight: 900, color: '#9fd0ff' });
        text(ctx, 'si très froid ou courant d\'air', 520, 1080, { size: 50, weight: 800, color: C.fg, maxWidth: 820 });
      });

      // On referme
      block(ctx, t, S('s07'), S('s08'), () => {
        const ck = ease.inOut(prog(t, S('s07') + 0.05, 0.6));
        windowFrame(ctx, 520, 650, 420, 520, ck < 1 ? 'open' : 'closed', 1 - ck);
        const k = ease.back(prog(t, S('s07') + 0.6, 0.35));
        if (k > 0) { ctx.save(); ctx.translate(520, 1040); ctx.scale(k, k); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = C.white; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-30, 2); ctx.lineTo(-6, 26); ctx.lineTo(34, -22); ctx.stroke(); ctx.restore(); }
      });

      // Humidité / moisissures
      block(ctx, t, S('s08'), S('s09'), () => {
        text(ctx, '💧', 360, 620, { size: 210, family: F.emoji, weight: 400 });
        ctx.save(); ctx.strokeStyle = C.green; ctx.lineWidth = 18; ctx.lineCap = 'round';
        const ak = ease.out(prog(t, S('s08') + 0.3, 0.5));
        ctx.beginPath(); ctx.moveTo(640, 480); ctx.lineTo(640, 480 + 260 * ak); ctx.moveTo(580, 480 + 200 * ak); ctx.lineTo(640, 480 + 260 * ak); ctx.lineTo(700, 480 + 200 * ak); ctx.stroke(); ctx.restore();
        text(ctx, "MOINS D'HUMIDITÉ", 520, 930, { size: 80, weight: 900, color: C.white, maxWidth: 900 });
        text(ctx, 'moins de moisissures', 520, 1035, { size: 58, weight: 800, color: C.gold2 });
      });

      // Partage
      block(ctx, t, S('s09'), S('s10'), () => {
        const k = ease.back(prog(t, S('s09'), 0.35));
        ctx.save(); ctx.translate(520, 600); ctx.scale(Math.max(0.01, k), Math.max(0.01, k));
        ctx.fillStyle = C.gold2; ctx.beginPath(); ctx.moveTo(-120, 40); ctx.quadraticCurveTo(-110, -90, 40, -90); ctx.lineTo(40, -160); ctx.lineTo(170, -40); ctx.lineTo(40, 80); ctx.lineTo(40, 10); ctx.quadraticCurveTo(-60, 0, -120, 40); ctx.closePath(); ctx.fill();
        ctx.restore();
        text(ctx, 'ENVOIE ÇA', 520, 880, { size: 110, weight: 900, color: C.white });
        chip(ctx, 'À TON COLOC', 520, 1000, { color: C.gold, size: 38 });
      });

      block(ctx, t, S('s10'), END + 1, () => followCTA(ctx, t, S('s10'), { next: ['combien de temps pour', 'casser ton mot de passe'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
