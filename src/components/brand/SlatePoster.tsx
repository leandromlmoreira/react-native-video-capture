import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { padTake } from "../../domain/format";
import { Recording } from "../../domain/recording";
import { colors, fonts } from "../../theme/tokens";

const palettes = [
  ["#FFB547", "#5B2A10"],
  ["#FF7A59", "#3E1426"],
  ["#8FDCA8", "#0F2E24"],
  ["#8FB8FF", "#15203B"],
  ["#E3B8FF", "#2E1B45"],
];

interface SlatePosterProps {
  recording: Pick<Recording, "id" | "take">;
  width: number;
  height: number;
  radius?: number;
}

export function SlatePoster({ recording, width, height, radius = 14 }: SlatePosterProps) {
  const [light, dark] = palettes[(recording.take - 1) % palettes.length];
  const gradientId = `sky-${recording.id}`;
  const glowId = `glow-${recording.id}`;
  const band = height * 0.2;
  const stripe = band * 1.4;

  return (
    <View style={[styles.frame, { width, height, borderRadius: radius }]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor={dark} />
            <Stop offset="1" stopColor={light} stopOpacity="0.9" />
          </LinearGradient>
          <RadialGradient id={glowId} cx="0.72" cy="0.7" r="0.55">
            <Stop offset="0" stopColor="#FFF3DD" stopOpacity="0.85" />
            <Stop offset="1" stopColor={light} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill={`url(#${gradientId})`} />
        <Rect width={width} height={height} fill={`url(#${glowId})`} />
        <Circle cx={width * 0.72} cy={height * 0.7} r={height * 0.14} fill="#FFF3DD" opacity={0.9} />
        <Path
          d={`M0 ${height} L0 ${height * 0.82} Q${width * 0.3} ${height * 0.7} ${width * 0.55} ${height * 0.84} T${width} ${height * 0.78} L${width} ${height} Z`}
          fill={dark}
          opacity={0.85}
        />
        <Rect width={width} height={band} fill={colors.ink} />
        {Array.from({ length: Math.ceil(width / stripe) + 1 }, (_, index) => (
          <Path
            key={index}
            d={`M${index * stripe} ${band} L${index * stripe + stripe * 0.5} 0 L${index * stripe + stripe} 0 L${index * stripe + stripe * 0.5} ${band} Z`}
            fill={colors.paper}
            opacity={0.92}
          />
        ))}
      </Svg>
      <Text style={[styles.take, { fontSize: height * 0.3, top: band + height * 0.06 }]}>{padTake(recording.take)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: "hidden",
    backgroundColor: colors.raised,
  },
  take: {
    position: "absolute",
    left: "9%",
    fontFamily: fonts.displayHeavy,
    color: colors.paper,
    letterSpacing: -1,
  },
});
