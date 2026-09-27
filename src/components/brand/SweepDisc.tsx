import { Animated, StyleSheet, View } from "react-native";

interface SweepDiscProps {
  size: number;
  progress: Animated.Value;
  color: string;
  handColor: string;
}

function rotation(progress: Animated.Value, from: number, to: number) {
  return progress.interpolate({ inputRange: [from, to], outputRange: ["0deg", "180deg"], extrapolate: "clamp" });
}

export function SweepDisc({ size, progress, color, handColor }: SweepDiscProps) {
  const half = size / 2;
  const disc = { width: half, height: size, backgroundColor: color };
  const hand = progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View pointerEvents="none" style={[styles.box, { width: size, height: size, borderRadius: half }]}>
      <View style={[styles.clip, { left: half, width: half, height: size }]}>
        <Animated.View style={[styles.layer, { width: size, height: size, left: -half, transform: [{ rotate: rotation(progress, 0, 0.5) }] }]}>
          <View style={[disc, { borderTopLeftRadius: half, borderBottomLeftRadius: half }]} />
        </Animated.View>
      </View>
      <View style={[styles.clip, { left: 0, width: half, height: size }]}>
        <Animated.View style={[styles.layer, { width: size, height: size, left: 0, transform: [{ rotate: rotation(progress, 0.5, 1) }] }]}>
          <View style={[disc, { left: half, borderTopRightRadius: half, borderBottomRightRadius: half }]} />
        </Animated.View>
      </View>
      <Animated.View style={[styles.layer, { width: size, height: size, transform: [{ rotate: hand }] }]}>
        <View style={[styles.hand, { left: half - 1, height: half, backgroundColor: handColor }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    overflow: "hidden",
  },
  clip: {
    position: "absolute",
    top: 0,
    overflow: "hidden",
  },
  layer: {
    position: "absolute",
    top: 0,
  },
  hand: {
    position: "absolute",
    top: 0,
    width: 2,
  },
});
