import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const api = {
  getProducts: async () => (await apiClient.get("/products")).data,

  getProductById: async (id) => (await apiClient.get(`/products/${id}`)).data,

  createProduct: async (payload) => (await apiClient.post("/products", payload)).data,

  updateProduct: async (id, payload) => (await apiClient.put(`/products/${id}`, payload)).data,

  deleteProduct: async (id) => (await apiClient.delete(`/products/${id}`)).data,
};
