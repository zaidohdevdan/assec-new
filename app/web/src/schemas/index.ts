import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("E-mail inválido").min(1, "E-mail obrigatório"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// Schema para cadastro via WhatsApp (sem senha)
export const registerSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.email("E-mail inválido"),
    cpf: z.string().min(11, "CPF inválido"),
    phone: z.string().min(10, "Telefone inválido").optional(),
    org: z.string().min(2, "Informe o órgão"),
    matricula: z.string().optional(),
    rg: z.string().optional(),
});

export const contactSchema = z.object({
    name: z.string().min(2, "Nome inválido"),
    email: z.string().email("E-mail inválido"),
    subject: z.string().min(2, "Assunto inválido"),
    message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres"),
});

// Types exportados
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ContactSchema = z.infer<typeof contactSchema>;