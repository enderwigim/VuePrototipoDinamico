<template>
  <VoltTab :value="props.value" v-bind="tabAttrs">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </VoltTab>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import VoltTab from "@/volt/Tab.vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  value: string | number;
}>();

const attrs = useAttrs();

const tabPt = {
  "pt:root:class": `
    flex
    items-center
    justify-center
    flex-shrink-0

    relative

    h-12

    px-4

    cursor-pointer
    select-none
    whitespace-nowrap

    border-b-2
    border-transparent

    text-sm
    font-medium

    text-slate-500
    dark:text-slate-400

    transition-colors
    duration-200

    -mb-px

    not-p-active:enabled:hover:text-blue-700
    dark:not-p-active:enabled:hover:text-blue-300

    not-p-active:enabled:hover:border-blue-200
    dark:not-p-active:enabled:hover:border-blue-800

    p-active:border-blue-600
    p-active:text-blue-700

    dark:p-active:border-blue-500
    dark:p-active:text-blue-300

    disabled:pointer-events-none
    disabled:opacity-50

    focus:outline-none
    focus:ring-0
  `,
};

const tabAttrs = computed<Record<string, unknown>>(function () {
  const cleanAttrs: Record<string, unknown> = {
    ...attrs,
  };

  if (cleanAttrs.class === null) {
    delete cleanAttrs.class;
  }

  return {
    ...cleanAttrs,
    ...tabPt,
  };
});
</script>
