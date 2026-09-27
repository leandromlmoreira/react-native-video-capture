import { useCallback, useEffect, useState } from "react";
import { AccessStatus, CaptureAccess, CaptureMode } from "../capture/access";

type DeviceStatus = Exclude<AccessStatus, "not-needed">;

function hasMediaDevices() {
  return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

async function detectDevices() {
  if (!hasMediaDevices()) return { camera: false, microphone: false };
  const devices = await navigator.mediaDevices.enumerateDevices();
  return {
    camera: devices.some((device) => device.kind === "videoinput"),
    microphone: devices.some((device) => device.kind === "audioinput"),
  };
}

async function queryPermission(name: "camera" | "microphone"): Promise<DeviceStatus> {
  try {
    const result = await navigator.permissions.query({ name: name as PermissionName });
    return result.state === "granted" ? "granted" : result.state === "denied" ? "denied" : "prompt";
  } catch {
    return "prompt";
  }
}

function errorStatus(error: unknown): DeviceStatus {
  const name = error instanceof DOMException ? error.name : "";
  return name === "NotFoundError" || name === "OverconstrainedError" ? "unavailable" : "denied";
}

export function useCaptureAccess(): CaptureAccess {
  const [camera, setCamera] = useState<DeviceStatus>("checking");
  const [microphone, setMicrophone] = useState<DeviceStatus>("checking");
  const [mode, setMode] = useState<CaptureMode>("setup");

  useEffect(() => {
    let active = true;
    detectDevices()
      .then(async (found) => {
        const cameraStatus = found.camera ? await queryPermission("camera") : "unavailable";
        const microphoneStatus = found.microphone ? await queryPermission("microphone") : "unavailable";
        if (!active) return;
        setCamera(cameraStatus);
        setMicrophone(microphoneStatus);
        if (cameraStatus === "granted") setMode("device");
      })
      .catch(() => {
        if (!active) return;
        setCamera("unavailable");
        setMicrophone("unavailable");
      });
    return () => {
      active = false;
    };
  }, []);

  const request = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setCamera("granted");
      setMicrophone("granted");
      setMode("device");
    } catch (error) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setCamera("granted");
        setMicrophone(errorStatus(error));
        setMode("device");
      } catch (videoError) {
        setCamera(errorStatus(videoError));
        setMicrophone(errorStatus(error));
      }
    }
  }, []);

  return {
    items: [
      { key: "camera", status: camera },
      { key: "microphone", status: microphone },
      { key: "library", status: "not-needed" },
    ],
    mode,
    checking: camera === "checking",
    blocked: camera === "denied" || camera === "unavailable",
    supportsDemo: true,
    request,
    openSettings: () => {},
    enterDemo: () => setMode("demo"),
    backToSetup: () => setMode("setup"),
  };
}
