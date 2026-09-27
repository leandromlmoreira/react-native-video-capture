export const countdownOptions = [0, 3, 5];

export function countdownDigit(elapsedMs: number, seconds: number) {
  if (seconds <= 0) return null;
  const digit = seconds - Math.floor(Math.max(0, elapsedMs) / 1000);
  return digit > 0 ? digit : null;
}

export function nextCountdown(current: number) {
  const index = countdownOptions.indexOf(current);
  return countdownOptions[(index + 1) % countdownOptions.length];
}
