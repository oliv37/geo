import {
  AfterViewInit,
  computed,
  Directive,
  effect,
  ElementRef,
  input,
  linkedSignal,
  output,
  Type,
  viewChild,
} from '@angular/core';
import { Map } from '@components/map/map';
import type { Data } from '@models/data/data';
import { Level } from '@models/level';
import type { State } from '@models/state';
import type { Workflow, WorkflowStep } from '@models/workflow';

@Directive()
export abstract class ExerciceLevel<T extends Data> implements AfterViewInit {
  data = input.required<readonly T[]>();
  fields = input.required<readonly (keyof T)[]>();
  Map = input.required<Type<Map>>();

  levelChange = output<Level>();

  mapContainerRef = viewChild<ElementRef<HTMLDivElement>>('mapContainerRef');
  mapContainerEl = computed<HTMLDivElement | undefined>(
    () => this.mapContainerRef()?.nativeElement
  );

  abstract workflow: Workflow<T>;

  abstract createState(): State<T>;

  readonly RESET_STATE: WorkflowStep<T> = {
    test: () => true,
    nextState: () => this.createState(),
  };

  readonly isClientSide = typeof window !== 'undefined';

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
    const indexItem = state.indexItem;
    const nbItems = state.items.length;
    return nbItems ? ((indexItem + 1) / nbItems) * 100 : 0;
  });

  selectCurrentItemOnMapEffect = effect(() => {
    this.selectCurrentItemOnMap();
  });

  ngAfterViewInit() {
    this.selectCurrentItemOnMap();
  }

  selectCurrentItemOnMap() {
    if (!this.isClientSide) {
      return;
    }

    this.mapContainerEl()
      ?.querySelectorAll('path.selected, g.selected')
      .forEach((path) => path.classList.remove('selected'));

    const id: string | number = this.currentItem().id;
    this.mapContainerEl()
      ?.querySelector(`path[id="${id}"], g[id="${id}"]`)
      ?.classList.add('selected');
  }
}
