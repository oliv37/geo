import { Item } from '@models/data';

export interface Step<T extends Item> {
  items: readonly T[];
  index: number;
  field: keyof T;
  showHint: boolean;
}
