import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Viewfinder } from "../capture/Viewfinder";
import { ViewfinderHandle } from "../capture/viewfinder.types";
import { CameraRail } from "../components/studio/CameraRail";
import { CountdownOverlay } from "../components/studio/CountdownOverlay";
import { HudBar } from "../components/studio/HudBar";
import { LimitPicker } from "../components/studio/LimitPicker";
import { LimitTape } from "../components/studio/LimitTape";
import { RecordButton } from "../components/studio/RecordButton";
import { RecordingFrame } from "../components/studio/RecordingFrame";
import { RollShortcut } from "../components/studio/RollShortcut";
import { Scrims } from "../components/studio/Scrims";
import { ViewfinderFallback } from "../components/studio/ViewfinderFallback";
import { ViewfinderMarks } from "../components/studio/ViewfinderMarks";
import { IconButton } from "../components/ui/IconButton";
import { Notice } from "../components/ui/Notice";
import { nextCountdown } from "../domain/countdown";
import { limitProgress, remainingWholeSeconds } from "../domain/limit";
import { CaptureSource, Facing, NewRecording, nextTake, Recording } from "../domain/recording";
import { cues } from "../feedback/cues";
import { haptics } from "../feedback/haptics";
import { useNotice } from "../hooks/useNotice";
import { useReducedMotion } from "../hooks/useReducedMotion";
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

function useFinalStretchCue(recording: boolean, limit: number, elapsed: number) {
  const seconds = recording ? remainingWholeSeconds(limit, elapsed) : null;
  useEffect(() => {
    if (seconds !== null && seconds > 0 && seconds <= 5) cues.finalSecond();
  }, [seconds]);
}

export function StudioScreen(props: StudioScreenProps) {
  const { demo, wide, recordings } = props;
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const viewfinder = useRef<ViewfinderHandle>(null);
  const [facing, setFacing] = useState<Facing>(Platform.OS === "web" ? "front" : "back");
  const [limit, setLimit] = useState(30);
  const [countdown, setCountdown] = useState(3);
  const [grid, setGrid] = useState(true);
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const notice = useNotice();
  const source = captureSource(demo);

  const take = useTakeRecorder({
    viewfinder,
    limitSeconds: limit,
    countdownSeconds: countdown,
    facing,
    source,
    onCapture: props.onCapture,
    onFinished: props.onOpenRecording,
    onError: notice.show,
  });
  const recording = take.phase === "recording";
  const locked = take.phase !== "idle";
  useFinalStretchCue(recording, limit, take.elapsed);

  const topInset = wide ? 22 : insets.top + 14;
  const limitPicker = <LimitPicker value={limit} disabled={locked} onChange={setLimit} />;

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
      <ViewfinderMarks showGrid={grid} inset={wide ? 16 : 10} top={topInset + 64} />
      <CountdownOverlay digit={take.digit} />
      <RecordingFrame live={recording} radius={wide ? 22 : 0} />

      <View style={[styles.top, wide && styles.topWide, { paddingTop: topInset }]}>
        <HudBar phase={take.phase} ready={ready} elapsedMs={take.elapsed} take={nextTake(recordings)} wide={wide} />
        <LimitTape limitSeconds={limit} elapsedMs={take.elapsed} recording={recording} />
      </View>

      <View style={[styles.rail, { top: topInset + 92 }, wide && styles.railWide]}>
        <CameraRail
          grid={grid}
          canFlip={!demo}
          locked={locked}
          onToggleGrid={() => setGrid((value) => !value)}
          onFlip={() => setFacing((value) => (value === "back" ? "front" : "back"))}
        />
      </View>

      <View pointerEvents="none" style={[styles.notice, { top: topInset + 96 }]}>
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

      <View style={[styles.bottom, wide && styles.bottomWide, { paddingBottom: wide ? 40 : insets.bottom + 26 }]}>
        {wide ? null : limitPicker}
        <View style={wide ? styles.deckWide : styles.deck}>
          <View style={wide ? styles.sideWide : styles.side}>
            {wide ? limitPicker : <RollShortcut latest={recordings[0]} count={recordings.length} onPress={props.onOpenRoll} />}
          </View>
          <RecordButton
            phase={take.phase}
            disabled={!ready || Boolean(failure)}
            progress={limitProgress(limit, take.elapsed)}
            reducedMotion={reduced}
            onPress={take.toggle}
          />
          <View style={[wide ? styles.sideWide : styles.side, styles.sideEnd]}>
            <IconButton
              icon="timer"
              label={countdown > 0 ? `Contagem regressiva de ${countdown} segundos` : "Contagem regressiva desligada"}
              caption={countdown > 0 ? `${countdown}S` : "OFF"}
              size={58}
              active={countdown > 0}
              disabled={locked}
              onPress={() => {
                haptics.select();
                setCountdown(nextCountdown);
              }}
            />
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
    borderRadius: 22,
  },
  top: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    gap: 12,
  },
  topWide: {
    paddingHorizontal: 26,
  },
  rail: {
    position: "absolute",
    right: 14,
  },
  railWide: {
    right: 26,
  },
  notice: {
    position: "absolute",
    left: 72,
    right: 72,
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    gap: 20,
  },
  bottomWide: {
    paddingHorizontal: 52,
  },
  deck: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
  },
  deckWide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  side: {
    width: 72,
    flexDirection: "row",
  },
  sideWide: {
    flex: 1,
    flexDirection: "row",
  },
  sideEnd: {
    justifyContent: "flex-end",
  },
});
