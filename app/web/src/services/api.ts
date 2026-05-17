import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

// interceptor: Adtion token to header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@assec/token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;