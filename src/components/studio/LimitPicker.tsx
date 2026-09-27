import { StyleSheet, Text, View } from "react-native";
import { formatLimit } from "../../domain/format";
import { limitOptions } from "../../domain/limit";
import { haptics } from "../../feedback/haptics";
import { colors, fonts, radii } from "../../theme/tokens";
import { Tappable } from "../ui/Tappable";

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
            accessibilityLabel={option === 0 ? "Sem limite" : `${option} segundos`}
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => {
              if (!selected) haptics.select();
              onChange(option);
            }}
            pressScale={0.94}
            style={({ hovered }) => [styles.option, hovered && !selected && styles.hovered, selected && styles.selected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{formatLimit(option).toUpperCase()}</Text>
          </Tappable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: 3,
    gap: 2,
    borderRadius: radii.sm,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignSelf: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  option: {
    minWidth: 54,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  hovered: {
    backgroundColor: colors.boneWash,
  },
  selected: {
    backgroundColor: colors.bone,
  },
  label: {
    fontFamily: fonts.monoSemi,
    fontSize: 12,
    color: colors.bone,
    letterSpacing: 0.8,
  },
  labelSelected: {
    color: colors.ink,
  },
});
