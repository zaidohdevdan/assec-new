"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, Loader2, Home, UserCheck, Calendar } from "lucide-react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

interface ValidatedUser {
  valid: boolean;
  name: string;
  cpf: string | null;
  rg: string | null;
  matricula: string | null;
  org: string | null;
  status: string;
  since: string;
  photoUrl: string | null;
}

export default function ValidarCarteiraPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState<ValidatedUser | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) {
      setError("Código de identificação do associado ausente na URL.");
      setLoading(false);
      return;
    }

    const validateCard = async () => {
      try {
        const res = await apiFetch(`/users/public/validate/${id}`);
        if (res.ok) {
          const data = await res.json();
          setResult(data);
        } else {
          setError("Esta carteirinha não pôde ser validada ou o associado não foi encontrado.");
        }
      } catch (err) {
        console.error("Error validating card:", err);
        setError("Erro de conexão com o servidor. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    validateCard();
  }, [id]);

  const maskCPF = (cpf: string | null) => {
    if (!cpf) return "---";
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `***.***.${cleaned.substring(6, 9)}-**`;
    }
    return cpf;
  };

  const maskRG = (rg: string | null) => {
    if (!rg) return "---";
    if (rg.length > 4) {
      return `***.${rg.substring(rg.length - 4)}`;
    }
    return rg;
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-none text-center">
      {/* Association Header */}
      <div className="mb-8 flex flex-col items-center">
        <Link href="/">
          <Image
            src="/logo-transparent.webp"
            alt="ASSEC Logo"
            width={80}
            height={80}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>
        <h1 className="font-serif font-bold text-xl text-primary mt-3">
          Validador de Carteira Digital
        </h1>
        <p className="text-xs text-text-secondary mt-1 uppercase tracking-wider font-semibold">
          ASSEC - Segurança do Ceará
        </p>
      </div>

      {loading ? (
        <Card className="p-8 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-accent-dark" />
          <p className="text-sm text-text-secondary font-medium">
            Consultando credenciais no sistema...
          </p>
        </Card>
      ) : error || !result ? (
        <Card className="p-6 border-t-4 border-t-red-500 shadow-lg space-y-6 text-center">
          <div className="mx-auto p-3 bg-red-100 text-red-700 rounded-full w-fit">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-primary">
              Carteirinha Inválida ou Não Encontrada
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed px-2">
              {error || "Este código QR não corresponde a uma credencial de associado ativa cadastrada no banco de dados da ASSEC."}
            </p>
          </div>
          <div className="pt-2">
            <Link href="/" passHref>
              <Button className="w-full bg-primary text-white hover:bg-primary-light font-bold text-xs uppercase tracking-widest py-3">
                <Home className="h-4 w-4 mr-2" />
                Ir para o Início
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-t-4 border-t-emerald-500 shadow-xl space-y-6 text-left relative overflow-hidden">
          {/* Watermark in background */}
          <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 opacity-[0.03] pointer-events-none">
            <Image
              src="/logo-transparent.webp"
              alt="Watermark"
              width={160}
              height={160}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100 gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-full">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-primary">
                Identidade Confirmada!
              </h2>
              <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                {result.status === "Ativo" ? "Associado Ativo" : `Status: ${result.status}`}
              </span>
            </div>
          </div>

          {/* User Visual Card Block */}
          <div className="flex gap-4 items-center bg-gray-50 p-3.5 rounded-lg border border-gray-200/60">
            {/* Photo */}
            <div className="h-20 w-16 rounded border border-gray-300 bg-white overflow-hidden flex items-center justify-center shrink-0">
              {result.photoUrl ? (
                <img
                  src={result.photoUrl}
                  alt={result.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-300 flex flex-col items-center justify-center font-bold text-lg">
                  {result.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Main Info */}
            <div className="min-w-0 flex-1">
              <h3 className="font-sans font-bold text-sm text-primary uppercase truncate">
                {result.name}
              </h3>
              <p className="text-xs text-text-secondary mt-1 font-medium truncate">
                {result.org || "Não informado"}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-text-muted">
                <Calendar className="h-3 w-3" />
                <span>Membro desde: {new Date(result.since).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-text-secondary font-medium">Matrícula:</span>
              <span className="font-mono font-bold text-primary">{result.matricula || "---"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-text-secondary font-medium">CPF do Titular:</span>
              <span className="font-mono font-bold text-primary">{maskCPF(result.cpf)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-text-secondary font-medium">RG do Titular:</span>
              <span className="font-mono font-bold text-primary">{maskRG(result.rg)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-secondary font-medium">Entidade Emissora:</span>
              <span className="font-semibold text-primary">ASSEC Ceará</span>
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[10px] text-text-muted leading-relaxed">
              Esta consulta foi gerada em tempo real com dados criptografados diretamente do servidor oficial da ASSEC.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
