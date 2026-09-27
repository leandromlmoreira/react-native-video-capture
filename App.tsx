import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogoMark } from "./src/components/brand/Logo";
import { PlayerSheet } from "./src/components/player/PlayerSheet";
import { RollPanel } from "./src/components/roll/RollPanel";
import { Recording } from "./src/domain/recording";
import { useCaptureAccess } from "./src/hooks/useCaptureAccess";
import { useRecordings } from "./src/hooks/useRecordings";
import { AccessScreen } from "./src/screens/AccessScreen";
import { RollScreen } from "./src/screens/RollScreen";
import { StudioScreen } from "./src/screens/StudioScreen";
import { WideHeader } from "./src/screens/WideHeader";
import { colors, wideBreakpoint } from "./src/theme/tokens";
import { useAppFonts } from "./src/theme/useAppFonts";

SplashScreen.preventAutoHideAsync().catch(() => {});

function Splash() {
  return (
    <View style={[styles.root, styles.center]}>
      <LogoMark size={72} />
    </View>
  );
}

function Studio() {
  const access = useCaptureAccess();
  const roll = useRecordings();
  const { width } = useWindowDimensions();
  const wide = width >= wideBreakpoint;
  const [selected, setSelected] = useState<Recording | null>(null);
  const [rollOpen, setRollOpen] = useState(false);

  if (access.checking && access.mode === "setup") return <Splash />;
  if (access.mode === "setup") return <AccessScreen access={access} />;

  const demo = access.mode === "demo";
  const studio = (
    <StudioScreen
      demo={demo}
      wide={wide}
      recordings={roll.recordings}
      onCapture={roll.add}
      onOpenRecording={setSelected}
      onOpenRoll={() => setRollOpen(true)}
      onEnterDemo={access.supportsDemo ? access.enterDemo : undefined}
    />
  );

  return (
    <View style={styles.root}>
      {wide ? (
        <View style={styles.wide}>
          <WideHeader demo={demo} onBackToSetup={access.backToSetup} />
          <View style={styles.columns}>
            <View style={styles.stage}>{studio}</View>
            <View style={styles.aside}>
              <RollPanel recordings={roll.recordings} loading={roll.loading} activeId={selected?.id} onOpen={setSelected} />
            </View>
          </View>
        </View>
      ) : (
        <>
          {studio}
          {rollOpen ? (
            <RollScreen recordings={roll.recordings} loading={roll.loading} onBack={() => setRollOpen(false)} onOpen={setSelected} />
          ) : null}
        </>
      )}
      <PlayerSheet recording={selected} onClose={() => setSelected(null)} onDelete={roll.remove} />
    </View>
  );
}

export default function App() {
  const fontsReady = useAppFonts();

  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync().catch(() => {});
  }, [fontsReady]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {fontsReady ? <Studio /> : <Splash />}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  wide: {
    flex: 1,
    padding: 22,
    gap: 18,
  },
  columns: {
    flex: 1,
    flexDirection: "row",
    gap: 18,
  },
  stage: {
    flex: 1,
    padding: 5,
    borderRadius: 27,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  aside: {
    width: 384,
    paddingTop: 22,
    paddingHorizontal: 22,
    borderRadius: 27,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
