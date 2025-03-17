// api.jsx
import axios from "axios";
import { performLogout } from "../authActions";

const API_URL = process.env.EXPO_PUBLIC_API_URL || process.env.EXPO_LOCAL_API_URL;

const api = axios.create({
  baseURL: process.env.EXPO_LOCAL_API_URL,
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_URL}/auth/renew-access-token`, {}, { withCredentials: true });
        
        return api(originalRequest);
      } catch (refreshError) {
        performLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;