<template>
  <Column
    v-bind="props.columnPrimeVueConfig"
    :field="props.field"
    :header="props.header"
    :headerClass="props.headerClass"
    :bodyClass="props.bodyClass"
  >
    <template #body="{ data }">
      {{ getCellValue(data) }}
    </template>

    <template
      v-if="props.columnConfig.editable"
      #editor="{ data }"
    >
      <InputText
        v-model="data[props.field]"
        autofocus
        fluid
      />
    </template>
  </Column>
</template>

<script setup lang="ts">
import Column from 'primevue/column'
import type { ColumnProps } from 'primevue/column'

import InputText from '@/volt/InputText.vue'

type RowData = Record<string, any>

type ColumnPrimeVueProps = Partial<Omit<
  ColumnProps,
  'field' | 'header' | 'headerClass' | 'bodyClass'
>>

interface CustomColumnConfig {
  editable?: boolean
  emptyValue?: string
  getValue?: (data: RowData) => unknown
}

const props = withDefaults(defineProps<{
  field: string
  header: string
  headerClass?: string
  bodyClass?: string
  columnPrimeVueConfig?: ColumnPrimeVueProps
  columnConfig?: CustomColumnConfig
}>(), {
  field: '',
  header: '',
  headerClass: 'w-[140px] text-center',
  bodyClass: 'w-[140px] text-center',
  columnPrimeVueConfig: () => ({}),
  columnConfig: () => ({})
})

function getCellValue(data: RowData) {
  if (props.columnConfig.getValue) {
    return props.columnConfig.getValue(data)
  }

  return data[props.field] ?? props.columnConfig.emptyValue ?? '—'
}
</script>