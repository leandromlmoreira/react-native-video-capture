import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Svg, { Line } from "react-native-svg";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useSweep } from "../../hooks/useSweep";
import { colors, fonts, motion } from "../../theme/tokens";
import { LeaderDial } from "../brand/LeaderDial";

interface CountdownOverlayProps {
  digit: number | null;
}

export function CountdownOverlay({ digit }: CountdownOverlayProps) {
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();
  const visible = digit !== null;
  const presence = useRef(new Animated.Value(0)).current;
  const progress = useSweep(digit, visible && !reduced);
  const size = Math.min(300, Math.min(width, height) * 0.62);

  useEffect(() => {
    Animated.timing(presence, {
      toValue: visible ? 1 : 0,
      duration: visible ? 200 : 160,
      easing: motion.out,
      useNativeDriver: motion.native,
    }).start();
  }, [visible]);

  return (
    <Animated.View pointerEvents="none" style={[styles.layer, { opacity: presence }]} accessibilityLiveRegion="assertive">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Line x1="0" x2="100%" y1="50%" y2="50%" stroke={colors.bone} strokeOpacity={0.16} />
        <Line y1="0" y2="100%" x1="50%" x2="50%" stroke={colors.bone} strokeOpacity={0.16} />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.caption}>GRAVANDO EM</Text>
        <LeaderDial size={size} digit={digit} progress={progress} reducedMotion={reduced} />
        <Text style={styles.hint}>Toque em parar para cancelar</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5, 5, 5, 0.66)",
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  caption: {
    fontFamily: fonts.monoSemi,
    fontSize: 11,
    letterSpacing: 2.4,
    color: colors.bone,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
});
