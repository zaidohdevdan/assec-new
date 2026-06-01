import { InnsService } from './inns.service';
import { Prisma } from '@prisma/client';
export declare class InnsController {
    private readonly innsService;
    constructor(innsService: InnsService);
    create(data: Prisma.InnCreateInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        description: string;
        image: string;
        amenities: string[];
        active: boolean;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        description: string;
        image: string;
        amenities: string[];
        active: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        description: string;
        image: string;
        amenities: string[];
        active: boolean;
    }>;
    update(id: string, data: Prisma.InnUpdateInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        description: string;
        image: string;
        amenities: string[];
        active: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        description: string;
        image: string;
        amenities: string[];
        active: boolean;
    }>;
}
