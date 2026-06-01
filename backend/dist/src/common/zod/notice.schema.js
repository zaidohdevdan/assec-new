"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeUpdateSchema = exports.NoticeCreateSchema = void 0;
const zod_1 = require("zod");
const NoticeTypeSchema = zod_1.z.enum(['info', 'warning', 'error']);
exports.NoticeCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Título é obrigatório'),
    content: zod_1.z.string().min(1, 'Conteúdo é obrigatório'),
    type: NoticeTypeSchema.default('info'),
    active: zod_1.z.boolean().default(true),
});
exports.NoticeUpdateSchema = exports.NoticeCreateSchema.partial().refine((data) => Object.keys(data).length > 0, 'Pelo menos um campo deve ser fornecido para atualização');
//# sourceMappingURL=notice.schema.js.map