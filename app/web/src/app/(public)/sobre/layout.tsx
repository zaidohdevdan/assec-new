import * as React from "react";

export const metadata = {
  title: "Sobre a ASSEC",
  description: "Conheça a história, missão e valores da Associação dos Servidores da Segurança do Ceará.",
  alternates: {
    canonical: "https://assecce.com.br/sobre",
  },
  openGraph: {
    title: "Sobre a ASSEC",
    description: "Conheça a história, missão e valores da Associação dos Servidores da Segurança do Ceará.",
    url: "https://assecce.com.br/sobre",
  },
};

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
