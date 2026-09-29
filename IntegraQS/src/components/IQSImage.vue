<template>
  <div class="w-full">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      :style="{
        width,
        height,
        objectFit,
      }"
      class="block max-w-full rounded-lg"
      @click="handleClick"
      @load="handleLoad"
      @error="handleError"
    />

    <div
      v-else
      class="flex h-32 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-400"
    >
      Sin imagen
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    width?: string;
    height?: string;
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  }>(),
  {
    src: "",
    alt: "",
    width: "100%",
    height: "auto",
    objectFit: "contain",
  },
);

const emit = defineEmits<{
  click: [];
  load: [];
  error: [];
}>();

function handleClick(): void {
  emit("click");
}

function handleLoad(): void {
  emit("load");
}

function handleError(): void {
  emit("error");
}
</script>
