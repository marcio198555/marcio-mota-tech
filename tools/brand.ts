// Generates the app icon in every form Android and Google Play need, from the
// same four-arrow knot the game shows on its home screen.
// Run: tsx tools/brand.ts   (then tools/brand.sh renders the PNG files)

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KNOT, KNOT_COLORS, knotPaths } from '../game/src/icons';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const res = join(root, 'android/app/src/main/res');
const out = join(root, 'store/svg');
mkdirSync(out, { recursive: true });
mkdirSync(join(res, 'drawable'), { recursive: true });
mkdirSync(join(res, 'mipmap-anydpi-v26'), { recursive: true });

const NIGHT = '#131A36';
const NIGHT_HI = '#1F2A57';
const DXY: readonly (readonly [number, number])[] = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const f = (n: number) => n.toFixed(2);

// ---- Android vector drawables (adaptive icon: 108 x 108, art inside the middle 66) ----

function vector(colors: readonly string[] | string): string {
  const box = 108;
  const span = 54; // size of the knot
  const pad = (box - span) / 2;
  const cs = span / 4;
  const at = (x: number, y: number): [number, number] => [pad + (x + 0.5) * cs, pad + (y + 0.5) * cs];
  let body = '';
  for (const a of KNOT) {
    const col = typeof colors === 'string' ? colors : colors[a.dir];
    const pts = a.cells.map(([x, y]) => at(x, y));
    const lw = cs * 0.29;
    const d = pts.map(([x, y], i) => (i ? 'L' : 'M') + f(x) + ',' + f(y)).join(' ');
    const [hx, hy] = pts[pts.length - 1];
    const [dx, dy] = DXY[a.dir];
    const tipX = hx + dx * cs * 0.44;
    const tipY = hy + dy * cs * 0.44;
    const bx = hx - dx * cs * 0.1;
    const by = hy - dy * cs * 0.1;
    const half = cs * 0.33;
    const tri = `M${f(tipX)},${f(tipY)} L${f(bx - dy * half)},${f(by + dx * half)} L${f(bx + dy * half)},${f(by - dx * half)} Z`;
    const r = lw * 0.78;
    const [tx, ty] = pts[0];
    const bead = `M${f(tx - r)},${f(ty)} a${f(r)},${f(r)} 0 1,0 ${f(2 * r)},0 a${f(r)},${f(r)} 0 1,0 ${f(-2 * r)},0 Z`;
    body += `    <path android:pathData="${d}" android:strokeColor="${col}" android:strokeWidth="${f(lw)}" android:strokeLineCap="round" android:strokeLineJoin="round" />\n`;
    body += `    <path android:pathData="${bead}" android:fillColor="${col}" />\n`;
    body += `    <path android:pathData="${tri}" android:fillColor="${col}" android:strokeColor="${col}" android:strokeWidth="${f(cs * 0.07)}" android:strokeLineJoin="round" />\n`;
  }
  return `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
${body}</vector>
`;
}

writeFileSync(join(res, 'drawable/ic_launcher_foreground.xml'), vector(KNOT_COLORS));
writeFileSync(join(res, 'drawable/ic_launcher_monochrome.xml'), vector('#FFFFFF'));
writeFileSync(
  join(res, 'mipmap-anydpi-v26/ic_launcher.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>
`,
);

// ---- SVG masters ----

const defs = `<defs>
<radialGradient id="bg" cx="0.35" cy="0.25" r="0.95"><stop offset="0" stop-color="${NIGHT_HI}"/><stop offset="1" stop-color="${NIGHT}"/></radialGradient>
</defs>`;

/** Google Play icon: full square, no rounded corners (Play rounds them itself). */
writeFileSync(
  join(out, 'play-icon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100">${defs}<rect width="100" height="100" fill="url(#bg)"/>${knotPaths(100, 0.2)}</svg>`,
);

/** Launcher icon for Android 7: rounded square with a little margin. */
writeFileSync(
  join(out, 'legacy-icon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 100 100">${defs}<rect x="4" y="4" width="92" height="92" rx="21" fill="url(#bg)"/>${knotPaths(100, 0.22)}</svg>`,
);

console.log('icon sources written');
