import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {
              refreshToken,
            }
          );

          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refreshToken", res.data.refreshToken);

            originalRequest.headers.Authorization =
              `Bearer ${res.data.token}`;

            return API(originalRequest);
          }

        } catch (refreshError) {
          localStorage.clear();
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;