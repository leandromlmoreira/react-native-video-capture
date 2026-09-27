import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { formatClock, formatTakeCount } from "../../domain/format";
import { Recording, totalDuration } from "../../domain/recording";
import { colors, fonts } from "../../theme/tokens";
import { EmptyRoll } from "./EmptyRoll";
import { TakeFrame } from "./TakeFrame";

interface RollPanelProps {
  recordings: Recording[];
  loading: boolean;
  activeId?: string;
  onOpen: (recording: Recording) => void;
  onRecord?: () => void;
}

const gap = 14;

function summary(recordings: Recording[]) {
  if (recordings.length === 0) return "NADA GRAVADO AINDA";
  return `${formatTakeCount(recordings.length)} · ${formatClock(totalDuration(recordings))} no total`.toUpperCase();
}

export function RollPanel({ recordings, loading, activeId, onOpen, onRecord }: RollPanelProps) {
  const [width, setWidth] = useState(0);
  const columns = width > 560 ? 3 : 2;
  const itemWidth = width > 0 ? Math.floor((width - gap * (columns - 1)) / columns) : 0;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Rolo
        </Text>
        <Text style={styles.summary}>{summary(recordings)}</Text>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.bone} style={styles.loading} />
      ) : recordings.length === 0 ? (
        <EmptyRoll onRecord={onRecord} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.grid} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
            {itemWidth > 0
              ? recordings.map((recording) => (
                  <TakeFrame
                    key={recording.id}
                    recording={recording}
                    width={itemWidth}
                    active={recording.id === activeId}
                    onPress={() => onOpen(recording)}
                  />
                ))
              : null}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 18,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  title: {
    fontFamily: fonts.displayBlack,
    fontSize: 44,
    lineHeight: 44,
    color: colors.bone,
    textTransform: "uppercase",
  },
  summary: {
    fontFamily: fonts.monoMedium,
    fontSize: 10.5,
    letterSpacing: 1,
    color: colors.muted,
  },
  loading: {
    marginTop: 48,
  },
  scroll: {
    paddingBottom: 32,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: gap,
    rowGap: 22,
  },
});
