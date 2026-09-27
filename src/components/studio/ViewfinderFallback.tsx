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
        <View style={styles.ring}>
          <Icon name="cameraOff" size={26} color={colors.bone} />
        </View>
        <Text style={styles.code}>SEM SINAL</Text>
        <Text style={styles.title}>Câmera fora de cena</Text>
        <Text style={styles.body}>{message}</Text>
        <View style={styles.actions}>
          <Button label="Tentar de novo" icon="retry" onPress={onRetry} />
          {onDemo ? <Button label="Usar demonstração" variant="ghost" onPress={onDemo} /> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.sunken,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    gap: 10,
    padding: 28,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  ring: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  code: {
    fontFamily: fonts.monoSemi,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.tallyText,
  },
  title: {
    fontFamily: fonts.displayBlack,
    fontSize: 30,
    lineHeight: 32,
    color: colors.bone,
    textTransform: "uppercase",
    textAlign: "center",
  },
  body: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  actions: {
    marginTop: 10,
    gap: 10,
    alignSelf: "stretch",
  },
});
