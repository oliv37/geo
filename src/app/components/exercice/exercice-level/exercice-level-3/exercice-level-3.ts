import { Component } from '@angular/core';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import type { Workflow } from '@models/workflow';
import type { ExerciceStateOpts } from '@models/exercice-state-opts';
import { shuffle } from '@utils/array';
import {
  NEXT_FIELD_STATE,
  NEXT_ITEM_STATE,
  RESET_STATE,
} from '@utils/workflow';
import { ExerciceLevel } from '@components/exercice/exercice-level/exercice-level';
import { NgComponentOutlet } from '@angular/common';
import { ExercicePageContainer } from '@components/exercice/exercice-container/exercice-page-container';
import { ExerciceProgressBar } from '@components/exercice/exercice-progress-bar/exercice-progress-bar';
import { ExerciceHead } from '@components/exercice/exercice-head/exercice-head';
import { ExerciceBody } from '@components/exercice/exercice-body/exercice-body';
import { ExerciceContainer } from '@components/exercice/exercice-container/exercice-container';
import { ExerciceMapContainer } from '@components/exercice/exercice-container/exercice-map-container';
import { ExerciceState } from '@services/exercice-state';

@Component({
  selector: 'app-exercice-level-3',
  templateUrl: './exercice-level-3.html',
  imports: [
    NgComponentOutlet,
    ExerciceProgressBar,
    ExercicePageContainer,
    ExerciceMapContainer,
    ExerciceContainer,
    ExerciceBody,
    ExerciceHead,
  ],
  providers: [ExerciceState],
})
export class ExerciceLevel3<T extends Data> extends ExerciceLevel<T> {
  createState = (): State<T> => {
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
  };

  workflow: Workflow<T> = [
    NEXT_FIELD_STATE,
    NEXT_ITEM_STATE,
    RESET_STATE(this.createState),
  ];

  override exerciceStateOpts: ExerciceStateOpts<T> = {
    createState: this.createState,
    workflow: this.workflow,
  };
}
