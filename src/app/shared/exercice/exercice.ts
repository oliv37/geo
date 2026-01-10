import type { Data } from '@shared/data';

export interface State<T extends Data> {
  data: readonly T[];
  items: readonly T[];
  indexItem: number;
  fields: readonly (keyof T)[];
  indexField: number;
  showHint: boolean;
  text: string;
}

export interface StateOpts<T extends Data> {
  createState: () => State<T>;
  workflow: Workflow<T>;
  computeProgressPercent?: (state: State<T>) => number;
}

export const LEVELS = [1, 2, 3] as const;

export type Level = (typeof LEVELS)[number];

export interface WorkflowStep<T extends Data> {
  test(state: State<T>): boolean;
  nextState(state: State<T>): State<T>;
}

export type Workflow<T extends Data> = WorkflowStep<T>[];

export interface Step<T extends Data> {
  items: readonly T[];
  index: number;
  field: keyof T;
  showHint: boolean;
}
