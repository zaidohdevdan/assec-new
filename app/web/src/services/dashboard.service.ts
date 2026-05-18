import api from './api';
import { User, Schedule } from '../types';

export const dashboardService = {
    async getUserProfile(): Promise<User> {
        const response = await api.get<User>('/users/me');
        return response.data;
    },

    async getSchedules(): Promise<Schedule[]> {
        const response = await api.get<Schedule[]>('/schedules');
        return response.data;
    },

    async updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule> {
        const response = await api.put(`/schedules/${id}`, data);
        return response.data;
    },

    async createSchedule(data: {
        type: string;
        title: string;
        date: string;
        time: string;
        info: string;
    }): Promise<Schedule> {
        const response = await api.post<Schedule>('/schedules', data);
        return response.data;
    },
};