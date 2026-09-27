import { StyleSheet, Text, View } from "react-native";
import { formatClock, formatDay, formatTime } from "../../domain/format";
import { fileExtension, Recording, sourceShortLabel } from "../../domain/recording";
import { colors, fonts, radii } from "../../theme/tokens";

function lensLabel(recording: Recording) {
  if (recording.source === "demo") return "Virtual";
  return recording.facing === "front" ? "Frontal" : "Traseira";
}

function fields(recording: Recording) {
  return [
    { label: "Data", value: formatDay(recording.createdAt) },
    { label: "Hora", value: formatTime(recording.createdAt) },
    { label: "Duração", value: formatClock(recording.durationMs), hot: true },
    { label: "Origem", value: sourceShortLabel[recording.source] },
    { label: "Lente", value: lensLabel(recording) },
    { label: "Arquivo", value: fileExtension(recording.mimeType) },
  ];
}

export function SlateBoard({ recording, columns }: { recording: Recording; columns: 2 | 3 }) {
  return (
    <View style={styles.board}>
      {fields(recording).map((field, index) => (
        <View
          key={field.label}
          style={[
            styles.cell,
            { width: `${100 / columns}%` },
            index % columns !== 0 && styles.cellDivider,
            index >= columns && styles.cellRow,
          ]}
        >
          <Text style={styles.label}>{field.label.toUpperCase()}</Text>
          <Text style={[styles.value, field.hot && styles.valueHot]} numberOfLines={1}>
            {field.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.sunken,
    overflow: "hidden",
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 2,
  },
  cellDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.line,
  },
  cellRow: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: colors.faint,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    color: colors.bone,
    textTransform: "uppercase",
  },
  valueHot: {
    color: colors.tallyText,
  },
});
