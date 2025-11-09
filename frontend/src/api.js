import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

// Get API URL and remove trailing slash if present
const apiUrlRaw = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const apiUrl = apiUrlRaw.replace(/\/+$/, ''); // Remove trailing slashes

// Debug: Log API URL (always log to help debug production issues)
console.log('🔗 API Base URL:', apiUrl);
console.log('🔗 Environment variable VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || 'NOT SET');

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug: Log request URL
    if (import.meta.env.DEV) {
      console.log('Making request to:', config.baseURL + config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshTokenValue) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${apiUrl}/api/token/refresh/`, {
          refresh: refreshTokenValue,
        });

        const { access } = response.data;
        localStorage.setItem(ACCESS_TOKEN, access);
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors (no response from server)
    if (!error.response) {
      console.error('Network Error:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
        },
      });
      
      const networkErrorMessage = error.code === 'ECONNABORTED' 
        ? 'Request timeout. Please check your connection.'
        : error.message === 'Network Error'
        ? 'Cannot connect to server. Please check if the backend is running and CORS is configured correctly.'
        : error.message || 'Network error occurred';
      
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(networkErrorMessage, 'error');
      }
      return Promise.reject(error);
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.message ||
      'An error occurred';

    if (error.response?.status !== 401 && typeof window !== 'undefined' && window.showToast) {
      window.showToast(errorMessage, 'error');
    }

    return Promise.reject(error);
  }
);

export default api;