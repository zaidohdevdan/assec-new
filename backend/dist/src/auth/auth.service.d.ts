import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User, Prisma } from '@prisma/client';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null>;
    login(user: Omit<User, 'password'>): {
        access_token: string;
        user: Omit<{
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
        }, "password">;
    };
    register(data: Prisma.UserCreateInput): Promise<{
        access_token: string;
        user: Omit<{
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
        }, "password">;
    }>;
}
