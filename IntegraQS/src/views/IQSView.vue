<template>
    <IQSToolsRead @goToNext="goToNext" @goToPrevious="goToPrevious" @cancelChanges="CancelChanges"
        @accept-changes="onSave" @goToFirst="goToFirst" @goToLast="goToLast" @createNew="onCreateNew"
        @deleteCurrent="onDeleteCurrent" />
    <main v-if="loaded" class="flex flex-col h-full gap-6">
        <header class="p-5 bg-white border-b border-gray-200">
            <!-- <div class="flex items-start justify-between">
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
        </div> -->

            <IQSHeader :header-style="headerStyle" :header-fields="winFormat.Header.fields" :model="headerModel"
                @update:model="onChange"></IQSHeader>
        </header>
        <section class="grid flex-1 grid-cols-[1fr_320px] gap-6">
            <div class="p-6 bg-white border rounded-xl">Aquí irán los tabs (Details)</div>
            <aside class="p-6 bg-white border rounded-xl">Aquí irán el lateral</aside>
        </section>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import IQSHeader from "@/components/IQSHeader.vue";
import IQSToolsRead from "@/components/Tools/IQSTools.vue";
import { useWindowStore } from "@/stores/windowStore";

import {
    getInfoWindow,
    getInfoHeader,
    getInfoDetails
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
    const windowData = await getInfoWindow(windowName, id);

    // 2. Datos de cabecera
    const headerData = await getInfoHeader(windowName, windowData);

    //3. Datos de detalles
    const detailsData = []
    if (windowData.Details.length > 0){
        for (var detail of windowData.Details){
            const detailData = await getInfoDetails(windowName, detail.value, headerData[0][windowData.Header.primaryKey], windowData);
            const detailModel = {
                [detail.value] : detailData
            };
            detailsData.push(detailModel)
        }
    }

    winFormat.value = windowData;
    headerStyle.value = buildContainerClasses(winFormat.value.Header.style);
    headerModel.value = headerData[0] ?? {};
    detailsModel.value = detailsData;
    console.log("Detalles: ", detailsModel.value)

    loaded.value = true;
}

async function onSave() {
    // const formData = new FormData();
    // const customerId = Number(headerModel.value["cus_id"]);
    // Object.entries(headerModel.value).forEach(([key, value]) => {
    //     if (value !== null && value !== undefined) {
    //         formData.append(key, String(value));
    //     }
    // });

    // if (windowStore.winState == "creation") {
    //     const response = await saveNewCustomer(formData);
    //     if (response.success) {
    //         const redirect = response.redirect;
    //         windowStore.setRead();
    //         await router.push(redirect);
    //         loadData();
    //     }
    // } else {
    //     console.log("Saving customer with ID:", customerId);
    //     const response = await saveCustomer(formData, customerId);
    //     console.log("Response from saveCustomer:", response);
    //     // 2026-06-26. Santi. Esta comprobación no está devolviendo nada desde el backend. De momento lo pondré como valido
    //     // Y así compruebo que el estado funciona.
    //     //if (response.details === 204) {
    //     windowStore.setRead();
    //     //}
    // }

    // stateWin.value = "modify";
    // alert("Cliente guardado");
}

function onChange(newModel: DynamicModel) {
    // if (windowStore.winState !== "modify" && windowStore.winState !== "creation") {
    //     const newId = newModel["cus_id"];
    //     if (newId) {
    //         windowStore.setModify();
    //         // Update the route to reflect the new customer ID
    //         // window.history.replaceState(null, "", `/customer/${newId}`);
    //     }
    // }
    // headerModel.value = newModel;
}

async function goToNext() {
    // const id = route.params.id;
    // const newID = await getNextCustomer(Number(id));
    // await router.push(`/customers/${newID}`);
    // loadData();
}

async function goToPrevious() {
    // const id = route.params.id;
    // const newID = await getPreviousCustomer(Number(id));
    // await router.push(`/customers/${newID}`);
    // loadData();
}

async function goToFirst() {
    // const id = await getFirstCustomer();
    // await router.push(`/customers/${id}`);
    // loadData();
}

async function goToLast() {
    // const id = await getLastCustomer();
    // await router.push(`/customers/${id}`);
    // loadData();
}

async function onCreateNew() {
    // await router.push(`/customers/new`);
    // loadData();
}

async function onDeleteCurrent() {
    // if (confirm("¿Desea borrar este cliente?") == true) {
    //     const id = route.params.id;
    //     await deleteCustomer(Number(id));
    //     goToPrevious();
    // }
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
</script>
