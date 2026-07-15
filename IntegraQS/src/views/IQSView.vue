<template>
  <div v-if="loaded" class="flex flex-col justify-between">
    <header
      class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex justify-between"
    >
      <a href="http://localhost:5173/login">
        <img src="/Logo_Integra.jpg" alt="Logo Integra" class="h-20 w-auto object-contain" />
      </a>
      <IQSToolsRead
        v-if="winFormat.Header.type != 5 && props.modal == false"
        :disable-first="disableFirst"
        :disable-prev="disablePrev"
        @goToNext="goToNext"
        @goToPrevious="goToPrevious"
        @cancelChanges="CancelChanges"
        @accept-changes="onSave"
        @goToFirst="goToFirst"
        @goToLast="goToLast"
        @createNew="onCreateNew"
        @deleteCurrent="onDeleteCurrent"
      />
      <Button
        v-if="props.modal"
        icon="pi pi-pencil"
        @click="close"
        severity="secondary"
        rounded
        class="h-8 w-8 items-center justify-center rounded-lg bg-red-400 text-white shadow transition hover:bg-red-500! active:scale-95 cursor-pointer"
        >X</Button
      >
    </header>
    <main class="flex flex-col h-full">
      <section id="header-section">
        <IQSHeader
          :header-style="headerStyle"
          :header-fields="winFormat.Header.fields"
          :model="headerModel"
          @update:model="onChange"
        ></IQSHeader>
      </section>
      <section class="grid flex-1 grid-cols-[1fr_320px] gap-6">
        <div v-if="winFormat.Details.length > 0" class="p-6 bg-white border rounded-xl">
          <IQSMain
            :model="headerModel"
            :main-tabs="winFormat.Details"
            :detail-values="detailsModel"
            @open-detail="openDetailWindow"
          >
          </IQSMain>
        </div>
        <aside v-if="winFormat.Lateral.length > 0" class="p-6 bg-white border rounded-xl">
          Aquí irán el lateral
        </aside>
      </section>
    </main>
  </div>
  <Teleport to="body">
    <div v-if="loadModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-xl w-[90vw] h-[90vh] overflow-auto">
        <IQSView modal :windowName="modalWindow" :id="modalId" @close="loadModal = false" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import IQSHeader from "@/components/IQSHeader.vue";
import IQSMain from "@/components/IQSMain.vue";
import IQSToolsRead from "@/components/Tools/IQSTools.vue";
import { useWindowStore } from "@/stores/windowStore";
import Button from "@/volt/Button.vue";

import {
  getInfoWindow,
  getInfoHeader,
  getDefaultInfoHeader,
  getNextHeaderID,
  getInfoDetails,
  getPrevHeaderID,
  getFirstHeaderID,
  getLastHeaderID,
  deleteRegister,
  saveNewHeader,
  saveHeader,
} from "@/services/iqs.service";
import { computed } from "vue";
import { buildContainerClasses } from "@/utils/containerBuilder";
import type { DetailTab, DynamicModel } from "@/types/types";
// type DynamicModel = Record<string, string | number | boolean | null>;

const route = useRoute();
const router = useRouter();

// Botonera
const disableFirst = ref(false);
const disablePrev = ref(false);
const disableNext = ref(false);
const disableLast = ref(false);
const windowNameModal = ref("");

const currentWindow = computed(() => {
  return props.modal ? String(props.windowName) : String(route.params.windowName);
});

const currentId = computed(() => {
  return props.modal ? props.id : route.params.id;
});

const loaded = ref(false);
const loadModal = ref(false);
const modalWindow = ref("");
const modalId = ref<number | string>();
const winFormat = ref({
  Header: {
    style: {},
    fields: [],
    primaryKey: "",
    type: 0,
  },
  Footer: [],
  Details: [] as DetailTab[],
  Lateral: [],
});
const headerModel = ref<DynamicModel>({});
const detailsModel = ref<DynamicModel[]>([]);

