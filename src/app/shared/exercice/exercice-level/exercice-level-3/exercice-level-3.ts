import { Component } from '@angular/core';
import type { Data } from '@shared/data';
import type { State, StateOpts, Workflow } from '@shared/exercice/exercice';
import { shuffle } from '../../../misc/array';
import {
  NEXT_FIELD_STATE,
  NEXT_ITEM_STATE,
  RESET_STATE,
} from '@shared/exercice/workflow';
import { ExerciceLevel } from '../exercice-level';
import { NgComponentOutlet } from '@angular/common';
import { ExercicePageContainer } from '../../exercice-container/exercice-page-container';
import { ExerciceProgressBar } from '../../exercice-progress-bar/exercice-progress-bar';
import { ExerciceHead } from '../../exercice-head/exercice-head';
import { ExerciceBody } from '../../exercice-body/exercice-body';
import { ExerciceContainer } from '../../exercice-container/exercice-container';
import { ExerciceMapContainer } from '../../exercice-container/exercice-map-container';
import { ExerciceState } from '@shared/exercice/exercice-state';

@Component({
  selector: 'geo-exercice-level-3',
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

  override exerciceStateOpts: StateOpts<T> = {
    createState: this.createState,
    workflow: this.workflow,
  };
}
