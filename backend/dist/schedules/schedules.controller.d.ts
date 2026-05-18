import { SchedulesService } from './schedules.service';
import { Prisma } from '@prisma/client';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    create(createScheduleDto: Prisma.ScheduleCreateInput): Promise<{
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
    update(id: string, updateScheduleDto: Prisma.ScheduleUpdateInput): Promise<{
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
