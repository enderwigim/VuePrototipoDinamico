import type { Component } from "vue";

export type DynamicModel = Record<string, string | number | boolean | null>;

export type FieldValue = string | number | boolean | null;

export interface Field {
  name: string;
  size?: string;
  type: FieldType;
  field: string | null;
  state: FieldState;
  title: string;
  columns?: TableColumn[];
  // 2026-09-30 Adaptar ya que estos 3 quedarán obsoletos.
  inputClass?: string;
  labelClass?: string;

  placeholder?: string;
  mask?: string;
  options?: HeaderOption[];

  // Image
  src?: string;
  alt?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";

  // 2026-09-30 Estilos del componente, que pasaremos por parametro.
  // Hasta este punto se ha optado por 2 cosas a tomar en consideración
  component_style: DynamicModel;
  //style: DynamicModel;
  layout: DynamicModel;
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
  style: Record<string, unknown>;
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
  // 2026-09-29 Santi.
  usesModelValue?: boolean;
  // 2026-09-29 Esto nos permitirá crear un registro especifico para el control. Nosotros siempre le pasamos un field, pero queremos
  // construir props especificas para dicho componente. De esta manera podemos tener un field utra generico, que siempre
  // podremos utilizar, o adaptar según lo que querramos.
  buildProps?: (control: Field) => Record<string, unknown>;

  // 2026-09-29 Se irá en desuso esto.
  minSize?: number; // 2026-08-18 Se agrega la propiedad minSize para que los controles que necesiten un tamaño mínimo puedan indicarlo.
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
