import api from './api';
import { ContactInput, ContactMessage } from '../types';

export const contactService = {
    async sendMessage(data: ContactInput): Promise<{ success: boolean; message: string }> {
        const response = await api.post('/contact', data);
        return response.data;
    },

    async getMessages(): Promise<ContactMessage[]> {
        const response = await api.get<ContactMessage[]>('/contact');
        return response.data;
    },
};