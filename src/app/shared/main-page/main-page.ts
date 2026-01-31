import { Component, input, signal, Type } from '@angular/core';
import type { Data } from '@shared/data';
import type { Level } from './level/level';
import { LevelPicker } from './level-picker/level-picker';
import { Level1 } from './level/level1/level1';
import { Level2 } from './level/level2/level2';
import { Level3 } from './level/level3/level3';

@Component({
  selector: 'geo-main-page',
  templateUrl: './main-page.html',
  imports: [LevelPicker, Level1, Level2, Level3],
})
export class MainPage<T extends Data> {
  readonly Map = input.required<Type<unknown>>();
  readonly data = input.required<readonly T[]>();
  readonly fields = input.required<readonly (keyof T)[]>();

  protected readonly level = signal<Level>(1);

  protected onLevelChange(level: Level) {
    this.level.set(level);
  }
}
