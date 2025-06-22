import {
  booleanAttribute,
  Component,
  computed,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import type { Level } from '@models/level';
import { QuestionLgIcon } from '@components/icon/question-lg-icon/question-lg-icon';
import { ArrowLeftIcon } from '@components/icon/arrow-left-icon/arrow-left-icon';
import { ArrowRightIcon } from '@components/icon/arrow-right-icon/arrow-right-icon';
import { ArrowClockwiseIcon } from '@components/icon/arrow-clockwise-icon/arrow-clockwise-icon';

@Component({
  selector: 'app-exercice-body',
  templateUrl: './exercice-body.html',
  imports: [ArrowLeftIcon, ArrowRightIcon, QuestionLgIcon, ArrowClockwiseIcon],
})
export class ExerciceBody<T extends Data> {
  showPrevBtn = input(false, { transform: booleanAttribute });
  showNextBtn = input(false, { transform: booleanAttribute });
  showHelpBtn = input(false, { transform: booleanAttribute });

  state = model.required<State<T>>();
  level = model.required<Level>();

  resetState = output<void>();

  document = inject(DOCUMENT);

  inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  text = computed<string>(() => this.state().text);

  focusInputEffect = effect(() => {
    const state = this.state();
    const inputElement = this.inputEl()?.nativeElement;
    const activeElement = this.document.activeElement;

    if (inputElement && state && inputElement !== activeElement) {
      inputElement.focus();
    }
  });

  updateText(text: string) {
    this.state.update((state) => ({ ...state, text }));
  }

  nextItem() {
    this.state.update((state) => ({
      ...state,
      indexItem: (state.indexItem + 1) % state.items.length,
      indexField: 0,
      text: '',
    }));
  }

  prevItem() {
    this.state.update((state) => ({
      ...state,
      indexItem:
        (state.indexItem - 1 + state.items.length) % state.items.length,
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

  nextLevel() {
    const level = this.level();
    const nextLevel = level < 3 ? ((level + 1) as Level) : 1;
    this.level.set(nextLevel);
  }
}
