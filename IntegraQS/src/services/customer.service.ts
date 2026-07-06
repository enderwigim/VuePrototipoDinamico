import api from "@/services/axios"

const API_PATH = "http://127.0.0.1:8000/";

export async function getCustomer(id: Number) {
  const response = await api.get(`${API_PATH}customer/${id}`);
  return response.data;
}

export async function getNextCustomer(id: Number) {
  const response = await api.get(`${API_PATH}customer/next/${id}`);
  return response.data;
}

export async function getPreviousCustomer(id: Number) {
  const response = await api.get(`${API_PATH}customer/prev/${id}`);
  return response.data;
}

export async function getFirstCustomer() {
  const response = await api.get(`${API_PATH}customer/first`);
  return response.data;
}

export async function getLastCustomer() {
  const response = await api.get(`${API_PATH}customer/last`);
  return response.data;
}

export async function getNewCustomer() {
  const response = await api.get(`${API_PATH}customer/new`);
  return response.data;
}
export async function getCustomerFormat() {
  const response = await api.get(`${API_PATH}customer/format`);
  return response.data;
}

export async function saveCustomer(formData: FormData, id: Number) {
  const response = await api.put(`${API_PATH}customer/${id}`, formData);
  return response.data;
}

// export async function saveNewCustomer(formData: FormData) {
//   const response = await api.post(`${API_PATH}customer/new`, formData);
//   console.log(response.data)
//   return response.data;
// }
export async function saveNewCustomer(formData: FormData) {
  try {
    const response = await api.post(`${API_PATH}customer/new`, formData);
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.log(error.response.data)
    if (error.response) {
      // console.log("Backend error:", error.response.data.detail);
      alert(error.response.data.detail)
      return error.response.data;
    }
    throw error;
  }
}


export async function deleteCustomer(id: Number) {
  const response = await api.delete(`${API_PATH}customer/${id}`);
  return response.data;
}