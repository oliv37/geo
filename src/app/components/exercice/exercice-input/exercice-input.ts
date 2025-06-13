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
  viewChild,
} from '@angular/core';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import { ArrowLeftCircleIcon } from '@components/icon/arrow-left-circle-icon /arrow-left-circle-icon';
import { ArrowRightCircleIcon } from '@components/icon/arrow-right-circle-icon/arrow-right-circle-icon';
import { QuestionCircleIcon } from '@components/icon/question-circle-icon/question-circle-icon';

@Component({
  selector: 'app-exercice-input',
  templateUrl: './exercice-input.html',
  imports: [ArrowLeftCircleIcon, ArrowRightCircleIcon, QuestionCircleIcon],
})
export class ExerciceInput<T extends Data> {
  showPrevBtn = input(false, { transform: booleanAttribute });
  showNextBtn = input(false, { transform: booleanAttribute });
  showHelpBtn = input(false, { transform: booleanAttribute });
  state = model.required<State<T>>();

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
}
