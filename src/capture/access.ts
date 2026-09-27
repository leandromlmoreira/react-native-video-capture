export type AccessStatus = "checking" | "prompt" | "granted" | "denied" | "unavailable" | "not-needed";
export type AccessKey = "camera" | "microphone" | "library";
export type CaptureMode = "setup" | "device" | "demo";

export interface AccessItem {
  key: AccessKey;
  status: AccessStatus;
}

export interface CaptureAccess {
  items: AccessItem[];
  mode: CaptureMode;
  checking: boolean;
  blocked: boolean;
  supportsDemo: boolean;
  request: () => Promise<void>;
  openSettings: () => void;
  enterDemo: () => void;
  backToSetup: () => void;
}
