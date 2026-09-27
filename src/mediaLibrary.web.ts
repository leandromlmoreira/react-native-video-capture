type WebPermission = { granted: boolean; canAskAgain: boolean; status: string };

const granted: WebPermission = { granted: true, canAskAgain: true, status: "granted" };

export const isLibraryAvailable = false;

export function usePermissions(): [WebPermission, () => Promise<WebPermission>] {
  return [granted, async () => granted];
}

export async function saveToLibraryAsync(_uri: string): Promise<void> {
  throw new Error("expo-media-library não é suportado na web.");
}
