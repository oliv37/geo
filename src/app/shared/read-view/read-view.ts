import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  Signal,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import { Data } from '@shared/data';
import { PlayIcon } from '@shared/icon/play-icon/play-icon';
import { StopIcon } from '@shared/icon/stop-icon/stop-icon';
import { CaretRightFillIcon } from '@shared/icon/caret-right-fill-icon/caret-right-fill-icon';
import { CaretLeftFillIcon } from '@shared/icon/caret-left-fill-icon/caret-left-fill-icon';
import { isPlatformBrowser } from '@angular/common';

type PlayStopState = 'play' | 'stop';

const TIMEOUT_DURATION_MS = 5000;

@Component({
  selector: 'geo-read-view',
  templateUrl: './read-view.html',
  imports: [
    NgComponentOutlet,
    PlayIcon,
    StopIcon,
    CaretRightFillIcon,
    CaretLeftFillIcon,
  ],
})
export class ReadView<T extends Data> implements OnDestroy {
  readonly #isBrowser = signal(isPlatformBrowser(inject(PLATFORM_ID)));
  readonly #renderer = inject(Renderer2);
  #timeoutId: number | undefined;
  #animation: Animation | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly Map = input.required<Type<any>>();
  readonly data = input.required<readonly T[]>();
  readonly fields = input.required<readonly (keyof T)[]>();

  protected readonly index = linkedSignal(() => {
    const data = this.data();
    return Math.floor(Math.random() * data.length);
  });

  protected readonly playStopState = signal<PlayStopState>('stop');

  protected readonly item: Signal<T | undefined> = computed(() => {
    const isBrowser = this.#isBrowser();
    const data = this.data();
    const index = this.index();

    return isBrowser ? data[index] : undefined;
  });

  protected readonly mapContainerRef =
    viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  protected readonly playOverlayRef =
    viewChild<ElementRef<HTMLDivElement>>('playOverlay');

  readonly selectItemOnMapEffect = effect(() => {
    const mapContainerRef = this.mapContainerRef();
    const item = this.item();

    if (!item) {
      return;
    }

    mapContainerRef?.nativeElement
      ?.querySelectorAll('path.selected, g.selected')
      .forEach((el) => this.#renderer.removeClass(el, 'selected'));

    mapContainerRef?.nativeElement
      ?.querySelectorAll(`path[id="${item.id}"], g[id="${item.id}"]`)
      .forEach((el) => this.#renderer.addClass(el, 'selected'));
  });

  readonly playStopEffect = effect(() => {
    const item = this.item();
    const playStopState = this.playStopState();

    this.#cancelTimeoutAndAnimation();

    if (item && playStopState === 'play') {
      this.#startTimeoutAndAnimation();
    }
  });

  ngOnDestroy() {
    this.#cancelTimeoutAndAnimation();
  }

  protected onMapClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (['path', 'g'].includes(target.tagName) && target.hasAttribute('id')) {
      const id = target.getAttribute('id');
      const index = this.data().findIndex((d) => d.id === id);

      if (index !== -1) {
        this.index.set(index);
      }
    }
  }

  protected togglePlayStopState() {
    this.playStopState.update((state) => (state === 'play' ? 'stop' : 'play'));
  }

  protected previousItem() {
    this.index.update(
      (prevIndex) => (prevIndex - 1 + this.data().length) % this.data().length
    );
  }

  protected nextItem() {
    this.index.update((prevIndex) => (prevIndex + 1) % this.data().length);
  }

  #cancelTimeoutAndAnimation() {
    clearTimeout(this.#timeoutId);
    this.#animation?.cancel();
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
      }
    );
  }
}
