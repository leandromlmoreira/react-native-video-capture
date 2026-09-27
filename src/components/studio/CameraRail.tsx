import { StyleSheet, View } from "react-native";
import { haptics } from "../../feedback/haptics";
import { IconButton } from "../ui/IconButton";

interface CameraRailProps {
  grid: boolean;
  canFlip: boolean;
  locked: boolean;
  onToggleGrid: () => void;
  onFlip: () => void;
}

export function CameraRail({ grid, canFlip, locked, onToggleGrid, onFlip }: CameraRailProps) {
  return (
    <View style={styles.rail}>
      <IconButton
        icon="grid"
        label="Grade dos terços"
        size={46}
        active={grid}
        onPress={() => {
          haptics.select();
          onToggleGrid();
        }}
      />
      {canFlip ? (
        <IconButton
          icon="flip"
          label="Girar câmera"
          size={46}
          disabled={locked}
          onPress={() => {
            haptics.tap();
            onFlip();
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    gap: 12,
  },
});
