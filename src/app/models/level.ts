export const LEVELS = [1, 2, 3] as const;

export type Level = (typeof LEVELS)[number];
