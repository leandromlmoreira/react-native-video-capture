import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii } from "../../theme/tokens";

export type TagTone = "bone" | "tally" | "peak" | "muted";

const tones = {
  bone: { color: colors.bone, background: colors.boneWash, border: colors.lineStrong },
  tally: { color: colors.tallyText, background: colors.tallySoft, border: "rgba(255, 59, 46, 0.35)" },
  peak: { color: colors.peak, background: colors.peakSoft, border: "rgba(227, 242, 102, 0.28)" },
  muted: { color: colors.muted, background: "transparent", border: colors.line },
};

export function Tag({ label, tone = "bone", dot }: { label: string; tone?: TagTone; dot?: boolean }) {
  const palette = tones[tone];
  return (
    <View style={[styles.tag, { backgroundColor: palette.background, borderColor: palette.border }]}>
      {dot ? <View style={[styles.dot, { backgroundColor: palette.color }]} /> : null}
      <Text style={[styles.label, { color: palette.color }]} numberOfLines={1}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: radii.xs,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: 10.5,
    letterSpacing: 1.1,
  },
});
