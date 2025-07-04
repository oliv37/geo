import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import type { Workflow } from '@models/workflow';
import type { ExerciceStateOpts } from '@models/exercice-state-opts';
import { findRandoms } from '@utils/array';
import {
  HIDE_HINT_STATE,
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
  selector: 'app-exercice-level-2',
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

  override exerciceStateOpts: ExerciceStateOpts<T> = {
    createState: this.createState,
    workflow: this.workflow,
    computeProgressPercent: this.computeProgressPercent,
  };
}
