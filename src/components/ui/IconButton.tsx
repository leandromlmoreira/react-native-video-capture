import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../../theme/tokens";
import { Icon, IconName } from "./Icon";
import { Tappable } from "./Tappable";

interface IconButtonProps {
  icon: IconName;
  label: string;
  size?: number;
  active?: boolean;
  disabled?: boolean;
  caption?: string;
  onPress: () => void;
}

export function IconButton({ icon, label, size = 48, active, disabled, caption, onPress }: IconButtonProps) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      pressScale={0.9}
      style={({ hovered }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        hovered && styles.hovered,
        active && styles.active,
        disabled && styles.disabled,
      ]}
    >
      <Icon name={icon} size={size * 0.42} color={colors.bone} />
      {caption ? (
        <View style={[styles.caption, active && styles.captionActive]}>
          <Text style={[styles.captionText, active && styles.captionTextActive]}>{caption}</Text>
        </View>
      ) : null}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  hovered: {
    backgroundColor: "rgba(40, 39, 36, 0.86)",
  },
  active: {
    backgroundColor: "rgba(38, 37, 34, 0.86)",
    borderColor: colors.bone,
  },
  disabled: {
    opacity: 0.45,
  },
  caption: {
    position: "absolute",
    right: -4,
    bottom: -4,
    minWidth: 22,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  captionActive: {
    backgroundColor: colors.tally,
    borderColor: colors.ink,
  },
  captionText: {
    fontFamily: fonts.monoSemi,
    fontSize: 10,
    color: colors.bone,
  },
  captionTextActive: {
    color: colors.ink,
  },
});
