import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class SchedulesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ScheduleCreateInput): Promise<{
        info: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        date: string;
        title: string;
        time: string;
    }>;
    findAll(): Promise<{
        info: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        date: string;
        title: string;
        time: string;
    }[]>;
    findOne(id: string): Promise<{
        info: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        date: string;
        title: string;
        time: string;
    } | null>;
    update(id: string, data: Prisma.ScheduleUpdateInput): Promise<{
        info: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        date: string;
        title: string;
        time: string;
    }>;
    remove(id: string): Promise<{
        info: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        date: string;
        title: string;
        time: string;
    }>;
}
