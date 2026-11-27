// Vidéo 100 (segments s06, s09, s12 de la voix retirés au montage pour tenir 59–65 s) — Téléphone au froid sur les pistes : poche extérieure ou intérieure (Reel d'essai Instagram). Faits : days/day100/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, battery, thermometer, comment, head, duelFrame } = KIT;
  const ICE = '#9fdcff';
  const END = E('s15') + 0.6;
  // flocons déterministes
  function snow(ctx, t, a = 1) {
    ctx.save(); ctx.globalAlpha *= 0.55 * a; ctx.fillStyle = WHITE;
    for (let i = 0; i < 70; i++) {
      const x = (i * 157 + Math.sin(t * 0.7 + i) * 30) % 1080, y = ((i * 97) + t * (60 + (i % 5) * 18)) % 1920;
      ctx.beginPath(); ctx.arc(x, y, 3 + (i % 3), 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  // téléphone générique (sans marque)
  function phone(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    roundRect(ctx, -70, -140, 140, 280, 26); ctx.fillStyle = '#11161f'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = o.border || '#c9d2e3'; ctx.stroke();
    roundRect(ctx, -60, -126, 120, 252, 18); ctx.fillStyle = o.off ? '#05070b' : (o.screen || '#1d3b66'); ctx.fill();
    if (!o.off && o.level !== undefined) battery(ctx, 0, 0, 84, o.level, { color: o.level < 0.25 ? RED : GREEN, border: WHITE });
    if (o.frost) { ctx.globalAlpha *= o.frost; ctx.fillStyle = 'rgba(190,230,255,0.45)'; roundRect(ctx, -70, -140, 140, 280, 26); ctx.fill(); }
    ctx.restore();
  }
  // veste schématique : poche extérieure (froid) ou intérieure (contre le corps)
  function jacket(ctx, x, y, s, inner, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = inner ? '#2f6fd6' : '#d6452f';
    ctx.beginPath(); ctx.moveTo(-150, -180); ctx.lineTo(-60, -220); ctx.lineTo(0, -170); ctx.lineTo(60, -220); ctx.lineTo(150, -180); ctx.lineTo(170, 200); ctx.lineTo(-170, 200); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -170); ctx.lineTo(0, 200); ctx.stroke();
    if (inner) { // doublure ouverte + chaleur
      ctx.fillStyle = '#f0b46a'; ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(70, -120); ctx.lineTo(70, 120); ctx.lineTo(0, 150); ctx.closePath(); ctx.fill();
      phone(ctx, 38, 10, 0.42, { level: 0.8 });
      ctx.globalAlpha *= 0.5 + 0.2 * Math.sin(t * 4); ctx.strokeStyle = '#ffb35c'; ctx.lineWidth = 6;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(38, 10, 70 + i * 22 + (t * 30) % 22, -1, 1); ctx.stroke(); }
    } else { // poche extérieure en bas à gauche, téléphone qui dépasse, givre
      roundRect(ctx, -140, 60, 110, 110, 14); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
      phone(ctx, -85, 60, 0.42, { level: 0.8, frost: 0.6 + 0.3 * Math.sin(t * 3) });
    }
    ctx.restore();
  }
  function igEnd(ctx, t, t0) {
    const k = ease.back(prog(t, t0 + 0.25, 0.35));
    ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(500, 800); ctx.scale(0.9 + 0.1 * k, 0.9 + 0.1 * k);
    panel(ctx, -420, -190, 840, 380, { r: 40, border: GOLD, lw: 4, bg: 'rgba(201,168,76,0.12)' });
    text(ctx, 'CHAQUE JOUR', 0, -110, { size: 44, family: F.mono, weight: 700, color: GOLD, letter: 6 });
    text(ctx, 'un chiffre vérifié', 0, -10, { size: 72, weight: 900, color: WHITE, maxWidth: 780 });
    text(ctx, 'sur les objets', 0, 75, { size: 60, weight: 800, color: WHITE, maxWidth: 780 });
    text(ctx, 'de ta maison', 0, 145, { size: 60, weight: 800, color: WHITE, maxWidth: 780 });
    ctx.restore();
    const p = 1 + 0.05 * Math.sin((t - t0) * 7);
    pop(ctx, t, t0 + 0.5, 500, 1110, () => { ctx.scale(p, p); roundRect(ctx, -230, -58, 460, 116, 58); ctx.fillStyle = RED; ctx.fill(); text(ctx, 'ABONNE-TOI', 0, 2, { size: 56, weight: 900, color: WHITE }); });
  }
  // plage 0–35 °C sur une règle, curseur qui descend sous zéro
  function range(ctx, x, y, t, t0, cur) {
    const w = 760, x0 = x - w / 2, sc = v => x0 + (v + 15) / 55 * w; // -15 .. 40 °C
    roundRect(ctx, x0, y - 22, w, 44, 22); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
    const k = ease.out(prog(t, t0, 0.5));
    roundRect(ctx, sc(0), y - 22, (sc(35) - sc(0)) * k, 44, 22); ctx.fillStyle = GREEN; ctx.fill();
    text(ctx, '0 °C', sc(0), y + 70, { size: 44, family: F.mono, weight: 700, color: WHITE });
    text(ctx, '35 °C', sc(35), y + 70, { size: 44, family: F.mono, weight: 700, color: WHITE });
    if (cur !== undefined) {
      const cx = sc(cur); ctx.fillStyle = cur < 0 ? ICE : GOLD; ctx.beginPath(); ctx.moveTo(cx, y - 34); ctx.lineTo(cx - 22, y - 74); ctx.lineTo(cx + 22, y - 74); ctx.closePath(); ctx.fill();
    }
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['mobile_phone', 'thermometer', 'low_battery', 'warning', 'high_voltage', 'check_mark_button', 'fire', 'thinking_face']),
    draw(ctx, t) {
      background(ctx, t);
      snow(ctx, t, t < E('s14') ? 1 : 0.3);
      // image 0 : « 0 °C » énorme qui pulse, deux vestes, le téléphone givré côté TOI
      block(ctx, t, 0, S('s03'), () => {
        const b = 1 + 0.07 * Math.sin(t * 5);
        ctx.save(); ctx.translate(500, 410); ctx.scale(b, b); text(ctx, 'SOUS 0°C', 0, 0, { size: 132, family: F.display, weight: 900, color: ICE, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        duelFrame(ctx, { y0: 520, y1: 1180 });
        jacket(ctx, 275, 850, 1.05, false, t); jacket(ctx, 725, 850, 1.05, true, t);
        text(ctx, 'POCHE EXTÉRIEURE', 275, 1110, { size: 38, weight: 900, color: WHITE }); text(ctx, 'CONTRE LUI', 725, 1110, { size: 40, weight: 900, color: WHITE });
        head(ctx, 'LEQUEL S\'ÉTEINT EN 1er ?', 1195, t, undefined, { size: 50 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'À LA FIN', 500, 430, t, S('s03'), { size: 46, color: GOLD });
        phone(ctx, 500, 760, 1.4, { level: 0.75 });
        CHR.emo(ctx, 'thinking_face', 760, 560, 150, t, f('s03', 0.3));
        big(ctx, 'POURQUOI L\'ÉCRAN MENT', 500, 1080, t, f('s03', 0.35), { size: 68, family: F.display, color: GOLD });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'ASSISTANCE APPLE', 500, 420, t, S('s04'), { size: 40, color: GOLD });
        phone(ctx, 500, 680, 1, { level: 0.9 });
        line(ctx, 'TEMPÉRATURE AMBIANTE', 500, 900, t, f('s04', 0.3), { size: 48, weight: 900, dx: 0 });
        range(ctx, 500, 1040, t, f('s04', 0.45));
      });
      block(ctx, t, S('s05'), S('s07'), () => {
        tag(ctx, 'ASSISTANCE SAMSUNG', 500, 420, t, S('s05'), { size: 40, color: GOLD });
        phone(ctx, 500, 680, 1, { level: 0.9, border: '#8fb4ff' });
        line(ctx, 'MÊME PLAGE', 500, 900, t, f('s05', 0.3), { size: 56, weight: 900, dx: 0 });
        range(ctx, 500, 1040, t, S('s05'));
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'APPLE PRÉVIENT', 500, 410, t, S('s07'), { size: 40, color: GOLD });
        const lv = lerp(0.8, 0.25, ease.inOut(prog(t, f('s07', 0.15), 1.5)));
        phone(ctx, 500, 720, 1.2, { level: lv, frost: 0.5, off: t > f('s07', 0.75) });
        line(ctx, 'AUTONOMIE ↓ (TEMPORAIRE)', 500, 1000, t, f('s07', 0.3), { size: 48, weight: 900, color: ICE, dx: 0 });
        stamp(ctx, 'PEUT S\'ÉTEINDRE', 500, 1110, t, f('s07', 0.7), { size: 60, color: RED });
      });
      block(ctx, t, S('s08'), S('s10'), () => {
        tag(ctx, 'SAMSUNG EXPLIQUE', 500, 410, t, S('s08'), { size: 40, color: GOLD });
        battery(ctx, 500, 700, 380, 0.7, { color: GREEN, border: WHITE });
        CHR.emo(ctx, 'high_voltage', 500, 700, 130, t, S('s08') + 0.2);
        const k = ease.inOut(prog(t, f('s08', 0.3), 0.8));
        ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(300, 900); ctx.lineTo(300 + 400 * k, 900 + 160 * k); ctx.stroke(); ctx.restore();
        line(ctx, 'TENSION DE LA BATTERIE ↓', 500, 1140, t, f('s08', 0.5), { size: 48, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        duelFrame(ctx, { y0: 520, y1: 1180 });
        jacket(ctx, 275, 830, 1.0, false, t); jacket(ctx, 725, 830, 1.0, true, t);
        stamp(ctx, 'RISQUE ↑', 275, 1100, t, f('s10', 0.6), { size: 52, color: RED });
        stamp(ctx, 'PLUS AU CHAUD', 725, 1100, t, f('s10', 0.4), { size: 40, color: GREEN });
      });
      block(ctx, t, S('s11'), S('s13'), () => {
        tag(ctx, 'SELON APPLE', 500, 410, t, S('s11'), { size: 40, color: GOLD });
        const lv = lerp(0.25, 0.8, ease.inOut(prog(t, f('s11', 0.4), 1.2)));
        phone(ctx, 500, 720, 1.2, { level: lv });
        CHR.emo(ctx, 'fire', 760, 600, 130, t, f('s11', 0.35));
        line(ctx, 'AU CHAUD : AUTONOMIE NORMALE', 500, 1030, t, f('s11', 0.5), { size: 46, weight: 900, color: GREEN, dx: 0 });
      });
      block(ctx, t, S('s13'), S('s14'), () => { comment(ctx, t, S('s13'), ['Ton téléphone,', 'dans quelle poche ?', 'dehors ou dedans ?'], { color: GOLD, size: 62 }); });
      block(ctx, t, S('s14'), S('s15'), () => {
        tag(ctx, 'ASSISTANCE SAMSUNG', 500, 410, t, S('s14'), { size: 40, color: GOLD });
        phone(ctx, 500, 700, 1.25, { level: 0.82, frost: 0.4, off: t > f('s14', 0.55) });
        stamp(ctx, 'S\'ÉTEINT QUAND MÊME', 500, 1030, t, f('s14', 0.55), { size: 48, color: RED });
      });
      block(ctx, t, S('s15'), END + 1, () => igEnd(ctx, t, S('s15')));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
