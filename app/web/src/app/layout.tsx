import "@/styles/globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata = {
  metadataBase: new URL("https://assecce.com.br"),
  manifest: "/manifest.json",
  title: {
    default: "ASSEC | Associação dos Servidores da Segurança do Ceará",
    template: "%s | ASSEC",
  },
  description: "Portal Institucional da Associação dos Servidores da Segurança do Ceará. Transparência, representatividade e força.",
  keywords: [
    "ASSEC",
    "associação servidores segurança Ceará",
    "segurança pública Ceará",
    "assessoria jurídica policial",
    "convênios servidores públicos",
    "filiação associação segurança",
    "benefícios servidores Ceará",
    "Fortaleza segurança pública",
    "sindicato polícia Ceará",
    "direitos servidores segurança",
  ],
  authors: [{ name: "ASSEC - Associação dos Servidores da Segurança do Ceará", url: "https://assecce.com.br" }],
  creator: "ASSEC Ceará",
  publisher: "ASSEC - Associação dos Servidores da Segurança do Ceará",
  category: "nonprofit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
  verification: {
    google: "", // Preencher quando verificado no Google Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://assecce.com.br/#organization",
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

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://assecce.com.br/#website",
    "name": "ASSEC Ceará",
    "url": "https://assecce.com.br",
    "publisher": {
      "@id": "https://assecce.com.br/#organization"
    },
    "inLanguage": "pt-BR"
  };

  const isDev = process.env.NODE_ENV !== "production";
  const devChunkRecoveryScript = `
    (function() {
      try {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations().then(function(regs) {
            for (var i = 0; i < regs.length; i++) { regs[i].unregister(); }
          });
        }
        if ("caches" in window) {
          caches.keys().then(function(keys) {
            for (var j = 0; j < keys.length; j++) { caches.delete(keys[j]); }
          });
        }
        function handleChunkError(msg) {
          if (!msg || msg.indexOf("Failed to load chunk") === -1) return;
          var key = "__assec_chunk_reload_ts";
          var last = Number(sessionStorage.getItem(key) || "0");
          var now = Date.now();
          if (now - last > 5000) {
            sessionStorage.setItem(key, String(now));
            window.location.reload();
          }
        }
        window.addEventListener("error", function(e) {
          handleChunkError(e && e.message ? String(e.message) : "");
        });
        window.addEventListener("unhandledrejection", function(e) {
          var reason = e && e.reason ? (e.reason.message || String(e.reason)) : "";
          handleChunkError(String(reason));
        });
      } catch (_) {}
    })();
  `;

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {isDev && (
          <script
            dangerouslySetInnerHTML={{ __html: devChunkRecoveryScript }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="bg-bg-page text-text-primary antialiased min-h-screen flex flex-col font-sans">
        <AnalyticsTracker />
        <div className="flex-1 flex flex-col w-full min-w-0">{children}</div>
        <CookieBanner />
      </body>
    </html>
  );
}
