<template>
  <VoltDatePicker v-bind="datePickerAttrs">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </VoltDatePicker>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import VoltDatePicker from "@/volt/DatePicker.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const datePickerPt = {
  "pt:root:class": `
    inline-flex
    relative
    w-full
    max-w-full
  `,

  "pt:pcInputText:root:class": `
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

  "pt:dropdown:class": `
    flex
    items-center
    justify-center

    h-10
    w-10
    shrink-0

    rounded-e-lg
    border
    border-s-0
    border-slate-300

    bg-slate-50
    text-slate-500

    shadow-sm

    transition-colors
    duration-200

    enabled:hover:bg-blue-50
    enabled:hover:text-blue-700
    enabled:hover:border-blue-400

    focus:outline-none
    focus:ring-0

    disabled:bg-slate-100
    disabled:text-slate-400
    disabled:cursor-not-allowed
  `,

  "pt:inputIconContainer:class": `
    absolute
    top-1/2
    end-3
    -mt-2

    text-slate-400
    leading-none
    cursor-pointer
  `,

  "pt:panel:class": `
    w-auto
    min-w-full

    mt-1
    p-3

    rounded-xl
    border
    border-slate-200

    bg-white
    text-slate-800

    shadow-xl
    shadow-slate-200/70
  `,

  "pt:calendarContainer:class": `
    flex
  `,

  "pt:calendar:class": `
    flex-auto
    gap-3
    px-3

    border-s
    border-slate-200

    first:ps-0
    first:border-s-0
    last:pe-0
  `,

  "pt:header:class": `
    flex
    items-center
    justify-between
    gap-2

    px-0
    pt-0
    pb-2

    border-b
    border-slate-200

    bg-white
    text-slate-800

    font-medium
  `,

  "pt:title:class": `
    flex
    items-center
    justify-between
    gap-2

    font-medium
  `,

  "pt:selectMonth:class": `
    border-none
    bg-transparent

    m-0
    px-2
    py-1

    rounded-md

    text-sm
    font-medium
    text-slate-800

    cursor-pointer

    transition-colors
    duration-200

    enabled:hover:bg-blue-50
    enabled:hover:text-blue-700

    focus:outline-none
    focus:ring-0
  `,

  "pt:selectYear:class": `
    border-none
    bg-transparent

    m-0
    px-2
    py-1

    rounded-md

    text-sm
    font-medium
    text-slate-800

    cursor-pointer

    transition-colors
    duration-200

    enabled:hover:bg-blue-50
    enabled:hover:text-blue-700

    focus:outline-none
    focus:ring-0
  `,

  "pt:dayView:class": `
    w-full
    border-collapse

    mt-2
    mb-0
    mx-0

    text-sm
  `,

  "pt:weekDay:class": `
    font-medium
    text-slate-500
  `,

  "pt:weekDayCell:class": `
    p-1
  `,

  "pt:dayCell:class": `
    p-1
  `,

  "pt:day:class": `
    flex
    items-center
    justify-center

    w-8
    h-8

    mx-auto
    my-0
    p-1

    rounded-full
    border
    border-transparent

    text-sm
    text-slate-700

    cursor-pointer
    overflow-hidden
    relative

    transition-colors
    duration-200

    hover:bg-blue-50
    hover:text-blue-700

    focus:outline-none
    focus:ring-0

    p-selected:bg-blue-600
    p-selected:text-white

    p-today:bg-slate-100
    p-today:text-slate-900
    p-today:font-medium

    p-today:hover:bg-blue-50
    p-today:hover:text-blue-700

    p-today:p-selected:bg-blue-600
    p-today:p-selected:text-white

    p-disabled:opacity-50
    p-disabled:pointer-events-none
  `,

  "pt:monthView:class": `
    mt-2
    mb-0
    mx-0
  `,

  "pt:month:class": `
    inline-flex
    items-center
    justify-center

    w-1/3

    p-2

    rounded-lg

    text-sm
    text-slate-700

    cursor-pointer
    overflow-hidden
    relative

    transition-colors
    duration-200

    hover:bg-blue-50
    hover:text-blue-700

    focus:outline-none
    focus:ring-0

    p-selected:bg-blue-600
    p-selected:text-white
  `,

  "pt:yearView:class": `
    mt-2
    mb-0
    mx-0
  `,

  "pt:year:class": `
    inline-flex
    items-center
    justify-center

    w-1/2

    p-2

    rounded-lg

    text-sm
    text-slate-700

    cursor-pointer
    overflow-hidden
    relative

    transition-colors
    duration-200

    hover:bg-blue-50
    hover:text-blue-700

    focus:outline-none
    focus:ring-0

    p-selected:bg-blue-600
    p-selected:text-white
  `,

  "pt:buttonbar:class": `
    flex
    items-center
    justify-between

    pt-2
    pb-0
    px-0

    border-t
    border-slate-200
  `,

  "pt:timePicker:class": `
    flex
    items-center
    justify-center
    gap-2

    border-t
    border-slate-200

    p-0

    not-p-time-only:pt-2
    not-p-time-only:pb-0
    not-p-time-only:px-0
  `,

  "pt:hourPicker:class": `
    flex
    items-center
    flex-col
    gap-1
  `,

  "pt:minutePicker:class": `
    flex
    items-center
    flex-col
    gap-1
  `,

  "pt:secondPicker:class": `
    flex
    items-center
    flex-col
    gap-1
  `,

  "pt:ampmPicker:class": `
    flex
    items-center
    flex-col
    gap-1
  `,

  "pt:hour:class": `
    text-sm
    text-slate-800
  `,

  "pt:minute:class": `
    text-sm
    text-slate-800
  `,

  "pt:second:class": `
    text-sm
    text-slate-800
  `,

  "pt:ampm:class": `
    text-sm
    text-slate-800
  `,
};

const datePickerAttrs = computed<Record<string, unknown>>(function () {
  const cleanAttrs: Record<string, unknown> = {
    ...attrs,
  };

  if (cleanAttrs.class === null) {
    delete cleanAttrs.class;
  }

  return {
    ...cleanAttrs,
    ...datePickerPt,
  };
});
</script>
