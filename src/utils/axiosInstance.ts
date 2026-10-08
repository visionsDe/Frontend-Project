import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { environment } from '@/environments/environment';

const axiosInstance = axios.create({
  baseURL: environment.baseUrl,
});

// Request interceptor — attach the Bearer token on every outgoing request.
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error),
);

// Response interceptor — on a 401, drop any locally cached session state
// and bounce to the root so the auth guard can take over.
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response?.status === 401) {
      Object.keys(localStorage).forEach(key => localStorage.removeItem(key));
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
