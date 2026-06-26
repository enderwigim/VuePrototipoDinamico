<template>
  <VoltInputText v-bind="inputTextAttrs" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import VoltInputText from "@/volt/InputText.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const inputTextPt = {
  "pt:root:class": `
    w-full
    h-10

    appearance-none
    outline-none

    rounded-lg
    border
    border-slate-300

    bg-white
    text-slate-800
    placeholder:text-slate-400

    px-3
    py-2

    text-sm
    font-normal

    shadow-sm

    transition-colors
    duration-200

    enabled:hover:border-blue-400

    focus:outline-none
    focus:border-blue-600
    focus:ring-2
    focus:ring-blue-100

    p-focus:border-blue-600
    p-focus:ring-2
    p-focus:ring-blue-100

    p-filled:bg-white

    p-invalid:border-red-500
    p-invalid:text-red-700
    p-invalid:placeholder:text-red-400
    p-invalid:ring-1
    p-invalid:ring-red-100

    disabled:bg-slate-100
    disabled:border-slate-200
    disabled:text-slate-400
    disabled:placeholder:text-slate-400
    disabled:cursor-not-allowed
    disabled:shadow-none
  `,
};

const inputTextAttrs = computed<Record<string, unknown>>(function () {
  const cleanAttrs: Record<string, unknown> = {
    ...attrs,
  };

  if (cleanAttrs.class === null) {
    delete cleanAttrs.class;
  }

  return {
    ...cleanAttrs,
    ...inputTextPt,
  };
});
</script>
