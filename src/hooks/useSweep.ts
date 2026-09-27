import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { motion } from "../theme/tokens";

export function useSweep(cycleKey: unknown, running: boolean, restingValue = 0.75, duration = 1000) {
  const progress = useRef(new Animated.Value(restingValue)).current;

  useEffect(() => {
    if (!running) {
      progress.setValue(restingValue);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: motion.native,
    });
    animation.start();
    return () => animation.stop();
  }, [cycleKey, running]);

  return progress;
}
