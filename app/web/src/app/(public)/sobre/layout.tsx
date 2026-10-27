import * as React from "react";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Sobre Nós | História, Missão e Diretoria da Associação",
  description: "Conheça a história, missão, valores e organograma completo da Associação dos Servidores da Segurança do Ceará.",
  path: "/sobre",
});

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
