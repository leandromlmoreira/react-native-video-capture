import { Ref } from "react";
import { Facing } from "../domain/recording";

export interface CaptureResult {
  uri: string;
  mimeType: string;
  blob?: Blob;
}

export interface ViewfinderHandle {
  start: (limitSeconds: number) => Promise<CaptureResult | null>;
  stop: () => void;
}

export interface ViewfinderProps {
  ref: Ref<ViewfinderHandle>;
  facing: Facing;
  demo: boolean;
  onReady: () => void;
  onFailure: (message: string) => void;
}
