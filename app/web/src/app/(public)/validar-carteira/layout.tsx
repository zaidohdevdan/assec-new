import * as React from "react";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Validador de Carteira Digital",
  description: "Validação oficial de carteira de associado da ASSEC.",
  path: "/validar-carteira",
  robots: { index: false, follow: false },
});

export default function ValidarCarteiraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

