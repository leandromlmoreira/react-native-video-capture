import { RefObject, useCallback, useState } from "react";
import { ViewfinderHandle } from "../capture/viewfinder.types";
import { CaptureSource, Facing, NewRecording, Recording } from "../domain/recording";
import { useElapsed } from "./useElapsed";

export type TakePhase = "idle" | "recording" | "saving";

interface TakeRecorderOptions {
  viewfinder: RefObject<ViewfinderHandle | null>;
  limitSeconds: number;
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

  const record = useCallback(async () => {
    const handle = options.viewfinder.current;
    if (!handle) return;
    setPhase("recording");
    const startedAt = Date.now();
    try {
      const result = await handle.start(options.limitSeconds);
      if (!result) return;
      setPhase("saving");
      const recording = await options.onCapture({
        ...result,
        durationMs: Date.now() - startedAt,
        facing: options.facing,
        source: options.source,
      });
      options.onFinished(recording);
    } catch (error) {
      options.onError(describe(error));
    } finally {
      setPhase("idle");
    }
  }, [options]);

  const toggle = useCallback(() => {
    if (phase === "recording") options.viewfinder.current?.stop();
    else if (phase === "idle") record();
  }, [phase, record, options.viewfinder]);

  return { phase, elapsed, toggle };
}
