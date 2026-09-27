import { StyleSheet, View } from "react-native";
import Svg, { Line, Path } from "react-native-svg";
import { colors } from "../../theme/tokens";
import { LeaderLoop } from "../brand/LeaderLoop";

const corner = "M0 26V3a3 3 0 0 1 3-3h23";

export function LeaderStage({ width, height }: { width: number; height: number }) {
  const dial = Math.min(width, height) * 0.74;
  return (
    <View style={[styles.stage, { width, height }]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke={colors.bone} strokeOpacity={0.1} />
        <Line x1={width / 2} y1={0} x2={width / 2} y2={height} stroke={colors.bone} strokeOpacity={0.1} />
      </Svg>
      {[
        { top: 14, left: 14 },
        { top: 14, right: 14, transform: [{ scaleX: -1 }] },
        { bottom: 14, left: 14, transform: [{ scaleY: -1 }] },
        { bottom: 14, right: 14, transform: [{ scaleX: -1 }, { scaleY: -1 }] },
      ].map((position, index) => (
        <Svg key={index} width={26} height={26} style={[styles.corner, position]}>
          <Path d={corner} stroke={colors.bone} strokeOpacity={0.7} strokeWidth={2} fill="none" />
        </Svg>
      ))}
      <LeaderLoop size={dial} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.sunken,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
  },
});
