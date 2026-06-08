import * as React from "react";
import PortalClientLayout from "./PortalClientLayout"

export const metadata = {
  title: "Portal do Associado",
  description: "Área exclusiva para associados da ASSEC. Acompanhe seus agendamentos, visualize sua carteira de associado e gerencie seu cadastro.",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalClientLayout>{children}</PortalClientLayout>;
}
