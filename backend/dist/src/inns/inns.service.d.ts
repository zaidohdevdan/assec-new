import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class InnsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.InnCreateInput): Promise<{
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
    update(id: string, data: Prisma.InnUpdateInput): Promise<{
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
