import * as React from "react";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Benefícios e Convênios",
  description: "Conheça os benefícios exclusivos para associados da ASSEC: convênios de saúde, lazer, assessoria jurídica e mais.",
  path: "/beneficios",
});

export default function BeneficiosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
