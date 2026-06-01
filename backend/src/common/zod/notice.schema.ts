import { z } from 'zod';

const NoticeTypeSchema = z.enum(['info', 'warning', 'error']);

export const NoticeCreateSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  type: NoticeTypeSchema.default('info'),
  active: z.boolean().default(true),
});

export const NoticeUpdateSchema = NoticeCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'Pelo menos um campo deve ser fornecido para atualização',
);

export type NoticeCreateDto = z.infer<typeof NoticeCreateSchema>;
export type NoticeUpdateDto = z.infer<typeof NoticeUpdateSchema>;
