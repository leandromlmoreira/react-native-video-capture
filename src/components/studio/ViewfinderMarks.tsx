import { memo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Line, Path } from "react-native-svg";

const corner = "M0 22V2a2 2 0 0 1 2-2h20";
const guide = "rgba(236, 230, 217, 0.2)";

function ViewfinderMarksView({ showGrid, inset, top }: { showGrid: boolean; inset: number; top: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {showGrid ? (
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          {["33.33%", "66.66%"].map((position) => (
            <Line key={`v${position}`} x1={position} x2={position} y1="0" y2="100%" stroke={guide} strokeWidth={1} />
          ))}
          {["33.33%", "66.66%"].map((position) => (
            <Line key={`h${position}`} y1={position} y2={position} x1="0" x2="100%" stroke={guide} strokeWidth={1} />
          ))}
        </Svg>
      ) : null}
      <View style={styles.center}>
        <Svg width={28} height={28} viewBox="0 0 28 28">
          <Path d="M14 4v7M14 17v7M4 14h7M17 14h7" stroke="rgba(236, 230, 217, 0.75)" strokeWidth={1.4} strokeLinecap="round" />
        </Svg>
      </View>
      {[
        { top, left: inset },
        { top, right: inset, transform: [{ scaleX: -1 }] },
        { bottom: inset, left: inset, transform: [{ scaleY: -1 }] },
        { bottom: inset, right: inset, transform: [{ scaleX: -1 }, { scaleY: -1 }] },
      ].map((position, index) => (
        <Svg key={index} width={22} height={22} style={[styles.corner, position]}>
          <Path d={corner} stroke="rgba(236, 230, 217, 0.9)" strokeWidth={2} fill="none" />
        </Svg>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  corner: {
    position: "absolute",
  },
});

export const ViewfinderMarks = memo(ViewfinderMarksView);
