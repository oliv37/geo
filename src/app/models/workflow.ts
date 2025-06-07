import type { Data } from '@models/data';
import type { State } from '@models/state';

export interface WorkflowStep<T extends Data> {
  test(state: State<T>): boolean;
  nextState(state: State<T>): State<T>;
}

export type Workflow<T extends Data> = WorkflowStep<T>[];
