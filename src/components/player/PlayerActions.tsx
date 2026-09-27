import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { shareIntent, shareRecording } from "../../actions/shareRecording";
import { padTake } from "../../domain/format";
import { Recording } from "../../domain/recording";
import { haptics } from "../../feedback/haptics";
import * as MediaLibrary from "../../mediaLibrary";
import { colors, fonts } from "../../theme/tokens";
import { Button } from "../ui/Button";

interface PlayerActionsProps {
  recording: Recording;
  stacked: boolean;
  onDelete: () => Promise<void>;
  onMessage: (text: string) => void;
}

export function PlayerActions({ recording, stacked, onDelete, onMessage }: PlayerActionsProps) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    try {
      await task();
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Algo deu errado.");
    } finally {
      setBusy(false);
    }
  };

  const share = () =>
    run(async () => {
      const outcome = await shareRecording(recording);
      if (outcome === "downloaded") onMessage("Download iniciado.");
      if (outcome === "unavailable") onMessage("Compartilhamento indisponível neste aparelho.");
    });

  const save = () =>
    run(async () => {
      await MediaLibrary.saveToLibraryAsync(recording.uri);
      haptics.cut();
      onMessage("Salvo na galeria.");
    });

  if (confirming) {
    return (
      <View style={styles.confirm}>
        <Text style={styles.question}>Excluir a tomada {padTake(recording.take)} de vez?</Text>
        <Text style={styles.detail}>O vídeo sai do rolo e não tem como desfazer.</Text>
        <View style={[styles.row, stacked && styles.column]}>
          <Button label="Cancelar" variant="ghost" grow onPress={() => setConfirming(false)} />
          <Button
            label="Excluir tomada"
            icon="trash"
            variant="tally"
            grow
            disabled={busy}
            onPress={() => {
              haptics.warn();
              run(onDelete);
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.row, stacked && styles.column]}>
      <Button label={shareIntent.label} icon={shareIntent.icon} grow disabled={busy} onPress={share} />
      {MediaLibrary.isLibraryAvailable ? (
        <Button label="Salvar na galeria" icon="download" variant="ghost" grow disabled={busy} onPress={save} />
      ) : null}
      <Button label="Excluir" icon="trash" variant="danger" grow={stacked} disabled={busy} onPress={() => setConfirming(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  column: {
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  confirm: {
    gap: 8,
  },
  question: {
    fontFamily: fonts.bodySemi,
    color: colors.bone,
    fontSize: 16,
  },
  detail: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 14,
    marginBottom: 6,
  },
});
