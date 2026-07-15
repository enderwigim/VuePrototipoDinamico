import api from "@/services/axios";

const API_PATH = "http://127.0.0.1:8000/iqs/";

export async function getInfoWindow(windowName: string) {
    const response = await api.get(`${API_PATH}${windowName}`);
    return response.data;
}

export async function getInfoHeader(windowName: string, windowFormat: any, registerID: number | string | string[] | undefined) {
    if (registerID === undefined){
        const response = await api.post(`${API_PATH}${windowName}/0`, windowFormat);
        return response.data;
    }else{
        const response = await api.post(`${API_PATH}${windowName}/0?key_value=${registerID}`, windowFormat);
        return response.data;
    }
}

export async function getDefaultInfoHeader(windowName: string, windowFormat: any) {
        const response = await api.post(`${API_PATH}${windowName}/default`, windowFormat);
        return response.data;
}

export async function getNextHeaderID(windowName: string, windowFormat: any, registerID: number | string | undefined) {
    if (registerID === undefined){
        const response = await api.post(`${API_PATH}${windowName}/0?next_value=true`, windowFormat);
        return response.data;
    }else{
        const response = await api.post(`${API_PATH}${windowName}/0?key_value=${registerID}&next_value=true`, windowFormat);
        return response.data;
    }
}

export async function getPrevHeaderID(windowName: string, windowFormat: any, registerID: number | string | undefined) {
    if (registerID === undefined){
        const response = await api.post(`${API_PATH}${windowName}/0?prev_value=true`, windowFormat);
        return response.data;
    }else{
        const response = await api.post(`${API_PATH}${windowName}/0?key_value=${registerID}&prev_value=true`, windowFormat);
        return response.data;
    }
}

export async function getFirstHeaderID(windowName: string, windowFormat: any) {
    const response = await api.post(`${API_PATH}${windowName}/0?first_value=true`, windowFormat);
    return response.data;
}

export async function getLastHeaderID(windowName: string, windowFormat: any) {
    const response = await api.post(`${API_PATH}${windowName}/0?last_value=true`, windowFormat);
    // console.log(response.data)
    return response.data;
}
export async function getInfoDetails(windowName: string, detailID: number, registerID: number | undefined, windowFormat: any) {
    if (registerID === undefined){
        const response = await api.post(`${API_PATH}${windowName}/${detailID}`, windowFormat);
        return response.data;
    }else{
        const response = await api.post(`${API_PATH}${windowName}/${detailID}?key_value=${registerID}`, windowFormat);
        return response.data;
    }
}

export async function deleteRegister(windowName: string, detailID: number, registerID: number | undefined, windowFormat: any) {
    const response = await api.delete(`${API_PATH}${windowName}/${detailID}/${registerID}`, {data: windowFormat});
    return response.data;
}

export async function saveNewHeader(windowName: string, detailID: number, formData: FormData){
    try {
        const response = await api.post(`${API_PATH}${windowName}/${detailID}/new`, formData);
        // console.log(response.data)
        return response.data;
    } catch (error: any) {
        // console.log(error.response.data)
        if (error.response) {
        // console.log("Backend error:", error.response.data.detail);
            alert(error.response.data.detail)
            return error.response.data;
        }
        throw error;
    }
}

export async function saveHeader(windowName: string, detailID: number, registerID: number | string | boolean | null | undefined, formData: FormData){
    const response = await api.put(`${API_PATH}${windowName}/${detailID}/${registerID}`, formData);
    return response.data;
}

export async function getSelectedOption(field_name: string, value: number | string | boolean | null | undefined){
    const response = await api.get(`${API_PATH}search/${field_name}?chosen_value=${value}`)
    return response.data;
}

export async function getOptions(field_name: string){
    const response = await api.get(`${API_PATH}search/${field_name}`)
    return response.data;
}