import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, File, Paths } from "expo-file-system";
import {
  createId,
  fileExtension,
  nextTake,
  NewRecording,
  Recording,
  sortNewestFirst,
} from "../domain/recording";

const storageKey = "tomada:recordings";

function takesDirectory() {
  const directory = new Directory(Paths.document, "tomadas");
  if (!directory.exists) directory.create({ intermediates: true, idempotent: true });
  return directory;
}

async function readAll(): Promise<Recording[]> {
  const raw = await AsyncStorage.getItem(storageKey);
  return raw ? (JSON.parse(raw) as Recording[]) : [];
}

async function writeAll(recordings: Recording[]) {
  await AsyncStorage.setItem(storageKey, JSON.stringify(recordings));
}

export async function listRecordings() {
  const stored = await readAll();
  const available = stored.filter((item) => new File(item.uri).exists);
  if (available.length !== stored.length) await writeAll(available);
  return sortNewestFirst(available);
}

export async function addRecording(input: NewRecording) {
  const stored = await readAll();
  const id = createId();
  const target = new File(takesDirectory(), `${id}.${fileExtension(input.mimeType)}`);
  await new File(input.uri).move(target);
  const recording: Recording = {
    id,
    take: nextTake(stored),
    uri: target.uri,
    mimeType: input.mimeType,
    createdAt: Date.now(),
    durationMs: input.durationMs,
    facing: input.facing,
    source: input.source,
  };
  await writeAll([recording, ...stored]);
  return recording;
}

export async function removeRecording(recording: Recording) {
  const file = new File(recording.uri);
  if (file.exists) file.delete();
  const stored = await readAll();
  await writeAll(stored.filter((item) => item.id !== recording.id));
}
