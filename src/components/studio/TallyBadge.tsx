import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text } from "react-native";
import { TakePhase } from "../../hooks/useTakeRecorder";
import { colors, fonts, motion, radii } from "../../theme/tokens";

interface TallyBadgeProps {
  phase: TakePhase;
  ready: boolean;
}

const labels: Record<TakePhase, string> = {
  idle: "PRONTO",
  countdown: "CONTAGEM",
  recording: "REC",
  saving: "SALVANDO",
};

export function TallyBadge({ phase, ready }: TallyBadgeProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const live = phase === "recording";
  const blinking = live || phase === "countdown";

  useEffect(() => {
    if (!blinking) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.2, duration: 480, easing: Easing.inOut(Easing.quad), useNativeDriver: motion.native }),
        Animated.timing(pulse, { toValue: 1, duration: 480, easing: Easing.inOut(Easing.quad), useNativeDriver: motion.native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blinking]);

  const label = phase === "idle" && !ready ? "AGUARDE" : labels[phase];
  const dotColor = live ? colors.ink : phase === "idle" && ready ? colors.peak : colors.bone;

  return (
    <Animated.View style={[styles.badge, live && styles.live]} accessibilityLiveRegion="polite" accessibilityLabel={`Estado: ${label}`}>
      <Animated.View style={[styles.dot, { backgroundColor: dotColor, opacity: pulse }]} />
      <Text style={[styles.label, live && styles.labelLive]}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: radii.xs,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  live: {
    backgroundColor: colors.tally,
    borderColor: colors.tally,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontFamily: fonts.monoSemi,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.bone,
  },
  labelLive: {
    color: colors.ink,
  },
});
