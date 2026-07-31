// A gentle ambient pad for lesson screens — three soft detuned sine tones
// with a slow LFO swell, synthesized via Web Audio (same approach as
// soundEffects.js, no external audio file). Off by default; the whole
// point is atmosphere, not attention, so it stays very quiet.
let ctx = null;
let nodes = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function startAmbient() {
  const audioCtx = getCtx();
  if (!audioCtx || nodes) return;

  const masterGain = audioCtx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioCtx.destination);
  masterGain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 2);

  const freqs = [130.81, 164.81, 196.0]; // C3, E3, G3 — a calm major triad
  const oscs = freqs.map((freq) => {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(masterGain);
    osc.start();
    return osc;
  });

  const lfo = audioCtx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);
  lfo.start();

  nodes = { masterGain, oscs: [...oscs, lfo] };
}

export function stopAmbient() {
  if (!nodes || !ctx) {
    nodes = null;
    return;
  }
  const { masterGain, oscs } = nodes;
  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
  setTimeout(() => {
    for (const osc of oscs) {
      try {
        osc.stop();
      } catch {
        // Already stopped; ignore.
      }
    }
  }, 700);
  nodes = null;
}
