/**
 * Modul Suara & SFX berbasis Web Audio API prosedural sintetis.
 * Keuntungan: Nol aset eksternal (zero 404, zero network lag),
 * sangat ringan, dan tersinkronisasi 1:1 dengan animasi UI/UX.
 *
 * Mengadopsi arsitektur SFX dari dokumen animasi ultah & tema buku tahunan Tulalit.
 * Sesuai aturan: DEFAULT MUTE.
 */

export type SfxType =
  | "click"
  | "pop"
  | "paper"
  | "paper-slide"
  | "konami"
  | "gacha"
  | "whoosh"
  | "flip"
  | "typewriter"
  | "seal-break"
  | "camera-shutter"
  | "vinyl-scratch";

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
const volume = 0.8;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer | null {
  try {
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  } catch {
    return null;
  }
}

const STORAGE_KEY_MUTE = "tulalit_sound_muted";

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY_MUTE);
  // Default is MUTE (true)
  return stored === null ? true : stored === "true";
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_MUTE, String(muted));
  } catch {}
}

/**
 * Memainkan nada beep sintetis Web Audio API (untuk countdown photobooth, konfirmasi, dll).
 */
export function playBeep(freq = 440, duration = 0.12): void {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const dest = masterGain || ctx.destination;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Ignore audio context errors gracefully
  }
}

export function playSfx(type: SfxType): void {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const dest = masterGain || ctx.destination;

  try {
    const now = ctx.currentTime;

    switch (type) {
      case "click": {
        // Precise clean UI click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case "pop": {
        // Cheerful bubbly pop sound (confetti, finish counters)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }

      case "paper":
      case "paper-slide": {
        // Smooth friction sweep of paper gliding
        const duration = 0.45;
        const noiseBuffer = createNoiseBuffer(ctx, duration);
        if (!noiseBuffer) return;

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.6);
        filter.frequency.exponentialRampToValueAtTime(350, now + duration);
        filter.Q.setValueAtTime(2.0, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        noise.start(now);
        noise.stop(now + duration);
        break;
      }

      case "whoosh": {
        // Smooth air whoosh for scroll reveals and intro exits
        const duration = 0.32;
        const noiseBuffer = createNoiseBuffer(ctx, duration);
        if (!noiseBuffer) return;

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(250, now);
        filter.frequency.exponentialRampToValueAtTime(1600, now + duration * 0.45);
        filter.frequency.exponentialRampToValueAtTime(180, now + duration);
        filter.Q.setValueAtTime(1.8, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        noise.start(now);
        noise.stop(now + duration);
        break;
      }

      case "flip": {
        // Card flip sound (short snap + resonant woosh)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.13);

        const noiseBuffer = createNoiseBuffer(ctx, 0.08);
        if (noiseBuffer) {
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(900, now);
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.18, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(dest);
          noise.start(now);
          noise.stop(now + 0.08);
        }
        break;
      }

      case "typewriter": {
        // Crisp, mechanical key tick
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(2200, now);
        filter.Q.setValueAtTime(3.5, now);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(800 + Math.random() * 300, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        const noiseBuffer = createNoiseBuffer(ctx, 0.02);
        if (noiseBuffer) {
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.18, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(dest);
          noise.start(now);
          noise.stop(now + 0.02);
        }

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.045);
        break;
      }

      case "seal-break": {
        // Crisp snap/burst of wax seal breaking + low resonant thump
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);
        oscGain.gain.setValueAtTime(0.38, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(oscGain);
        oscGain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.25);

        const noiseBuffer = createNoiseBuffer(ctx, 0.12);
        if (noiseBuffer) {
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "highpass";
          filter.frequency.setValueAtTime(1800, now);
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.35, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(dest);
          noise.start(now);
          noise.stop(now + 0.12);
        }
        break;
      }

      case "camera-shutter": {
        // Two-stage retro camera shutter sound
        // Click 1: Mirror slap
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(950, now);
        osc1.frequency.exponentialRampToValueAtTime(180, now + 0.04);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc1.connect(gain1);
        gain1.connect(dest);
        osc1.start(now);
        osc1.stop(now + 0.045);

        // Click 2: Shutter curtain (delay 65ms)
        const t2 = now + 0.065;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(1200, t2);
        osc2.frequency.exponentialRampToValueAtTime(240, t2 + 0.05);
        gain2.gain.setValueAtTime(0.28, t2);
        gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.05);
        osc2.connect(gain2);
        gain2.connect(dest);
        osc2.start(t2);
        osc2.stop(t2 + 0.055);
        break;
      }

      case "vinyl-scratch": {
        // Stylus landing on vinyl groove
        const duration = 0.28;
        const noiseBuffer = createNoiseBuffer(ctx, duration);
        if (!noiseBuffer) return;

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(450, now + duration);
        filter.Q.setValueAtTime(3.0, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        noise.start(now);
        noise.stop(now + duration);
        break;
      }

      case "konami": {
        // 8-bit retro fanfare arpeggio (C5 - E5 - G5 - C6)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + idx * 0.08;
          osc.type = "square";
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.15, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(startTime);
          osc.stop(startTime + 0.11);
        });
        break;
      }

      case "gacha": {
        // Efek tuas gacha / putaran koin
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + i * 0.06;
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(400 + i * 120, startTime);
          gain.gain.setValueAtTime(0.08, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(startTime);
          osc.stop(startTime + 0.06);
        }
        break;
      }
    }
  } catch {
    // Ignore audio context errors gracefully
  }
}
