// Game controller: connects the board rules, the canvas, the screens, the
// sounds and the ad bridge.

import { Board } from './board';
import { dayIndex, makeDaily, makeLevel } from './levels';
import { BoardView, THEMES } from './view';
import { Store } from './store';
import type { Settings } from './store';
import { Sfx } from './audio';
import { Native } from './native';
import { UI } from './ui';
import { ICON } from './icons';
import { detectLanguage, language, setLanguage, t } from './i18n';
import './locales';
import type { Level } from './types';

declare const __PRIVACY_URL__: string;

/** Google Play page of the game (shared with friends, used by "Rate Fletch"). */
const STORE_URL = 'https://play.google.com/store/apps/details?id=com.motagames.arrows';
/** Where "Send feedback" writes to (the developer's public contact address). */
const FEEDBACK_EMAIL = 'marcio.m1985@gmail.com';

const HEARTS = 3;
const HINTS_PER_VIDEO = 2;
const MAX_STOCK = 9;
/** No ad break before this many levels are won, then at most one every two levels and 70 s. */
const ADS_AFTER_WINS = 3;
const ADS_EVERY = 2;
const ADS_GAP_MS = 70000;
/** Test hooks are active only with ?debug in the address. */
const DEBUG = new URLSearchParams(location.search).has('debug');

interface Play {
  kind: 'level' | 'daily';
  n: number;
  day: number;
  level: Level;
  board: Board;
  hearts: number;
  mistakes: number;
  combo: number;
  lastOk: number;
  start: number;
  freeHint: boolean;
  total: number;
  done: boolean;
  won: boolean;
  over: boolean;
  guide: boolean;
}

class Game {
  private readonly sfx = new Sfx();
  private readonly native = new Native();
  private readonly store = new Store(
    this.native.bridge ? { load: () => this.native.loadState(), save: (j) => this.native.saveState(j) } : null,
  );
  private readonly ui: UI;
  private readonly view: BoardView;
  private play: Play | null = null;
  private attract = 0;
  private attractBoard: Board | null = null;

