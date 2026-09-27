import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { colors, fonts } from "../../theme/tokens";

function ReelArt() {
  return (
    <Svg width={168} height={120} viewBox="0 0 168 120">
      <G opacity={0.9}>
        <Circle cx="58" cy="54" r="40" fill={colors.raised} stroke={colors.lineStrong} />
        <Circle cx="58" cy="54" r="8" fill={colors.ink} stroke={colors.lineStrong} />
        {[0, 72, 144, 216, 288].map((angle) => (
          <Circle
            key={angle}
            cx={58 + Math.cos((angle * Math.PI) / 180) * 22}
            cy={54 + Math.sin((angle * Math.PI) / 180) * 22}
            r="9"
            fill={colors.ink}
          />
        ))}
      </G>
      <Path d="M92 78 C112 92 126 96 160 94" stroke={colors.tungsten} strokeWidth="10" strokeLinecap="round" fill="none" opacity={0.85} />
      {[108, 124, 140].map((x) => (
        <Rect key={x} x={x} y="88" width="6" height="4" rx="1" fill={colors.ink} />
      ))}
    </Svg>
  );
}

export function EmptyRoll({ compact }: { compact?: boolean }) {
  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <ReelArt />
      <Text style={styles.title}>O rolo está vazio</Text>
      <Text style={styles.body}>Toque no botão vermelho para gravar a primeira tomada. Ela aparece aqui na hora.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  compact: {
    paddingVertical: 32,
  },
  title: {
    marginTop: 8,
    fontFamily: fonts.display,
    color: colors.paper,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 260,
  },
});
