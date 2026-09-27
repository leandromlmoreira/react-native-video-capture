import { Easing, Platform } from "react-native";

export const colors = {
  ink: "#0B0A09",
  surface: "#141210",
  raised: "#1C1916",
  sunken: "#070606",
  line: "rgba(255, 238, 214, 0.08)",
  lineStrong: "rgba(255, 238, 214, 0.16)",
  paper: "#F4EDE4",
  muted: "#A0968B",
  faint: "#6A625A",
  tungsten: "#FFB547",
  tungstenSoft: "rgba(255, 181, 71, 0.14)",
  tungstenGlow: "rgba(255, 181, 71, 0.32)",
  rec: "#FF4D3D",
  recSoft: "rgba(255, 77, 61, 0.16)",
  go: "#8FDCA8",
  goSoft: "rgba(143, 220, 168, 0.14)",
  scrim: "rgba(7, 6, 6, 0.55)",
  glass: "rgba(20, 18, 16, 0.62)",
};

export const fonts = {
  display: "BricolageGrotesque_700Bold",
  displayHeavy: "BricolageGrotesque_800ExtraBold",
  body: "Figtree_400Regular",
  bodyMedium: "Figtree_500Medium",
  bodySemi: "Figtree_600SemiBold",
  mono: "DMMono_400Regular",
  monoMedium: "DMMono_500Medium",
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
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
  native: Platform.OS !== "web",
};

export const wideBreakpoint = 980;
