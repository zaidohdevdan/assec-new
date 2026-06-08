import * as React from "react";
import DashboardClientLayout from "./DashboardClientLayout";

export const metadata = {
  title: "Painel do Administrador",
  description: "Área de controle administrativo do portal ASSEC.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
