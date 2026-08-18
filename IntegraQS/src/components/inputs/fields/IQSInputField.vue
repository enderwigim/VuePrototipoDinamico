// Este componente funciona como contenedor para los campos de entrada de datos. De esta manera,
podemos trabajar los componentes de Volt, // provenientes de sus Wrappers ya creados, sin
preocupaciones. // De momento, este componente agrega un label y un texto de ayuda.
<template>
  <div
    class="flex flex-col gap-1.5 w-full min-w-0"
    :style="{ gridColumn: `span ${size} / span ${size}` }"
  >
    <label v-if="label" :for="inputIdFinal" class="text-sm font-medium text-slate-700">
      {{ label }}

      <span v-if="required" class="text-red-500">*</span>
    </label>

    <slot :id="inputIdFinal" :describedBy="describedBy" />

    <small v-if="helpText" :id="helpId" class="text-xs text-slate-500">
      {{ helpText }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label?: string;
  inputId?: string;
  required?: boolean;
  helpText?: string;
  size?: number;
}

const props = defineProps<Props>();
// En caso de que el usuario no haya proporcionado un ID para el input, generamos uno aleatorio para asegurarnos de que el label esté correctamente asociado al input.
const generatedId = "iqs-input-" + Math.random().toString(36).substring(2, 10);
// Computamos el ID final.
const inputIdFinal = computed(function () {
  if (props.inputId) {
    return props.inputId;
  }

  return generatedId;
});

// Computamos el ID del elemento de ayuda, que se usará en el atributo aria-describedby del input para mejorar la accesibilidad.
const helpId = computed(function () {
  return inputIdFinal.value + "-help";
});
// Computamos el valor del atributo aria-describedby, que solo se incluirá si hay texto de ayuda disponible.
const describedBy = computed(function () {
  if (props.helpText) {
    return helpId.value;
  }

  return undefined;
});
</script>
