<template>
  <!-- Las solapas funcionan de la siguiente manera:
  - Tabs: Componente contenedor de las solapas. Recibe un prop "value" que indica la solapa activa. (lA POR DEFECTO, LA PRIMERA SOLAPA
  - TabList: Componente contenedor de los botones de las solapas. Debe ir dentro de Tabs.
  - Tab: Componente que representa un botón de solapa. Debe ir dentro de TabList.
  - TabPanels: Componente contenedor de los paneles de contenido de las solapas.
  - TabPanel: Componente que representa un panel de contenido de una solapa.
  
  -->
  <Tabs :value="props.mainTabs[0]?.value ?? '0'">
    <TabList>
      <Tab v-for="tab in props.mainTabs" :key="tab.title" :value="tab.value">
        {{ tab.title }}
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel v-for="tab in props.mainTabs" :key="tab.title" :value="tab.value">
        <p>hola</p>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup lang="ts">
// Importación de tipos
import type { DetailTab, DynamicModel } from "@/types/types";
import Tabs from "@/components/Tabs/IQSTabsBase.vue";
import TabList from "@/components/Tabs/IQSTabListBase.vue";
import Tab from "@/components/Tabs/IQSTabBase.vue";
import TabPanels from "@/components/Tabs/IQSTabPanelsBase.vue";
import TabPanel from "@/components/Tabs/IQSTabPanelBase.vue";

const props = withDefaults(
  defineProps<{
    mainStyle?: string;
    mainTabs: DetailTab[];
    model?: DynamicModel;
  }>(),
  {
    headerFields: () => [],
    model: () => ({}),
  },
);

// import DataTable from "@/components/DataTable/DataTablePaginator.vue";
// import DataColumn from "@/components/DataTable/DataColumn.vue";
// const customersTableProps = {
//   removableSort: true,
//   sortMode: "multiple",
//   dataKey: "id",
//   editMode: "cell",
//   tableStyle: "min-width: 900px; width: 100%; table-layout: fixed",
// };

// const customerColumns = [
//   {
//     key: "referencia",
//     field: "referencia",
//     header: "Referencia",
//     headerClass: "w-[140px] text-center",
//     bodyClass: "w-[140px] text-center",
//     columnPrimeVueConfig: {
//       sortable: true,
//     },
//     columnConfig: {
//       editable: true,
//     },
//   },
//   {
//     key: "nombre",
//     field: "nombre",
//     header: "Nombre",
//     headerClass: "w-[260px]",
//     bodyClass: "w-[260px]",
//     columnPrimeVueConfig: {
//       sortable: true,
//     },
//     columnConfig: {
//       editable: true,
//     },
//   },
//   {
//     key: "referenciaComercial",
//     field: "referenciaComercial",
//     header: "Ref. comercial",
//     headerClass: "w-[180px] text-center",
//     bodyClass: "w-[180px] text-center",
//     columnPrimeVueConfig: {
//       sortable: true,
//     },
//     columnConfig: {
//       editable: true,
//     },
//   },
// ];
</script>
