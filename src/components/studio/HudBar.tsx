import { StyleSheet, Text, View } from "react-native";
import { formatTimecode, padTake } from "../../domain/format";
import { TakePhase } from "../../hooks/useTakeRecorder";
import { colors, fonts } from "../../theme/tokens";
import { TallyBadge } from "./TallyBadge";

interface HudBarProps {
  phase: TakePhase;
  ready: boolean;
  elapsedMs: number;
  take: number;
  wide: boolean;
}

export function HudBar({ phase, ready, elapsedMs, take, wide }: HudBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        <TallyBadge phase={phase} ready={ready} />
      </View>
      <Text
        style={[styles.timecode, wide && styles.timecodeWide, phase === "recording" && styles.timecodeLive]}
        accessibilityLabel={`Tempo gravado ${formatTimecode(elapsedMs)}`}
      >
        {formatTimecode(elapsedMs)}
      </Text>
      <View style={[styles.side, styles.sideEnd]}>
        <View style={styles.take} accessibilityLabel={`Próxima tomada ${take}`}>
          <Text style={styles.takeLabel}>TOMADA</Text>
          <Text style={styles.takeNumber}>{padTake(take)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  side: {
    flex: 1,
    flexDirection: "row",
  },
  sideEnd: {
    justifyContent: "flex-end",
  },
  timecode: {
    fontFamily: fonts.monoMedium,
    fontSize: 17,
    letterSpacing: 0.6,
    color: colors.bone,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 1 },
  },
  timecodeWide: {
    fontSize: 22,
  },
  timecodeLive: {
    color: "#FFFFFF",
  },
  take: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  takeLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: colors.muted,
    lineHeight: 28,
  },
  takeNumber: {
    fontFamily: fonts.displayBlack,
    fontSize: 21,
    lineHeight: 28,
    color: colors.bone,
  },
});
