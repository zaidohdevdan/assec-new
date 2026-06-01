import { SchedulesService } from './schedules.service';
import { type AuthenticatedRequest } from '../auth/auth.types';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    create(body: {
        type: string;
        title: string;
        date: string;
        time: string;
        info?: string;
    }, req: AuthenticatedRequest): Promise<{
        info: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        date: Date;
        time: Date;
        userId: string;
    }>;
    findByUser(req: AuthenticatedRequest): Promise<{
        info: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        date: Date;
        time: Date;
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
        date: Date;
        time: Date;
        userId: string;
    }>;
    update(id: string, body: Partial<{
        type: string;
        title: string;
        date: string;
        time: string;
        info: string;
        status: string;
    }>, req: AuthenticatedRequest): Promise<{
        info: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        date: Date;
        time: Date;
        userId: string;
    }>;
    remove(id: string, req: AuthenticatedRequest): Promise<{
        info: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        date: Date;
        time: Date;
        userId: string;
    }>;
}
