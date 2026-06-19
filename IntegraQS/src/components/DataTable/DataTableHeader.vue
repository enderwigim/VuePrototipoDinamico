<template>
    <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 class="m-0 text-xl font-bold text-[var(--integra-title)]">
            {{ title }}
            </h1>
            <p v-if="subtitle" class="m-0 mt-1 text-sm text-[var(--integra-muted)]">
            {{ subtitle}}
            </p>
        </div>

        <Button
          icon="pi pi-refresh"
          rounded
          raised
          aria-label="Actualizar clientes"
          @click="$emit('reload')"
        > 
            <RefreshIcon />
        </Button>
      </div>
</template>

<script setup lang="ts">
import RefreshIcon from '@primevue/icons/refresh'
import Button from '@/volt/Button.vue'

const props = defineProps({
    title: String,
    subtitle: String
})

</script>