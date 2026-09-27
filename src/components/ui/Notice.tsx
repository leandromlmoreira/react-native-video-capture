import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { colors, fonts, motion, radii } from "../../theme/tokens";

interface NoticeProps {
  message: string | null;
  tone?: "info" | "error";
}

export function Notice({ message, tone = "info" }: NoticeProps) {
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: message ? 1 : 0,
      duration: message ? 260 : 180,
      easing: motion.out,
      useNativeDriver: motion.native,
    }).start();
  }, [message]);

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[
        styles.toast,
        tone === "error" && styles.error,
        {
          opacity: reveal,
          transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }],
        },
      ]}
    >
      <Text style={styles.text}>{message ?? ""}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    alignSelf: "center",
    maxWidth: 420,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: "rgba(20, 18, 16, 0.88)",
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  error: {
    borderColor: "rgba(255, 77, 61, 0.5)",
  },
  text: {
    fontFamily: fonts.bodyMedium,
    color: colors.paper,
    fontSize: 14,
    textAlign: "center",
  },
});
