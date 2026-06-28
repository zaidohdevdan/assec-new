import * as React from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});

import { CookieBanner } from "@/components/ui/CookieBanner";

export const metadata = {
  metadataBase: new URL("https://assecce.com.br"),
  manifest: "/manifest.json",
  title: {
    default: "ASSEC | Associação dos Servidores da Segurança do Ceará",
    template: "%s | ASSEC",
  },
  description: "Portal Institucional da Associação dos Servidores da Segurança do Ceará. Transparência, representatividade e força.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://assecce.com.br",
    siteName: "ASSEC Ceará",
    title: "ASSEC | Associação dos Servidores da Segurança do Ceará",
    description: "Portal Institucional da Associação dos Servidores da Segurança do Ceará. Transparência, representatividade e força.",
    images: [
      {
        url: "/escudo-logo.webp",
        width: 1200,
        height: 630,
        alt: "ASSEC - Associação dos Servidores da Segurança do Ceará",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASSEC | Associação dos Servidores da Segurança do Ceará",
    description: "Portal Institucional da Associação dos Servidores da Segurança do Ceará. Transparência, representatividade e força.",
    images: ["/escudo-logo.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ASSEC - Associação dos Servidores da Segurança do Ceará",
    "alternateName": "ASSEC",
    "url": "https://assecce.com.br",
    "logo": "https://assecce.com.br/logo-transparent.webp",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Santos Dumont, 1510, Sala 805, Aldeota",
      "addressLocality": "Fortaleza",
      "addressRegion": "CE",
      "postalCode": "60.150-161",
      "addressCountry": "BR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-85-99941-1411",
      "contactType": "customer service",
      "email": "contato@assecce.com.br",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    },
    "sameAs": [
      "https://www.instagram.com/assec.ceara"
    ],
    "taxID": "66.901.120/0001-78"
  };

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg-page text-text-primary antialiased min-h-screen flex flex-col">
        <main id="main">{children}</main>
        <CookieBanner />
      </body>
    </html>
  );
}
