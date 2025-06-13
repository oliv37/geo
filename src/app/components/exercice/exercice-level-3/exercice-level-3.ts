import { Component } from '@angular/core';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import type { Workflow } from '@models/workflow';
import { shuffle } from '@utils/array';
import { NEXT_FIELD_STATE, NEXT_ITEM_STATE } from '@utils/workflow';
import { ExerciceLevel } from '@components/exercice/exercice-level';
import { NgComponentOutlet } from '@angular/common';
import { ExerciceLevelPicker } from '@components/exercice/exercice-level-picker/exercice-level-picker';
import { ExerciceLayout } from '@components/exercice/exercice-layout/exercice-layout';
import { ExerciceProgressBar } from '@components/exercice/exercice-progress-bar/exercice-progress-bar';
import { ExerciceInfo } from '@components/exercice/exercice-info/exercice-info';
import { ExerciceInput } from '@components/exercice/exercice-input/exercice-input';

@Component({
  selector: 'app-exercice-level-3',
  templateUrl: './exercice-level-3.html',
  imports: [
    NgComponentOutlet,
    ExerciceLevelPicker,
    ExerciceLayout,
    ExerciceProgressBar,
    ExerciceInfo,
    ExerciceInput,
  ],
})
export class ExerciceLevel3<T extends Data> extends ExerciceLevel<T> {
  override workflow: Workflow<T> = [
    NEXT_FIELD_STATE,
    NEXT_ITEM_STATE,
    this.RESET_STATE,
  ];

  override createState(): State<T> {
    const data = this.data();
    const fields = this.fields();

    return {
      data,
      items: shuffle(this.data()),
      indexItem: 0,
      fields,
      indexField: 0,
      showHint: false,
      text: '',
    };
  }
}
