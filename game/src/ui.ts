// Everything that is not the board: screens, bars, dialogs. Plain DOM.

import { BRAND, LANGS, t } from './i18n';
import { ICON, emblem } from './icons';
import type { Settings } from './store';
import type { Difficulty } from './types';

export type Screen = 'home' | 'game' | 'levels' | 'daily' | 'settings';

export interface ModalAction {
  label: string;
  kind?: 'primary' | 'ghost' | 'danger';
  icon?: string;
  run: () => void;
}

export interface ModalOptions {
  title: string;
  body?: string;
  stars?: number;
  lines?: string[];
  actions: ModalAction[];
  /** Called when the dialog is closed by the back button or a tap outside. */
  onDismiss?: () => void;
}

export interface Handlers {
  play(): void;
  openDaily(): void;
  openLevels(): void;
  openSettings(): void;
  home(): void;
  restart(): void;
  hint(): void;
  fit(): void;
  pickLevel(n: number): void;
  playDaily(): void;
  change(patch: Partial<Settings>): void;
  howTo(): void;
  privacy(e: Event): void;
  reset(): void;
  adChoices(): void;
}

const $ = <T extends HTMLElement>(root: ParentNode, sel: string): T => root.querySelector(sel) as T;

const esc = (s: string): string =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

export class UI {
  readonly canvas: HTMLCanvasElement;
  private readonly root: HTMLElement;
  private readonly h: Handlers;
  private screen: Screen = 'home';
  private dismiss: (() => void) | null = null;
  private toastTimer = 0;

