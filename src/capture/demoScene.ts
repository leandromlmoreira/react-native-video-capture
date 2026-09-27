const width = 1280;
const height = 720;
const horizon = height * 0.64;

const ridges = [
  { color: "#4a2a19", base: 0.6, amplitude: 38, frequency: 0.004, drift: 6 },
  { color: "#2f1b12", base: 0.68, amplitude: 30, frequency: 0.006, drift: 12 },
  { color: "#1c110c", base: 0.77, amplitude: 24, frequency: 0.009, drift: 22 },
  { color: "#0d0807", base: 0.88, amplitude: 16, frequency: 0.013, drift: 36 },
];

type Ridge = (typeof ridges)[number];

function paintSky(context: CanvasRenderingContext2D) {
  const sky = context.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#120d0b");
  sky.addColorStop(0.55, "#4b2616");
  sky.addColorStop(1, "#f29a3e");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
}

function paintSun(context: CanvasRenderingContext2D, time: number) {
  const x = width * 0.5 + Math.sin(time * 0.18) * 36;
  const y = horizon - 70 + Math.sin(time * 0.4) * 10;
  const glow = context.createRadialGradient(x, y, 0, x, y, 320);
  glow.addColorStop(0, "rgba(255, 236, 200, 0.95)");
  glow.addColorStop(0.12, "rgba(255, 196, 110, 0.85)");
  glow.addColorStop(0.35, "rgba(255, 150, 60, 0.28)");
  glow.addColorStop(1, "rgba(255, 120, 40, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
}

function paintRidge(context: CanvasRenderingContext2D, ridge: Ridge, time: number) {
  context.beginPath();
  context.moveTo(0, height);
  for (let x = 0; x <= width; x += 16) {
    const shift = x + time * ridge.drift;
    const y =
      height * ridge.base +
      Math.sin(shift * ridge.frequency) * ridge.amplitude +
      Math.sin(shift * ridge.frequency * 2.7) * ridge.amplitude * 0.35;
    context.lineTo(x, y);
  }
  context.lineTo(width, height);
  context.closePath();
  context.fillStyle = ridge.color;
  context.fill();
}

export function startDemoScene(canvas: HTMLCanvasElement) {
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  let frame = 0;
  const started = performance.now();

  const draw = (now: number) => {
    const time = (now - started) / 1000;
    paintSky(context);
    paintSun(context, time);
    ridges.forEach((ridge) => paintRidge(context, ridge, time));
    frame = requestAnimationFrame(draw);
  };

  frame = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(frame);
}
