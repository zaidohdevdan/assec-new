import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { type AuthenticatedRequest } from './auth.types';
import { z } from 'zod';
declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
declare const registerSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    name: z.ZodString;
    cpf: z.ZodOptional<z.ZodString>;
    rg: z.ZodOptional<z.ZodString>;
    matricula: z.ZodOptional<z.ZodString>;
    org: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type LoginDto = z.infer<typeof loginSchema>;
type RegisterDto = z.infer<typeof registerSchema>;
declare const resetPasswordSchema: z.ZodObject<{
    identifier: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
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
    register(registerDto: RegisterDto): Promise<{
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
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(req: AuthenticatedRequest): Promise<{
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
}
export {};
