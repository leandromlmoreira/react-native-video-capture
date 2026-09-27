import { StyleSheet, View } from "react-native";

export function Perforations({ width, pitch = 13 }: { width: number; pitch?: number }) {
  const count = Math.max(4, Math.floor(width / pitch));
  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.hole} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  hole: {
    width: 6,
    height: 4.5,
    borderRadius: 1.5,
    backgroundColor: "rgba(236, 230, 217, 0.2)",
  },
});
