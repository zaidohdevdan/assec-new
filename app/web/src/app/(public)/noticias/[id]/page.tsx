import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  Calendar,
  Tag,
  ArrowLeft,
  ImageIcon,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { ShareButton } from "@/components/ui/ShareButton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  type: string;
  tags: string[];
  coverImage: string | null;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ─── Constants & Styles ────────────────────────────────────────────────────────

const categoryStyles: Record<string, { text: string; dot: string; border: string }> = {
  institucional: { text: "text-slate-700 bg-slate-100",    dot: "bg-slate-400", border: "border-l-slate-400" },
  jurídico:      { text: "text-amber-700 bg-amber-50",     dot: "bg-amber-500", border: "border-l-amber-500" },
  lazer:         { text: "text-emerald-700 bg-emerald-50", dot: "bg-emerald-500", border: "border-l-emerald-500" },
  parcerias:     { text: "text-blue-700 bg-blue-50",       dot: "bg-blue-500", border: "border-l-blue-500" },
  urgente:       { text: "text-red-700 bg-red-50",         dot: "bg-red-500", border: "border-l-red-500" },
};

function getCatStyle(cat: string) {
  return (
    categoryStyles[cat.toLowerCase()] ?? {
      text: "text-slate-600 bg-slate-50",
      dot: "bg-slate-300",
      border: "border-l-slate-300",
    }
  );
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s+on\w+="[^"]*"/gi, "")
    .replace(/\s+on\w+='[^']*'/gi, "");
}

// Server Components rodam no Node.js, não no browser.
// Em produção, NEXT_PUBLIC_API_URL="/api" (relativo) não funciona server-side.
// INTERNAL_API_URL aponta para o backend pela rede Docker (http://backend:3001).
const API_BASE =
  process.env.INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

// Helper to fetch single article
async function getArticle(id: string): Promise<Article | null> {
  try {
    const url = `${API_BASE}/notices/${id}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) {
      return await res.json();
    }
    console.error(`[getArticle] API returned ${res.status} for ${url}`);
  } catch (err) {
    console.error(`[getArticle] Fetch failed for id=${id}:`, err);
  }
  return null;
}

// ─── Metadata Generation ─────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: "Notícia não encontrada",
      description: "Confira o boletim informativo da ASSEC Ceará.",
    };
  }

  const canonicalUrl = `https://assecce.com.br/noticias/${id}`;
  const ogImage = article.coverImage || "/escudo-logo.webp";

  return {
    title: `${article.title} | Notícias ASSEC`,
    description: article.summary || "Confira o boletim informativo da ASSEC Ceará.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: article.title,
      description: article.summary || "Confira o boletim informativo da ASSEC Ceará.",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: article.createdAt,
      authors: ["ASSEC - Associação dos Servidores da Segurança do Ceará"],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary || "Confira o boletim informativo da ASSEC Ceará.",
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
  };
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default async function NoticiaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  // ── Error state (not found) ────────────────────────────────────────────────
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center font-sans">
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg max-w-xl mx-auto p-12 flex flex-col items-center gap-4">
          <ShieldAlert className="h-10 w-10 text-red-500" />
          <h2 className="font-serif font-bold text-xl text-primary">Notícia não encontrada</h2>
          <p className="text-text-secondary text-sm max-w-sm">
            O boletim informativo ou comunicado que você está procurando não existe ou foi arquivado.
          </p>
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary-light font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded shadow transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para notícias
          </Link>
        </div>
      </div>
    );
  }

  const style = getCatStyle(article.type);
  const canonicalUrl = `https://assecce.com.br/noticias/${id}`;
  const ogImage = article.coverImage
    ? (article.coverImage.startsWith("http") ? article.coverImage : `https://assecce.com.br${article.coverImage}`)
    : "https://assecce.com.br/escudo-logo.webp";

  // ── JSON-LD: NewsArticle ───────────────────────────────────────────────────
  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary || "",
    "image": ogImage,
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt || article.createdAt,
    "author": {
      "@type": "Organization",
      "name": "ASSEC - Associação dos Servidores da Segurança do Ceará",
      "url": "https://assecce.com.br",
    },
    "publisher": {
      "@id": "https://assecce.com.br/#organization",
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    "articleSection": article.type,
    "keywords": article.tags.join(", "),
  };

  // ── JSON-LD: BreadcrumbList ────────────────────────────────────────────────
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Início",
        "item": "https://assecce.com.br",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Notícias",
        "item": "https://assecce.com.br/noticias",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": canonicalUrl,
      },
    ],
  };

  // ── Render Page ────────────────────────────────────────────────────────────
  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans animate-none">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb visual */}
      <nav aria-label="Trilha de navegação" className="mb-6">
        <ol className="flex items-center gap-1.5 text-xs text-text-muted flex-wrap">
          <li>
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Início
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3 w-3" />
          </li>
          <li>
            <Link href="/noticias" className="hover:text-primary transition-colors font-medium">
              Notícias
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3 w-3" />
          </li>
          <li aria-current="page" className="text-primary font-semibold truncate max-w-[300px]">
            {article.title}
          </li>
        </ol>
      </nav>

      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/noticias"
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary font-bold text-xs uppercase tracking-wider transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5 duration-200" />
          <span>Voltar para notícias</span>
        </Link>
      </div>

      {/* Featured Cover Image */}
      {article.coverImage ? (
        <div className="w-full h-64 sm:h-96 rounded-xl overflow-hidden shadow-md border border-slate-200 mb-8 relative">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
            quality={85}
            priority
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-slate-100 rounded-xl border border-dashed border-slate-200 flex items-center justify-center mb-8">
          <ImageIcon className="h-10 w-10 text-slate-300" />
        </div>
      )}

      {/* Meta header */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest mb-6">
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${style.text}`}>
          <Tag className="h-3.5 w-3.5" />
          {article.type}
        </span>
        <span className="flex items-center gap-1.5 text-text-muted">
          <Calendar className="h-4 w-4 text-slate-400" />
          {new Date(article.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-primary leading-tight mb-6 break-words">
        {article.title}
      </h1>

      {/* Summary / Lead */}
      {article.summary && (
        <div className="bg-slate-50 border-l-4 border-accent p-4 rounded-r-lg mb-8 shadow-sm">
          <p className="text-text-secondary text-sm sm:text-base font-medium leading-relaxed italic break-words">
            {article.summary}
          </p>
        </div>
      )}

      <div className="h-px bg-slate-200 my-8" />

      {/* Main Body Content */}
      <div
        className="text-text-secondary text-sm sm:text-base leading-relaxed prose prose-slate max-w-none mb-12 space-y-6 news-content"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
      />

      {/* Tags & Footer Action */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-slate-200">
          {article.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-semibold text-text-secondary bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded transition-colors"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Footer Share box */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-sm text-primary">Gostou da notícia?</h4>
          <p className="text-text-muted text-xs">Compartilhe esta informação oficial com outros servidores.</p>
        </div>
        <ShareButton />
      </div>

    </article>
  );
}
