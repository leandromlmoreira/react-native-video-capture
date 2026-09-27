import assert from "node:assert/strict";
import { test } from "node:test";
import { isFinalStretch, limitProgress, remainingMs, remainingWholeSeconds, tapeTicks } from "../src/domain/limit.ts";

test("tempo restante respeita o limite e o modo livre", () => {
  assert.equal(remainingMs(30, 4000), 26_000);
  assert.equal(remainingMs(15, 20_000), 0);
  assert.equal(remainingMs(0, 4000), null);
  assert.equal(remainingWholeSeconds(30, 25_100), 5);
});

test("progresso fica entre 0 e 1", () => {
  assert.equal(limitProgress(30, 15_000), 0.5);
  assert.equal(limitProgress(30, 90_000), 1);
  assert.equal(limitProgress(0, 5000), 0);
});

test("reta final são os últimos cinco segundos", () => {
  assert.equal(isFinalStretch(30, 24_000), false);
  assert.equal(isFinalStretch(30, 25_000), true);
  assert.equal(isFinalStretch(30, 30_000), false);
  assert.equal(isFinalStretch(0, 999_000), false);
});

test("fita de limite marca segundos e destaca as dezenas", () => {
  const short = tapeTicks(15);
  assert.equal(short.length, 16);
  assert.deepEqual(short.filter((tick) => tick.major).map((tick) => tick.position), [0, 5 / 15, 10 / 15, 1]);
  const long = tapeTicks(60);
  assert.equal(long.length, 31);
  assert.equal(long.filter((tick) => tick.major).length, 7);
  assert.deepEqual(tapeTicks(0), []);
});
