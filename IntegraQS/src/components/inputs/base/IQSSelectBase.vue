<template>
  <VoltSelect v-bind="selectAttrs">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </VoltSelect>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import VoltSelect from "@/volt/Select.vue";

defineOptions({
  inheritAttrs: false,
});

// Construimos un objeto con los atributos que queremos pasar al componente VoltSelect, combinando los atributos recibidos
// y los estilos personalizados.
const attrs = useAttrs();
const inputSelectPt = {
  "pt:root:class": `
        w-full rounded-xl
        bg-white
        border border-slate-300
        hover:border-blue-400
        p-focus:border-blue-500
        p-focus:ring-2
        p-focus:ring-blue-100
        p-invalid:border-red-500
        shadow-sm
    `,

  "pt:label:class": `
        py-2.5 px-3
        text-sm text-slate-700
        p-placeholder:text-slate-400
    `,

  "pt:dropdown:class": `
        w-10
        text-slate-500
    `,

  "pt:overlay:class": `
        rounded-xl
        border border-slate-200
        bg-white
        shadow-xl
    `,

  "pt:list:class": `
        p-1
        gap-1
    `,

  "pt:option:class": `
        rounded-lg
        px-3 py-2
        text-sm text-slate-700
        p-focus:bg-blue-50
        p-focus:text-blue-700
        p-selected:bg-blue-100
        p-selected:text-blue-700
    `,

  "pt:emptyMessage:class": `
        px-3 py-2
        text-sm text-slate-400
    `,
};
const selectAttrs = computed(function () {
  return {
    ...attrs,
    ...inputSelectPt,
  };
});
</script>
