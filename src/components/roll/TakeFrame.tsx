import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { formatClock, formatDateTime, padTake } from "../../domain/format";
import { Recording, sourceShortLabel } from "../../domain/recording";
import { colors, fonts, motion, radii } from "../../theme/tokens";
import { Perforations } from "../brand/Perforations";
import { TakePoster } from "../brand/TakePoster";
import { Icon } from "../ui/Icon";
import { Tappable } from "../ui/Tappable";

interface TakeFrameProps {
  recording: Recording;
  width: number;
  active: boolean;
  onPress: () => void;
}

const freshWindowMs = 4000;

function useArrival(createdAt: number) {
  const fresh = useRef(Date.now() - createdAt < freshWindowMs).current;
  const arrival = useRef(new Animated.Value(fresh ? 0 : 1)).current;

  useEffect(() => {
    if (!fresh) return;
    Animated.timing(arrival, { toValue: 1, duration: 520, easing: motion.shutter, useNativeDriver: motion.native }).start();
  }, []);

  return {
    opacity: arrival,
    transform: [{ translateY: arrival.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
  };
}

export function TakeFrame({ recording, width, active, onPress }: TakeFrameProps) {
  const arrival = useArrival(recording.createdAt);
  const posterWidth = width - 2;
  const posterHeight = Math.round(posterWidth * 0.62);

  return (
    <Animated.View style={[{ width }, arrival]}>
      <Tappable
        accessibilityRole="button"
        accessibilityLabel={`Assistir tomada ${recording.take}, ${formatClock(recording.durationMs)}`}
        onPress={onPress}
        pressScale={0.97}
        style={styles.card}
      >
        {({ hovered }) => (
          <>
            <View style={[styles.strip, (hovered || active) && styles.stripLit, active && styles.stripActive]}>
              <Perforations width={posterWidth} />
              <View>
                <TakePoster recording={recording} width={posterWidth} height={posterHeight} radius={3} />
                {hovered ? (
                  <View style={styles.playLayer}>
                    <View style={styles.play}>
                      <Icon name="play" size={14} color={colors.ink} />
                    </View>
                  </View>
                ) : null}
              </View>
              <Perforations width={posterWidth} />
            </View>
            <View style={styles.meta}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>Tomada {padTake(recording.take)}</Text>
                <Text style={styles.duration}>{formatClock(recording.durationMs)}</Text>
              </View>
              <Text style={styles.sub} numberOfLines={1}>
                {`${formatDateTime(recording.createdAt)} · ${sourceShortLabel[recording.source]}`.toUpperCase()}
              </Text>
            </View>
          </>
        )}
      </Tappable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  strip: {
    backgroundColor: colors.sunken,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  stripLit: {
    borderColor: colors.lineStrong,
  },
  stripActive: {
    borderColor: colors.bone,
  },
  playLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(5, 5, 5, 0.35)",
  },
  play: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.bone,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 2,
  },
  meta: {
    gap: 3,
    paddingHorizontal: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 19,
    letterSpacing: 0.3,
    color: colors.bone,
    textTransform: "uppercase",
  },
  duration: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    color: colors.bone,
  },
  sub: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.faint,
  },
});
