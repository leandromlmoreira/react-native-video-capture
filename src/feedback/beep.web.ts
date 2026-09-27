let context: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined" || typeof AudioContext === "undefined") return null;
  context ??= new AudioContext();
  if (context.state === "suspended") context.resume().catch(() => {});
  return context;
}

export function beep(frequency: number, durationMs = 90) {
  const output = audio();
  if (!output) return;
  const oscillator = output.createOscillator();
  const gain = output.createGain();
  const now = output.currentTime;
  const end = now + durationMs / 1000;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  oscillator.connect(gain).connect(output.destination);
  oscillator.start(now);
  oscillator.stop(end + 0.02);
}
