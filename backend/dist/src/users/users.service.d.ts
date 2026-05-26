import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.UserCreateInput): Promise<{
        id: string;
        email: string;
        cpf: string | null;
        matricula: string | null;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        rg: string | null;
        status: string;
        org: string | null;
        since: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        cpf: string | null;
        matricula: string | null;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        rg: string | null;
        status: string;
        org: string | null;
        since: Date;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        cpf: string | null;
        matricula: string | null;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        rg: string | null;
        status: string;
        org: string | null;
        since: Date;
    } | null>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        status: string;
        org: string | null;
    }[]>;
    updatePassword(identifier: string, newPassword: string): Promise<boolean>;
}
