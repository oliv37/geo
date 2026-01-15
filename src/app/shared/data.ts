export interface Data {
  id: string | number;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type DataField<T extends Data> = keyof T;

export interface Country {
  id: string;
  country: string;
  city: string;
}

export interface Department {
  id: string;
  department: string;
  city: string;
}

export interface State {
  id: string;
  state: string;
  city: string;
}
