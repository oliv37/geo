import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import { Workflow } from '@models/workflow';
import { shuffle } from '@utils/array';
import { NEXT_FIELD_STATE, NEXT_ITEM_STATE } from '@utils/workflow';
import { ExerciceLevel } from '@components/exercice/exercice-level';
import { ExerciceInfo } from '@components/exercice/exercice-info/exercice-info';
import { ExerciceInput } from '@components/exercice/exercice-input/exercice-input';
import { ExerciceLevelPicker } from '@components/exercice/exercice-level-picker/exercice-level-picker';
import { ExerciceLayout } from '@components/exercice/exercice-layout/exercice-layout';
import { ExerciceProgressBar } from '@components/exercice/exercice-progress-bar/exercice-progress-bar';

@Component({
  selector: 'app-exercice-level-1',
  templateUrl: './exercice-level-1.html',
  imports: [
    NgComponentOutlet,
    ExerciceLevelPicker,
    ExerciceLayout,
    ExerciceProgressBar,
    ExerciceInfo,
    ExerciceInput,
  ],
})
export class ExerciceLevel1<T extends Data> extends ExerciceLevel<T> {
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
      items: shuffle(data),
      indexItem: 0,
      fields: fields,
      indexField: 0,
      showHint: true,
      text: '',
    };
  }
}
