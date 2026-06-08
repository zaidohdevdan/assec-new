"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "./button";
import { ShieldAlert } from "lucide-react";

export const CookieBanner = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem("lgpd-consent");
    if (!consent) {
      // Small timeout to animate banner smoothly
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("lgpd-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:right-8 md:left-auto md:max-w-md z-50 bg-slate-900 text-white rounded-xl shadow-2xl p-5 border border-slate-800 animate-in slide-in-from-bottom-5 duration-300 font-sans">
      <div className="flex gap-3.5 items-start">
        <div className="p-2 bg-primary text-accent rounded-lg shrink-0 mt-0.5">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-serif font-bold text-sm text-accent-light mb-1">
            Privacidade e Proteção de Dados (LGPD)
          </h3>
          <p className="text-[11px] text-gray-300 leading-relaxed mb-4">
            Utilizamos cookies para otimizar o funcionamento do site e coletamos dados de filiação de forma segura. Ao continuar navegando, você declara estar de acordo com a nossa{" "}
            <Link
              href="/politica-de-privacidade"
              className="text-accent underline font-semibold hover:text-accent-light"
            >
              Política de Privacidade
            </Link>.
          </p>
          <div className="flex justify-end gap-2.5">
            <Button
              variant="outline"
              onClick={() => setVisible(false)}
              className="text-[10px] px-3.5 py-1.5 border-slate-700 text-gray-300 hover:bg-slate-800/50 hover:text-white h-auto font-medium"
            >
              Recusar
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-accent text-primary hover:bg-accent-light text-[10px] px-4 py-1.5 h-auto font-bold animate-none"
            >
              Aceitar Termos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
