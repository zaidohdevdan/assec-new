import * as React from "react";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Política de Privacidade (LGPD)",
  description: "Entenda como a ASSEC protege, trata e resguarda seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD).",
  path: "/politica-de-privacidade",
});

export default function PoliticaPrivacidadeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
