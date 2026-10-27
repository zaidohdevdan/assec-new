import * as React from "react";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Notícias e Informativos",
  description: "Fique por dentro das últimas notícias, comunicados e acontecimentos da ASSEC.",
  path: "/noticias",
});

export default function NoticiasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
