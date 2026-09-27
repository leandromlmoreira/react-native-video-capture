import { Easing, Platform } from "react-native";

export const colors = {
  ink: "#0C0C0B",
  sunken: "#050505",
  surface: "#141413",
  raised: "#1C1C1A",
  well: "#232220",
  line: "rgba(236, 230, 217, 0.09)",
  lineStrong: "rgba(236, 230, 217, 0.18)",
  bone: "#ECE6D9",
  boneDim: "#D6CFC1",
  muted: "#A39E93",
  faint: "#8A857C",
  tally: "#FF3B2E",
  tallyHot: "#FF5A48",
  tallySoft: "rgba(255, 59, 46, 0.14)",
  tallyGlow: "rgba(255, 59, 46, 0.42)",
  tallyText: "#FF8577",
  peak: "#E3F266",
  peakSoft: "rgba(227, 242, 102, 0.12)",
  scrim: "rgba(5, 5, 5, 0.62)",
  glass: "rgba(12, 12, 11, 0.58)",
  glassStrong: "rgba(12, 12, 11, 0.82)",
  boneWash: "rgba(236, 230, 217, 0.06)",
  boneWashStrong: "rgba(236, 230, 217, 0.12)",
};

export const fonts = {
  display: "BigShoulders_800ExtraBold",
  displayBlack: "BigShoulders_900Black",
  body: "SchibstedGrotesk_400Regular",
  bodyMedium: "SchibstedGrotesk_500Medium",
  bodySemi: "SchibstedGrotesk_600SemiBold",
  bodyBold: "SchibstedGrotesk_700Bold",
  mono: "GeistMono_400Regular",
  monoMedium: "GeistMono_500Medium",
  monoSemi: "GeistMono_600SemiBold",
};

export const type = {
  hero: { fontFamily: fonts.displayBlack, fontSize: 54, lineHeight: 56, letterSpacing: -0.3 },
  heroWide: { fontFamily: fonts.displayBlack, fontSize: 112, lineHeight: 106, letterSpacing: -1 },
  title: { fontFamily: fonts.displayBlack, fontSize: 40, lineHeight: 40, letterSpacing: 0 },
  heading: { fontFamily: fonts.display, fontSize: 24, lineHeight: 26, letterSpacing: 0.2 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.monoMedium, fontSize: 11, letterSpacing: 1.4 },
  data: { fontFamily: fonts.monoMedium, fontSize: 13, letterSpacing: 0.4 },
};

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 56,
};

export const motion = {
  out: Easing.bezier(0.23, 1, 0.32, 1),
  inOut: Easing.bezier(0.77, 0, 0.175, 1),
  drawer: Easing.bezier(0.32, 0.72, 0, 1),
  shutter: Easing.bezier(0.2, 0.9, 0.1, 1),
  native: Platform.OS !== "web",
};

export const wideBreakpoint = 980;
