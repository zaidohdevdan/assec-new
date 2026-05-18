import { AuthService } from './auth.service';
import { z } from 'zod';
declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    cpf: z.ZodString;
    org: z.ZodString;
    rg: z.ZodOptional<z.ZodString>;
    matricula: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type LoginDto = z.infer<typeof loginSchema>;
type RegisterDto = z.infer<typeof registerSchema>;
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: import("./auth.service").UserPublic;
    }>;
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: import("./auth.service").UserPublic;
    }>;
}
export {};
