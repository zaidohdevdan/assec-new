import * as React from "react";

export const metadata = {
  title: "Painel do Administrador",
  description: "Área de controle administrativo do portal ASSEC.",
};

export default function DashboardSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
