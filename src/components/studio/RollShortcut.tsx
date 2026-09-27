import { StyleSheet, Text, View } from "react-native";
import { Recording } from "../../domain/recording";
import { colors, fonts } from "../../theme/tokens";
import { SlatePoster } from "../brand/SlatePoster";
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
      accessibilityLabel={`Abrir rolo com ${count} tomadas`}
      onPress={onPress}
      pressScale={0.92}
      style={({ hovered }) => [styles.frame, hovered && styles.hovered]}
    >
      {latest ? (
        <SlatePoster recording={latest} width={48} height={48} radius={12} />
      ) : (
        <View style={styles.empty}>
          <Icon name="film" size={20} />
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
    width: 56,
    height: 56,
    borderRadius: 16,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.glass,
  },
  hovered: {
    borderColor: colors.tungsten,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: colors.tungsten,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.ink,
  },
  badgeText: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    color: colors.ink,
  },
});
