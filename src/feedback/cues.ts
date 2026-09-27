import { beep } from "./beep";
import { haptics } from "./haptics";

export const cues = {
  countdown: (digit: number) => {
    haptics.count();
    beep(digit === 1 ? 1320 : 1000, 70);
  },
  rolling: () => haptics.roll(),
  cut: () => haptics.cut(),
  finalSecond: () => haptics.tap(),
};
