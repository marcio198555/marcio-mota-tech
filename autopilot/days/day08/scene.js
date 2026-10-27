// Vidéo 8 — « Arrête de fermer tes applis » (mécanique : le mythe démonté par la source officielle).
// Sources : Apple (support.apple.com/fr-ch/HT201330), Google (support.google.com/android/answer/9079646),
// Android Developers (démarrage à froid), Apple (apple.com/fr/batteries : luminosité automatique).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, segById, background, text, roundRect, chip, captions, brand, block, phone, followCTA } = ENG;
  const END = E('s09') + 0.55;
  const W80 = 'rgba(255,255,255,0.8)';
  // instant où le mot est dit (sinon repli proportionnel)
  function wordAt(id, word, frac) {
    const sg = segById(id) || {}; const w = (sg.words || []).find(x => x[2] && x[2].replace(/[.,!?  :]/g, '').toLowerCase() === word);
    return w ? w[0] : S(id) + (E(id) - S(id)) * frac;
  }
  const tStop = wordAt('s01', 'arrête', 0.8);

  function appCard(ctx, x, y, w, h, hue, k) {
    ctx.save(); ctx.globalAlpha *= k;
    roundRect(ctx, x - w / 2, y - h / 2, w, h, 28); ctx.fillStyle = '#e9edf5'; ctx.fill();
    roundRect(ctx, x - w / 2, y - h / 2, w, 70, 28); ctx.fillStyle = `hsl(${hue},55%,45%)`; ctx.fill();
    ctx.fillStyle = `hsl(${hue},40%,80%)`;
    for (let i = 0; i < 3; i++) { roundRect(ctx, x - w / 2 + 24, y - h / 2 + 100 + i * 70, w - 48 - i * 40, 40, 12); ctx.fill(); }
    ctx.restore();
  }
  function quote(ctx, lines, y0, size, color) {
    lines.forEach((ln, i) => text(ctx, ln, 520, y0 + i * size * 1.22, { size, weight: 900, color: color || C.white, maxWidth: 820 }));
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE : on balaie les applis… et on se fait arrêter
      block(ctx, t, 0, S('s02'), () => {
        phone(ctx, 520, 560, 360, 640, { draw: (x, y, w, h) => {
          ctx.fillStyle = '#0d1422'; ctx.fillRect(x, y, w, h);
          const cyc = (t % 1.1) / 1.1;
          const swipe = t < tStop ? ease.in(clamp((cyc - 0.35) / 0.5)) : 0;
          appCard(ctx, 0, -10 - swipe * 520, 250, 400, 210, 1 - swipe * 0.6);
          appCard(ctx, -150, 10, 250, 400, 140, 0.55);
          appCard(ctx, 150, 10, 250, 400, 20, 0.55);
          if (t < tStop) { ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(0, 180 - swipe * 300, 26, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
        } });
        text(ctx, 'TU FERMES', 520, 985, { size: 96, weight: 900, color: C.white });
        text(ctx, 'TES APPLIS ?', 520, 1085, { size: 96, weight: 900, color: C.white, maxWidth: 820 });
        chip(ctx, 'POUR LA BATTERIE', 520, 1185, { color: C.gold, size: 36, dot: C.red });
        const k = ease.back(prog(t, tStop - 0.05, 0.3));
        if (k > 0) {
          ctx.save(); ctx.translate(520, 560); ctx.rotate(-0.12); ctx.scale(lerp(1.6, 1, k), lerp(1.6, 1, k)); ctx.globalAlpha *= clamp(k * 2);
          roundRect(ctx, -280, -95, 560, 190, 26); ctx.fillStyle = 'rgba(200,32,48,0.92)'; ctx.fill();
          ctx.lineWidth = 8; ctx.strokeStyle = C.white; ctx.stroke();
          text(ctx, 'ARRÊTE', 0, 6, { size: 130, weight: 900, color: C.white });
          ctx.restore();
        }
      });

      // APPLE
      block(ctx, t, S('s02'), S('s03'), () => {
        chip(ctx, 'APPLE · ASSISTANCE OFFICIELLE', 520, 400, { color: C.fg, size: 36 });
        quote(ctx, ['« Ne fermez une app', 'que si elle', 'ne répond pas. »'], 600, 84);
        const k = ease.out(prog(t, S('s02') + 1.4, 0.5));
        ctx.save(); ctx.strokeStyle = C.gold2; ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(230, 862); ctx.lineTo(lerp(230, 810, k), 862); ctx.stroke(); ctx.restore();
        text(ctx, 'support.apple.com', 520, 960, { size: 38, family: F.mono, weight: 400, color: W80 });
      });

      // GOOGLE / ANDROID
      block(ctx, t, S('s03'), S('s05'), () => {
        chip(ctx, 'GOOGLE · ANDROID', 520, 400, { color: C.fg, size: 36 });
        quote(ctx, ['« Même sans fermer', 'tes applis, tu ne', 'manqueras ni de mémoire,', 'ni de batterie. »'], 560, 70);
        text(ctx, 'support.google.com · traduit de l\'anglais', 520, 900, { size: 36, family: F.mono, weight: 400, color: W80, maxWidth: 820 });
        const k = ease.back(prog(t, S('s03') + 1.2, 0.35));
        if (k > 0) {
          ctx.save(); ctx.translate(520, 1060); ctx.scale(k, k);
          roundRect(ctx, -150, -55, 300, 110, 26); ctx.fillStyle = 'rgba(63,180,122,0.18)'; ctx.fill();
          ctx.lineWidth = 4; ctx.strokeStyle = C.green; ctx.stroke();
          text(ctx, 'AUTOMATIQUE', 0, 2, { size: 44, family: F.mono, weight: 700, color: C.green });
          ctx.restore();
        }
      });

      // Appli fermée = redémarrage à zéro
      block(ctx, t, S('s05'), S('s06'), () => {
        text(ctx, 'APPLI FERMÉE', 520, 430, { size: 96, weight: 900, color: C.white });
        text(ctx, '= REDÉMARRAGE À ZÉRO', 520, 530, { size: 58, weight: 900, color: C.red2, maxWidth: 820 });
        const t0 = S('s05') + 0.5;
        const kf = ease.out(prog(t, t0, 0.6)), ks = ease.inOut(prog(t, t0, 2.4));
        [['REPRISE (APPLI EN PAUSE)', kf, C.green, 700], ['APPLI FERMÉE', ks, C.red2, 900]].forEach(([lb, k, col, y]) => {
          text(ctx, lb, 170, y - 52, { size: 38, family: F.mono, weight: 700, color: C.fg, align: 'left' });
          roundRect(ctx, 170, y - 22, 700, 44, 22); ctx.fillStyle = '#0b1220'; ctx.fill();
          roundRect(ctx, 170, y - 22, Math.max(44, 700 * k), 44, 22); ctx.fillStyle = col; ctx.fill();
        });
        text(ctx, 'schéma, pas à l\'échelle', 520, 1010, { size: 36, family: F.mono, weight: 400, color: W80 });
        chip(ctx, 'PLUS LENT À ROUVRIR', 520, 1110, { color: C.gold, size: 36 });
      });

      // Réglages › Batterie
      block(ctx, t, S('s06'), S('s07'), () => {
        phone(ctx, 520, 740, 470, 860, { draw: (x, y, w, h) => {
          ctx.fillStyle = '#0d1422'; ctx.fillRect(x, y, w, h);
          text(ctx, 'Réglages › Batterie', x + 30, y + 90, { size: 36, weight: 800, color: C.white, align: 'left', maxWidth: w - 60 });
          const rows = [['Vidéo', 0.92], ['Réseau social', 0.64], ['GPS', 0.41], ['Messages', 0.18]];
          rows.forEach(([lb, v], i) => {
            const k = ease.out(prog(t, S('s06') + 0.4 + i * 0.25, 0.5));
            const ry = y + 190 + i * 120;
            ctx.fillStyle = `hsl(${[210, 330, 140, 40][i]},55%,50%)`; roundRect(ctx, x + 30, ry - 30, 60, 60, 16); ctx.fill();
            text(ctx, lb, x + 110, ry - 12, { size: 34, weight: 700, color: C.fg, align: 'left' });
            roundRect(ctx, x + 110, ry + 14, w - 150, 16, 8); ctx.fillStyle = '#1d2a44'; ctx.fill();
            roundRect(ctx, x + 110, ry + 14, Math.max(16, (w - 150) * v * k), 16, 8); ctx.fillStyle = i === 0 ? C.red2 : C.gold; ctx.fill();
          });
          text(ctx, 'valeurs d\'exemple', 0, y + h - 70, { size: 38, weight: 700, color: W80 });
        } });
        chip(ctx, 'CE QUI VIDE VRAIMENT', 520, 1240, { color: C.gold, size: 36, dot: C.red });
      });

      // Luminosité automatique
      block(ctx, t, S('s07'), S('s08'), () => {
        const k = ease.inOut(prog(t, S('s07') + 0.4, 1.0));
        text(ctx, '☀️', 520, 470, { size: 170, family: F.emoji, weight: 400, alpha: lerp(1, 0.75, k) });
        roundRect(ctx, 190, 690, 700, 40, 20); ctx.fillStyle = '#1d2a44'; ctx.fill();
        const kx = lerp(800, 560, k);
        roundRect(ctx, 190, 690, kx - 190, 40, 20); ctx.fillStyle = C.gold2; ctx.fill();
        ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(kx, 710, 36, 0, Math.PI * 2); ctx.fill();
        const on = prog(t, S('s07') + 1.2, 0.3);
        roundRect(ctx, 600, 800, 150, 80, 40); ctx.fillStyle = on > 0.5 ? C.green : '#2b3850'; ctx.fill();
        ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(lerp(640, 710, ease.inOut(on)), 840, 32, 0, Math.PI * 2); ctx.fill();
        text(ctx, 'AUTO', 560, 840, { size: 44, family: F.mono, weight: 700, color: C.fg, align: 'right' });
        text(ctx, 'LUMINOSITÉ', 520, 990, { size: 96, weight: 900, color: C.white });
        text(ctx, 'AUTOMATIQUE', 520, 1090, { size: 80, weight: 900, color: C.gold2, maxWidth: 820 });
        chip(ctx, 'CONSEIL APPLE', 520, 1195, { color: C.fg, size: 36 });
      });

      // Partage
      block(ctx, t, S('s08'), S('s09'), () => {
        const k = ease.back(prog(t, S('s08'), 0.35));
        ctx.save(); ctx.translate(520, 600); ctx.scale(Math.max(0.01, k), Math.max(0.01, k));
        ctx.fillStyle = C.gold2; ctx.beginPath(); ctx.moveTo(-120, 40); ctx.quadraticCurveTo(-110, -90, 40, -90); ctx.lineTo(40, -160); ctx.lineTo(170, -40); ctx.lineTo(40, 80); ctx.lineTo(40, 10); ctx.quadraticCurveTo(-60, 0, -120, 40); ctx.closePath(); ctx.fill();
        ctx.restore();
        text(ctx, 'ENVOIE ÇA', 520, 880, { size: 110, weight: 900, color: C.white });
        chip(ctx, 'À CELUI QUI FERME TOUT', 520, 1000, { color: C.gold, size: 36 });
      });

      block(ctx, t, S('s09'), END + 1, () => followCTA(ctx, t, S('s09'), { next: ['pourquoi +10 dB', 'paraît 2 fois plus fort'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
