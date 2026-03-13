import axios from "axios";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export function getStoredAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function hasStoredAccessToken() {
  return Boolean(getStoredAccessToken());
}

export function storeTokens({ accessToken, refreshToken }) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearStoredTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

apiClient.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;

    if (!originalRequest || statusCode !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      clearStoredTokens();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await refreshClient.post(
        "/auth/refresh",
        {},
        {
          headers: {
            "x-refresh-token": refreshToken,
          },
        }
      );

      storeTokens(response.data);
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearStoredTokens();
      return Promise.reject(refreshError);
    }
  }
);

export const api = {
  register: async (payload) => (await apiClient.post("/auth/register", payload)).data,

  login: async (payload) => (await apiClient.post("/auth/login", payload)).data,

  refresh: async (refreshToken) =>
    (
      await refreshClient.post(
        "/auth/refresh",
        {},
        {
          headers: {
            "x-refresh-token": refreshToken,
          },
        }
      )
    ).data,

  getMe: async () => (await apiClient.get("/auth/me")).data,

  getProducts: async () => (await apiClient.get("/products")).data,

  getProductById: async (id) => (await apiClient.get(`/products/${id}`)).data,

  createProduct: async (payload) => (await apiClient.post("/products", payload)).data,

  updateProduct: async (id, payload) => (await apiClient.put(`/products/${id}`, payload)).data,

  deleteProduct: async (id) => (await apiClient.delete(`/products/${id}`)).data,
};
