import * as Sharing from "expo-sharing";
import { Recording } from "../domain/recording";

export type ShareOutcome = "shared" | "downloaded" | "unavailable";

export const shareIntent: { label: string; icon: "share" | "download" } = {
  label: "Compartilhar",
  icon: "share",
};

export async function shareRecording(recording: Recording): Promise<ShareOutcome> {
  if (!(await Sharing.isAvailableAsync())) return "unavailable";
  await Sharing.shareAsync(recording.uri, {
    mimeType: recording.mimeType,
    dialogTitle: `Tomada ${recording.take}`,
  });
  return "shared";
}
