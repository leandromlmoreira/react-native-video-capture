import assert from "node:assert/strict";
import { test } from "node:test";
import { formatClock, formatCountdown, formatLimit, formatTakeCount, formatTimecode, padTake } from "../src/domain/format.ts";

test("timecode segue o padrão HH:MM:SS:QQ a 30 quadros", () => {
  assert.equal(formatTimecode(0), "00:00:00:00");
  assert.equal(formatTimecode(4500), "00:00:04:15");
  assert.equal(formatTimecode(61_033), "00:01:01:00");
  assert.equal(formatTimecode(3_723_999), "01:02:03:29");
});

test("timecode nunca fica negativo", () => {
  assert.equal(formatTimecode(-200), "00:00:00:00");
});

test("relógio arredonda e contagem regressiva arredonda para cima", () => {
  assert.equal(formatClock(2600), "0:03");
  assert.equal(formatClock(75_000), "1:15");
  assert.equal(formatCountdown(25_100), "0:26");
  assert.equal(formatCountdown(0), "0:00");
});

test("rótulos de limite, número da tomada e contagem de tomadas", () => {
  assert.equal(formatLimit(0), "Livre");
  assert.equal(formatLimit(30), "30s");
  assert.equal(padTake(7), "07");
  assert.equal(formatTakeCount(1), "01 tomada");
  assert.equal(formatTakeCount(12), "12 tomadas");
});
