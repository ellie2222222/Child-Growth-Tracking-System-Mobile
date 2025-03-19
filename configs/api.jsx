// api.jsx
import axios from "axios";

const API_URL = process.env.EXPO_LOCAL_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post(`/auth/renew-access-token`);

        return api(originalRequest);
      } catch (refreshError) {
        await api.post(`/auth/logout`);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
