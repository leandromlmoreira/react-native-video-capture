export const limitOptions = [15, 30, 60, 0];
export const finalStretchMs = 5000;

export function remainingMs(limitSeconds: number, elapsedMs: number) {
  if (limitSeconds <= 0) return null;
  return Math.max(0, limitSeconds * 1000 - elapsedMs);
}

export function limitProgress(limitSeconds: number, elapsedMs: number) {
  if (limitSeconds <= 0) return 0;
  return Math.min(1, Math.max(0, elapsedMs / (limitSeconds * 1000)));
}

export function isFinalStretch(limitSeconds: number, elapsedMs: number) {
  const remaining = remainingMs(limitSeconds, elapsedMs);
  return remaining !== null && remaining > 0 && remaining <= finalStretchMs;
}

export function remainingWholeSeconds(limitSeconds: number, elapsedMs: number) {
  const remaining = remainingMs(limitSeconds, elapsedMs);
  return remaining === null ? null : Math.ceil(remaining / 1000);
}

export function tapeTicks(limitSeconds: number) {
  if (limitSeconds <= 0) return [];
  const step = limitSeconds > 30 ? 2 : 1;
  const major = limitSeconds > 30 ? 10 : 5;
  const ticks: { position: number; major: boolean }[] = [];
  for (let second = 0; second <= limitSeconds; second += step) {
    ticks.push({ position: second / limitSeconds, major: second % major === 0 });
  }
  return ticks;
}
