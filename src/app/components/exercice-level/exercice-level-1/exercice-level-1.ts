import { Component } from '@angular/core';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import { Workflow } from '@models/workflow';
import { shuffle } from '@utils/array';
import { NEXT_FIELD_STATE, NEXT_ITEM_STATE } from '@utils/workflow';
import { ExerciceLevel } from '@components/exercice-level/exercice-level';
import { ExerciceLevelHeader } from '@components/exercice-level/exercice-level-header/exercice-level-header';
import { ExerciceLevelBody } from '@components/exercice-level/exercice-level-body/exercice-level-body';

@Component({
  selector: 'app-exercice-level-1',
  templateUrl: '../exercice-level.html',
  imports: [ExerciceLevelHeader, ExerciceLevelBody],
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

  override readonly showPrevBtn = true;
  override readonly showNextBtn = true;
}
