// Interface icons and the emblem, all drawn for this game.

const svg = (body: string, fill = false): string =>
  `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="${fill ? 'currentColor' : 'none'}" stroke="${fill ? 'none' : 'currentColor'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICON = {
  home: svg('<path d="M4 11.5 12 4l8 7.5"/><path d="M6.5 10v9.5h11V10"/>'),
  back: svg('<path d="M14.5 5 8 12l6.5 7"/>'),
  restart: svg('<path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5"/><path d="M4 4.5v4.2h4.2"/>'),
  bulb: svg('<path d="M9 17.5h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/>'),
  fit: svg('<path d="M4 9V4h5"/><path d="M20 9V4h-5"/><path d="M4 15v5h5"/><path d="M20 15v5h-5"/>'),
  gear: svg('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>'),
  grid: svg('<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>'),
  calendar: svg('<rect x="3.5" y="5.5" width="17" height="15" rx="3"/><path d="M3.5 10.5h17M8 3v4M16 3v4"/>'),
  heart: svg('<path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"/>', true),
  star: svg('<path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9L12 2.8Z"/>', true),
  play: svg('<path d="M8 5.2v13.6a1 1 0 0 0 1.5.9l11-6.8a1 1 0 0 0 0-1.8l-11-6.8A1 1 0 0 0 8 5.2Z"/>', true),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  video: svg('<rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10.5 5-3v9l-5-3"/>'),
  share: svg('<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
};

/**
 * The emblem is a real, solvable 4 x 4 board: four arrows, four directions,
 * four colours. It is drawn with the same proportions as the game board.
 */
export const KNOT: readonly { cells: readonly (readonly [number, number])[]; dir: 0 | 1 | 2 | 3 }[] = [
  { cells: [[0, 0], [1, 0], [2, 0], [3, 0]], dir: 1 },
  { cells: [[0, 3], [0, 2], [0, 1]], dir: 0 },
  { cells: [[1, 1], [2, 1], [3, 1], [3, 2], [3, 3]], dir: 2 },
  { cells: [[1, 3], [2, 3], [2, 2], [1, 2]], dir: 3 },
];

const DXY: readonly (readonly [number, number])[] = [[0, -1], [1, 0], [0, 1], [-1, 0]];
export const KNOT_COLORS: readonly string[] = ['#58C4FF', '#FFD166', '#FF6B8B', '#5FE3A1'];

/** SVG markup of the knot inside a `box` x `box` square, leaving `pad` (0..0.5) around it. */
export function knotPaths(box: number, pad: number, colors: readonly string[] = KNOT_COLORS): string {
  const inner = box * (1 - 2 * pad);
  const cs = inner / 4;
  const at = (x: number, y: number): [number, number] => [box * pad + (x + 0.5) * cs, box * pad + (y + 0.5) * cs];
  const f = (n: number) => n.toFixed(2);
  let out = '';
  for (const a of KNOT) {
    const col = colors[a.dir];
    const pts = a.cells.map(([x, y]) => at(x, y));
    const lw = cs * 0.29;
    const d = pts.map(([x, y], i) => (i ? 'L' : 'M') + f(x) + ' ' + f(y)).join(' ');
    const [hx, hy] = pts[pts.length - 1];
    const [dx, dy] = DXY[a.dir];
    const tip: [number, number] = [hx + dx * cs * 0.44, hy + dy * cs * 0.44];
    const bx = hx - dx * cs * 0.1;
    const by = hy - dy * cs * 0.1;
    const half = cs * 0.33;
    const tri = `M${f(tip[0])} ${f(tip[1])} L${f(bx - dy * half)} ${f(by + dx * half)} L${f(bx + dy * half)} ${f(by - dx * half)} Z`;
    out += `<path d="${d}" fill="none" stroke="${col}" stroke-width="${f(lw)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    out += `<circle cx="${f(pts[0][0])}" cy="${f(pts[0][1])}" r="${f(lw * 0.78)}" fill="${col}"/>`;
    out += `<path d="${tri}" fill="${col}" stroke="${col}" stroke-width="${f(cs * 0.07)}" stroke-linejoin="round"/>`;
  }
  return out;
}

export function emblem(size: number): string {
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">
<rect x="1" y="1" width="98" height="98" rx="26" fill="#131A36"/>
<rect x="1" y="1" width="98" height="98" rx="26" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/>
${knotPaths(100, 0.17)}
</svg>`;
}
