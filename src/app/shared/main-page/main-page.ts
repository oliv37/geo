import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import type { Data } from '@shared/data';
import type { Level } from './levels/level';
import { Level1 } from './levels/level1/level1';
import { Level2 } from './levels/level2/level2';
import { LevelPicker } from './levels/level-picker/level-picker';

@Component({
  selector: 'geo-main-page',
  templateUrl: './main-page.html',
  imports: [NgComponentOutlet, Level1, LevelPicker, Level2],
})
export class MainPage<T extends Data> {
  readonly #renderer = inject(Renderer2);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly Map = input.required<Type<any>>();
  readonly data = input.required<readonly T[]>();
  readonly fields = input.required<readonly (keyof T)[]>();

  protected readonly level = signal<Level>(1);
  protected readonly item = signal<T | undefined>(undefined);

  protected readonly isMapClickable = computed<boolean>(
    () => this.level() === 1
  );

  protected readonly mapContainerRef =
    viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  readonly selectItemOnMapEffect = effect(() => {
    const mapContainerRef = this.mapContainerRef();
    const item = this.item();

    mapContainerRef?.nativeElement
      ?.querySelectorAll('path.selected, g.selected')
      .forEach((el) => this.#renderer.removeClass(el, 'selected'));

    if (item) {
      mapContainerRef?.nativeElement
        ?.querySelectorAll(`path[id="${item.id}"], g[id="${item.id}"]`)
        .forEach((el) => this.#renderer.addClass(el, 'selected'));
    }
  });

  protected onMapClick(event: MouseEvent) {
    if (!this.isMapClickable()) {
      return;
    }

    const target = event.target as HTMLElement | null;
    const targetId = target?.id;
    const targetTag = target?.tagName;

    if ((targetTag === 'path' || targetTag === 'g') && targetId) {
      const item = this.data().find((d) => d.id === targetId);

      if (item) {
        this.item.set(item);
      }
    }
  }

  protected onLevelChange(level: Level) {
    this.level.set(level);
    this.item.set(undefined);
  }
}
