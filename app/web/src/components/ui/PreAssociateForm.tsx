"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { ShieldCheck, AlertCircle, CheckCircle2, Send } from "lucide-react";

// Phone validation schema matching standard format (XX) XXXXX-XXXX or (XX) XXXX-XXXX
const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

const preAssociateSchema = z.object({
  name: z.string().min(3, "O nome deve conter pelo menos 3 caracteres"),
  email: z.string().email("Endereço de e-mail inválido"),
  phone: z.string().refine((val) => phoneRegex.test(val), {
    message: "Celular inválido. Use o formato (85) 99999-9999",
  }),
  organization: z.string().min(1, "Selecione o órgão de lotação"),
  message: z.string().optional(),
});

type PreAssociateFormData = z.infer<typeof preAssociateSchema>;

// Helper to apply phone formatting mask
const formatPhone = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 3) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
    2,
    7
  )}-${phoneNumber.slice(7, 11)}`;
};

export function PreAssociateForm() {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PreAssociateFormData>({
    resolver: zodResolver(preAssociateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      message: "",
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    setValue("phone", formattedValue, { shouldValidate: true });
  };

  const onSubmit = async (data: PreAssociateFormData) => {
    setLoading(true);
    setError(null);

    // Format the payload to fit ContactMessage schema
    const subject = "Solicitação de Pré-Associação via Portal";
    const formattedMessage = `ÓRGÃO DE LOTAÇÃO: ${data.organization}
CELULAR/TELEFONE: ${data.phone}

MENSAGEM:
${data.message || "Gostaria de me associar à ASSEC."}`;

    try {
      const res = await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject,
          message: formattedMessage,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        reset();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData?.message ?? "Falha ao enviar solicitação. Tente novamente.");
      }
    } catch {
      setError("Erro de conexão. Verifique se o servidor do backend está ativo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-emerald-100 rounded-xl p-8 text-center max-w-2xl mx-auto shadow-md animate-none">
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full w-fit mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="font-serif font-bold text-2xl text-primary mb-3">
          Solicitação Enviada!
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto mb-6">
          Agradecemos pelo seu interesse em fazer parte da ASSEC. Nossa equipe de cadastro analisará seus dados e entrará em contato via e-mail ou WhatsApp em breve.
        </p>
        <Button
          onClick={() => setSuccess(false)}
          variant="primary"
          className="bg-primary hover:bg-primary-light font-bold text-xs uppercase tracking-widest px-6 py-2.5"
        >
          Enviar Nova Solicitação
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-xl p-6 sm:p-8 max-w-3xl mx-auto shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2.5 bg-primary/5 text-accent-dark rounded-lg">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-primary">
            Envie sua Solicitação de Pré-Associação
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Preencha os dados básicos abaixo para iniciar o seu credenciamento.
          </p>
        </div>
      </div>

      {error && (
        <div
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2.5"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Nome Completo"
            placeholder="Ex: João da Silva"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="E-mail de Contato"
            type="email"
            placeholder="Ex: joao@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Celular (WhatsApp)"
            placeholder="(85) 99999-9999"
            error={errors.phone?.message}
            {...register("phone")}
            onChange={handlePhoneChange}
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label
              htmlFor="organization"
              className="text-sm font-semibold text-text-primary"
            >
              Órgão de Lotação
            </label>
            <select
              id="organization"
              className={`flex h-10 w-full rounded-md border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${
                errors.organization?.message ? "border-red-500" : "border-border"
              }`}
              {...register("organization")}
            >
              <option value="">Selecione o órgão...</option>
              <option value="Polícia Militar">Polícia Militar</option>
              <option value="Polícia Civil">Polícia Civil</option>
              <option value="Polícia Penal">Polícia Penal</option>
              <option value="Bombeiro Militar">Bombeiro Militar</option>
              <option value="Perícia Forense">Perícia Forense</option>
              <option value="Outros">Outros</option>
            </select>
            {errors.organization?.message && (
              <span className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.organization.message}
              </span>
            )}
          </div>
        </div>

        <Textarea
          label="Mensagem (Opcional)"
          placeholder="Escreva alguma observação ou dúvida adicional, caso possua."
          error={errors.message?.message}
          {...register("message")}
        />

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            loading={loading}
            variant="accent"
            className="w-full sm:w-auto h-auto py-3 px-8 font-bold text-xs uppercase tracking-widest shadow hover:shadow-md border-none flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Enviar Pré-Cadastro</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
