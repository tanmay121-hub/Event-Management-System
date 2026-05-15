import axios from "axios";

//  Use environment variable for base URL
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

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

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // ✅ Use environment variable here too
          const res = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refreshToken", res.data.refreshToken);

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            return API(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token also expired or invalid
          localStorage.clear();
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;