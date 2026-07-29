// A distinct accent color per lesson theme, so each lesson has its own
// visual identity instead of every screen looking identical.
const THEME_ACCENTS = {
  greetings: "#FF6B4A",
  family: "#FFC93C",
  food: "#E5484D",
  numbers: "#00A19D",
  everyday: "#1FC0BC",
};

export function lessonAccentColor(theme) {
  return THEME_ACCENTS[theme] || "#FF6B4A";
}
