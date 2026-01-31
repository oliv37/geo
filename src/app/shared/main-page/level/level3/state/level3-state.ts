import type { Data, DataField } from '@shared/data';
import { shuffle } from '@shared/misc/array';
import { equalsIgnoreCase } from '@shared/misc/str';

export class Level3State<T extends Data> {
  readonly data: readonly T[];
  readonly fields: readonly DataField<T>[];
  readonly items: readonly T[];
  readonly itemIndex: number;
  readonly fieldIndex: number;
  readonly text: string;
  readonly item: T;
  readonly prevFieldValues: readonly string[];

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
    const prevFieldValues: string[] = itemFieldValues.slice(0, fieldIndex);

    this.data = data;
    this.fields = fields;
    this.items = items;
    this.itemIndex = itemIndex;
    this.fieldIndex = fieldIndex;
    this.text = text;
    this.item = item;
    this.prevFieldValues = prevFieldValues;
  }

  reset(): Level3State<T> {
    return createLevel3StateWithRandomItems(this.data, this.fields);
  }

  help(): Level3State<T> {
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

    return new Level3State(
      this.data,
      this.fields,
      this.items,
      this.itemIndex,
      this.fieldIndex,
      text,
    );
  }

  next(inputValue: string): Level3State<T> {
    const item: T = this.item;
    const field: DataField<T> = this.fields[this.fieldIndex];
    const itemFieldValue = String(item[field]);

    const isInputValueValid = equalsIgnoreCase(inputValue, itemFieldValue);

    if (!isInputValueValid) {
      return new Level3State<T>(
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
      return new Level3State<T>(
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
      return new Level3State<T>(
        this.data,
        this.fields,
        this.items,
        this.itemIndex + 1,
        0,
        '',
      );
    }

    return createLevel3StateWithRandomItems(this.data, this.fields);
  }
}

export function createLevel3StateWithRandomItems<T extends Data>(
  data: readonly T[],
  fields: readonly DataField<T>[],
): Level3State<T> {
  const items = shuffle(data);
  return new Level3State<T>(data, fields, items);
}
