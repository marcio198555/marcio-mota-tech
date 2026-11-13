// Bridge to the Android shell. In the Android app, ads and vibration are
// handled by native code. In a web browser there are no ads: a short notice
// shows where they would appear (demo), or nothing at all (?ads=off).

interface AndroidBridge {
  showInterstitial(): void;
  showRewarded(tag: string): void;
  rewardedReady(): boolean;
  haptic(kind: string): void;
  openUrl(url: string): void;
  exitApp(): void;
  appVersion(): string;
  /** Copy of the saved game kept by Android, so it survives a reinstall. */
  saveState(json: string): void;
  loadState(): string;
  /** Google's in-app rating sheet. */
  review(): void;
  /** True where the law asks for a way to change ad consent (Europe, Switzerland...). */
  adChoicesRequired(): boolean;
  showAdChoices(): void;
  setTheme(dark: boolean): void;
  /** Game sound on or off, so that ads start muted when the game is muted. */
  setSound(on: boolean): void;
  /** Android share sheet (added in 1.1.0; older shells do not have it). */
  share?(text: string): void;
  /** E-mail app with a message ready to write (added in 1.1.0). */
  mail?(to: string, subject: string, body: string): void;
}

interface FletchCallbacks {
  interstitialDone(): void;
  rewardedDone(earned: boolean): void;
  /** Returns true if the game handled the back button. */
  back(): boolean;
  pause(): void;
  resume(): void;
}

declare global {
  interface Window {
    FletchNative?: AndroidBridge;
    __fletch?: FletchCallbacks;
  }
}

export type AdsMode = 'app' | 'demo' | 'off';

export class Native {
  readonly bridge: AndroidBridge | null;
  readonly mode: AdsMode;
  hapticsOn = true;
  /** Shows the demo notice; set by the UI. Resolves when the notice closes. */
  demoNotice: (kind: 'reward' | 'break') => Promise<void> = () => Promise.resolve();
  onBack: () => boolean = () => false;
  onPause: () => void = () => {};
  onResume: () => void = () => {};

  private interDone: (() => void) | null = null;
  private rewardDone: ((earned: boolean) => void) | null = null;

  constructor() {
    this.bridge = window.FletchNative ?? null;
    const q = new URLSearchParams(location.search);
    if (this.bridge) this.mode = 'app';
    else this.mode = q.get('ads') === 'off' ? 'off' : 'demo';
    window.__fletch = {
      interstitialDone: () => {
        const f = this.interDone;
        this.interDone = null;
        if (f) f();
      },
      rewardedDone: (earned: boolean) => {
        const f = this.rewardDone;
        this.rewardDone = null;
        if (f) f(!!earned);
      },
      back: () => this.onBack(),
      pause: () => this.onPause(),
      resume: () => this.onResume(),
    };
  }

  get version(): string {
    try {
      return this.bridge ? this.bridge.appVersion() : '1.0.0';
    } catch {
      return '1.0.0';
    }
  }

  /** Full-screen ad between two levels. Always resolves, ad or no ad. */
  interstitial(): Promise<void> {
    if (this.mode === 'off') return Promise.resolve();
    if (this.mode === 'demo') return this.demoNotice('break');
    return new Promise<void>((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        this.interDone = null;
        resolve();
      };
      this.interDone = finish;
      try {
        (this.bridge as AndroidBridge).showInterstitial();
      } catch {
        finish();
      }
      // Last resort if the shell never answers (it has its own, much faster, safety nets).
      window.setTimeout(finish, 300000);
    });
  }

  rewardedReady(): boolean {
    if (this.mode === 'off') return false;
    if (this.mode === 'demo') return true;
    try {
      return (this.bridge as AndroidBridge).rewardedReady();
    } catch {
      return false;
    }
  }

  /** Video the player chose to watch. Resolves true if the reward is earned. */
  rewarded(tag: string): Promise<boolean> {
    if (this.mode === 'off') return Promise.resolve(false);
    if (this.mode === 'demo') return this.demoNotice('reward').then(() => true);
    return new Promise<boolean>((resolve) => {
      let done = false;
      const finish = (earned: boolean) => {
        if (done) return;
        done = true;
        this.rewardDone = null;
        resolve(earned);
      };
      this.rewardDone = finish;
      try {
        (this.bridge as AndroidBridge).showRewarded(tag);
      } catch {
        finish(false);
      }
      window.setTimeout(() => finish(false), 300000);
    });
  }

  haptic(kind: 'tap' | 'bump' | 'win'): void {
    if (!this.hapticsOn) return;
    try {
      if (this.bridge) {
        this.bridge.haptic(kind);
      } else if (navigator.vibrate) {
        navigator.vibrate(kind === 'tap' ? 8 : kind === 'bump' ? [18, 40, 28] : [14, 50, 14, 50, 30]);
      }
    } catch {
      /* no vibration: fine */
    }
  }

  openUrl(url: string): void {
    try {
      if (this.bridge) this.bridge.openUrl(url);
      else window.open(url, '_blank', 'noopener');
    } catch {
      /* ignore */
    }
  }

  exitApp(): void {
    try {
      this.bridge?.exitApp();
    } catch {
      /* ignore */
    }
  }

  saveState(json: string): void {
    try {
      this.bridge?.saveState(json);
    } catch {
      /* ignore */
    }
  }

  loadState(): string {
    try {
      return this.bridge ? this.bridge.loadState() || '' : '';
    } catch {
      return '';
    }
  }

  review(): void {
    try {
      this.bridge?.review();
    } catch {
      /* ignore */
    }
  }

  adChoicesRequired(): boolean {
    try {
      return this.bridge ? !!this.bridge.adChoicesRequired() : false;
    } catch {
      return false;
    }
  }

  showAdChoices(): void {
    try {
      this.bridge?.showAdChoices();
    } catch {
      /* ignore */
    }
  }

  setTheme(dark: boolean): void {
    try {
      this.bridge?.setTheme(dark);
    } catch {
      /* ignore */
    }
  }

  setSound(on: boolean): void {
    try {
      this.bridge?.setSound(on);
    } catch {
      /* ignore */
    }
  }

  /** Opens the share sheet with a ready-made message. */
  share(text: string): void {
    try {
      if (this.bridge && typeof this.bridge.share === 'function') {
        this.bridge.share(text);
        return;
      }
      const nav = navigator as Navigator & { share?: (d: { text: string }) => Promise<void> };
      if (nav.share) {
        nav.share({ text }).catch(() => undefined);
        return;
      }
      navigator.clipboard?.writeText(text).catch(() => undefined);
    } catch {
      /* nothing to share with: fine */
    }
  }

  /** Opens the e-mail app with the address and subject filled in. */
  mail(to: string, subject: string, body: string): void {
    try {
      if (this.bridge && typeof this.bridge.mail === 'function') {
        this.bridge.mail(to, subject, body);
        return;
      }
      if (!this.bridge) {
        location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    } catch {
      /* no e-mail app: fine */
    }
  }
}
