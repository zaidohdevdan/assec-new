import { NoticesService } from './notices.service';
export declare class NoticesController {
    private readonly noticesService;
    constructor(noticesService: NoticesService);
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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
