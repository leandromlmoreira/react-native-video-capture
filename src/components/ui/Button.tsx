import { StyleSheet, Text } from "react-native";
import { colors, fonts, radii } from "../../theme/tokens";
import { Icon, IconName } from "./Icon";
import { Tappable } from "./Tappable";

type Variant = "primary" | "ghost" | "danger" | "tally";

interface ButtonProps {
  label: string;
  icon?: IconName;
  variant?: Variant;
  disabled?: boolean;
  grow?: boolean;
  onPress: () => void;
}

const palette = {
  primary: { background: colors.bone, hover: "#FFF7E8", text: colors.ink, border: colors.bone },
  ghost: { background: "transparent", hover: colors.boneWash, text: colors.bone, border: colors.lineStrong },
  danger: { background: "transparent", hover: colors.tallySoft, text: colors.tallyText, border: "rgba(255, 59, 46, 0.4)" },
  tally: { background: colors.tally, hover: colors.tallyHot, text: colors.ink, border: colors.tally },
};

export function Button({ label, icon, variant = "primary", disabled, grow, onPress }: ButtonProps) {
  const tone = palette[variant];
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      pressScale={0.97}
      style={({ hovered }) => [
        styles.base,
        { backgroundColor: hovered ? tone.hover : tone.background, borderColor: tone.border },
        grow && styles.grow,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, { color: tone.text }]} numberOfLines={1}>
        {label}
      </Text>
      {icon ? <Icon name={icon} size={18} color={tone.text} weight={1.8} /> : null}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  grow: {
    flexGrow: 1,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    letterSpacing: 0.1,
  },
});
