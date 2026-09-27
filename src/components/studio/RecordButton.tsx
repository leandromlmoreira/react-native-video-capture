import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { TakePhase } from "../../hooks/useTakeRecorder";
import { colors, motion } from "../../theme/tokens";
import { Tappable } from "../ui/Tappable";

interface RecordButtonProps {
  phase: TakePhase;
  disabled: boolean;
  progress: number;
  reducedMotion: boolean;
  onPress: () => void;
}

const size = 88;
const stroke = 3;
const radius = (size - stroke) / 2;
const circumference = 2 * Math.PI * radius;

function useLoop(value: Animated.Value, running: boolean, duration: number) {
  useEffect(() => {
    if (!running) {
      value.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(value, { toValue: 1, duration, easing: Easing.out(Easing.quad), useNativeDriver: motion.native }),
    );
    loop.start();
    return () => loop.stop();
  }, [running]);
}

function accessibilityLabel(phase: TakePhase) {
  if (phase === "recording") return "Parar gravação";
  if (phase === "countdown") return "Cancelar contagem";
  return "Começar a gravar";
}

export function RecordButton({ phase, disabled, progress, reducedMotion, onPress }: RecordButtonProps) {
  const morph = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const recording = phase === "recording";
  const armed = phase === "countdown";
  useLoop(halo, recording && !reducedMotion, 1400);

  useEffect(() => {
    Animated.timing(morph, {
      toValue: recording || armed ? 1 : 0,
      duration: reducedMotion ? 0 : 280,
      easing: motion.shutter,
      useNativeDriver: motion.native,
    }).start();
  }, [recording, armed]);

  const circle = {
    opacity: morph.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [{ scale: morph.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }) }],
  };
  const square = {
    opacity: morph,
    transform: [{ scale: morph.interpolate({ inputRange: [0, 1], outputRange: [1.6, 1] }) }],
  };
  const haloStyle = {
    opacity: halo.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
    transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [1, 1.45] }) }],
  };

  return (
    <View style={styles.wrap}>
      {recording ? <Animated.View pointerEvents="none" style={[styles.halo, haloStyle]} /> : null}
      <Tappable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel(phase)}
        accessibilityState={{ disabled: disabled || phase === "saving" }}
        disabled={disabled || phase === "saving"}
        onPress={onPress}
        pressScale={0.9}
        style={[styles.button, disabled && styles.disabled]}
      >
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.bone} strokeWidth={stroke} fill="rgba(12, 12, 11, 0.35)" />
          {recording && progress > 0 ? (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.tally}
              strokeWidth={stroke + 1}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference * (1 - Math.min(progress, 1))}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          ) : null}
        </Svg>
        {phase === "saving" ? (
          <ActivityIndicator color={colors.bone} />
        ) : (
          <>
            <Animated.View style={[styles.core, circle]} />
            <Animated.View style={[styles.square, armed && styles.squareArmed, square]} />
          </>
        )}
      </Tappable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.tally,
  },
  button: {
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  core: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.tally,
  },
  square: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: colors.tally,
  },
  squareArmed: {
    backgroundColor: colors.bone,
  },
});
