import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ambient } from "../components/brand/Ambient";
import { RollPanel } from "../components/roll/RollPanel";
import { IconButton } from "../components/ui/IconButton";
import { Recording } from "../domain/recording";
import { colors } from "../theme/tokens";

interface RollScreenProps {
  recordings: Recording[];
  loading: boolean;
  onBack: () => void;
  onOpen: (recording: Recording) => void;
}

export function RollScreen({ recordings, loading, onBack, onOpen }: RollScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom }]}>
      <Ambient />
      <View style={styles.bar}>
        <IconButton icon="back" label="Voltar ao estúdio" size={44} onPress={onBack} />
      </View>
      <RollPanel recordings={recordings} loading={loading} onOpen={onOpen} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.ink,
    paddingHorizontal: 8,
  },
  bar: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
});
