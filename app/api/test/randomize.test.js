import test from "node:test";
import assert from "node:assert/strict";
import { shuffled } from "../src/randomize.js";

test("shuffled returns a permutation without mutating the original", () => {
  const input = ["a", "b", "c", "d"];
  const result = shuffled(input);
  assert.deepEqual([...result].sort(), [...input].sort());
  assert.deepEqual(input, ["a", "b", "c", "d"]);
  assert.notEqual(result, input);
});

test("shuffled uses Fisher-Yates choices and can produce an alternate order", () => {
  const choices = [0, 0, 0];
  const result = shuffled(["a", "b", "c", "d"], () => choices.shift());
  assert.deepEqual(result, ["b", "c", "d", "a"]);
});
