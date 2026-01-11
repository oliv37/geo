import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
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
  itemIndex: number;
  fields: readonly (keyof T)[];
  fieldIndex: number;
  text: string;
}

const EMPTY_STATE: State<unknown> = {
  items: [],
  itemIndex: 0,
  fields: [],
  fieldIndex: 0,
  text: '',
};

@Component({
  selector: 'geo-level2',
  templateUrl: './level2.html',
})
export class Level2<T extends Data> {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly data = input.required<readonly T[]>();
  readonly fields = input.required<readonly (keyof T)[]>();
  readonly itemChange = output<T | undefined>();

  protected readonly state = signal<State<T>>(EMPTY_STATE as State<T>);

  protected readonly item = computed<Item<T> | undefined>(() => {
    const { items, itemIndex } = this.state();

    return items.length > 0 ? items[itemIndex] : undefined;
  });

  protected readonly field = computed<keyof T | undefined>(() => {
    const { fields, fieldIndex } = this.state();

    return fields.length > 0 ? fields[fieldIndex] : undefined;
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
    const { items, itemIndex } = this.state();

    return items.length > 0 ? ((itemIndex + 1) / items.length) * 100 : 0;
  });

  protected readonly mapContainerRef =
    viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  protected readonly inputElRef =
    viewChild<ElementRef<HTMLInputElement>>('inputEl');

  readonly stateInitEffect = effect(() => {
    if (!this.#isBrowser) {
      return;
    }

    const data = this.data();
    const fields = this.fields();

    this.state.set(this.#generateState(data, fields));
  });

  readonly itemChangeEffect = effect(() => {
    const item = this.item();

    this.itemChange.emit(item?.value);
  });

  constructor() {
    afterNextRender(() => this.#focusInput());
  }

  protected onInput(value: string) {
    const state = this.state();
    const answer = this.answer();

    const isValidValue = answer && equalsIgnoreCase(value, answer);

    if (!isValidValue) {
      this.#setText(value);
      return;
    }

    const hasNextField = state.fieldIndex < state.fields.length - 1;
    if (hasNextField) {
      this.#nextField();
      return;
    }

    const hasNextItem = state.itemIndex < state.items.length - 1;
    if (hasNextItem) {
      this.#nextItem();
      return;
    }

    this.reset();
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

  #setText(text: string) {
    this.state.update((prevState) => ({
      ...prevState,
      text,
    }));
  }

  #nextField() {
    this.state.update((prevState) => ({
      ...prevState,
      fieldIndex: Math.min(
        prevState.fieldIndex + 1,
        prevState.fields.length - 1
      ),
      text: '',
    }));
  }

  #nextItem() {
    this.state.update((prevState) => ({
      ...prevState,
      itemIndex: Math.min(prevState.itemIndex + 1, prevState.items.length - 1),
      fieldIndex: 0,
      text: '',
    }));
  }

  #generateState(data: readonly T[], fields: readonly (keyof T)[]): State<T> {
    const items: Item<T>[] = this.#generateRandomItems(data);

    return {
      items,
      itemIndex: 0,
      fields,
      fieldIndex: 0,
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
      ...hints.slice(0, state.fieldIndex),
      intersectionIgnoreCase(state.text, hints[state.fieldIndex]),
    ];
  }
}
