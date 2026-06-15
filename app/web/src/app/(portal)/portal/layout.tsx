import * as React from "react";

export const metadata = {
  title: "Portal do Associado",
  description: "Área exclusiva para associados da ASSEC. Acompanhe seus agendamentos, visualize sua carteira de associado e gerencie seu cadastro.",
};

export default function PortalSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
