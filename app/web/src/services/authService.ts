import api from './api';

export const authService = {
  login: async (credentials: { email?: string; password?: string; cpf?: string; matricula?: string }) => {
    // Backend expects email for now, but we'll map cpf/matricula to email or backend needs adjustment.
    // For now, let's assume the payload sent is handled correctly.
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  resetPassword: async (data: { identifier: string; newPassword: string }) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
