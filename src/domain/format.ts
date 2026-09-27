const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function pad(value: number, size = 2) {
  return String(value).padStart(size, "0");
}

export function padTake(take: number) {
  return pad(take);
}

export function formatTimecode(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const frames = Math.floor(((ms % 1000) / 1000) * 30);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

export function formatClock(ms: number) {
  const totalSeconds = Math.round(ms / 1000);
  return `${Math.floor(totalSeconds / 60)}:${pad(totalSeconds % 60)}`;
}

export function formatDateTime(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatLimit(seconds: number) {
  return seconds === 0 ? "Livre" : `${seconds}s`;
}
