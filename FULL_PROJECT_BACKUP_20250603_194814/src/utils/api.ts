import axios, { AxiosResponse, AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { refreshToken } from '../services/authService';

// Create base axios instances
const baseURL = import.meta.env.VITE_API_URL || '/api';

// Public API instance (no auth required)
export const publicApi: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Private API instance (auth required)
export const privateApi: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request queue for handling multiple requests during token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Extend axios request config to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

// Add performance monitoring
privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add request start time for performance monitoring
    (config as ExtendedAxiosRequestConfig).metadata = { startTime: new Date().getTime() };
    return config;
  },
  error => Promise.reject(error)
);

// Add auth token to requests
privateApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle 401 responses and token refresh
privateApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log API performance
    const config = response.config as ExtendedAxiosRequestConfig;
    if (config.metadata) {
      const executionTime = new Date().getTime() - config.metadata.startTime;
      if (executionTime > 1000) {
        console.warn(`Slow API call: ${config.url} took ${executionTime}ms`);
      }
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Prevent infinite loops
    if (!originalRequest || (originalRequest as any)._retry) {
      return Promise.reject(error);
    }
    
    // Check if error is due to expired token
    if (error.response?.status === 401) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      (originalRequest as any)._retry = true;
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const newToken = await refreshToken();
        
        if (newToken) {
          // Update header and retry
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return axios(originalRequest);
        } else {
          // Refresh failed, redirect to login
          processQueue(error, null);
          
          // Determine if this is an admin route by URL pattern
          const isAdminRoute = window.location.pathname.startsWith('/admin');
          
          // Redirect to appropriate login page
          if (isAdminRoute) {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
          
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Handle API error responses in a standard way
 * 
 * @param error - The axios error object
 * @returns A standardized error object with message and code
 */
export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Network errors
    if (!axiosError.response) {
      return {
        message: 'Network error. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
    
    // Server errors (5xx)
    if (axiosError.response.status >= 500) {
      return {
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
        status: axiosError.response.status,
        details: axiosError.response.data
      };
    }
    
    // Client errors (4xx)
    if (axiosError.response.status >= 400) {
      // Try to get a meaningful error message from the response
      const errorMessage = 
        axiosError.response.data?.message ||
        axiosError.response.data?.error ||
        'An error occurred. Please try again.';
      
      return {
        message: errorMessage,
        code: axiosError.response.data?.code || `ERROR_${axiosError.response.status}`,
        status: axiosError.response.status,
        details: axiosError.response.data
      };
    }
  }
  
  // Fallback for non-axios errors
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    code: 'UNKNOWN_ERROR'
  };
};

export default { publicApi, privateApi, handleApiError };
