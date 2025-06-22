import { Component, computed, input } from '@angular/core';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';

@Component({
  selector: 'app-exercice-head',
  templateUrl: './exercice-head.html',
})
export class ExerciceHead<T extends Data> {
  state = input.required<State<T>>();

  currentItem = computed<T>(() => {
    const state = this.state();
    return state.items[state.indexItem];
  });

  answer = computed<string>(() => {
    const currentItem = this.currentItem();
    const state = this.state();
    const field = state.fields[state.indexField];
    return String(currentItem[field]);
  });

  textValid = computed<string>(() => {
    const text = this.state().text || '';
    const answer = this.answer();
    let i = 0;
    while (i < text.length && i < answer.length && text[i] === answer[i]) {
      i++;
    }
    return text.substring(0, i);
  });
}
