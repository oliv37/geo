import { NgComponentOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import type { Data } from '@shared/data';
import { CaretRightFillIcon } from '@shared/icon/caret-right-fill-icon/caret-right-fill-icon';
import { PlayIcon } from '@shared/icon/play-icon/play-icon';
import { StopIcon } from '@shared/icon/stop-icon/stop-icon';
import { CaretLeftFillIcon } from '@shared/icon/caret-left-fill-icon/caret-left-fill-icon';
import { LevelProgress } from '@shared/main-page/level-progress/level-progress';

type PlayStopState = 'play' | 'stop';

const TIMEOUT_DURATION_MS = 5000;

@Component({
  selector: 'geo-level1',
  templateUrl: './level1.html',
  imports: [
    CaretRightFillIcon,
    PlayIcon,
    StopIcon,
    CaretLeftFillIcon,
    NgComponentOutlet,
    LevelProgress,
  ],
})
export class Level1<T extends Data> implements OnDestroy {
  readonly #renderer = inject(Renderer2);

  #timeoutId: number | undefined;
  #animation: Animation | undefined;

  readonly Map = input.required<Type<unknown>>();
  readonly data = input.required<readonly T[]>();
  readonly fields = input.required<readonly (keyof T)[]>();

  protected readonly item = signal<T | undefined>(undefined);
  protected readonly playStopState = signal<PlayStopState>('stop');

  protected readonly playOverlayRef =
    viewChild<ElementRef<HTMLDivElement>>('playOverlay');

  protected readonly mapContainerRef =
    viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  protected readonly itemIndex = computed<number>(() => {
    const data = this.data();
    const item = this.item();

    return item ? data.findIndex((dataItem) => dataItem.id === item.id) : -1;
  });

  readonly initItemEffect = effect(() => {
    const data = this.data();
    this.item.set(data[0]);
  });

  readonly markItemOnMapEffect = effect(() => {
    const mapContainerRef = this.mapContainerRef();
    const item = this.item();

    this.#markItemOnMap(mapContainerRef, item);
  });

  readonly playStopEffect = effect(() => {
    const item = this.item();
    const playStopState = this.playStopState();

    this.#cancelTimeoutAndAnimation();

    if (item && playStopState === 'play') {
      this.#startTimeoutAndAnimation();
    }
  });

  constructor() {
    afterNextRender(() => {
      const mapContainerRef = this.mapContainerRef();
      const item = this.item();

      this.#markItemOnMap(mapContainerRef, item);
    });
  }

  ngOnDestroy() {
    this.#cancelTimeoutAndAnimation();
  }

  protected onMapClick(event: MouseEvent) {
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

  protected togglePlayStopState() {
    this.playStopState.update((state) => (state === 'play' ? 'stop' : 'play'));
  }

  protected previousItem() {
    const data = this.data();
    const itemIndex = this.itemIndex();

    if (itemIndex === -1) {
      return;
    }

    this.item.set(data[(itemIndex - 1 + data.length) % data.length]);
  }

  protected nextItem() {
    const data = this.data();
    const itemIndex = this.itemIndex();

    if (itemIndex === -1) {
      return;
    }

    this.item.set(data[(itemIndex + 1) % data.length]);
  }

  #startTimeoutAndAnimation() {
    this.#timeoutId = window.setTimeout(() => {
      this.nextItem();
    }, TIMEOUT_DURATION_MS);

    this.#animation = this.playOverlayRef()?.nativeElement.animate(
      [{ width: '0%' }, { width: '100%' }],
      {
        duration: TIMEOUT_DURATION_MS,
        fill: 'forwards',
      },
    );
  }

  #cancelTimeoutAndAnimation() {
    clearTimeout(this.#timeoutId);
    this.#animation?.cancel();
  }

  #markItemOnMap(mapContainerRef?: ElementRef<HTMLDivElement>, item?: T) {
    mapContainerRef?.nativeElement
      ?.querySelectorAll('path.selected, g.selected')
      .forEach((el) => this.#renderer.removeClass(el, 'selected'));

    if (item) {
      mapContainerRef?.nativeElement
        ?.querySelectorAll(`path[id="${item.id}"], g[id="${item.id}"]`)
        .forEach((el) => this.#renderer.addClass(el, 'selected'));
    }
  }
}
