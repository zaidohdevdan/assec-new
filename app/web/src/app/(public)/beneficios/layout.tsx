import * as React from "react";

export const metadata = {
  title: "Benefícios e Convênios",
  description: "Conheça os benefícios exclusivos para associados da ASSEC: convênios de saúde, lazer, assessoria jurídica e mais.",
  alternates: {
    canonical: "https://assecce.com.br/beneficios",
  },
  openGraph: {
    title: "Benefícios e Convênios | ASSEC",
    description: "Conheça os benefícios exclusivos para associados da ASSEC: convênios de saúde, lazer, assessoria jurídica e mais.",
    url: "https://assecce.com.br/beneficios",
  },
};

export default function BeneficiosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
