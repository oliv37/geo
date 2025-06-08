import type { Data } from '@models/data/data';

export interface Step<T extends Data> {
  items: readonly T[];
  index: number;
  field: keyof T;
  showHint: boolean;
}
