import { Component } from "react";

// Deliberately has zero dependencies on SettingsContext (no <Mascot>, no
// useSound) — this boundary sits outside <App>, so if App itself is what
// crashed, this fallback must never depend on anything App provides, or
// the fallback would crash too and defeat the whole point.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Habesha Steps crashed:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center app-bg"
        style={{ background: "var(--color-brand-cream)" }}
      >
        <span style={{ fontSize: 72, lineHeight: 1 }}>🙂</span>
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
          Something went wrong
        </h1>
        <p className="font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
          Your progress is saved — this screen just hit a snag. Let's get you back on track.
        </p>
        <button
          className="btn-3d btn-coral rounded-2xl font-extrabold py-3.5 px-6 uppercase tracking-wide w-full max-w-xs"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }
}
