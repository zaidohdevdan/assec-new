import api from './api';

export const scheduleService = {
  getAll: async () => {
    const response = await api.get('/schedules');
    return response.data;
  },
  create: async (data: { type: string; title: string; date: string; time: string; info?: string }) => {
    const response = await api.post('/schedules', data);
    return response.data;
  }
};
