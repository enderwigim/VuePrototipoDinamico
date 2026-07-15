import type { Component } from "vue";

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
  maintenanceWindow: string;
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

// Gestión de controles
export interface ControlRegistration {
  component: Component;
  useFieldWrapper: boolean;
}

// Gestión de estado de ventanas.
export type WinState = "read" | "modify" | "creation";
export type WindowType = "base" | "modal";

export interface WindowInstance {
  instanceId: string; // Identificado único de la instancia de ventana
  windowName: string; // Nombre de la ventana
  state: WinState; // Estado independiente de la ventana
  type: WindowType; // Tipo de ventana (base o modal)
  parentId: string | null; // Identificado de la instancia del padre
}

// Opciones para registrar una nueva instancia.
export interface RegisterWindowOptions {
  windowName: string;
  type?: WindowType;
  parentId?: string | null; // Padre de la ventana
  initialState?: WinState;
}
