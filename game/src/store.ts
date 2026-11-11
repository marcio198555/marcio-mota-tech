// Saved progress and settings. Everything stays on the device.

export interface Settings {
  sound: boolean;
  haptics: boolean;
  theme: 'dark' | 'light';
  colors: 'dir' | 'mono';
  /** 'auto' or a language code. */
  lang: string;
}

export interface Save {
  v: 1;
  /** Next level to play: the highest one unlocked. */
  level: number;
  /** Best stars per finished level. */
  stars: Record<string, number>;
  /** Extra hints earned (the free hint of each level is not counted here). */
  hints: number;
  /** Levels finished for the first time. */
  wins: number;
  settings: Settings;
  daily: {
    /** Day index -> stars. */
    done: Record<string, number>;
    streak: number;
    best: number;
    last: number;
  };
  seen: { blocked: boolean; zoom: boolean; review: number };
  ads: { lastAt: number; since: number };
}

const KEY = 'fletch.save.v1';

function defaults(): Save {
  return {
    v: 1,
    level: 1,
    stars: {},
    hints: 2,
    wins: 0,
    settings: { sound: true, haptics: true, theme: 'dark', colors: 'dir', lang: 'auto' },
    daily: { done: {}, streak: 0, best: 0, last: -1 },
    seen: { blocked: false, zoom: false, review: 0 },
    ads: { lastAt: 0, since: 0 },
  };
}

export interface Mirror {
  load(): string;
  save(json: string): void;
}

export class Store {
  data: Save;
  private timer = 0;
  private readonly mirror: Mirror | null;

  /** `mirror` is a second copy kept by the Android app (it is part of the phone backup). */
  constructor(mirror: Mirror | null = null) {
    this.mirror = mirror;
    this.data = defaults();
    try {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(KEY);
      } catch {
        raw = null;
      }
      if (!raw && mirror) raw = mirror.load() || null;
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Save>;
        const d = defaults();
        this.data = {
          ...d,
          ...parsed,
          settings: { ...d.settings, ...(parsed.settings ?? {}) },
          daily: { ...d.daily, ...(parsed.daily ?? {}) },
          seen: { ...d.seen, ...(parsed.seen ?? {}) },
          ads: { ...d.ads, ...(parsed.ads ?? {}) },
          stars: { ...(parsed.stars ?? {}) },
        };
        if (!(this.data.level >= 1)) this.data.level = 1;
        if (!(this.data.hints >= 0)) this.data.hints = 0;
      }
    } catch {
      // Unreadable or blocked storage: start fresh, keep playing.
      this.data = defaults();
    }
  }

  /** Writes soon, grouping quick successive changes into one write. */
  save(): void {
    if (this.timer) return;
    this.timer = window.setTimeout(() => {
      this.timer = 0;
      this.flush();
    }, 250);
  }

  flush(): void {
    const json = JSON.stringify(this.data);
    try {
      localStorage.setItem(KEY, json);
    } catch {
      // Storage full or blocked: progress simply is not kept here.
    }
    if (this.mirror) this.mirror.save(json);
  }

  reset(): void {
    const keep = this.data.settings;
    this.data = defaults();
    this.data.settings = keep;
    this.flush();
  }
}
