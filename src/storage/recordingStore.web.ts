import { createId, nextTake, NewRecording, Recording, sortNewestFirst } from "../domain/recording";

type StoredRecording = Omit<Recording, "uri"> & { blob: Blob };

const databaseName = "tomada";
const storeName = "recordings";
const objectUrls = new Map<string, string>();

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const request = action(database.transaction(storeName, mode).objectStore(storeName));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function toRecording({ blob, ...meta }: StoredRecording): Recording {
  const cached = objectUrls.get(meta.id);
  const uri = cached ?? URL.createObjectURL(blob);
  objectUrls.set(meta.id, uri);
  return { ...meta, uri };
}

async function readBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return response.blob();
}

async function readAll() {
  if (typeof indexedDB === "undefined") return [];
  return run<StoredRecording[]>("readonly", (store) => store.getAll());
}

export async function listRecordings() {
  const stored = await readAll();
  return sortNewestFirst(stored.map(toRecording));
}

export async function addRecording(input: NewRecording) {
  const stored = await readAll();
  const blob = input.blob ?? (await readBlob(input.uri));
  const entry: StoredRecording = {
    id: createId(),
    take: nextTake(stored),
    mimeType: input.mimeType,
    createdAt: Date.now(),
    durationMs: input.durationMs,
    facing: input.facing,
    source: input.source,
    blob,
  };
  await run("readwrite", (store) => store.put(entry));
  objectUrls.set(entry.id, input.uri);
  return toRecording(entry);
}

export async function removeRecording(recording: Recording) {
  await run("readwrite", (store) => store.delete(recording.id));
  const uri = objectUrls.get(recording.id);
  if (uri) URL.revokeObjectURL(uri);
  objectUrls.delete(recording.id);
}
