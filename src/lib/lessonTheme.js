// A distinct accent color per lesson theme, so each lesson has its own
// visual identity instead of every screen looking identical.
const THEME_ACCENTS = {
  greetings: "#B8492F",
  family: "#B9822C",
  food: "#8B3540",
  numbers: "#1E6B60",
  everyday: "#2B8478",
};

export function lessonAccentColor(theme) {
  return THEME_ACCENTS[theme] || "#B8492F";
}
