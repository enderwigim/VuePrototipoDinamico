<template>
  <div class="grid grid-cols-6 gap-4">
    <IQSInputField
      v-for="field in headerFields"
      :key="field.name"
      :field="field"
      label="Nombre"
      inputId="nombre"
      required
      helpText="Ingrese su nombre completo."
    >
      <IQSInputTextBase
        v-if="field.type === 'string'"
        v-model="modelComp[field.name]"
        :placeholder="field.placeholder"
      >
      </IQSInputTextBase>

      <IQSInputNumberBase
        v-if="field.type === 'number'"
        v-model="modelComp[field.name]"
        :placeholder="field.placeholder"
      >
      </IQSInputNumberBase>

      <IQSInputMaskBase
        v-if="field.type === 'mask'"
        v-model="modelComp[field.name]"
        :placeholder="field.placeholder"
        :mask="field.mask"
      >
      </IQSInputMaskBase>

      <IQSSelectBase
        v-if="field.type === 'select'"
        v-model="modelComp[field.name]"
        :placeholder="field.placeholder"
        :options="field.options"
      ></IQSSelectBase>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  headerFields: Object,
  model: Object,
  Header: Object,
});

// const modelComp = computed({
//   get: () => props.model,
//   set: (value) => emit("update:modelValue", value),
// });
</script>
