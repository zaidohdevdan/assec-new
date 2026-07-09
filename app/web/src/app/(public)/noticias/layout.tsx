import * as React from "react";

export const metadata = {
  title: "Notícias e Informativos",
  description: "Fique por dentro das últimas notícias, comunicados e acontecimentos da ASSEC.",
  alternates: {
    canonical: "https://assecce.com.br/noticias",
  },
  openGraph: {
    title: "Notícias e Informativos | ASSEC",
    description: "Fique por dentro das últimas notícias, comunicados e acontecimentos da ASSEC.",
    url: "https://assecce.com.br/noticias",
  },
};

export default function NoticiasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
