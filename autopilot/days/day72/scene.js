// Vidéo 72 — Série « Suisse contre France » : Netflix, même offre Standard, qui paie le plus ?
// Tout le timing passe par S('sNN'), E('sNN') ou des fractions de phrase. Chiffres : days/day72/facts.md (relevés du 13.11.2026).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA, readout } = ENG;
  const { pop, stamp, big, line, tag, coin, comment } = KIT;
  const END = E('s15') + 0.6;
  const AC = '#e5323f', AC2 = '#ff9aa1';            // accent de la vidéo : rouge « écran de streaming » (sans logo)
  const CH = '#e8323e', FR = '#3f83ee', WARN = '#ffb02e', OK = '#46d08e', WHITE = '#ffffff';
  const CX = 505;
  const at = (id, x) => S(id) + (E(id) - S(id)) * x;
  const NB = ' ';

  // ---------- drapeaux dessinés ----------
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
  // téléviseur générique avec un écran « streaming » (sans logo) : bandes de vignettes qui défilent
  function screenTV(ctx, cx, cy, w, t, o = {}) {
    const h = w * 0.58;
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = '#1c2433'; ctx.fillRect(-w * 0.07, h / 2, w * 0.14, w * 0.07);
    roundRect(ctx, -w * 0.22, h / 2 + w * 0.06, w * 0.44, w * 0.03, 6); ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
    roundRect(ctx, -w / 2, -h / 2, w, h, 14); ctx.fillStyle = '#05080f'; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.lineWidth = 7; ctx.strokeStyle = '#34425c'; ctx.stroke();
    ctx.save(); roundRect(ctx, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 8); ctx.clip();
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#2a0b10'); g.addColorStop(1, '#0b0d16');
    ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
    // grande vignette + 2 rangées de petites vignettes qui défilent
    roundRect(ctx, -w / 2 + 22, -h / 2 + 20, w * 0.56, h * 0.36, 8); ctx.fillStyle = AC; ctx.fill();
    const cols = ['#e5323f', '#ffb02e', '#5aa9ff', '#46d08e', '#b07cff', '#ff7ab6'];
    for (let r = 0; r < 2; r++) {
      const off = ((t * (r ? 18 : 26) + (o.phase || 0) * 40) % (w * 0.3));
      for (let i = -1; i < 5; i++) {
        const x = -w / 2 + 22 + i * w * 0.3 - off, y = -h / 2 + h * 0.48 + r * h * 0.24;
        roundRect(ctx, x, y, w * 0.26, h * 0.18, 6); ctx.fillStyle = cols[(i + 6 + r * 2) % 6] + 'cc'; ctx.fill();
      }
    }
    if (o.badge) { roundRect(ctx, w / 2 - 110, -h / 2 + 18, 90, 52, 8); ctx.fillStyle = WHITE; ctx.fill(); text(ctx, o.badge, w / 2 - 65, -h / 2 + 45, { size: 34, weight: 900, color: '#05080f' }); }
    ctx.restore();
    ctx.restore();
  }
  function pane(ctx, x, y, w, h, col) {
    roundRect(ctx, x, y, w, h, 30);
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, col + '38'); g.addColorStop(1, col + '12');
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col + 'aa'; ctx.stroke();
  }
  // écran partagé : image 0 et retour avant l'appel à s'abonner
  function duel(ctx, t, o = {}) {
    pane(ctx, 70, 648, 420, 580, CH); pane(ctx, 520, 648, 408, 580, FR);
    flagCH(ctx, 140, 722, 92); text(ctx, 'SUISSE', 320, 724, { size: 62, weight: 900, color: WHITE });
    flagFR(ctx, 592, 722, 80); text(ctx, 'FRANCE', 788, 724, { size: 58, weight: 900, color: WHITE });
    screenTV(ctx, 280, 920, 340, t, { phase: 0 }); screenTV(ctx, 724, 920, 340, t, { phase: 3 });
    text(ctx, o.left || '? CHF', 280, 1150, { size: 62, family: F.mono, weight: 700, color: o.left ? WHITE : AC2 });
    text(ctx, o.right || '? CHF', 724, 1150, { size: 62, family: F.mono, weight: 700, color: o.right ? WHITE : AC2 });
    ctx.beginPath(); ctx.arc(CX, 1000, 50, 0, 7); ctx.fillStyle = '#04070d'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = AC; ctx.stroke();
    text(ctx, 'VS', CX, 1002, { size: 42, weight: 900, color: AC });
  }
  function card(ctx, col, draw) { pane(ctx, 90, 300, 830, 900, col); draw(); }
  function coinFlip(ctx, x, y, r, label, col, flip) {
    ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.03, Math.abs(flip)), 1);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = col; ctx.fill();
    ctx.lineWidth = r * 0.07; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, 7); ctx.lineWidth = r * 0.025; ctx.stroke();
    text(ctx, label, 0, 4, { size: r * 0.5, weight: 900, color: '#ffffff', maxWidth: r * 1.6 });
    ctx.restore();
  }
  // carte d'offre (s09)
  function plan(ctx, x, y, name, sub, col, o = {}) {
    roundRect(ctx, x - 125, y - 150, 250, 300, 22); ctx.fillStyle = 'rgba(10,14,24,0.92)'; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.stroke();
    text(ctx, name, x, y - 80, { size: 40, weight: 900, color: WHITE, maxWidth: 230 });
    text(ctx, sub, x, y + 10, { size: 44, family: F.mono, weight: 700, color: col, maxWidth: 230 });
    if (o.note) text(ctx, o.note, x, y + 85, { size: 36, weight: 800, color: C.fg, maxWidth: 230 });
  }
  function cross(ctx, x, y, s, k) {
    ctx.save(); ctx.translate(x, y); ctx.lineCap = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = CH;
    ctx.beginPath(); ctx.moveTo(-s, -s); ctx.lineTo(-s + 2 * s * clamp(k * 2), -s + 2 * s * clamp(k * 2)); ctx.stroke();
    if (k > 0.5) { ctx.beginPath(); ctx.moveTo(s, -s); ctx.lineTo(s - 2 * s * clamp(k * 2 - 1), -s + 2 * s * clamp(k * 2 - 1)); ctx.stroke(); }
    ctx.restore();
  }
  // caractéristiques identiques (s03, s04)
  function specs(ctx, t, t0, col) {
    ['SANS PUB', '2 ÉCRANS', '1080p'].forEach((s, i) => {
      pop(ctx, t, t0 + i * 0.18, 220 + i * 285, 1040, () => {
        roundRect(ctx, -136, -44, 272, 88, 44); ctx.fillStyle = 'rgba(70,208,142,0.16)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = OK; ctx.stroke();
        text(ctx, '✓ ' + s, 0, 2, { size: 38, weight: 900, color: WHITE, maxWidth: 252 });
      });
    });
  }

  window.SCENE = {
    duration: END,
    load: () => CHR.load(['money_with_wings']),
    draw(ctx, t) {
      background(ctx, t, { glow: 'rgba(96,20,30,0.45)' });

      // 1. ACCROCHE : écran partagé complet dès l'image 0
      block(ctx, t, 0, S('s03'), () => {
        const z = 1 + 0.0025 * Math.min(t, 4);
        ctx.save(); ctx.translate(CX, 800); ctx.scale(z, z); ctx.translate(-CX, -800);
        if (t < S('s02')) {
          text(ctx, 'QUI PAIE', CX, 372, { size: 122, weight: 900, color: WHITE });
          text(ctx, 'LE PLUS ?', CX, 490, { size: 122, weight: 900, color: AC, shadow: 'rgba(229,50,63,0.45)' });
          if (t < at('s01', 0.5)) text(ctx, 'MÊME OFFRE NETFLIX', CX, 594, { size: 44, family: F.mono, weight: 700, color: WHITE, maxWidth: 820 });
          else pop(ctx, t, at('s01', 0.5), CX, 594, () => chip(ctx, 'ET DE COMBIEN ?', 0, 0, { color: WHITE, size: 40, border: AC }));
        } else {
          text(ctx, 'À LA FIN', CX, 345, { size: 60, weight: 900, color: WHITE });
          readout(ctx, 'ÉCART SUR 1 AN', '??? CHF', CX, 472, { w: 660, h: 170, size: 84, border: AC, color: AC2, labelSize: 36 });
          // 12 cases : les mois
          for (let i = 0; i < 12; i++) {
            const on = t >= S('s02') + 0.1 + i * 0.07;
            roundRect(ctx, 150 + i * 60, 582, 48, 38, 8); ctx.fillStyle = on ? AC : 'rgba(255,255,255,0.12)'; ctx.fill();
          }
        }
        duel(ctx, t);
        ctx.restore();
      });

      // 2. Suisse : 22,90 CHF
      block(ctx, t, S('s03'), S('s04'), () => {
        card(ctx, CH, () => {
          flagCH(ctx, 190, 400, 110); text(ctx, 'EN SUISSE', 560, 402, { size: 84, weight: 900, color: WHITE });
          const k = ease.inOut(prog(t, at('s03', 0.3), (E('s03') - S('s03')) * 0.45));
          readout(ctx, 'STANDARD · CHF PAR MOIS', k > 0.5 ? '22,90' : '', CX, 620, { w: 740, h: 270, size: 170, border: CH, color: WHITE, labelSize: 36 });
          tag(ctx, 'PAGE D\'AIDE NETFLIX · 13.11.2026', CX, 820, t, at('s03', 0.2), { color: AC2 });
          screenTV(ctx, CX, 935, 170, t);
          specs(ctx, t, at('s03', 0.55), CH);
        });
      });

      // 3. France : 14,99 €
      block(ctx, t, S('s04'), S('s05'), () => {
        card(ctx, FR, () => {
          flagFR(ctx, 200, 400, 100); text(ctx, 'EN FRANCE', 580, 402, { size: 84, weight: 900, color: WHITE });
          const k = ease.inOut(prog(t, S('s04') + 0.1, (E('s04') - S('s04')) * 0.5));
          readout(ctx, 'STANDARD · € PAR MOIS', k > 0.5 ? '14,99' : '', CX, 620, { w: 740, h: 270, size: 170, border: FR, color: WHITE, labelSize: 36 });
          tag(ctx, 'MÊMES CARACTÉRISTIQUES', CX, 820, t, S('s04') + 0.15, { color: WHITE });
          screenTV(ctx, CX, 935, 170, t, { phase: 2 });
          specs(ctx, t, S('s04') + 0.25, FR);
        });
      });

      // 4. Conversion : la pièce se retourne
      block(ctx, t, S('s05'), S('s06'), () => {
        text(ctx, 'CONVERTI EN FRANCS', CX, 380, { size: 74, weight: 900, color: WHITE });
        const fk = prog(t, at('s05', 0.3), (E('s05') - S('s05')) * 0.35);
        const flip = Math.cos(fk * Math.PI);
        coinFlip(ctx, CX, 640, 180, flip >= 0 ? '14,99 €' : '13,83 CHF', flip >= 0 ? FR : CH, flip);
        const k = ease.out(prog(t, at('s05', 0.4), 0.25));
        text(ctx, '14,99 × 0,9228 = 13,83', CX, 900, { size: 60, family: F.mono, weight: 700, color: WHITE, alpha: k });
        text(ctx, 'moins de 14 francs', CX, 975, { size: 52, weight: 800, color: AC2, alpha: k });
        tag(ctx, 'BNS, 12.11.2026 : 1 € = 0,9228 CHF', CX, 1080, t, at('s05', 0.15), { color: AC2 });
        tag(ctx, 'LE TAUX BOUGE CHAQUE JOUR', CX, 1160, t, at('s05', 0.75), { color: C.fg });
      });

      // 5. Réponse : deux colonnes + 66 %, puis l'écart de 9 CHF
      block(ctx, t, S('s06'), S('s08'), () => {
        const k = ease.out(prog(t, S('s06') + 0.1, (E('s06') - S('s06')) * 0.5));
        const base = 1085, sc = 20;
        [[290, 22.90, CH, 0], [720, 13.83, FR, 1]].forEach(([x, v, col, i]) => {
          const h = v * sc * k;
          roundRect(ctx, x - 125, base - h, 250, Math.max(h, 2), 18); ctx.fillStyle = col; ctx.fill();
          if (k > 0.6) text(ctx, v.toFixed(2).replace('.', ','), x, base - h - 50, { size: 76, family: F.mono, weight: 700, color: WHITE });
          if (i === 0) flagCH(ctx, x - 60, base + 62, 76); else flagFR(ctx, x - 70, base + 62, 70);
          text(ctx, 'CHF', x + 58, base + 64, { size: 42, family: F.mono, weight: 700, color: C.fg });
        });
        if (t < S('s07')) stamp(ctx, `+${NB}66${NB}% EN SUISSE`, CX, 382, t, at('s06', 0.55), { size: 70, color: WARN, rot: -0.02 });
        else {
          const y1 = base - 22.90 * sc, y2 = base - 13.83 * sc;
          ctx.save(); ctx.strokeStyle = WARN; ctx.lineWidth = 7; ctx.setLineDash([12, 10]);
          ctx.beginPath(); ctx.moveTo(420, y1); ctx.lineTo(880, y1); ctx.moveTo(860, y1); ctx.lineTo(860, y2); ctx.stroke(); ctx.restore();
          const p = 1 + 0.05 * Math.sin((t - S('s07')) * 7);
          ctx.save(); ctx.translate(CX, 360); ctx.scale(p, p); big(ctx, `9,07${NB}CHF`, 0, 0, t, S('s07'), { size: 110, color: WARN }); ctx.restore();
          tag(ctx, 'D\'ÉCART · CHAQUE MOIS', CX, 455, t, S('s07') + 0.2, { color: WHITE });
        }
        chip(ctx, 'OFFRE STANDARD', CX, 1230, { color: WHITE, size: 36 });
      });

      // 6. Sur un an : 12 pièces tombent, compteur jusqu'à 108,81
      block(ctx, t, S('s08'), S('s09'), () => {
        text(ctx, 'SUR UN AN', CX, 380, { size: 84, weight: 900, color: WHITE });
        for (let i = 0; i < 12; i++) {
          const d = t - S('s08') - 0.1 - i * 0.09; if (d < 0) continue;
          const kk = ease.out(clamp(d / 0.4)), x = 170 + (i % 6) * 135, yEnd = 640 + Math.floor(i / 6) * 130;
          coin(ctx, x, lerp(yEnd - 300, yEnd, kk), 56, '');
        }
        const k = ease.inOut(prog(t, S('s08') + 0.15, Math.max(0.6, (E('s08') - S('s08')) * 0.7)));
        readout(ctx, 'ÉCART · CHF PAR AN', k > 0.5 ? '108,81' : '', CX, 970, { w: 760, h: 240, size: 140, border: WARN, color: WARN, labelSize: 36 });
        tag(ctx, '274,80 − 165,99', CX, 1150, t, at('s08', 0.5), { color: C.fg });
      });

      // 7. Surprise : pas d'offre avec pub en Suisse
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, 'SURPRISE', CX, 372, t, S('s09'), { size: 64, color: WARN });
        flagCH(ctx, 160, 520, 80); text(ctx, 'OFFRES LISTÉES EN SUISSE', 560, 522, { size: 46, weight: 900, color: WHITE, maxWidth: 700 });
        pop(ctx, t, at('s09', 0.2), 0, 0, () => {
          plan(ctx, 230, 760, 'ESSENTIEL', '14,90', CH, { note: '720p' });
          plan(ctx, 505, 760, 'STANDARD', '22,90', CH, { note: '1080p' });
          plan(ctx, 780, 760, 'PREMIUM', '29,90', CH, { note: '4K' });
        });
        pop(ctx, t, at('s09', 0.55), CX, 1060, () => {
          roundRect(ctx, -300, -62, 600, 124, 24); ctx.fillStyle = 'rgba(200,32,48,0.18)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = CH; ctx.stroke();
          text(ctx, 'AVEC PUB : AUCUNE', 0, 2, { size: 56, weight: 900, color: WHITE });
        });
        if (t > at('s09', 0.7)) cross(ctx, CX + 330, 1060, 40, prog(t, at('s09', 0.7), 0.35));
      });

      // 8. Les moins chères : 7,99 € contre 14,90 CHF
      block(ctx, t, S('s10'), S('s11'), () => {
        text(ctx, 'LA MOINS CHÈRE', CX, 380, { size: 84, weight: 900, color: WHITE });
        pop(ctx, t, S('s10') + 0.05, 290, 700, () => {
          pane(ctx, -205, -250, 410, 500, FR); flagFR(ctx, 0, -170, 84);
          text(ctx, '7,99 €', 0, -40, { size: 96, family: F.mono, weight: 700, color: WHITE });
          text(ctx, 'avec pub', 0, 45, { size: 46, weight: 800, color: C.fg });
          text(ctx, `≈${NB}7,37 CHF`, 0, 140, { size: 50, family: F.mono, weight: 700, color: AC2 });
        });
        pop(ctx, t, at('s10', 0.5), 720, 700, () => {
          pane(ctx, -205, -250, 410, 500, CH); flagCH(ctx, 0, -170, 90);
          text(ctx, '14,90', 0, -40, { size: 96, family: F.mono, weight: 700, color: WHITE });
          text(ctx, 'Essentiel, 720p', 0, 45, { size: 46, weight: 800, color: C.fg, maxWidth: 380 });
          text(ctx, 'CHF', 0, 140, { size: 50, family: F.mono, weight: 700, color: AC2 });
        });
        stamp(ctx, `×${NB}2 EN FRANCS`, CX, 1060, t, at('s10', 0.8), { size: 60, color: WARN, rot: 0.02 });
      });

      // 9. Ce n'est pas la TVA : hors TVA, l'écart grandit
      block(ctx, t, S('s11'), S('s12'), () => {
        text(ctx, 'ET LA TVA ?', CX, 380, { size: 90, weight: 900, color: WHITE });
        const k = ease.out(prog(t, S('s11') + 0.1, 0.6));
        [[290, '8,1 %', CH, 0.081], [720, '20 %', FR, 0.2]].forEach(([x, l, col, v], i) => {
          roundRect(ctx, x - 150, 470, 300, 70, 20); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
          roundRect(ctx, x - 150, 470, 300 * (v / 0.2) * k, 70, 20); ctx.fillStyle = col; ctx.fill();
          text(ctx, 'TVA ' + l, x, 590, { size: 50, weight: 900, color: WHITE });
        });
        const k2 = ease.out(prog(t, at('s11', 0.45), 0.3));
        if (k2 > 0) {
          ctx.save(); ctx.globalAlpha *= k2;
          text(ctx, 'SANS TVA', CX, 700, { size: 56, weight: 900, color: AC2 });
          text(ctx, '21,18', 290, 800, { size: 88, family: F.mono, weight: 700, color: WHITE });
          text(ctx, '11,53', 720, 800, { size: 88, family: F.mono, weight: 700, color: WHITE });
          text(ctx, 'CHF', CX, 802, { size: 44, family: F.mono, weight: 700, color: C.fg });
          ctx.restore();
        }
        stamp(ctx, `+${NB}84${NB}%`, CX, 950, t, at('s11', 0.6), { size: 84, color: WARN });
        tag(ctx, 'CALCUL · TVA AU TAUX NORMAL', CX, 1090, t, at('s11', 0.5), { color: C.fg });
      });

      // 10. Conseil : la 4K n'existe qu'en Premium
      block(ctx, t, S('s12'), S('s13'), () => {
        stamp(ctx, 'CONSEIL', CX, 372, t, S('s12'), { size: 60, color: OK });
        screenTV(ctx, CX, 640, 520, t, { badge: '4K' });
        pop(ctx, t, at('s12', 0.35), CX, 940, () => text(ctx, 'SEULEMENT EN PREMIUM', 0, 0, { size: 64, weight: 900, color: WHITE, maxWidth: 840 }));
        line(ctx, '29,90 − 22,90 = 7 CHF / mois', CX, 1040, t, at('s12', 0.6), { size: 50, family: F.mono, weight: 700, dx: 0 });
        tag(ctx, 'STANDARD : 1080p', CX, 1130, t, at('s12', 0.7), { color: C.fg });
      });

      // 11. Question pour les commentaires
      block(ctx, t, S('s13'), S('s14'), () => comment(ctx, t, S('s13'), ['Quelle offre', 'tu paies ?'], { y: 700, color: AC }));

      // 12. Retour au duel : 275 / 166 CHF par an
      block(ctx, t, S('s14'), S('s15'), () => {
        const a = at('s14', 0.15), b = at('s14', 0.6);
        if (t < a) {
          text(ctx, 'MÊME OFFRE', CX, 372, { size: 104, weight: 900, color: WHITE });
          text(ctx, 'STANDARD', CX, 480, { size: 104, weight: 900, color: AC });
        } else {
          pop(ctx, t, a, CX, 390, () => text(ctx, `+${NB}109 CHF PAR AN`, 0, 0, { size: 92, weight: 900, color: WARN, maxWidth: 860 }));
          pop(ctx, t, b, CX, 500, () => text(ctx, 'en Suisse, au cours du 12.11', 0, 0, { size: 50, weight: 900, color: AC2, maxWidth: 860 }));
        }
        chip(ctx, 'PRIX NETFLIX · 13.11.2026', CX, 590, { color: WHITE, size: 36, border: AC });
        duel(ctx, t, { left: '275 CHF', right: '166 CHF' });
      });

      // 13. Abonne-toi
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: ['aspirateur sans fil', '« 60 min » : vraiment ?'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
