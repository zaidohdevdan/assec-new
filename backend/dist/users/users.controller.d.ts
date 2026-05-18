import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        cpf: string | null;
        rg: string | null;
        matricula: string | null;
        status: string;
        org: string | null;
        since: Date;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
