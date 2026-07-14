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
        <template v-for="control in tab.controls">
          <DataTable v-if="control.type == 'table'" :value="(props.detailValues[tab.value] ?? []) as unknown[]"
            paginator :rows="6" pt:table="min-w-200"
            :pt="style"  
          >
            <Column v-if="tab.value > 0 && tab.value < 50" class="w-24" header="Acciones">
              <template #body="{ data }">
                <div class="flex items-center justify-center gap-2">
                  <Button icon="pi pi-pencil" @click="editDetail(data, tab.maintenanceWindow)" severity="secondary" rounded
                    class="h-8 w-8 items-center justify-center rounded-lg bg-sky-400 text-white shadow transition hover:bg-sky-500! active:scale-95 cursor-pointer">✏️</Button>
                  <Button icon="pi pi-pencil" @click="deleteDetail(data)" severity="secondary" rounded
                    class="h-8 w-8 items-center justify-center rounded-lg bg-red-400 text-white shadow transition hover:bg-red-500! active:scale-95 cursor-pointer">🗑️</Button>
                </div>
              </template>
            </Column>
            <Column v-for="column in control.columns" :key="column.key" :field="column.field ?? column.key"
              :header="column.header" />
          </DataTable>
          <IQSInputTextBase v-if="control.type === 'string'" :placeholder="control.placeholder"
            :readonly="control.state === 'readOnly'" :key="control.name">
          </IQSInputTextBase>
        </template>
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
// Importación de componentes internos de tabs.
import DataTable from "@/volt/DataTable.vue";
import Column from 'primevue/column'
import Button from "@/volt/Button.vue";
// import DataTable from "@/components/DataTable/DataTablePaginator.vue";
// import DataColumn from "@/components/DataTable/DataColumn.vue";
// Importación de componentes internos de inputs.
import IQSInputTextBase from "@/components/inputs/base/IQSInputTextBase.vue";

const props = withDefaults(
  defineProps<{
    mainStyle?: string;
    mainTabs: DetailTab[];
    model?: DynamicModel;
    detailValues: DynamicModel[];
  }>(),
  {
    headerFields: () => [],
    model: () => ({}),
  },
);

