import { z } from 'zod';
export declare const NoticeCreateSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<{
        info: "info";
        error: "error";
        warning: "warning";
    }>>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const NoticeUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        info: "info";
        error: "error";
        warning: "warning";
    }>>>;
    active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
export type NoticeCreateDto = z.infer<typeof NoticeCreateSchema>;
export type NoticeUpdateDto = z.infer<typeof NoticeUpdateSchema>;
