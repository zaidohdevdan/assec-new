import { NoticesService } from './notices.service';
import { Prisma } from '@prisma/client';
export declare class NoticesController {
    private readonly noticesService;
    constructor(noticesService: NoticesService);
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
