import type { State } from '@models/state';
import type { WorkflowStep } from '@models/workflow';
import { shuffle } from '@utils/array';

/* eslint-disable @typescript-eslint/no-explicit-any */

const isNotLastField = (state: State<any>) =>
  state.indexField < state.fields.length - 1;

const isNotLastItem = (state: State<any>) =>
  state.indexItem < state.items.length - 1;

const isShowingHint = (state: State<any>) => state.showHint;

export const NEXT_FIELD_STATE: WorkflowStep<any> = {
  test: isNotLastField,
  nextState: (state) => ({
    ...state,
    indexField: state.indexField + 1,
    text: '',
  }),
};

export const NEXT_ITEM_STATE: WorkflowStep<any> = {
  test: isNotLastItem,
  nextState: (state) => ({
    ...state,
    indexItem: state.indexItem + 1,
    indexField: 0,
    text: '',
  }),
};

export const HIDE_HINT_STATE: WorkflowStep<any> = {
  test: isShowingHint,
  nextState: (state) => ({
    ...state,
    items: shuffle(state.items),
    indexItem: 0,
    indexField: 0,
    showHint: false,
    text: '',
  }),
};
