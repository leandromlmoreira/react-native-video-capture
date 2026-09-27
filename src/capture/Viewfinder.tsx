import { CameraView } from "expo-camera";
import { useImperativeHandle, useRef } from "react";
import { StyleSheet } from "react-native";
import { ViewfinderProps } from "./viewfinder.types";

export function Viewfinder({ ref, facing, onReady, onFailure }: ViewfinderProps) {
  const cameraRef = useRef<CameraView>(null);

  useImperativeHandle(ref, () => ({
    start: async (limitSeconds) => {
      const video = await cameraRef.current?.recordAsync(
        limitSeconds > 0 ? { maxDuration: limitSeconds } : undefined,
      );
      return video?.uri ? { uri: video.uri, mimeType: "video/mp4" } : null;
    },
    stop: () => cameraRef.current?.stopRecording(),
  }));

  return (
    <CameraView
      ref={cameraRef}
      style={StyleSheet.absoluteFill}
      facing={facing}
      mode="video"
      onCameraReady={onReady}
      onMountError={(event) => onFailure(event.message)}
    />
  );
}
