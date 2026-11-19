import { randomInt } from "node:crypto";

/** Return a Fisher-Yates shuffled copy; the input array is never mutated. */
export function shuffled(items, chooseIndex = randomInt) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = chooseIndex(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}
