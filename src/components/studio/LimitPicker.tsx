import { StyleSheet, Text, View } from "react-native";
import { formatLimit } from "../../domain/format";
import { colors, fonts, radii } from "../../theme/tokens";
import { Tappable } from "../ui/Tappable";

export const limitOptions = [15, 30, 60, 0];

interface LimitPickerProps {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

export function LimitPicker({ value, disabled, onChange }: LimitPickerProps) {
  return (
    <View style={[styles.track, disabled && styles.disabled]} accessibilityRole="radiogroup" accessibilityLabel="Limite de duração">
      {limitOptions.map((option) => {
        const selected = option === value;
        return (
          <Tappable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onChange(option)}
            pressScale={0.94}
            style={({ hovered }) => [styles.option, hovered && !selected && styles.hovered, selected && styles.selected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{formatLimit(option)}</Text>
          </Tappable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: 4,
    gap: 2,
    borderRadius: radii.pill,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignSelf: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  option: {
    paddingHorizontal: 14,
    height: 32,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  hovered: {
    backgroundColor: "rgba(255, 238, 214, 0.08)",
  },
  selected: {
    backgroundColor: colors.paper,
  },
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    color: colors.paper,
    letterSpacing: 0.4,
  },
  labelSelected: {
    color: colors.ink,
  },
});