const headerStyle = ref<string>("");
// type StateWin = "creation" | "modify" | "read";
// const stateWin = ref<StateWin>("read");
const windowStore = useWindowStore();
const props = withDefaults(
  defineProps<{
    modal?: boolean;
    windowName?: string;
    id?: number | string;
  }>(),
  {
    modal: false,
    windowName: "",
    id: undefined,
  },
);
defineOptions({
  name: "IQSView",
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

async function loadWindow() {
  const windowData = await getInfoWindow(currentWindow.value);

  winFormat.value = windowData;

  await loadData();
}

async function loadData() {
  const windowName = currentWindow.value;
  const id = currentId.value;

  if (id === "new") {
    // 2. Datos default de cabecera
    const headerData = await getDefaultInfoHeader(windowName, winFormat.value);
    //3. Datos de detalles
    const detailsData: DynamicModel[] = [];

    headerStyle.value = buildContainerClasses(winFormat.value.Header.style);
    headerModel.value = headerData[0] ?? {};
    detailsModel.value = detailsData;
    windowStore.setCreation();
  } else {
    // 2. Datos de cabecera
    const headerData = await getInfoHeader(windowName, winFormat.value, id);

    //3. Datos de detalles
    const detailsData = [];
    if (winFormat.value.Details.length > 0) {
      for (const detail of winFormat.value.Details) {
        const detailData = await getInfoDetails(
          windowName,
          Number(detail.value),
          headerData[0][winFormat.value.Header.primaryKey],
          winFormat.value,
        );
        const detailModel = {
          [Number(detail.value)]: detailData,
        };
        detailsData[Number(detail.value)] = detailData;
      }
    }

    headerStyle.value = buildContainerClasses(winFormat.value.Header.style);
    headerModel.value = headerData[0] ?? {};
    detailsModel.value = detailsData;
  }

  loaded.value = true;
}

async function onSave() {
  const formData = new FormData();
  const headerId = Object.entries(headerModel.value).find(([key]) => key.endsWith("_id"))?.[1];
  Object.entries(headerModel.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (windowStore.winState == "creation") {
    const windowName = currentWindow.value;
    const response = await saveNewHeader(String(windowName), 0, formData);
    if (response.success) {
      const redirect = response.redirect;
      windowStore.setRead();
      await router.push(redirect);
      loadData();
    } else {
      console.log(response);
    }
  } else {
    const windowName = currentWindow.value;
    const response = await saveHeader(String(windowName), 0, headerId, formData);
    // console.log("Response from saveHeader:", response);
    // 2026-06-26. Santi. Esta comprobación no está devolviendo nada desde el backend. De momento lo pondré como valido
    // Y así compruebo que el estado funciona.
    // console.log(response)
    if (response.status_code === "200") {
      windowStore.setRead();
    }
  }
}

function onChange(newModel: DynamicModel) {
  if (windowStore.winState !== "modify" && windowStore.winState !== "creation") {
    const idKey = Object.keys(newModel).find((key) => key.endsWith("_id"));
    const newId = idKey ? newModel[idKey] : null;
    if (newId) {
      windowStore.setModify();
    }
  }
  headerModel.value = newModel;
}

async function goToNext() {
  let id: string | number | undefined | string[] | boolean | null = currentId.value;
  const windowName = currentWindow.value;
  if (id === undefined) {
    id = headerModel.value[winFormat.value.Header.primaryKey];
  }
  const newID = await getNextHeaderID(String(windowName), winFormat.value, Number(id));
  if (newID == null) {
    // Poner botón con id: button-prev y boton con id: button-first como solo lectura
    disableNext.value = true;
    disableLast.value = true;
  } else {
    disableFirst.value = false;
    disablePrev.value = false;
    await router.push(`/iqs/${windowName}/${newID}`);
    loadData();
  }
}

async function goToPrevious() {
  let id: string | number | undefined | string[] | boolean | null = currentId.value;
  const windowName = currentWindow.value;
  if (id === undefined) {
    id = headerModel.value[winFormat.value.Header.primaryKey];
  }
  const newID = await getPrevHeaderID(String(windowName), winFormat.value, Number(id));
  if (newID == null) {
    // Poner botón con id: button-prev y boton con id: button-first como solo lectura
    disableFirst.value = true;
    disablePrev.value = true;
  } else {
    disableNext.value = false;
    disableLast.value = false;
    await router.push(`/iqs/${windowName}/${newID}`);
    loadData();
  }
}

async function goToFirst() {
  const windowName = currentWindow.value;
  const newID = await getFirstHeaderID(String(windowName), winFormat.value);
  if (newID == null) {
    // Poner botón con id: button-prev y boton con id: button-first como solo lectura
    disableFirst.value = true;
    disablePrev.value = true;
  } else {
    disableNext.value = false;
    disableLast.value = false;
    await router.push(`/iqs/${windowName}/${newID}`);
    loadData();
  }
}

async function goToLast() {
  const windowName = currentWindow.value;
  const newID = await getLastHeaderID(String(windowName), winFormat.value);
  if (newID == null) {
    // Poner botón con id: button-prev y boton con id: button-first como solo lectura
    disableNext.value = true;
    disableLast.value = true;
  } else {
    disableFirst.value = false;
    disablePrev.value = false;
    await router.push(`/iqs/${windowName}/${newID}`);
    loadData();
  }
}

async function onCreateNew() {
  const windowName = currentWindow.value;
  await router.push(`/iqs/${windowName}/new`);
  loadData();
}

async function onDeleteCurrent() {
  if (confirm("¿Desea borrar este registro?") == true) {
    let id: string | number | undefined | string[] | boolean | null = currentId.value;
    const windowName = currentWindow.value;
    if (id === undefined) {
      id = headerModel.value[winFormat.value.Header.primaryKey];
    }
    await deleteRegister(String(windowName), 0, Number(id), winFormat.value);
    goToPrevious();
  }
}

function close() {
  emit("close");
}

function openDetailWindow(window: string, id: number | string) {
  console.log(window, id, props.modal);
  // if(props.modal) return;

  modalWindow.value = window;

  modalId.value = id;

  loadModal.value = true;
  // loadWindow();
}

function CancelChanges() {
  const id = route.params.id;
  windowStore.setRead();
  if (id && id !== "new") {
    loadData();
  } else {
    goToFirst();
  }
}

onMounted(loadWindow);
</script>
