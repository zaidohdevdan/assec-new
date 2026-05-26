import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});
console.log('API baseURL set to', api.defaults.baseURL);

// interceptor: Add token to header
api.interceptors.request.use((config) => {
    // Read the persisted token directly from local storage if available, 
    // or through the zustand store if you prefer. Since it's persisted, 
    // reading from localStorage is safer for interceptors outside React components.
    const storageState = localStorage.getItem('auth-storage');
    if (storageState) {
        try {
            const { state } = JSON.parse(storageState);
            if (state && state.token) {
                config.headers['Authorization'] = `Bearer ${state.token}`;
            }
        } catch (e) {
            console.error("Error parsing auth storage", e);
        }
    }
    console.log('[DEBUG] Outgoing request', config.method?.toUpperCase(), `${config.baseURL}${config.url}`, config.headers);
    return config;
});

export default api;