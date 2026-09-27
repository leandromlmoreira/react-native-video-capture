import assert from "node:assert/strict";
import { test } from "node:test";
import { countdownDigit, countdownOptions, nextCountdown } from "../src/domain/countdown.ts";

test("contagem mostra 3, 2, 1 e termina", () => {
  assert.equal(countdownDigit(0, 3), 3);
  assert.equal(countdownDigit(999, 3), 3);
  assert.equal(countdownDigit(1000, 3), 2);
  assert.equal(countdownDigit(2500, 3), 1);
  assert.equal(countdownDigit(3000, 3), null);
});

test("contagem desligada não mostra dígito", () => {
  assert.equal(countdownDigit(0, 0), null);
});

test("o seletor de contagem percorre as opções em ciclo", () => {
  assert.deepEqual(countdownOptions, [0, 3, 5]);
  assert.equal(nextCountdown(0), 3);
  assert.equal(nextCountdown(3), 5);
  assert.equal(nextCountdown(5), 0);
});
