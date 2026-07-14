<template>
  <VoltSelect v-bind="selectAttrs" filter>
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </VoltSelect>
</template>

<script setup lang="ts">
import { computed, useAttrs, ref, watch, onMounted } from "vue";
import VoltSelect from "@/volt/Select.vue";

defineOptions({
  inheritAttrs: false,
});

const inputSelectPt = {
  "pt:root:class": `
    w-full
    h-10

    flex
    items-center

    rounded-lg
    border
    border-slate-300

    bg-white
    text-slate-800

    shadow-sm

    transition-colors
    duration-200

    hover:border-blue-400

    p-focus:border-blue-600
    p-focus:ring-2
    p-focus:ring-blue-100

    p-filled:bg-white

    p-invalid:border-red-500
    p-invalid:ring-1
    p-invalid:ring-red-100

    p-disabled:bg-slate-100
    p-disabled:border-slate-200
    p-disabled:text-slate-400
    p-disabled:cursor-not-allowed
    p-disabled:shadow-none
  `,

  "pt:label:class": `
    flex
    items-center

    w-full
    h-full

    px-3
    py-2

    text-sm
    font-normal
    text-slate-800

    truncate

    p-placeholder:text-slate-400
    p-disabled:text-slate-400
  `,

  "pt:dropdown:class": `
    flex
    items-center
    justify-center

    w-10
    h-full

    text-slate-500

    transition-colors
    duration-200

    p-disabled:text-slate-400
  `,

  "pt:overlay:class": `
    mt-1

    rounded-lg
    border
    border-slate-200

    bg-white

    shadow-xl
    shadow-slate-200/60

    overflow-hidden
  `,

  "pt:listContainer:class": `
    max-h-72
    overflow-y-auto
    overflow-x-hidden
  `,

  "pt:list:class": `
    p-1
  `,

  "pt:option:class": `
    flex
    items-center

    rounded-md

    px-3
    py-2

    text-sm
    text-slate-700

    cursor-pointer

    transition-colors
    duration-150

    p-focus:bg-blue-50
    p-focus:text-blue-700

    p-selected:bg-blue-100
    p-selected:text-blue-700
    p-selected:font-medium

    p-disabled:text-slate-400
    p-disabled:cursor-not-allowed
  `,

  "pt:emptyMessage:class": `
    px-3
    py-2

    text-sm
    text-slate-400
  `,
};

export interface SelectOption {
  title: string;
  value: string | number;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    options?: SelectOption[];
    parentField?: string | null;
  }>(),
  {
    options: () => [],
  },
);

const attrs = useAttrs();
const internalOptions = ref<SelectOption[]>(props.options);
const loading = ref(false);

async function loadOptionsByField(parentField: string): Promise<SelectOption[]> {
  // Si no hay campo vinculado, no se pueden cargar opciones.
  if (!parentField) {
    return [];
  }
  return [
    {
      title: "Física",
      value: "1",
      disabled: false,
    },
    {
      title: "Jurídica",
      value: "2",
      disabled: false,
    },
  ];
}

async function loadSelectOptions() {
  // Si no es vinculado, cargamos las opciones que nos pasa su padre.
  if (!props.parentField) {
    internalOptions.value = props.options;
    return;
  }

  loading.value = true;

  // Cargamos las opciones según el campo padre.
  try {
    // Llamamos a la función dínamica para cargar las opciones.
    const loadedOptions = await loadOptionsByField(props.parentField ?? "");
    internalOptions.value = loadedOptions ?? [];
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.options,
  function (newOptions) {
    // Si no es vinculado, cargamos las opciones que nos pasa su padre.
    if (!props.parentField) {
      internalOptions.value = newOptions;
    }
  },
);

onMounted(function () {
  if (props.parentField) {
    loadSelectOptions();
  }
});

defineExpose({
  reload: loadSelectOptions,
});

const selectAttrs = computed<Record<string, unknown>>(function () {
  const cleanAttrs: Record<string, unknown> = {
    ...attrs,
  };

  if (cleanAttrs.class === null) {
    delete cleanAttrs.class;
  }

  return {
    ...cleanAttrs,

    options: internalOptions.value,
    loading: loading.value,

    ...inputSelectPt,
  };
});
</script>
