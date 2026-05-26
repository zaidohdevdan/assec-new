import { PrismaService } from '../prisma/prisma.service';
export declare class SchedulesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: string;
        type: string;
        title: string;
        date: string;
        time: string;
        info?: string;
    }): Promise<{
        info: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        date: string;
        time: string;
        userId: string;
    }>;
    findByUser(userId: string): Promise<{
        info: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        date: string;
        time: string;
        userId: string;
    }[]>;
    findOne(id: string): Promise<{
        info: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        date: string;
        time: string;
        userId: string;
    }>;
    update(id: string, userId: string, data: Partial<{
        type: string;
        title: string;
        date: string;
        time: string;
        info: string;
        status: string;
    }>): Promise<{
        info: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        date: string;
        time: string;
        userId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        info: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        date: string;
        time: string;
        userId: string;
    }>;
}
