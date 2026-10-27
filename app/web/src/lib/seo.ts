import type { Metadata } from "next";

export const SITE_URL = "https://assecce.com.br";

export const DEFAULT_OG_IMAGE = {
  url: "/escudo-logo.webp",
  width: 1200,
  height: 630,
  alt: "ASSEC - Associação dos Servidores da Segurança do Ceará",
};

export interface CreateMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  type?: "website" | "article";
  robots?: Metadata["robots"];
}

export function createMetadata({
  title,
  description,
  path = "",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  robots,
}: CreateMetadataOptions): Metadata {
  const canonicalUrl = path
    ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
    : SITE_URL;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: "pt_BR",
      url: canonicalUrl,
      siteName: "ASSEC Ceará",
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    ...(robots ? { robots } : {}),
  };
}

