import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { piePath } from "../../brand/geometry";
import { colors, fonts } from "../../theme/tokens";
import { Button } from "../ui/Button";

const frames = [8, 80, 152];
const holes = Array.from({ length: 16 }, (_, index) => 8 + index * 13.5);

function BlankStrip() {
  return (
    <Svg width={232} height={104} viewBox="0 0 232 104" accessibilityElementsHidden>
      <Rect x={0.5} y={0.5} width={231} height={103} rx={6} fill={colors.sunken} stroke={colors.lineStrong} />
      {holes.map((x) => (
        <G key={x}>
          <Rect x={x} y={6} width={6} height={5} rx={1.5} fill={colors.bone} fillOpacity={0.18} />
          <Rect x={x} y={93} width={6} height={5} rx={1.5} fill={colors.bone} fillOpacity={0.18} />
        </G>
      ))}
      {frames.map((x, index) => (
        <Rect
          key={x}
          x={x}
          y={17}
          width={64}
          height={70}
          rx={3}
          fill={index === 1 ? colors.raised : "none"}
          stroke={colors.bone}
          strokeOpacity={index === 1 ? 0.3 : 0.14}
          strokeDasharray={index === 1 ? undefined : "4 4"}
        />
      ))}
      <Circle cx={112} cy={52} r={20} stroke={colors.bone} strokeOpacity={0.55} strokeWidth={4} fill="none" />
      <Path d={piePath(112, 52, 12, 0.75)} fill={colors.bone} fillOpacity={0.55} />
      <Circle cx={112} cy={52} r={3.2} fill={colors.tally} />
    </Svg>
  );
}

export function EmptyRoll({ onRecord }: { onRecord?: () => void }) {
  return (
    <View style={styles.wrap}>
      <BlankStrip />
      <Text style={styles.title}>Rolo vazio</Text>
      <Text style={styles.body}>Nenhuma tomada ainda. Grave a primeira e ela aparece aqui, numerada, assim que você cortar.</Text>
      {onRecord ? <Button label="Ir para a câmera" icon="camera" onPress={onRecord} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 12,
    fontFamily: fonts.displayBlack,
    color: colors.bone,
    fontSize: 32,
    lineHeight: 34,
    textTransform: "uppercase",
  },
  body: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 290,
    marginBottom: 8,
  },
});
