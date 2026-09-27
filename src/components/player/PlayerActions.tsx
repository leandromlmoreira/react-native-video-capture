import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { shareIntent, shareRecording } from "../../actions/shareRecording";
import { padTake } from "../../domain/format";
import { Recording } from "../../domain/recording";
import * as MediaLibrary from "../../mediaLibrary";
import { colors, fonts } from "../../theme/tokens";
import { Button } from "../ui/Button";

interface PlayerActionsProps {
  recording: Recording;
  onDelete: () => Promise<void>;
  onMessage: (text: string) => void;
}

export function PlayerActions({ recording, onDelete, onMessage }: PlayerActionsProps) {
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
      onMessage("Salvo na galeria.");
    });

  if (confirming) {
    return (
      <View style={styles.confirm}>
        <Text style={styles.question}>Excluir a tomada {padTake(recording.take)} de vez?</Text>
        <View style={styles.row}>
          <Button label="Cancelar" variant="ghost" onPress={() => setConfirming(false)} />
          <Button label="Excluir" icon="trash" variant="danger" disabled={busy} onPress={() => run(onDelete)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <Button label={shareIntent.label} icon={shareIntent.icon} disabled={busy} onPress={share} />
      {MediaLibrary.isLibraryAvailable ? (
        <Button label="Salvar na galeria" icon="film" variant="ghost" disabled={busy} onPress={save} />
      ) : null}
      <Button label="Excluir" icon="trash" variant="danger" disabled={busy} onPress={() => setConfirming(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  confirm: {
    gap: 12,
  },
  question: {
    fontFamily: fonts.bodySemi,
    color: colors.paper,
    fontSize: 15,
  },
});
