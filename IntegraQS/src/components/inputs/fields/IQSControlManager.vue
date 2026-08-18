<template>
  <!-- Control desconocido -->
  <div
    v-if="!registration"
    class="rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700"
  >
    Tipo de control no soportado: {{ control.type }}
  </div>

  <!-- Control vinculado + detalle -->
  <!-- 2026-08-17  El control pasará a controlarse dentro del InputField.-->
  <!-- <SearchControler
    v-else-if="control.type === 'select linked'"
    :modelValue="searchValue"
    @update:modelValue="searchValue = $event"
    :field="String(props.control.field)"
  /> -->

  <!-- Control envuelto en IQSInputField -->
  <IQSInputField
    v-else-if="registration.useFieldWrapper"
    :label="control.title"
    :input-id="control.name"
    :size="effectiveSize"
  >
    <SearchControler
      v-if="normalizedType === 'select linked'"
      :model-value="searchValue"
      :field="String(control.field)"
      @update:model-value="handleSearchUpdate"
    />

    <component
      v-else
      :is="registration.component"
      v-bind="componentProps"
      :model-value="displayValue"
      @update:model-value="handleUpdate"
    />
  </IQSInputField>

  <!-- Para controles futuros que no necesiten IQSInputField -->
  <component
    :is="registration.component"
    v-else
    v-bind="componentProps"
    :model-value="displayValue"
    @update:model-value="handleUpdate"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, type Ref } from "vue";
import { getControlRegistration } from "@/components/inputs/fields/controlRegistry";
import type { DynamicModel, Field, FieldValue } from "@/types/types";
import IQSInputField from "@/components/inputs/fields/IQSInputField.vue";
import SearchControler from "@/components/search/SearchController.vue";
import { getSelectedOption } from "@/services/iqs.service";

const props = defineProps<{
  control: Field;
  modelValue: FieldValue;
}>();
// console.log(props.model);
const emit = defineEmits<{
  (e: "update:modelValue", value: FieldValue): void;
}>();

const normalizedType = computed(() => {
  return props.control.type.trim().toLowerCase();
});

const registration = computed(() => {
  return getControlRegistration(normalizedType.value);
});

const isSelect = computed(() => {
  return normalizedType.value === "select" || normalizedType.value === "select linked";
});

const effectiveSize = computed(() => {
  const requestedSize = Number(props.control.size ?? 1);
  const minSize = registration.value?.minSize ?? 1;
  return Math.max(requestedSize, minSize);
});

const searchValue: Ref<DynamicModel | null> = ref(null);
// 2026-08-17. Santi. Este es código nuevo creado por Alejandro. No entiendo exactamente que búscaba hacer con esto.
// Si se maneja de esta manera, y el manejador siempre está controlando el cambio del searchValue, cuando se actualiza el modelValue, el searchValue se pierde.
// Comento este código y remplazo por una función que maneja el cambio del searchValue y actualiza el modelValue.
// Tal vez Alejandro vió alguna límitación que no estoy entendiendo de momento.

// watch(
//   () => [props.control.field, props.modelValue, props.control.type],
//   async ([field, value, type]) => {
//     if (type != "select linked" || value == null) {
//       searchValue.value = null;
//       return;
//     }

//     try {
//       searchValue.value = await getSelectedOption(String(field), value);
//       console.log("searchValue.value: ", searchValue.value);
//     } catch (error) {
//       console.error("Error obteniendo la opción seleccionada", error);
//       searchValue.value = null;
//     }
//   },
//   { immediate: true },
// );
watch(
  () => [props.control.field, props.modelValue, normalizedType.value],
  async ([field, value, type]) => {
    console.log("watch triggered with:", { field, value, type });
    // Solo nos interesa para SearchController.
    if (type !== "select linked") {
      return;
    }

    // Si el modelo no tiene valor, limpiamos SearchController.
    if (value === null || value === undefined) {
      searchValue.value = null;
      return;
    }

    /*
     * Si SearchController ya contiene este mismo ID,
     * significa normalmente que el cambio acaba de venir
     * del propio SearchController.
     *
     * No necesitamos volver a consultar backend.
     */
    const currentValue = searchValue.value?.id;
    console.log("currentValue:", currentValue, "value:", value);
    if (
      currentValue !== null &&
      currentValue !== undefined &&
      String(currentValue) === String(value)
    ) {
      return;
    }

    try {
      console.log("Obteniendo opción seleccionada para field:", field, "value:", value);
      searchValue.value = <DynamicModel>{
        id: String(value),
        description: "Cargando...",
      };
      searchValue.value = await getSelectedOption(String(field), value);

      console.log("SearchValue cargado desde modelValue:", searchValue.value);
    } catch (error) {
      console.error("Error obteniendo la opción seleccionada", error);

      searchValue.value = null;
    }
  },
  {
    immediate: true,
  },
);

function handleSearchUpdate(value: DynamicModel | null): void {
  searchValue.value = value;

  if (value === null) {
    emit("update:modelValue", null);
    return;
  }

  const selectedValue = value.id;

  if (selectedValue === undefined) {
    return;
  }

  emit("update:modelValue", selectedValue);
}

/**
 * Props que recibirá el componente dinámico.
 *
 * Se construyen según el tipo para evitar pasar propiedades como
 * mask u options a componentes que no las utilizan.
 */
const componentProps = computed<Record<string, unknown>>(() => {
  // Agrega las props comunes a todos los controles.
  const commonProps: Record<string, unknown> = {
    placeholder: props.control.placeholder,
    readonly: props.control.state === "readOnly",
    disabled: props.control.state === "disabled",
  };

  // Agrega la clase personalizada si está definida en el control.
  // A cambiar en el JSON en el futuro para que inputClass sea dinamico. Igual que la cabecera.
  if (props.control.inputClass) {
    commonProps.class = props.control.inputClass;
  }
  // Agrega las props específicas según el tipo de control.
  switch (normalizedType.value) {
    case "mask":
      return {
        ...commonProps,
        mask: props.control.mask,
      };

    case "select":
    case "select linked":
      return {
        ...commonProps,
        options: props.control.options ?? [],
        parentField: props.control.field,
        selectType: props.control.type,
        optionLabel: "title",
        optionValue: "value",
      };

    default:
      return commonProps;
  }
});

/**
 * Normaliza el valor del select.
 *
 * Esto soluciona temporalmente el caso en el que el backend devuelve
 * un número, pero option.value contiene un string.
 */
const displayValue = computed<FieldValue>(() => {
  if (!isSelect.value || !props.control.options) {
    return props.modelValue;
  }
  // console.log(props)
  return String(props.modelValue);
});

function handleUpdate(value: FieldValue): void {
  let newValue = value;

  /*
   * Conserva el tipo del valor actual.
   *
   * Ejemplo:
   * modelValue = 2
   * option.value = "2"
   *
   * El valor emitido vuelve a convertirse en número.
   */

  if (isSelect.value && props.control.type == "select linked") {
  }

  if (isSelect.value && typeof props.modelValue === "number" && value !== null) {
    const numericValue = Number(value);

    newValue = Number.isNaN(numericValue) ? value : numericValue;
  }

  if (normalizedType.value === "number" && value !== null) {
    const numericValue = Number(value);

    newValue = Number.isNaN(numericValue) ? null : numericValue;
  }

  emit("update:modelValue", newValue);
}
</script>
