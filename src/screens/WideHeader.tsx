import { StyleSheet, Text, View } from "react-native";
import { Wordmark } from "../components/brand/Logo";
import { Tappable } from "../components/ui/Tappable";
import { colors, fonts, radii } from "../theme/tokens";

interface WideHeaderProps {
  demo: boolean;
  onBackToSetup: () => void;
}

export function WideHeader({ demo, onBackToSetup }: WideHeaderProps) {
  return (
    <View style={styles.bar}>
      <Wordmark size={30} />
      <Text style={styles.tagline}>Estúdio de vídeo de bolso</Text>
      <View style={styles.spacer} />
      {demo ? (
        <Tappable
          accessibilityRole="button"
          onPress={onBackToSetup}
          style={({ hovered }) => [styles.link, hovered && styles.linkHovered]}
        >
          <Text style={styles.linkText}>Usar minha webcam</Text>
        </Tappable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 8,
  },
  tagline: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.faint,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: colors.lineStrong,
  },
  spacer: {
    flex: 1,
  },
  link: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  linkHovered: {
    backgroundColor: "rgba(255, 238, 214, 0.06)",
  },
  linkText: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.paper,
  },
});
