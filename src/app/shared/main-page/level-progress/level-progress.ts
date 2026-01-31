import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'geo-level-progress',
  templateUrl: './level-progress.html',
})
export class LevelProgress {
  current = input<number>();
  total = input<number>();

  protected readonly progressPercent = computed<number>(() => {
    const current = this.current();
    const total = this.total();

    if (
      current === undefined ||
      total === undefined ||
      current === 0 ||
      total === 0
    ) {
      return 0;
    }

    return Math.max(Math.min((current / total) * 100, 100), 0);
  });
}
