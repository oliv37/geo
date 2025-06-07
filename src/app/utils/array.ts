export function findRandoms<T>(array: readonly T[], nbElems: number): T[] {
  return shuffle(array).slice(0, Math.min(array.length, nbElems));
}

export function shuffle<T>(array: readonly T[]): T[] {
  const res = [...array];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}
