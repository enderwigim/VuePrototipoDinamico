import api from "@/services/axios";

const API_PATH = "http://127.0.0.1:8000/iqs/";

export async function getInfoWindow(windowName: string) {
    const response = await api.get(`${API_PATH}${windowName}`);
    return response.data;
}

export async function getInfoHeader(windowName: string, windowFormat: any, headerID: number | string | undefined) {
        if (headerID === undefined){
            const response = await api.post(`${API_PATH}${windowName}/0`, windowFormat);
            return response.data;
        }else{
            const response = await api.post(`${API_PATH}${windowName}/0?key_value=${headerID}`, windowFormat);
            return response.data;
        }
}

export async function getInfoDetails(windowName: string, detailID: number, headerID: number | undefined, windowFormat: any) {
        if (headerID === undefined){
            const response = await api.post(`${API_PATH}${windowName}/${detailID}`, windowFormat);
            return response.data;
        }else{
            const response = await api.post(`${API_PATH}${windowName}/${detailID}?key_value=${headerID}`, windowFormat);
            return response.data;
        }
}