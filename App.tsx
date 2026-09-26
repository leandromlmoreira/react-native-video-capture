import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { useVideoPlayer, VideoView } from "expo-video";
import * as MediaLibrary from "./src/mediaLibrary";
import * as Sharing from "expo-sharing";

/**
 * Video Capture
 * Grava um vídeo com a câmera do device, reproduz num player e permite
 * salvar na galeria ou compartilhar.
 */
export default function App() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  // Na web, ./src/mediaLibrary.web.ts entra no lugar (expo-media-library
  // não tem suporte nesse ambiente); ver comentário no arquivo.
  const isWeb = Platform.OS === "web";
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  const [facing, setFacing] = useState<"front" | "back">("back");
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const player = useVideoPlayer(videoUri ?? "", (instance) => {
    instance.loop = true;
  });

  const permissionsGranted =
    cameraPermission?.granted && micPermission?.granted && mediaPermission?.granted;

  const handleRequestPermissions = async () => {
    await requestCameraPermission();
    await requestMicPermission();
    await requestMediaPermission();
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    setIsRecording(true);
    try {
      const video = await cameraRef.current.recordAsync();
      if (video?.uri) setVideoUri(video.uri);
    } catch (error) {
      Alert.alert("Erro ao gravar", String(error));
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    cameraRef.current?.stopRecording();
  };

  const handleSave = async () => {
    if (!videoUri) return;
    if (isWeb) {
      Alert.alert("Indisponível na web", "Salvar na galeria só funciona em Android/iOS.");
      return;
    }
    await MediaLibrary.saveToLibraryAsync(videoUri);
    Alert.alert("Salvo!", "O vídeo foi salvo na galeria.");
  };

  const handleShare = async () => {
    if (!videoUri) return;
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(videoUri);
    } else {
      Alert.alert("Indisponível", "Compartilhamento não é suportado neste device.");
    }
  };

  if (!cameraPermission || !micPermission || !mediaPermission) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color="#f4c542" />
      </SafeAreaView>
    );
  }

  if (!permissionsGranted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permissionText}>
          Precisamos da câmera, microfone e galeria para gravar e salvar vídeos.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleRequestPermissions}>
          <Text style={styles.buttonText}>Conceder permissões</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <CameraView ref={cameraRef} style={styles.camera} facing={facing} mode="video">
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
          >
            <Text style={styles.flipText}>Girar câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordButtonActive]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Text style={styles.recordText}>{isRecording ? "Parar" : "Gravar"}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      <Modal visible={!!videoUri} animationType="slide">
        <SafeAreaView style={styles.playerContainer}>
          {videoUri && (
            <VideoView
              player={player}
              style={styles.videoPlayer}
              nativeControls
            />
          )}

          <View style={styles.playerActions}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Salvar na galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleShare}>
              <Text style={styles.buttonText}>Compartilhar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setVideoUri(null)}
            >
              <Text style={styles.buttonText}>Gravar outro</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d10",
  },
  center: {
    flex: 1,
    backgroundColor: "#0d0d10",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  permissionText: {
    color: "#f5f5f5",
    textAlign: "center",
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 32,
    gap: 16,
  },
  flipButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  flipText: {
    color: "#fff",
  },
  recordButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(220,50,50,0.8)",
  },
  recordButtonActive: {
    backgroundColor: "rgba(220,50,50,1)",
  },
  recordText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#f4c542",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#0d0d10",
    fontWeight: "700",
    textAlign: "center",
  },
  playerContainer: {
    flex: 1,
    backgroundColor: "#0d0d10",
    justifyContent: "center",
  },
  videoPlayer: {
    width: "100%",
    height: 300,
  },
  playerActions: {
    padding: 24,
    gap: 12,
  },
  closeButton: {
    backgroundColor: "#3a3a45",
  },
});
