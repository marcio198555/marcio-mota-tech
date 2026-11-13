// Vidéo 40 — montre « étanche 50 m » (Garmin, Casio, Xiaomi). Chiffres : days/day40/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, head, comment } = KIT;
  const END = E('s13') + 0.6, SEA = '#1f6fb0';
  function watch(ctx, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    roundRect(ctx, -70, -260, 140, 520, 30); ctx.fillStyle = '#2b3342'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 150, 0, 7); ctx.fillStyle = '#4a5468'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 128, 0, 7); ctx.fillStyle = '#0a0f18'; ctx.fill();
    text(ctx, o.label || 'WR 50 m', 0, 85, { size: 34, weight: 900, color: GOLD });
    ctx.strokeStyle = WHITE; ctx.lineCap = 'round'; ctx.lineWidth = 8; const a = t * 0.8;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(a) * 90, -Math.cos(a) * 90); ctx.stroke();
    ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(a / 12) * 60, -Math.cos(a / 12) * 60); ctx.stroke();
    roundRect(ctx, 145, -25, 26, 50, 8); ctx.fillStyle = '#4a5468'; ctx.fill();
    ctx.restore();
  }
  function depth(ctx, x, y0, y1, k, t) { // colonne d'eau avec graduation 0 → 50 m
    const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#2a86c9'); g.addColorStop(1, '#06223f');
    ctx.fillStyle = g; ctx.fillRect(x - 120, y0, 240, (y1 - y0) * k);
    for (let m = 0; m <= 50; m += 10) { const yy = lerp(y0, y1, m / 50); if (yy > y0 + (y1 - y0) * k) break; ctx.fillStyle = WHITE; ctx.fillRect(x + 120, yy - 2, 30, 4); text(ctx, m + ' m', x + 210, yy, { size: 40, family: F.mono, weight: 700, color: WHITE }); }
  }
  function verdictRow(ctx, y, label, ok, t, t0) {
    const a = clamp((t - t0) * 4); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    text(ctx, label, 300, y, { size: 52, weight: 800, color: WHITE, align: 'left' });
    text(ctx, ok ? '✓' : '✗', 760, y, { size: 70, weight: 900, color: ok ? GREEN : RED }); ctx.restore();
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['droplet', 'warning', 'clipboard', 'magnifying_glass_tilted_left', 'hourglass_done', 'thinking_face', 'wrench']),
    draw(ctx, t) {
      background(ctx, t);
      block(ctx, t, 0, S('s02'), () => {
        depth(ctx, 760, 520, 1180, 1, t);
        watch(ctx, 330, 800, 1.25 + 0.02 * Math.sin(t * 2), t);
        head(ctx, 'ÉTANCHE 50 m ?', 380, t, undefined, { size: 64, color: CYAN });
        big(ctx, '?', 760, 1080, t, undefined, { size: 150, color: RED });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'NON', 500, 400, t, S('s02'), { size: 110 });
        depth(ctx, 500, 540, 1150, 1, t);
        stamp(ctx, 'PLONGÉE À 50 m ✗', 500, 1000, t, f('s02', 0.4), { size: 64 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        line(ctx, '50 m =', 500, 420, t, S('s03'), { size: 90, weight: 900, color: GOLD, dx: 0 });
        stamp(ctx, 'PRESSION DE TEST', 500, 620, t, f('s03', 0.3), { size: 70, color: CYAN, rot: -0.03 });
        line(ctx, 'pas une profondeur', 500, 820, t, f('s03', 0.55), { size: 66, weight: 900, color: RED, dx: 0 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'MANUEL GARMIN', 500, 360, t, S('s04'), { size: 42, color: GOLD });
        big(ctx, '5 ATM', 500, 560, t, f('s04', 0.2), { size: 170, color: CYAN });
        line(ctx, '= pression équivalente', 500, 760, t, f('s04', 0.45), { size: 58, dx: 0 });
        line(ctx, 'à 50 m de profondeur', 500, 850, t, f('s04', 0.55), { size: 58, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'CASIO', 500, 360, t, S('s05'), { size: 46, color: GOLD });
        watch(ctx, 500, 720, 1.0, t);
        stamp(ctx, 'PAS À CETTE PROFONDEUR', 500, 1050, t, f('s05', 0.4), { size: 52 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'EN MOUVEMENT · SELON CASIO', 500, 360, t, S('s06'), { size: 40, color: GOLD });
        const k = ease.out(prog(t, f('s06', 0.2), 0.8));
        roundRect(ctx, 200, 820, 180, 120, 14); ctx.fillStyle = CYAN; ctx.fill(); text(ctx, 'TEST', 290, 1000, { size: 44, weight: 800, color: WHITE });
        const h = lerp(120, 460, k); roundRect(ctx, 620, 940 - h, 180, h, 14); ctx.fillStyle = RED; ctx.fill(); text(ctx, 'EN MOUVEMENT', 710, 1000, { size: 44, weight: 800, color: WHITE });
        line(ctx, 'PLUSIEURS FOIS PLUS', 500, 1110, t, f('s06', 0.6), { size: 56, weight: 900, color: RED, dx: 0 });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'XIAOMI · 5 ATM', 500, 360, t, S('s07'), { size: 46, color: GOLD });
        verdictRow(ctx, 520, 'Piscine, plage', true, t, f('s07', 0.15));
        verdictRow(ctx, 660, 'Plongée', false, t, f('s07', 0.45));
        verdictRow(ctx, 780, 'Douche', false, t, f('s07', 0.6));
        verdictRow(ctx, 900, 'Sauna', false, t, f('s07', 0.72));
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'CASIO · WATER RESIST 5 BAR', 500, 360, t, S('s08'), { size: 42, color: GOLD });
        verdictRow(ctx, 560, 'Douche', true, t, f('s08', 0.2));
        verdictRow(ctx, 720, 'Natation', false, t, f('s08', 0.5));
        stamp(ctx, 'CHAQUE MARQUE SA RÈGLE', 500, 960, t, f('s08', 0.7), { size: 50, color: CYAN });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, 'VERDICT', 500, 380, t, S('s09'), { size: 70, color: GOLD });
        big(ctx, '50 m', 500, 620, t, f('s09', 0.15), { size: 170, color: GOLD });
        line(ctx, '≠ UNE PROFONDEUR', 500, 820, t, f('s09', 0.35), { size: 72, weight: 900, color: RED, dx: 0 });
        line(ctx, 'règles différentes selon la marque', 500, 950, t, f('s09', 0.6), { size: 48, dx: 0 });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 360, t, S('s10'), { size: 44, color: GREEN });
        CHR.emo(ctx, 'clipboard', 500, 640, 300, t, S('s10') + 0.1);
        line(ctx, "LA LISTE D'ACTIVITÉS", 500, 900, t, f('s10', 0.35), { size: 64, weight: 900, color: GREEN, dx: 0 });
        tag(ctx, 'DE LA MARQUE', 500, 1010, t, f('s10', 0.5), { size: 40 });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'BONUS · SELON CASIO', 500, 360, t, S('s11'), { size: 42, color: CYAN });
        CHR.emo(ctx, 'hourglass_done', 330, 680, 260, t, S('s11') + 0.1); CHR.emo(ctx, 'wrench', 690, 680, 240, t, f('s11', 0.3));
        line(ctx, "LES JOINTS S'USENT", 500, 950, t, f('s11', 0.4), { size: 66, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Ta montre,', 'elle affiche combien ?', 'WR · ATM · bar ?'], { color: CYAN }); });
      block(ctx, t, S('s13'), END + 1, () => followCTA(ctx, t, S('s13'), { when: 'CE SOIR', next: ['Wi-Fi 2,4 ou 5 GHz : lequel', 'traverse les murs ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
