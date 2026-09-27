import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

function Scrim({ id, flip, height }: { id: string; flip?: boolean; height: number }) {
  return (
    <View pointerEvents="none" style={[styles.scrim, { height }, flip ? styles.top : styles.bottom]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1={flip ? "1" : "0"} x2="0" y2={flip ? "0" : "1"}>
            <Stop offset="0" stopColor="#070606" stopOpacity="0" />
            <Stop offset="1" stopColor="#070606" stopOpacity="0.78" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

export function Scrims() {
  return (
    <>
      <Scrim id="scrim-top" flip height={140} />
      <Scrim id="scrim-bottom" height={260} />
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
