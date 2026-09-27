import { StyleSheet, Text, View } from "react-native";
import { Wordmark } from "../components/brand/Logo";
import { Icon } from "../components/ui/Icon";
import { Tappable } from "../components/ui/Tappable";
import { colors, fonts, radii, type } from "../theme/tokens";

interface WideHeaderProps {
  demo: boolean;
  onBackToSetup: () => void;
}

export function WideHeader({ demo, onBackToSetup }: WideHeaderProps) {
  return (
    <View style={styles.bar}>
      <Wordmark height={26} />
      <View style={styles.rule} />
      <Text style={styles.tagline}>ESTÚDIO DE VÍDEO DE BOLSO</Text>
      <View style={styles.spacer} />
      <View style={styles.source}>
        <View style={[styles.sourceDot, demo ? styles.sourceDemo : styles.sourceLive]} />
        <Text style={styles.sourceText}>{demo ? "CENA DE DEMONSTRAÇÃO" : "WEBCAM"}</Text>
      </View>
      {demo ? (
        <Tappable
          accessibilityRole="button"
          onPress={onBackToSetup}
          style={({ hovered }) => [styles.link, hovered && styles.linkHovered]}
        >
          <Icon name="camera" size={16} />
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
    paddingHorizontal: 6,
  },
  rule: {
    width: 1,
    height: 18,
    backgroundColor: colors.lineStrong,
  },
  tagline: {
    ...type.label,
    fontSize: 10.5,
    color: colors.faint,
  },
  spacer: {
    flex: 1,
  },
  source: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sourceDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  sourceDemo: {
    backgroundColor: colors.bone,
  },
  sourceLive: {
    backgroundColor: colors.peak,
  },
  sourceText: {
    ...type.label,
    fontSize: 10.5,
    color: colors.muted,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  linkHovered: {
    backgroundColor: colors.boneWash,
  },
  linkText: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.bone,
  },
});
