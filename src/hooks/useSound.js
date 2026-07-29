import { useSettingsContext } from "../context/SettingsContext";
import { playClick, playCorrect, playWrong, playPop, playFanfare } from "../lib/soundEffects";
import { hapticTap, hapticCorrect, hapticWrong } from "../lib/haptics";

export function useSound() {
  const { settings } = useSettingsContext();
  const on = settings.soundOn;
  return {
    click: () => {
      if (on) playClick();
      hapticTap();
    },
    correct: () => {
      if (on) playCorrect();
      hapticCorrect();
    },
    wrong: () => {
      if (on) playWrong();
      hapticWrong();
    },
    pop: () => {
      if (on) playPop();
      hapticTap();
    },
    fanfare: () => {
      if (on) playFanfare();
      hapticCorrect();
    },
  };
}
