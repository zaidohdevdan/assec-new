import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        status: string;
        org: string | null;
    }[]>;
    findOne(id: string): Promise<{
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
