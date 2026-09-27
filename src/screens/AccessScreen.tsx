import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CaptureAccess } from "../capture/access";
import { AccessIllustration } from "../components/access/AccessIllustration";
import { AccessRow } from "../components/access/AccessRow";
import { Ambient } from "../components/brand/Ambient";
import { Wordmark } from "../components/brand/Logo";
import { Button } from "../components/ui/Button";
import { Eyebrow } from "../components/ui/Eyebrow";
import { colors, fonts, radii, wideBreakpoint } from "../theme/tokens";

function hint(access: CaptureAccess) {
  const camera = access.items[0].status;
  if (Platform.OS !== "web") {
    return access.blocked ? "Uma permissão foi negada. Libere nos ajustes do aparelho para continuar." : null;
  }
  if (camera === "unavailable") return "Nenhuma câmera encontrada neste navegador. O modo demonstração grava uma cena gerada em tempo real, com o mesmo fluxo do app.";
  if (camera === "denied") return "O navegador bloqueou a câmera. Libere no cadeado da barra de endereço ou siga no modo demonstração.";
  return "Sem webcam por perto? O modo demonstração grava uma cena gerada em tempo real, com o mesmo fluxo do app.";
}

function Actions({ access }: { access: CaptureAccess }) {
  const cameraMissing = access.items[0].status === "unavailable";
  if (access.blocked && !access.supportsDemo) {
    return <Button label="Abrir ajustes" icon="external" onPress={access.openSettings} />;
  }
  if (cameraMissing) {
    return <Button label="Explorar no modo demonstração" icon="spark" onPress={access.enterDemo} />;
  }
  return (
    <View style={styles.actions}>
      <Button label="Permitir acesso" icon="arrow" disabled={access.checking} onPress={access.request} />
      {access.supportsDemo ? (
        <Button label="Modo demonstração" variant="ghost" onPress={access.enterDemo} />
      ) : null}
    </View>
  );
}

export function AccessScreen({ access }: { access: CaptureAccess }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width >= wideBreakpoint;
  const note = hint(access);

  return (
    <View style={styles.screen}>
      <Ambient />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          wide && styles.contentWide,
          { paddingTop: insets.top + (wide ? 40 : 20), paddingBottom: insets.bottom + 40 },
        ]}
      >
        <Wordmark size={wide ? 34 : 28} />
        <View style={[styles.body, wide && styles.bodyWide]}>
          <View style={[styles.copy, wide && styles.copyWide]}>
            <Eyebrow label="Estúdio de bolso" />
            <Text style={[styles.title, wide && styles.titleWide]}>Luz, câmera e um toque para gravar.</Text>
            <Text style={styles.lead}>
              Grave tomadas com cronômetro e limite de tempo, reveja no player e compartilhe. Tudo fica no seu aparelho.
            </Text>
            <View style={styles.card}>
              {access.items.map((item, index) => (
                <View key={item.key} style={index > 0 && styles.divider}>
                  <AccessRow item={item} />
                </View>
              ))}
            </View>
            <Actions access={access} />
            {note ? <Text style={styles.note}>{note}</Text> : null}
          </View>
          <View style={[styles.art, wide && styles.artWide]}>
            <AccessIllustration width={wide ? Math.min(520, width * 0.38) : Math.min(width - 32, 420)} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  content: {
    paddingHorizontal: 16,
    gap: 28,
  },
  contentWide: {
    paddingHorizontal: 64,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
  },
  body: {
    gap: 36,
  },
  bodyWide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 72,
    minHeight: 640,
  },
  copy: {
    gap: 20,
  },
  copyWide: {
    flex: 1,
    maxWidth: 560,
  },
  title: {
    fontFamily: fonts.displayHeavy,
    color: colors.paper,
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: -1.4,
  },
  titleWide: {
    fontSize: 64,
    lineHeight: 64,
    letterSpacing: -2.4,
  },
  lead: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 480,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  note: {
    fontFamily: fonts.body,
    color: colors.faint,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 460,
  },
  art: {
    alignItems: "center",
  },
  artWide: {
    flex: 1,
  },
});
