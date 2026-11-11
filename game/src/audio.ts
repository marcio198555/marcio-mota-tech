// Sound effects, made on the fly with the Web Audio API: no audio files.
// Each arrow that leaves plays the next note of a five-note scale, so a quick
// run of good moves turns into a little rising melody.

const SCALE = [0, 2, 4, 7, 9];
const BASE = 392; // G4

export class Sfx {
  enabled = true;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  /** Browsers only allow sound after a touch: call this from a touch handler. */
  unlock(): void {
    if (!this.enabled) return;
    try {
      if (!this.ctx) {
        const Ctor: typeof AudioContext | undefined =
          window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  suspend(): void {
    if (this.ctx && this.ctx.state === 'running') void this.ctx.suspend();
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    vol: number,
    delay = 0,
    slideTo = 0,
  ): void {
    const ctx = this.ctx;
    if (!this.enabled || !ctx || !this.master || ctx.state !== 'running') return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo > 0) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  /** Note number `i` of the rising scale (0 = lowest). */
  note(i: number): void {
    const k = Math.min(i, 14);
    const semi = 12 * Math.floor(k / 5) + SCALE[k % 5];
    const f = BASE * Math.pow(2, semi / 12);
    this.tone(f, 0.34, 'sine', 0.5);
    this.tone(f * 2, 0.16, 'triangle', 0.16);
  }

  bump(): void {
    this.tone(150, 0.2, 'triangle', 0.6, 0, 70);
    this.tone(104, 0.16, 'square', 0.1, 0.02);
  }

  win(): void {
    const chord = [0, 4, 7, 12, 16];
    chord.forEach((semi, i) => {
      const f = BASE * Math.pow(2, semi / 12);
      this.tone(f, 0.5, 'sine', 0.42, i * 0.085);
      this.tone(f * 2, 0.25, 'triangle', 0.12, i * 0.085);
    });
  }

  fail(): void {
    this.tone(330, 0.3, 'triangle', 0.45, 0, 220);
    this.tone(220, 0.45, 'triangle', 0.4, 0.2, 147);
  }

  click(): void {
    this.tone(880, 0.05, 'sine', 0.22);
  }

  hint(): void {
    this.tone(784, 0.14, 'sine', 0.3);
    this.tone(1175, 0.2, 'sine', 0.3, 0.09);
  }
}
