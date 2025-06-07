import { Component } from '@angular/core';
import type { Data } from '@models/data';
import type { State } from '@models/state';
import type { Workflow } from '@models/workflow';
import { findRandoms } from '@utils/array';
import {
  HIDE_HINT_STATE,
  NEXT_FIELD_STATE,
  NEXT_ITEM_STATE,
} from '@utils/workflow';
import { ExerciceLevel } from '@components/exercice-level/exercice-level';
import { ExerciceLevelHeader } from '@components/exercice-level/exercice-level-header/exercice-level-header';
import { ExerciceLevelBody } from '@components/exercice-level/exercice-level-body/exercice-level-body';

@Component({
  selector: 'app-exercice-level-2',
  templateUrl: '../exercice-level.html',
  imports: [ExerciceLevelHeader, ExerciceLevelBody],
})
export class ExerciceLevel2<T extends Data> extends ExerciceLevel<T> {
  private readonly nbItemsToAnswer = 4;

  override workflow: Workflow<T> = [
    NEXT_FIELD_STATE,
    NEXT_ITEM_STATE,
    HIDE_HINT_STATE,
    this.RESET_STATE,
  ];

  override createState(): State<T> {
    const data = this.data();
    const fields = this.fields();

    return {
      data,
      items: findRandoms(this.data(), this.nbItemsToAnswer),
      indexItem: 0,
      fields,
      indexField: 0,
      showHint: true,
      text: '',
    };
  }
}
