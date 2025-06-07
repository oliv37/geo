import {
  computed,
  Directive,
  effect,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import type { Data } from '@models/data';
import type { State } from '@models/state';
import type { Workflow, WorkflowStep } from '@models/workflow';

@Directive()
export abstract class ExerciceLevel<T extends Data> {
  data = input.required<readonly T[]>();
  fields = input.required<readonly (keyof T)[]>();
  mapContainerEl = input<HTMLDivElement>();

  onProgressPercentChange = output<number>();

  abstract workflow: Workflow<T>;

  abstract createState(): State<T>;

  readonly RESET_STATE: WorkflowStep<T> = {
    test: () => true,
    nextState: () => this.createState(),
  };

  readonly showPrevBtn: boolean = false;
  readonly showNextBtn: boolean = false;

  state = linkedSignal<State<T>>(() => this.createState());

  text = computed<string>(() => this.state().text);

  currentItem = computed<T>(() => {
    const state = this.state();
    return state.items[state.indexItem];
  });

  field = computed<keyof T>(() => {
    const state = this.state();
    return state.fields[state.indexField];
  });

  answer = computed<string>(() => {
    const currentItem = this.currentItem();
    const field = this.field();
    return String(currentItem[field]);
  });

  nextStateEffect = effect(() => {
    if (this.text() === this.answer()) {
      const currentStep = this.workflow.find((step) => step.test(this.state()));
      if (currentStep) {
        this.state.update((state) => currentStep.nextState(state));
      }
    }
  });

  progressPercent = computed<number>(() => {
    const state = this.state();
    const nbItems = state.items.length;
    return nbItems ? ((state.indexItem + 1) / nbItems) * 100 : 0;
  });

  progressPercentChangeEffect = effect(() => {
    const progressPercent = this.progressPercent();
    this.onProgressPercentChange.emit(progressPercent);
  });

  selectItemOnMapEffect = effect(() => {
    const currentItem = this.currentItem();
    this.selectItemOnMap(currentItem.id);
  });

  selectItemOnMap(id: string | number) {
    this.mapContainerEl()
      ?.querySelectorAll('path.selected')
      .forEach((path) => path.classList.remove('selected'));

    this.mapContainerEl()
      ?.querySelector(`path[data-id="${id}"]`)
      ?.classList.add('selected');
  }
}
