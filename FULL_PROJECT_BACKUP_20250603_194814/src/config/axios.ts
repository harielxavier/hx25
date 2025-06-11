import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshToken } from '../services/authService';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store pending requests during token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add custom metadata to the request config type
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Set the Authorization header for every request
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add performance monitoring
    (config as CustomInternalAxiosRequestConfig).metadata = { startTime: new Date().getTime() };
    
    // Add a timestamp parameter to prevent Firebase caching issues
    const url = config.url || '';
    const separator = url.includes('?') ? '&' : '?';
    config.url = `${url}${separator}_t=${Date.now()}`;
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Add performance monitoring
    const config = response.config as CustomInternalAxiosRequestConfig;
    if (config.metadata) {
      const endTime = new Date().getTime();
      const duration = endTime - config.metadata.startTime;
      
      // Log slow requests (more than 1 second)
      if (duration > 1000) {
        console.warn(`Slow request: ${config.url} took ${duration}ms`);
      }
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Handle 403 Forbidden (expired token)
    if (error.response?.status === 403) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Attempt to refresh the token
        const newToken = await refreshToken();
        
        if (newToken) {
          // Update the Authorization header with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          // Process any queued requests with the new token
          processQueue(null, newToken);
          
          // Retry the original request
          return axios(originalRequest);
        } else {
          // Token refresh failed, redirect to login
          processQueue(new Error('Failed to refresh token'));
          
          // Clear tokens
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          // Check if this is an admin route
          const isAdminRoute = window.location.pathname.startsWith('/admin');
          
          // Redirect to the appropriate login page
          window.location.href = isAdminRoute ? '/admin/login' : '/login';
          
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError);
        
        // Clear tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Redirect to login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error detected. Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);

// Create a separate instance for authentication operations
export const authApi = axios.create({
  baseURL: '/api/auth',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export the API instances
export default api;
