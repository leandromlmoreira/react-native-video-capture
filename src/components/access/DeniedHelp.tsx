import { Platform, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii } from "../../theme/tokens";
import { Icon } from "../ui/Icon";

const steps =
  Platform.OS === "web"
    ? [
        "Clique no cadeado ao lado do endereço do site.",
        "Em Câmera e Microfone, escolha Permitir.",
        "Volte aqui e toque em Tentar de novo.",
      ]
    : [
        "Toque em Abrir ajustes.",
        "Libere Câmera, Microfone e Fotos para o Tomada.",
        "Volte para o app. A câmera abre sozinha.",
      ];

export function DeniedHelp() {
  return (
    <View style={styles.panel} accessibilityRole="alert">
      <View style={styles.head}>
        <Icon name="cameraOff" size={20} color={colors.tallyText} />
        <Text style={styles.title}>A câmera está bloqueada</Text>
      </View>
      <Text style={styles.lead}>Sem permissão não tem tomada. Para liberar:</Text>
      {steps.map((step, index) => (
        <View key={step} style={styles.step}>
          <Text style={styles.number}>{index + 1}</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 10,
    padding: 18,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(255, 59, 46, 0.4)",
    backgroundColor: "rgba(255, 59, 46, 0.07)",
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.bone,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  lead: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  number: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: fonts.monoSemi,
    fontSize: 11,
    color: colors.ink,
    backgroundColor: colors.bone,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.bone,
  },
});
