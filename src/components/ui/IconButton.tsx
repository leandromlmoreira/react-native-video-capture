import { StyleSheet } from "react-native";
import { colors } from "../../theme/tokens";
import { Icon, IconName } from "./Icon";
import { Tappable } from "./Tappable";

interface IconButtonProps {
  icon: IconName;
  label: string;
  size?: number;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export function IconButton({ icon, label, size = 48, active, disabled, onPress }: IconButtonProps) {
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
      <Icon name={icon} size={size * 0.42} color={active ? colors.tungsten : colors.paper} />
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
    backgroundColor: "rgba(40, 36, 32, 0.8)",
  },
  active: {
    backgroundColor: "rgba(40, 28, 12, 0.72)",
    borderColor: "rgba(255, 181, 71, 0.55)",
  },
  disabled: {
    opacity: 0.35,
  },
});
