import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  linkedSignal,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import { Data } from '@models/data';
import { Step } from '@models/step';
import { AbstractMap } from '@components/maps/abstract-map';

@Component({
  selector: 'app-exercice',
  imports: [NgComponentOutlet],
  templateUrl: './exercice.html',
})
export class Exercice<T extends Data> {
  Map = input.required<Type<AbstractMap>>();
  data = input.required<readonly T[]>();
  fields = input.required<readonly (keyof T)[]>();

  readonly mapInputs = {
    className: 'absolute top-0 left-0 w-full h-full stroke-gray-800 fill-white',
  };
  readonly nbItemsToAnswer = 4;
  readonly isClientSide = typeof window !== 'undefined';

  mapContainerEl = viewChild<ElementRef<HTMLDivElement>>('mapContainerEl');
  inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  step = linkedSignal<Step<T>>(() => this.createStep());
  text = signal<string>('');

  currentItem = computed<T>(() => {
    const step = this.step();
    return step.items[step.index];
  });

  answer = computed<string>(() => {
    const step = this.step();
    const currentItem = this.currentItem();
    return String(currentItem[step.field]);
  });

  textValid = computed<string>(() => {
    const text = this.text();
    const answer = this.answer();
    let i = 0;
    while (i < text.length && i < answer.length && text[i] === answer[i]) {
      i++;
    }
    return text.substring(0, i);
  });

  isTextEqualToAnswer = computed<boolean>(() => {
    const text = this.text();
    const answer = this.answer();
    return text === answer;
  });

  fieldIndex = computed<number>(() => {
    const step = this.step();
    const fields = this.fields();
    return fields.indexOf(step.field);
  });

  progressPercent = computed<number>(() => {
    const step = this.step();
    return step.items.length ? ((step.index + 1) / step.items.length) * 100 : 0;
  });

  selectCurrentItemOnMapEffect = effect(() => {
    const currentItem = this.currentItem();

    this.mapContainerEl()
      ?.nativeElement?.querySelectorAll('path.selected')
      .forEach((path) => path.classList.remove('selected'));

    this.mapContainerEl()
      ?.nativeElement?.querySelector(`path[data-id="${currentItem.id}"]`)
      ?.classList.add('selected');
  });

  goToNextStepEffect = effect(() => {
    if (this.isTextEqualToAnswer()) {
      const step = this.step();
      const fields = this.fields();
      const fieldIndex = this.fieldIndex();
      const isLastField = fieldIndex === fields.length - 1;
      const isLastStep = step.index === step.items.length - 1;

      this.text.set('');

      if (!isLastField) {
        this.step.set({
          ...step,
          field: fields[fieldIndex + 1],
        });
      } else if (!isLastStep) {
        this.step.set({
          ...step,
          index: step.index + 1,
          field: fields[0],
        });
      } else if (step.showHint) {
        this.step.set({
          items: shuffle(step.items),
          index: 0,
          field: fields[0],
          showHint: false,
        });
      } else {
        this.step.set(this.createStep());
      }
    }
  });

  focusInputEffect = effect(() => {
    this.inputEl()?.nativeElement.focus();
  });

  private createStep(): Step<T> {
    return {
      items: findRandoms(this.data(), this.nbItemsToAnswer),
      index: 0,
      field: this.fields()[0],
      showHint: false,
    };
  }
}

function findRandoms<T>(array: readonly T[], size: number = array.length): T[] {
  return shuffle(array).slice(0, Math.min(array.length, size));
}

function shuffle<T>(array: readonly T[]): T[] {
  const res = [...array];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}
