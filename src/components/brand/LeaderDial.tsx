import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Line } from "react-native-svg";
import { colors, fonts, motion } from "../../theme/tokens";
import { SweepDisc } from "./SweepDisc";

interface LeaderDialProps {
  size: number;
  digit: number | null;
  progress: Animated.Value;
  lit?: boolean;
  reducedMotion?: boolean;
}

function Graticule({ size }: { size: number }) {
  const center = size / 2;
  const inner = size * 0.36;
  const ticks = Array.from({ length: 24 }, (_, index) => index * 15);
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Line x1={0} y1={center} x2={size} y2={center} stroke={colors.bone} strokeOpacity={0.28} strokeWidth={1} />
      <Line x1={center} y1={0} x2={center} y2={size} stroke={colors.bone} strokeOpacity={0.28} strokeWidth={1} />
      <Circle cx={center} cy={center} r={center - 1} stroke={colors.bone} strokeOpacity={0.22} strokeWidth={1} fill="none" />
      <Circle cx={center} cy={center} r={size * 0.43} stroke={colors.bone} strokeOpacity={0.5} strokeWidth={1.5} fill="none" />
      <Circle cx={center} cy={center} r={inner} stroke={colors.bone} strokeWidth={Math.max(3, size * 0.022)} fill="none" />
      <G>
        {ticks.map((angle) => {
          const radians = (angle * Math.PI) / 180;
          const long = angle % 90 === 0;
          const from = size * (long ? 0.43 : 0.45);
          const to = size * 0.48;
          return (
            <Line
              key={angle}
              x1={center + Math.sin(radians) * from}
              y1={center - Math.cos(radians) * from}
              x2={center + Math.sin(radians) * to}
              y2={center - Math.cos(radians) * to}
              stroke={colors.bone}
              strokeOpacity={long ? 0.7 : 0.35}
              strokeWidth={long ? 2 : 1}
            />
          );
        })}
      </G>
    </Svg>
  );
}

export function LeaderDial({ size, digit, progress, lit = false, reducedMotion }: LeaderDialProps) {
  const pop = useRef(new Animated.Value(1)).current;
  const disc = size * 0.72 - Math.max(3, size * 0.022);

  useEffect(() => {
    if (reducedMotion) return;
    pop.setValue(0);
    Animated.timing(pop, { toValue: 1, duration: 420, easing: motion.shutter, useNativeDriver: motion.native }).start();
  }, [digit, lit]);

  const numberStyle = {
    opacity: pop.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }),
    transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [1.18, 1] }) }],
  };

  return (
    <View style={{ width: size, height: size }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Graticule size={size} />
      <View style={[styles.center, StyleSheet.absoluteFill]}>
        {lit ? (
          <View style={[styles.lit, { width: disc, height: disc, borderRadius: disc / 2 }]} />
        ) : (
          <SweepDisc size={disc} progress={progress} color="rgba(236, 230, 217, 0.13)" handColor={colors.bone} />
        )}
      </View>
      <Animated.View style={[styles.center, StyleSheet.absoluteFill, numberStyle]}>
        {lit ? (
          <View style={styles.recRow}>
            <View style={[styles.recDot, { width: size * 0.07, height: size * 0.07, borderRadius: size * 0.035 }]} />
            <Text style={[styles.rec, { fontSize: size * 0.16 }]}>REC</Text>
          </View>
        ) : (
          <Text style={[styles.digit, { fontSize: size * 0.46, lineHeight: size * 0.5 }]}>{digit ?? ""}</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  lit: {
    backgroundColor: colors.tally,
    shadowColor: colors.tally,
    shadowOpacity: 0.6,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  digit: {
    fontFamily: fonts.displayBlack,
    color: colors.bone,
    textAlign: "center",
    includeFontPadding: false,
  },
  recRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recDot: {
    backgroundColor: colors.bone,
  },
  rec: {
    fontFamily: fonts.displayBlack,
    color: colors.bone,
    letterSpacing: 2,
  },
});
