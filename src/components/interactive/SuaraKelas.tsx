"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Brown noise generator (Brownian / red noise)
function createBrownNoise(ctx: AudioContext): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  return src;
}

// Pink noise via b0..b6 coefficients
function createPinkNoise(ctx: AudioContext): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b = [0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < bufferSize; i++) {
    const w = Math.random() * 2 - 1;
    b[0] = 0.99886 * b[0] + w * 0.0555179;
    b[1] = 0.99332 * b[1] + w * 0.0750759;
    b[2] = 0.96900 * b[2] + w * 0.1538520;
    b[3] = 0.86650 * b[3] + w * 0.3104856;
    b[4] = 0.55000 * b[4] + w * 0.5329522;
    b[5] = -0.7616 * b[5] - w * 0.0168980;
    data[i] = (b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + w * 0.5362) / 7;
    b[6] = w * 0.115926;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  return src;
}

interface Channel {
  id: string;
  label: string;
  emoji: string;
}

const CHANNELS: Channel[] = [
  { id: "rain", label: "Hujan di Atap", emoji: "🌧️" },
  { id: "fan", label: "Kipas Angin Lab", emoji: "🌀" },
  { id: "keyboard", label: "Suara Keyboard", emoji: "⌨️" },
  { id: "bell", label: "Bel Sekolah", emoji: "🔔" },
];

