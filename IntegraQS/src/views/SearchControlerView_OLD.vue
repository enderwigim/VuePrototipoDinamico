<template>
  <SearchControler :modelValue="model" @update:modelValue="model = $event" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import SearchControler from "@/components/search/SearchController.vue";
import type { DynamicModel } from "@/types/types";

const model = ref<DynamicModel | null>({
  id: "3",
  description: "RESIDÈNCIA SANT BERNAT",
});
</script>
