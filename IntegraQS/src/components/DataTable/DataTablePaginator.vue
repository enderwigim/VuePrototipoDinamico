<template>
  <section
    class="w-full overflow-hidden rounded-2xl border border-[var(--integra-border)] bg-[var(--integra-card)] shadow-sm"
  >
    <header v-if="$slots.header" class="border-b border-[var(--integra-border)] px-6 py-5">
      <slot name="header" />
    </header>

    <div class="overflow-x-auto">
      <!-- v-bind="attrs" Esto hará que todos los attrs que tenga el padre, vendrán al hijo. Es util para setear cosas allí. -->
      <DataTable :value="paginatedData" v-bind="dataTableBindings">
        <slot />
      </DataTable>
    </div>

    <footer class="flex justify-center border-t border-[var(--integra-border)] px-6 py-4">
      <Paginator
        :first="first"
        :rows="rows"
        :totalRecords="data.length"
        template="PrevPageLink PageLinks NextPageLink"
        @page="onPageChange"
      />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import DataTable from "@/volt/DataTable.vue";
import Paginator from "@/volt/Paginator.vue";
import type { DataTableProps } from "primevue";

type DataTableConfig = Partial<Omit<DataTableProps, "value">>;

const props = withDefaults(
  defineProps<{
    //   Los datos no se como vienen. Pero vienen vacíos.
    data: unknown[];
    rows?: number;
    dataTableProps?: DataTableConfig;
  }>(),
  {
    rows: 5,
    dataTableProps: () => ({}),
  },
);

const dataTableBindings = computed(() => {
  return {
    ...props.dataTableProps,
  };
});

const first = ref(0);
const rows = ref(props.rows);

const paginatedData = computed(() => props.data.slice(first.value, first.value + rows.value));

function onPageChange(event: { first: number; rows: number }) {
  first.value = event.first;
  rows.value = event.rows;
}
</script>

<style scoped></style>
