<template>
  <div :class="headerStyle">
    <IQSControlManager
      v-for="(field, index) in headerFields"
      :key="field.name ?? field.field ?? index"
      :control="field"
      :model-value="getModelValue(field)"
      @update:model-value="setModelValue(field, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import IQSControlManager from "@/components/inputs/fields/IQSControlManager.vue";
// Importación de tipos
import type { Field, FieldValue, DynamicModel } from "@/types/types";

const props = withDefaults(
  defineProps<{
    headerStyle?: string;
    headerFields?: Field[];
    model?: DynamicModel;
  }>(),
  {
    headerStyle: "",
    headerFields: () => [],
    model: () => ({}),
  },
);

const emit = defineEmits<{
  (e: "update:model", value: DynamicModel): void;
}>();

function getModelValue(field: Field): FieldValue {
  if (!field.field) {
    return null;
  }

  return props.model[field.field] ?? null;
}

function setModelValue(field: Field, value: FieldValue): void {
  if (!field.field) {
    return;
  }

  emit("update:model", {
    ...props.model,
    [field.field]: value,
  });
}
</script>
