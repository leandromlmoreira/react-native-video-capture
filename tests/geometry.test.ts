import assert from "node:assert/strict";
import { test } from "node:test";
import { hashSeed, piePath, posterSweep, symbolGeometry } from "../src/brand/geometry.ts";

test("setor começa às 12 horas e gira no sentido horário", () => {
  assert.equal(piePath(50, 50, 10, 0.25), "M50 50L50 40A10 10 0 0 1 60 50Z");
  assert.equal(piePath(50, 50, 10, 0.75), "M50 50L50 40A10 10 0 1 1 40 50Z");
});

test("setor vazio some e setor cheio vira círculo", () => {
  assert.equal(piePath(0, 0, 5, 0), "");
  assert.match(piePath(0, 0, 5, 1), /^M0 -5A5 5 0 1 1 0 5A5 5 0 1 1 0 -5Z$/);
});

test("proporções do símbolo", () => {
  const geometry = symbolGeometry(100);
  assert.equal(geometry.pie, 64);
  assert.equal(geometry.dot, 17);
  assert.equal(geometry.sweep, 0.75);
  assert.ok(Math.abs(geometry.ring - 87.75) < 1e-9);
});

test("semente é determinística e fica entre 0 e 1", () => {
  assert.equal(hashSeed("abc"), hashSeed("abc"));
  assert.notEqual(hashSeed("abc"), hashSeed("abd"));
  const value = hashSeed("tomada-01");
  assert.ok(value >= 0 && value <= 1);
});

test("varredura do pôster acompanha a duração", () => {
  assert.equal(posterSweep(0), 0.08);
  assert.equal(posterSweep(30_000), 0.5);
  assert.equal(posterSweep(120_000), 1);
});
