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
    appearance-none
    rounded-xl
    outline-none

    bg-white
    border border-slate-300
    text-slate-700
    placeholder:text-slate-400

    hover:border-blue-400

    p-focus:border-blue-500
    p-focus:ring-2
    p-focus:ring-blue-100

    p-filled:bg-slate-50

    p-invalid:border-red-500
    p-invalid:placeholder:text-red-400

    disabled:bg-slate-100
    disabled:text-slate-400
    disabled:cursor-not-allowed

    px-3 py-2.5
    text-sm

    shadow-sm
    transition-colors
    duration-200
  `,
};

const inputTextAttrs = computed(function () {
  return {
    ...attrs,
    ...inputTextPt,
  };
});
</script>
