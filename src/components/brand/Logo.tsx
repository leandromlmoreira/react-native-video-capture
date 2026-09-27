import Svg, { Circle, Path } from "react-native-svg";
import { piePath, symbolGeometry } from "../../brand/geometry";
import { wordmark } from "../../brand/wordmark";
import { colors } from "../../theme/tokens";

interface SymbolShapesProps {
  cx: number;
  cy: number;
  radius: number;
  lit?: boolean;
  tone?: string;
}

export function SymbolShapes({ cx, cy, radius, lit = true, tone = colors.bone }: SymbolShapesProps) {
  const geometry = symbolGeometry(radius);
  return (
    <>
      <Circle cx={cx} cy={cy} r={geometry.ring} stroke={tone} strokeWidth={geometry.stroke} fill="none" />
      <Path d={piePath(cx, cy, geometry.pie, geometry.sweep)} fill={tone} />
      <Circle cx={cx} cy={cy} r={geometry.dot} fill={lit ? colors.tally : colors.ink} />
    </>
  );
}

export function LogoMark({ size = 32, lit = true }: { size?: number; lit?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="Tomada" accessibilityRole="image">
      <SymbolShapes cx={32} cy={32} radius={30} lit={lit} />
    </Svg>
  );
}

const pad = 4;

export function Wordmark({ height = 24, tone = colors.bone }: { height?: number; tone?: string }) {
  const boxWidth = wordmark.width + pad * 2;
  const boxHeight = wordmark.height + pad * 2;
  return (
    <Svg
      width={(boxWidth / boxHeight) * height}
      height={height}
      viewBox={`${-pad} ${-pad} ${boxWidth} ${boxHeight}`}
      accessibilityLabel="Tomada"
      accessibilityRole="image"
    >
      <Path d={wordmark.letters} fill={tone} />
      <SymbolShapes cx={wordmark.circle.cx} cy={wordmark.circle.cy} radius={wordmark.circle.r} tone={tone} />
    </Svg>
  );
}