export function SuaraKelas() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const channelGainsRef = useRef<Record<string, GainNode>>({});
  const nodesRef = useRef<AudioNode[]>([]);
  const keyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bellTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [masterVol, setMasterVol] = useState(0.7);
  const [chanVols, setChanVols] = useState<Record<string, number>>({
    rain: 0.6,
    fan: 0.5,
    keyboard: 0.4,
    bell: 0.3,
  });

  const stop = useCallback(() => {
    if (keyTimerRef.current) clearInterval(keyTimerRef.current);
    if (bellTimerRef.current) clearInterval(bellTimerRef.current);
    nodesRef.current.forEach((n) => {
      try {
        if (n instanceof AudioBufferSourceNode || n instanceof OscillatorNode) {
          (n as AudioBufferSourceNode).stop();
        }
      } catch {}
    });
    nodesRef.current = [];
    ctxRef.current?.close();
    ctxRef.current = null;
    setStarted(false);
  }, []);

  const start = useCallback(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = masterVol;
    master.connect(ctx.destination);
    masterGainRef.current = master;

    const makeGain = (id: string, vol: number) => {
      const g = ctx.createGain();
      g.gain.value = vol;
      g.connect(master);
      channelGainsRef.current[id] = g;
      return g;
    };

    // --- 1. Hujan (pink noise → lowpass) ---
    const rainGain = makeGain("rain", chanVols.rain);
    const rainSrc = createPinkNoise(ctx);
    const rainLp = ctx.createBiquadFilter();
    rainLp.type = "lowpass";
    rainLp.frequency.value = 800;
    rainSrc.connect(rainLp);
    rainLp.connect(rainGain);
    rainSrc.start();
    nodesRef.current.push(rainSrc);

    // --- 2. Kipas (brown noise + LFO) ---
    const fanGain = makeGain("fan", chanVols.fan);
    const fanSrc = createBrownNoise(ctx);
    const fanLfo = ctx.createOscillator();
    fanLfo.frequency.value = 0.8;
    const fanLfoGain = ctx.createGain();
    fanLfoGain.gain.value = 0.15;
    fanLfo.connect(fanLfoGain);
    fanLfoGain.connect(fanGain.gain);
    fanSrc.connect(fanGain);
    fanSrc.start();
    fanLfo.start();
    nodesRef.current.push(fanSrc, fanLfo);

    // --- 3. Keyboard (periodic click bursts) ---
    const kbGain = makeGain("keyboard", chanVols.keyboard);
    const scheduleClick = () => {
      const now = ctx.currentTime;
      // Random burst of 3-8 clicks
      const count = 3 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const t = now + i * (0.04 + Math.random() * 0.04);
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let j = 0; j < d.length; j++) {
          d[j] = (Math.random() * 2 - 1) * Math.exp(-j / (d.length * 0.3));
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 2000;
        src.connect(hp);
        hp.connect(kbGain);
        src.start(t);
      }
    };
    keyTimerRef.current = setInterval(scheduleClick, 800 + Math.random() * 1200);
    scheduleClick();

    // --- 4. Bel Sekolah (dual sine with decay) ---
    const bellGain = makeGain("bell", chanVols.bell);
    const scheduleBell = () => {
      const now = ctx.currentTime;
      const freqs = [440, 554];
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.4, now);
        env.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
        osc.connect(env);
        env.connect(bellGain);
        osc.start(now);
        osc.stop(now + 2.6);
        nodesRef.current.push(osc);
      });
    };
    bellTimerRef.current = setInterval(scheduleBell, 30000);

    setStarted(true);
  }, [chanVols, masterVol]);

  // Sync master volume
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = muted ? 0 : masterVol;
    }
  }, [masterVol, muted]);

  // Sync channel volumes
  useEffect(() => {
    Object.entries(chanVols).forEach(([id, vol]) => {
      const g = channelGainsRef.current[id];
      if (g) g.gain.value = vol;
    });
  }, [chanVols]);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  return (
    <div className="font-mono">
      {/* Cassette deck header */}
      <div className="bg-[#1A1A2E] text-green-400 border-2 border-[#333360] rounded-sm p-5 shadow-2xl max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${started ? "bg-green-400 animate-pulse" : "bg-gray-600"}`} />
            <span className="text-xs font-bold tracking-widest uppercase">
              SUARA KELAS™ v1.0
            </span>
          </div>
          <span className="text-[10px] text-gray-500">XII PPLG 3 AUDIO SYS</span>
        </div>

        {/* VU meter decoration */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded-sm transition-all ${
                started && !muted
                  ? i < 14
                    ? "bg-green-500"
                    : i < 17
                    ? "bg-yellow-400"
                    : "bg-red-500"
                  : "bg-gray-700"
              }`}
              style={{
                opacity: started && !muted ? 0.5 + Math.random() * 0.5 : 0.3,
              }}
            />
          ))}
        </div>

        {/* Start/Stop + Mute */}
        <div className="flex gap-3 mb-5">
          <button
            type="button"
            onClick={started ? stop : start}
            className={`flex-1 py-2 text-xs font-bold tracking-widest border transition-all ${
              started
                ? "bg-red-900/60 border-red-700 text-red-400 hover:bg-red-900"
                : "bg-green-900/60 border-green-700 text-green-400 hover:bg-green-900"
            }`}
          >
            {started ? "■ STOP" : "▶ PLAY"}
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            disabled={!started}
            aria-label={muted ? "Nyalakan suara kelas" : "Bisukan suara kelas"}
            className="px-4 py-2 text-xs font-bold border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white disabled:opacity-30 transition-all"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Master volume */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>MASTER VOL</span>
            <span>{Math.round(masterVol * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={masterVol}
            onChange={(e) => setMasterVol(Number(e.target.value))}
            aria-label="Volume utama suara kelas"
            className="w-full accent-green-400 cursor-pointer"
          />
        </div>

        {/* Channel faders */}
        <div className="border-t border-gray-700 pt-4 space-y-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            Channel Mix
          </p>
          {CHANNELS.map((ch) => (
            <div key={ch.id} className="flex items-center gap-3">
              <span className="text-base w-6">{ch.emoji}</span>
              <span className="text-[10px] text-gray-300 w-28 truncate">
                {ch.label}
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={chanVols[ch.id]}
                onChange={(e) =>
                  setChanVols((prev) => ({
                    ...prev,
                    [ch.id]: Number(e.target.value),
                  }))
                }
                aria-label={`Volume channel ${ch.label}`}
                className="flex-1 accent-green-400 cursor-pointer"
              />
              <span className="text-[10px] text-gray-500 w-8 text-right">
                {Math.round(chanVols[ch.id] * 100)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