  constructor(root: HTMLElement, handlers: Handlers) {
    this.root = root;
    this.h = handlers;
    root.innerHTML = `
<canvas id="board"></canvas>
<header id="hud-top" class="hud hud-top hidden">
  <div class="hud-row">
    <button id="b-home" class="ibtn">${ICON.back}</button>
    <div class="hud-title"><span id="h-name"></span><span id="h-tag" class="tag"></span></div>
    <div id="h-hearts" class="hearts"></div>
  </div>
  <div class="prog"><i id="h-prog"></i></div>
</header>
<div id="banner" class="banner hidden" role="status"></div>
<footer id="hud-bottom" class="hud hud-bottom hidden">
  <button id="b-restart" class="ibtn round">${ICON.restart}</button>
  <button id="b-hint" class="hintbtn">${ICON.bulb}<span id="b-hint-label"></span><b id="b-hint-n">0</b></button>
  <button id="b-fit" class="ibtn round ghosted">${ICON.fit}</button>
</footer>
<main id="scr-home" class="screen"></main>
<main id="scr-levels" class="screen solid hidden"></main>
<main id="scr-daily" class="screen solid hidden"></main>
<main id="scr-settings" class="screen solid hidden"></main>
<div id="modal" class="modal hidden" role="dialog" aria-modal="true"><div class="sheet" id="sheet"></div></div>
<div id="toast" class="toast hidden" role="status"></div>
<div id="veil" class="veil hidden"><div class="veil-box">${ICON.video}<p id="veil-text"></p><div class="veil-bar"><i id="veil-fill"></i></div></div></div>`;
    this.canvas = $<HTMLCanvasElement>(root, '#board');
    $(root, '#b-home').addEventListener('click', () => this.h.home());
    $(root, '#b-restart').addEventListener('click', () => this.h.restart());
    $(root, '#b-hint').addEventListener('click', () => this.h.hint());
    $(root, '#b-fit').addEventListener('click', () => this.h.fit());
    $(root, '#modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget && this.dismiss) this.closeModal(true);
    });
  }

  // ---- screens ------------------------------------------------------------

  get current(): Screen {
    return this.screen;
  }

  show(screen: Screen): void {
    this.screen = screen;
    for (const s of ['home', 'levels', 'daily', 'settings']) {
      $(this.root, '#scr-' + s).classList.toggle('hidden', s !== screen);
    }
    const game = screen === 'game';
    $(this.root, '#hud-top').classList.toggle('hidden', !game);
    $(this.root, '#hud-bottom').classList.toggle('hidden', !game);
    if (!game) this.banner(null);
  }

  /** Heights of the two bars, so the board can be laid out between them. */
  insets(): { top: number; bottom: number; roomy: boolean } {
    if (this.screen === 'game') {
      return {
        top: $(this.root, '#hud-top').offsetHeight,
        bottom: $(this.root, '#hud-bottom').offsetHeight,
        roomy: true,
      };
    }
    if (this.screen === 'home') {
      // The demo board sits in the gap between the title and the buttons.
      const brand = this.root.querySelector('.brand');
      const actions = this.root.querySelector('.home-actions');
      if (brand && actions) {
        const top = brand.getBoundingClientRect().bottom + 10;
        const bottom = this.root.clientHeight - actions.getBoundingClientRect().top + 10;
        if (this.root.clientHeight - top - bottom > 150) return { top, bottom, roomy: true };
      }
    }
    return { top: 0, bottom: 0, roomy: false };
  }

  labels(): void {
    $(this.root, '#b-home').setAttribute('aria-label', t('common.back'));
    $(this.root, '#b-restart').setAttribute('aria-label', t('game.restart'));
    $(this.root, '#b-fit').setAttribute('aria-label', t('game.fit'));
    $(this.root, '#b-hint-label').textContent = t('game.hint');
  }

  renderHome(info: { level: number; dailyDone: boolean; streak: number }): void {
    const el = $(this.root, '#scr-home');
    el.innerHTML = `
<div class="home">
  <div class="brand">
    ${emblem(104)}
    <h1>${BRAND}</h1>
    <p>${esc(t('home.tagline'))}</p>
  </div>
  <div class="home-actions">
    <button id="a-play" class="cta">${ICON.play}<span><b>${esc(t('home.play'))}</b><small>${esc(t('home.level', { n: info.level }))}</small></span></button>
    <button id="a-daily" class="card-btn">${ICON.calendar}<span><b>${esc(t('home.daily'))}</b><small>${esc(
      info.dailyDone ? t('home.daily.done') : t('home.daily.todo'),
    )}${info.streak > 1 ? ' · ' + esc(t('home.streak', { n: info.streak })) : ''}</small></span>${
      info.dailyDone ? `<i class="done">${ICON.check}</i>` : ''
    }</button>
    <div class="row2">
      <button id="a-levels" class="small-btn">${ICON.grid}<span>${esc(t('home.levels'))}</span></button>
      <button id="a-settings" class="small-btn">${ICON.gear}<span>${esc(t('home.settings'))}</span></button>
    </div>
  </div>
</div>`;
    $(el, '#a-play').addEventListener('click', () => this.h.play());
    $(el, '#a-daily').addEventListener('click', () => this.h.openDaily());
    $(el, '#a-levels').addEventListener('click', () => this.h.openLevels());
    $(el, '#a-settings').addEventListener('click', () => this.h.openSettings());
  }

  private header(title: string): string {
    return `<div class="bar"><button class="ibtn" data-back>${ICON.back}</button><h2>${esc(title)}</h2><span class="ibtn spacer"></span></div>`;
  }

  private bindBack(el: HTMLElement): void {
    const b = el.querySelector('[data-back]') as HTMLElement | null;
    if (b) {
      b.setAttribute('aria-label', t('common.back'));
      b.addEventListener('click', () => this.h.home());
    }
  }

  renderLevels(max: number, stars: Record<string, number>): void {
    const el = $(this.root, '#scr-levels');
    let tiles = '';
    for (let n = 1; n <= max; n++) {
      const s = stars[String(n)] ?? 0;
      const cur = n === max;
      tiles += `<button class="tile${cur ? ' cur' : ''}" data-n="${n}"><b>${n}</b><span class="st">${[1, 2, 3]
        .map((k) => `<i class="${k <= s ? 'on' : ''}">${ICON.star}</i>`)
        .join('')}</span></button>`;
    }
    el.innerHTML = `${this.header(t('levels.title'))}<div class="scroll"><div class="tiles">${tiles}</div></div>`;
    this.bindBack(el);
    $(el, '.tiles').addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('[data-n]') as HTMLElement | null;
      if (b) this.h.pickLevel(Number(b.dataset.n));
    });
    const cur = el.querySelector('.tile.cur') as HTMLElement | null;
    if (cur) cur.scrollIntoView({ block: 'center' });
  }

  renderDaily(info: {
    dateLabel: string;
    done: boolean;
    streak: number;
    best: number;
    total: number;
    month: { label: string; firstWeekday: number; days: number; doneDays: number[]; today: number };
  }): void {
    const el = $(this.root, '#scr-daily');
    let cells = '';
    for (let i = 0; i < info.month.firstWeekday; i++) cells += '<i class="pad"></i>';
    for (let d = 1; d <= info.month.days; d++) {
      const cls = [info.month.doneDays.indexOf(d) >= 0 ? 'on' : '', d === info.month.today ? 'today' : ''].join(' ');
      cells += `<i class="${cls}">${d}</i>`;
    }
    el.innerHTML = `${this.header(t('daily.title'))}
<div class="scroll"><div class="daily">
  <div class="daily-card">
    <div class="daily-date">${ICON.calendar}<span>${esc(info.dateLabel)}</span>${info.done ? `<i class="done">${ICON.check}</i>` : ''}</div>
    <button id="d-play" class="cta slim">${ICON.play}<span><b>${esc(info.done ? t('daily.replay') : t('daily.play'))}</b></span></button>
  </div>
  <div class="stats3">
    <div><b>${info.streak}</b><span>${esc(t('daily.streak'))}</span></div>
    <div><b>${info.best}</b><span>${esc(t('daily.best'))}</span></div>
    <div><b>${info.total}</b><span>${esc(t('daily.total'))}</span></div>
  </div>
  <div class="cal"><h3>${esc(info.month.label)}</h3><div class="cal-grid">${cells}</div></div>
</div></div>`;
    this.bindBack(el);
    $(el, '#d-play').addEventListener('click', () => this.h.playDaily());
  }

  renderSettings(s: Settings, version: string, privacyUrl: string, adChoices: boolean): void {
    const el = $(this.root, '#scr-settings');
    const toggle = (id: string, label: string, on: boolean) =>
      `<label class="rowi"><span>${esc(label)}</span><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><i class="sw"></i></label>`;
    const seg = (id: string, label: string, opts: [string, string][], val: string) =>
      `<div class="rowi"><span>${esc(label)}</span><div class="seg" id="${id}">${opts
        .map(([v, l]) => `<button data-v="${v}" class="${v === val ? 'on' : ''}">${esc(l)}</button>`)
        .join('')}</div></div>`;
    const langs = [['auto', t('settings.language.auto')] as [string, string]].concat(
      Object.keys(LANGS).map((k) => [k, LANGS[k].name] as [string, string]),
    );
    el.innerHTML = `${this.header(t('settings.title'))}
<div class="scroll"><div class="settings">
  <div class="group">
    ${toggle('s-sound', t('settings.sound'), s.sound)}
    ${toggle('s-haptics', t('settings.haptics'), s.haptics)}
  </div>
  <div class="group">
    ${seg('s-theme', t('settings.theme'), [['dark', t('settings.theme.dark')], ['light', t('settings.theme.light')]], s.theme)}
    ${seg('s-colors', t('settings.colors'), [['dir', t('settings.colors.dir')], ['mono', t('settings.colors.mono')]], s.colors)}
    <label class="rowi"><span>${esc(t('settings.language'))}</span><select id="s-lang">${langs
      .map(([v, l]) => `<option value="${v}" ${v === s.lang ? 'selected' : ''}>${esc(l)}</option>`)
      .join('')}</select></label>
  </div>
  <div class="group">
    <button class="rowi link" id="s-howto"><span>${esc(t('settings.howto'))}</span></button>
    ${privacyUrl ? `<a class="rowi link" id="s-privacy" href="${esc(privacyUrl)}" target="_blank" rel="noopener"><span>${esc(t('settings.privacy'))}</span></a>` : ''}
    ${adChoices ? `<button class="rowi link" id="s-adchoices"><span>${esc(t('settings.adchoices'))}</span></button>` : ''}
    <button class="rowi link danger" id="s-reset"><span>${esc(t('settings.reset'))}</span></button>
  </div>
  <p class="ver">${BRAND} · ${esc(t('settings.version', { v: version }))}</p>
</div></div>`;
    this.bindBack(el);
    $<HTMLInputElement>(el, '#s-sound').addEventListener('change', (e) =>
      this.h.change({ sound: (e.target as HTMLInputElement).checked }),
    );
    $<HTMLInputElement>(el, '#s-haptics').addEventListener('change', (e) =>
      this.h.change({ haptics: (e.target as HTMLInputElement).checked }),
    );
    const segBind = (id: string, key: 'theme' | 'colors') =>
      $(el, id).addEventListener('click', (e) => {
        const b = (e.target as HTMLElement).closest('[data-v]') as HTMLElement | null;
        if (b) this.h.change({ [key]: b.dataset.v } as Partial<Settings>);
      });
    segBind('#s-theme', 'theme');
    segBind('#s-colors', 'colors');
    $<HTMLSelectElement>(el, '#s-lang').addEventListener('change', (e) =>
      this.h.change({ lang: (e.target as HTMLSelectElement).value }),
    );
    $(el, '#s-howto').addEventListener('click', () => this.h.howTo());
    const pr = el.querySelector('#s-privacy');
    if (pr) pr.addEventListener('click', (e) => this.h.privacy(e));
    const ac = el.querySelector('#s-adchoices');
    if (ac) ac.addEventListener('click', () => this.h.adChoices());
    $(el, '#s-reset').addEventListener('click', () => this.h.reset());
  }

  // ---- game bars ----------------------------------------------------------

  setHud(name: string, difficulty: Difficulty | null): void {
    $(this.root, '#h-name').textContent = name;
    const tag = $(this.root, '#h-tag');
    if (difficulty && difficulty !== 'normal' && difficulty !== 'easy') {
      tag.textContent = t('diff.' + difficulty);
      tag.className = 'tag ' + difficulty;
    } else {
      tag.textContent = '';
      tag.className = 'tag none';
    }
  }

  setHearts(n: number, lost = false): void {
    const el = $(this.root, '#h-hearts');
    el.innerHTML = [0, 1, 2].map((i) => `<i class="${i < n ? 'on' : 'off'}">${ICON.heart}</i>`).join('');
    el.setAttribute('aria-label', String(n));
    if (lost) {
      el.classList.remove('shake');
      void el.offsetWidth;
      el.classList.add('shake');
    }
  }

  setProgress(frac: number): void {
    $(this.root, '#h-prog').style.width = Math.round(Math.max(0, Math.min(1, frac)) * 100) + '%';
  }

  setHintCount(n: number): void {
    const b = $(this.root, '#b-hint-n');
    b.textContent = String(n);
    b.classList.toggle('zero', n <= 0);
  }

  setFit(visible: boolean): void {
    $(this.root, '#b-fit').classList.toggle('ghosted', !visible);
  }

  banner(text: string | null): void {
    const el = $(this.root, '#banner');
    if (!text) {
      el.classList.add('hidden');
      return;
    }
    el.textContent = text;
    el.classList.remove('hidden');
  }

  // ---- dialogs ------------------------------------------------------------

  get modalOpen(): boolean {
    return !$(this.root, '#modal').classList.contains('hidden');
  }

  modal(o: ModalOptions): void {
    const sheet = $(this.root, '#sheet');
    const stars =
      o.stars !== undefined
        ? `<div class="stars">${[1, 2, 3]
            .map((k) => `<i class="${k <= (o.stars as number) ? 'on' : ''}" style="animation-delay:${k * 110}ms">${ICON.star}</i>`)
            .join('')}</div>`
        : '';
    sheet.innerHTML = `${stars}<h2>${esc(o.title)}</h2>${o.body ? `<p>${esc(o.body)}</p>` : ''}${
      o.lines && o.lines.length ? `<ul class="lines">${o.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''
    }<div class="actions">${o.actions
      .map(
        (a, i) =>
          `<button data-i="${i}" class="mbtn ${a.kind ?? 'ghost'}">${a.icon ?? ''}<span>${esc(a.label)}</span></button>`,
      )
      .join('')}</div>`;
    sheet.querySelectorAll('[data-i]').forEach((b) =>
      b.addEventListener('click', () => {
        const a = o.actions[Number((b as HTMLElement).dataset.i)];
        this.closeModal(false);
        a.run();
      }),
    );
    this.dismiss = o.onDismiss ?? null;
    $(this.root, '#modal').classList.remove('hidden');
  }

  /** Closes the dialog. `byUser` means back button or a tap outside. */
  closeModal(byUser: boolean): boolean {
    if (!this.modalOpen) return false;
    if (byUser && !this.dismiss) return true; // this dialog needs an answer
    const d = this.dismiss;
    this.dismiss = null;
    $(this.root, '#modal').classList.add('hidden');
    if (byUser && d) d();
    return true;
  }

  toast(text: string): void {
    const el = $(this.root, '#toast');
    el.textContent = text;
    el.classList.remove('hidden');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => el.classList.add('hidden'), 1900);
  }

  /** Short full-screen notice used by the web demo where an ad would play. */
  veil(text: string, ms: number): Promise<void> {
    const el = $(this.root, '#veil');
    $(el, '#veil-text').textContent = text;
    const fill = $(el, '#veil-fill');
    fill.style.transition = 'none';
    fill.style.width = '0%';
    el.classList.remove('hidden');
    void fill.offsetWidth;
    fill.style.transition = `width ${ms}ms linear`;
    fill.style.width = '100%';
    return new Promise((resolve) =>
      window.setTimeout(() => {
        el.classList.add('hidden');
        resolve();
      }, ms),
    );
  }
}
