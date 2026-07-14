<template>
  <div
    class="flex items-center justify-end gap-2 w-full"
  >
    <!-- MODO LECTURA -->
    <button
      v-if="windowStore.winState === 'read'"
      type="button"
      title="Inicio"
      id="button-first"
      :disabled="props.disableFirst"
      class="flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors duration-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-0 cursor-pointer"
      @click="emit('goToFirst')"
    >
      «
    </button>

    <button
      v-if="windowStore.winState === 'read'"
      type="button"
      title="Anterior"
      id="button-prev"
      :disabled="props.disablePrev"
      class="flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors duration-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-0 cursor-pointer"
      @click="emit('goToPrevious')"
    >
      ‹
    </button>

    <button
      v-if="windowStore.winState === 'read'"
      type="button"
      title="Siguiente"
      id="button-next"
      class="flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors duration-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-0 cursor-pointer"
      @click="emit('goToNext')"
    >
      ›
    </button>

    <button
      v-if="windowStore.winState === 'read'"
      type="button"
      title="Último"
      id="button-last"
      class="flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors duration-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-0 cursor-pointer"
      @click="emit('goToLast')"
    >
      »
    </button>

    <div v-if="windowStore.winState === 'read'" class="mx-2 h-6 w-px bg-slate-200"></div>

    <button
      v-if="windowStore.winState === 'read'"
      type="button"
      class="flex items-center justify-center gap-2 h-10 rounded-lg border border-blue-600 bg-blue-600 text-white px-4 text-sm font-medium shadow-sm transition-colors duration-200 hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-0 cursor-pointer"
      @click="emit('createNew')"
    >
      <span class="text-base leading-none">+</span>
      <span>Nuevo</span>
    </button>

    <button
      v-if="windowStore.winState === 'read'"
      type="button"
      class="flex items-center justify-center gap-2 h-10 rounded-lg border border-red-200 bg-white text-red-600 px-4 text-sm font-medium shadow-sm transition-colors duration-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-0 cursor-pointer"
      @click="emit('deleteCurrent')"
    >
      <span class="text-base leading-none">×</span>
      <span>Borrar</span>
    </button>

    <!-- MODO CREACIÓN / MODIFICACIÓN -->
    <button
      v-if="windowStore.winState !== 'read'"
      type="button"
      class="flex items-center justify-center gap-2 h-10 rounded-lg border border-blue-600 bg-blue-600 text-white px-4 text-sm font-medium shadow-sm transition-colors duration-200 hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-0 cursor-pointer"
      @click="emit('acceptChanges')"
    >
      <span class="text-base leading-none">✓</span>
      <span>Aceptar cambios</span>
    </button>

    <button
      v-if="windowStore.winState !== 'read'"
      type="button"
      class="flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-300 bg-white text-slate-700 px-4 text-sm font-medium shadow-sm transition-colors duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-0 cursor-pointer"
      @click="emit('cancelChanges')"
    >
      <span class="text-base leading-none">×</span>
      <span>Cancelar</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useWindowStore } from "@/stores/windowStore";

const windowStore = useWindowStore();
const emit = defineEmits([
  "goToFirst",
  "goToPrevious",
  "goToNext",
  "goToLast",
  "createNew",
  "deleteCurrent",
  "acceptChanges",
  "cancelChanges",
]);

const props = defineProps({
    disableFirst: {
        type: Boolean,
        default: false,
    },
    disablePrev: {
        type: Boolean,
        default: false,
    },
});
</script>
