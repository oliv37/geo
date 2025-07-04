import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import { Workflow } from '@models/workflow';
import type { ExerciceStateOpts } from '@models/exercice-state-opts';
import {
  NEXT_FIELD_STATE,
  NEXT_ITEM_STATE,
  RESET_STATE,
} from '@utils/workflow';
import { ExerciceLevel } from '@components/exercice/exercice-level/exercice-level';
import { ExerciceHead } from '@components/exercice/exercice-head/exercice-head';
import { ExerciceBody } from '@components/exercice/exercice-body/exercice-body';
import { ExercicePageContainer } from '@components/exercice/exercice-container/exercice-page-container';
import { ExerciceProgressBar } from '@components/exercice/exercice-progress-bar/exercice-progress-bar';
import { ExerciceContainer } from '@components/exercice/exercice-container/exercice-container';
import { ExerciceMapContainer } from '@components/exercice/exercice-container/exercice-map-container';
import { ExerciceState } from '@services/exercice-state';

@Component({
  selector: 'app-exercice-level-1',
  templateUrl: './exercice-level-1.html',
  imports: [
    NgComponentOutlet,
    ExerciceProgressBar,
    ExercicePageContainer,
    ExerciceMapContainer,
    ExerciceContainer,
    ExerciceHead,
    ExerciceBody,
  ],
  providers: [ExerciceState],
})
export class ExerciceLevel1<T extends Data> extends ExerciceLevel<T> {
  createState = (): State<T> => {
    const data = this.data();
    const fields = this.fields();

    return {
      data,
      items: data,
      indexItem: 0,
      fields: fields,
      indexField: 0,
      showHint: true,
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
