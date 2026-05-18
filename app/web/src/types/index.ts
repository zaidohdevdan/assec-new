// Tipos baseados no seu Schema Prisma do Backend

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    cpf: string;
    rg: string;
    matricula?: string | null;
    org: string;
    status: 'Ativo' | 'Pendente' | 'Inativo';
    since: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export interface Schedule {
    id: string;
    type: string;
    title: string;
    date: string;
    time: string;
    status: 'pending' | 'approved' | 'rejected';
    info: string;
    createdAt?: string;
    updatedAt?: string;
}



// Inputs de Formulários
export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    cpf: string;
    phone?: string;
    org: string;
    matricula?: string;
    rg?: string;
    // password removido - será definido pelo admin depois
}
export interface ContactInput {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// Respostas da API
export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}