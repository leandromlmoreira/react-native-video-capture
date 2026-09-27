import { Platform, StyleSheet, Text, View } from "react-native";
import { AccessItem, AccessKey, AccessStatus } from "../../capture/access";
import { colors, fonts, radii } from "../../theme/tokens";
import { Icon, IconName } from "../ui/Icon";
import { Tag, TagTone } from "../ui/Tag";

const isWeb = Platform.OS === "web";

const copy: Record<AccessKey, { icon: IconName; title: string; description: string }> = {
  camera: { icon: "camera", title: "Câmera", description: "Enquadrar e gravar cada tomada." },
  microphone: { icon: "mic", title: "Microfone", description: "Captar o som junto com a imagem." },
  library: {
    icon: "film",
    title: isWeb ? "Rolo local" : "Galeria",
    description: isWeb ? "Tomadas guardadas neste navegador." : "Salvar os vídeos no aparelho.",
  },
};

const statusCopy: Record<AccessStatus, { label: string; tone: TagTone }> = {
  checking: { label: "Verificando", tone: "muted" },
  prompt: { label: "Pendente", tone: "bone" },
  granted: { label: "Liberado", tone: "peak" },
  denied: { label: "Bloqueado", tone: "tally" },
  unavailable: { label: "Ausente", tone: "muted" },
  "not-needed": { label: "Automático", tone: "peak" },
};

export function AccessRow({ item }: { item: AccessItem }) {
  const info = copy[item.key];
  const status = statusCopy[item.status];
  const done = item.status === "granted" || item.status === "not-needed";
  const blocked = item.status === "denied";
  return (
    <View style={styles.row} accessibilityLabel={`${info.title}: ${status.label}`}>
      <View style={[styles.icon, done && styles.iconDone, blocked && styles.iconBlocked]}>
        <Icon name={done ? "check" : info.icon} size={19} color={done ? colors.peak : blocked ? colors.tallyText : colors.bone} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{info.title}</Text>
        <Text style={styles.description}>{info.description}</Text>
      </View>
      <View style={styles.status}>
        <Tag label={status.label} tone={status.tone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  iconDone: {
    backgroundColor: colors.peakSoft,
    borderColor: "rgba(227, 242, 102, 0.3)",
  },
  iconBlocked: {
    backgroundColor: colors.tallySoft,
    borderColor: "rgba(255, 59, 46, 0.35)",
  },
  text: {
    flex: 1,
    gap: 1,
  },
  status: {
    alignSelf: "center",
  },
  title: {
    fontFamily: fonts.bodySemi,
    fontSize: 15.5,
    color: colors.bone,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.muted,
  },
});
