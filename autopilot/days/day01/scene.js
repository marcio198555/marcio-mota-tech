// Jour 1 — « 45 % de pente ≠ 45° » : le piège des fiches techniques de robots tondeuses.
(function () {
  const { W, C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, readout, font } = ENG;
  const hash = i => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
  const deg = r => r * 180 / Math.PI;
  const fmt = (v, d = 1) => v.toFixed(d).replace('.', ',');

  // Bloc : fondu + léger zoom à l'entrée et à la sortie.
  function block(ctx, t, start, end, fn) {
    if (t < start - 0.001 || t >= end + 0.2) return;
    const fin = start <= 0 ? 1 : ease.out(prog(t, start, 0.22));
    const a = Math.min(fin, 1 - ease.in(prog(t, end - 0.02, 0.2)));
    if (a <= 0) return;
    const k = start <= 0 ? 1 : ease.out(prog(t, start, 0.35));
    ctx.save(); ctx.globalAlpha = a;
    ctx.translate(540, 900); ctx.scale(0.965 + 0.035 * k, 0.965 + 0.035 * k); ctx.translate(-540, -900 + (1 - k) * 26);
    fn(t - start);
    ctx.restore();
  }

  function mower(ctx, x, y, ang, s = 1, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-ang); ctx.scale(s, s);
    // ombre
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 4, 92, 10, 0, 0, Math.PI * 2); ctx.fill();
    // roues
    ctx.fillStyle = '#0d1320'; ctx.strokeStyle = '#3a4660'; ctx.lineWidth = 4;
    [[-58, -22], [58, -22]].forEach(([wx, wy]) => { ctx.beginPath(); ctx.arc(wx, wy, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    // coque
    roundRect(ctx, -86, -86, 172, 62, 28); ctx.fillStyle = '#dfe4ee'; ctx.fill();
    roundRect(ctx, -70, -104, 132, 40, 20); ctx.fillStyle = '#1a2333'; ctx.fill();
    ctx.fillStyle = C.gold; ctx.fillRect(-86, -50, 172, 7);
    // capteur
    ctx.fillStyle = '#2b3850'; ctx.beginPath(); ctx.arc(-6, -110, 14, Math.PI, 0); ctx.fill();
    if (o.cross) { ctx.strokeStyle = C.red2; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-60, -120); ctx.lineTo(60, 0); ctx.moveTo(60, -120); ctx.lineTo(-60, 0); ctx.stroke(); }
    ctx.restore();
  }

  // Pente : A = coin bas gauche, L = 100 cm en pixels, pct = pente en %.
  function slope(ctx, A, L, pct, o = {}) {
    const h = L * pct / 100, th = Math.atan(pct / 100);
    const B = { x: A.x + L, y: A.y }, P = { x: A.x + L, y: A.y - h };
    const baseP = o.baseP ?? 1, riseP = o.riseP ?? 1, arcP = o.arcP ?? 0;
    // remplissage
    if (riseP > 0) {
      ctx.save(); ctx.globalAlpha *= riseP;
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(P.x, P.y); ctx.closePath();
      const g = ctx.createLinearGradient(0, P.y, 0, A.y); g.addColorStop(0, o.wet ? 'rgba(70,130,190,0.28)' : 'rgba(63,180,122,0.26)'); g.addColorStop(1, 'rgba(11,18,32,0.05)');
      ctx.fillStyle = g; ctx.fill(); ctx.restore();
    }
    // base (règle)
    ctx.save(); ctx.strokeStyle = 'rgba(233,237,245,0.75)'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(A.x + L * baseP, A.y); ctx.stroke();
    if (o.ruler) {
      ctx.lineWidth = 3; ctx.font = font(700, 26, F.mono); ctx.fillStyle = C.muted; ctx.textAlign = 'center';
      for (let i = 0; i <= 10; i++) {
        if (i / 10 > baseP + 1e-6) break;
        const x = A.x + L * i / 10, len = i % 5 === 0 ? 26 : 14;
        ctx.beginPath(); ctx.moveTo(x, A.y + 6); ctx.lineTo(x, A.y + 6 + len); ctx.stroke();
        if (i % 5 === 0) ctx.fillText(String(i * 10), x, A.y + 62);
      }
    }
    ctx.restore();
    // côté vertical (montée)
    if (riseP > 0) {
      ctx.save(); ctx.strokeStyle = C.gold; ctx.lineWidth = 5; ctx.setLineDash([16, 12]);
      ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(B.x, B.y - h * riseP); ctx.stroke(); ctx.restore();
      // surface en pente + herbe
      const ex = A.x + (P.x - A.x) * riseP, ey = A.y + (P.y - A.y) * riseP;
      ctx.save(); ctx.strokeStyle = o.wet ? '#4f86b8' : C.grass; ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(ex, ey); ctx.stroke();
      const len = Math.hypot(ex - A.x, ey - A.y), nx = Math.sin(th), ny = Math.cos(th);
      ctx.lineWidth = 3; ctx.strokeStyle = o.wet ? 'rgba(120,170,220,0.85)' : 'rgba(80,190,120,0.9)';
      for (let d = 8; d < len; d += 13) {
        const px = A.x + Math.cos(th) * d, py = A.y - Math.sin(th) * d, gl = 8 + hash(d) * 12, lean = (hash(d * 3) - 0.5) * 0.5;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - nx * gl + lean * 8, py - ny * gl); ctx.stroke();
      }
      ctx.restore();
    }
    // arc d'angle
    if (arcP > 0) {
      ctx.save(); ctx.strokeStyle = C.gold2; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(A.x, A.y, o.arcR || 170, 0, -th * arcP, true); ctx.stroke();
      ctx.restore();
    }
    return { B, P, th, h };
  }

  function stamp(ctx, label, x, y, rot, k) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const s = lerp(1.6, 1, ease.back(k)); ctx.scale(s, s); ctx.globalAlpha *= clamp(k * 3);
    ctx.font = font(900, 96, F.display); const w = ctx.measureText(label).width + 70;
    roundRect(ctx, -w / 2, -72, w, 144, 18); ctx.lineWidth = 10; ctx.strokeStyle = C.red2; ctx.stroke();
    ctx.fillStyle = 'rgba(200,32,48,0.14)'; ctx.fill();
    ctx.fillStyle = C.red2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 6);
    ctx.restore();
  }

  const END = E('s13') + 0.55;

  window.SCENE = {
    duration: END,
    draw(ctx, t, frame) {
      background(ctx, t);
      const A = { x: 150, y: 1050 }, L = 720;

      // 1. ACCROCHE : 45 % ≠ 45°
      block(ctx, t, 0, S('s03'), (u) => {
        const z = 1 + 0.06 * ease.inOut(prog(t, 0, 4.6)); ctx.translate(520, 800); ctx.scale(z, z); ctx.translate(-520, -800);
        chip(ctx, 'ROBOT TONDEUSE', 520, 400, { color: C.fg, size: 40, dot: C.gold });
        const pulse = 1 + 0.035 * Math.sin(t * 9) * clamp(1 - prog(t, S('s02'), 0.2));
        ctx.save(); ctx.translate(520, 600); ctx.scale(pulse, pulse);
        text(ctx, '45 %', 0, 0, { size: 300, weight: 900, color: C.gold2, shadow: 'rgba(201,168,76,0.55)', shadowBlur: 50 });
        ctx.restore();
        const k = prog(t, S('s02') - 0.05, 0.35);
        const s = k > 0 ? lerp(1.4, 1, ease.back(k)) : 1;
        ctx.save(); ctx.translate(520, 850); ctx.scale(s, s); ctx.globalAlpha *= lerp(0.9, 1, clamp(k * 2));
        text(ctx, '≠', -205, 0, { size: 220, weight: 900, color: C.red2, shadow: 'rgba(255,59,78,0.6)', shadowBlur: k > 0 ? 40 : 10 });
        text(ctx, '45°', 95, 0, { size: 220, weight: 900, color: C.white });
        ctx.restore();
        // petite pente qui défile
        const sl = slope(ctx, { x: 300, y: 1190 }, 440, 45, { riseP: 1 });
        const mu = 0.18 + 0.5 * ease.inOut(prog(t, 0.2, 4));
        mower(ctx, 300 + 440 * mu, 1190 - 440 * 0.45 * mu, sl.th, 0.5);
      });

      // 2. FICHE TECHNIQUE + LE PIÈGE
      block(ctx, t, S('s03'), S('s05'), (u) => {
        const x = 150, y = 470, w = 740, h = 560;
        roundRect(ctx, x, y, w, h, 34); ctx.fillStyle = 'rgba(11,18,32,0.94)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.line; ctx.stroke();
        text(ctx, 'FICHE TECHNIQUE', x + 44, y + 70, { size: 34, family: F.mono, weight: 700, color: C.muted, align: 'left', letter: 4 });
        chip(ctx, 'EXEMPLE', x + w - 165, y + 70, { size: 36, color: C.fg });
        // lignes floutées (squelette)
        ctx.save(); ctx.fillStyle = 'rgba(142,154,179,0.18)';
        [[150, 0.55], [250, 0.42], [430, 0.5]].forEach(([dy, f]) => { roundRect(ctx, x + 44, y + dy, (w - 88) * f, 26, 13); ctx.fill(); roundRect(ctx, x + w - 44 - 150, y + dy, 150, 26, 13); ctx.fill(); });
        ctx.restore();
        // ligne pente surlignée
        const hk = ease.out(prog(t, S('s03') + 1.15, 0.45));
        ctx.save(); roundRect(ctx, x + 24, y + 300, (w - 48) * hk, 110, 22); ctx.fillStyle = 'rgba(201,168,76,0.22)'; ctx.fill(); ctx.restore();
        text(ctx, 'Pente max.', x + 52, y + 356, { size: 52, weight: 700, color: C.fg, align: 'left', family: F.body });
        text(ctx, '45 %', x + w - 52, y + 356, { size: 84, weight: 900, color: C.gold2, align: 'right' });
        const sk = prog(t, S('s04') + 0.05, 0.3);
        if (sk > 0) stamp(ctx, 'LE PIÈGE', 520, 975, -0.12, sk);
      });

      // 3. TRIANGLE : 45 % = 45 cm pour 100 cm = 24,2°
      block(ctx, t, S('s05'), S('s07'), (u) => {
        const d5 = E('s05') - S('s05');
        const riseP = ease.inOut(prog(t, S('s05') + 0.1, 1.6));
        const baseP = ease.inOut(prog(t, S('s05') + 1.7, 1.2));
        const arcP = ease.inOut(prog(t, S('s06') + 0.1, 1.3));
        const sl = slope(ctx, A, L, 45, { riseP, baseP, arcP, ruler: true });
        if (riseP > 0.6) text(ctx, '45 cm', A.x + L - 26, A.y - sl.h / 2, { size: 58, weight: 900, color: C.gold2, align: 'right', alpha: clamp((riseP - 0.6) * 3), stroke: 'rgba(0,0,0,0.6)', strokeWidth: 8 });
        if (baseP > 0.95) text(ctx, '100 cm', A.x + L / 2, A.y + 108, { size: 50, weight: 800, color: C.fg, alpha: clamp((baseP - 0.95) * 20) });
        const mu = 0.42;
        ctx.save(); ctx.globalAlpha *= clamp((riseP - 0.45) * 3);
        mower(ctx, A.x + L * mu, A.y - L * 0.45 * mu, sl.th, 0.62);
        ctx.restore();
        // lecture d'instrument
        const ang = 24.2277 * arcP;
        const showR = prog(t, S('s05') + 0.2, 0.3);
        readout(ctx, 'INCLINAISON', arcP > 0 ? fmt(ang) + '°' : '--,-°', 390, 470, { w: 470, h: 190, size: 96, alpha: showR });
        chip(ctx, 'PENTE 45 %', 390, 615, { color: C.fg, size: 38, alpha: showR });
        if (arcP > 0.9) text(ctx, '24°', A.x + 250, A.y - 52, { size: 64, weight: 900, color: C.gold2, alpha: clamp((arcP - 0.9) * 10), stroke: 'rgba(0,0,0,0.6)', strokeWidth: 8 });
      });

      // 4. 100 % = 45° : un mur
      block(ctx, t, S('s07'), S('s09'), (u) => {
        const mk = ease.inOut(prog(t, S('s07') + 0.25, 1.1));
        const pct = lerp(45, 100, mk);
        const sl = slope(ctx, A, L, pct, { arcP: 1, ruler: true });
        text(ctx, Math.round(pct) + ' cm', A.x + L - 26, A.y - sl.h / 2, { size: 58, weight: 900, color: C.gold2, align: 'right', stroke: 'rgba(0,0,0,0.6)', strokeWidth: 8 });
        readout(ctx, 'INCLINAISON', fmt(deg(sl.th)) + '°', 390, 470, { w: 470, h: 190, size: 96, border: mk > 0.98 ? C.red2 : C.gold, color: mk > 0.98 ? C.red2 : C.gold2 });
        chip(ctx, 'PENTE ' + Math.round(pct) + ' %', 390, 615, { color: mk > 0.98 ? C.red2 : C.fg, size: 38 });
        const wallK = prog(t, S('s08'), 0.3);
        let mu = 0.42;
        if (wallK > 0) mu = lerp(0.42, 0.08, ease.in(prog(t, S('s08') + 0.15, 0.7)));
        mower(ctx, A.x + L * mu * Math.cos(sl.th) / Math.cos(sl.th), A.y - L * Math.tan(sl.th) * mu, sl.th, 0.62, { cross: wallK > 0.5 });
        if (wallK > 0) {
          ctx.save(); ctx.translate(690, 930); const s = lerp(1.5, 1, ease.back(wallK)); ctx.scale(s, s); ctx.globalAlpha *= clamp(wallK * 3);
          text(ctx, 'UN MUR', 0, 0, { size: 112, weight: 900, color: C.red2, stroke: 'rgba(0,0,0,0.85)', strokeWidth: 14 });
          ctx.restore();
        }
      });

      // 5. Mesure avec une appli niveau
      block(ctx, t, S('s09'), S('s10'), (u) => {
        chip(ctx, 'APPLI NIVEAU', 520, 395, { color: C.fg, dot: C.gold, size: 38 });
        const tilt = 20 * ease.inOut(prog(t, S('s09') + 0.5, 1.2));
        const r = tilt * Math.PI / 180;
        // sol en pente sous le téléphone
        ctx.save(); ctx.translate(520, 1060); ctx.rotate(-r);
        ctx.strokeStyle = C.grass; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-430, 0); ctx.lineTo(430, 0); ctx.stroke();
        // téléphone couché sur la pente (vu de côté, écran face caméra pour la lisibilité)
        ctx.translate(0, -330);
        roundRect(ctx, -190, -300, 380, 600, 56); ctx.fillStyle = '#05080f'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#2b3850'; ctx.stroke();
        roundRect(ctx, -166, -276, 332, 552, 40); ctx.fillStyle = '#0b1220'; ctx.fill();
        ctx.restore();
        // écran (non incliné pour rester lisible)
        ctx.save(); ctx.translate(520 - Math.sin(r) * 330, 1060 - Math.cos(r) * 330);
        text(ctx, 'NIVEAU', 0, -170, { size: 30, family: F.mono, weight: 700, color: C.muted, letter: 4 });
        text(ctx, Math.round(tilt) + '°', 0, -40, { size: 150, family: F.mono, weight: 700, color: C.gold2, shadow: 'rgba(201,168,76,0.5)', shadowBlur: 30 });
        // bulle
        roundRect(ctx, -130, 90, 260, 54, 27); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke();
        ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(lerp(0, 95, tilt / 20), 117, 20, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // 6. Tableau degrés -> pour cent
      block(ctx, t, S('s10'), S('s11'), (u) => {
        const x = 170, y = 380, w = 700, rows = [[10, 18], [15, 27], [20, 36], [25, 47], [30, 58], [35, 70], [45, 100]];
        roundRect(ctx, x, y, w, 820, 34); ctx.fillStyle = 'rgba(11,18,32,0.95)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.line; ctx.stroke();
        text(ctx, 'DEGRÉS', x + 60, y + 66, { size: 30, family: F.mono, weight: 700, color: C.muted, align: 'left', letter: 4 });
        text(ctx, 'POUR CENT', x + w - 60, y + 66, { size: 30, family: F.mono, weight: 700, color: C.muted, align: 'right', letter: 4 });
        const hl = prog(t, S('s10') + 0.9, 0.3);
        rows.forEach(([dg, pc], i) => {
          const ry = y + 150 + i * 94, k = ease.out(prog(t, S('s10') + 0.05 + i * 0.06, 0.25));
          ctx.save(); ctx.globalAlpha *= k; ctx.translate((1 - k) * 40, 0);
          if (dg === 20 && hl > 0) { roundRect(ctx, x + 22, ry - 42, (w - 44) * ease.out(hl), 84, 18); ctx.fillStyle = 'rgba(201,168,76,0.25)'; ctx.fill(); }
          const strong = dg === 20 && hl > 0;
          text(ctx, dg + '°', x + 60, ry, { size: strong ? 64 : 54, family: F.mono, weight: 700, color: strong ? C.gold2 : C.fg, align: 'left' });
          text(ctx, '→', x + w / 2, ry, { size: 44, weight: 700, color: C.muted });
          text(ctx, pc + ' %', x + w - 60, ry, { size: strong ? 64 : 54, family: F.mono, weight: 700, color: strong ? C.gold2 : C.fg, align: 'right' });
          ctx.restore();
        });
      });

      // 7. Herbe mouillée : garde de la marge
      block(ctx, t, S('s11'), S('s12'), (u) => {
        const sl = slope(ctx, A, L, 36.4, { wet: true });
        // pluie
        ctx.save(); ctx.strokeStyle = 'rgba(150,190,235,0.55)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        for (let i = 0; i < 70; i++) {
          const x = hash(i) * 1080, sp = 1500 + hash(i + 99) * 700, y = ((t * sp + hash(i + 7) * 2200) % 2200) - 200;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 44); ctx.stroke();
        }
        ctx.restore();
        const slip = 0.45 - 0.05 * Math.abs(Math.sin((t - S('s11')) * 3.2));
        mower(ctx, A.x + L * slip, A.y - L * Math.tan(sl.th) * slip, sl.th, 0.62);
        chip(ctx, 'HERBE MOUILLÉE', 520, 400, { color: C.fg, dot: '#4f86b8', size: 38 });
        text(ctx, 'ÇA GLISSE', 520, 540, { size: 120, weight: 900, color: C.white, stroke: 'rgba(0,0,0,0.7)', strokeWidth: 12 });
        const mk = prog(t, S('s11') + 0.2, 0.3);
        text(ctx, '→ garde de la marge', 520, 670, { size: 56, weight: 800, color: C.gold2, alpha: mk });
      });

      // 8. Appels à l'action
      block(ctx, t, S('s12'), S('s13'), (u) => {
        text(ctx, 'TON ANGLE ?', 520, 560, { size: 150, weight: 900, color: C.white, shadow: 'rgba(201,168,76,0.35)', shadowBlur: 40, maxWidth: 860 });
        const b = Math.abs(Math.sin((t - S('s12')) * 5)) * 26;
        text(ctx, '👇', 520, 780 + b, { size: 150, family: F.emoji, weight: 400 });
        chip(ctx, 'ÉCRIS-LE EN COMMENTAIRE', 520, 990, { color: C.gold, size: 42 });
      });
      block(ctx, t, S('s13'), END + 1, (u) => {
        text(ctx, '@marcio.mota8', 520, 560, { size: 104, weight: 900, color: C.white, maxWidth: 880 });
        chip(ctx, 'JE MESURE TOUT', 520, 690, { color: C.gold, dot: C.red, size: 32 });
        text(ctx, 'avant que tu achètes', 520, 810, { size: 62, weight: 800, color: C.gold2 });
        const p = 1 + 0.05 * Math.sin((t - S('s13')) * 7);
        ctx.save(); ctx.translate(520, 960); ctx.scale(p, p);
        roundRect(ctx, -220, -58, 440, 116, 58); ctx.fillStyle = C.red; ctx.fill();
        text(ctx, "S'ABONNER", 0, 2, { size: 54, weight: 900, color: C.white });
        ctx.restore();
      });

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
