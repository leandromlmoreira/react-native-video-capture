import { StyleSheet, Text, View } from "react-native";
import { formatCountdown, formatLimit } from "../../domain/format";
import { isFinalStretch, limitProgress, remainingMs, tapeTicks } from "../../domain/limit";
import { colors, fonts } from "../../theme/tokens";

interface LimitTapeProps {
  limitSeconds: number;
  elapsedMs: number;
  recording: boolean;
}

export function LimitTape({ limitSeconds, elapsedMs, recording }: LimitTapeProps) {
  const free = limitSeconds <= 0;
  const progress = limitProgress(limitSeconds, elapsedMs);
  const remaining = remainingMs(limitSeconds, elapsedMs);
  const urgent = recording && isFinalStretch(limitSeconds, elapsedMs);

  return (
    <View style={styles.wrap} accessibilityLabel={free ? "Sem limite de duração" : `Limite de ${limitSeconds} segundos`}>
      <Text style={styles.caption}>{free ? "LIMITE LIVRE" : `LIMITE ${formatLimit(limitSeconds).toUpperCase()}`}</Text>
      <View style={styles.track}>
        {free ? (
          <View style={styles.freeLine} />
        ) : (
          tapeTicks(limitSeconds).map((tick) => (
            <View
              key={tick.position}
              style={[styles.tick, tick.major && styles.tickMajor, { left: `${tick.position * 100}%` }, tick.position <= progress && recording && styles.tickPassed]}
            />
          ))
        )}
        {!free && recording ? <View style={[styles.fill, urgent && styles.fillUrgent, { width: `${progress * 100}%` }]} /> : null}
      </View>
      <Text style={[styles.caption, styles.remaining, urgent && styles.urgent]}>
        {free ? "" : `RESTA ${formatCountdown(remaining ?? 0)}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  caption: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    letterSpacing: 1.1,
    color: colors.boneDim,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
  },
  remaining: {
    minWidth: 72,
    textAlign: "right",
  },
  urgent: {
    color: colors.tallyText,
  },
  track: {
    flex: 1,
    height: 14,
    justifyContent: "flex-end",
  },
  freeLine: {
    height: 1,
    marginBottom: 3,
    backgroundColor: colors.lineStrong,
  },
  tick: {
    position: "absolute",
    bottom: 0,
    width: 1,
    height: 5,
    marginLeft: -0.5,
    backgroundColor: "rgba(236, 230, 217, 0.45)",
  },
  tickMajor: {
    height: 10,
    backgroundColor: colors.bone,
  },
  tickPassed: {
    backgroundColor: colors.tally,
  },
  fill: {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: 3,
    backgroundColor: colors.bone,
  },
  fillUrgent: {
    backgroundColor: colors.tally,
  },
});
