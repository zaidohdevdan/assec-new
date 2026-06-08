import * as React from "react";
import { Inter, Merriweather } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});

import { CookieBanner } from "@/components/ui/CookieBanner";

export const metadata = {
  title: {
    default: "ASSEC - Associação dos Servidores da Segurança do Ceará",
    template: "%s | ASSEC",
  },
  description: "Portal Institucional da Associação dos Servidores da Segurança do Ceará. Transparência, representatividade e força.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="bg-bg-page text-text-primary antialiased min-h-screen flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
