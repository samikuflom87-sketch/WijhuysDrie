// Short, punchy compliments shown as a big headline the instant an answer
// is marked correct — the "big payoff" moment, with the mascot's own line
// underneath it for personality.
const COMPLIMENTS = [
  "Perfect!",
  "Excellent!",
  "Amazing!",
  "Fantastic!",
  "Brilliant!",
  "Wonderful!",
  "Outstanding!",
  "Superb!",
  "Nailed it!",
  "Great job!",
];

let lastIndex = -1;

export function randomCompliment() {
  let index = Math.floor(Math.random() * COMPLIMENTS.length);
  if (COMPLIMENTS.length > 1 && index === lastIndex) {
    index = (index + 1) % COMPLIMENTS.length;
  }
  lastIndex = index;
  return COMPLIMENTS[index];
}
