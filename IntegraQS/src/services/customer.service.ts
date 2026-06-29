import axios from "axios";

const API_PATH = "http://127.0.0.1:8000/";

export async function getCustomer(id: Number) {
  const response = await axios.get(`${API_PATH}customer/${id}`);
  return response.data;
}


export async function getNextCustomer(id: Number) {
  const response = await axios.get(`${API_PATH}customer/next/${id}`);
  return response.data;
}

export async function getPreviousCustomer(id: Number) {
  const response = await axios.get(`${API_PATH}customer/prev/${id}`);
  return response.data;
}

export async function getNewCustomer() {
  const response = await axios.get(`${API_PATH}customer/new`);
  return response.data;
}
export async function getCustomerFormat() {
  const response = await axios.get(`${API_PATH}customer/format`);
  return response.data;
}

export async function saveCustomer(formData: FormData, id: Number) {
  const response = await axios.put(`${API_PATH}customer/${id}`, formData);
  return response.data;
}

export async function saveNewCustomer(formData: FormData) {
  const response = await axios.post(`${API_PATH}customer/new`, formData);
  return response.data;
}
