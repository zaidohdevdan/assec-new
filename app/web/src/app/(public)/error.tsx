"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicErrorPage({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // É recomendado enviar o erro para algum serviço de log (ex: Sentry, Logflare)
    console.error("Erro detectado na área pública:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-bg-page animate-none">
      <div className="max-w-md w-full text-center space-y-8 bg-white border border-border p-8 sm:p-10 rounded-2xl shadow-lg transition-all">
        {/* Error Icon Block */}
        <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shadow-inner">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600">
            Erro de Sistema
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
            Ops! Algo deu errado.
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Desculpe o inconveniente. Ocorreu uma falha inesperada ao carregar este conteúdo. Nossa equipe de suporte já foi notificada.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Button
            onClick={reset}
            variant="primary"
            className="w-full sm:w-auto bg-accent text-primary hover:bg-accent-light font-bold flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar Novamente
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-border text-text-primary hover:bg-slate-50 font-bold flex items-center justify-center gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4 text-text-secondary" />
              Página Inicial
            </Link>
          </Button>
        </div>

        {/* Technical reference */}
        {error.digest && (
          <div className="pt-4 border-t border-border">
            <span className="text-[10px] font-mono text-text-muted select-all">
              Ref: {error.digest}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
