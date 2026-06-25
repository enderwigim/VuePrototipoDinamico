<template>
  <p>{{ loaded }}</p>
  <main v-if="loaded" class="flex flex-col h-full gap-6">
    <header class="p-5 bg-white border-b border-gray-200">
      <div class="flex items-start justify-between">
        <h1 class="text-2xl font-bold">Clientes</h1>
        <button
          :class="
            canSave
              ? 'px-4 py-2 text-white bg-blue-500 rounded'
              : 'px-4 py-2 text-gray-400 bg-gray-200 rounded cursor-not-allowed'
          "
          :disabled="!canSave"
          @click="onSave"
        >
          Guardar
        </button>
      </div>
      <IQSHeader
        :header-style="headerStyle"
        :header-fields="winFormat.Header.fields"
        :model="customer"
        @update:model="onCustomerChange"
      ></IQSHeader>
    </header>
    <section class="grid flex-1 grid-cols-[1fr_320px] gap-6">
      <div class="p-6 bg-white border rounded-xl">Aquí irán los tabs (Details)</div>
      <aside class="p-6 bg-white border rounded-xl">Aquí irán el lateral</aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

import IQSHeader from "@/components/IQSHeader.vue";

import {
  getCustomer,
  getCustomerFormat,
  getNewCustomer,
  saveCustomer,
  saveNewCustomer,
} from "@/services/customer.service";
import { buildContainerClasses } from "@/utils/containerBuilder";
type DynamicModel = Record<string, string | number | boolean | null>;
const route = useRoute();
const loaded = ref(false);
const winFormat = ref({
  Header: {
    style: {},
    fields: [],
  },
  Footer: [],
  Details: [],
  Lateral: [],
});
const customer = ref<DynamicModel>({});

const headerStyle = ref<string>("");
type StateWin = "creation" | "modify" | "read";
const stateWin = ref<StateWin>("read");

async function loadData() {
  const id = route.params.id;
  const format = await getCustomerFormat();

  winFormat.value = format;
  headerStyle.value = buildContainerClasses(format.Header.style);
  console.log("Header style after build:", headerStyle.value);
  if (id && id !== "new") {
    customer.value = await getCustomer(Number(id));
    stateWin.value = "read";
  } else {
    customer.value = await getNewCustomer();
    stateWin.value = "creation";
  }
  loaded.value = true;
}

async function onSave() {
  const formData = new FormData();
  const customerId = Number(customer.value["cus_id"]);
  Object.entries(customer.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (stateWin.value == "creation") await saveNewCustomer(formData);
  else {
    console.log("Saving customer with ID:", customerId);
    const response = await saveCustomer(formData, customerId);
  }

  // stateWin.value = "modify";
  alert("Cliente guardado");
}

function onCustomerChange(newModel: DynamicModel) {
  if (stateWin.value !== "modify" && stateWin.value !== "creation") {
    const newId = newModel["cus_id"];
    if (newId) {
      stateWin.value = "modify";
      // Update the route to reflect the new customer ID
      // window.history.replaceState(null, "", `/customer/${newId}`);
    }
  }
  customer.value = newModel;
}

const canSave = computed(() => {
  return stateWin.value === "modify" || stateWin.value === "creation";
});
// async function save() {
//   const id = route.params.id;

//   await saveCustomer(formData, id);

//   alert("Guardado");
// }

onMounted(loadData);
</script>
