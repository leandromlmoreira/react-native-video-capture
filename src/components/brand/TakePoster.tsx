import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { hashSeed, piePath, posterSweep } from "../../brand/geometry";
import { padTake } from "../../domain/format";
import { Recording } from "../../domain/recording";
import { colors, fonts } from "../../theme/tokens";

const stocks = [
  ["#262521", "#0D0D0C"],
  ["#1E2324", "#0A0C0D"],
  ["#2A2220", "#0E0B0A"],
  ["#23231D", "#0C0C09"],
];

interface TakePosterProps {
  recording: Pick<Recording, "id" | "take" | "durationMs">;
  width: number;
  height: number;
  radius?: number;
  compact?: boolean;
}

export function TakePoster({ recording, width, height, radius = 8, compact }: TakePosterProps) {
  const seed = hashSeed(recording.id);
  const [light, dark] = stocks[Math.floor(seed * stocks.length) % stocks.length];
  const cx = width * (0.58 + seed * 0.22);
  const cy = height * (0.44 + ((seed * 7) % 1) * 0.16);
  const ring = Math.max(width, height) * 0.46;
  const sweep = posterSweep(recording.durationMs);
  const angle = sweep * Math.PI * 2;
  const gradientId = `stock-${recording.id}`;

  return (
    <View style={[styles.frame, { width, height, borderRadius: radius }]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0.3" y2="1">
            <Stop offset="0" stopColor={light} />
            <Stop offset="1" stopColor={dark} />
          </LinearGradient>
        </Defs>
        <Rect width={width} height={height} fill={`url(#${gradientId})`} />
        <Line x1={0} y1={cy} x2={width} y2={cy} stroke={colors.bone} strokeOpacity={0.14} strokeWidth={1} />
        <Line x1={cx} y1={0} x2={cx} y2={height} stroke={colors.bone} strokeOpacity={0.14} strokeWidth={1} />
        <Circle cx={cx} cy={cy} r={ring} stroke={colors.bone} strokeOpacity={0.14} strokeWidth={1} fill="none" />
        <Path d={piePath(cx, cy, ring * 0.72, sweep)} fill={colors.bone} fillOpacity={0.1} />
        <Circle cx={cx} cy={cy} r={ring * 0.72} stroke={colors.bone} strokeOpacity={0.36} strokeWidth={compact ? 1.5 : 2} fill="none" />
        <Line
          x1={cx}
          y1={cy}
          x2={cx + Math.sin(angle) * ring * 0.72}
          y2={cy - Math.cos(angle) * ring * 0.72}
          stroke={colors.bone}
          strokeOpacity={0.6}
          strokeWidth={1.2}
        />
        <Circle cx={cx} cy={cy} r={compact ? 2.5 : 3.5} fill={colors.tally} />
      </Svg>
      <Text
        style={[
          styles.take,
          { fontSize: height * (compact ? 0.56 : 0.5), lineHeight: height * (compact ? 0.6 : 0.54), left: width * 0.08, bottom: height * 0.04 },
        ]}
      >
        {padTake(recording.take)}
      </Text>
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
    fontFamily: fonts.displayBlack,
    color: colors.bone,
    includeFontPadding: false,
  },
});
