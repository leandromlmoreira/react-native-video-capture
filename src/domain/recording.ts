import { padTake } from "./format";

export type CaptureSource = "camera" | "webcam" | "demo";
export type Facing = "front" | "back";

export interface Recording {
  id: string;
  take: number;
  uri: string;
  mimeType: string;
  createdAt: number;
  durationMs: number;
  facing: Facing;
  source: CaptureSource;
}

export interface NewRecording {
  uri: string;
  mimeType: string;
  durationMs: number;
  facing: Facing;
  source: CaptureSource;
  blob?: Blob;
}

export const sourceLabel: Record<CaptureSource, string> = {
  camera: "Câmera",
  webcam: "Webcam",
  demo: "Demonstração",
};

export const sourceShortLabel: Record<CaptureSource, string> = {
  camera: "Câmera",
  webcam: "Webcam",
  demo: "Demo",
};

export function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function nextTake(recordings: Pick<Recording, "take">[]) {
  return recordings.reduce((highest, item) => Math.max(highest, item.take), 0) + 1;
}

export function sortNewestFirst(recordings: Recording[]) {
  return [...recordings].sort((a, b) => b.createdAt - a.createdAt);
}

export function totalDuration(recordings: Recording[]) {
  return recordings.reduce((sum, item) => sum + item.durationMs, 0);
}

export function fileExtension(mimeType: string) {
  return mimeType.includes("mp4") ? "mp4" : mimeType.includes("quicktime") ? "mov" : "webm";
}

export function fileName(recording: Recording) {
  return `tomada-${padTake(recording.take)}.${fileExtension(recording.mimeType)}`;
}
