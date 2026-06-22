<template>
  <p>{{ loaded }}</p>
  <main v-if="loaded" class="flex flex-col h-full gap-6">
    <header class="p-5 bg-white border-b border-gray-200">
      <div class="flex items-start justify-between">
        <h1 class="text-2xl font-bold">Clientes</h1>
        <button class="px-4 py-2 text-white bg-blue-500 rounded">Guardar</button>
      </div>
      <IQSHeader :header-fields="winFormat.Header" v-model:model="customer"></IQSHeader>
    </header>
    <section class="grid flex-1 grid-cols-[1fr_320px] gap-6">
      <div class="p-6 bg-white border rounded-xl">Aquí irán los tabs (Details)</div>
      <aside class="p-6 bg-white border rounded-xl">Aquí irán el lateral</aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import IQSHeader from "@/components/IQSHeader.vue";

import {
  getCustomer,
  getCustomerFormat,
  getNewCustomer,
  // saveCustomer,
  // saveNewCustomer,
} from "@/services/customer.service";
type DynamicModel = Record<string, string | number | boolean | null>;
const route = useRoute();
const loaded = ref(false);
const winFormat = ref({
  Header: [],
  Footer: [],
  Details: [],
  Lateral: [],
});
const customer = ref<DynamicModel>({});

type StateWin = "creation" | "modify" | null;
const stateWin = ref<StateWin>(null);

async function loadData() {
  const id = route.params.id;
  const format = await getCustomerFormat();

  winFormat.value = format;

  if (id && id !== "new") {
    customer.value = await getCustomer(Number(id));
    stateWin.value = "modify";
  } else {
    customer.value = await getNewCustomer();
    stateWin.value = "creation";
  }
  loaded.value = true;
}

// async function onSave() {
//   const formData = new FormData();

//   Object.entries(customer).forEach(([key, value]) => {
//     if (value !== null && value !== undefined) {
//       formData.append(key, value);
//     }
//   });

//   if (stateWin.value == "creation") await saveNewCustomer(formData);
//   else {
//     const response = await saveCustomer(formData, customer.cus_id);
//   }

//   stateWin.value = "modify";
//   alert("Cliente guardado");
// }

// async function save() {

//     const id =
//         route.params.id

//     await saveCustomer(
//         formData,
//         id
//     )

//     alert('Guardado')
// }

onMounted(loadData);
</script>
