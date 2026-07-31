// Tiny vibration cues for supported devices (Android Chrome; iOS Safari has
// no Vibration API and silently no-ops). Kept separate from sound so a
// missing/blocked vibrate() call never affects audio.
function vibrate(pattern) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Some browsers throw if called outside a user gesture; ignore.
    }
  }
}

export function hapticTap() {
  vibrate(8);
}

export function hapticCorrect() {
  vibrate([10, 40, 16]);
}

export function hapticWrong() {
  vibrate([25, 50, 25]);
}
