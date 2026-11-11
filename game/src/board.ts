// Board rules at play time, plus the checks used to grade a generated level.
//
// The one rule of the game: an arrow may leave if every cell in front of its
// head, in a straight line up to the edge of the board, is empty.

import { DX, DY } from './types';
import type { Arrow, Level, LevelStats } from './types';

export interface Probe {
  /** True when the way out is clear. */
  free: boolean;
  /** Empty cells in front of the head before the obstacle (or before the edge). */
  steps: number;
  /** Id of the arrow in the way, or -1. */
  blocker: number;
}

export class Board {
  readonly w: number;
  readonly h: number;
  readonly owner: Int16Array;
  readonly arrows: (Arrow | null)[];
  remaining: number;

  constructor(level: Level) {
    this.w = level.w;
    this.h = level.h;
    this.owner = new Int16Array(level.w * level.h).fill(-1);
    this.arrows = [];
    for (const a of level.arrows) {
      this.arrows[a.id] = a;
      for (const c of a.cells) this.owner[c] = a.id;
    }
    this.remaining = level.arrows.length;
  }

  get(id: number): Arrow | null {
    return this.arrows[id] ?? null;
  }

  /** Looks along the head's line of travel. */
  probe(id: number): Probe {
    const a = this.arrows[id];
    if (!a) return { free: false, steps: 0, blocker: -1 };
    const head = a.cells[a.cells.length - 1];
    let x = head % this.w;
    let y = (head - x) / this.w;
    const dx = DX[a.dir];
    const dy = DY[a.dir];
    let steps = 0;
    for (;;) {
      x += dx;
      y += dy;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return { free: true, steps, blocker: -1 };
      const o = this.owner[y * this.w + x];
      if (o >= 0) return { free: false, steps, blocker: o };
      steps++;
    }
  }

  isFree(id: number): boolean {
    return this.probe(id).free;
  }

  remove(id: number): void {
    const a = this.arrows[id];
    if (!a) return;
    for (const c of a.cells) this.owner[c] = -1;
    this.arrows[id] = null;
    this.remaining--;
  }

  /** Ids of the arrows that can leave right now. */
  freeArrows(): number[] {
    const out: number[] = [];
    for (const a of this.arrows) if (a && this.isFree(a.id)) out.push(a.id);
    return out;
  }

  /** Every arrow standing in the way of this one, not only the first. */
  blockersOf(id: number): number[] {
    const a = this.arrows[id];
    if (!a) return [];
    const head = a.cells[a.cells.length - 1];
    let x = head % this.w;
    let y = (head - x) / this.w;
    const dx = DX[a.dir];
    const dy = DY[a.dir];
    const out: number[] = [];
    for (;;) {
      x += dx;
      y += dy;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) break;
      const o = this.owner[y * this.w + x];
      if (o >= 0 && o !== id && out.indexOf(o) < 0) out.push(o);
    }
    return out;
  }

  /**
   * The free arrow whose departure helps the most: the one that stands in the
   * way of the largest number of others. Used by the hint button.
   */
  bestHint(): number {
    const free = this.freeArrows();
    if (!free.length) return -1;
    const blocks = new Map<number, number>();
    for (const a of this.arrows) {
      if (!a) continue;
      for (const b of this.blockersOf(a.id)) blocks.set(b, (blocks.get(b) ?? 0) + 1);
    }
    let best = free[0];
    let bestScore = -1;
    for (const id of free) {
      const s = blocks.get(id) ?? 0;
      if (s > bestScore) {
        bestScore = s;
        best = id;
      }
    }
    return best;
  }
}

/** Plays the level by brute force: true if every arrow can leave. */
export function isSolvable(level: Level): boolean {
  const b = new Board(level);
  let progress = true;
  while (b.remaining > 0 && progress) {
    progress = false;
    for (const a of level.arrows) {
      if (b.get(a.id) && b.isFree(a.id)) {
        b.remove(a.id);
        progress = true;
      }
    }
  }
  return b.remaining === 0;
}

/** Numbers used to grade how hard a level is. */
export function levelStats(level: Level): LevelStats {
  const b = new Board(level);
  const deps: number[][] = [];
  let free = 0;
  let maxDeps = 0;
  let cells = 0;
  for (const a of level.arrows) {
    const d = b.blockersOf(a.id);
    deps[a.id] = d;
    if (!d.length) free++;
    if (d.length > maxDeps) maxDeps = d.length;
    cells += a.cells.length;
  }
  // Longest chain of "must leave before" links.
  const memo = new Map<number, number>();
  const visiting = new Set<number>();
  const depthOf = (id: number): number => {
    const m = memo.get(id);
    if (m !== undefined) return m;
    if (visiting.has(id)) return 0; // a loop would mean an unsolvable level
    visiting.add(id);
    let d = 1;
    for (const k of deps[id]) d = Math.max(d, 1 + depthOf(k));
    visiting.delete(id);
    memo.set(id, d);
    return d;
  };
  let depth = 0;
  for (const a of level.arrows) depth = Math.max(depth, depthOf(a.id));
  const n = level.arrows.length;
  return {
    arrows: n,
    free,
    freeRatio: n ? free / n : 0,
    depth,
    holes: level.cellCount - cells,
    avgLen: n ? cells / n : 0,
    maxDeps,
  };
}

/** Checks the invariants every level must respect. Returns a list of problems. */
export function validateLevel(level: Level): string[] {
  const problems: string[] = [];
  const seen = new Int16Array(level.w * level.h).fill(-1);
  for (const a of level.arrows) {
    if (a.cells.length < 2) problems.push(`arrow ${a.id}: shorter than 2 cells`);
    for (let i = 0; i < a.cells.length; i++) {
      const c = a.cells[i];
      if (c < 0 || c >= level.w * level.h) problems.push(`arrow ${a.id}: cell off the board`);
      else if (seen[c] >= 0) problems.push(`arrow ${a.id}: cell shared with arrow ${seen[c]}`);
      else seen[c] = a.id;
      if (i > 0) {
        const p = a.cells[i - 1];
        const dx = (c % level.w) - (p % level.w);
        const dy = Math.floor(c / level.w) - Math.floor(p / level.w);
        if (Math.abs(dx) + Math.abs(dy) !== 1) problems.push(`arrow ${a.id}: cells not side by side`);
        if (i === a.cells.length - 1 && (dx !== DX[a.dir] || dy !== DY[a.dir])) {
          problems.push(`arrow ${a.id}: head does not point along its last segment`);
        }
      }
    }
  }
  if (!problems.length && !isSolvable(level)) problems.push('level cannot be solved');
  return problems;
}
