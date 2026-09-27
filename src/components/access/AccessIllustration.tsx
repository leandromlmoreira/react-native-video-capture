import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { colors } from "../../theme/tokens";

const bracket = "M0 22V6a6 6 0 0 1 6-6h16";

export function AccessIllustration({ width }: { width: number }) {
  const height = width * 0.86;
  return (
    <Svg width={width} height={height} viewBox="0 0 400 344">
      <Defs>
        <LinearGradient id="access-sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#140E0B" />
          <Stop offset="0.6" stopColor="#4B2616" />
          <Stop offset="1" stopColor="#F29A3E" />
        </LinearGradient>
        <RadialGradient id="access-sun" cx="0.5" cy="0.62" r="0.42">
          <Stop offset="0" stopColor="#FFF0D6" stopOpacity="1" />
          <Stop offset="0.2" stopColor="#FFC46B" stopOpacity="0.8" />
          <Stop offset="1" stopColor="#FF8A3D" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x="8" y="8" width="384" height="328" rx="36" fill={colors.surface} stroke={colors.lineStrong} />
      <G>
        <Rect x="24" y="24" width="352" height="232" rx="22" fill="url(#access-sky)" />
        <Rect x="24" y="24" width="352" height="232" rx="22" fill="url(#access-sun)" />
        <Path d="M24 206 Q110 170 190 196 T376 186 V234 a22 22 0 0 1-22 22 H46 a22 22 0 0 1-22-22z" fill="#2F1B12" />
        <Path d="M24 226 Q130 204 230 226 T376 220 V234 a22 22 0 0 1-22 22 H46 a22 22 0 0 1-22-22z" fill="#140C09" />
      </G>
      <G stroke={colors.paper} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity={0.9}>
        <Path d={bracket} transform="translate(44 44)" />
        <Path d={bracket} transform="translate(356 44) scale(-1 1)" />
        <Path d={bracket} transform="translate(44 236) scale(1 -1)" />
        <Path d={bracket} transform="translate(356 236) scale(-1 -1)" />
      </G>
      <Path d="M200 128v24M188 140h24" stroke={colors.paper} strokeWidth="1.6" strokeLinecap="round" opacity={0.7} />
      <Rect x="54" y="52" width="66" height="22" rx="11" fill="rgba(11,10,9,0.55)" />
      <Circle cx="68" cy="63" r="4.5" fill={colors.rec} />
      <Rect x="78" y="60" width="32" height="6" rx="3" fill={colors.paper} opacity={0.85} />
      <Rect x="270" y="52" width="76" height="22" rx="11" fill="rgba(11,10,9,0.55)" />
      <Rect x="282" y="60" width="52" height="6" rx="3" fill={colors.tungsten} />
      <Circle cx="200" cy="300" r="24" fill="none" stroke={colors.paper} strokeWidth="3" />
      <Circle cx="200" cy="300" r="17" fill={colors.rec} />
      <Rect x="56" y="286" width="44" height="28" rx="9" fill={colors.raised} stroke={colors.lineStrong} />
      <Circle cx="322" cy="300" r="22" fill={colors.raised} stroke={colors.lineStrong} />
      <Path d="M313 296a10 10 0 0 1 17-3M331 304a10 10 0 0 1-17 3M329 289v4h-4M315 311v-4h4" stroke={colors.paper} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </Svg>
  );
}
