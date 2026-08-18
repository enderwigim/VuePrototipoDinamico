<template>
  <!-- Control desconocido -->
  <div
    v-if="!registration"
    class="rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700"
  >
    Tipo de control no soportado: {{ control.type }}
  </div>

  <!-- Control envuelto en IQSInputField -->
  <IQSInputField
    v-else-if="registration.useFieldWrapper"
    :label="control.title"
    :input-id="control.name"
    :size="Number(control.size ?? 1)"
  >
    <component
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
import { computed } from "vue";
import { getControlRegistration } from "@/components/inputs/fields/controlRegistry";
import type { Field, FieldValue } from "@/types/types";
import IQSInputField from "@/components/inputs/fields/IQSInputField.vue";

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
