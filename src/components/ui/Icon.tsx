import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/tokens";

const paths = {
  flip: ["M20 11a8 8 0 0 0-14.3-4.9", "M4 13a8 8 0 0 0 14.3 4.9", "M5 3v3.6h3.6", "M19 21v-3.6h-3.6"],
  grid: ["M4 4h16v16H4z", "M9.33 4v16", "M14.67 4v16", "M4 9.33h16", "M4 14.67h16"],
  share: ["M12 3.5v11", "M8 7.5l4-4 4 4", "M5.5 12v6.5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V12"],
  download: ["M12 3.5v11", "M8 10.5l4 4 4-4", "M5 20h14"],
  trash: ["M4.5 7h15", "M10 11v6", "M14 11v6", "M6.5 7l.9 11.6a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9L17.5 7", "M9.5 7V4.5h5V7"],
  close: ["M6.5 6.5l11 11", "M17.5 6.5l-11 11"],
  back: ["M14.5 5.5L8 12l6.5 6.5"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  camera: [
    "M4 8.5a2 2 0 0 1 2-2h2.2L9.8 4.5h4.4l1.6 2H18a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
    "M12 9.8a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z",
  ],
  cameraOff: [
    "M9.8 4.5h4.4l1.6 2H18a2 2 0 0 1 2 2v8.3",
    "M17.6 20H6a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h.4",
    "M10 10.2a3.4 3.4 0 0 0 4.4 4.9",
    "M3.5 3.5l17 17",
  ],
  mic: ["M12 3.5a3 3 0 0 0-3 3V12a3 3 0 0 0 6 0V6.5a3 3 0 0 0-3-3z", "M5.5 11.5a6.5 6.5 0 0 0 13 0", "M12 18v2.5"],
  film: [
    "M5.5 3.5h13a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z",
    "M8 3.5v17",
    "M16 3.5v17",
    "M3.5 8.5H8",
    "M3.5 15.5H8",
    "M16 8.5h4.5",
    "M16 15.5h4.5",
  ],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  spark: ["M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"],
  lock: ["M6.5 11h11v9h-11z", "M8.8 11V8.2a3.2 3.2 0 0 1 6.4 0V11"],
  play: ["M8 5.5v13l10.5-6.5z"],
  external: ["M8 16l8-8", "M9 8h7v7"],
  timer: ["M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M12 13V9", "M10 2.5h4", "M12 13l3 2"],
  retry: ["M4.5 12a7.5 7.5 0 1 0 2.2-5.3", "M4.5 4v4h4"],
};

export type IconName = keyof typeof paths;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  weight?: number;
}

export function Icon({ name, size = 20, color = colors.bone, weight = 1.6 }: IconProps) {
  const filled = name === "play";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {paths[name].map((d) => (
        <Path
          key={d}
          d={d}
          stroke={color}
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={filled ? color : "none"}
        />
      ))}
    </Svg>
  );
}
