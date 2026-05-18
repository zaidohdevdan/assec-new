import { PrismaService } from '../prisma/prisma.service';
export declare class ContactService {
    private prisma;
    constructor(prisma: PrismaService);
    createMessage(data: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        message: string;
        subject: string;
        read: boolean;
    }>;
    getMessages(): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        message: string;
        subject: string;
        read: boolean;
    }[]>;
}
