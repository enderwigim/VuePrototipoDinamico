<template>
  <SearchControler :modelValue="model" :options="options" @update:modelValue="model = $event" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import SearchControler from "@/components/search/SearchController.vue";
import type { DynamicModel } from "@/types/types";

const options: DynamicModel[] = [
  {
    id: "CLI-001",
    description: "Supermercados Levante S.A.",
    selected: false,
  },
  {
    id: "CLI-002",
    description: "Distribuciones Mediterráneo S.L.",
    selected: true,
  },
  {
    id: "CLI-003",
    description: "Restaurante El Paseo",
    selected: false,
  },
  {
    id: "CLI-004",
    description: "Transportes Alicante S.A.",
    selected: false,
  },
  {
    id: "CLI-005",
    description: "Tecnología y Sistemas del Sur",
    selected: false,
  },
  {
    id: "CLI-006",
    description: "Tecnología y Sistemas del Sur",
    selected: false,
  },
  {
    id: "CLI-007",
    description: "Tecnología y Sistemas del Sur",
    selected: false,
  },
  {
    id: "CLI-008",
    description: "Tecnología y Sistemas del Sur",
    selected: false,
  },
  {
    id: "CLI-009",
    description: "Tecnología y Sistemas del Sur",
    selected: false,
  },
];

const model = ref<DynamicModel | null>({
  id: "3",
  description: "Iberarchivos S.L.",
});

function onChange(newModel: DynamicModel) {
  console.log("Model updated:", newModel);
}
</script>
