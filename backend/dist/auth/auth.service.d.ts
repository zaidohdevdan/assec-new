import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export interface UserPublic {
    id: string;
    email: string;
    name: string;
    role: string;
    org: string;
    status: string;
    createdAt: string;
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<UserPublic | null>;
    login(user: UserPublic): {
        access_token: string;
        user: UserPublic;
    };
    register(data: {
        email: string;
        password: string;
        name: string;
        cpf?: string;
        org?: string;
        rg?: string;
        matricula?: string;
    }): Promise<{
        message: string;
        user: UserPublic;
    }>;
    private mapToPublic;
}
