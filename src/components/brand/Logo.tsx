import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import { colors, fonts } from "../../theme/tokens";

const stripes = [0, 8, 16, 24].map((x) => `M${x} 11h4l4-10h-4z`).join(" ");

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Rect x="1" y="1" width="30" height="30" rx="9" fill={colors.tungsten} />
      <Defs>
        <ClipPath id="logo-band">
          <Path d="M1 11V10a9 9 0 0 1 9-9h12a9 9 0 0 1 9 9v1z" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#logo-band)">
        <Rect width="32" height="11" fill={colors.ink} />
        <Path d={stripes} fill={colors.tungsten} />
      </G>
      <Circle cx="16" cy="20.5" r="5.6" fill="none" stroke={colors.ink} strokeWidth="2.2" />
      <Circle cx="16" cy="20.5" r="1.8" fill={colors.rec} />
    </Svg>
  );
}

export function Wordmark({ size = 32 }: { size?: number }) {
  return (
    <View style={styles.row}>
      <LogoMark size={size} />
      <Text style={[styles.word, { fontSize: size * 0.72 }]}>tomada</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  word: {
    fontFamily: fonts.displayHeavy,
    color: colors.paper,
    letterSpacing: -0.8,
  },
});
