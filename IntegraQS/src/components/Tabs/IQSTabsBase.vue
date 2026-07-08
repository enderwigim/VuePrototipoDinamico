<template>
  <VoltTabs :value="props.value" v-bind="tabsAttrs">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </VoltTabs>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import VoltTabs from "@/volt/Tabs.vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  value: string | number;
}>();

const attrs = useAttrs();

const tabsPt = {
  "pt:root:class": `
    flex
    flex-col

    w-full

    rounded-xl
    border
    border-slate-200
    dark:border-slate-700

    bg-white
    dark:bg-slate-900

    shadow-sm
  `,
};

const tabsAttrs = computed<Record<string, unknown>>(function () {
  const cleanAttrs: Record<string, unknown> = {
    ...attrs,
  };

  if (cleanAttrs.class === null) {
    delete cleanAttrs.class;
  }

  return {
    ...cleanAttrs,
    ...tabsPt,
  };
});
</script>
