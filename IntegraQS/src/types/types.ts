export type DynamicModel = Record<string, string | number | boolean | null>;

export type FieldValue = string | number | boolean | null;

export interface Field {
  name: string;
  size: string;
  type: FieldType;
  field: string | null;
  state: FieldState;
  title: string;
  columns?: TableColumn[];
  inputClass?: string;
  labelClass?: string;

  placeholder?: string;
  mask?: string;
  options?: HeaderOption[];
}

export interface TableColumn {
  key: string;
  type: FieldType;
  field: string | null;
  state: FieldState;
  header: string;
  visible: boolean;
  bodyClass: string;
  columnProps: DynamicModel;
  headerClass: string;
  columnConfig: DynamicModel;
}
export interface HeaderOption {
  title: string;
  value: string | number;
  disabled: boolean;
}

export type FieldType =
  | "number"
  | "string"
  | "mask"
  | "tag"
  | "select"
  | "select linked"
  | "table"
  | string;

export interface DetailTab {
  title: string;
  controls: Field[];
  value: number;
}
export interface WinFormat {
  Header: {
    style: Record<string, unknown>;
    fields: Field[];
  };
  Footer: unknown[];
  Details: DetailTab[];
  Lateral: unknown[];
}

export type FieldState = "active" | "readOnly" | "disabled" | "hidden" | string;
