"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InnUpdateSchema = exports.InnCreateSchema = void 0;
const zod_1 = require("zod");
exports.InnCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nome é obrigatório'),
    location: zod_1.z.string().min(1, 'Localização é obrigatória'),
    description: zod_1.z.string().min(1, 'Descrição é obrigatória'),
    image: zod_1.z.string().url('URL da imagem inválida'),
    amenities: zod_1.z
        .array(zod_1.z.string().min(1))
        .min(1, 'Pelo menos uma comodidade é necessária')
        .optional()
        .default([]),
    active: zod_1.z.boolean().default(true),
});
exports.InnUpdateSchema = exports.InnCreateSchema.partial().refine((data) => Object.keys(data).length > 0, 'Pelo menos um campo deve ser fornecido para atualização');
//# sourceMappingURL=inn.schema.js.map