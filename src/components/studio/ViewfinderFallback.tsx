import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii } from "../../theme/tokens";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

interface ViewfinderFallbackProps {
  message: string;
  onDemo?: () => void;
  onRetry: () => void;
}

export function ViewfinderFallback({ message, onDemo, onRetry }: ViewfinderFallbackProps) {
  return (
    <View style={styles.layer}>
      <View style={styles.card}>
        <View style={styles.icon}>
          <Icon name="camera" size={22} color={colors.tungsten} />
        </View>
        <Text style={styles.title}>Câmera fora de cena</Text>
        <Text style={styles.body}>{message}</Text>
        <View style={styles.actions}>
          {onDemo ? <Button label="Usar demonstração" icon="spark" onPress={onDemo} /> : null}
          <Button label="Tentar de novo" variant="ghost" onPress={onRetry} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.sunken,
  },
  card: {
    maxWidth: 380,
    alignItems: "center",
    gap: 12,
    padding: 28,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.tungstenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.display,
    color: colors.paper,
    fontSize: 22,
    letterSpacing: -0.4,
  },
  body: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  actions: {
    marginTop: 8,
    gap: 10,
    alignSelf: "stretch",
  },
});
