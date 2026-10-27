import * as React from "react";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Declaração de Acessibilidade (WCAG 2.2)",
  description: "Conheça nossos compromissos, recursos de acessibilidade e conformidade WCAG 2.2 AA.",
  path: "/acessibilidade",
});

export default function AcessibilidadeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
