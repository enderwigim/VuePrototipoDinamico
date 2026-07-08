<template>
  <VoltTabPanel :value="props.value" v-bind="tabPanelAttrs">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </VoltTabPanel>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import VoltTabPanel from "@/volt/TabPanel.vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  value: string | number;
}>();

const attrs = useAttrs();

const tabPanelPt = {
  "pt:root:class": `
    w-full

    bg-white
    dark:bg-slate-900

    text-slate-800
    dark:text-slate-100

    px-4
    py-4
  `,
};

const tabPanelAttrs = computed<Record<string, unknown>>(function () {
  const cleanAttrs: Record<string, unknown> = {
    ...attrs,
  };

  if (cleanAttrs.class === null) {
    delete cleanAttrs.class;
  }

  return {
    ...cleanAttrs,
    ...tabPanelPt,
  };
});
</script>
