import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class NoticesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.NoticeCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        active: boolean;
        content: string;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        active: boolean;
        content: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        active: boolean;
        content: string;
    }>;
    update(id: string, data: Prisma.NoticeUpdateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        active: boolean;
        content: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        active: boolean;
        content: string;
    }>;
}
