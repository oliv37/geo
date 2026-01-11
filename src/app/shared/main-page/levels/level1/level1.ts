import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import type { Data } from '@shared/data';
import { CaretRightFillIcon } from '@shared/icon/caret-right-fill-icon/caret-right-fill-icon';
import { PlayIcon } from '@shared/icon/play-icon/play-icon';
import { StopIcon } from '@shared/icon/stop-icon/stop-icon';
import { CaretLeftFillIcon } from '@shared/icon/caret-left-fill-icon/caret-left-fill-icon';

type PlayStopState = 'play' | 'stop';

const TIMEOUT_DURATION_MS = 5000;

@Component({
  selector: 'geo-level1',
  templateUrl: './level1.html',
  imports: [CaretRightFillIcon, PlayIcon, StopIcon, CaretLeftFillIcon],
})
export class Level1<T extends Data> implements OnDestroy {
  #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  #timeoutId: number | undefined;
  #animation: Animation | undefined;

  readonly data = input.required<readonly T[]>();
  readonly fields = input.required<readonly (keyof T)[]>();
  readonly item = model<T>();

  protected readonly playStopState = signal<PlayStopState>('stop');

  protected readonly playOverlayRef =
    viewChild<ElementRef<HTMLDivElement>>('playOverlay');

  protected togglePlayStopState() {
    this.playStopState.update((state) => (state === 'play' ? 'stop' : 'play'));
  }

  readonly itemInitEffect = effect(() => {
    if (!this.#isBrowser) {
      return;
    }

    const data = this.data();
    const randomItem = data[Math.floor(Math.random() * data.length)];
    this.item.set(randomItem);
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

  protected previousItem() {
    const data = this.data();
    const dataLength = data.length;
    const itemIndex = this.#getItemIndex();

    if (itemIndex === -1) {
      return;
    }

    this.item.set(data[(itemIndex - 1 + dataLength) % dataLength]);
  }

  protected nextItem() {
    const data = this.data();
    const dataLength = data.length;
    const itemIndex = this.#getItemIndex();

    if (itemIndex === -1) {
      return;
    }

    this.item.set(data[(itemIndex + 1) % dataLength]);
  }

  #getItemIndex(): number {
    const data = this.data();
    const item = this.item();

    return item ? data.findIndex((dataItem) => dataItem.id === item.id) : -1;
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

  #cancelTimeoutAndAnimation() {
    clearTimeout(this.#timeoutId);
    this.#animation?.cancel();
  }
}
