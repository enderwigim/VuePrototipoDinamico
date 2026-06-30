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

const attrs = useAttrs();

const inputSelectPt = {
  "pt:root:class": `
    w-full
    h-10

    flex
    items-center

    rounded-lg
    border
    border-slate-300

    bg-white
    text-slate-800

    shadow-sm

    transition-colors
    duration-200

    hover:border-blue-400

    p-focus:border-blue-600
    p-focus:ring-2
    p-focus:ring-blue-100

    p-filled:bg-white

    p-invalid:border-red-500
    p-invalid:ring-1
    p-invalid:ring-red-100

    p-disabled:bg-slate-100
    p-disabled:border-slate-200
    p-disabled:text-slate-400
    p-disabled:cursor-not-allowed
    p-disabled:shadow-none
  `,

  "pt:label:class": `
    flex
    items-center

    w-full
    h-full

    px-3
    py-2

    text-sm
    font-normal
    text-slate-800

    truncate

    p-placeholder:text-slate-400
    p-disabled:text-slate-400
  `,

  "pt:dropdown:class": `
    flex
    items-center
    justify-center

    w-10
    h-full

    text-slate-500

    transition-colors
    duration-200

    p-disabled:text-slate-400
  `,

  "pt:overlay:class": `
    mt-1

    rounded-lg
    border
    border-slate-200

    bg-white

    shadow-xl
    shadow-slate-200/60

    overflow-hidden
  `,

  "pt:listContainer:class": `
    max-h-72
    overflow-y-auto
    overflow-x-hidden
  `,

  "pt:list:class": `
    p-1
  `,

  "pt:option:class": `
    flex
    items-center

    rounded-md

    px-3
    py-2

    text-sm
    text-slate-700

    cursor-pointer

    transition-colors
    duration-150

    p-focus:bg-blue-50
    p-focus:text-blue-700

    p-selected:bg-blue-100
    p-selected:text-blue-700
    p-selected:font-medium

    p-disabled:text-slate-400
    p-disabled:cursor-not-allowed
  `,

  "pt:emptyMessage:class": `
    px-3
    py-2

    text-sm
    text-slate-400
  `,
};

const selectAttrs = computed<Record<string, unknown>>(function () {
  const cleanAttrs: Record<string, unknown> = {
    ...attrs,
  };

  if (cleanAttrs.class === null) {
    delete cleanAttrs.class;
  }

  return {
    ...cleanAttrs,
    ...inputSelectPt,
  };
});
</script>
