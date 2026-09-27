import { StyleSheet, Text, View } from "react-native";
import { Recording } from "../../domain/recording";
import { colors, fonts, radii } from "../../theme/tokens";
import { TakePoster } from "../brand/TakePoster";
import { Icon } from "../ui/Icon";
import { Tappable } from "../ui/Tappable";

interface RollShortcutProps {
  latest: Recording | undefined;
  count: number;
  onPress: () => void;
}

export function RollShortcut({ latest, count, onPress }: RollShortcutProps) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={count > 0 ? `Abrir rolo com ${count} tomadas` : "Abrir rolo vazio"}
      onPress={onPress}
      pressScale={0.92}
      style={({ hovered }) => [styles.frame, hovered && styles.hovered]}
    >
      {latest ? (
        <TakePoster recording={latest} width={50} height={50} radius={9} compact />
      ) : (
        <View style={styles.empty}>
          <Icon name="film" size={22} />
        </View>
      )}
      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      ) : null}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: 58,
    height: 58,
    borderRadius: radii.md,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.glass,
  },
  hovered: {
    borderColor: colors.bone,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -7,
    right: -7,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: colors.bone,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.ink,
  },
  badgeText: {
    fontFamily: fonts.monoSemi,
    fontSize: 11,
    color: colors.ink,
  },
});
