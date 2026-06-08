import * as React from "react";

export const metadata = {
  title: "Acesso Administrativo",
  description: "Faça login no painel de administração da ASSEC.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
