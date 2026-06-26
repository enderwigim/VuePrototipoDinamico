<template>
  <VoltCheckbox v-bind="checkboxAttrs" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import VoltCheckbox from "@/volt/Checkbox.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const checkboxPt = {
  "pt:root:class": `
    relative
    inline-flex
    select-none
    align-bottom
    w-5
    h-5
  `,

  "pt:input:class": `
    peer
    absolute
    start-0
    top-0
    z-10

    w-full
    h-full
    m-0
    p-0

    appearance-none
    opacity-0

    cursor-pointer
    disabled:cursor-not-allowed
  `,

  "pt:box:class": `
    flex
    items-center
    justify-center

    w-5
    h-5

    rounded-md
    border
    border-slate-300

    bg-white
    text-white

    shadow-sm

    transition-colors
    duration-200

    peer-enabled:peer-hover:border-blue-400

    p-checked:border-blue-600
    p-checked:bg-blue-600
    p-checked:text-white

    peer-enabled:peer-hover:p-checked:border-blue-700
    peer-enabled:peer-hover:p-checked:bg-blue-700

    peer-focus-visible:outline-none
    peer-focus-visible:ring-2
    peer-focus-visible:ring-blue-100
    peer-focus-visible:ring-offset-2
    peer-focus-visible:ring-offset-white

    p-invalid:border-red-500
    p-invalid:ring-1
    p-invalid:ring-red-100

    p-disabled:bg-slate-100
    p-disabled:border-slate-300
    p-disabled:text-slate-400
    p-disabled:shadow-none
    p-disabled:opacity-70
  `,

  "pt:icon:class": `
    w-3.5
    h-3.5
    text-white
    stroke-2
  `,
};

const checkboxAttrs = computed(function () {
  return {
    binary: true,
    ...attrs,
    ...checkboxPt,
  };
});
</script>
