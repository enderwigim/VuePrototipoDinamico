<template>
  <p>Campos recibidos: {{ headerFields.length }}</p>
  <p>Modelo recibido: {{ Object.keys(model).length }}</p>
  <div class="grid grid-cols-6 gap-4">
    <IQSInputField
      v-for="(field, index) in headerFields"
      :key="field.name ?? field.field ?? index"
      :label="field.title"
      :inputId="field.name"
    >
      <IQSInputTextBase
        v-if="field.type === 'string'"
        :model-value="getModelValue(field)"
        @update:model-value="setModelValue(field, $event)"
        :placeholder="field.placeholder"
      >
      </IQSInputTextBase>

      <IQSInputNumberBase
        v-if="field.type === 'number'"
        :model-value="getModelValue(field)"
        @update:model-value="setModelValue(field, $event)"
        :placeholder="field.placeholder"
      >
      </IQSInputNumberBase>

      <IQSInputMaskBase
        v-if="field.type === 'mask'"
        :model-value="getModelValue(field)"
        @update:model-value="setModelValue(field, $event)"
        :placeholder="field.placeholder"
        :mask="field.mask"
      >
      </IQSInputMaskBase>

      <IQSSelectBase
        v-if="field.type === 'select' || field.type === 'select linked'"
        :model-value="getSelectModelValue(field)"
        @update:model-value="setSelectModelValue(field, $event)"
        :placeholder="field.placeholder"
        :options="field.options"
        option-label="title"
        option-value="value"
      ></IQSSelectBase>

      <IQSCheckBoxBase
        v-if="field.type === 'checkbox'"
        :model-value="getModelValue(field)"
        @update:model-value="setModelValue(field, $event)"
      ></IQSCheckBoxBase>
    </IQSInputField>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { computed } from "vue";
import IQSInputField from "@/components/inputs/fields/IQSInputField.vue";
import IQSInputMaskBase from "@/components/inputs/base/IQSInputMaskBase.vue";
import IQSInputNumberBase from "@/components/inputs/base/IQSInputNumberBase.vue";
import IQSInputTextBase from "@/components/inputs/base/IQSInputTextBase.vue";
import IQSSelectBase from "@/components/inputs/base/IQSSelectBase.vue";
import IQSCheckBoxBase from "@/components/inputs/base/IQSCheckBoxBase.vue";

export type FieldValue = string | number | boolean | null;

export type DynamicModel = Record<string, FieldValue>;

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

const props = withDefaults(
  defineProps<{
    headerFields?: HeaderField[];
    model?: DynamicModel;
  }>(),
  {
    headerFields: () => [],
    model: () => ({}),
  },
);
console.log(props.model);
const emit = defineEmits<{
  (e: "update:model", value: DynamicModel): void;
}>();

function getModelValue(field: HeaderField): FieldValue {
  if (!field.field) {
    return null;
  }

  return props.model[field.field] ?? null;
}

function setModelValue(field: HeaderField, value: FieldValue): void {
  if (!field.field) {
    return;
  }

  emit("update:model", {
    ...props.model,
    [field.field]: value,
  });
}

// CASO SELECT
function getSelectModelValue(field: HeaderField): FieldValue {
  const value = getModelValue(field);

  if (!field.options) {
    return value;
  }

  const option = field.options.find((option) => {
    return String(option.value) === String(value);
  });

  if (!option) {
    return value;
  }

  return option.value;
}

function setSelectModelValue(field: HeaderField, value: FieldValue): void {
  const currentValue = getModelValue(field);

  let newValue = value;

  if (typeof currentValue === "number" && value !== null) {
    newValue = Number(value);
  }

  setModelValue(field, newValue);
}
// const modelComp = computed({
//   get: () => props.model,
//   set: (value) => emit("update:modelValue", value),
// });
</script>
