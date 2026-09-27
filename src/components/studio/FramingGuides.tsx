import { StyleSheet, View } from "react-native";
import Svg, { Line, Path } from "react-native-svg";

const corner = "M0 26V8a8 8 0 0 1 8-8h18";

export function FramingGuides({ showGrid }: { showGrid: boolean }) {
  return (
    <View pointerEvents="none" style={styles.layer}>
      {showGrid ? (
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          {["33.33%", "66.66%"].map((position) => (
            <Line key={`v${position}`} x1={position} x2={position} y1="0" y2="100%" stroke="rgba(244,237,228,0.22)" strokeWidth={1} />
          ))}
          {["33.33%", "66.66%"].map((position) => (
            <Line key={`h${position}`} y1={position} y2={position} x1="0" x2="100%" stroke="rgba(244,237,228,0.22)" strokeWidth={1} />
          ))}
        </Svg>
      ) : null}
      {[styles.topLeft, styles.topRight, styles.bottomLeft, styles.bottomRight].map((position, index) => (
        <Svg key={index} width={26} height={26} style={[styles.corner, position]}>
          <Path d={corner} stroke="rgba(244,237,228,0.85)" strokeWidth={2} fill="none" strokeLinecap="round" />
        </Svg>
      ))}
    </View>
  );
}

const inset = 12;

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: "absolute",
  },
  topLeft: { top: inset, left: inset },
  topRight: { top: inset, right: inset, transform: [{ scaleX: -1 }] },
  bottomLeft: { bottom: inset, left: inset, transform: [{ scaleY: -1 }] },
  bottomRight: { bottom: inset, right: inset, transform: [{ scaleX: -1 }, { scaleY: -1 }] },
});
