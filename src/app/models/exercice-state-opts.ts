import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import type { Workflow } from '@models/workflow';

export interface ExerciceStateOpts<T extends Data> {
  createState: () => State<T>;
  workflow: Workflow<T>;
  computeProgressPercent?: (state: State<T>) => number;
}
