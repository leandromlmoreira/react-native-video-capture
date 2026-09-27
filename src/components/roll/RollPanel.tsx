import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { formatClock } from "../../domain/format";
import { Recording, totalDuration } from "../../domain/recording";
import { colors, fonts } from "../../theme/tokens";
import { EmptyRoll } from "./EmptyRoll";
import { RecordingCard } from "./RecordingCard";

interface RollPanelProps {
  recordings: Recording[];
  loading: boolean;
  activeId?: string;
  onOpen: (recording: Recording) => void;
}

function summary(recordings: Recording[]) {
  if (recordings.length === 0) return "Nenhuma tomada ainda";
  const label = recordings.length === 1 ? "tomada" : "tomadas";
  return `${recordings.length} ${label} · ${formatClock(totalDuration(recordings))} no total`;
}

export function RollPanel({ recordings, loading, activeId, onOpen }: RollPanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.title}>Rolo</Text>
        <Text style={styles.summary}>{summary(recordings)}</Text>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.tungsten} style={styles.loading} />
      ) : recordings.length === 0 ? (
        <EmptyRoll />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {recordings.map((recording) => (
            <RecordingCard
              key={recording.id}
              recording={recording}
              active={recording.id === activeId}
              onPress={() => onOpen(recording)}
            />
          ))}
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
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 4,
  },
  title: {
    fontFamily: fonts.displayHeavy,
    fontSize: 32,
    color: colors.paper,
    letterSpacing: -1,
  },
  summary: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  loading: {
    marginTop: 48,
  },
  list: {
    gap: 4,
    paddingBottom: 24,
  },
});
