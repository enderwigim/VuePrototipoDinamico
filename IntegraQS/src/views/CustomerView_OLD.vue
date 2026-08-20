<!-- <template>
  <IQSToolsRead
    @goToNext="goToNext"
    @goToPrevious="goToPrevious"
    @cancelChanges="CancelChanges"
    @accept-changes="onSave"
    @goToFirst="goToFirst"
    @goToLast="goToLast"
    @createNew="onCreateNew"
    @deleteCurrent="onDeleteCurrent"
  />
  <main v-if="loaded" class="flex flex-col h-full gap-6">
    <header class="p-5 bg-white border-b border-gray-200">


      <IQSHeader
        :header-style="headerStyle"
        :header-fields="winFormat.Header.fields"
        :model="customer"
        @update:model="onCustomerChange"
      ></IQSHeader>
    </header>
    <section class="grid flex-1 grid-cols-[1fr_320px] gap-6">
      <div class="p-6 bg-white border rounded-xl">
        <IQSMain :model="customer" :main-tabs="winFormat.Details" :detail-values="[]"></IQSMain>
      </div>
      <aside class="p-6 bg-white border rounded-xl">Aquí irán el lateral</aside>
    </section>
  </main>
</template> -->

<!-- <script setup lang="ts">
import IQSMain from "@/components/IQSMain.vue";

// 2026-06-30. Santi. Hasta aquí todo funciona correctamente. Voy a empezar a trabajar en la información recogida por una tabla. Por lo que debo incorporar datos
// de prueba para comprobar que funciona correctamente.

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import IQSHeader from "@/components/IQSHeader.vue";
import IQSToolsRead from "@/components/Tools/IQSTools.vue";
import { useWindowStore } from "@/stores/windowStore";
import type { WinFormat } from "@/types/types";

import {
  getCustomer,
  getCustomerFormat,
  getNewCustomer,
  getNextCustomer,
  getPreviousCustomer,
  getFirstCustomer,
  getLastCustomer,
  saveCustomer,
  deleteCustomer,
  saveNewCustomer,
} from "@/services/customer.service";
import { buildContainerClasses } from "@/utils/containerBuilder";
type DynamicModel = Record<string, string | number | boolean | null>;
const route = useRoute();
const router = useRouter();

const loaded = ref(false);
const winFormat = ref<WinFormat>({
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
// type StateWin = "creation" | "modify" | "read";
// const stateWin = ref<StateWin>("read");
const windowStore = useWindowStore();
async function loadData() {
  const id = route.params.id;
  const format = await getCustomerFormat();

  winFormat.value = format;
  headerStyle.value = buildContainerClasses(format.Header.style);
  console.log("Header style after build:", headerStyle.value);
  if (id && id !== "new") {
    customer.value = await getCustomer(Number(id));
    windowStore.setRead();
    // stateWin.value = "read";
  } else {
    customer.value = await getNewCustomer();
    windowStore.setCreation();
    // stateWin.value = "creation";
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

  if (windowStore.winState == "creation") {
    const response = await saveNewCustomer(formData);
    if (response.success) {
      const redirect = response.redirect;
      windowStore.setRead();
      await router.push(redirect);
      loadData();
    }
  } else {
    console.log("Saving customer with ID:", customerId);
    const response = await saveCustomer(formData, customerId);
    console.log("Response from saveCustomer:", response);
    // 2026-06-26. Santi. Esta comprobación no está devolviendo nada desde el backend. De momento lo pondré como valido
    // Y así compruebo que el estado funciona.
    //if (response.details === 204) {
    windowStore.setRead();
    //}
  }

  // stateWin.value = "modify";
  // alert("Cliente guardado");
}

function onCustomerChange(newModel: DynamicModel) {
  if (windowStore.winState !== "modify" && windowStore.winState !== "creation") {
    const newId = newModel["cus_id"];
    if (newId) {
      windowStore.setModify();
      // Update the route to reflect the new customer ID
      // window.history.replaceState(null, "", `/customer/${newId}`);
    }
  }
  customer.value = newModel;
}

async function goToNext() {
  const id = route.params.id;
  const newID = await getNextCustomer(Number(id));
  await router.push(`/customers/${newID}`);
  loadData();
}

async function goToPrevious() {
  const id = route.params.id;
  const newID = await getPreviousCustomer(Number(id));
  await router.push(`/customers/${newID}`);
  loadData();
}

async function goToFirst() {
  const id = await getFirstCustomer();
  await router.push(`/customers/${id}`);
  loadData();
}

async function goToLast() {
  const id = await getLastCustomer();
  await router.push(`/customers/${id}`);
  loadData();
}

async function onCreateNew() {
  await router.push(`/customers/new`);
  loadData();
}

async function onDeleteCurrent() {
  if (confirm("¿Desea borrar este cliente?") == true) {
    const id = route.params.id;
    await deleteCustomer(Number(id));
    goToPrevious();
  }
}

function CancelChanges() {
  const id = route.params.id;

  if (id && id !== "new") {
    loadData();
  } else {
    goToFirst();
  }
}

onMounted(loadData);
</script> -->
