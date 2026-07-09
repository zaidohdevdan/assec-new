import * as React from "react";

export const metadata = {
  title: "Política de Privacidade (LGPD)",
  description: "Entenda como a ASSEC protege, trata e resguarda seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD).",
  alternates: {
    canonical: "https://assecce.com.br/politica-de-privacidade",
  },
  openGraph: {
    title: "Política de Privacidade (LGPD) | ASSEC",
    description: "Entenda como a ASSEC protege, trata e resguarda seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD).",
    url: "https://assecce.com.br/politica-de-privacidade",
  },
};

export default function PoliticaPrivacidadeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
