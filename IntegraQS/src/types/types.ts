export type DynamicModel = Record<string, string | number | boolean | null>;

export type FieldValue = string | number | boolean | null;

export interface HeaderField {
  name: string;
  size: string;
  type: HeaderFieldType;
  field: string | null;
  state: HeaderFieldState;
  title: string;

  inputClass?: string;
  labelClass?: string;

  placeholder?: string;
  mask?: string;
  options?: HeaderOption[];
}

export interface HeaderOption {
  title: string;
  value: string | number;
  disabled: boolean;
}

export type HeaderFieldType =
  | "number"
  | "string"
  | "mask"
  | "tag"
  | "select"
  | "select linked"
  | string;

export type HeaderFieldState = "active" | "readOnly" | "disabled" | "hidden" | string;
