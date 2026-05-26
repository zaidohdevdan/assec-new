import api from './api';

export const innService = {
  getAll: async () => {
    const response = await api.get('/inns');
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/inns/${id}`);
    return response.data;
  }
};
