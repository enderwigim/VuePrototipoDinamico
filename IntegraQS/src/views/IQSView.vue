<template>
    <IQSToolsRead @goToNext="goToNext" @goToPrevious="goToPrevious" @cancelChanges="CancelChanges"
        @accept-changes="onSave" @goToFirst="goToFirst" @goToLast="goToLast" @createNew="onCreateNew"
        @deleteCurrent="onDeleteCurrent" />
    <main v-if="loaded" class="flex flex-col h-full gap-6">
        <header class="p-5 bg-white border-b border-gray-200">
            <IQSHeader :header-style="headerStyle" :header-fields="winFormat.Header.fields" :model="headerModel"
                @update:model="onChange"></IQSHeader>
        </header>
        <section class="grid flex-1 grid-cols-[1fr_320px] gap-6">
            <div class="p-6 bg-white border rounded-xl">
                <IQSMain :model="headerModel" :main-tabs="winFormat.Details" :detail-values="detailsModel"></IQSMain>
            </div>
            <aside class="p-6 bg-white border rounded-xl">Aquí irán el lateral</aside>
        </section>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import IQSHeader from "@/components/IQSHeader.vue";
import IQSMain from "@/components/IQSMain.vue";
import IQSToolsRead from "@/components/Tools/IQSTools.vue";
import { useWindowStore } from "@/stores/windowStore";

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
    saveHeader
} from "@/services/iqs.service";
import api from "@/services/axios"
import { buildContainerClasses } from "@/utils/containerBuilder";
type DynamicModel = Record<string, string | number | boolean | null>;
const route = useRoute();
const router = useRouter();

const loaded = ref(false);
const winFormat = ref({
    Header: {
        style: {},
        fields: [],
        primaryKey: "",
    },
    Footer: [],
    Details: [],
    Lateral: [],
});
const headerModel = ref<DynamicModel>({});
const detailsModel = ref<DynamicModel[]>([]);

const headerStyle = ref<string>("");
// type StateWin = "creation" | "modify" | "read";
// const stateWin = ref<StateWin>("read");
const windowStore = useWindowStore();
async function loadData() {
    const windowName = String(route.params.windowName);
    const id = route.params.id as string | undefined;

    // 1. Formato de ventana
    const windowData = await getInfoWindow(windowName);
    
    if (id === "new"){
         // 2. Datos default de cabecera
        const headerData = await getDefaultInfoHeader(windowName, windowData);
        //3. Datos de detalles
        const detailsData: DynamicModel[] = []

        winFormat.value = windowData;
        headerStyle.value = buildContainerClasses(winFormat.value.Header.style);
        headerModel.value = headerData[0] ?? {};
        detailsModel.value = detailsData;
        windowStore.setCreation()
    }else{
        // 2. Datos de cabecera
        const headerData = await getInfoHeader(windowName, windowData, id);

        //3. Datos de detalles
        const detailsData = []
        if (windowData.Details.length > 0) {
            for (var detail of windowData.Details) {
                const detailData = await getInfoDetails(windowName, detail.value, headerData[0][windowData.Header.primaryKey], windowData);
                const detailModel = {
                    [detail.value]: detailData
                };
                detailsData[detail.value] = detailData
            }
        }

        winFormat.value = windowData;
        headerStyle.value = buildContainerClasses(winFormat.value.Header.style);
        headerModel.value = headerData[0] ?? {};
        detailsModel.value = detailsData;
    }
    

    loaded.value = true;
}

async function onSave() {
    const formData = new FormData();
    const headerId = Number(headerModel.value["cus_id"]);
    Object.entries(headerModel.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    });

    if (windowStore.winState == "creation") {
        const windowName = route.params.windowName
        const response = await saveNewHeader(String(windowName), 0, formData);
        if (response.success) {
            const redirect = response.redirect;
            windowStore.setRead();
            await router.push(redirect);
            loadData();
        }else{
            console.log(response)
        }
    } else {
        // console.log("Saving register with ID:", headerId);
        const windowName = route.params.windowName
        const response = await saveHeader(String(windowName), 0, headerId, formData);
        // console.log("Response from saveHeader:", response);
        // 2026-06-26. Santi. Esta comprobación no está devolviendo nada desde el backend. De momento lo pondré como valido
        // Y así compruebo que el estado funciona.
        console.log(response)
        if (response.status_code === "200") {
            windowStore.setRead();
        }
    }

    // stateWin.value = "modify";
    // alert("Registro guardado");
}

function onChange(newModel: DynamicModel) {
    if (windowStore.winState !== "modify" && windowStore.winState !== "creation") {
        const idKey = Object.keys(newModel).find(key => key.endsWith("_id"));
        const newId = idKey ? newModel[idKey] : null;
        if (newId) {
            windowStore.setModify();
        }
    }
    headerModel.value = newModel;
}

async function goToNext() {
    var id: string | number | undefined | string[] | boolean | null = route.params.id;
    const windowName = route.params.windowName
    if (id === undefined){
        id = headerModel.value[winFormat.value.Header.primaryKey]
    }
    const newID = await getNextHeaderID(String(windowName), winFormat.value, Number(id));
    await router.push(`/iqs/${windowName}/${newID}`);
    loadData();
}

async function goToPrevious() {
    var id: string | number | undefined | string[] | boolean | null = route.params.id;
    const windowName = route.params.windowName
    if (id === undefined){
        id = headerModel.value[winFormat.value.Header.primaryKey]
    }
    const newID = await getPrevHeaderID(String(windowName), winFormat.value, Number(id));
    await router.push(`/iqs/${windowName}/${newID}`);
    loadData();
}

async function goToFirst() {
    const windowName = route.params.windowName
    const newID = await getFirstHeaderID(String(windowName), winFormat.value);
    await router.push(`/iqs/${windowName}/${newID}`);
    loadData();
}

async function goToLast() {
    const windowName = route.params.windowName
    const newID = await getLastHeaderID(String(windowName), winFormat.value);
    await router.push(`/iqs/${windowName}/${newID}`);
    loadData();
}

async function onCreateNew() {
    const windowName = route.params.windowName
    await router.push(`/iqs/${windowName}/new`);
    loadData();
}

async function onDeleteCurrent() {
    if (confirm("¿Desea borrar este cliente?") == true) {
        var id: string | number | undefined | string[] | boolean | null = route.params.id;
        const windowName = route.params.windowName
        if (id === undefined){
            id = headerModel.value[winFormat.value.Header.primaryKey]
        }
        await deleteRegister(String(windowName), 0, Number(id), winFormat.value);
        goToPrevious();
    }
}

function CancelChanges() {
    const id = route.params.id;
    windowStore.setRead()
    if (id && id !== "new") {
        loadData();
    } else {
        goToFirst();
    }
}

onMounted(loadData);
</script>
