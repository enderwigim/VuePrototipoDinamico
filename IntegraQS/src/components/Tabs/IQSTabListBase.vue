<template>
  <VoltTabList v-bind="tabListAttrs">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </VoltTabList>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import VoltTabList from "@/volt/TabList.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const navButtonClass = `
  absolute
  top-0
  z-20

  flex
  items-center
  justify-center
  flex-shrink-0

  h-full
  w-10

  cursor-pointer

  bg-white
  dark:bg-slate-900

  text-slate-500
  dark:text-slate-400

  shadow-[0px_0px_10px_50px_rgba(255,255,255,0.70)]
  dark:shadow-[0px_0px_10px_50px_rgba(15,23,42,0.70)]

  transition-colors
  duration-200

  hover:text-blue-700
  dark:hover:text-blue-300

  focus:outline-none
  focus:ring-0
`;

const tabListPt = {
  "pt:root:class": `
    flex
    relative

    w-full

    bg-white
    dark:bg-slate-900
  `,

  "pt:prevButton:class": `
    ${navButtonClass}
    start-0
  `,

  "pt:nextButton:class": `
    ${navButtonClass}
    end-0
  `,

  "pt:content:class": `
    flex-grow

    p-scrollable:overflow-x-auto
    p-scrollable:overflow-y-hidden
    p-scrollable:overscroll-y-contain
    p-scrollable:overscroll-x-auto

    scroll-smooth
    [scrollbar-width:none]
  `,

  "pt:tabList:class": `
    relative
    flex

    bg-white
    dark:bg-slate-900

    border-b
    border-slate-200
    dark:border-slate-700

    p-scrollable:overflow-hidden
  `,

  "pt:activeBar:class": `
    z-10
    block
    absolute

    -bottom-px

    h-0.5

    bg-blue-600
    dark:bg-blue-500

    transition-[left]
    duration-200
    ease-[cubic-bezier(0.35,0,0.25,1)]
  `,
};

const tabListAttrs = computed<Record<string, unknown>>(function () {
  const cleanAttrs: Record<string, unknown> = {
    ...attrs,
  };

  if (cleanAttrs.class === null) {
    delete cleanAttrs.class;
  }

  return {
    ...cleanAttrs,
    ...tabListPt,
  };
});
</script>
