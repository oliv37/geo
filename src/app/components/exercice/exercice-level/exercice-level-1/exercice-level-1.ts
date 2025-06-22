import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import { Workflow } from '@models/workflow';
import { NEXT_FIELD_STATE, NEXT_ITEM_STATE } from '@utils/workflow';
import { ExerciceLevel } from '@components/exercice/exercice-level/exercice-level';
import { ExerciceHead } from '@components/exercice/exercice-head/exercice-head';
import { ExerciceBody } from '@components/exercice/exercice-body/exercice-body';
import { ExercicePageContainer } from '@components/exercice/exercice-container/exercice-page-container';
import { ExerciceProgressBar } from '@components/exercice/exercice-progress-bar/exercice-progress-bar';
import { ExerciceContainer } from '@components/exercice/exercice-container/exercice-container';
import { ExerciceMapContainer } from '@components/exercice/exercice-container/exercice-map-container';

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
      items: data,
      indexItem: 0,
      fields: fields,
      indexField: 0,
      showHint: true,
      text: '',
    };
  }
}
