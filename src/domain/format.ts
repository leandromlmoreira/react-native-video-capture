const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export const framesPerSecond = 30;

function pad(value: number, size = 2) {
  return String(value).padStart(size, "0");
}

export function padTake(take: number) {
  return pad(take);
}

export function formatTimecode(ms: number) {
  const safe = Math.max(0, ms);
  const totalSeconds = Math.floor(safe / 1000);
  const frames = Math.floor(((safe % 1000) / 1000) * framesPerSecond);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

export function formatClock(ms: number) {
  const totalSeconds = Math.round(Math.max(0, ms) / 1000);
  return `${Math.floor(totalSeconds / 60)}:${pad(totalSeconds % 60)}`;
}

export function formatCountdown(ms: number) {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  return `${Math.floor(totalSeconds / 60)}:${pad(totalSeconds % 60)}`;
}

export function formatDay(timestamp: number) {
  const date = new Date(timestamp);
  return `${pad(date.getDate())} ${months[date.getMonth()]}`;
}

export function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDateTime(timestamp: number) {
  return `${formatDay(timestamp)} · ${formatTime(timestamp)}`;
}

export function formatLimit(seconds: number) {
  return seconds === 0 ? "Livre" : `${seconds}s`;
}

export function formatTakeCount(count: number) {
  return `${pad(count)} ${count === 1 ? "tomada" : "tomadas"}`;
}
