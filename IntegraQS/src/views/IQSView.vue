<template>
    <Toast />
    <div v-if="loaded" class="flex flex-col justify-between px-4 py-1 overflow-hidden scrollbar-none">
        <header class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex justify-between">
            <a href="http://localhost:5173/login">
                <img src="/Logo_Integra.jpg" alt="Logo Integra" class="h-20 w-auto object-contain" />
            </a>
            <div class="flex gap-5 items-center w-full">
                <IQSToolsRead v-if="winFormat.Header.type != 5" :disable-first="disableFirst"
                    :disable-prev="disablePrev" :modal="props.modal" @goToNext="goToNext" @goToPrevious="goToPrevious"
                    @cancelChanges="CancelChanges" @accept-changes="onSave" @goToFirst="goToFirst" @goToLast="goToLast"
                    @createNew="onCreateNew" @deleteCurrent="onDeleteCurrent" />
                <Button v-if="props.modal" icon="pi pi-pencil" @click="close" severity="secondary" rounded
                    class="h-8 w-12 items-center justify-center rounded-lg bg-red-400 text-white shadow transition hover:bg-red-500! active:scale-95 cursor-pointer">X</Button>
            </div>

        </header>
        <main class="flex flex-col h-full">
            <section id="header-section">
                <IQSHeader :header-style="headerStyle" :header-fields="winFormat.Header.fields" :model="headerModel"
                    @update:model="onChange"></IQSHeader>
            </section>
            <section class="grid flex-1 grid-cols-[1fr_320px] gap-6">
                <div v-if="winFormat.Details.length > 0" class="p-6 bg-white border rounded-xl">
                    <IQSMain :model="headerModel" :main-tabs="winFormat.Details" :detail-values="detailsModel"
                        @open-detail="openDetailWindow">
                    </IQSMain>
                </div>
                <aside v-if="winFormat.Lateral.length > 0" class="p-6 bg-white border rounded-xl">Aquí irán el lateral
                </aside>
            </section>
        </main>
    </div>
    <Teleport to="body">
        <Dialog v-model:visible="loadModal" modal
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 border border-transparent overflow-hidden scrollbar-none">
            <div class="bg-white rounded-xl w-[90vw] h-[90vh]">
                <IQSView modal :windowName="modalWindow" :id="modalId" @close="closeModal" />
            </div>
        </Dialog>
    </Teleport>

</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import IQSHeader from "@/components/IQSHeader.vue";
import IQSMain from "@/components/IQSMain.vue";
import IQSToolsRead from "@/components/Tools/IQSTools.vue";
import { useWindowStore } from "@/stores/windowStore";
import { useToast } from 'primevue/usetoast';
import Toast from "@/volt/Toast.vue";
import Button from "@/volt/Button.vue";
import Dialog from "@/volt/Dialog.vue";

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
const toast = useToast();
const showSuccessModify = () => {
    toast.add({ severity: 'success', summary: 'Modificado', detail: 'Registro modificado', life: 3000 });
}; 

const showSuccessCreation = () => {
    toast.add({ severity: 'success', summary: 'Creado', detail: 'Registro creado', life: 3000 });
}; 

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
const currentWindow = ref(props.modal ? String(props.windowName) : String(route.params.windowName));
const currentId = ref(props.modal ? props.id : route.params.id);

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

async function closeModal() {
    loadModal.value = false;
    currentWindow.value = props.modal ? String(props.windowName) : String(route.params.windowName);
    currentId.value = props.modal ? props.id : route.params.id;
    // console.log(currentWindow.value, currentId.value)
    await loadWindow();
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
            if(!props.modal){
                await router.push(redirect);
            }else{
                close();
            }
            loadData();
            showSuccessCreation();
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
            showSuccessModify();  
            if(props.modal){
                close();         
            }
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
    var id: string | number | undefined | string[] | boolean | null = currentId.value;
    const windowName = currentWindow.value;
    if (id === undefined) {
        id = headerModel.value[winFormat.value.Header.primaryKey]
    }
    const newID = await getNextHeaderID(String(windowName), winFormat.value, Number(id));
    if (newID == null) {
        // Poner botón con id: button-prev y boton con id: button-first como solo lectura
        disableNext.value = true;
        disableLast.value = true;
    } else {
        disableFirst.value = false;
        disablePrev.value = false;
        if (!props.modal) {
            await router.push(`/iqs/${windowName}/${newID}`);
        }
        currentId.value = newID
        loadData();
    }
}

async function goToPrevious() {
    var id: string | number | undefined | string[] | boolean | null = currentId.value;
    const windowName = currentWindow.value;
    if (id === undefined) {
        id = headerModel.value[winFormat.value.Header.primaryKey]
    }
    const newID = await getPrevHeaderID(String(windowName), winFormat.value, Number(id));
    if (newID == null) {
        // Poner botón con id: button-prev y boton con id: button-first como solo lectura
        disableFirst.value = true;
        disablePrev.value = true;
    } else {
        disableNext.value = false;
        disableLast.value = false;
        if (!props.modal) {
            await router.push(`/iqs/${windowName}/${newID}`);
        }
        currentId.value = newID
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
        if (!props.modal) {
            await router.push(`/iqs/${windowName}/${newID}`);
        }
        currentId.value = newID
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
        if (!props.modal) {
            await router.push(`/iqs/${windowName}/${newID}`);
        }
        currentId.value = newID
        loadData();
    }
}

async function onCreateNew() {
    const windowName = currentWindow.value;
    if (!props.modal) {
        await router.push(`/iqs/${windowName}/new`);
    }
    currentId.value = "new"
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
    // console.log(window, id, props.modal);
    // if(props.modal) return;

    modalWindow.value = window;

    modalId.value = id;

    loadModal.value = true;
    // loadWindow();
}

function CancelChanges() {
    const id = currentId.value;
    windowStore.setRead();
    if (id && id !== "new") {
        loadData();
    } else {
        goToFirst();
    }
}

onMounted(loadWindow);
</script>
