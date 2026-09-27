import { memo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

function Scrim({ id, flip, height, strength }: { id: string; flip?: boolean; height: number; strength: number }) {
  return (
    <View pointerEvents="none" style={[styles.scrim, { height }, flip ? styles.top : styles.bottom]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1={flip ? "1" : "0"} x2="0" y2={flip ? "0" : "1"}>
            <Stop offset="0" stopColor="#050505" stopOpacity="0" />
            <Stop offset="1" stopColor="#050505" stopOpacity={strength} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

function ScrimsView() {
  return (
    <>
      <Scrim id="scrim-top" flip height={150} strength={0.72} />
      <Scrim id="scrim-bottom" height={280} strength={0.82} />
    </>
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
});

export const Scrims = memo(ScrimsView);
