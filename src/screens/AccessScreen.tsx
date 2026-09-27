import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CaptureAccess } from "../capture/access";
import { AccessRow } from "../components/access/AccessRow";
import { DeniedHelp } from "../components/access/DeniedHelp";
import { LeaderStage } from "../components/access/LeaderStage";
import { Wordmark } from "../components/brand/Logo";
import { Button } from "../components/ui/Button";
import { colors, fonts, radii, type, wideBreakpoint } from "../theme/tokens";

function cameraStatus(access: CaptureAccess) {
  return access.items[0].status;
}

function hint(access: CaptureAccess) {
  const camera = cameraStatus(access);
  if (Platform.OS !== "web" || camera === "denied") return null;
  if (camera === "unavailable") return "Nenhuma câmera encontrada neste navegador. O modo demonstração grava uma cena gerada em tempo real, com o mesmo fluxo do app.";
  return "Sem webcam por perto? O modo demonstração grava uma cena gerada em tempo real, com o mesmo fluxo do app.";
}

function Actions({ access }: { access: CaptureAccess }) {
  const camera = cameraStatus(access);
  if (access.blocked && !access.supportsDemo) {
    return <Button label="Abrir ajustes" icon="external" onPress={access.openSettings} />;
  }
  if (camera === "unavailable") {
    return <Button label="Explorar no modo demonstração" icon="arrow" onPress={access.enterDemo} />;
  }
  return (
    <View style={styles.actions}>
      <Button
        label={camera === "denied" ? "Tentar de novo" : "Permitir câmera e microfone"}
        icon={camera === "denied" ? "retry" : "arrow"}
        disabled={access.checking}
        grow
        onPress={access.request}
      />
      {access.supportsDemo ? <Button label="Modo demonstração" variant="ghost" grow onPress={access.enterDemo} /> : null}
    </View>
  );
}

export function AccessScreen({ access }: { access: CaptureAccess }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width >= wideBreakpoint;
  const note = hint(access);
  const denied = access.items.some((item) => item.status === "denied");

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          wide && styles.contentWide,
          { paddingTop: insets.top + (wide ? 36 : 18), paddingBottom: insets.bottom + 36 },
        ]}
      >
        <View style={styles.brandRow}>
          <Wordmark height={wide ? 30 : 22} />
          <Text style={styles.tagline}>ESTÚDIO DE VÍDEO DE BOLSO</Text>
        </View>
        <View style={[styles.body, wide && styles.bodyWide]}>
          {wide ? null : (
            <View style={styles.mobileStage}>
              <LeaderStage width={width - 32} height={Math.min(180, height * 0.22)} />
            </View>
          )}
          <View style={[styles.copy, wide && styles.copyWide]}>
            <Text style={[styles.title, wide && (denied ? styles.titleWideCompact : styles.titleWide)]} accessibilityRole="header">
              Três, dois, um.{"\n"}
              <Text style={styles.titleHot}>Gravando.</Text>
            </Text>
            {denied ? null : (
              <Text style={styles.lead}>
                Grave tomadas com contagem, timecode e limite de duração. Reveja no player e compartilhe. Tudo fica no seu aparelho.
              </Text>
            )}
            {denied ? <DeniedHelp /> : null}
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
          {wide ? (
            <View style={styles.art}>
              <LeaderStage width={Math.min(560, width * 0.4)} height={Math.min(620, height - 180)} />
            </View>
          ) : null}
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
    gap: 22,
  },
  contentWide: {
    paddingHorizontal: 64,
    maxWidth: 1320,
    width: "100%",
    alignSelf: "center",
    gap: 40,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  tagline: {
    ...type.label,
    fontSize: 10,
    color: colors.faint,
  },
  body: {
    gap: 24,
  },
  bodyWide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 72,
  },
  mobileStage: {
    alignItems: "center",
  },
  copy: {
    gap: 18,
  },
  copyWide: {
    flex: 1,
    maxWidth: 560,
    gap: 22,
  },
  title: {
    ...type.hero,
    color: colors.bone,
    textTransform: "uppercase",
  },
  titleWide: {
    ...type.heroWide,
  },
  titleWideCompact: {
    fontSize: 80,
    lineHeight: 78,
  },
  titleHot: {
    color: colors.tally,
  },
  lead: {
    ...type.body,
    color: colors.muted,
    maxWidth: 480,
  },
  card: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  note: {
    fontFamily: fonts.body,
    color: colors.faint,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 460,
  },
  art: {
    flex: 1,
    alignItems: "center",
  },
});
