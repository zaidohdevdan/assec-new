import * as React from "react";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Associe-se",
  description: "Faça parte da ASSEC. Preencha nossa ficha digital para ter acesso a suporte jurídico, convênios de lazer, saúde e mais.",
  path: "/associe-se",
});

export default function AssocieseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
