<template>
  <!-- Aquí la imagen únicamente se encargará de ocupar todo el espacio que su padre ha asignado para ella. -->
  <div class="h-full w-full overflow-hidden">
    <!-- <div class="h-full -full min-h-0 min-w-0"> -->
    <img
      v-if="props.src"
      :src="props.src"
      :alt="props.alt"
      @click="handleClick"
      @load="handleLoad"
      @error="handleError"
      class="h-full w-full object-contain"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center border border-slate-200 bg-slate-50 text-sm text-slate-400"
    >
      Sin imagen
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string;
  alt?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

const props = withDefaults(defineProps<Props>(), {
  src: "/Logo_Integra.jpg",
  alt: "",
  objectFit: "contain",
});

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
