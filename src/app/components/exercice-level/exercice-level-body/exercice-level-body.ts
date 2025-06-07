import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import type { Data } from '@models/data';
import type { State } from '@models/state';

@Component({
  selector: 'app-exercice-level-body',
  templateUrl: './exercice-level-body.html',
})
export class ExerciceLevelBody<T extends Data> {
  showPrevBtn = input(false);
  showNextBtn = input(false);
  state = model.required<State<T>>();

  inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  text = computed<string>(() => this.state().text);

  focusInputEffect = effect(() => {
    this.inputEl()?.nativeElement.focus();
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
}
