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
import {
  type Level2State,
  createReadStateWithRandomItems,
} from './state/level2-state';
import { CaretLeftFillIcon } from '@shared/icon/caret-left-fill-icon/caret-left-fill-icon';
import { CaretRightFillIcon } from '@shared/icon/caret-right-fill-icon/caret-right-fill-icon';
import { PencilIcon } from '@shared/icon/pencil-icon/pencil-icon';
import { ArrowClockwiseIcon } from '@shared/icon/arrow-clockwise-icon/arrow-clockwise-icon';
import { PatchQuestionIcon } from '@shared/icon/patch-question-icon/patch-question-icon';
import { LevelProgress } from '@shared/main-page/level-progress/level-progress';

@Component({
  selector: 'geo-level2',
  templateUrl: './level2.html',
  imports: [
    CaretLeftFillIcon,
    CaretRightFillIcon,
    PencilIcon,
    NgComponentOutlet,
    ArrowClockwiseIcon,
    PatchQuestionIcon,
    LevelProgress,
  ],
})
export class Level2<T extends Data> {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #renderer = inject(Renderer2);

  readonly Map = input.required<Type<unknown>>();
  readonly data = input.required<readonly T[]>();
  readonly fields = input.required<readonly DataField<T>[]>();

  protected readonly state = signal<Level2State<T> | undefined>(undefined);

  protected readonly mapContainerRef =
    viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  protected readonly inputElRef =
    viewChild<ElementRef<HTMLInputElement>>('inputEl');

  protected readonly items = computed<readonly T[]>(() => {
    const state = this.state();

    return state ? state.items : [];
  });

  protected readonly item = computed<T | undefined>(() => {
    const state = this.state();

    return state ? state.item : undefined;
  });

  readonly initStateEffect = effect(() => {
    if (!this.#isBrowser) {
      return;
    }

    const data = this.data();
    const fields = this.fields();

    this.state.set(createReadStateWithRandomItems(data, fields));
  });

  readonly markItemsOnMapEffect = effect(() => {
    const mapContainerRef = this.mapContainerRef();
    const items = this.items();
    const item = this.item();

    this.#markItemsOnMap(mapContainerRef, items, item);
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
      const items = this.items();
      const item = this.item();

      this.#markItemsOnMap(mapContainerRef, items, item);
    });
  }

  #markItemsOnMap(
    mapContainerRef: ElementRef<HTMLDivElement> | undefined,
    items: readonly T[],
    item: T | undefined,
  ) {
    if (!mapContainerRef) {
      return;
    }

    mapContainerRef.nativeElement
      .querySelectorAll(`path.highlighted, g.highlighted`)
      .forEach((el) => this.#renderer.removeClass(el, 'highlighted'));

    mapContainerRef.nativeElement
      .querySelectorAll(`path.selected, g.selected`)
      .forEach((el) => this.#renderer.removeClass(el, 'selected'));

    if (items) {
      items.forEach((item) => {
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
