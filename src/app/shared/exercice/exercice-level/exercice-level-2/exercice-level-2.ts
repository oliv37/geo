import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import type { Data } from '@shared/data';
import type { State, StateOpts, Workflow } from '@shared/exercice/exercice';
import { findRandoms } from '../../../misc/array';
import {
  HIDE_HINT_STATE,
  NEXT_FIELD_STATE,
  NEXT_ITEM_STATE,
  RESET_STATE,
} from '@shared/exercice/workflow';
import { ExerciceLevel } from '../exercice-level';
import { ExerciceHead } from '../../exercice-head/exercice-head';
import { ExerciceBody } from '../../exercice-body/exercice-body';
import { ExercicePageContainer } from '../../exercice-container/exercice-page-container';
import { ExerciceProgressBar } from '../../exercice-progress-bar/exercice-progress-bar';
import { ExerciceContainer } from '../../exercice-container/exercice-container';
import { ExerciceMapContainer } from '../../exercice-container/exercice-map-container';
import { ExerciceState } from '@shared/exercice/exercice-state';

@Component({
  selector: 'geo-exercice-level-2',
  templateUrl: './exercice-level-2.html',
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
export class ExerciceLevel2<T extends Data> extends ExerciceLevel<T> {
  private readonly nbItemsToAnswer = 3;

  createState = (): State<T> => {
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
  };

  workflow: Workflow<T> = [
    NEXT_FIELD_STATE,
    NEXT_ITEM_STATE,
    HIDE_HINT_STATE,
    RESET_STATE(this.createState),
  ];

  computeProgressPercent(state: State<T>) {
    const showHint = state.showHint;
    const indexItem = state.indexItem;
    const nbItems = state.items.length;

    const idx = (showHint ? 0 : nbItems) + indexItem + 1;
    const total = nbItems * 2;

    return (idx / total) * 100;
  }

  override exerciceStateOpts: StateOpts<T> = {
    createState: this.createState,
    workflow: this.workflow,
    computeProgressPercent: this.computeProgressPercent,
  };
}
