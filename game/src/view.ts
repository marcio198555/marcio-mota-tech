// Draws the board on a canvas and turns touches into taps on arrows.
// The canvas is only redrawn while something moves, to spare the battery.

import { Board } from './board';
import { DX, DY } from './types';
import type { Arrow, Level } from './types';

export interface Theme {
  dirs: readonly [string, string, string, string];
  mono: string;
  dot: string;
  danger: string;
  hint: string;
  spark: readonly string[];
}

export const THEMES: Record<'dark' | 'light', Theme> = {
  dark: {
    dirs: ['#58C4FF', '#FFD166', '#FF6B8B', '#5FE3A1'],
    mono: '#E6ECFF',
    dot: 'rgba(160,178,230,0.20)',
    danger: '#FF4558',
    hint: '#FFFFFF',
    spark: ['#58C4FF', '#FFD166', '#FF6B8B', '#5FE3A1', '#FFFFFF'],
  },
  light: {
    dirs: ['#1273C4', '#B87400', '#D42F5C', '#0B8F62'],
    mono: '#232B45',
    dot: 'rgba(40,52,96,0.20)',
    danger: '#D81E34',
    hint: '#141A2E',
    spark: ['#1273C4', '#B87400', '#D42F5C', '#0B8F62', '#232B45'],
  },
};

interface ExitAnim {
  a: Arrow;
  t0: number;
  dur: number;
  steps: number;
  total: number;
  color: string;
  rippled: boolean;
}

interface BumpAnim {
  a: Arrow;
  t0: number;
  dur: number;
  reach: number;
  blocker: number;
}

interface Ripple {
  x: number;
  y: number;
  t0: number;
  color: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  t0: number;
  life: number;
  color: string;
  size: number;
}

const PAD = 14;
const MAX_CELL = 58;
const MAX_ZOOM = 3.5;
/** A finger held this long on an arrow shows its path instead of firing it. */
const PEEK_MS = 320;

export class BoardView {
  onTap: (id: number) => void = () => {};
  /** Called when a held finger starts showing the path of an arrow. */
  onPeek: (id: number) => void = () => {};
  onZoomChange: (zoomed: boolean) => void = () => {};
  /** Called when the last flying arrow has left the screen. */
  onSettled: () => void = () => {};

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private level: Level | null = null;
  private board: Board | null = null;
  private theme: Theme = THEMES.dark;
  private mono = false;

  private vw = 0;
  private vh = 0;
  private dpr = 1;
  private insetTop = 0;
  private insetBottom = 0;
  private cell = 20;
  private zoom = 1;
  private panX = 0;
  private panY = 0;

  private dots: number[] = [];
  private exits: ExitAnim[] = [];
  private bumps: BumpAnim[] = [];
  private ripples: Ripple[] = [];
  private sparks: Spark[] = [];
  private hintId = -1;
  private raf = 0;
  private dirty = true;
  private interactive = true;

