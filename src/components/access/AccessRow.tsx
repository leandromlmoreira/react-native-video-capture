import { Platform, StyleSheet, Text, View } from "react-native";
import { AccessItem, AccessKey, AccessStatus } from "../../capture/access";
import { colors, fonts, radii } from "../../theme/tokens";
import { Icon, IconName } from "../ui/Icon";

const isWeb = Platform.OS === "web";

const copy: Record<AccessKey, { icon: IconName; title: string; description: string }> = {
  camera: { icon: "camera", title: "Câmera", description: "Para enquadrar e gravar cada tomada." },
  microphone: { icon: "mic", title: "Microfone", description: "Para captar o som junto com a imagem." },
  library: {
    icon: "film",
    title: isWeb ? "Rolo local" : "Galeria",
    description: isWeb
      ? "As tomadas ficam guardadas neste navegador e podem ser baixadas."
      : "Para salvar os vídeos no rolo do aparelho.",
  },
};

const statusCopy: Record<AccessStatus, { label: string; color: string; background: string }> = {
  checking: { label: "Verificando", color: colors.muted, background: "rgba(255, 238, 214, 0.06)" },
  prompt: { label: "Pendente", color: colors.tungsten, background: colors.tungstenSoft },
  granted: { label: "Liberado", color: colors.go, background: colors.goSoft },
  denied: { label: "Bloqueado", color: "#FF8A7D", background: colors.recSoft },
  unavailable: { label: "Não encontrado", color: colors.muted, background: "rgba(255, 238, 214, 0.06)" },
  "not-needed": { label: "Automático", color: colors.go, background: colors.goSoft },
};

export function AccessRow({ item }: { item: AccessItem }) {
  const info = copy[item.key];
  const status = statusCopy[item.status];
  const done = item.status === "granted" || item.status === "not-needed";
  return (
    <View style={styles.row}>
      <View style={[styles.icon, done && styles.iconDone]}>
        <Icon name={done ? "check" : info.icon} size={20} color={done ? colors.go : colors.paper} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{info.title}</Text>
        <Text style={styles.description}>{info.description}</Text>
      </View>
      <View style={[styles.chip, { backgroundColor: status.background }]}>
        <Text style={[styles.chipLabel, { color: status.color }]}>{status.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  iconDone: {
    backgroundColor: colors.goSoft,
    borderColor: "transparent",
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.paper,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  chip: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 0.6,
  },
});
