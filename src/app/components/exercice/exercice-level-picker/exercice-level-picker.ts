import { NgComponentOutlet } from '@angular/common';
import { Component, model, Type } from '@angular/core';
import { type Level, LEVELS } from '@models/level';
import { Icon } from '@components/icon/icon';
import { OneCircleIcon } from '@components/icon/1-circle-icon/1-circle-icon';
import { OneCircleFillIcon } from '@components/icon/1-circle-fill-icon/1-circle-fill-icon';
import { TwoCircleIcon } from '@components/icon/2-circle-icon/2-circle-icon';
import { TwoCircleFillIcon } from '@components/icon/2-circle-fill-icon/2-circle-fill-icon';
import { ThreeCircleIcon } from '@components/icon/3-circle-icon/3-circle-icon';
import { ThreeCircleFillIcon } from '@components/icon/3-circle-fill-icon/3-circle-fill-icon';

@Component({
  selector: 'app-exercice-level-picker',
  templateUrl: './exercice-level-picker.html',
  imports: [NgComponentOutlet],
})
export class ExerciceLevelPicker {
  level = model.required<Level>();

  readonly levels = LEVELS;

  readonly levelIcons: Record<Level, Type<Icon>> = {
    1: OneCircleIcon,
    2: TwoCircleIcon,
    3: ThreeCircleIcon,
  };

  readonly levelFillIcons: Record<Level, Type<Icon>> = {
    1: OneCircleFillIcon,
    2: TwoCircleFillIcon,
    3: ThreeCircleFillIcon,
  };

  readonly iconInputs: Record<string, unknown> = {
    className: 'w-6 h-6',
  };
}
