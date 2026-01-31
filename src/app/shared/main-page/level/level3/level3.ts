import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  Renderer2,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import type { Data, DataField } from '@shared/data';
import { isPlatformBrowser, NgComponentOutlet } from '@angular/common';
import { ArrowClockwiseIcon } from '@shared/icon/arrow-clockwise-icon/arrow-clockwise-icon';
import { PatchQuestionIcon } from '@shared/icon/patch-question-icon/patch-question-icon';
import {
  createLevel3StateWithRandomItems,
  Level3State,
} from './state/level3-state';
import { LevelProgress } from '@shared/main-page/level-progress/level-progress';

@Component({
  selector: 'geo-level3',
  templateUrl: './level3.html',
  imports: [
    NgComponentOutlet,
    ArrowClockwiseIcon,
    PatchQuestionIcon,
    LevelProgress,
  ],
})
export class Level3<T extends Data> {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #renderer = inject(Renderer2);

  readonly Map = input.required<Type<unknown>>();
  readonly data = input.required<readonly T[]>();
  readonly fields = input.required<readonly DataField<T>[]>();

  protected readonly state = signal<Level3State<T> | undefined>(undefined);

  protected readonly mapContainerRef =
    viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  protected readonly inputElRef =
    viewChild<ElementRef<HTMLInputElement>>('inputEl');

  protected readonly item = computed<T | undefined>(() => {
    const state = this.state();

    return state ? state.item : undefined;
  });

  readonly itemsAnswered = computed<T[]>(() => {
    const state = this.state();

    return state ? state.items.slice(0, state.itemIndex) : [];
  });

  readonly initStateEffect = effect(() => {
    if (!this.#isBrowser) {
      return;
    }

    const data = this.data();
    const fields = this.fields();

    this.state.set(createLevel3StateWithRandomItems(data, fields));
  });

  readonly selectItemOnMapEffect = effect(() => {
    const mapContainerRef = this.mapContainerRef();
    const itemsAnswered = this.itemsAnswered();
    const item = this.item();

    this.#markItemsOnMap(mapContainerRef, itemsAnswered, item);
  });

  readonly focusInputEffect = effect(() => {
    const state = this.state();
    const inputElRef = this.inputElRef();

    if (state && inputElRef) {
      inputElRef.nativeElement.focus();
    }
  });

  constructor() {
    afterNextRender(() => {
      const mapContainerRef = this.mapContainerRef();
      const itemsAnswered = this.itemsAnswered();
      const item = this.item();

      this.#markItemsOnMap(mapContainerRef, itemsAnswered, item);
    });
  }

  #markItemsOnMap(
    mapContainerRef: ElementRef<HTMLDivElement> | undefined,
    itemsAnswered: readonly T[],
    item?: T,
  ) {
    if (!mapContainerRef) {
      return;
    }

    mapContainerRef.nativeElement
      .querySelectorAll(`path.highlighted, g.highlighted`)
      .forEach((el) => this.#renderer.removeClass(el, 'highlighted'));

    mapContainerRef.nativeElement
      .querySelectorAll('path.selected, g.selected')
      .forEach((el) => this.#renderer.removeClass(el, 'selected'));

    if (itemsAnswered) {
      itemsAnswered.forEach((item) => {
        mapContainerRef.nativeElement
          .querySelectorAll(`path[id="${item.id}"], g[id="${item.id}"]`)
          .forEach((el) => this.#renderer.addClass(el, 'highlighted'));
      });
    }

    if (item) {
      mapContainerRef.nativeElement
        .querySelectorAll(`path[id="${item.id}"], g[id="${item.id}"]`)
        .forEach((el) => this.#renderer.addClass(el, 'selected'));
    }
  }
}
