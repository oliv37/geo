import type { Data, DataField } from '@shared/data';
import { shuffle, findRandoms } from '@shared/misc/array';
import { equalsIgnoreCase, intersectionIgnoreCase } from '@shared/misc/str';

const NB_ITEMS = 5;

export type Level2State<T extends Data> = ReadState<T> | WriteState<T>;

export class ReadState<T extends Data> {
  readonly id = 'read';

  readonly data: readonly T[];
  readonly fields: readonly DataField<T>[];
  readonly items: readonly T[];
  readonly itemIndex: number;
  readonly item: T;
  readonly otherItems: readonly T[];
  readonly itemFieldValues: readonly string[];

  constructor(
    data: readonly T[],
    fields: readonly DataField<T>[],
    items: readonly T[],
    itemIndex = 0,
  ) {
    const item = items[itemIndex];
    const otherItems = items.filter((_item) => _item !== item);
    const itemFieldValues = fields.map((field) => String(item[field]));

    this.data = data;
    this.fields = fields;
    this.items = items;
    this.itemIndex = itemIndex;
    this.item = item;
    this.otherItems = otherItems;
    this.itemFieldValues = itemFieldValues;
  }

  reset(): ReadState<T> {
    return createReadStateWithRandomItems(this.data, this.fields);
  }

  next(): WriteState<T> {
    return new WriteState<T>(this.data, this.fields, shuffle(this.items));
  }

  prevItem(): ReadState<T> {
    return new ReadState(
      this.data,
      this.fields,
      this.items,
      (this.itemIndex + this.items.length - 1) % this.items.length,
    );
  }

  nextItem(): ReadState<T> {
    return new ReadState(
      this.data,
      this.fields,
      this.items,
      (this.itemIndex + 1) % this.items.length,
    );
  }
}

export class WriteState<T extends Data> {
  readonly id = 'write';

  readonly data: readonly T[];
  readonly fields: readonly DataField<T>[];
  readonly items: readonly T[];
  readonly itemIndex: number;
  readonly fieldIndex: number;
  readonly text: string;
  readonly item: T;
  readonly hints: readonly string[];

  constructor(
    data: readonly T[],
    fields: readonly DataField<T>[],
    items: readonly T[],
    itemIndex = 0,
    fieldIndex = 0,
    text = '',
  ) {
    const item: T = items[itemIndex];
    const itemFieldValues: string[] = fields.map((field) =>
      String(item[field]),
    );
    const itemFieldValue: string = itemFieldValues[fieldIndex];
    const hints: string[] = [
      ...itemFieldValues.slice(0, fieldIndex),
      intersectionIgnoreCase(text, itemFieldValue),
    ];

    this.data = data;
    this.fields = fields;
    this.items = items;
    this.itemIndex = itemIndex;
    this.fieldIndex = fieldIndex;
    this.text = text;
    this.item = item;
    this.hints = hints;
  }

  reset(): ReadState<T> {
    return createReadStateWithRandomItems(this.data, this.fields);
  }

  help(): WriteState<T> {
    const item = this.item;
    const field: DataField<T> = this.fields[this.fieldIndex];
    const itemFieldValue = String(item[field]);

    let lastValidIndex = 0;
    while (
      lastValidIndex < Math.min(this.text.length, itemFieldValue.length) &&
      this.text[lastValidIndex] === itemFieldValue[lastValidIndex]
    ) {
      lastValidIndex++;
    }

    const maxEnd = itemFieldValue.length - 1;
    const end = Math.min(lastValidIndex + 1, maxEnd);
    const text = itemFieldValue.substring(0, end);

    return new WriteState(
      this.data,
      this.fields,
      this.items,
      this.itemIndex,
      this.fieldIndex,
      text,
    );
  }

  next(inputValue: string): Level2State<T> {
    const item: T = this.item;
    const field: DataField<T> = this.fields[this.fieldIndex];
    const itemFieldValue = String(item[field]);

    const isInputValueValid = equalsIgnoreCase(inputValue, itemFieldValue);

    if (!isInputValueValid) {
      return new WriteState<T>(
        this.data,
        this.fields,
        this.items,
        this.itemIndex,
        this.fieldIndex,
        inputValue,
      );
    }

    const isLastField = this.fieldIndex === this.fields.length - 1;
    if (!isLastField) {
      return new WriteState<T>(
        this.data,
        this.fields,
        this.items,
        this.itemIndex,
        this.fieldIndex + 1,
        '',
      );
    }

    const isLastItem = this.itemIndex === this.items.length - 1;
    if (!isLastItem) {
      return new WriteState<T>(
        this.data,
        this.fields,
        this.items,
        this.itemIndex + 1,
        0,
        '',
      );
    }

    return createReadStateWithRandomItems(this.data, this.fields);
  }
}

export function createReadStateWithRandomItems<T extends Data>(
  data: readonly T[],
  fields: readonly DataField<T>[],
): ReadState<T> {
  const items = findRandoms(data, NB_ITEMS);
  return new ReadState<T>(data, fields, items);
}
