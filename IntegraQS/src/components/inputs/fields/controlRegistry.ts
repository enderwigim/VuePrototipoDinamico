// En vez de realizar un import de cada componente, utilizaremos una función que nos cargue cada uno de ellos.

import IQSInputTextBase from "@/components/inputs/base/IQSInputTextBase.vue";
import IQSInputNumberBase from "@/components/inputs/base/IQSInputNumberBase.vue";
import IQSInputMaskBase from "@/components/inputs/base/IQSInputMaskBase.vue";
import IQSSelectBase from "@/components/inputs/base/IQSSelectBase.vue";
import IQSCheckBoxBase from "@/components/inputs/base/IQSCheckBoxBase.vue";
import SearchControler from "@/components/search/SearchController.vue";
import type { ControlRegistration } from "@/types/types";

// Según el tipo de control, se registrará el componente correspondiente.
const controlRegistry: Record<string, ControlRegistration> = {
  string: {
    component: IQSInputTextBase,
    useFieldWrapper: true,
  },

  number: {
    component: IQSInputNumberBase,
    useFieldWrapper: true,
  },

  mask: {
    component: IQSInputMaskBase,
    useFieldWrapper: true,
  },

  select: {
    component: IQSSelectBase,
    useFieldWrapper: true,
  },

  // Los dos tipos utilizan el mismo componente visual.
  "select linked": {
    component: SearchControler,
    useFieldWrapper: true,
    minSize: 2, // 2026-08-18 Se agrega la propiedad minSize ya que este componente necesitará un tamaño mínimo de 2 columnas.
  },

  checkbox: {
    component: IQSCheckBoxBase,
    useFieldWrapper: true,
  },
};

// Función get del registro.
export function getControlRegistration(type: string): ControlRegistration | undefined {
  return controlRegistry[type.trim().toLowerCase()];
}
