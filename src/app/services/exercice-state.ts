import {
  computed,
  effect,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import type { Data } from '@models/data/data';
import type { ExerciceStateOpts } from '@models/exercice-state-opts';
import type { State } from '@models/state';
import type { Workflow } from '@models/workflow';

@Injectable()
export class ExerciceState<T extends Data> {
  private _state!: WritableSignal<State<T>>;
  private _workflow!: Workflow<T>;
  private _createState!: () => State<T>;
  private _computeProgressPercent!: (state: State<T>) => number;

  init(opts: ExerciceStateOpts<T>) {
    this._state = signal(opts.createState());
    this._workflow = opts.workflow;
    this._createState = opts.createState;
    this._computeProgressPercent =
      opts.computeProgressPercent || this.defaultComputeProgressPercent;
  }

  state: Signal<State<T>> = computed(() => this._state());

  text = computed<string>(() => this.state().text);

  currentItem = computed<T>(() => {
    const state = this.state();
    return state.items[state.indexItem];
  });

  fields = computed<readonly (keyof T)[]>(() => this.state().fields);

  indexField = computed<number>(() => this.state().indexField);

  field = computed<keyof T>(() => {
    const state = this.state();
    return state.fields[state.indexField];
  });

  answer = computed<string>(() => {
    const currentItem = this.currentItem();
    const field = this.field();
    return String(currentItem[field]);
  });

  showHint = computed<boolean>(() => this.state().showHint);

  textValid = computed<string>(() => {
    const text = this.state().text || '';
    const answer = this.answer();
    let i = 0;
    while (i < text.length && i < answer.length && text[i] === answer[i]) {
      i++;
    }
    return text.substring(0, i);
  });

  progressPercent = computed<number>(() =>
    this._computeProgressPercent(this.state())
  );

  nextStateEffect = effect(() => {
    if (this.text() === this.answer()) {
      const state = this.state();
      const currentStep = this._workflow.find((step) => step.test(state));

      if (currentStep) {
        this._state.update((state) => currentStep.nextState(state));
      }
    }
  });

  updateText(text: string) {
    this._state.update((state) => ({ ...state, text }));
  }

  prevItem() {
    this._state.update((state) => ({
      ...state,
      indexItem:
        (state.indexItem - 1 + state.items.length) % state.items.length,
      indexField: 0,
      text: '',
    }));
  }

  nextItem() {
    this._state.update((state) => ({
      ...state,
      indexItem: (state.indexItem + 1) % state.items.length,
      indexField: 0,
      text: '',
    }));
  }

  help() {
    const state = this.state();

    const item = state.items[state.indexItem];
    const field = state.fields[state.indexField];
    const text = state.text;
    const answer = item[field];

    let i = 0;
    while (text[i] === answer[i]) {
      i++;
    }

    this.updateText(answer.substring(0, i + 1));
  }

  reset() {
    this._state.set(this._createState());
  }

  defaultComputeProgressPercent(state: State<T>) {
    const indexItem = state.indexItem;
    const nbItems = state.items.length;
    return nbItems ? ((indexItem + 1) / nbItems) * 100 : 0;
  }
}
