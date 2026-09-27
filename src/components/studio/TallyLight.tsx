import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { formatTimecode } from "../../domain/format";
import { colors, fonts, motion, radii } from "../../theme/tokens";

interface TallyLightProps {
  recording: boolean;
  elapsedMs: number;
  label: string;
}

export function TallyLight({ recording, elapsedMs, label }: TallyLightProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!recording) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.25, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: motion.native }),
        Animated.timing(pulse, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: motion.native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [recording]);

  return (
    <View style={[styles.pill, recording && styles.pillLive]} accessibilityLiveRegion="polite">
      <Animated.View style={[styles.dot, { opacity: pulse, backgroundColor: recording ? colors.rec : colors.go }]} />
      <Text style={styles.state}>{recording ? "REC" : label}</Text>
      <View style={styles.rule} />
      <Text style={styles.timecode}>{formatTimecode(elapsedMs)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  pillLive: {
    borderColor: "rgba(255, 77, 61, 0.55)",
    backgroundColor: "rgba(40, 10, 8, 0.7)",
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  state: {
    fontFamily: fonts.monoMedium,
    color: colors.paper,
    fontSize: 12,
    letterSpacing: 1.6,
  },
  rule: {
    width: 1,
    height: 14,
    backgroundColor: colors.lineStrong,
  },
  timecode: {
    fontFamily: fonts.mono,
    color: colors.paper,
    fontSize: 14,
    letterSpacing: 0.6,
    minWidth: 76,
  },
});
