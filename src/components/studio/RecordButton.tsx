import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors, motion } from "../../theme/tokens";
import { Tappable } from "../ui/Tappable";

interface RecordButtonProps {
  recording: boolean;
  busy: boolean;
  disabled: boolean;
  progress: number;
  onPress: () => void;
}

const size = 84;
const stroke = 4;
const radius = (size - stroke) / 2;
const circumference = 2 * Math.PI * radius;

export function RecordButton({ recording, busy, disabled, progress, onPress }: RecordButtonProps) {
  const morph = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(morph, {
      toValue: recording ? 1 : 0,
      duration: 320,
      easing: motion.out,
      useNativeDriver: false,
    }).start();
  }, [recording]);

  const core = {
    width: morph.interpolate({ inputRange: [0, 1], outputRange: [64, 30] }),
    height: morph.interpolate({ inputRange: [0, 1], outputRange: [64, 30] }),
    borderRadius: morph.interpolate({ inputRange: [0, 1], outputRange: [32, 8] }),
  };

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={recording ? "Parar gravação" : "Começar a gravar"}
      accessibilityState={{ disabled: disabled || busy }}
      disabled={disabled || busy}
      onPress={onPress}
      pressScale={0.92}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(244,237,228,0.9)" strokeWidth={stroke} fill="none" />
        {recording && progress > 0 ? (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.tungsten}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - Math.min(progress, 1))}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ) : null}
      </Svg>
      <View style={styles.center}>
        {busy ? <ActivityIndicator color={colors.paper} /> : <Animated.View style={[styles.core, core]} />}
      </View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  center: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  core: {
    backgroundColor: colors.rec,
  },
});
