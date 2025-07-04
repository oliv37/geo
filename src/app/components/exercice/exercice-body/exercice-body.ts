import {
  booleanAttribute,
  Component,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import type { Data } from '@models/data/data';
import { QuestionLgIcon } from '@components/icon/question-lg-icon/question-lg-icon';
import { ArrowLeftIcon } from '@components/icon/arrow-left-icon/arrow-left-icon';
import { ArrowRightIcon } from '@components/icon/arrow-right-icon/arrow-right-icon';
import { ArrowClockwiseIcon } from '@components/icon/arrow-clockwise-icon/arrow-clockwise-icon';
import { ExerciceState } from '@services/exercice-state';
import { ExerciceLevel } from '@services/exercice-level';

@Component({
  selector: 'app-exercice-body',
  templateUrl: './exercice-body.html',
  imports: [ArrowLeftIcon, ArrowRightIcon, QuestionLgIcon, ArrowClockwiseIcon],
})
export class ExerciceBody<T extends Data> {
  exerciceState = inject(ExerciceState<T>);
  exerciceLevel = inject(ExerciceLevel);

  showPrevBtn = input(false, { transform: booleanAttribute });
  showNextBtn = input(false, { transform: booleanAttribute });
  showHelpBtn = input(false, { transform: booleanAttribute });

  document = inject(DOCUMENT);

  inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  focusInputEffect = effect(() => {
    const state = this.exerciceState.state();
    const inputElement = this.inputEl()?.nativeElement;
    const activeElement = this.document.activeElement;

    if (inputElement && state && inputElement !== activeElement) {
      inputElement.focus();
    }
  });
}
