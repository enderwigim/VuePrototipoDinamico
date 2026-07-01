<template>
  <VoltTabPanels v-bind="tabPanelsAttrs">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </VoltTabPanels>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import VoltTabPanels from "@/volt/TabPanels.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const tabPanelsPt = {
  "pt:root:class": `
    w-full

    bg-white
    dark:bg-slate-900

    text-slate-800
    dark:text-slate-100

    outline-none

    px-4
    py-4
  `,
};

const tabPanelsAttrs = computed<Record<string, unknown>>(function () {
  const cleanAttrs: Record<string, unknown> = {
    ...attrs,
  };

  if (cleanAttrs.class === null) {
    delete cleanAttrs.class;
  }

  return {
    ...cleanAttrs,
    ...tabPanelsPt,
  };
});
</script>
