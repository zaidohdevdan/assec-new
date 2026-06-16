"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Download, FileText } from "lucide-react";
import { apiFetch } from "@/lib/api";

const associeSchema = z.object({
  nome: z.string().min(3, "O nome deve conter pelo menos 3 caracteres"),
  email: z.string().email("Endereço de e-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cargo: z.string().min(2, "Informe seu cargo ou patente"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Você deve ler e aceitar a Política de Privacidade e Proteção de Dados (LGPD) para prosseguir" }),
  }),
});

type AssocieFormData = z.infer<typeof associeSchema>;

export default function AssociePage() {
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssocieFormData>({
    resolver: zodResolver(associeSchema),
  });

  const onSubmit = async (data: AssocieFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const res = await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: data.nome,
          email: data.email,
          subject: `Proposta de Filiação - ${data.cargo}`,
          message: `Telefone: ${data.telefone}\nCargo/Patente: ${data.cargo}\nConsentimento LGPD: Aceito pelo usuário em conformidade com as diretrizes legais da associação.`,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const errData = await res.json();
        setSubmitError(errData?.message || "Ocorreu um erro ao enviar sua proposta. Tente novamente mais tarde.");
      }
    } catch (err) {
      console.error("Failed to submit membership proposal:", err);
      setSubmitError("Erro de conexão. Verifique se o servidor do backend está ativo e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-none">
      <div className="text-center mb-10">
        <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">Associação</span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary mt-2">
          Ficha de Filiação Online
        </h1>
        <p className="text-text-secondary mt-3 text-sm sm:text-base">
          Preencha a ficha cadastral abaixo. Após o envio, nossa equipe analisará os dados e entrará em contato para concluir a filiação.
        </p>
      </div>

      {/* PDF Downloads Section */}
      <Card className="mb-8 p-5 border-l-4 border-l-accent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3 items-start">
          <div className="p-2.5 bg-gray-100 rounded text-primary shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div className="text-left">
            <h2 className="font-serif font-bold text-base text-primary">Fichas de Filiação em PDF</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Se preferir preencher manualmente, faça o download das fichas e entregue na secretaria da associação.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <a
            href="/ficha-assec-frente.pdf"
            download
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 border border-border rounded text-xs text-text-primary hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ficha (Frente)</span>
          </a>
          <a
            href="/ficha-assec-verso.pdf"
            download
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 border border-border rounded text-xs text-text-primary hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ficha (Verso)</span>
          </a>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        {success ? (
          <div className="text-center py-8 flex flex-col items-center gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-full">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-primary">
              Proposta Enviada com Sucesso!
            </h2>
            <p className="text-text-secondary text-sm max-w-md">
              Agradecemos o seu interesse em fazer parte da ASSEC. Um de nossos colaboradores entrará em contato em breve através do e-mail ou telefone informado.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" role="alert">
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{submitError}</span>
              </div>
            )}
            <Input
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              error={errors.nome?.message}
              {...register("nome")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="E-mail"
                type="email"
                placeholder="exemplo@email.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Telefone com DDD"
                placeholder="(85) 99999-9999"
                error={errors.telefone?.message}
                {...register("telefone")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Cargo / Patente"
                placeholder="Ex: Soldado, Cabo, Inspetor"
                error={errors.cargo?.message}
                {...register("cargo")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2.5 text-left">
                <input
                  type="checkbox"
                  id="consent"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-accent mt-0.5"
                  {...register("consent")}
                />
                <label htmlFor="consent" className="text-xs text-text-secondary leading-relaxed">
                  Estou ciente e consinto com a coleta e tratamento dos meus dados pessoais fornecidos nesta ficha cadastral para a finalidade exclusiva de análise de filiação, nos termos da Lei Geral de Proteção de Dados (LGPD) e da{" "}
                  <a href="/politica-de-privacidade" target="_blank" className="text-accent-dark underline font-semibold hover:text-accent">
                    Política de Privacidade
                  </a>.
                </label>
              </div>
              {errors.consent?.message && (
                <span className="text-xs text-red-600 font-medium text-left">
                  {errors.consent.message}
                </span>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                className="w-full bg-accent text-primary hover:bg-accent-light font-bold py-3 text-base animate-none"
              >
                Enviar Proposta de Filiação
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
