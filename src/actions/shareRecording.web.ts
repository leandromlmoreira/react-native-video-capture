import { fileName, Recording } from "../domain/recording";

export type ShareOutcome = "shared" | "downloaded" | "unavailable";

function canShareFiles() {
  if (typeof navigator === "undefined" || !navigator.canShare) return false;
  const probe = new File([""], "tomada.mp4", { type: "video/mp4" });
  return navigator.canShare({ files: [probe] });
}

export const shareIntent: { label: string; icon: "share" | "download" } = canShareFiles()
  ? { label: "Compartilhar", icon: "share" }
  : { label: "Baixar", icon: "download" };

function download(recording: Recording) {
  const anchor = document.createElement("a");
  anchor.href = recording.uri;
  anchor.download = fileName(recording);
  anchor.click();
}

export async function shareRecording(recording: Recording): Promise<ShareOutcome> {
  if (!canShareFiles()) {
    download(recording);
    return "downloaded";
  }
  const blob = await fetch(recording.uri).then((response) => response.blob());
  const file = new File([blob], fileName(recording), { type: recording.mimeType });
  await navigator.share({ files: [file], title: `Tomada ${recording.take}` });
  return "shared";
}
