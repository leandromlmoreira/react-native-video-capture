import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef } from "react";
import { Animated, Modal, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { padTake } from "../../domain/format";
import { Recording } from "../../domain/recording";
import { useNotice } from "../../hooks/useNotice";
import { colors, fonts, motion, radii, wideBreakpoint } from "../../theme/tokens";
import { IconButton } from "../ui/IconButton";
import { Notice } from "../ui/Notice";
import { PlayerActions } from "./PlayerActions";
import { SlateBoard } from "./SlateBoard";

interface PlayerSheetProps {
  recording: Recording | null;
  onClose: () => void;
  onDelete: (recording: Recording) => Promise<void>;
}

function useEntrance() {
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 360, easing: motion.drawer, useNativeDriver: motion.native }).start();
  }, []);
  return {
    opacity: entrance,
    transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
  };
}

function Header({ recording, onClose }: { recording: Recording; onClose: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.heading}>
        <View style={styles.dot} />
        <Text style={styles.title} accessibilityRole="header">
          Tomada {padTake(recording.take)}
        </Text>
      </View>
      <IconButton icon="close" label="Fechar player" size={44} onPress={onClose} />
    </View>
  );
}

function PlayerBody({ recording, onClose, onDelete }: PlayerSheetProps & { recording: Recording }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width >= wideBreakpoint;
  const notice = useNotice();
  const entrance = useEntrance();
  const player = useVideoPlayer({ uri: recording.uri }, (instance) => {
    instance.loop = true;
    instance.play();
  });
  const videoHeight = Platform.OS === "web" ? undefined : Math.min(height * 0.46, 420);

  const screen = (
    <View style={[styles.screen, videoHeight ? { height: videoHeight } : styles.screenWeb, wide && styles.screenWide]}>
      <VideoView player={player} style={styles.video} contentFit="contain" nativeControls />
      <View pointerEvents="none" style={styles.notice}>
        <Notice message={notice.message} />
      </View>
    </View>
  );

  const actions = (
    <PlayerActions
      recording={recording}
      stacked={wide}
      onMessage={notice.show}
      onDelete={async () => {
        await onDelete(recording);
        onClose();
      }}
    />
  );

  if (wide) {
    return (
      <Animated.View style={[styles.sheetWide, entrance]}>
        <Header recording={recording} onClose={onClose} />
        <View style={styles.columns}>
          {screen}
          <View style={styles.aside}>
            <SlateBoard recording={recording} columns={2} />
            <View style={styles.spacer} />
            {actions}
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.sheet, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }, entrance]}>
      <Header recording={recording} onClose={onClose} />
      {screen}
      <SlateBoard recording={recording} columns={3} />
      <View style={styles.dock}>{actions}</View>
    </Animated.View>
  );
}

export function PlayerSheet(props: PlayerSheetProps) {
  const { recording, onClose } = props;
  const wide = useWindowDimensions().width >= wideBreakpoint;
  return (
    <Modal visible={Boolean(recording)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, wide && styles.backdropWide]}>
        <Pressable accessibilityLabel="Fechar player" style={StyleSheet.absoluteFill} onPress={onClose} />
        {recording ? <PlayerBody key={recording.id} {...props} recording={recording} /> : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(5, 5, 5, 0.86)",
    alignItems: "center",
    justifyContent: "center",
  },
  backdropWide: {
    padding: 32,
  },
  sheet: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.ink,
    paddingHorizontal: 16,
    gap: 16,
  },
  sheetWide: {
    width: "100%",
    maxWidth: 1080,
    gap: 20,
    padding: 24,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 30 },
  },
  columns: {
    flexDirection: "row",
    gap: 20,
    alignItems: "stretch",
  },
  aside: {
    width: 300,
    gap: 16,
  },
  spacer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.tally,
  },
  title: {
    fontFamily: fonts.displayBlack,
    color: colors.bone,
    fontSize: 40,
    lineHeight: 42,
    textTransform: "uppercase",
  },
  screen: {
    borderRadius: radii.md,
    overflow: "hidden",
    backgroundColor: colors.sunken,
    borderWidth: 1,
    borderColor: colors.line,
  },
  screenWeb: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  screenWide: {
    flex: 1,
    width: undefined,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  notice: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
  },
  dock: {
    marginTop: "auto",
  },
});
