import {
  Component,
  computed,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { UsaStateMap } from '@components/maps/usa-state-map/usa-state-map';
import { usaStateData } from '@datas/usa-state-data';
import { UsaState } from '@models/usa-state';

@Component({
  selector: 'app-root',
  imports: [UsaStateMap],
  templateUrl: './app.html',
})
export class App {
  readonly nbStatesToAnswer = 50;
  readonly isClientSide = typeof window !== 'undefined';

  mapContainerEl = viewChild<ElementRef<HTMLDivElement>>('mapContainerEl');
  inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  step = signal<Step>({
    states: findNRandomItems(usaStateData, this.nbStatesToAnswer),
    index: 0,
    field: 'state',
    showHint: false,
  });
  text = signal<string>('');

  currentState = computed<UsaState>(() => {
    const step = this.step();
    return step.states[step.index];
  });

  answer = computed(() => {
    const step = this.step();
    const currentState = this.currentState();
    return currentState[step.field];
  });

  subtextValid = computed(() => {
    const text = this.text();
    const answer = this.answer();
    let i = 0;
    while (i < text.length && i < answer.length && text[i] === answer[i]) {
      i++;
    }
    return text.substring(0, i);
  });

  isValidText = computed(() => {
    const text = this.text();
    const answer = this.answer();
    return text === answer;
  });

  progressPercent = computed(() => {
    const step = this.step();
    return step.states.length
      ? ((step.index + 1) / step.states.length) * 100
      : 0;
  });

  selectCurrentStateOnMapEffect = effect(() => {
    if (!this.isClientSide) {
      return;
    }

    const currentState = this.currentState();

    this.mapContainerEl()
      ?.nativeElement?.querySelectorAll('path.selected')
      .forEach((path) => path.classList.remove('selected'));

    this.mapContainerEl()
      ?.nativeElement?.querySelector(`path[data-id="${currentState.id}"]`)
      ?.classList.add('selected');
  });

  goToNextStepEffect = effect(() => {
    if (this.isValidText()) {
      const step = this.step();

      this.text.set('');

      if (step.field === 'state') {
        this.step.update((prevStep) => ({
          ...prevStep,
          field: 'capital',
        }));
      } else if (step.index < step.states.length - 1) {
        this.step.update((prevStep) => ({
          ...prevStep,
          index: prevStep.index + 1,
          field: 'state',
        }));
      } else if (step.showHint) {
        this.step.set({
          states: shuffle(step.states),
          index: 0,
          field: 'state',
          showHint: false,
        });
      } else {
        this.step.set({
          states: findNRandomItems(usaStateData, this.nbStatesToAnswer),
          index: 0,
          field: 'state',
          showHint: false,
        });
      }
    }
  });

  focusInputEffect = effect(() => {
    this.inputEl()?.nativeElement.focus();
  });
}

type Field = Exclude<keyof UsaState, 'id'>;

interface Step {
  states: UsaState[];
  index: number;
  field: Field;
  showHint: boolean;
}

function shuffle<T>(array: T[]): T[] {
  array = array.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function findNRandomItems<T>(items: T[], n: number): T[] {
  return shuffle(items).slice(0, Math.min(n, items.length));
}