const style = {
    root: `relative border border-sky-600 rounded rounded-lg p-flex-scrollable:flex p-flex-scrollable:flex-col p-flex-scrollable:h-full`,
    tableContainer: `p-scrollable:relative p-flex-scrollable:flex p-flex-scrollable:flex-col p-flex-scrollable:flex-1 p-flex-scrollable:h-full`,
    header: `py-3 px-4 border-b border-surface-200 dark:border-surface-700
        bg-surface-0 dark:bg-surface-900
        text-surface-700 dark:text-surface-0 rounded-lg`,
    table: `border-spacing-0 rounded-lg w-full border-separate`,
    thead: `bg-sky-200 border border-sky-600 rounded-lg p-scrollable:bg-sky-200 dark:p-scrollable:bg-sky-200 p-scrollable:top-0 p-scrollable:z-10`,
    tbody: `bg-sky-100 p-hoverable:*:hover:bg-surface-100 p-hoverable:*:hover:text-surface-800 dark:p-hoverable:*:hover:bg-surface-800 dark:p-hoverable:*:hover:text-surface-0
        p-frozen:sticky p-frozen:z-10`,
    bodyRow: `bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-surface-0 p-selectable:cursor-pointer p-selected:bg-highlight!`,
    tfoot: `p-scrollable:bg-surface-0 dark:p-scrollable:bg-surface-900 p-scrollable:bottom-0 p-scrollable:z-10 border-sky-600`,
    footer: `py-3 px-4 dark:border-surface-700 border-sky-600
        bg-surface-0 dark:bg-surface-900
        text-surface-700 dark:text-surface-0`,
    mask: `bg-black/50 text-surface-200 absolute z-10 flex items-center justify-center w-full h-full backdrop-blur-md`,
    column: {
        root: ``,
        headerCell: `group py-3 px-4 font-normal text-start transition-colors duration-200
            border-b border-sky-600 dark:border-surface-700
            bg-surface-0 dark:bg-surface-900
            text-surface-700 dark:text-surface-0
            p-sortable:cursor-pointer p-sortable:select-none p-sortable:focus-visible:outline p-sortable:focus-visible:outline-1 p-sortable:focus-visible:-outline-offset-1 p-sortable:focus-visible:outline-primary
            p-sortable:not-p-sorted:hover:bg-surface-100 p-sortable:not-p-sorted:hover:text-surface-800 
            dark:p-sortable:not-p-sorted:hover:bg-surface-800 dark:p-sortable:not-p-sorted:hover:text-surface-0
            p-sorted:bg-highlight
            p-frozen:sticky p-frozen:bg-surface-0 dark:p-frozen:bg-surface-900 p-frozen:z-10
        `,
        columnHeaderContent: `flex items-center gap-2`,
        columnTitle: `font-semibold`,
        bodyCell: `text-start py-3 px-4 border-b border-sky-600 dark:border-surface-800
            p-frozen:sticky p-frozen:bg-surface-0 dark:p-frozen:bg-surface-900`,
        bodyCellContent: ``,
        footerCell: `text-start py-3 px-4 border-b border-sky-600 dark:border-surface-800
            bg-surface-0 dark:bg-surface-900
            text-surface-700 dark:text-surface-0
            p-frozen:sticky p-frozen:bg-surface-0 dark:p-frozen:bg-surface-900`,
        columnFooter: `font-semibold`,
        columnResizer: `block absolute top-0 end-0 m-0 w-2 h-full p-0 cursor-col-resize border border-transparent`,
        sort: ``,
        sortIcon: `text-surface-500 dark:text-surface-400 transition-colors duration-200
            group-p-sortable:not-group-p-sorted:group-hover:text-surface-600 dark:group-p-sortable:not-group-p-sorted:group-hover:text-surface-300
            group-p-sorted:bg-highlight`,
        pcSortBadge: {
            root: `bg-primary text-primary-contrast rounded-full min-w-6 h-6 inline-flex items-center justify-center text-xs font-bold`
        },
        pcHeaderCheckbox: {
            root: `relative inline-flex select-none w-5 h-5 align-bottom`,
            input: `peer cursor-pointer disabled:cursor-default appearance-none 
                absolute start-0 top-0 w-full h-full m-0 p-0 opacity-0 z-10
                border border-transparent rounded-xs`,
            box: `flex justify-center items-center rounded-sm w-5 h-5
                border border-sky-600 dark:border-surface-700
                bg-surface-0 dark:bg-surface-950
                text-surface-700 dark:text-surface-0
                peer-enabled:peer-hover:border-surface-400 dark:peer-enabled:peer-hover:border-surface-600
                p-checked:border-primary p-checked:bg-primary p-checked:text-primary-contrast
                peer-enabled:peer-hover:p-checked:bg-primary-emphasis peer-enabled:peer-hover:p-checked:border-primary-emphasis
                peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary peer-focus-visible:outline 
                p-disabled:bg-surface-200 dark:p-disabled:bg-surface-400 p-disabled:border-surface-300 dark:p-disabled:border-surface-700 p-disabled:text-surface-700 dark:p-disabled:text-surface-400
                shadow-[0_1px_2px_0_rgba(18,18,23,0.05)] transition-colors duration-200`,
            icon: `text-sm w-[0.875rem] h-[0.875rem] transition-none`
        },
        pcRowRadiobutton: {
            root: `relative inline-flex select-none w-5 h-5`,
            input: `peer cursor-pointer disabled:cursor-default appearance-none absolute start-0 top-0 w-full h-full m-0 p-0 opacity-0 z-10
                border border-transparent rounded-full`,
            box: `flex justify-center items-center rounded-full
                border border-surface-300 dark:border-surface-700
                bg-surface-0 dark:bg-surface-950
                peer-enabled:peer-hover:border-surface-400 dark:peer-enabled:peer-hover:border-surface-600
                p-checked:border-primary p-checked:bg-primary
                peer-enabled:peer-hover:p-checked:bg-primary-emphasis peer-enabled:peer-hover:p-checked:border-primary-emphasis
                peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary peer-focus-visible:outline 
                p-filled:bg-surface-50 dark:p-filled:bg-surface-800
                p-invalid:border-red-400 dark:p-invalid:border-red-300
                p-disabled:bg-surface-200 dark:p-disabled:bg-surface-400 p-disabled:border-surface-300 dark:p-disabled:border-surface-700
                shadow-[0_1px_2px_0_rgba(18,18,23,0.05)] transition-colors duration-200
                w-5 h-5`,
            icon: `bg-transparent text-xs w-3 h-3 rounded-full
                transition-all duration-200 backface-hidden scale-[0.1]
                p-checked:bg-primary-contrast p-checked:visible p-checked:scale-100
                p-disabled:bg-surface-700 dark:p-disabled:bg-surface-400`
        },
        pcRowCheckbox: {
            root: `relative inline-flex select-none w-5 h-5 align-bottom`,
            input: `peer cursor-pointer disabled:cursor-default appearance-none 
                absolute start-0 top-0 w-full h-full m-0 p-0 opacity-0 z-10
                border border-transparent rounded-xs`,
            box: `flex justify-center items-center rounded-sm w-5 h-5
                border border-surface-300 dark:border-surface-700
                bg-surface-0 dark:bg-surface-950
                text-surface-700 dark:text-surface-0
                peer-enabled:peer-hover:border-surface-400 dark:peer-enabled:peer-hover:border-surface-600
                p-checked:border-primary p-checked:bg-primary p-checked:text-primary-contrast
                peer-enabled:peer-hover:p-checked:bg-primary-emphasis peer-enabled:peer-hover:p-checked:border-primary-emphasis
                peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary peer-focus-visible:outline 
                p-disabled:bg-surface-200 dark:p-disabled:bg-surface-400 p-disabled:border-surface-300 dark:p-disabled:border-surface-700 p-disabled:text-surface-700 dark:p-disabled:text-surface-400
                shadow-[0_1px_2px_0_rgba(18,18,23,0.05)] transition-colors duration-200`,
            icon: `text-sm w-[0.875rem] h-[0.875rem] transition-none`
        },
        rowToggleButton: `inline-flex items-center justify-center overflow-hidden relative w-7 h-7 cursor-pointer select-none
            transition-colors duration-200 rounded-full border-none bg-transparent
            text-surface-500 enabled:hover:bg-surface-100 enabled:hover:text-surface-700
            dark:text-surface-400 dark:enabled:hover:bg-surface-800 dark:enabled:hover:text-surface-0
            focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary
            p-selected:hover:bg-surface-0 dark:p-selected:hover:bg-surface-900 p-selected:hover:text-primary`,
        rowToggleIcon: ``,
        reorderableRowHandle: ``
    },
    loadingIcon: ``,
    pcPaginator: {
        paginatorContainer: `p-bottom:border-b border-transparent dark:border-surface-700`,
        root: `flex items-center justify-center flex-wrap py-2 px-4 rounded-md gap-1
            bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-surface-0`
    },
    columnResizeIndicator: `w-px absolute z-10 hidden bg-primary`,
    rowReorderIndicatorUp: `absolute hidden`,
    rowReorderIndicatorDown: `absolute hidden`
}

// function editDetail(row: DynamicModel) {
//   alert("Editando...")
//   console.log("Editar: ", row);
// }

function editDetail(row: DynamicModel, windowName: string) {
    emit(
        "open-detail",
        windowName,
        // "customers",
        Number(row.add_id)
    );

}

function deleteDetail(row: DynamicModel) {
  alert("Borrando...")
  console.log("Borrar: ", row);
}

const emit = defineEmits<{
  (e: "open-detail", window: string, id: number | string): void;
}>();

// const dataExample = [
//   {}
// ]

// console.log("props.mainTabs", props.mainTabs);
// console.log("props.detailData", props.detailValues[0]);

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
