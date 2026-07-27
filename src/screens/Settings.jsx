import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettingsContext } from "../context/SettingsContext";
import { DAILY_GOAL_OPTIONS } from "../lib/storage";
import Button from "../components/Button";
import { useSound } from "../hooks/useSound";
import { speakWithReport } from "../lib/tts";

function ToggleSwitch({ on, onToggle, label }) {
  const sound = useSound();
  return (
    <button
      onClick={() => {
        sound.click();
        onToggle();
      }}
      className="flex items-center justify-between w-full rounded-2xl bg-white px-4 py-3.5"
      style={{ border: "2px solid var(--color-brand-line)" }}
    >
      <span className="font-extrabold text-left" style={{ color: "var(--color-brand-ink)" }}>
        {label}
      </span>
      <span
        className="relative rounded-full transition-colors shrink-0"
        style={{
          width: 46,
          height: 26,
          background: on ? "var(--color-brand-teal)" : "var(--color-brand-line)",
        }}
      >
        <span
          className="absolute rounded-full bg-white transition-all"
          style={{ width: 20, height: 20, top: 3, left: on ? 23 : 3 }}
        />
      </span>
    </button>
  );
}

const GOAL_LABELS = [
  { key: "casual", label: "Casual", sub: "1 lesson / day" },
  { key: "regular", label: "Regular", sub: "3 lessons / day" },
  { key: "serious", label: "Serious", sub: "5 lessons / day" },
];

export default function Settings({ progress, onUpdateProgressField, onResetProgress }) {
  const navigate = useNavigate();
  const { settings, updateSetting } = useSettingsContext();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [voiceTestResult, setVoiceTestResult] = useState(null);
  const sound = useSound();

  function testVoice() {
    setVoiceTestResult("checking");
    let started = false;
    speakWithReport("selam", (event) => {
      if (event === "unsupported") {
        setVoiceTestResult("unsupported");
      } else if (event === "started") {
        started = true;
        setVoiceTestResult("started");
      } else if ((event === "error" || event === "timeout-check") && !started) {
        setVoiceTestResult("no-voice");
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-brand-cream)" }}>
      <header
        className="sticky top-0 z-10"
        style={{ background: "linear-gradient(135deg, #FF8163, var(--color-brand-coral))" }}
      >
        <div className="max-w-md mx-auto flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => {
              sound.click();
              navigate("/");
            }}
            aria-label="Back"
            className="text-2xl font-bold text-white"
          >
            ✕
          </button>
          <h1 className="font-display font-extrabold text-lg text-white">Settings</h1>
        </div>
      </header>

      <div className="max-w-md w-full mx-auto px-4 py-6 flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: "var(--color-brand-ink-light)" }}>
            Sound &amp; Motion
          </h2>
          <ToggleSwitch
            label="Sound"
            on={settings.soundOn}
            onToggle={() => updateSetting("soundOn", !settings.soundOn)}
          />
          <ToggleSwitch
            label="Reduce animations"
            on={settings.reducedMotion}
            onToggle={() => updateSetting("reducedMotion", !settings.reducedMotion)}
          />
          <Button
            variant="white"
            className="w-full uppercase tracking-wide"
            onClick={() => {
              sound.click();
              testVoice();
            }}
          >
            Test word pronunciation
          </Button>
          {voiceTestResult === "checking" && (
            <p className="text-sm font-bold px-1" style={{ color: "var(--color-brand-ink-light)" }}>
              Listening for a moment...
            </p>
          )}
          {voiceTestResult === "started" && (
            <p className="text-sm font-bold px-1" style={{ color: "var(--color-brand-teal-dark)" }}>
              🔊 If you just heard "selam", pronunciation is working on this device.
            </p>
          )}
          {(voiceTestResult === "no-voice" || voiceTestResult === "unsupported") && (
            <p className="text-sm font-bold px-1" style={{ color: "var(--color-brand-red-dark)" }}>
              This browser has no built-in reading voice, so word pronunciation stays silent
              here — the app's other sounds still work fine. Try Google Chrome, or check your
              device's text-to-speech settings.
            </p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: "var(--color-brand-ink-light)" }}>
            Daily Goal
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {GOAL_LABELS.map((opt) => {
              const value = DAILY_GOAL_OPTIONS[opt.key];
              const active = progress.dailyGoalLessons === value;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    sound.click();
                    onUpdateProgressField("dailyGoalLessons", value);
                  }}
                  className="rounded-2xl px-2 py-3 flex flex-col items-center gap-0.5"
                  style={{
                    background: active ? "var(--color-brand-coral-light)" : "white",
                    border: `2px solid ${active ? "var(--color-brand-coral)" : "var(--color-brand-line)"}`,
                  }}
                >
                  <span className="font-extrabold text-sm" style={{ color: "var(--color-brand-ink)" }}>
                    {opt.label}
                  </span>
                  <span className="text-xs font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: "var(--color-brand-red-dark)" }}>
            Danger Zone
          </h2>
          {!confirmingReset ? (
            <Button variant="white" className="w-full uppercase tracking-wide" onClick={() => setConfirmingReset(true)}>
              Reset all progress
            </Button>
          ) : (
            <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "var(--color-brand-red-light)" }}>
              <p className="font-bold" style={{ color: "var(--color-brand-red-dark)" }}>
                This deletes all XP, streaks, badges, and word progress. This can't be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="red"
                  className="flex-1 uppercase tracking-wide"
                  onClick={() => {
                    onResetProgress();
                    navigate("/");
                  }}
                >
                  Yes, delete
                </Button>
                <Button variant="white" className="flex-1 uppercase tracking-wide" onClick={() => setConfirmingReset(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
