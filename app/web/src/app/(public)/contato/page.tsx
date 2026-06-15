"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().min(2, "O nome deve conter pelo menos 2 caracteres"),
  email: z.string().email("Endereço de e-mail inválido"),
  subject: z.string().min(2, "O assunto deve conter pelo menos 2 caracteres"),
  message: z.string().min(5, "A mensagem deve conter pelo menos 5 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContatoPage() {
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const res = await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        reset();
      } else {
        const errData = await res.json();
        setSubmitError(
          errData?.message || 
          "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente."
        );
      }
    } catch (err) {
      console.error("Failed to send contact message:", err);
      setSubmitError(
        "Erro de conexão. Verifique se o servidor está ativo e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-none">
      {/* Header Section */}
      <div className="text-center mb-12">
        <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">
          Fale Conosco
        </span>
        <h1 className="font-serif font-bold text-4xl text-primary mt-2">
          Página de Contato
        </h1>
        <p className="text-text-secondary max-w-3xl mx-auto mt-4 text-base sm:text-lg">
          Tem dúvidas, sugestões ou precisa de suporte? Entre em contato com a nossa equipe. Estamos prontos para ajudar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Info Column (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-serif font-bold text-2xl text-primary border-b border-border pb-3">
            Informações de Contato
          </h2>
          
          <div className="space-y-4">
            {/* Address Card */}
            <Card className="flex items-start gap-4 p-5 hover:border-l-4 hover:border-l-accent transition-all duration-300">
              <div className="p-3 bg-primary/5 rounded-lg text-accent-dark shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-sans font-bold text-sm text-primary">Nosso Endereço</h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Av. Santos Dumont, 1510, Sala 805, Aldeota<br />
                  Fortaleza - CE, CEP 60.150-161
                </p>
              </div>
            </Card>

            {/* Telephone Card */}
            <Card className="flex items-start gap-4 p-5 hover:border-l-4 hover:border-l-accent transition-all duration-300">
              <div className="p-3 bg-primary/5 rounded-lg text-accent-dark shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-sans font-bold text-sm text-primary">Telefone / WhatsApp</h3>
                <a 
                  href="tel:85999411411" 
                  className="text-xs text-text-secondary hover:text-accent-dark transition-colors mt-1 block font-medium"
                >
                  (85) 99941-1411
                </a>
              </div>
            </Card>

            {/* Email Card */}
            <Card className="flex items-start gap-4 p-5 hover:border-l-4 hover:border-l-accent transition-all duration-300">
              <div className="p-3 bg-primary/5 rounded-lg text-accent-dark shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-sans font-bold text-sm text-primary">E-mail de Suporte</h3>
                <a 
                  href="mailto:contato@assecce.com.br" 
                  className="text-xs text-text-secondary hover:text-accent-dark transition-colors mt-1 block font-medium break-all"
                >
                  contato@assecce.com.br
                </a>
              </div>
            </Card>

            {/* Instagram Card */}
            <Card className="flex items-start gap-4 p-5 hover:border-l-4 hover:border-l-accent transition-all duration-300">
              <div className="p-3 bg-primary/5 rounded-lg text-accent-dark shrink-0">
                <Instagram className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-sans font-bold text-sm text-primary">Instagram</h3>
                <a 
                  href="https://instagram.com/assec.ceara" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-text-secondary hover:text-accent-dark transition-colors mt-1 block font-medium"
                >
                  @assec.ceara
                </a>
              </div>
            </Card>

            {/* Operating Hours Card */}
            <Card className="flex items-start gap-4 p-5 hover:border-l-4 hover:border-l-accent transition-all duration-300">
              <div className="p-3 bg-primary/5 rounded-lg text-accent-dark shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-sans font-bold text-sm text-primary">Horário de Funcionamento</h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Segunda a Sexta: 08:00 às 17:00
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Form Column (3/5) */}
        <div className="lg:col-span-3">
          <Card className="p-6 sm:p-8">
            <h2 className="font-serif font-bold text-2xl text-primary border-b border-border pb-3 mb-6 text-left">
              Envie uma Mensagem
            </h2>

            {success ? (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <div className="p-3 bg-green-100 text-green-700 rounded-full animate-bounce">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-primary">
                  Mensagem Enviada!
                </h3>
                <p className="text-text-secondary text-sm max-w-md">
                  Agradecemos o seu contato. Nossa equipe recebeu a sua mensagem e responderá o mais breve possível no endereço de e-mail fornecido.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSuccess(false)}
                  className="mt-4 font-semibold text-xs uppercase tracking-widest"
                >
                  Enviar Nova Mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                {submitError && (
                  <div 
                    className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" 
                    role="alert"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Nome Completo"
                    placeholder="Digite seu nome completo"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    placeholder="exemplo@email.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                <Input
                  label="Assunto"
                  placeholder="Ex: Dúvida sobre convênios"
                  error={errors.subject?.message}
                  {...register("subject")}
                />

                <Textarea
                  label="Mensagem"
                  placeholder="Escreva sua mensagem aqui..."
                  error={errors.message?.message}
                  {...register("message")}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full bg-primary text-white hover:bg-primary-light hover:shadow-lg font-bold py-3 text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <Send className="h-4 w-4" />
                    <span>Enviar Mensagem</span>
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
