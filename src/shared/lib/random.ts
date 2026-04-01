/** Random integer in [min, max] inclusive */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick n random elements from array (no duplicates) */
export function pickRandom<T>(arr: readonly T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  const count = Math.min(n, copy.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}
