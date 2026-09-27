import { StyleSheet, Text, View } from "react-native";
import { formatClock, formatDateTime, padTake } from "../../domain/format";
import { Recording, sourceLabel } from "../../domain/recording";
import { colors, fonts, radii } from "../../theme/tokens";
import { SlatePoster } from "../brand/SlatePoster";
import { Icon } from "../ui/Icon";
import { Tappable } from "../ui/Tappable";

interface RecordingCardProps {
  recording: Recording;
  active: boolean;
  onPress: () => void;
}

export function RecordingCard({ recording, active, onPress }: RecordingCardProps) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`Assistir tomada ${recording.take}`}
      onPress={onPress}
      pressScale={0.98}
      style={({ hovered }) => [styles.card, hovered && styles.hovered, active && styles.active]}
    >
      {({ hovered }) => (
        <>
          <SlatePoster recording={recording} width={96} height={72} radius={12} />
          <View style={styles.info}>
            <Text style={styles.title}>Tomada {padTake(recording.take)}</Text>
            <Text style={styles.meta}>{formatDateTime(recording.createdAt)}</Text>
            <View style={styles.tags}>
              <Text style={styles.duration}>{formatClock(recording.durationMs)}</Text>
              <View style={styles.dot} />
              <Text style={styles.source}>{sourceLabel[recording.source]}</Text>
            </View>
          </View>
          <View style={[styles.play, hovered && styles.playHovered]}>
            <Icon name="play" size={14} color={hovered ? colors.ink : colors.paper} />
          </View>
        </>
      )}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 8,
    paddingRight: 14,
    borderRadius: radii.md + 4,
    borderWidth: 1,
    borderColor: "transparent",
  },
  hovered: {
    backgroundColor: "rgba(255, 238, 214, 0.04)",
    borderColor: colors.line,
  },
  active: {
    backgroundColor: colors.tungstenSoft,
    borderColor: "rgba(255, 181, 71, 0.3)",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.paper,
    letterSpacing: -0.3,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  tags: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  duration: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    color: colors.tungsten,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.faint,
  },
  source: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
  },
  play: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  playHovered: {
    backgroundColor: colors.tungsten,
    borderColor: colors.tungsten,
  },
});
