import type { Data } from '@models/data';

export interface State<T extends Data> {
  data: readonly T[];
  items: readonly T[];
  indexItem: number;
  fields: readonly (keyof T)[];
  indexField: number;
  showHint: boolean;
  text: string;
}
