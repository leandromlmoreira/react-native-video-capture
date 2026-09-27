import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii } from "../../theme/tokens";

interface EyebrowProps {
  label: string;
  tone?: "tungsten" | "rec" | "go" | "muted";
}

const tones = {
  tungsten: { color: colors.tungsten, background: colors.tungstenSoft },
  rec: { color: "#FF8A7D", background: colors.recSoft },
  go: { color: colors.go, background: colors.goSoft },
  muted: { color: colors.muted, background: "rgba(255, 238, 214, 0.06)" },
};

export function Eyebrow({ label, tone = "tungsten" }: EyebrowProps) {
  const palette = tones[tone];
  return (
    <View style={[styles.pill, { backgroundColor: palette.background }]}>
      <View style={[styles.dot, { backgroundColor: palette.color }]} />
      <Text style={[styles.label, { color: palette.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
});
