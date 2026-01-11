export function intersectionIgnoreCase(s1?: string, s2?: string): string {
  let res = '';
  let i = 0;

  if (s1 === undefined || s2 === undefined) {
    return res;
  }

  while (
    i < Math.min(s1.length, s2.length) &&
    s1[i].toLowerCase() === s2[i].toLowerCase()
  ) {
    res += s1[i++];
  }

  return res;
}

export function equalsIgnoreCase(s1?: string, s2?: string): boolean {
  return (
    s1 !== undefined &&
    s2 !== undefined &&
    s1.toLowerCase() === s2.toLowerCase()
  );
}
