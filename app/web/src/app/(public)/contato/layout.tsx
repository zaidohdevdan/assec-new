import * as React from "react";

export const metadata = {
  title: "Contato",
  description: "Entre em contato com a ASSEC. Envie sua mensagem, dúvida ou sugestão para nossa equipe.",
  alternates: {
    canonical: "https://assecce.com.br/contato",
  },
  openGraph: {
    title: "Contato | ASSEC",
    description: "Entre em contato com a ASSEC. Envie sua mensagem, dúvida ou sugestão para nossa equipe.",
    url: "https://assecce.com.br/contato",
  },
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
