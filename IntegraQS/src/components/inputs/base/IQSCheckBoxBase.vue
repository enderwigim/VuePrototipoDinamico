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
  `,

  "pt:input:class": `
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

    p-checked:border-blue-500
    p-checked:bg-blue-500
    p-checked:text-white

    peer-enabled:peer-hover:p-checked:bg-blue-600
    peer-enabled:peer-hover:p-checked:border-blue-600

    peer-focus-visible:outline
    peer-focus-visible:outline-2
    peer-focus-visible:outline-offset-2
    peer-focus-visible:outline-blue-500

    p-invalid:border-red-500

    p-disabled:bg-slate-100
    p-disabled:border-slate-300
    p-disabled:text-slate-400
  `,

  "pt:icon:class": `
    w-3.5
    h-3.5
    text-white
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
