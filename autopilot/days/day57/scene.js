// Vidéo 57 — vaisselle à la main ou lave-vaisselle. Chiffres : days/day57/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, bars, coin, coins, duelFrame, head, comment } = KIT;
  const AQUA = '#39c6d8';
  const END = E('s15') + 0.6;
  function tank(ctx, x, y, w, h, lvl, color, label) { // réservoir d'eau : lvl 0..1
    roundRect(ctx, x - w / 2, y - h, w, h, 20); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fill();
    ctx.save(); roundRect(ctx, x - w / 2, y - h, w, h, 20); ctx.clip();
    const lh = h * clamp(lvl); ctx.fillStyle = color; ctx.globalAlpha *= 0.85;
    ctx.beginPath(); ctx.moveTo(x - w / 2, y); for (let px = -w / 2; px <= w / 2; px += 12) ctx.lineTo(x + px, y - lh + Math.sin(px * 0.05 + (x + lh) * 0.02) * 7); ctx.lineTo(x + w / 2, y); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.lineWidth = 6; ctx.strokeStyle = WHITE; roundRect(ctx, x - w / 2, y - h, w, h, 20); ctx.stroke();
    if (label) text(ctx, label, x, y + 58, { size: 42, weight: 900, color: WHITE, maxWidth: w + 80 });
  }
  function machine(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -130, -160, 260, 320, 18); ctx.fillStyle = '#d9dee7'; ctx.fill();
    ctx.fillStyle = '#5a6880'; ctx.fillRect(-130, -160, 260, 46); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(95, -137, 10, 0, 7); ctx.fill();
    roundRect(ctx, -100, -92, 200, 230, 12); ctx.fillStyle = '#6d7b93'; ctx.fill();
    for (let i = 0; i < 5; i++) { const px = -74 + i * 37, py = 15 + Math.sin(t * 6 + i) * 8; ctx.fillStyle = 'rgba(160,230,245,0.9)'; ctx.beginPath(); ctx.arc(px, py, 8, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  function sink(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = '#c7cfdd'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-70, -140); ctx.lineTo(-70, -210); ctx.quadraticCurveTo(-70, -250, -20, -250); ctx.lineTo(20, -250); ctx.lineTo(20, -210); ctx.stroke();
    ctx.fillStyle = AQUA; for (let i = 0; i < 6; i++) { const py = -190 + ((t * 300 + i * 32) % 170); ctx.fillRect(14, py, 12, 22); }
    ctx.beginPath(); ctx.ellipse(20, 10, 100, 34, 0, 0, 7); ctx.fillStyle = '#f0ece2'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#aab'; ctx.stroke();
    roundRect(ctx, -150, 30, 340, 110, 22); ctx.fillStyle = '#8c98ad'; ctx.fill();
    ctx.restore();
  }
  function duel(ctx, t, o = {}) {
    duelFrame(ctx, { y0: 500 });
    sink(ctx, 275, 830, 0.95, t); machine(ctx, 725, 780, 1.0, t);
    if (o.left) big(ctx, o.left, 275, 1100, t, o.t0, { size: 72, color: RED });
    if (o.right) big(ctx, o.right, 725, 1100, t, o.t0 ? o.t0 + 0.4 : undefined, { size: 72, color: GREEN });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['sponge', 'droplet', 'magnifying_glass_tilted_left', 'money_bag', 'warning', 'receipt', 'thinking_face', 'woman_technologist', 'man_technologist', 'label']),
    draw(ctx, t) {
      background(ctx, t);
      block(ctx, t, 0, S('s02'), () => { big(ctx, '? LITRES', 500, 350, t, undefined, { size: 120, color: AQUA }); duel(ctx, t); head(ctx, "QUI GASPILLE L'EAU ?", 1200, t, undefined, { size: 56, color: AQUA }); });
      block(ctx, t, S('s02'), S('s03'), () => {
        sink(ctx, 500, 800, 1.5, t); CHR.emo(ctx, 'magnifying_glass_tilted_left', 760, 590, 200, t, S('s02') + 0.1);
        stamp(ctx, 'LE GESTE QUI AJOUTE DES LITRES', 500, 370, t, S('s02') + 0.2, { size: 46, color: GOLD });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'UNIVERSITÉ DE BONN', 500, 370, t, S('s03'), { size: 40, color: GOLD });
        for (let i = 0; i < 12; i++) { const k = ease.back(prog(t, f('s03', 0.2) + i * 0.1, 0.25)); if (k <= 0) continue;
          const x = 200 + (i % 4) * 200, y = 530 + Math.floor(i / 4) * 170; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
          ctx.beginPath(); ctx.arc(0, 0, 70, 0, 7); ctx.fillStyle = '#f2efe6'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#b6b2a4'; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 38, 0, 7); ctx.stroke(); ctx.restore(); }
        big(ctx, '12 COUVERTS', 500, 1060, t, f('s03', 0.6), { size: 100, family: F.display, color: WHITE });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        tank(ctx, 500, 1100, 480, 620, ease.out(prog(t, S('s04') + 0.1, 1)), AQUA);
        big(ctx, '103 l', 500, 800, t, f('s04', 0.4), { size: 170, color: WHITE });
        tag(ctx, 'À LA MAIN · MOYENNE', 500, 400, t, S('s04'), { size: 38 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        tank(ctx, 260, 1100, 280, 620, 1, AQUA, '103 l'); tank(ctx, 740, 1100, 280, 620, 15 / 103 * ease.out(prog(t, S('s05') + 0.1, 0.5)), GREEN, '15 l');
        tag(ctx, 'EN MACHINE', 740, 400, t, S('s05'), { size: 38, color: GREEN }); tag(ctx, 'À LA MAIN', 260, 400, t, S('s05'), { size: 38 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        big(ctx, '≈ 7 ×', 500, 620, t, S('s06') + 0.05, { size: 260, color: GREEN });
        line(ctx, 'moins en machine', 500, 840, t, S('s06') + 0.25, { size: 64, dx: 0 });
        line(ctx, '103 ÷ 15 = 6,87', 500, 960, t, S('s06') + 0.4, { size: 54, family: F.mono, weight: 700, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'LAUSANNE', 500, 380, t, S('s07'), { size: 40, color: GOLD });
        line(ctx, 'eau 1,72 + épuration 1,73', 500, 500, t, S('s07') + 0.2, { size: 54, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '3,45 fr.', 500, 690, t, f('s07', 0.5), { size: 170 }); line(ctx, 'le m³ (1 000 litres)', 500, 860, t, f('s07', 0.65), { size: 60, dx: 0 });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        line(ctx, '103 − 15 = 88 litres', 500, 460, t, S('s08'), { size: 62, family: F.mono, weight: 700, dx: 0 });
        line(ctx, '88 l × 3,45 fr./m³', 500, 570, t, S('s08') + 0.35, { size: 62, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '30 ct', 500, 790, t, f('s08', 0.55), { size: 200 }); tag(ctx, 'À CHAQUE VAISSELLE', 500, 960, t, f('s08', 0.7));
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, 'EXEMPLE', 500, 400, t, S('s09'), { size: 56, color: WHITE });
        line(ctx, '0,30 fr. × 365 jours', 500, 530, t, S('s09') + 0.2, { size: 66, family: F.mono, weight: 700, dx: 0 });
        coins(ctx, t, S('s09') + 0.3, 14, 180, 820, 1190, 'fr');
        big(ctx, '110 CHF', 500, 700, t, f('s09', 0.5), { size: 170 }); line(ctx, 'par an, sans l\'énergie', 500, 840, t, f('s09', 0.6), { size: 52, dx: 0 });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        stamp(ctx, 'SURPRISE', 500, 390, t, S('s10'), { size: 70 });
        bars(ctx, [{ label: 'Allemagne', v: 46 / 170, value: '46 l', color: GREEN, t0: f('s10', 0.25) }, { label: 'France', v: 103 / 170, value: '103 l', color: GOLD, t0: f('s10', 0.4) }, { label: 'Espagne, Portugal', v: 1, value: '170 l', color: RED, t0: f('s10', 0.6) }], 110, 500, 780, t, { rh: 170 });
        line(ctx, 'mêmes 12 couverts, à la main', 500, 1040, t, f('s10', 0.7), { size: 46, color: AQUA, dx: 0 });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        CHR.emo(ctx, 'warning', 500, 500, 240, t, S('s11'));
        line(ctx, 'ÉTUDE ANCIENNE', 500, 730, t, S('s11') + 0.2, { size: 72, weight: 900, dx: 0 });
        line(ctx, 'EN PARTIE FINANCÉE', 500, 840, t, f('s11', 0.4), { size: 66, weight: 900, color: GOLD, dx: 0 });
        line(ctx, 'PAR DES FABRICANTS', 500, 925, t, f('s11', 0.5), { size: 66, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s12'), S('s13'), () => {
        sink(ctx, 500, 690, 0.95, t);
        tag(ctx, 'RINCER AVANT DE CHARGER · MOYENNE PAR CYCLE', 500, 370, t, S('s12'), { size: 28, color: AQUA });
        bars(ctx, [{ label: 'Allemagne', v: 2.8 / 19.7, value: '+ 2,8 l', color: GREEN, t0: f('s12', 0.45) }, { label: 'Italie', v: 1, value: '+ 19,7 l', color: RED, t0: f('s12', 0.75) }], 110, 870, 780, t, { rh: 150 });
      });
      block(ctx, t, S('s13'), S('s14'), () => comment(ctx, t, S('s13'), ['Tu rinces', 'avant de charger ?', 'OUI ou NON'], { color: AQUA }));
      block(ctx, t, S('s14'), S('s15'), () => { head(ctx, 'MÊME À 46 l, IL RESTE DEVANT', 360, t, f('s14', 0.55), { size: 50, color: AQUA }); duel(ctx, t, { left: '103 l', right: '15 l', t0: S('s14') + 0.05 }); });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: ['douche ou bain :', 'combien en francs ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
