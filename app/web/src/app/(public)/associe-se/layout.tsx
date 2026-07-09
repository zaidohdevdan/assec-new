import * as React from "react";

export const metadata = {
  title: "Associe-se",
  description: "Faça parte da ASSEC. Preencha nossa ficha digital para ter acesso a suporte jurídico, convênios de lazer, saúde e mais.",
  alternates: {
    canonical: "https://assecce.com.br/associe-se",
  },
  openGraph: {
    title: "Associe-se | ASSEC",
    description: "Faça parte da ASSEC. Preencha nossa ficha digital para ter acesso a suporte jurídico, convênios de lazer, saúde e mais.",
    url: "https://assecce.com.br/associe-se",
  },
};

export default function AssocieseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
