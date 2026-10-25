// Jour 5 — « 8 lettres minuscules = 3 semaines » : temps pour casser un mot de passe (Hive Systems 2025, bcrypt, 12 × RTX 5090).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA } = ENG;
  const END = E('s10') + 0.55;

  function field(ctx, cx, cy, w, dots, o = {}) {
    roundRect(ctx, cx - w / 2, cy - 70, w, 140, 30); ctx.fillStyle = '#e9edf5'; ctx.fill();
    text(ctx, o.label || 'MOT DE PASSE', cx - w / 2 + 30, cy - 100, { size: 28, family: F.mono, weight: 700, color: C.muted, align: 'left', letter: 3 });
    for (let i = 0; i < dots; i++) { ctx.fillStyle = '#0b1220'; ctx.beginPath(); ctx.arc(cx - w / 2 + 70 + i * 62, cy, 17, 0, Math.PI * 2); ctx.fill(); }
  }
  function gpu(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -80, -36, 160, 72, 10); ctx.fillStyle = '#1a2333'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#3a4660'; ctx.stroke();
    [-38, 38].forEach(fx => { ctx.strokeStyle = C.muted; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx, 0, 24, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(fx - 16, 0); ctx.lineTo(fx + 16, 0); ctx.moveTo(fx, -16); ctx.lineTo(fx, 16); ctx.stroke(); });
    ctx.restore();
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE
      block(ctx, t, 0, S('s02'), () => {
        field(ctx, 520, 520, 600, 8, { label: '8 MINUSCULES' });
        text(ctx, '3 SEMAINES', 520, 800, { size: 150, weight: 900, color: C.red2, shadow: 'rgba(255,59,78,0.45)', shadowBlur: 40, maxWidth: 900 });
        text(ctx, 'pour le casser', 520, 940, { size: 64, weight: 800, color: C.white });
        text(ctx, '⏳', 520, 1110, { size: 110, family: F.emoji, weight: 400 });
      });

      // Hive Systems 2025 : 12 GPU
      block(ctx, t, S('s02'), S('s03'), () => {
        chip(ctx, 'HIVE SYSTEMS · 2025', 520, 420, { color: C.gold, size: 32 });
        for (let i = 0; i < 12; i++) {
          const k = ease.back(prog(t, S('s02') + 0.2 + i * 0.08, 0.3));
          if (k > 0) gpu(ctx, 250 + (i % 3) * 270, 560 + Math.floor(i / 3) * 120, 1.05 * k);
        }
        text(ctx, '12 cartes graphiques', 520, 1110, { size: 60, weight: 800, color: C.white });
      });

      // 8 chiffres : 15 min
      block(ctx, t, S('s03'), S('s04'), () => {
        field(ctx, 520, 520, 600, 8, { label: '8 CHIFFRES (PIN)' });
        text(ctx, '15 MIN', 520, 820, { size: 200, weight: 900, color: C.red2 });
        text(ctx, 'un quart d\'heure', 520, 980, { size: 60, weight: 800, color: C.fg });
      });

      // Déjà fuité : instantané
      block(ctx, t, S('s04'), S('s05'), () => {
        text(ctx, '⚡', 520, 560, { size: 220, family: F.emoji, weight: 400 });
        text(ctx, 'DÉJÀ FUITÉ ?', 520, 790, { size: 100, weight: 900, color: C.white });
        text(ctx, 'INSTANTANÉ', 520, 920, { size: 120, weight: 900, color: C.red2, maxWidth: 900 });
        chip(ctx, 'LES LISTES DE FUITES PASSENT EN PREMIER', 520, 1060, { color: C.muted, size: 24 });
      });

      // La longueur
      block(ctx, t, S('s05'), S('s07'), () => {
        text(ctx, 'LA LONGUEUR', 520, 430, { size: 110, weight: 900, color: C.gold2 });
        const n = 6;
        for (let i = 0; i < n; i++) {
          const k = ease.out(prog(t, S('s06') - 0.2 + i * 0.22, 0.4));
          const h = 18 * Math.pow(2, i) * k;
          const x = 190 + i * 130, base = 1180;
          roundRect(ctx, x - 44, base - h, 88, Math.max(1, h), 14); ctx.fillStyle = i === n - 1 ? C.gold2 : '#3d5a80'; ctx.fill();
          text(ctx, '+' + (i + 1), x, base + 44, { size: 34, family: F.mono, weight: 700, color: C.muted });
        }
        text(ctx, 'caractères en plus →', 520, 530, { size: 36, family: F.mono, weight: 700, color: C.muted });
      });

      // Gestionnaire
      block(ctx, t, S('s07'), S('s08'), () => {
        text(ctx, '🔐', 520, 560, { size: 220, family: F.emoji, weight: 400 });
        text(ctx, '1 SITE', 520, 790, { size: 110, weight: 900, color: C.white });
        text(ctx, '= 1 MOT DE PASSE', 520, 910, { size: 84, weight: 900, color: C.gold2, maxWidth: 900 });
        chip(ctx, 'DANS UN GESTIONNAIRE', 520, 1040, { color: C.fg, size: 30 });
      });

      // 2FA
      block(ctx, t, S('s08'), S('s09'), () => {
        roundRect(ctx, 350, 380, 340, 560, 52); ctx.fillStyle = '#05080f'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#2b3850'; ctx.stroke();
        text(ctx, 'CODE', 520, 560, { size: 30, family: F.mono, weight: 700, color: C.muted, letter: 4 });
        text(ctx, '482 913', 520, 650, { size: 66, family: F.mono, weight: 700, color: C.gold2 });
        text(ctx, 'exemple', 520, 730, { size: 26, family: F.mono, weight: 400, color: C.muted });
        text(ctx, 'DOUBLE', 520, 1030, { size: 96, weight: 900, color: C.white });
        text(ctx, 'AUTHENTIFICATION', 520, 1130, { size: 70, weight: 900, color: C.gold2, maxWidth: 900 });
      });

      // Partage
      block(ctx, t, S('s09'), S('s10'), () => {
        const k = ease.back(prog(t, S('s09'), 0.35));
        ctx.save(); ctx.translate(520, 600); ctx.scale(Math.max(0.01, k), Math.max(0.01, k));
        ctx.fillStyle = C.gold2; ctx.beginPath(); ctx.moveTo(-120, 40); ctx.quadraticCurveTo(-110, -90, 40, -90); ctx.lineTo(40, -160); ctx.lineTo(170, -40); ctx.lineTo(40, 80); ctx.lineTo(40, 10); ctx.quadraticCurveTo(-60, 0, -120, 40); ctx.closePath(); ctx.fill();
        ctx.restore();
        text(ctx, 'ENVOIE ÇA', 520, 880, { size: 110, weight: 900, color: C.white });
        chip(ctx, 'À CELUI QUI UTILISE SON PRÉNOM', 520, 1000, { color: C.gold, size: 28 });
      });

      block(ctx, t, S('s10'), END + 1, () => followCTA(ctx, t, S('s10')));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
