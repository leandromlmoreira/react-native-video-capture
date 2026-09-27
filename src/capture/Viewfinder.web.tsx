import { CSSProperties, useEffect, useImperativeHandle, useRef } from "react";
import { Facing } from "../domain/recording";
import { startDemoScene } from "./demoScene";
import { ViewfinderProps } from "./viewfinder.types";
import { ActiveRecording, canRecordOnWeb, recordStream } from "./webRecorder";

const fill: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

function stopTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function openWebcam(facing: Facing) {
  const facingMode = facing === "front" ? "user" : "environment";
  return navigator.mediaDevices
    .getUserMedia({ video: { facingMode }, audio: true })
    .catch(() => navigator.mediaDevices.getUserMedia({ video: true }));
}

function useWebcamStream(enabled: boolean, facing: Facing, onReady: () => void, onFailure: (message: string) => void) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    openWebcam(facing)
      .then((stream) => {
        if (cancelled) return stopTracks(stream);
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        onReady();
      })
      .catch(() => onFailure("Não foi possível abrir a webcam."));
    return () => {
      cancelled = true;
      stopTracks(streamRef.current);
      streamRef.current = null;
    };
  }, [enabled, facing]);

  return { videoRef, streamRef };
}

function useDemoStream(enabled: boolean, onReady: () => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;
    const stopScene = startDemoScene(canvas);
    streamRef.current = canvas.captureStream(30);
    onReady();
    return () => {
      stopScene();
      stopTracks(streamRef.current);
      streamRef.current = null;
    };
  }, [enabled]);

  return { canvasRef, streamRef };
}

export function Viewfinder({ ref, facing, demo, onReady, onFailure }: ViewfinderProps) {
  const webcam = useWebcamStream(!demo, facing, onReady, onFailure);
  const scene = useDemoStream(demo, onReady);
  const activeRef = useRef<ActiveRecording | null>(null);

  useImperativeHandle(ref, () => ({
    start: async (limitSeconds) => {
      const stream = demo ? scene.streamRef.current : webcam.streamRef.current;
      if (!stream || !canRecordOnWeb()) {
        onFailure("Este navegador não permite gravar vídeo.");
        return null;
      }
      activeRef.current = recordStream(stream, limitSeconds);
      try {
        return await activeRef.current.finished;
      } finally {
        activeRef.current = null;
      }
    },
    stop: () => activeRef.current?.stop(),
  }));

  if (demo) return <canvas ref={scene.canvasRef} style={fill} aria-label="Cena de demonstração" />;

  return (
    <video
      ref={webcam.videoRef}
      style={{ ...fill, transform: facing === "front" ? "scaleX(-1)" : undefined }}
      autoPlay
      muted
      playsInline
    />
  );
}
