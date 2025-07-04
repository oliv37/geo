import { Injectable, signal, WritableSignal } from '@angular/core';
import type { Level } from '@models/level';

@Injectable()
export class ExerciceLevel {
  private _level: WritableSignal<number> = signal(1);

  level = this._level.asReadonly();

  next() {
    const level = this.level();
    const nextLevel = level < 3 ? ((level + 1) as Level) : 1;
    this._level.set(nextLevel);
  }
}
