import { StyleSheet, View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

export function Ambient() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="ambient-warm" cx="0.82" cy="0.12" r="0.7">
            <Stop offset="0" stopColor="#FFB547" stopOpacity="0.16" />
            <Stop offset="1" stopColor="#FFB547" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="ambient-red" cx="0.05" cy="1" r="0.6">
            <Stop offset="0" stopColor="#FF4D3D" stopOpacity="0.08" />
            <Stop offset="1" stopColor="#FF4D3D" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#ambient-warm)" />
        <Rect width="100%" height="100%" fill="url(#ambient-red)" />
      </Svg>
    </View>
  );
}
