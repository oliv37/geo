import { NgComponentOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  PLATFORM_ID,
  Renderer2,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import { Data } from '@shared/data';
import { isPlatformBrowser } from '@angular/common';
import { findRandoms, shuffle } from '@shared/misc/array';
import { equalsIgnoreCase, intersectionIgnoreCase } from '@shared/misc/str';

interface Item<T> {
  value: T;
  showAllHints: boolean;
}

interface State<T> {
  items: Item<T>[];
  itemIdx: number;
  fields: readonly (keyof T)[];
  fieldIdx: number;
  text: string;
}

const EMPTY_STATE: State<unknown> = {
  items: [],
  itemIdx: 0,
  fields: [],
  fieldIdx: 0,
  text: '',
};

@Component({
  selector: 'geo-write-view',
  templateUrl: './write-view.html',
  imports: [NgComponentOutlet],
})
export class WriteView<T extends Data> {
  readonly #isBrowser = signal(isPlatformBrowser(inject(PLATFORM_ID)));
  readonly #renderer = inject(Renderer2);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly Map = input.required<Type<any>>();
  readonly data = input.required<readonly T[]>();
  readonly fields = input.required<readonly (keyof T)[]>();

  protected readonly state = linkedSignal<State<T>>(() => {
    const isBrowser = this.#isBrowser();
    const data = this.data();
    const fields = this.fields();

    if (!isBrowser) {
      return EMPTY_STATE as State<T>;
    }

    return this.#generateState(data, fields);
  });

  protected readonly item = computed<Item<T> | undefined>(() => {
    const { items, itemIdx } = this.state();

    return items.length > 0 ? items[itemIdx] : undefined;
  });

  protected readonly field = computed<keyof T | undefined>(() => {
    const { fields, fieldIdx } = this.state();

    return fields[fieldIdx];
  });

  protected readonly answer = computed<string | undefined>(() => {
    const item = this.item();
    const field = this.field();

    return item && field ? item.value[field] : undefined;
  });

  protected readonly hints = computed<string[]>(() => {
    const state = this.state();
    const item = this.item();

    if (!item) {
      return [];
    }

    return item.showAllHints
      ? this.#buildAllHints(state, item)
      : this.#buildPartialHints(state, item);
  });

  protected readonly progressPercent = computed<number>(() => {
    const { items, itemIdx } = this.state();

    return items.length > 0 ? ((itemIdx + 1) / items.length) * 100 : 0;
  });

  protected readonly mapContainerRef =
    viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  protected readonly inputElRef =
    viewChild<ElementRef<HTMLInputElement>>('inputEl');

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
      ?.querySelectorAll(
        `path[id="${item.value.id}"], g[id="${item.value.id}"]`
      )
      .forEach((el) => this.#renderer.addClass(el, 'selected'));
  });

  readonly textValidEffect = effect(() => {
    const state = this.state();
    const answer = this.answer();

    const isTextValid = answer && equalsIgnoreCase(state.text, answer);

    if (!isTextValid) {
      return;
    }

    const hasNextField = state.fieldIdx < state.fields.length - 1;
    if (hasNextField) {
      this.#nextField();
      return;
    }

    const hasNextItem = state.itemIdx < state.items.length - 1;
    if (hasNextItem) {
      this.#nextItem();
      return;
    }

    this.reset();
  });

  constructor() {
    afterNextRender(() => this.#focusInput());
  }

  protected setText(text: string) {
    this.state.update((prevState) => ({
      ...prevState,
      text,
    }));
  }

  protected reset() {
    const data = this.data();
    const fields = this.fields();

    this.state.set(this.#generateState(data, fields));

    this.#focusInput();
  }

  #focusInput() {
    this.inputElRef()?.nativeElement.focus();
  }

  #nextField() {
    this.state.update((prevState) => ({
      ...prevState,
      fieldIdx: Math.min(prevState.fieldIdx + 1, prevState.fields.length - 1),
      text: '',
    }));
  }

  #nextItem() {
    this.state.update((prevState) => ({
      ...prevState,
      itemIdx: Math.min(prevState.itemIdx + 1, prevState.items.length - 1),
      fieldIdx: 0,
      text: '',
    }));
  }

  #generateState(data: readonly T[], fields: readonly (keyof T)[]): State<T> {
    const items: Item<T>[] = this.#generateRandomItems(data);

    return {
      items,
      itemIdx: 0,
      fields,
      fieldIdx: 0,
      text: '',
    };
  }

  #generateRandomItems(data: readonly T[]): Item<T>[] {
    const items = findRandoms(data, 3);

    return [
      ...items.map((value) => ({ value, showAllHints: true })),
      ...shuffle(items).map((value) => ({ value, showAllHints: false })),
    ];
  }

  #buildAllHints(state: State<T>, item: Item<T>): string[] {
    return state.fields.map((_field) => item.value[_field]);
  }

  #buildPartialHints(state: State<T>, item: Item<T>): string[] {
    const hints = state.fields.map((_field) => item.value[_field]);

    return [
      ...hints.slice(0, state.fieldIdx),
      intersectionIgnoreCase(state.text, hints[state.fieldIdx]),
    ];
  }
}
