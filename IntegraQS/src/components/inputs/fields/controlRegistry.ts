// En vez de realizar un import de cada componente, utilizaremos una función que nos cargue cada uno de ellos.

import IQSInputTextBase from "@/components/inputs/base/IQSInputTextBase.vue";
import IQSInputNumberBase from "@/components/inputs/base/IQSInputNumberBase.vue";
import IQSInputMaskBase from "@/components/inputs/base/IQSInputMaskBase.vue";
import IQSSelectBase from "@/components/inputs/base/IQSSelectBase.vue";
import IQSCheckBoxBase from "@/components/inputs/base/IQSCheckBoxBase.vue";
import SearchControler from "@/components/search/SearchController.vue";
import type { ControlRegistration } from "@/types/types";
import IQSImage from "@/components/IQSImage.vue";

// Según el tipo de control, se registrará el componente correspondiente.

// useFieldWrapper --> Lo utilizamos para saber si debemos meterlo en el campo de inputfield
const controlRegistry: Record<string, ControlRegistration> = {
  string: {
    component: IQSInputTextBase,
    useFieldWrapper: true,
    usesModelValue: true,
  },

  number: {
    component: IQSInputNumberBase,
    useFieldWrapper: true,
    usesModelValue: true,
  },

  mask: {
    component: IQSInputMaskBase,
    useFieldWrapper: true,
    usesModelValue: true,
  },

  select: {
    component: IQSSelectBase,
    useFieldWrapper: true,
    usesModelValue: true,
  },

  // Los dos tipos utilizan el mismo componente visual.
  "select linked": {
    component: SearchControler,
    useFieldWrapper: true,
    usesModelValue: true,
    // 2026-09-29 QUEDARA EN DESUSO
    minSize: 2, // 2026-08-18 Se agrega la propiedad minSize ya que este componente necesitará un tamaño mínimo de 2 columnas.
  },

  checkbox: {
    component: IQSCheckBoxBase,
    useFieldWrapper: true,
    usesModelValue: true,
  },

  image: {
    component: IQSImage,
    useFieldWrapper: false,
    usesModelValue: false,

    buildProps: (control) => ({
      src: control.src,
      alt: control.alt ?? control.title ?? "",
      objectFit: control.objectFit ?? "contain",
    }),
  },
};

// Función get del registro.
export function getControlRegistration(type: string): ControlRegistration | undefined {
  return controlRegistry[type.trim().toLowerCase()];
}
