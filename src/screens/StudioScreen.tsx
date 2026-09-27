import { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Viewfinder } from "../capture/Viewfinder";
import { ViewfinderHandle } from "../capture/viewfinder.types";
import { CaptureSource, Facing, NewRecording, Recording, sourceLabel, sourceShortLabel } from "../domain/recording";
import { FramingGuides } from "../components/studio/FramingGuides";
import { LimitPicker } from "../components/studio/LimitPicker";
import { RecordButton } from "../components/studio/RecordButton";
import { RollShortcut } from "../components/studio/RollShortcut";
import { Scrims } from "../components/studio/Scrims";
import { TallyLight } from "../components/studio/TallyLight";
import { ViewfinderFallback } from "../components/studio/ViewfinderFallback";
import { Eyebrow } from "../components/ui/Eyebrow";
import { IconButton } from "../components/ui/IconButton";
import { Notice } from "../components/ui/Notice";
import { useNotice } from "../hooks/useNotice";
import { useTakeRecorder } from "../hooks/useTakeRecorder";
import { colors } from "../theme/tokens";

interface StudioScreenProps {
  demo: boolean;
  wide: boolean;
  recordings: Recording[];
  onCapture: (input: NewRecording) => Promise<Recording>;
  onOpenRecording: (recording: Recording) => void;
  onOpenRoll: () => void;
  onEnterDemo?: () => void;
}

function captureSource(demo: boolean): CaptureSource {
  if (demo) return "demo";
  return Platform.OS === "web" ? "webcam" : "camera";
}

const sourceTone = { demo: "tungsten", webcam: "go", camera: "go" } as const;

export function StudioScreen(props: StudioScreenProps) {
  const { demo, wide, recordings } = props;
  const insets = useSafeAreaInsets();
  const viewfinder = useRef<ViewfinderHandle>(null);
  const [facing, setFacing] = useState<Facing>(Platform.OS === "web" ? "front" : "back");
  const [limit, setLimit] = useState(30);
  const [grid, setGrid] = useState(true);
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const notice = useNotice();
  const source = captureSource(demo);

  const take = useTakeRecorder({
    viewfinder,
    limitSeconds: limit,
    facing,
    source,
    onCapture: props.onCapture,
    onFinished: props.onOpenRecording,
    onError: notice.show,
  });
  const recording = take.phase === "recording";
  const progress = limit > 0 ? take.elapsed / (limit * 1000) : 0;

  return (
    <View style={[styles.stage, wide && styles.stageWide]}>
      <Viewfinder
        key={`${source}-${attempt}`}
        ref={viewfinder}
        facing={facing}
        demo={demo}
        onReady={() => {
          setReady(true);
          setFailure(null);
        }}
        onFailure={(message) => (ready ? notice.show(message) : setFailure(message))}
      />
      <Scrims />
      <FramingGuides showGrid={grid} />

      <View style={[styles.top, wide ? styles.topWide : { paddingTop: insets.top + 26 }]}>
        <TallyLight recording={recording} elapsedMs={take.elapsed} label={ready ? "PRONTO" : "AGUARDE"} />
        <View style={styles.topRight}>
          <Eyebrow label={wide ? sourceLabel[source] : sourceShortLabel[source]} tone={sourceTone[source]} />
        </View>
      </View>
      <View style={styles.notice}>
        <Notice message={notice.message} tone="error" />
      </View>

      {failure && !demo ? (
        <ViewfinderFallback
          message={failure}
          onDemo={props.onEnterDemo}
          onRetry={() => {
            setFailure(null);
            setAttempt((value) => value + 1);
          }}
        />
      ) : null}

      <View style={[styles.bottom, { paddingBottom: wide ? 32 : insets.bottom + 32 }]}>
        <LimitPicker value={limit} disabled={take.phase !== "idle"} onChange={setLimit} />
        <View style={styles.deck}>
          <View style={styles.side}>
            {wide ? (
              <IconButton icon="grid" label="Grade de enquadramento" active={grid} size={56} onPress={() => setGrid((value) => !value)} />
            ) : (
              <RollShortcut latest={recordings[0]} count={recordings.length} onPress={props.onOpenRoll} />
            )}
          </View>
          <RecordButton
            recording={recording}
            busy={take.phase === "saving"}
            disabled={!ready || Boolean(failure)}
            progress={progress}
            onPress={take.toggle}
          />
          <View style={styles.side}>
            {demo ? (
              wide ? null : <IconButton icon="grid" label="Grade de enquadramento" active={grid} size={56} onPress={() => setGrid((value) => !value)} />
            ) : (
              <IconButton
                icon="flip"
                label="Girar câmera"
                size={56}
                disabled={take.phase !== "idle"}
                onPress={() => setFacing((value) => (value === "back" ? "front" : "back"))}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: colors.sunken,
    overflow: "hidden",
  },
  stageWide: {
    borderRadius: 26,
  },
  top: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  topWide: {
    paddingTop: 28,
    paddingHorizontal: 28,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notice: {
    position: "absolute",
    top: 110,
    left: 16,
    right: 16,
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    gap: 22,
  },
  deck: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
  },
  side: {
    width: 64,
    alignItems: "center",
  },
});
