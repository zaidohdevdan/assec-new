import { InnsService } from './inns.service';
export declare class InnsController {
    private readonly innsService;
    constructor(innsService: InnsService);
    create(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        location: string;
        image: string;
        amenities: string[];
        active: boolean;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        location: string;
        image: string;
        amenities: string[];
        active: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        location: string;
        image: string;
        amenities: string[];
        active: boolean;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        location: string;
        image: string;
        amenities: string[];
        active: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        location: string;
        image: string;
        amenities: string[];
        active: boolean;
    }>;
}
