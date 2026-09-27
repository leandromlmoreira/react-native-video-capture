import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { Linking } from "react-native";
import { AccessStatus, CaptureAccess } from "../capture/access";
import * as MediaLibrary from "../mediaLibrary";

type NativePermission = { granted: boolean; canAskAgain: boolean; status: string } | null;

function toStatus(permission: NativePermission): AccessStatus {
  if (!permission) return "checking";
  if (permission.granted) return "granted";
  return permission.canAskAgain ? "prompt" : "denied";
}

export function useCaptureAccess(): CaptureAccess {
  const [camera, requestCamera] = useCameraPermissions();
  const [microphone, requestMicrophone] = useMicrophonePermissions();
  const [library, requestLibrary] = MediaLibrary.usePermissions();

  const items = [
    { key: "camera" as const, status: toStatus(camera) },
    { key: "microphone" as const, status: toStatus(microphone) },
    { key: "library" as const, status: toStatus(library) },
  ];
  const checking = items.some((item) => item.status === "checking");
  const allGranted = items.every((item) => item.status === "granted");

  return {
    items,
    mode: allGranted ? "device" : "setup",
    checking,
    blocked: items.some((item) => item.status === "denied"),
    supportsDemo: false,
    request: async () => {
      await requestCamera();
      await requestMicrophone();
      await requestLibrary();
    },
    openSettings: () => {
      Linking.openSettings();
    },
    enterDemo: () => {},
    backToSetup: () => {},
  };
}
