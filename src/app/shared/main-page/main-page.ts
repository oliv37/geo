import { Component, input, signal, Type } from '@angular/core';
import type { Data } from '@shared/data';
import type { Level } from './levels/level';
import { Level1 } from './levels/level1/level1';
import { Level2 } from './levels/level2/level2';
import { LevelPicker } from './levels/level-picker/level-picker';

@Component({
  selector: 'geo-main-page',
  templateUrl: './main-page.html',
  imports: [LevelPicker, Level1, Level2],
})
export class MainPage<T extends Data> {
  readonly Map = input.required<Type<unknown>>();
  readonly data = input.required<readonly T[]>();
  readonly fields = input.required<readonly (keyof T)[]>();

  protected readonly level = signal<Level>(2);

  protected onLevelChange(level: Level) {
    this.level.set(level);
  }
}
