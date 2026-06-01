import { z } from 'zod';
export declare const InnCreateSchema: z.ZodObject<{
    name: z.ZodString;
    location: z.ZodString;
    description: z.ZodString;
    image: z.ZodString;
    amenities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const InnUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    amenities: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>>;
    active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
export type InnCreateDto = z.infer<typeof InnCreateSchema>;
export type InnUpdateDto = z.infer<typeof InnUpdateSchema>;
