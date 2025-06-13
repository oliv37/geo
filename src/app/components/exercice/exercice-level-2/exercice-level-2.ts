import { Component, computed } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import type { Data } from '@models/data/data';
import type { State } from '@models/state';
import type { Workflow } from '@models/workflow';
import { findRandoms } from '@utils/array';
import {
  HIDE_HINT_STATE,
  NEXT_FIELD_STATE,
  NEXT_ITEM_STATE,
} from '@utils/workflow';
import { ExerciceLevel } from '@components/exercice/exercice-level';
import { ExerciceInfo } from '@components/exercice/exercice-info/exercice-info';
import { ExerciceInput } from '@components/exercice/exercice-input/exercice-input';
import { ExerciceLevelPicker } from '@components/exercice/exercice-level-picker/exercice-level-picker';
import { ExerciceLayout } from '@components/exercice/exercice-layout/exercice-layout';
import { ExerciceProgressBar } from '@components/exercice/exercice-progress-bar/exercice-progress-bar';

@Component({
  selector: 'app-exercice-level-2',
  templateUrl: './exercice-level-2.html',
  imports: [
    NgComponentOutlet,
    ExerciceLevelPicker,
    ExerciceLayout,
    ExerciceProgressBar,
    ExerciceInfo,
    ExerciceInput,
  ],
})
export class ExerciceLevel2<T extends Data> extends ExerciceLevel<T> {
  private readonly nbItemsToAnswer = 3;

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

  override progressPercent = computed<number>(() => {
    const state = this.state();

    const indexItem = state.indexItem;
    const showHint = state.showHint;
    const nbItems = state.items.length;

    const idx = indexItem + 1 + (!showHint ? nbItems : 0);
    const total = nbItems * 2;

    return (idx / total) * 100;
  });
}
