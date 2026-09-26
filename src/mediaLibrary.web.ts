// expo-media-library não tem suporte na web. Este stub evita que o bundle
// web quebre ao importar o módulo nativo, e deixa claro que a
// funcionalidade "salvar na galeria" só existe em Android/iOS.
export function usePermissions(): [{ granted: boolean }, () => Promise<{ granted: boolean }>] {
  return [{ granted: true }, async () => ({ granted: true })];
}

export async function saveToLibraryAsync(_uri: string): Promise<void> {
  throw new Error("expo-media-library não é suportado na web.");
}
