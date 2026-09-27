import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii } from "../../theme/tokens";
import { Icon, IconName } from "./Icon";
import { Tappable } from "./Tappable";

type Variant = "primary" | "ghost" | "danger";

interface ButtonProps {
  label: string;
  icon?: IconName;
  variant?: Variant;
  disabled?: boolean;
  onPress: () => void;
}

const palette = {
  primary: { background: colors.tungsten, hover: "#FFC46B", text: colors.ink, bubble: "rgba(11, 10, 9, 0.12)" },
  ghost: { background: "rgba(255, 238, 214, 0.06)", hover: "rgba(255, 238, 214, 0.11)", text: colors.paper, bubble: "rgba(255, 238, 214, 0.08)" },
  danger: { background: colors.recSoft, hover: "rgba(255, 77, 61, 0.24)", text: "#FF8A7D", bubble: "rgba(255, 77, 61, 0.16)" },
};

export function Button({ label, icon, variant = "primary", disabled, onPress }: ButtonProps) {
  const tone = palette[variant];
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ hovered }) => [
        styles.base,
        { backgroundColor: hovered ? tone.hover : tone.background },
        variant !== "primary" && styles.outlined,
        !icon && styles.noIcon,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, { color: tone.text }]}>{label}</Text>
      {icon ? (
        <View style={[styles.bubble, { backgroundColor: tone.bubble }]}>
          <Icon name={icon} size={16} color={tone.text} weight={1.8} />
        </View>
      ) : null}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radii.pill,
    paddingLeft: 22,
    paddingRight: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.line,
  },
  noIcon: {
    paddingRight: 22,
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    letterSpacing: 0.1,
  },
  bubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
