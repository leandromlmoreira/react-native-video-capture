const width = 1280;
const height = 720;
const horizon = height * 0.62;

const ridges = [
  { color: "#1b2a31", base: 0.58, amplitude: 40, frequency: 0.004, drift: 6 },
  { color: "#121d22", base: 0.67, amplitude: 30, frequency: 0.006, drift: 12 },
  { color: "#0b1216", base: 0.77, amplitude: 24, frequency: 0.009, drift: 22 },
  { color: "#050809", base: 0.88, amplitude: 16, frequency: 0.013, drift: 36 },
];

const stars = Array.from({ length: 90 }, (_, index) => {
  const seed = Math.sin(index * 91.7) * 10000;
  const random = seed - Math.floor(seed);
  const seedY = Math.sin(index * 47.3) * 10000;
  const randomY = seedY - Math.floor(seedY);
  return { x: random * width, y: randomY * horizon * 0.8, size: 0.6 + (index % 3) * 0.5, phase: index * 0.7 };
});

type Ridge = (typeof ridges)[number];

function paintSky(context: CanvasRenderingContext2D) {
  const sky = context.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#04070a");
  sky.addColorStop(0.55, "#0e2530");
  sky.addColorStop(1, "#3f6a73");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
}

function paintStars(context: CanvasRenderingContext2D, time: number) {
  stars.forEach((star) => {
    const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(time * 0.8 + star.phase));
    context.fillStyle = `rgba(236, 230, 217, ${twinkle * 0.8})`;
    context.fillRect(star.x, star.y, star.size, star.size);
  });
}

function paintMoon(context: CanvasRenderingContext2D, time: number) {
  const x = width * 0.66 + Math.sin(time * 0.12) * 40;
  const y = horizon - 170 + Math.sin(time * 0.3) * 8;
  const glow = context.createRadialGradient(x, y, 0, x, y, 300);
  glow.addColorStop(0, "rgba(236, 230, 217, 0.5)");
  glow.addColorStop(0.18, "rgba(200, 220, 222, 0.18)");
  glow.addColorStop(1, "rgba(120, 170, 180, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
  context.beginPath();
  context.arc(x, y, 46, 0, Math.PI * 2);
  context.fillStyle = "#ECE6D9";
  context.fill();
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
    paintStars(context, time);
    paintMoon(context, time);
    ridges.forEach((ridge) => paintRidge(context, ridge, time));
    frame = requestAnimationFrame(draw);
  };

  frame = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(frame);
}
