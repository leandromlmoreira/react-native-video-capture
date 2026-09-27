import { useVideoPlayer, VideoView } from "expo-video";
import { Modal, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatClock, formatDateTime, padTake } from "../../domain/format";
import { Recording, sourceShortLabel } from "../../domain/recording";
import { useNotice } from "../../hooks/useNotice";
import { colors, fonts, radii, wideBreakpoint } from "../../theme/tokens";
import { IconButton } from "../ui/IconButton";
import { Notice } from "../ui/Notice";
import { PlayerActions } from "./PlayerActions";

interface PlayerSheetProps {
  recording: Recording | null;
  onClose: () => void;
  onDelete: (recording: Recording) => Promise<void>;
}

function PlayerBody({ recording, onClose, onDelete }: PlayerSheetProps & { recording: Recording }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width >= wideBreakpoint;
  const notice = useNotice();
  const player = useVideoPlayer({ uri: recording.uri }, (instance) => {
    instance.loop = true;
    instance.play();
  });
  const videoHeight = Platform.OS === "web" ? undefined : Math.min(height * 0.5, 420);

  return (
    <View style={wide ? styles.sheetWide : [styles.sheet, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.kicker}>{formatDateTime(recording.createdAt)}</Text>
          <Text style={styles.title}>Tomada {padTake(recording.take)}</Text>
        </View>
        <IconButton icon="close" label="Fechar player" size={44} onPress={onClose} />
      </View>
      <View style={[styles.screen, videoHeight ? { height: videoHeight } : styles.screenWeb]}>
        <VideoView player={player} style={styles.video} contentFit="contain" nativeControls />
        <View pointerEvents="none" style={styles.notice}>
          <Notice message={notice.message} />
        </View>
      </View>
      <View style={styles.facts}>
        <Fact label="Duração" value={formatClock(recording.durationMs)} />
        <Fact label="Origem" value={sourceShortLabel[recording.source]} />
        <Fact label="Lente" value={lensLabel(recording)} />
      </View>
      <View style={!wide && styles.dock}>
        <PlayerActions
          recording={recording}
          onMessage={notice.show}
          onDelete={async () => {
            await onDelete(recording);
            onClose();
          }}
        />
      </View>
    </View>
  );
}

function lensLabel(recording: Recording) {
  if (recording.source === "demo") return "Virtual";
  return recording.facing === "front" ? "Frontal" : "Traseira";
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

export function PlayerSheet(props: PlayerSheetProps) {
  const { recording, onClose } = props;
  const wide = useWindowDimensions().width >= wideBreakpoint;
  return (
    <Modal visible={Boolean(recording)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, wide && styles.backdropWide]}>
        <Pressable accessibilityLabel="Fechar" style={StyleSheet.absoluteFill} onPress={onClose} />
        {recording ? <PlayerBody key={recording.id} {...props} recording={recording} /> : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(7, 6, 6, 0.82)",
    alignItems: "center",
    justifyContent: "center",
  },
  backdropWide: {
    padding: 24,
  },
  dock: {
    marginTop: "auto",
  },
  notice: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
  },
  sheet: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.ink,
    paddingHorizontal: 16,
    gap: 18,
  },
  sheetWide: {
    width: "100%",
    maxWidth: 760,
    gap: 18,
    padding: 28,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    gap: 2,
  },
  kicker: {
    fontFamily: fonts.mono,
    color: colors.tungsten,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: fonts.displayHeavy,
    color: colors.paper,
    fontSize: 32,
    letterSpacing: -1,
  },
  screen: {
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: colors.sunken,
    borderWidth: 1,
    borderColor: colors.line,
  },
  screenWeb: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  facts: {
    flexDirection: "row",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  fact: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 4,
  },
  factLabel: {
    fontFamily: fonts.mono,
    color: colors.faint,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  factValue: {
    fontFamily: fonts.bodySemi,
    color: colors.paper,
    fontSize: 15,
  },
});
