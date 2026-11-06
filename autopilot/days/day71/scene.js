// Vidéo 71 — Série « Suisse contre France » : même machine à laver, même lessive, qui paie le plus ?
// Tout le timing passe par S('sNN'), E('sNN') ou des fractions de phrase. Chiffres : days/day71/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA, readout } = ENG;
  const END = E('s16') + 0.6;
  const AC = '#39d5e6', AC2 = '#a6f0f7';           // accent de la vidéo : cyan « eau de lessive »
  const CH = '#e8323e', FR = '#3f83ee', WARN = '#ffb02e', OK = '#46d08e';
  const CX = 505;
  const at = (id, x) => S(id) + (E(id) - S(id)) * x;
  const fmt = (v, d = 1) => v.toFixed(d).replace('.', ',');
  const NB = ' ';

  // ---------- briques propres à cette vidéo ----------
  function flagCH(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y);
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    roundRect(ctx, -s / 2, -s / 2, s, s, s * 0.08); ctx.fillStyle = '#da291c'; ctx.fill();
    ctx.shadowColor = 'transparent';
    const a = s * 0.62, b = s * 0.19; ctx.fillStyle = '#ffffff';
    ctx.fillRect(-a / 2, -b / 2, a, b); ctx.fillRect(-b / 2, -a / 2, b, a);
    ctx.restore();
  }
  function flagFR(ctx, x, y, h) {
    const w = h * 1.5;
    ctx.save(); ctx.translate(x, y);
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    roundRect(ctx, -w / 2, -h / 2, w, h, h * 0.08); ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.clip();
    ctx.fillStyle = '#0055a4'; ctx.fillRect(-w / 2, -h / 2, w / 3, h);
    ctx.fillStyle = '#ef4135'; ctx.fillRect(w / 6, -h / 2, w / 3, h);
    ctx.restore();
  }
  // machine à laver dessinée, sans marque ; fill = quantité de linge 0..1
  function washer(ctx, cx, cy, s, t, o = {}) {
    const w = s, h = s * 1.14, spin = (o.spin ?? 1.2) * t, fill = o.fill ?? 0.55;
    ctx.save(); ctx.translate(cx, cy);
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12;
    roundRect(ctx, -w / 2, -h / 2, w, h, s * 0.06);
    const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, '#dfe5ee'); g.addColorStop(1, '#aab4c4');
    ctx.fillStyle = g; ctx.fill(); ctx.shadowColor = 'transparent';
    // bandeau de commande
    ctx.fillStyle = '#7f8ba0'; ctx.fillRect(-w / 2 + s * 0.05, -h / 2 + s * 0.17, w - s * 0.1, s * 0.012);
    ctx.fillStyle = '#25324a'; ctx.beginPath(); ctx.arc(w / 2 - s * 0.16, -h / 2 + s * 0.09, s * 0.05, 0, 7); ctx.fill();
    roundRect(ctx, -w / 2 + s * 0.07, -h / 2 + s * 0.055, s * 0.32, s * 0.07, s * 0.015); ctx.fillStyle = '#0d2733'; ctx.fill();
    roundRect(ctx, -w / 2 + s * 0.09, -h / 2 + s * 0.075, s * 0.16, s * 0.03, s * 0.01); ctx.fillStyle = AC; ctx.fill();
    // hublot
    const dy = s * 0.09, R = s * 0.34;
    ctx.beginPath(); ctx.arc(0, dy, R, 0, 7); ctx.fillStyle = '#5f6b80'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, dy, R * 0.84, 0, 7); ctx.fillStyle = '#0a1a26'; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(0, dy, R * 0.8, 0, 7); ctx.clip();
    // eau
    const wl = dy + R * 0.8 - R * 1.6 * (0.22 + 0.2 * fill);
    ctx.fillStyle = 'rgba(57,213,230,0.45)'; ctx.beginPath(); ctx.moveTo(-R, wl);
    for (let x = -R; x <= R; x += 8) ctx.lineTo(x, wl + Math.sin(x * 0.07 + t * 5) * s * 0.012);
    ctx.lineTo(R, dy + R); ctx.lineTo(-R, dy + R); ctx.closePath(); ctx.fill();
    // linge qui tourne
    const n = Math.round(1 + fill * 8), cols = ['#f4f6fa', '#e8505b', '#5aa2ff', '#ffd166', '#b5e48c', '#f4f6fa', '#cdb4db', '#5aa2ff', '#ff9f68'];
    for (let i = 0; i < n; i++) {
      const a = spin + i * (Math.PI * 2 / 9), r = R * (i % 2 ? 0.28 : 0.5);
      ctx.fillStyle = cols[i]; ctx.beginPath();
      ctx.ellipse(Math.cos(a) * r, dy + Math.sin(a) * r + R * 0.18, R * 0.24, R * 0.15, a, 0, 7); ctx.fill();
    }
    ctx.restore();
    ctx.beginPath(); ctx.arc(-R * 0.3, dy - R * 0.32, R * 0.3, 3.4, 4.8); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = s * 0.018; ctx.stroke();
    ctx.restore();
  }
  // bidon de lessive sans marque
  function detergent(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -s * 0.16, -s * 0.72, s * 0.32, s * 0.2, s * 0.03); ctx.fillStyle = '#f4f6fa'; ctx.fill();
    roundRect(ctx, -s * 0.38, -s * 0.54, s * 0.76, s * 1.08, s * 0.12); ctx.fillStyle = AC; ctx.fill();
    roundRect(ctx, -s * 0.3, -s * 0.2, s * 0.6, s * 0.42, s * 0.05); ctx.fillStyle = '#f4f6fa'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, s * 0.01, s * 0.11, 0, 7); ctx.fillStyle = AC; ctx.fill();
    ctx.restore();
  }
  function stamp(ctx, label, x, y, t, t0, o = {}) {
    const k = ease.back(prog(t, t0, 0.3));
    if (t < t0) return;
    const size = o.size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.05); ctx.scale(lerp(1.45, 1, k), lerp(1.45, 1, k));
    ctx.globalAlpha *= clamp(k * 2.5);
    ctx.font = `900 ${size}px InterDisplay`; const w = ctx.measureText(label).width + 56, h = size + 32;
    roundRect(ctx, -w / 2, -h / 2, w, h, 14); ctx.lineWidth = 7; ctx.strokeStyle = o.color || CH; ctx.stroke();
    ctx.fillStyle = 'rgba(3,4,8,0.72)'; ctx.fill();
    text(ctx, label, 0, 2, { size, weight: 900, color: o.color || CH });
    ctx.restore();
  }
  function pop(ctx, x, y, t, t0, fn) {
    if (t < t0) return;
    const k = Math.max(0.01, ease.back(prog(t, t0, 0.3)));
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha *= clamp(k * 2); fn(); ctx.restore();
  }
  function pane(ctx, x, y, w, h, col) {
    roundRect(ctx, x, y, w, h, 30);
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, col + '38'); g.addColorStop(1, col + '12');
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col + 'aa'; ctx.stroke();
  }
  // écran partagé : image 0 et retour avant l'appel à s'abonner
  function duel(ctx, t, o = {}) {
    pane(ctx, 70, 648, 420, 580, CH); pane(ctx, 520, 648, 408, 580, FR);
    flagCH(ctx, 140, 722, 92); text(ctx, 'SUISSE', 320, 724, { size: 62, weight: 900, color: C.white });
    flagFR(ctx, 592, 722, 80); text(ctx, 'FRANCE', 788, 724, { size: 58, weight: 900, color: C.white });
    washer(ctx, 240, 930, 250, t, { spin: 1.5, fill: 0.6 }); detergent(ctx, 428, 985, 74);
    washer(ctx, 682, 930, 250, t, { spin: 1.5, fill: 0.6 }); detergent(ctx, 866, 985, 70);
    text(ctx, o.left || '? ct/kWh', 280, 1162, { size: 58, family: F.mono, weight: 700, color: o.left ? C.white : AC2 });
    text(ctx, o.right || '? ct/kWh', 724, 1162, { size: 58, family: F.mono, weight: 700, color: o.right ? C.white : AC2 });
    ctx.beginPath(); ctx.arc(CX, 900, 50, 0, 7); ctx.fillStyle = '#04070d'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = AC; ctx.stroke();
    text(ctx, 'VS', CX, 902, { size: 42, weight: 900, color: AC });
  }
  // grand afficheur de prix
  function priceCard(ctx, col, draw) { pane(ctx, 90, 300, 830, 900, col); draw(); }
  function coin(ctx, x, y, r, label, col, flip) {
    ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.03, Math.abs(flip)), 1);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = col; ctx.fill();
    ctx.lineWidth = r * 0.07; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, 7); ctx.lineWidth = r * 0.025; ctx.stroke();
    text(ctx, label, 0, 4, { size: r * 0.62, weight: 900, color: '#ffffff', maxWidth: r * 1.6 });
    ctx.restore();
  }
  // étiquette énergie stylisée (schéma)
  const CLS = [['A', '#00a651'], ['B', '#50b848'], ['C', '#bed630'], ['D', '#fff200'], ['E', '#fdb913'], ['F', '#f37021'], ['G', '#ed1c24']];
  function energyLabel(ctx, x, y, t, t0, tA) {
    CLS.forEach(([l, col], i) => {
      const k = ease.out(prog(t, t0 + i * 0.05, 0.25)), w = (170 + i * 58) * k, yy = y + i * 62;
      if (k <= 0) return;
      ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.lineTo(x + w + 26, yy + 26); ctx.lineTo(x + w, yy + 52); ctx.lineTo(x, yy + 52); ctx.closePath();
      ctx.save(); ctx.globalAlpha *= (i === 0 || t < tA) ? 1 : 0.32; ctx.fillStyle = col; ctx.fill();
      text(ctx, l, x + 34, yy + 28, { size: 42, weight: 900, color: i > 1 && i < 5 ? '#111' : '#fff' }); ctx.restore();
    });
    if (t >= tA) {
      const b = 1 + 0.06 * Math.sin((t - tA) * 8);
      ctx.save(); ctx.translate(x + 170 + 26 + 82, y + 26); ctx.scale(b, b);
      ctx.beginPath(); ctx.moveTo(-54, 0); ctx.lineTo(-16, -30); ctx.lineTo(-16, 30); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
      ctx.restore();
    }
  }
  function coinStack(ctx, x, base, n, col, r) {
    for (let i = 0; i < n; i++) {
      const y = base - i * 14;
      ctx.beginPath(); ctx.ellipse(x, y + 7, r, r * 0.3, 0, 0, 7); ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.3, 0, 0, 7); ctx.fillStyle = col; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.stroke();
    }
  }
  // facture générique
  function bill(ctx, x, y, w, h, t, tCircle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.03);
    ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
    roundRect(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = '#f2f4f8'; ctx.fill(); ctx.shadowColor = 'transparent';
    text(ctx, "FACTURE D'ÉLECTRICITÉ", 0, -h / 2 + 62, { size: 44, weight: 900, color: '#111a2b', maxWidth: w - 60 });
    ctx.fillStyle = '#c7cedb';
    [0.3, 0.42, 0.54].forEach((f, i) => { roundRect(ctx, -w / 2 + 50, -h / 2 + h * f - 40, (w - 100) * (0.92 - i * 0.14), 22, 11); ctx.fill(); });
    text(ctx, 'PRIX DU kWh', -w / 2 + 50, h * 0.22, { size: 42, weight: 800, color: '#25324a', align: 'left' });
    text(ctx, '? ct', w / 2 - 70, h * 0.22, { size: 74, family: F.mono, weight: 700, color: '#0a8fa1', align: 'right' });
    const k = ease.inOut(prog(t, tCircle, 0.5));
    if (k > 0) {
      ctx.beginPath(); ctx.ellipse(w / 2 - 150, h * 0.22, 130, 66, -0.05, -1.6, -1.6 + k * Math.PI * 2.05);
      ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.strokeStyle = CH; ctx.stroke();
    }
    ctx.restore();
  }

  window.SCENE = {
    duration: END,
    load: () => CHR.load(['warning', 'high_voltage', 'thinking_face']),
    draw(ctx, t) {
      background(ctx, t, { glow: 'rgba(24,74,96,0.5)' });

      // 1. ACCROCHE : écran partagé complet dès l'image 0
      block(ctx, t, 0, S('s03'), () => {
        const z = 1 + 0.012 * Math.min(t, 4);
        ctx.save(); ctx.translate(CX, 800); ctx.scale(z, z); ctx.translate(-CX, -800);
        const inS2 = t >= S('s02');
        if (!inS2) {
          text(ctx, 'QUI PAIE', CX, 372, { size: 122, weight: 900, color: C.white });
          text(ctx, 'LE PLUS ?', CX, 490, { size: 122, weight: 900, color: AC, shadow: 'rgba(57,213,230,0.45)' });
          if (t < at('s01', 0.55)) text(ctx, 'MÊME MACHINE · MÊME LESSIVE', CX, 594, { size: 40, family: F.mono, weight: 700, color: C.white, maxWidth: 820 });
          else pop(ctx, CX, 594, t, at('s01', 0.55), () => chip(ctx, 'LE PRIX DE 1 kWh', 0, 0, { color: '#04121a', bg: AC, border: AC, size: 34 }));
        } else {
          // compteur qui défile : la promesse
          const k = prog(t, S('s02'), E('s02') - S('s02'));
          const roll = Math.floor(t * 17) % 90 + 10;
          text(ctx, 'À LA FIN', CX, 345, { size: 60, weight: 900, color: C.white });
          readout(ctx, 'ÉCART SUR 1 AN', `${k < 0.82 ? roll : '??'} CHF`, CX, 472, { w: 660, h: 170, size: 84, border: AC, color: AC2, labelSize: 36 });
          chip(ctx, 'MÊME MACHINE · MÊME LESSIVE', CX, 600, { color: C.white, size: 28, border: AC, alpha: 1 });
        }
        duel(ctx, t);
        ctx.restore();
      });

      // 2. Suisse : 27,7 puis 29,9 avec la TVA
      block(ctx, t, S('s03'), S('s05'), () => {
        priceCard(ctx, CH, () => {
          flagCH(ctx, 190, 400, 110); text(ctx, 'EN SUISSE', 560, 402, { size: 84, weight: 900, color: C.white });
          const k = ease.inOut(prog(t, S('s03') + 0.2, (E('s03') - S('s03')) * 0.7));
          const k2 = ease.inOut(prog(t, at('s04', 0.25), (E('s04') - S('s04')) * 0.55));
          const v = k2 > 0 ? lerp(27.7, 29.9, k2) : lerp(0, 27.7, k);
          readout(ctx, 'CENTIMES PAR kWh', fmt(v), CX, 610, { w: 740, h: 270, size: 170, border: CH, color: C.white, labelSize: 36 });
          chip(ctx, 'MÉDIANE 2026 · MÉNAGE TYPE H4', CX, 790, { color: C.white, size: 30, border: CH, alpha: ease.out(prog(t, at('s03', 0.08), 0.25)) });
          chip(ctx, 'SOURCE : ELCOM, 9.09.2025', CX, 870, { color: AC2, size: 30, alpha: ease.out(prog(t, at('s03', 0.25), 0.25)) });
          CHR.emo(ctx, 'high_voltage', 825, 1000, 130, t, at('s03', 0.45));
          if (t < S('s04')) text(ctx, '4 500 kWh par an', CX - 70, 1035, { size: 50, weight: 800, color: C.fg, alpha: ease.out(prog(t, at('s03', 0.35), 0.25)) });
          stamp(ctx, '+ TVA 8,1 %', CX - 40, 985, t, S('s04'), { size: 74, color: WARN });
          const ck = ease.out(prog(t, at('s04', 0.55), 0.25));
          if (t >= S('s04')) text(ctx, '27,7 × 1,081 = 29,94', CX - 40, 1118, { size: 50, family: F.mono, weight: 700, color: C.white, alpha: ck });
        });
      });

      // 3. France : 20,01 c€ TTC
      block(ctx, t, S('s05'), S('s06'), () => {
        priceCard(ctx, FR, () => {
          flagFR(ctx, 200, 400, 100); text(ctx, 'EN FRANCE', 580, 402, { size: 84, weight: 900, color: C.white });
          const k = ease.inOut(prog(t, at('s05', 0.3), (E('s05') - S('s05')) * 0.4));
          readout(ctx, "CENTIMES D'EURO PAR kWh", fmt(lerp(0, 20.01, k), 2), CX, 610, { w: 740, h: 270, size: 170, border: FR, color: C.white, labelSize: 34 });
          chip(ctx, 'TARIF RÉGLEMENTÉ · OPTION BASE', CX, 790, { color: C.white, size: 30, border: FR, alpha: ease.out(prog(t, at('s05', 0.15), 0.25)) });
          stamp(ctx, 'TAXES COMPRISES', CX, 910, t, at('s05', 0.72), { size: 62, color: OK, rot: 0.03 });
          chip(ctx, 'SOURCE : EDF, BARÈME DU 1.08.2026', CX, 1040, { color: AC2, size: 28, alpha: ease.out(prog(t, at('s05', 0.25), 0.25)) });
          chip(ctx, 'CRE : DÉLIBÉRATION DU 15.07.2026', CX, 1120, { color: C.muted, size: 28, alpha: ease.out(prog(t, at('s05', 0.35), 0.25)) });
        });
      });

      // 4. Conversion : la pièce se retourne
      block(ctx, t, S('s06'), S('s07'), () => {
        text(ctx, 'CONVERTI EN FRANCS', CX, 380, { size: 74, weight: 900, color: C.white });
        const fk = prog(t, at('s06', 0.25), (E('s06') - S('s06')) * 0.4);
        const flip = Math.cos(fk * Math.PI);
        coin(ctx, CX, 640, 180, flip >= 0 ? '20,01 c€' : '18,4 ct', flip >= 0 ? FR : CH, flip);
        const k = ease.out(prog(t, at('s06', 0.5), 0.25));
        text(ctx, '20,01 × 0,9180 = 18,37', CX, 900, { size: 58, family: F.mono, weight: 700, color: C.white, alpha: k });
        text(ctx, 'centimes de franc', CX, 975, { size: 52, weight: 800, color: AC2, alpha: k });
        chip(ctx, 'BNS, 5.11.2026 : 1 € = 0,9180 CHF', CX, 1080, { color: AC2, size: 30, alpha: ease.out(prog(t, at('s06', 0.15), 0.25)) });
        chip(ctx, 'LE TAUX BOUGE CHAQUE JOUR', CX, 1160, { color: C.muted, size: 28, alpha: ease.out(prog(t, at('s06', 0.7), 0.25)) });
      });

      // 5. Réponse : deux colonnes
      block(ctx, t, S('s07'), S('s08'), () => {
        const k = ease.out(prog(t, S('s07') + 0.1, (E('s07') - S('s07')) * 0.5));
        const base = 1085, sc = 17;
        [[290, 29.9, CH, 0], [720, 18.4, FR, 1]].forEach(([x, v, col, i]) => {
          const h = v * sc * k;
          roundRect(ctx, x - 125, base - h, 250, Math.max(h, 2), 18); ctx.fillStyle = col; ctx.fill();
          text(ctx, fmt(v * k), x, base - h - 50, { size: 76, family: F.mono, weight: 700, color: C.white });
          if (i === 0) flagCH(ctx, x - 60, base + 62, 76); else flagFR(ctx, x - 70, base + 62, 70);
          text(ctx, 'ct/kWh', x + 58, base + 64, { size: 40, family: F.mono, weight: 700, color: C.fg });
        });
        stamp(ctx, 'LA SUISSE PAIE PLUS', CX, 382, t, at('s07', 0.62), { size: 66, color: WARN, rot: -0.02 });
        chip(ctx, 'AU PRIX AFFICHÉ', 720, 590, { color: C.white, size: 28, letter: 1, alpha: ease.out(prog(t, at('s07', 0.4), 0.25)) });
      });

      // 6. Une machine classée A : 47 kWh pour 100 lavages
      block(ctx, t, S('s08'), S('s09'), () => {
        energyLabel(ctx, 110, 330, t, S('s08') + 0.05, at('s08', 0.3));
        washer(ctx, 770, 520, 240, t, { spin: 1.2 });
        const k = ease.inOut(prog(t, at('s08', 0.45), (E('s08') - S('s08')) * 0.35));
        readout(ctx, 'kWh POUR 100 LAVAGES', String(Math.round(lerp(0, 47, k))), CX, 925, { w: 800, h: 230, size: 140, border: AC, color: AC2, labelSize: 36 });
        chip(ctx, 'EXEMPLE · MÉDIANE 8 KG CLASSE A', CX, 1085, { color: C.white, size: 30, border: AC });
        chip(ctx, 'BASE UE EPREL, RELEVÉE PAR JECHANGE', CX, 1165, { color: AC2, size: 27, alpha: ease.out(prog(t, at('s08', 0.65), 0.25)) });
      });

      // 7. 220 lavages → 103 kWh
      block(ctx, t, S('s09'), S('s10'), () => {
        const k = ease.inOut(prog(t, S('s09') + 0.1, (E('s09') - S('s09')) * 0.5));
        washer(ctx, 260, 540, 330, t, { spin: 2 + 7 * k, fill: 0.7 });
        readout(ctx, 'LAVAGES / AN', String(Math.round(lerp(0, 220, k))), 695, 450, { w: 410, h: 210, size: 110, border: AC, color: AC2, labelSize: 36 });
        chip(ctx, 'ANCIENNE ÉTIQUETTE UE', 695, 610, { color: C.white, size: 26, letter: 1 });
        chip(ctx, 'CONVENTION', 695, 680, { color: WARN, size: 30, border: WARN });
        const a = ease.back(prog(t, at('s09', 0.62), 0.32));
        text(ctx, `≈${NB}${Math.round(220 * k * 0.47)} kWh`, CX, 880, { size: 118 + 18 * a, family: F.mono, weight: 700, color: a > 0 ? AC : C.white, shadow: 'rgba(57,213,230,0.5)' });
        text(ctx, '47 × 220 ÷ 100 = 103,4', CX, 1020, { size: 54, family: F.mono, weight: 700, color: C.white });
        chip(ctx, 'EXEMPLE · PAR AN', CX, 1130, { color: C.white, size: 30 });
      });

      // 8. 31 francs / 19 francs : les piles de pièces
      block(ctx, t, S('s10'), S('s11'), () => {
        const k1 = ease.inOut(prog(t, S('s10') + 0.05, (E('s10') - S('s10')) * 0.35));
        const k2 = ease.inOut(prog(t, at('s10', 0.35), (E('s10') - S('s10')) * 0.32));
        const base = 1050, n1 = Math.round(31 * k1), n2 = Math.round(19 * k2);
        coinStack(ctx, 270, base, n1, CH, 120); coinStack(ctx, 660, base, n2, FR, 120);
        text(ctx, `${n1} CHF`, 270, base - n1 * 14 - 74, { size: 74, family: F.mono, weight: 700, color: C.white });
        if (k2 > 0) text(ctx, `${n2} CHF`, 660, base - n2 * 14 - 74, { size: 74, family: F.mono, weight: 700, color: C.white });
        flagCH(ctx, 130, base + 108, 64); text(ctx, 'SUISSE', 290, base + 110, { size: 50, weight: 900, color: C.white });
        flagFR(ctx, 540, base + 108, 58); text(ctx, 'FRANCE', 700, base + 110, { size: 50, weight: 900, color: C.white });
        const y1 = base - 31 * 14, y2 = base - 19 * 14;
        if (t >= at('s10', 0.7)) {
          ctx.save(); ctx.strokeStyle = WARN; ctx.lineWidth = 7; ctx.setLineDash([12, 10]);
          ctx.beginPath(); ctx.moveTo(400, y1); ctx.lineTo(860, y1); ctx.moveTo(830, y1); ctx.lineTo(830, y2); ctx.stroke(); ctx.restore();
        }
        stamp(ctx, "12 CHF D'ÉCART", CX, 370, t, at('s10', 0.72), { size: 76, color: WARN, rot: -0.02 });
        chip(ctx, 'EXEMPLE · 103 kWh/AN', 720, 490, { color: C.white, size: 28, letter: 1 });
      });

      // 9. Attention : ce n'est pas le même prix
      block(ctx, t, S('s11'), S('s12'), () => {
        CHR.emo(ctx, 'warning', 190, 385, 110, t, S('s11'));
        text(ctx, 'ATTENTION', 560, 388, { size: 104, weight: 900, color: WARN, shadow: 'rgba(255,176,46,0.4)' });
        pop(ctx, 280, 815, t, at('s11', 0.12), () => {
          pane(ctx, -205, -345, 410, 690, CH); flagCH(ctx, 0, -265, 90);
          text(ctx, 'MÉDIANE', 0, -160, { size: 66, weight: 900, color: C.white, maxWidth: 370 });
          text(ctx, 'de quelque', 0, -75, { size: 42, weight: 700, color: C.fg });
          text(ctx, '590 gestionnaires', 0, -25, { size: 42, weight: 700, color: C.fg, maxWidth: 370 });
          roundRect(ctx, -180, 70, 360, 200, 20); ctx.fillStyle = 'rgba(70,208,142,0.16)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = OK; ctx.stroke();
          text(ctx, 'MESURE', 0, 130, { size: 50, weight: 900, color: OK });
          text(ctx, 'COMPRISE', 0, 200, { size: 50, weight: 900, color: OK });
        });
        pop(ctx, 730, 815, t, at('s11', 0.42), () => {
          pane(ctx, -205, -345, 410, 690, FR); flagFR(ctx, 0, -265, 84);
          text(ctx, 'TARIF', 0, -180, { size: 60, weight: 900, color: C.white });
          text(ctx, 'RÉGLEMENTÉ', 0, -115, { size: 60, weight: 900, color: C.white, maxWidth: 370 });
          text(ctx, 'hors offres de marché', 0, -35, { size: 36, weight: 700, color: C.fg, maxWidth: 380 });
          roundRect(ctx, -180, 70, 360, 200, 20); ctx.fillStyle = 'rgba(255,176,46,0.16)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = WARN; ctx.stroke();
          text(ctx, 'ABONNEMENT', 0, 130, { size: 48, weight: 900, color: WARN, maxWidth: 340 });
          text(ctx, 'À PART', 0, 200, { size: 50, weight: 900, color: WARN });
        });
      });

      // 10. L'abonnement réduit l'écart
      block(ctx, t, S('s12'), S('s13'), () => {
        const x0 = 110, sc = 25, h = 110;
        const k = ease.inOut(prog(t, at('s12', 0.3), (E('s12') - S('s12')) * 0.42));
        const gap = lerp(11.6, 7.7, k);
        flagCH(ctx, x0 + 26, 345, 52); text(ctx, 'SUISSE', x0 + 70, 346, { size: 46, weight: 900, color: C.white, align: 'left' });
        text(ctx, '29,9 ct', x0 + 29.9 * sc, 346, { size: 52, family: F.mono, weight: 700, color: C.white, align: 'right' });
        roundRect(ctx, x0, 395, 29.9 * sc, h, 16); ctx.fillStyle = CH; ctx.fill();
        flagFR(ctx, x0 + 32, 565, 46); text(ctx, 'FRANCE', x0 + 80, 566, { size: 46, weight: 900, color: C.white, align: 'left' });
        text(ctx, `${fmt(lerp(18.4, 22.3, k))} ct`, x0 + 29.9 * sc, 566, { size: 52, family: F.mono, weight: 700, color: C.white, align: 'right' });
        roundRect(ctx, x0, 615, 18.4 * sc, h, 16); ctx.fillStyle = FR; ctx.fill();
        if (k > 0) { roundRect(ctx, x0 + 18.4 * sc - 6, 615, 3.9 * sc * k + 6, h, 12); ctx.fillStyle = WARN; ctx.fill(); }
        // écart en pointillé
        ctx.save(); ctx.setLineDash([10, 10]); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.strokeRect(x0 + lerp(18.4, 22.3, k) * sc + 5, 620, (29.9 - lerp(18.4, 22.3, k)) * sc - 10, h - 10); ctx.restore();
        pop(ctx, CX, 800, t, at('s12', 0.1), () => chip(ctx, '+ 190,32 €/AN D\'ABONNEMENT', 0, 0, { color: WARN, size: 32, border: WARN, letter: 1 }));
        readout(ctx, 'ÉCART, ct/kWh', fmt(gap), CX, 965, { w: 640, h: 220, size: 130, border: AC, color: k >= 1 ? AC : C.white, labelSize: 34 });
        chip(ctx, '6 kVA · 4 500 kWh · RÉPARTI : 24,2 c€', CX, 1138, { color: C.white, size: 28, letter: 1 });
      });

      // 11. Conseil : machine pleine
      block(ctx, t, S('s13'), S('s14'), () => {
        text(ctx, 'REMPLIS-LA', CX, 372, { size: 104, weight: 900, color: AC, shadow: 'rgba(57,213,230,0.45)' });
        const k = prog(t, at('s13', 0.1), 0.3);
        const bar = (x, y, w, f, col) => {
          roundRect(ctx, x, y, w, 56, 16); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke();
          roundRect(ctx, x + 6, y + 6, Math.max((w - 12) * f, 2), 44, 12); ctx.fillStyle = col; ctx.fill();
        };
        washer(ctx, 280, 640, 300, t, { spin: 1.6, fill: 1 });
        text(ctx, 'PLEINE', 280, 860, { size: 58, weight: 900, color: C.white });
        const hk = t >= at('s13', 0.1);
        washer(ctx, 730, 640, 300, t, { spin: 1.6, fill: 0.3 });
        if (hk) text(ctx, 'À MOITIÉ', 730, 860, { size: 58, weight: 900, color: C.white, alpha: clamp(k * 2) });
        const b = ease.out(prog(t, at('s13', 0.45), 0.5));
        text(ctx, 'ÉNERGIE', 110, 945, { size: 38, family: F.mono, weight: 700, color: C.muted, align: 'left' });
        text(ctx, 'ÉNERGIE', 580, 945, { size: 38, family: F.mono, weight: 700, color: C.muted, align: 'left' });
        bar(110, 975, 340, b, OK); bar(580, 975, 340, 0.68 * b, WARN);
        if (t >= at('s13', 0.7)) {
          ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 5; ctx.setLineDash([8, 8]);
          ctx.beginPath(); ctx.moveTo(750, 958); ctx.lineTo(750, 1048); ctx.stroke(); ctx.restore();
        }
        text(ctx, "+ de la moitié de l'énergie", 660, 1080, { size: 40, weight: 800, color: WARN, alpha: ease.out(prog(t, at('s13', 0.7), 0.25)) });
        chip(ctx, 'SCHÉMA · SOURCE : TOPTEN.CH', CX, 1160, { color: C.white, size: 28 });
      });

      // 12. La question pour les commentaires
      block(ctx, t, S('s14'), S('s15'), () => {
        bill(ctx, CX, 720, 760, 620, t, at('s14', 0.4));
        const k = t >= at('s14', 0.5);
        if (k) pop(ctx, CX, 1120, t, at('s14', 0.5), () => {
          roundRect(ctx, -330, -58, 660, 116, 30); ctx.fillStyle = AC; ctx.fill();
          ctx.beginPath(); ctx.moveTo(-40, -56); ctx.lineTo(0, -92); ctx.lineTo(30, -56); ctx.closePath(); ctx.fill();
          text(ctx, 'ÉCRIS TON PRIX 💬', 0, 3, { size: 58, weight: 900, color: '#04121a' });
        });
      });

      // 13. Retour au duel
      block(ctx, t, S('s15'), S('s16'), () => {
        const a = at('s15', 0.42), b = at('s15', 0.7);
        if (t < a) {
          text(ctx, 'MÊME MACHINE', CX, 372, { size: 96, weight: 900, color: C.white, maxWidth: 840 });
          text(ctx, 'MÊME LESSIVE', CX, 480, { size: 96, weight: 900, color: AC, maxWidth: 840 });
        } else {
          pop(ctx, CX, 390, t, a, () => text(ctx, "12 CHF D'ÉCART", 0, 0, { size: 96, weight: 900, color: WARN, maxWidth: 860 }));
          pop(ctx, CX, 500, t, b, () => text(ctx, 'ou 8 CHF, abonnement réparti', 0, 0, { size: 54, weight: 900, color: AC2, maxWidth: 860 }));
        }
        chip(ctx, 'PAR AN · EXEMPLE', CX, 590, { color: C.white, size: 30, border: AC });
        duel(ctx, t, { left: '31 CHF', right: '19 CHF' });
      });

      // 14. Abonne-toi
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'CE SOIR', next: ['vaisselle à la main', 'ou lave-vaisselle ?'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