  constructor(root: HTMLElement) {
    this.ui = new UI(root, {
      play: () => this.click(() => this.begin('level', this.store.data.level, 0)),
      openDaily: () => this.click(() => this.openDaily()),
      openLevels: () => this.click(() => this.openLevels()),
      openSettings: () => this.click(() => this.openSettings()),
      home: () => this.click(() => this.showHome()),
      restart: () => this.click(() => this.restart()),
      hint: () => this.hint(),
      fit: () => this.view.resetZoom(),
      pickLevel: (n) => this.click(() => this.begin('level', n, 0)),
      playDaily: () => this.click(() => this.begin('daily', 0, this.today())),
      change: (patch) => this.change(patch),
      howTo: () => this.howTo(),
      privacy: (e) => {
        // In the app the shell opens the page; on the web the link works by itself.
        if (this.native.bridge) {
          e.preventDefault();
          this.native.openUrl(__PRIVACY_URL__);
        }
      },
      reset: () => this.askReset(),
      adChoices: () => this.native.showAdChoices(),
      feedback: () => this.feedback(),
      rate: () => this.native.openUrl(STORE_URL),
    });
    this.view = new BoardView(this.ui.canvas);
    this.view.onTap = (id) => this.tap(id);
    this.view.onPeek = () => {
      this.native.haptic('tap');
      const seen = this.store.data.seen;
      if (!seen.peek) {
        seen.peek = true;
        this.store.save();
      }
    };
    this.view.onZoomChange = (z) => this.ui.setFit(z);
    this.view.onSettled = () => this.settled();

    this.native.demoNotice = (kind) =>
      this.ui.veil(t(kind === 'reward' ? 'ad.demo.reward' : 'ad.demo.break'), kind === 'reward' ? 2200 : 1500);
    this.native.onBack = () => this.back();
    this.native.onPause = () => {
      this.sfx.suspend();
      this.store.flush();
    };
    this.native.onResume = () => this.view.invalidate();

    window.addEventListener('resize', () => this.layout());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.back();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.sfx.suspend();
        this.store.flush();
      }
    });
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    this.applySettings();
    this.showHome();
  }

  // ---- helpers ------------------------------------------------------------

  /** Test builds write what happens to the console (read from the device log). */
  private trace(msg: string): void {
    if (DEBUG) console.log('[fletch] ' + msg);
  }

  private click(run: () => void): void {
    this.sfx.unlock();
    this.sfx.click();
    run();
  }

  private today(): number {
    const d = new Date();
    return dayIndex(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  private streak(): number {
    const d = this.store.data.daily;
    const today = this.today();
    return d.last === today || d.last === today - 1 ? d.streak : 0;
  }

  private applySettings(): void {
    const s = this.store.data.settings;
    setLanguage(s.lang === 'auto' ? detectLanguage() : s.lang);
    document.documentElement.dataset.theme = s.theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', s.theme === 'dark' ? '#0C1022' : '#F4F1EA');
    this.view.setTheme(THEMES[s.theme], s.colors === 'mono');
    this.sfx.enabled = s.sound;
    this.native.hapticsOn = s.haptics;
    this.native.setTheme(s.theme === 'dark');
    this.native.setSound(s.sound);
    this.ui.labels();
  }

  private layout(): void {
    const i = this.ui.insets();
    const banner = document.getElementById('banner');
    const extra = banner && !banner.classList.contains('hidden') ? banner.offsetHeight + 10 : 0;
    this.view.setInsets(i.top + extra, i.bottom);
    this.view.resize();
  }

  private banner(text: string | null): void {
    this.ui.banner(text);
    this.layout();
  }

  // ---- screens ------------------------------------------------------------

  private showHome(): void {
    this.play = null;
    this.ui.closeModal(false);
    this.ui.show('home');
    this.ui.renderHome({
      level: this.store.data.level,
      dailyDone: (this.store.data.daily.done[String(this.today())] ?? 0) > 0,
      streak: this.streak(),
    });
    this.view.setInteractive(false);
    this.layout();
    this.view.setDim(this.ui.insets().roomy ? 0.62 : 0.22);
    this.startAttract();
  }

  /** Behind the home screen, a board quietly solves itself. */
  private startAttract(): void {
    this.stopAttract();
    const lvl = makeLevel(16 + Math.floor(Math.random() * 30));
    const board = new Board(lvl);
    this.attractBoard = board;
    this.view.load(lvl, board);
    this.attract = window.setInterval(() => {
      if (document.hidden || this.attractBoard !== board) return;
      const id = board.bestHint();
      const a = id >= 0 ? board.get(id) : null;
      if (!a) {
        this.startAttract();
        return;
      }
      const pr = board.probe(id);
      board.remove(id);
      this.view.exit(a, pr.steps);
    }, 900);
  }

  private stopAttract(): void {
    if (this.attract) window.clearInterval(this.attract);
    this.attract = 0;
    this.attractBoard = null;
  }

  private openLevels(): void {
    this.stopAttract();
    this.ui.show('levels');
    this.ui.renderLevels(this.store.data.level, this.store.data.stars);
  }

  private openSettings(): void {
    this.stopAttract();
    this.ui.show('settings');
    this.ui.renderSettings(this.store.data.settings, this.native.version, __PRIVACY_URL__, this.native.adChoicesRequired());
  }

  private openDaily(): void {
    this.stopAttract();
    const now = new Date();
    const today = this.today();
    const d = this.store.data.daily;
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const firstIdx = dayIndex(now.getFullYear(), now.getMonth() + 1, 1);
    const doneDays: number[] = [];
    for (let k = 1; k <= days; k++) if ((d.done[String(firstIdx + k - 1)] ?? 0) > 0) doneDays.push(k);
    const loc = language();
    let dateLabel: string;
    let monthLabel: string;
    try {
      dateLabel = now.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long' });
      monthLabel = now.toLocaleDateString(loc, { month: 'long', year: 'numeric' });
    } catch {
      dateLabel = now.toDateString();
      monthLabel = String(now.getFullYear());
    }
    this.ui.show('daily');
    this.ui.renderDaily({
      dateLabel,
      done: (d.done[String(today)] ?? 0) > 0,
      streak: this.streak(),
      best: d.best,
      total: Object.keys(d.done).length,
      month: {
        label: monthLabel,
        firstWeekday: (first.getDay() + 6) % 7,
        days,
        doneDays,
        today: now.getDate(),
      },
    });
  }

  private change(patch: Partial<Settings>): void {
    Object.assign(this.store.data.settings, patch);
    this.store.save();
    this.applySettings();
    this.sfx.unlock();
    this.sfx.click();
    this.ui.renderSettings(this.store.data.settings, this.native.version, __PRIVACY_URL__, this.native.adChoicesRequired());
  }

  /** Opens the e-mail app so that a player (or a tester) can send a remark or a bug. */
  private feedback(): void {
    const d = this.store.data;
    const info = `Fletch ${this.native.version} · ${t('feedback.level', { n: d.level })} · ${navigator.language || ''}`;
    this.native.mail(FEEDBACK_EMAIL, t('feedback.subject'), `${t('feedback.body')}\n\n\n---\n${info}`);
  }

  private howTo(): void {
    this.ui.modal({
      title: t('howto.title'),
      lines: [t('howto.1'), t('howto.2'), t('howto.3'), t('howto.peek'), t('howto.4'), t('howto.5')],
      actions: [{ label: t('common.ok'), kind: 'primary', run: () => {} }],
      onDismiss: () => {},
    });
  }

  private askReset(): void {
    this.ui.modal({
      title: t('settings.reset'),
      body: t('settings.reset.ask'),
      actions: [
        {
          label: t('common.erase'),
          kind: 'danger',
          run: () => {
            this.store.reset();
            this.applySettings();
            this.showHome();
          },
        },
        { label: t('common.cancel'), run: () => {} },
      ],
      onDismiss: () => {},
    });
  }

  /** Back button. Returns false when the app itself should close. */
  private back(): boolean {
    if (this.ui.modalOpen) {
      this.ui.closeModal(true);
      return true;
    }
    if (this.ui.current !== 'home') {
      this.showHome();
      return true;
    }
    return false;
  }

  // ---- playing ------------------------------------------------------------

  private begin(kind: 'level' | 'daily', n: number, day: number): void {
    this.stopAttract();
    this.ui.closeModal(false);
    const level = kind === 'level' ? makeLevel(n) : makeDaily(day);
    const board = new Board(level);
    const seen = this.store.data.seen;
    this.play = {
      kind,
      n,
      day,
      level,
      board,
      hearts: HEARTS,
      mistakes: 0,
      combo: 0,
      lastOk: 0,
      start: Date.now(),
      freeHint: true,
      total: level.arrows.length,
      done: false,
      won: false,
      over: false,
      guide: kind === 'level' && n === 1,
    };
    this.trace(`begin ${kind} ${kind === 'level' ? n : day}: ${level.w}x${level.h}, ${level.arrows.length} arrows`);
    this.ui.show('game');
    this.ui.setHud(kind === 'level' ? t('home.level', { n }) : t('home.daily'), kind === 'level' ? level.difficulty : null);
    this.ui.setHearts(HEARTS);
    this.ui.setProgress(0);
    this.refreshHints();
    this.view.setDim(1);
    this.view.setInteractive(true);
    let tip: string | null = null;
    if (this.play.guide) tip = t('tut.1');
    else if (kind === 'level' && n === 2 && !seen.blocked) tip = t('tut.2');
    else if (level.w >= 12 && !seen.zoom) {
      tip = t('tut.3');
      seen.zoom = true;
      this.store.save();
    } else if (kind === 'level' && !seen.peek && (n === 3 || (n > 3 && n % 4 === 0))) {
      // Shown now and then until the player has tried it once.
      tip = t('tut.4');
    }
    this.ui.banner(tip);
    this.layout();
    this.view.load(level, board);
    if (this.play.guide) this.view.setHint(board.bestHint());
  }

  private restart(): void {
    const p = this.play;
    if (p) this.begin(p.kind, p.n, p.day);
  }

  private refreshHints(): void {
    const p = this.play;
    this.ui.setHintCount((p && p.freeHint ? 1 : 0) + this.store.data.hints);
  }

  private tap(id: number): void {
    const p = this.play;
    if (!p || p.done || p.over) return;
    this.sfx.unlock();
    const a = p.board.get(id);
    if (!a) return;
    const pr = p.board.probe(id);
    if (pr.free) {
      p.board.remove(id);
      this.view.exit(a, pr.steps);
      const now = performance.now();
      p.combo = now - p.lastOk < 2600 ? p.combo + 1 : 0;
      p.lastOk = now;
      this.sfx.note(p.combo);
      this.native.haptic('tap');
      this.ui.setProgress(1 - p.board.remaining / p.total);
      if (p.board.remaining === 0) {
        p.done = true;
        this.ui.banner(null);
      } else if (p.guide) {
        this.view.setHint(p.board.bestHint());
      }
      return;
    }
    p.mistakes++;
    p.hearts--;
    p.combo = 0;
    this.view.bump(a, pr.steps, pr.blocker);
    this.sfx.bump();
    this.native.haptic('bump');
    this.ui.setHearts(p.hearts, true);
    const seen = this.store.data.seen;
    if (!seen.blocked) {
      seen.blocked = true;
      this.store.save();
      this.banner(t('tut.2'));
    }
    if (p.hearts <= 0) {
      p.over = true;
      window.setTimeout(() => this.failed(p), 640);
    }
  }

  /** All flying arrows have left the screen. */
  private settled(): void {
    const p = this.play;
    if (p && p.done && !p.won) {
      p.won = true;
      this.won(p);
    }
  }

  private won(p: Play): void {
    const s = this.store.data;
    const stars = Math.max(1, 3 - p.mistakes);
    this.trace(`won ${p.kind} ${p.kind === 'level' ? p.n : p.day} stars=${stars}`);
    const secs = Math.max(1, Math.round((Date.now() - p.start) / 1000));
    let bonus = false;
    if (p.kind === 'level') {
      const key = String(p.n);
      const first = !((s.stars[key] ?? 0) > 0);
      s.stars[key] = Math.max(s.stars[key] ?? 0, stars);
      if (p.n >= s.level) s.level = p.n + 1;
      if (first) {
        s.wins++;
        if (s.wins % 4 === 0 && s.hints < MAX_STOCK) {
          s.hints++;
          bonus = true;
        }
      }
    } else {
      const key = String(p.day);
      const first = !((s.daily.done[key] ?? 0) > 0);
      s.daily.done[key] = Math.max(s.daily.done[key] ?? 0, stars);
      if (first) {
        s.daily.streak = s.daily.last === p.day - 1 ? s.daily.streak + 1 : 1;
        s.daily.last = p.day;
        s.daily.best = Math.max(s.daily.best, s.daily.streak);
      }
    }
    s.ads.since++;
    // Ask for a rating at two happy moments, never more than twice.
    if (p.kind === 'level' && stars === 3 && ((p.n === 8 && s.seen.review < 1) || (p.n === 25 && s.seen.review < 2))) {
      s.seen.review++;
      window.setTimeout(() => this.native.review(), 2600);
    }
    this.store.save();
    this.view.celebrate();
    this.sfx.win();
    this.native.haptic('win');
    const mm = Math.floor(secs / 60);
    const ss = String(secs % 60).padStart(2, '0');
    const lines = [
      p.mistakes ? t('win.mistakes', { n: p.mistakes }) : t('win.perfect'),
      t('win.time', { t: `${mm}:${ss}` }),
    ];
    if (bonus) lines.push(t('win.bonus'));
    window.setTimeout(() => {
      if (this.play !== p) return;
      if (p.kind === 'level') {
        this.ui.modal({
          title: t('win.title'),
          stars,
          lines,
          actions: [
            { label: t('win.next'), kind: 'primary', run: () => void this.next(p.n + 1) },
            {
              label: t('win.share'),
              icon: ICON.share,
              keepOpen: true,
              run: () => this.native.share(t('share.level', { n: p.n, t: `${mm}:${ss}`, s: stars, url: STORE_URL })),
            },
            { label: t('win.home'), run: () => this.showHome() },
          ],
          onDismiss: () => this.showHome(),
        });
      } else {
        this.ui.modal({
          title: t('win.daily'),
          stars,
          lines,
          actions: [
            { label: t('win.home'), kind: 'primary', run: () => this.showHome() },
            {
              label: t('win.share'),
              icon: ICON.share,
              keepOpen: true,
              run: () => this.native.share(t('share.daily', { t: `${mm}:${ss}`, s: stars, url: STORE_URL })),
            },
            { label: t('win.replay'), run: () => this.restart() },
          ],
          onDismiss: () => this.showHome(),
        });
      }
    }, 750);
  }

  private async next(n: number): Promise<void> {
    const s = this.store.data;
    if (s.wins >= ADS_AFTER_WINS && s.ads.since >= ADS_EVERY && Date.now() - s.ads.lastAt > ADS_GAP_MS) {
      s.ads.since = 0;
      s.ads.lastAt = Date.now();
      this.store.save();
      this.trace('ad break: start');
      await this.native.interstitial();
      this.trace('ad break: done');
    }
    this.begin('level', n, 0);
  }

  private failed(p: Play): void {
    if (this.play !== p) return;
    this.sfx.fail();
    const actions = [];
    if (this.native.rewardedReady()) {
      actions.push({
        label: t('fail.continue'),
        kind: 'primary' as const,
        run: () => {
          void this.native.rewarded('heart').then((ok) => {
            if (this.play !== p) return;
            this.trace('video for hearts: ' + (ok ? 'earned' : 'not earned'));
            if (ok) {
              // One video gives all the hearts back, not a single one.
              p.hearts = HEARTS;
              p.over = false;
              this.ui.setHearts(HEARTS);
            } else {
              this.ui.toast(t('ad.unavailable'));
              this.failed(p);
            }
          });
        },
      });
    }
    actions.push({ label: t('fail.retry'), kind: actions.length ? ('ghost' as const) : ('primary' as const), run: () => this.restart() });
    this.ui.modal({ title: t('fail.title'), body: t('fail.body'), actions, onDismiss: () => this.restart() });
  }

  private hint(): void {
    const p = this.play;
    if (!p || p.done || p.over) return;
    this.sfx.unlock();
    const cur = this.view.hint;
    if (cur >= 0 && p.board.get(cur) && p.board.isFree(cur)) {
      this.sfx.hint();
      return;
    }
    const s = this.store.data;
    if (p.freeHint) p.freeHint = false;
    else if (s.hints > 0) {
      s.hints--;
      this.store.save();
    } else {
      this.offerHints(p);
      return;
    }
    this.view.setHint(p.board.bestHint());
    this.sfx.hint();
    this.refreshHints();
  }

  /** Test mode: asks for a rewarded video after a delay and reports the outcome. */
  testVideo(delaySeconds: number): void {
    let tries = 0;
    const attempt = () => {
      tries++;
      const ready = this.native.rewardedReady();
      this.trace(`test video: ready=${ready} try=${tries}`);
      if (!ready && tries < 20) {
        window.setTimeout(attempt, 3000);
        return;
      }
      void this.native.rewarded('test').then((ok) => this.trace('test video: ' + (ok ? 'earned' : 'not earned')));
    };
    window.setTimeout(attempt, delaySeconds * 1000);
  }

  /** Test mode: the game plays itself (used to check the Android build on an emulator). */
  autoplay(delaySeconds: number): void {
    window.setTimeout(() => {
      this.trace('autoplay: start at level ' + this.store.data.level);
      this.begin('level', this.store.data.level, 0);
      window.setInterval(() => {
        if (this.ui.modalOpen) {
          const b = document.querySelector('#sheet .mbtn.primary') as HTMLElement | null;
          if (b) b.click();
          return;
        }
        const p = this.play;
        if (p && !p.done && !p.over) this.tap(p.board.bestHint());
      }, 420);
    }, delaySeconds * 1000);
  }

  private offerHints(p: Play): void {
    const ready = this.native.rewardedReady();
    this.ui.modal({
      title: t('hint.title'),
      body: ready ? t('hint.body') : t('hint.body') + ' ' + t('ad.unavailable') + '.',
      actions: ready
        ? [
            {
              label: t('hint.watch', { n: HINTS_PER_VIDEO }),
              kind: 'primary',
              run: () => {
                void this.native.rewarded('hint').then((ok) => {
                  this.trace('video for hints: ' + (ok ? 'earned' : 'not earned'));
                  if (!ok) {
                    this.ui.toast(t('ad.unavailable'));
                    return;
                  }
                  this.store.data.hints = Math.min(MAX_STOCK, this.store.data.hints + HINTS_PER_VIDEO);
                  this.store.save();
                  this.ui.toast(t('hint.added', { n: HINTS_PER_VIDEO }));
                  this.refreshHints();
                  if (this.play === p) this.hint();
                });
              },
            },
            { label: t('common.close'), run: () => {} },
          ]
        : [{ label: t('common.close'), kind: 'primary', run: () => {} }],
      onDismiss: () => {},
    });
  }
}

const root = document.getElementById('app');
if (root) {
  const game = new Game(root);
  // Test hooks, only with ?debug in the address: automated tests drive the game,
  // and ?debug&autoplay=5 makes it play by itself after 5 seconds.
  if (DEBUG) {
    (window as unknown as { __g: Game }).__g = game;
    const q = new URLSearchParams(location.search);
    const auto = q.get('autoplay');
    if (auto !== null) game.autoplay(Number(auto) || 0);
    const video = q.get('video');
    if (video !== null) game.testVideo(Number(video) || 0);
  }
}
