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
import type { Data } from '@shared/data';
import { QuestionLgIcon } from '@shared/icon/question-lg-icon/question-lg-icon';
import { ArrowLeftIcon } from '@shared/icon/arrow-left-icon/arrow-left-icon';
import { ArrowRightIcon } from '@shared/icon/arrow-right-fill-icon/arrow-right-icon';
import { ArrowClockwiseIcon } from '@shared/icon/arrow-clockwise-icon/arrow-clockwise-icon';
import { ExerciceState } from '@shared/exercice/exercice-state';
import { ExerciceLevel } from '@shared/exercice/exercice-level';

@Component({
  selector: 'geo-exercice-body',
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