  private readonly pointers = new Map<number, { x: number; y: number }>();
  private tapStart: { x: number; y: number; t: number; id: number } | null = null;
  private moved = false;
  private pinch: { dist: number; zoom: number } | null = null;
  private peekTimer = 0;
  private peeking = false;
  private peekId = -1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.addEventListener('pointerdown', (e) => this.down(e));
    canvas.addEventListener('pointermove', (e) => this.move(e));
    canvas.addEventListener('pointerup', (e) => this.up(e));
    canvas.addEventListener('pointercancel', (e) => this.cancel(e));
    canvas.addEventListener('wheel', (e) => this.wheel(e), { passive: false });
  }

  // ---- set-up -------------------------------------------------------------

  setTheme(theme: Theme, mono: boolean): void {
    this.theme = theme;
    this.mono = mono;
    this.invalidate();
  }

  setInsets(top: number, bottom: number): void {
    this.insetTop = top;
    this.insetBottom = bottom;
    this.layout();
  }

  /** 1 = normal, lower = faded (used behind the home screen). */
  setDim(alpha: number): void {
    this.canvas.style.opacity = String(alpha);
  }

  setInteractive(on: boolean): void {
    this.interactive = on;
    if (!on) this.endPeek();
  }

  load(level: Level, board: Board): void {
    this.level = level;
    this.board = board;
    this.exits = [];
    this.bumps = [];
    this.ripples = [];
    this.sparks = [];
    this.hintId = -1;
    this.endPeek();
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.dots = [];
    for (const a of level.arrows) for (const c of a.cells) this.dots.push(c);
    this.onZoomChange(false);
    this.layout();
  }

  resize(): void {
    const r = this.canvas.getBoundingClientRect();
    this.vw = Math.max(1, r.width);
    this.vh = Math.max(1, r.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 3);
    const w = Math.round(this.vw * this.dpr);
    const h = Math.round(this.vh * this.dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.layout();
  }

  private layout(): void {
    if (!this.level) return;
    const availW = this.vw - 2 * PAD;
    const availH = this.vh - this.insetTop - this.insetBottom - 2 * PAD;
    this.cell = Math.max(4, Math.min(availW / this.level.w, availH / this.level.h, MAX_CELL));
    this.clampPan();
    this.invalidate();
  }

  // ---- coordinates --------------------------------------------------------

  private get cx(): number {
    return this.vw / 2;
  }

  private get cy(): number {
    return this.insetTop + (this.vh - this.insetTop - this.insetBottom) / 2;
  }

  /** Screen x of a position given in cells (cell centres are at .5). */
  private sx(bx: number): number {
    const bw = this.cell * (this.level as Level).w;
    return this.cx + this.panX + (bx * this.cell - bw / 2) * this.zoom;
  }

  private sy(by: number): number {
    const bh = this.cell * (this.level as Level).h;
    return this.cy + this.panY + (by * this.cell - bh / 2) * this.zoom;
  }

  private bx(px: number): number {
    const bw = this.cell * (this.level as Level).w;
    return ((px - this.cx - this.panX) / this.zoom + bw / 2) / this.cell;
  }

  private by(py: number): number {
    const bh = this.cell * (this.level as Level).h;
    return ((py - this.cy - this.panY) / this.zoom + bh / 2) / this.cell;
  }

  private clampPan(): void {
    if (!this.level) return;
    if (this.zoom <= 1.001) {
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
      return;
    }
    const availW = this.vw - 2 * PAD;
    const availH = this.vh - this.insetTop - this.insetBottom - 2 * PAD;
    const maxX = Math.max(0, (this.cell * this.level.w * this.zoom - availW) / 2 + 24);
    const maxY = Math.max(0, (this.cell * this.level.h * this.zoom - availH) / 2 + 24);
    this.panX = Math.max(-maxX, Math.min(maxX, this.panX));
    this.panY = Math.max(-maxY, Math.min(maxY, this.panY));
  }

  get zoomed(): boolean {
    return this.zoom > 1.001;
  }

  resetZoom(): void {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.onZoomChange(false);
    this.invalidate();
  }

  private zoomAt(px: number, py: number, z: number): void {
    const before = this.zoomed;
    const fx = this.bx(px);
    const fy = this.by(py);
    this.zoom = Math.max(1, Math.min(MAX_ZOOM, z));
    const lvl = this.level as Level;
    this.panX = px - this.cx - (fx * this.cell - (this.cell * lvl.w) / 2) * this.zoom;
    this.panY = py - this.cy - (fy * this.cell - (this.cell * lvl.h) / 2) * this.zoom;
    this.clampPan();
    if (before !== this.zoomed) this.onZoomChange(this.zoomed);
    this.invalidate();
  }

  // ---- input --------------------------------------------------------------

  private pos(e: PointerEvent | WheelEvent): { x: number; y: number } {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private down(e: PointerEvent): void {
    if (!this.interactive || !this.level) return;
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch {
      /* not supported: fine */
    }
    const p = this.pos(e);
    this.pointers.set(e.pointerId, p);
    if (this.pointers.size === 1) {
      this.tapStart = { x: p.x, y: p.y, t: performance.now(), id: e.pointerId };
      this.moved = false;
      this.pinch = null;
      this.endPeek();
      this.peekTimer = window.setTimeout(() => this.startPeek(), PEEK_MS);
    } else if (this.pointers.size === 2) {
      this.endPeek();
      this.tapStart = null;
      const [a, b] = Array.from(this.pointers.values());
      this.pinch = { dist: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), zoom: this.zoom };
    }
  }

  private move(e: PointerEvent): void {
    const prev = this.pointers.get(e.pointerId);
    if (!prev || !this.level) return;
    const p = this.pos(e);
    this.pointers.set(e.pointerId, p);
    if (this.pointers.size === 1) {
      if (this.peeking) {
        // Looking mode: the finger slides from arrow to arrow, nothing fires.
        this.setPeek(this.pick(p.x, p.y));
        return;
      }
      if (this.tapStart && Math.hypot(p.x - this.tapStart.x, p.y - this.tapStart.y) > 10) {
        this.moved = true;
        window.clearTimeout(this.peekTimer);
      }
      if (this.moved && this.zoomed) {
        this.panX += p.x - prev.x;
        this.panY += p.y - prev.y;
        this.clampPan();
        this.invalidate();
      }
    } else if (this.pointers.size === 2 && this.pinch) {
      const [a, b] = Array.from(this.pointers.values());
      const dist = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
      this.zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, (this.pinch.zoom * dist) / this.pinch.dist);
    }
  }

  private up(e: PointerEvent): void {
    const had = this.pointers.has(e.pointerId);
    this.pointers.delete(e.pointerId);
    if (!had || !this.level) return;
    const ts = this.tapStart;
    const looked = this.peeking;
    this.endPeek();
    if (
      ts &&
      ts.id === e.pointerId &&
      !looked &&
      !this.moved &&
      this.pointers.size === 0 &&
      performance.now() - ts.t < 700
    ) {
      const p = this.pos(e);
      const id = this.pick(p.x, p.y);
      if (id >= 0) this.onTap(id);
    }
    if (this.pointers.size < 2) this.pinch = null;
    if (this.pointers.size === 0) this.tapStart = null;
  }

  private cancel(e: PointerEvent): void {
    this.pointers.delete(e.pointerId);
    this.pinch = null;
    this.tapStart = null;
    this.endPeek();
  }

  /** The finger has stayed still on the board: show the path instead of firing. */
  private startPeek(): void {
    const ts = this.tapStart;
    if (!ts || this.moved || this.pointers.size !== 1 || !this.interactive) return;
    const p = this.pointers.get(ts.id);
    if (!p) return;
    this.peeking = true;
    this.setPeek(this.pick(p.x, p.y));
  }

  private setPeek(id: number): void {
    if (id === this.peekId) return;
    this.peekId = id;
    if (id >= 0) this.onPeek(id);
    this.invalidate();
  }

  private endPeek(): void {
    window.clearTimeout(this.peekTimer);
    this.peeking = false;
    if (this.peekId >= 0) {
      this.peekId = -1;
      this.invalidate();
    }
  }

  /** The arrow whose path is being shown, or -1. */
  get peek(): number {
    return this.peekId;
  }

  private wheel(e: WheelEvent): void {
    if (!this.interactive || !this.level) return;
    e.preventDefault();
    const p = this.pos(e);
    this.zoomAt(p.x, p.y, this.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
  }

  /** Distance, in cells, from a point to the drawn shape of an arrow. */
  private distTo(a: Arrow, px: number, py: number): number {
    const w = (this.level as Level).w;
    let best = Infinity;
    const seg = (x1: number, y1: number, x2: number, y2: number) => {
      const vx = x2 - x1;
      const vy = y2 - y1;
      const len2 = vx * vx + vy * vy;
      let u = len2 ? ((px - x1) * vx + (py - y1) * vy) / len2 : 0;
      u = Math.max(0, Math.min(1, u));
      const d = Math.hypot(px - (x1 + u * vx), py - (y1 + u * vy));
      if (d < best) best = d;
    };
    let lx = (a.cells[0] % w) + 0.5;
    let ly = Math.floor(a.cells[0] / w) + 0.5;
    for (let i = 1; i < a.cells.length; i++) {
      const x = (a.cells[i] % w) + 0.5;
      const y = Math.floor(a.cells[i] / w) + 0.5;
      seg(lx, ly, x, y);
      lx = x;
      ly = y;
    }
    seg(lx, ly, lx + DX[a.dir] * 0.42, ly + DY[a.dir] * 0.42);
    return best;
  }

  /**
   * Which arrow a touch means. A touch clearly on an arrow picks that arrow.
   * A touch between two arrows picks the one that can leave, so that a fat
   * finger on a dense board does not cost a heart.
   */
  pick(px: number, py: number): number {
    const lvl = this.level;
    const board = this.board;
    if (!lvl || !board) return -1;
    const fx = this.bx(px);
    const fy = this.by(py);
    const cx = Math.floor(fx);
    const cy = Math.floor(fy);
    const cs = this.cell * this.zoom;
    const radius = Math.max(0.6, 18 / cs);
    const reach = Math.ceil(radius);
    const seen: number[] = [];
    let direct = -1;
    for (let y = cy - reach; y <= cy + reach; y++) {
      for (let x = cx - reach; x <= cx + reach; x++) {
        if (x < 0 || y < 0 || x >= lvl.w || y >= lvl.h) continue;
        const o = board.owner[y * lvl.w + x];
        if (o < 0) continue;
        if (x === cx && y === cy) direct = o;
        if (seen.indexOf(o) < 0) seen.push(o);
      }
    }
    if (direct >= 0) {
      const a = board.get(direct);
      if (a && this.distTo(a, fx, fy) <= 0.24) return direct;
    }
    let best = -1;
    let bestD = Infinity;
    let bestFree = -1;
    let bestFreeD = Infinity;
    for (const id of seen) {
      const a = board.get(id);
      if (!a) continue;
      const d = this.distTo(a, fx, fy);
      if (d > radius) continue;
      if (d < bestD) {
        bestD = d;
        best = id;
      }
      if (d < bestFreeD && board.isFree(id)) {
        bestFreeD = d;
        bestFree = id;
      }
    }
    if (bestFree >= 0 && bestFreeD <= bestD + 0.45) return bestFree;
    return best;
  }

  // ---- animations ---------------------------------------------------------

  private colorOf(a: Arrow): string {
    return this.mono ? this.theme.mono : this.theme.dirs[a.dir];
  }

  /** The arrow is already gone from the board: play its flight out. */
  exit(a: Arrow, steps: number): void {
    const total = steps + a.cells.length + 2.5;
    this.exits.push({
      a,
      t0: performance.now(),
      dur: Math.min(620, 230 + total * 17),
      steps,
      total,
      color: this.colorOf(a),
      rippled: false,
    });
    if (this.hintId === a.id) this.hintId = -1;
    this.invalidate();
  }

  /** The arrow hits what blocks it and springs back. */
  bump(a: Arrow, steps: number, blocker: number): void {
    this.bumps = this.bumps.filter((b) => b.a.id !== a.id);
    this.bumps.push({ a, t0: performance.now(), dur: 430, reach: steps + 0.22, blocker });
    this.invalidate();
  }

  setHint(id: number): void {
    this.hintId = id;
    this.invalidate();
  }

  get hint(): number {
    return this.hintId;
  }

  get flying(): boolean {
    return this.exits.length > 0;
  }

  celebrate(): void {
    const now = performance.now();
    const colors = this.theme.spark;
    for (let i = 0; i < 46; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = 140 + Math.random() * 360;
      this.sparks.push({
        x: this.cx + (Math.random() - 0.5) * 40,
        y: this.cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - 160,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 9,
        t0: now + Math.random() * 120,
        life: 900 + Math.random() * 500,
        color: colors[i % colors.length],
        size: 7 + Math.random() * 8,
      });
    }
    this.invalidate();
  }

  invalidate(): void {
    this.dirty = true;
    if (!this.raf) this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private frame(now: number): void {
    this.raf = 0;
    const active = this.draw(now);
    if (active || this.dirty) this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  // ---- drawing ------------------------------------------------------------

  /** Draws one arrow whose tail has travelled `offset` cells along its track. */
  private snake(a: Arrow, offset: number, color: string, alpha: number, glow: number, glowColor?: string): void {
    const ctx = this.ctx;
    const w = (this.level as Level).w;
    const n = a.cells.length;
    const cs = this.cell * this.zoom;
    const dx = DX[a.dir];
    const dy = DY[a.dir];
    const hx = (a.cells[n - 1] % w) + 0.5;
    const hy = Math.floor(a.cells[n - 1] / w) + 0.5;
    const nodeX = (i: number) => (i < n ? (a.cells[i] % w) + 0.5 : hx + (i - (n - 1)) * dx);
    const nodeY = (i: number) => (i < n ? Math.floor(a.cells[i] / w) + 0.5 : hy + (i - (n - 1)) * dy);

    const s0 = offset;
    const s1 = offset + n - 1;
    const i0 = Math.floor(s0);
    const f0 = s0 - i0;
    const i1 = Math.floor(s1);
    const f1 = s1 - i1;
    const tailX = nodeX(i0) + (nodeX(i0 + 1) - nodeX(i0)) * f0;
    const tailY = nodeY(i0) + (nodeY(i0 + 1) - nodeY(i0)) * f0;
    const endX = nodeX(i1) + (nodeX(i1 + 1) - nodeX(i1)) * f1;
    const endY = nodeY(i1) + (nodeY(i1 + 1) - nodeY(i1)) * f1;

    const lw = Math.max(2, cs * 0.27);
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const trace = () => {
      ctx.beginPath();
      ctx.moveTo(this.sx(tailX), this.sy(tailY));
      for (let i = i0 + 1; i <= i1; i++) ctx.lineTo(this.sx(nodeX(i)), this.sy(nodeY(i)));
      ctx.lineTo(this.sx(endX), this.sy(endY));
    };
    const head = (grow: number) => {
      const tipX = this.sx(endX + dx * 0.42);
      const tipY = this.sy(endY + dy * 0.42);
      const baseX = this.sx(endX - dx * 0.1);
      const baseY = this.sy(endY - dy * 0.1);
      const half = cs * 0.31 + grow;
      ctx.beginPath();
      ctx.moveTo(tipX + dx * grow, tipY + dy * grow);
      ctx.lineTo(baseX - dy * half, baseY + dx * half);
      ctx.lineTo(baseX + dy * half, baseY - dx * half);
      ctx.closePath();
    };

    if (glow > 0) {
      ctx.globalAlpha = alpha * (0.28 + 0.3 * glow);
      ctx.strokeStyle = glowColor ?? this.theme.hint;
      ctx.fillStyle = glowColor ?? this.theme.hint;
      ctx.lineWidth = lw + cs * (0.2 + 0.16 * glow);
      trace();
      ctx.stroke();
      head(cs * (0.1 + 0.08 * glow));
      ctx.fill();
      ctx.globalAlpha = alpha;
    }

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lw;
    trace();
    ctx.stroke();
    // The tail ends in a small bead, so both ends are easy to tell apart.
    ctx.beginPath();
    ctx.arc(this.sx(tailX), this.sy(tailY), lw * 0.78, 0, Math.PI * 2);
    ctx.fill();
    head(0);
    ctx.lineWidth = Math.max(1, cs * 0.07);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  /** Returns true while something is still moving. */
  private draw(now: number): boolean {
    this.dirty = false;
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.vw, this.vh);
    const lvl = this.level;
    const board = this.board;
    if (!lvl || !board) return false;
    const cs = this.cell * this.zoom;
    const w = lvl.w;

    // Faint dots mark the cells, so the outline of the board stays visible.
    ctx.fillStyle = this.theme.dot;
    const r = Math.max(1, cs * 0.05);
    ctx.beginPath();
    for (const c of this.dots) {
      const x = this.sx((c % w) + 0.5);
      const y = this.sy(Math.floor(c / w) + 0.5);
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.fill();

    const bumping = new Map<number, BumpAnim>();
    const struck = new Set<number>();
    this.bumps = this.bumps.filter((b) => now - b.t0 < b.dur && board.get(b.a.id));
    for (const b of this.bumps) {
      bumping.set(b.a.id, b);
      struck.add(b.blocker);
    }

    // Path preview: the arrow under a held finger, and what stands in its way.
    let looked: Arrow | null = this.peekId >= 0 ? (board.get(this.peekId) ?? null) : null;
    if (looked && bumping.has(looked.id)) looked = null;
    const probe = looked ? board.probe(looked.id) : null;
    if (probe && !probe.free) struck.add(probe.blocker);

    const pulse = this.hintId >= 0 ? 0.5 + 0.5 * Math.sin(now / 190) : 0;
    for (const a of board.arrows) {
      if (!a || bumping.has(a.id)) continue;
      const color = struck.has(a.id) ? this.theme.danger : this.colorOf(a);
      let glow = a.id === this.hintId ? 0.4 + 0.6 * pulse : 0;
      let glowColor: string | undefined;
      if (looked && a.id === looked.id) glow = Math.max(glow, 0.75);
      if (probe && !probe.free && a.id === probe.blocker) {
        // What stands in the way glows red.
        glow = 0.55 + 0.35 * Math.sin(now / 170);
        glowColor = this.theme.danger;
      }
      this.snake(a, 0, color, 1, glow, glowColor);
    }
    if (looked && probe) this.path(looked, probe.free, probe.steps, now);

    for (const b of this.bumps) {
      const u = (now - b.t0) / b.dur;
      let s: number;
      if (u < 0.34) {
        const k = u / 0.34;
        s = b.reach * (1 - (1 - k) * (1 - k));
      } else {
        const k = (u - 0.34) / 0.66;
        s = b.reach * (1 - k) * (1 - k) * (1 + 0.5 * Math.sin(k * Math.PI * 3) * (1 - k));
      }
      this.snake(b.a, Math.max(0, s), this.theme.danger, 1, 0);
    }

    const exits: ExitAnim[] = [];
    for (const e of this.exits) {
      const u = (now - e.t0) / e.dur;
      if (u >= 1) continue;
      exits.push(e);
      const s = e.total * u * u;
      const out = e.steps + 0.6;
      const alpha = s <= out ? 1 : Math.max(0, 1 - (s - out) / (e.total - out));
      this.snake(e.a, s, e.color, alpha, 0);
      if (!e.rippled && s >= out) {
        e.rippled = true;
        const n = e.a.cells.length;
        const hx = (e.a.cells[n - 1] % w) + 0.5 + DX[e.a.dir] * (e.steps + 0.5);
        const hy = Math.floor(e.a.cells[n - 1] / w) + 0.5 + DY[e.a.dir] * (e.steps + 0.5);
        this.ripples.push({ x: hx, y: hy, t0: now, color: e.color });
      }
    }
    const wasFlying = this.exits.length > 0;
    this.exits = exits;

    this.ripples = this.ripples.filter((p) => now - p.t0 < 420);
    for (const p of this.ripples) {
      const u = (now - p.t0) / 420;
      ctx.globalAlpha = (1 - u) * 0.7;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(1.5, cs * 0.09 * (1 - u));
      ctx.beginPath();
      ctx.arc(this.sx(p.x), this.sy(p.y), cs * (0.2 + 0.75 * u), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    this.sparks = this.sparks.filter((p) => now - p.t0 < p.life);
    for (const p of this.sparks) {
      const age = (now - p.t0) / 1000;
      if (age < 0) continue;
      const u = (now - p.t0) / p.life;
      const x = p.x + p.vx * age;
      const y = p.y + p.vy * age + 420 * age * age;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p.rot + p.vr * age);
      ctx.globalAlpha = Math.max(0, 1 - u * u);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.size, 0);
      ctx.lineTo(-p.size * 0.6, p.size * 0.62);
      ctx.lineTo(-p.size * 0.25, 0);
      ctx.lineTo(-p.size * 0.6, -p.size * 0.62);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    if (wasFlying && !this.exits.length) this.onSettled();
    return (
      this.exits.length > 0 ||
      this.bumps.length > 0 ||
      this.ripples.length > 0 ||
      this.sparks.length > 0 ||
      this.hintId >= 0 ||
      this.peekId >= 0
    );
  }

  /** Dashes running from the head of an arrow to the edge, or to what blocks it. */
  private path(a: Arrow, free: boolean, steps: number, now: number): void {
    const ctx = this.ctx;
    const w = (this.level as Level).w;
    const cs = this.cell * this.zoom;
    const n = a.cells.length;
    const hx = (a.cells[n - 1] % w) + 0.5;
    const hy = Math.floor(a.cells[n - 1] / w) + 0.5;
    const dx = DX[a.dir];
    const dy = DY[a.dir];
    const from = 0.66;
    // Free: the dashes run past the edge of the board. Blocked: they stop at the obstacle.
    const to = free ? steps + 1.15 : steps + 0.5;
    const color = free ? this.theme.hint : this.theme.danger;
    const dash = Math.max(3, cs * 0.17);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(2, cs * 0.085);
    if (to > from + 0.05) {
      ctx.globalAlpha = 0.9;
      ctx.setLineDash([dash, dash * 1.25]);
      ctx.lineDashOffset = -((now / 26) % (dash * 2.25));
      ctx.beginPath();
      ctx.moveTo(this.sx(hx + dx * from), this.sy(hy + dy * from));
      ctx.lineTo(this.sx(hx + dx * to), this.sy(hy + dy * to));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
    const ex = this.sx(hx + dx * to);
    const ey = this.sy(hy + dy * to);
    if (free) {
      // A small open chevron: the way out.
      const k = cs * 0.2;
      ctx.beginPath();
      ctx.moveTo(ex - dx * k + dy * k, ey - dy * k + dx * k);
      ctx.lineTo(ex + dx * k * 0.35, ey + dy * k * 0.35);
      ctx.lineTo(ex - dx * k - dy * k, ey - dy * k - dx * k);
      ctx.stroke();
    } else {
      // A bar across the way: the obstacle.
      const k = cs * 0.3;
      ctx.lineWidth = Math.max(2.5, cs * 0.12);
      ctx.beginPath();
      ctx.moveTo(ex + dy * k, ey + dx * k);
      ctx.lineTo(ex - dy * k, ey - dx * k);
      ctx.stroke();
    }
    ctx.restore();
  }
}
