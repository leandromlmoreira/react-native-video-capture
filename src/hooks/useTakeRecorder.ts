import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { ViewfinderHandle } from "../capture/viewfinder.types";
import { countdownDigit } from "../domain/countdown";
import { CaptureSource, Facing, NewRecording, Recording } from "../domain/recording";
import { cues } from "../feedback/cues";
import { useElapsed } from "./useElapsed";

export type TakePhase = "idle" | "countdown" | "recording" | "saving";

interface TakeRecorderOptions {
  viewfinder: RefObject<ViewfinderHandle | null>;
  limitSeconds: number;
  countdownSeconds: number;
  facing: Facing;
  source: CaptureSource;
  onCapture: (input: NewRecording) => Promise<Recording>;
  onFinished: (recording: Recording) => void;
  onError: (message: string) => void;
}

function describe(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível gravar esta tomada.";
}

export function useTakeRecorder(options: TakeRecorderOptions) {
  const [phase, setPhase] = useState<TakePhase>("idle");
  const elapsed = useElapsed(phase === "recording");
  const countdownElapsed = useElapsed(phase === "countdown");
  const digit = phase === "countdown" ? countdownDigit(countdownElapsed, options.countdownSeconds) : null;
  const latest = useRef(options);
  latest.current = options;

  const record = useCallback(async () => {
    const current = latest.current;
    const handle = current.viewfinder.current;
    if (!handle) {
      setPhase("idle");
      return;
    }
    setPhase("recording");
    cues.rolling();
    const startedAt = Date.now();
    try {
      const result = await handle.start(current.limitSeconds);
      if (!result) return;
      cues.cut();
      setPhase("saving");
      const recording = await current.onCapture({
        ...result,
        durationMs: Date.now() - startedAt,
        facing: current.facing,
        source: current.source,
      });
      current.onFinished(recording);
    } catch (error) {
      current.onError(describe(error));
    } finally {
      setPhase("idle");
    }
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (digit === null) record();
    else cues.countdown(digit);
  }, [phase, digit, record]);

  const toggle = useCallback(() => {
    if (phase === "recording") latest.current.viewfinder.current?.stop();
    else if (phase === "countdown") setPhase("idle");
    else if (phase === "idle") {
      if (latest.current.countdownSeconds > 0) setPhase("countdown");
      else record();
    }
  }, [phase, record]);

  return { phase, elapsed, digit, toggle };
}
