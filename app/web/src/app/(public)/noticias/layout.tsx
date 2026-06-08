import * as React from "react";

export const metadata = {
  title: "Notícias e Informativos",
  description: "Fique por dentro das últimas notícias, comunicados e acontecimentos da ASSEC.",
};

export default function NoticiasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
