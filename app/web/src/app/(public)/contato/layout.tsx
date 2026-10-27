import * as React from "react";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contato",
  description: "Entre em contato com a ASSEC. Envie sua mensagem, dúvida ou sugestão para nossa equipe.",
  path: "/contato",
});

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
