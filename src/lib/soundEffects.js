// Small synthesized UI sound effects using the Web Audio API — no audio
// files needed. Each is a short, distinct tone shape so click/correct/wrong
// never get confused with each other or with word-pronunciation audio.

let ctx = null;
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

function tone(audioCtx, freq, startTime, duration, { type = "sine", peak = 0.15 } = {}) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peak, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.03);
}

export function playClick() {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  tone(audioCtx, 720, audioCtx.currentTime, 0.055, { type: "sine", peak: 0.07 });
}

export function playPop() {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  tone(audioCtx, 880, audioCtx.currentTime, 0.09, { type: "triangle", peak: 0.11 });
}

export function playCorrect() {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  tone(audioCtx, 523.25, t, 0.14, { type: "sine", peak: 0.16 }); // C5
  tone(audioCtx, 659.25, t + 0.09, 0.16, { type: "sine", peak: 0.16 }); // E5
  tone(audioCtx, 783.99, t + 0.18, 0.24, { type: "sine", peak: 0.16 }); // G5
}

export function playWrong() {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  tone(audioCtx, 246, t, 0.16, { type: "sine", peak: 0.12 });
  tone(audioCtx, 196, t + 0.1, 0.24, { type: "sine", peak: 0.12 });
}

// A bigger, longer fanfare reserved for real milestones (a 7/30/100-day
// streak) — distinct from the everyday correct-answer chime so a milestone
// actually sounds like one.
export function playFanfare() {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    tone(audioCtx, freq, t + i * 0.11, 0.3, { type: "triangle", peak: 0.18 });
  });
  tone(audioCtx, 1318.5, t + 0.44, 0.5, { type: "sine", peak: 0.14 }); // E6 shimmer
}
