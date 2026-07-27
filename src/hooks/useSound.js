import { useSettingsContext } from "../context/SettingsContext";
import { playClick, playCorrect, playWrong, playPop } from "../lib/soundEffects";

export function useSound() {
  const { settings } = useSettingsContext();
  const on = settings.soundOn;
  return {
    click: () => on && playClick(),
    correct: () => on && playCorrect(),
    wrong: () => on && playWrong(),
    pop: () => on && playPop(),
  };
}
