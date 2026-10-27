// Vidéo 9 — « +10 dB, ça paraît 2 fois plus fort » (mécanique : le calcul qui choque).
// Source : Suva, « Musique et troubles de l'ouïe » : +3 dB = énergie sonore ×2 ; +10 dB pour doubler le volume perçu ;
// chaque fois que la durée d'exposition est divisée par 2, le niveau toléré augmente de 3 dB ; 95 dB(A) au casque ≈ 4 h/semaine.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, segById, background, text, roundRect, chip, captions, brand, block, followCTA } = ENG;
  const END = E('s09') + 0.55;
  const W80 = 'rgba(255,255,255,0.8)';
  function wordAt(id, word, frac) {
    const sg = segById(id) || {}; const w = (sg.words || []).find(x => x[2] && x[2].replace(/[.,!?  :]/g, '').toLowerCase() === word);
    return w ? w[0] : S(id) + (E(id) - S(id)) * frac;
  }
  const tNon = wordAt('s01', 'non', 0.45);

  function speaker(ctx, x, y, s, waves) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = C.fg; roundRect(ctx, -60, -30, 40, 60, 8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-20, -30); ctx.lineTo(25, -65); ctx.lineTo(25, 65); ctx.lineTo(-20, 30); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.gold2; ctx.lineWidth = 9; ctx.lineCap = 'round';
    for (let i = 0; i < waves; i++) { ctx.beginPath(); ctx.arc(30, 0, 40 + i * 28, -0.7, 0.7); ctx.stroke(); }
    ctx.restore();
  }
  function bar(ctx, x, y, w, k, color, label, value) {
    text(ctx, label, x, y - 44, { size: 38, family: F.mono, weight: 700, color: C.fg, align: 'left' });
    text(ctx, value, x + 700, y - 44, { size: 38, family: F.mono, weight: 700, color: C.gold2, align: 'right' });
    roundRect(ctx, x, y - 20, 700, 40, 20); ctx.fillStyle = '#0b1220'; ctx.fill();
    roundRect(ctx, x, y - 20, Math.max(40, 700 * w * k), 40, 20); ctx.fillStyle = color; ctx.fill();
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE : 70 → 80 dB
      block(ctx, t, 0, S('s02'), () => {
        text(ctx, '70 dB', 300, 470, { size: 120, weight: 900, color: C.fg });
        text(ctx, '→', 540, 470, { size: 110, weight: 900, color: C.muted });
        text(ctx, '80 dB', 770, 470, { size: 120, weight: 900, color: C.gold2, maxWidth: 300 });
        const nk = ease.out(prog(t, tNon - 0.05, 0.25));
        text(ctx, '+14 % ?', 520, 650, { size: 110, weight: 900, color: C.white, alpha: 1 - 0.55 * nk });
        if (nk > 0.001) {
          ctx.save(); ctx.strokeStyle = C.red2; ctx.lineWidth = 16; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(330, 650); ctx.lineTo(lerp(330, 710, nk), 650); ctx.stroke(); ctx.restore();
        }
        const k = ease.back(prog(t, tNon + 0.5, 0.4));
        if (k > 0.001) {
          ctx.save(); ctx.translate(520, 900); ctx.scale(k, k);
          text(ctx, '2× PLUS FORT', 0, 0, { size: 120, weight: 900, color: C.red2, shadow: 'rgba(255,59,78,0.45)', shadowBlur: 40, maxWidth: 820 });
          ctx.restore();
          text(ctx, 'pour ton oreille', 520, 1030, { size: 56, weight: 800, color: C.white, alpha: clamp(k) });
        }
      });

      // +3 dB = énergie ×2
      block(ctx, t, S('s02'), S('s03'), () => {
        chip(ctx, 'ÉCHELLE LOGARITHMIQUE', 520, 400, { color: C.gold, size: 36 });
        speaker(ctx, 300, 640, 1.2, 2);
        const k = ease.back(prog(t, S('s02') + 1.6, 0.4));
        if (k > 0.001) { speaker(ctx, 620, 600, 1.2 * k, 2); speaker(ctx, 620, 760, 1.2 * k, 2); }
        text(ctx, '+3 dB', 520, 960, { size: 150, weight: 900, color: C.gold2 });
        text(ctx, '= 2× PLUS D\'ÉNERGIE', 520, 1090, { size: 64, weight: 900, color: C.white, maxWidth: 820 });
      });

      // +10 dB = 2× plus fort à l'oreille
      block(ctx, t, S('s03'), S('s04'), () => {
        text(ctx, '👂', 520, 520, { size: 190, family: F.emoji, weight: 400 });
        text(ctx, '+10 dB', 520, 780, { size: 190, weight: 900, color: C.gold2 });
        text(ctx, '= 2× PLUS FORT', 520, 930, { size: 84, weight: 900, color: C.white, maxWidth: 820 });
        chip(ctx, 'SOURCE : SUVA', 520, 1060, { color: C.fg, size: 36, dot: C.red });
      });

      // +3 dB = durée ÷ 2
      block(ctx, t, S('s04'), S('s06'), () => {
        text(ctx, 'DURÉE D\'ÉCOUTE', 520, 420, { size: 78, weight: 900, color: C.white, maxWidth: 820 });
        text(ctx, 'à chaque +3 dB : ÷ 2', 520, 510, { size: 56, weight: 900, color: C.gold2, maxWidth: 820 });
        [['niveau L', 1, C.green], ['L + 3 dB', 0.5, C.gold], ['L + 6 dB', 0.25, C.red2], ['L + 9 dB', 0.125, C.red2]].forEach(([lb, w, col], i) => {
          const k = ease.out(prog(t, S('s04') + 0.6 + i * 0.35, 0.5));
          bar(ctx, 170, 680 + i * 125, w, k, col, lb, ['×1', '÷2', '÷4', '÷8'][i]);
        });
        text(ctx, 'schéma, pas à l\'échelle des heures', 520, 1190, { size: 36, family: F.mono, weight: 400, color: W80, maxWidth: 820 });
      });

      // Casque : 95 dB ≈ 4 h / semaine
      block(ctx, t, S('s06'), S('s07'), () => {
        text(ctx, '🎧', 520, 520, { size: 200, family: F.emoji, weight: 400 });
        text(ctx, '95 dB', 520, 770, { size: 170, weight: 900, color: C.red2 });
        text(ctx, '≈ 4 h / SEMAINE', 520, 920, { size: 90, weight: 900, color: C.white, maxWidth: 820 });
        chip(ctx, 'SOURCE : SUVA', 520, 1050, { color: C.fg, size: 36, dot: C.red });
      });

      // −3 dB = temps ×2
      block(ctx, t, S('s07'), S('s08'), () => {
        const k = ease.inOut(prog(t, S('s07') + 0.3, 0.8));
        text(ctx, '−3 dB', 520, 520, { size: 170, weight: 900, color: C.green });
        roundRect(ctx, 190, 700, 700, 50, 25); ctx.fillStyle = '#0b1220'; ctx.fill();
        roundRect(ctx, 190, 700, lerp(350, 700, k), 50, 25); ctx.fillStyle = C.green; ctx.fill();
        text(ctx, lerp(4, 8, k) >= 7.99 ? '≈ 8 h / semaine' : '≈ 4 h / semaine', 520, 840, { size: 70, weight: 900, color: C.white });
        text(ctx, 'à 92 dB · calcul : 4 h × 2', 520, 940, { size: 40, family: F.mono, weight: 700, color: W80 });
      });

      // Partage
      block(ctx, t, S('s08'), S('s09'), () => {
        const k = ease.back(prog(t, S('s08'), 0.35));
        ctx.save(); ctx.translate(520, 600); ctx.scale(Math.max(0.01, k), Math.max(0.01, k));
        ctx.fillStyle = C.gold2; ctx.beginPath(); ctx.moveTo(-120, 40); ctx.quadraticCurveTo(-110, -90, 40, -90); ctx.lineTo(40, -160); ctx.lineTo(170, -40); ctx.lineTo(40, 80); ctx.lineTo(40, 10); ctx.quadraticCurveTo(-60, 0, -120, 40); ctx.closePath(); ctx.fill();
        ctx.restore();
        text(ctx, 'ENVOIE ÇA', 520, 880, { size: 110, weight: 900, color: C.white });
        chip(ctx, 'À CELUI QUI MET LE SON À FOND', 520, 1000, { color: C.gold, size: 36 });
      });

      block(ctx, t, S('s09'), END + 1, () => followCTA(ctx, t, S('s09'), { when: 'CE SOIR', next: ['l\'erreur de fenêtre', 'que tout le monde fait en hiver'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
