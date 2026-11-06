// Vidéo 24 — mode sombre : étude Purdue 2021. Chiffres : days/day24/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect, phone } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, bars, battery, coin, duelFrame, head, comment } = KIT;
  const NIGHT = '#8f9dff', SUN = '#ffd966';
  const END = E('s15') + 0.6;
  function screen(ctx, x, y, w, h, dark, o = {}) { // écran d'appli stylisé
    const bg = dark ? '#0a0d16' : '#f4f6fb', fg = dark ? '#3c4660' : '#c9d0de', tx = dark ? '#dfe5f5' : '#20283c';
    ctx.fillStyle = bg; ctx.fillRect(x, y, w, h);
    text(ctx, dark ? '🌙' : '☀️', x + w / 2, y + h * 0.17, { size: w * 0.25, family: F.emoji, weight: 400 });
    [0.34, 0.44, 0.54, 0.64].forEach((u, i) => { roundRect(ctx, x + w * 0.12, y + h * u, w * (i % 2 ? 0.56 : 0.76), h * 0.05, 8); ctx.fillStyle = i === 0 ? tx : fg; ctx.fill(); });
    if (o.bright !== undefined) { ctx.fillStyle = `rgba(0,0,0,${clamp(1 - o.bright) * 0.75})`; ctx.fillRect(x, y, w, h); }
  }
  function tel(ctx, cx, cy, w, h, dark, o = {}) { phone(ctx, cx, cy, w, h, { draw: (x, y, ww, hh) => screen(ctx, x, y, ww, hh, dark, o) }); }
  function slider(ctx, x, y, w, v, o = {}) {
    roundRect(ctx, x, y - 14, w, 28, 14); ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fill();
    const a = o.a ?? 0, b = o.b ?? v;
    roundRect(ctx, x + w * a, y - 14, Math.max(14, w * (b - a)), 28, 14); ctx.fillStyle = o.color || SUN; ctx.fill();
    ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(x + w * v, y, 26, 0, 7); ctx.fill();
    text(ctx, '☀️', x - 48, y, { size: 46, family: F.emoji, weight: 400 });
  }
  function duel(ctx, t, o = {}) {
    duelFrame(ctx, { y0: 460 });
    tel(ctx, 275, 780, 270, 500, true); tel(ctx, 725, 780, 270, 500, false, { bright: o.rb ?? 1 });
    battery(ctx, 275, 1110, 190, 0.55, { color: GREEN }); battery(ctx, 725, 1110, 190, 0.5, { color: GOLD });
    text(ctx, '?', 275, 1110, { size: 60, weight: 900, color: WHITE, stroke: 'rgba(0,0,0,0.7)' }); text(ctx, '?', 725, 1110, { size: 60, weight: 900, color: WHITE, stroke: 'rgba(0,0,0,0.7)' });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['magnifying_glass_tilted_left', 'eyes', 'mobile_phone', 'warning', 'thinking_face', 'exploding_head', 'clipboard', 'person_shrugging']),
    draw(ctx, t) {
      background(ctx, t);
      block(ctx, t, 0, S('s02'), () => { head(ctx, 'QUI A ENCORE DE LA BATTERIE ?', 360, t, undefined, { size: 52, color: NIGHT }); duel(ctx, t); });
      block(ctx, t, S('s02'), S('s03'), () => {
        slider(ctx, 200, 620, 680, 0.5 + 0.35 * Math.sin((t - S('s02')) * 3));
        big(ctx, 'UN AUTRE RÉGLAGE', 500, 460, t, S('s02') + 0.1, { size: 80, family: F.display, color: WHITE });
        CHR.emo(ctx, 'thinking_face', 500, 900, 280, t, f('s02', 0.3));
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'UNIVERSITÉ PURDUE · 2021', 500, 380, t, S('s03'), { size: 40, color: GOLD });
        ['Pixel 2', 'Moto Z3', 'Pixel 4', 'Pixel 5'].forEach((n, i) => { const k = ease.back(prog(t, f('s03', 0.15) + i * 0.16, 0.28)); if (k <= 0) return; const x = 160 + i * 225;
          ctx.save(); ctx.translate(x, 700); ctx.scale(k, k); tel(ctx, 0, 0, 180, 350, i % 2 === 0); ctx.restore(); text(ctx, n, x, 930, { size: 38, weight: 800, color: WHITE, alpha: clamp(k) }); });
        line(ctx, 'ÉCRANS OLED · 6 APPLIS', 500, 1050, t, f('s03', 0.65), { size: 54, color: NIGHT, dx: 0 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        line(ctx, 'LUMINOSITÉ 30 À 50 %', 500, 390, t, S('s04'), { size: 58, dx: 0 });
        slider(ctx, 200, 500, 680, 0.4, { a: 0.3, b: 0.5 });
        big(ctx, '3 à 9 %', 500, 720, t, f('s04', 0.55), { size: 190, color: NIGHT });
        tag(ctx, "D'ÉNERGIE EN MOINS · EN MOYENNE", 500, 900, t, f('s04', 0.65), { size: 34 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        pop(ctx, t, S('s05') + 0.05, 500, 590, () => { ctx.rotate(-0.04); roundRect(ctx, -340, -170, 680, 340, 22); ctx.fillStyle = '#3f8f67'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#2a6a4a'; ctx.stroke(); text(ctx, '100', 0, 0, { size: 170, weight: 900, color: '#eafff2' }); text(ctx, 'FRANCS', 0, 110, { size: 44, weight: 800, color: '#eafff2' }); });
        coin(ctx, 370, 960, 90, '3'); coin(ctx, 630, 960, 90, '9'); text(ctx, 'à', 500, 960, { size: 56, weight: 900, color: WHITE, alpha: clamp((t - f('s05', 0.4)) * 4) });
        tag(ctx, 'IMAGE, PAS UN COÛT', 500, 1110, t, f('s05', 0.5), { size: 34 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        big(ctx, '3 à 9 %', 500, 560, t, undefined, { size: 150, color: NIGHT });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 720, 720, 280, t, S('s06') + 0.1);
        CHR.emo(ctx, 'person_shrugging', 290, 900, 300, t, f('s06', 0.3));
        tag(ctx, 'DIFFICILE À REMARQUER, SELON PURDUE', 500, 1110, t, f('s06', 0.55), { size: 32 });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        const a = (t - S('s07')) * 0.8; ctx.save(); ctx.translate(780, 460); for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.fillStyle = SUN; ctx.fillRect(-7, -120 + Math.sin(a * 5 + i) * 10, 14, 44); } ctx.beginPath(); ctx.arc(0, 0, 66, 0, 7); ctx.fill(); ctx.restore();
        line(ctx, 'À 100 %', 330, 440, t, S('s07') + 0.1, { size: 90, weight: 900, dx: 0 });
        slider(ctx, 200, 620, 680, ease.out(prog(t, S('s07') + 0.1, 0.5)), { color: SUN });
        big(ctx, '39 à 47 %', 500, 860, t, f('s07', 0.5), { size: 160, color: SUN });
        tag(ctx, 'EN MOYENNE · EX. EN PLEIN SOLEIL', 500, 1040, t, f('s07', 0.6), { size: 32 });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        stamp(ctx, 'SURPRISE', 500, 420, t, S('s08'), { size: 80 });
        tel(ctx, 500, 840, 330, 620, false, { bright: 1 - 0.7 * ease.inOut(prog(t, f('s08', 0.3), 0.9)) });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        tag(ctx, 'PIXEL 5 · GOOGLE ACTUALITÉS', 500, 380, t, S('s09'), { size: 34, color: GOLD });
        tel(ctx, 260, 720, 270, 500, false, { bright: 0.45 }); tel(ctx, 740, 720, 270, 500, true);
        big(ctx, '20 %', 260, 1060, t, f('s09', 0.2), { size: 110, color: WHITE }); big(ctx, '50 %', 740, 1060, t, f('s09', 0.55), { size: 110, color: NIGHT });
        stamp(ctx, '=', 500, 720, t, f('s09', 0.45), { size: 130, color: GOLD, rot: 0 });
        line(ctx, 'clair', 260, 1160, t, f('s09', 0.25), { size: 44, dx: 0 }); line(ctx, 'sombre', 740, 1160, t, f('s09', 0.6), { size: 44, dx: 0 });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        tag(ctx, 'OLED', 500, 390, t, S('s10'), { size: 50, color: NIGHT });
        const on = ease.inOut(prog(t, f('s10', 0.35), 0.5));
        for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) { const x = 170 + i * 95, y = 500 + j * 95, blk = (i > 1 && i < 6 && j > 0 && j < 5);
          roundRect(ctx, x - 40, y - 40, 80, 80, 14); ctx.fillStyle = blk ? `rgba(${lerp(90, 5, on)},${lerp(160, 6, on)},${lerp(250, 12, on)},1)` : '#5aa0fa'; ctx.fill(); }
        stamp(ctx, 'PIXEL NOIR = ÉTEINT', 500, 1110, t, f('s10', 0.6), { size: 60, color: WHITE });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'LCD', 500, 390, t, S('s11'), { size: 50, color: GOLD });
        roundRect(ctx, 150, 470, 700, 380, 18); ctx.fillStyle = '#20242e'; ctx.fill();
        for (let i = 0; i < 6; i++) { const x = 200 + i * 120; ctx.save(); ctx.globalAlpha *= 0.55 + 0.25 * Math.sin(t * 4 + i); ctx.fillStyle = '#fff4c8'; ctx.fillRect(x, 830, 60, 16); const g = ctx.createLinearGradient(0, 830, 0, 500); g.addColorStop(0, 'rgba(255,244,200,0.6)'); g.addColorStop(1, 'rgba(255,244,200,0)'); ctx.fillStyle = g; ctx.fillRect(x - 20, 500, 100, 330); ctx.restore(); }
        line(ctx, 'RÉTROÉCLAIRAGE', 500, 910, t, f('s11', 0.2), { size: 60, dx: 0 });
        stamp(ctx, 'AUCUN CHIFFRE DANS L\'ÉTUDE', 500, 1060, t, f('s11', 0.55), { size: 50 });
      });
      block(ctx, t, S('s12'), S('s13'), () => {
        CHR.emo(ctx, 'eyes', 500, 620, 380, t, S('s12'));
        line(ctx, 'MOINS DE FATIGUE', 500, 880, t, f('s12', 0.25), { size: 74, weight: 900, color: NIGHT, dx: 0 });
        tag(ctx, 'À FORTE LUMINOSITÉ · SELON PURDUE', 500, 990, t, f('s12', 0.5), { size: 32 });
      });
      block(ctx, t, S('s13'), S('s14'), () => { comment(ctx, t, S('s13'), ['Ta luminosité,', 'là, maintenant ?', '?? %'], { color: SUN }); });
      block(ctx, t, S('s14'), S('s15'), () => { head(ctx, "L'ÉCART PEUT ÊTRE MINUSCULE", 360, t, f('s14', 0.5), { size: 52, color: NIGHT }); duel(ctx, t, { rb: 1 - 0.6 * ease.inOut(prog(t, f('s14', 0.2), 0.8)) }); });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: ["chauffage : baisser d'un degré,", 'combien tu gagnes ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
