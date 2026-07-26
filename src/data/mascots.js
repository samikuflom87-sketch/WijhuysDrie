// Five original mascots for Habesha Steps. Each has a distinct personality
// that comes through in the wording of their messages.

export const MASCOTS = [
  {
    id: "zaki",
    name: "Zaki",
    tagline: "The energetic one",
    color: "coral",
    greetings: [
      "Hey hey! Ready to crush today's lesson?",
      "Let's gooo! Pick a lesson and let's move!",
      "I've been waiting all day for this. Let's do it!",
    ],
    correct: [
      "Boom! Nailed it!",
      "Yes! You're on fire!",
      "That was fast — love it!",
      "Unstoppable! Keep going!",
      "Yes yes YES!",
    ],
    wrong: [
      "So close! Shake it off, next one's yours.",
      "Ehh, happens to the best of us — let's keep moving!",
      "No worries, speed round continues!",
      "You'll get the next one, I can feel it!",
    ],
    complete: [
      "That lesson didn't stand a chance against you!",
      "We're just getting started — let's keep this streak alive!",
    ],
  },
  {
    id: "nardos",
    name: "Nardos",
    tagline: "The calm, wise one",
    color: "teal",
    greetings: [
      "Welcome back. Let's take the next step together.",
      "Good to see you. Shall we continue?",
      "Every visit here is progress. Let's begin.",
    ],
    correct: [
      "Well done. Every word is a step forward.",
      "Nicely done — that's how fluency is built.",
      "Good. Steady progress is the best kind.",
      "Beautifully done. Keep that pace.",
    ],
    wrong: [
      "Not quite, but mistakes are how we learn. Take a breath.",
      "That's alright. Look closely, and it will stick next time.",
      "No harm done. Let's carry this forward.",
      "Gently now — you're still moving ahead.",
    ],
    complete: [
      "You showed real patience today. It shows.",
      "A calm mind learns best — and you proved it.",
    ],
  },
  {
    id: "bemnet",
    name: "Bemnet",
    tagline: "The silly one",
    color: "yellow",
    greetings: [
      "Oh hi! I was just practicing my Tigrinya on a cactus. Long story. Let's learn!",
      "You're back! My snacks and I were starting to worry.",
      "Guess who's ready to learn some words today? Me. Also you.",
    ],
    correct: [
      "Whoa, are you secretly fluent already?",
      "Ha! Even my cousin's parrot couldn't do that faster!",
      "Correct! I did a little dance, you just couldn't see it.",
      "You got it! I'm telling everyone about this.",
    ],
    wrong: [
      "Oops! Even I tripped over that word yesterday. Onward!",
      "Nope — but hey, at least you tried it with style.",
      "So wrong it's almost impressive. Try again!",
      "Plot twist! The answer was something else. Onward, hero.",
    ],
    complete: [
      "We should get you a tiny trophy. A tiny one. I'll look into it.",
      "Lesson: defeated. You: victorious. Me: proud and slightly hungry.",
    ],
  },
  {
    id: "saba",
    name: "Saba",
    tagline: "The curious, studious one",
    color: "sand",
    greetings: [
      "Oh, you're here! I was just reviewing yesterday's words. Shall we add more?",
      "Curious what today's lesson holds? Me too. Let's find out.",
      "I love this part — new words, new little discoveries. Ready?",
    ],
    correct: [
      "Exactly right — and now that word is yours to keep.",
      "Yes! Notice how that one just clicked?",
      "Correct. That's one more piece of the puzzle in place.",
      "Nicely reasoned. You're building real understanding.",
    ],
    wrong: [
      "Not this time — but now you know, which is the whole point.",
      "Close reasoning, wrong word. Let's file this one away for next time.",
      "Hm, not quite — but a good guess tells me you're paying attention.",
      "That one's tricky. Worth a second look later.",
    ],
    complete: [
      "Look at everything you picked up today. Genuinely impressive.",
      "That's a solid set of new words filed away. Well earned.",
    ],
  },
  {
    id: "tesfa",
    name: "Tesfa",
    tagline: "The gentle, supportive one",
    color: "coral-soft",
    greetings: [
      "Hi, friend. So glad you came back today.",
      "I'm right here with you — let's take this one step at a time.",
      "Whenever you're ready, I've got you. Let's begin.",
    ],
    correct: [
      "You did that! I'm really proud of you.",
      "Yes! See, you knew it all along.",
      "Beautiful. You're doing so well.",
      "That's it — you're getting stronger with every word.",
    ],
    wrong: [
      "It's okay, truly. This is how everyone learns.",
      "No worries at all — I'm still cheering for you.",
      "That one didn't land, and that's completely fine. Onward, together.",
      "Don't be hard on yourself — you're doing great overall.",
    ],
    complete: [
      "I'm so proud of you for finishing this. Truly.",
      "You showed up and did the work today. That matters.",
    ],
  },
];

export function randomMascot() {
  return MASCOTS[Math.floor(Math.random() * MASCOTS.length)];
}

export function randomLine(mascot, key) {
  const lines = mascot[key];
  return lines[Math.floor(Math.random() * lines.length)];
}
