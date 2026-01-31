import { Component, model } from '@angular/core';
import { type Level, LEVELS } from '../level/level';
import { StarFillIcon } from '@shared/icon/star-fill-icon/star-fill-icon';

@Component({
  selector: 'geo-level-picker',
  templateUrl: './level-picker.html',
  imports: [StarFillIcon],
})
export class LevelPicker {
  level = model.required<Level>();

  protected readonly levels = LEVELS;
}
