import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  async signIn(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('auth_token', data.token);
    return data.user;
  },

  async signUp(email: string, password: string) {
    const { data } = await api.post('/auth/register', { email, password });
    localStorage.setItem('auth_token', data.token);
    return data.user;
  },

  signOut() {
    localStorage.removeItem('auth_token');
  }
};

export const clients = {
  async getAll() {
    const { data } = await api.get('/clients');
    return data;
  },

  async create(client: any) {
    const { data } = await api.post('/clients', client);
    return data;
  }
};

export const bookings = {
  async getAll() {
    const { data } = await api.get('/bookings');
    return data;
  },

  async create(booking: any) {
    const { data } = await api.post('/bookings', booking);
    return data;
  }
};

export default api;