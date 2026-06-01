import { z } from 'zod';

export const InnCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  location: z.string().min(1, 'Localização é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  image: z.string().url('URL da imagem inválida'),
  amenities: z
    .array(z.string().min(1))
    .min(1, 'Pelo menos uma comodidade é necessária')
    .optional()
    .default([]),
  active: z.boolean().default(true),
});

export const InnUpdateSchema = InnCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'Pelo menos um campo deve ser fornecido para atualização',
);

export type InnCreateDto = z.infer<typeof InnCreateSchema>;
export type InnUpdateDto = z.infer<typeof InnUpdateSchema>;
