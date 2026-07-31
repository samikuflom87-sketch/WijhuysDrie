// Badging API: shows a number on the installed app's home-screen icon.
// Supported on Chrome/Edge (desktop + Android); silently unsupported
// elsewhere (iOS Safari has no equivalent web API), so this always
// feature-detects and never throws.
export function setAppBadge(count) {
  if (typeof navigator === "undefined" || !navigator.setAppBadge) return;
  try {
    if (count > 0) navigator.setAppBadge(count);
    else navigator.clearAppBadge?.();
  } catch {
    // Some browsers only allow this while installed as a PWA; ignore.
  }
}
