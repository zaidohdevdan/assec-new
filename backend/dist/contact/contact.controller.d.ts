import { ContactService } from './contact.service';
import { z } from 'zod';
declare const createContactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    subject: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
type CreateContactDto = z.infer<typeof createContactSchema>;
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<{
        success: boolean;
        message: string;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        message: string;
        subject: string;
        read: boolean;
    }[]>;
}
export {};
