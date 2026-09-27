import { CaptureResult } from "./viewfinder.types";

const candidates = [
  "video/mp4;codecs=avc1",
  "video/mp4",
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
];

export function canRecordOnWeb() {
  return typeof MediaRecorder !== "undefined";
}

function pickMimeType() {
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

export interface ActiveRecording {
  finished: Promise<CaptureResult | null>;
  stop: () => void;
}

export function recordStream(stream: MediaStream, limitSeconds: number): ActiveRecording {
  const mimeType = pickMimeType();
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const chunks: Blob[] = [];
  let timer: ReturnType<typeof setTimeout> | undefined;

  const stop = () => {
    if (timer) clearTimeout(timer);
    if (recorder.state !== "inactive") recorder.stop();
  };

  const finished = new Promise<CaptureResult | null>((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onerror = () => reject(new Error("A gravação foi interrompida pelo navegador."));
    recorder.onstop = () => {
      if (chunks.length === 0) return resolve(null);
      const type = (recorder.mimeType || mimeType || "video/webm").split(";")[0];
      const blob = new Blob(chunks, { type });
      resolve({ uri: URL.createObjectURL(blob), mimeType: type, blob });
    };
  });

  recorder.start(250);
  if (limitSeconds > 0) timer = setTimeout(stop, limitSeconds * 1000);
  return { finished, stop };
}
