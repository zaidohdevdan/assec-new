import api from './api';
import { LoginInput, RegisterInput, AuthResponse, User } from '../types';

export const authService = {
    async login(data: LoginInput): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: RegisterInput): Promise<{ message: string; userId: string }> {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await api.get<User>('/users/me');
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
        localStorage.removeItem('@assec/token');
    },
};