const round = (value: number) => Math.round(value * 100) / 100;

export function piePath(cx: number, cy: number, radius: number, fraction: number) {
  const clamped = Math.min(Math.max(fraction, 0), 1);
  if (clamped <= 0) return "";
  if (clamped >= 1) {
    return `M${round(cx)} ${round(cy - radius)}A${round(radius)} ${round(radius)} 0 1 1 ${round(cx)} ${round(cy + radius)}A${round(radius)} ${round(radius)} 0 1 1 ${round(cx)} ${round(cy - radius)}Z`;
  }
  const angle = clamped * Math.PI * 2;
  const x = cx + Math.sin(angle) * radius;
  const y = cy - Math.cos(angle) * radius;
  const large = clamped > 0.5 ? 1 : 0;
  return `M${round(cx)} ${round(cy)}L${round(cx)} ${round(cy - radius)}A${round(radius)} ${round(radius)} 0 ${large} 1 ${round(x)} ${round(y)}Z`;
}

export function symbolGeometry(radius: number) {
  const stroke = radius * 0.245;
  return {
    stroke,
    ring: radius - stroke / 2,
    pie: radius * 0.64,
    dot: radius * 0.17,
    sweep: 0.75,
  };
}

export function hashSeed(text: string) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

export function posterSweep(durationMs: number) {
  return Math.min(1, Math.max(0.08, durationMs / 60000));
}
