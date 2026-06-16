"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import {
  Calendar,
  Tag,
  ArrowRight,
  Sparkles,
  Newspaper,
  ShieldAlert,
  Share2,
  Check,
  ImageIcon,
} from "lucide-react";

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
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["Todos", "Institucional", "Jurídico", "Lazer", "Parcerias", "Urgente"];

const categoryStyles: Record<string, { border: string; text: string; dot: string }> = {
  institucional: { border: "border-l-slate-400",   text: "text-slate-700 bg-slate-100",    dot: "bg-slate-400" },
  jurídico:      { border: "border-l-amber-500",   text: "text-amber-700 bg-amber-50",     dot: "bg-amber-500" },
  lazer:         { border: "border-l-emerald-500", text: "text-emerald-700 bg-emerald-50", dot: "bg-emerald-500" },
  parcerias:     { border: "border-l-blue-500",    text: "text-blue-700 bg-blue-50",       dot: "bg-blue-500" },
  urgente:       { border: "border-l-red-500",     text: "text-red-700 bg-red-50",         dot: "bg-red-500" },
};

function getCatStyle(cat: string) {
  return (
    categoryStyles[cat.toLowerCase()] ?? {
      border: "border-l-slate-300",
      text: "text-slate-600 bg-slate-50",
      dot: "bg-slate-300",
    }
  );
}

// ─── Fallback mock data ────────────────────────────────────────────────────────



// ─── Share helper ─────────────────────────────────────────────────────────────

function getShareUrl(id: string): string {
  if (typeof window === "undefined") return `/noticias/${id}`;
  return `${window.location.origin}/noticias/${id}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

function NoticiasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deepLinkId = searchParams.get("id");

  const [activeCategory, setActiveCategory] = React.useState("Todos");
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/notices");
        if (res.ok) {
          const data: Article[] = await res.json();
          setArticles(data);
        }
      } catch (err) {
        console.error("[Noticias] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Deep-link redirect ─────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!deepLinkId || loading) return;
    router.replace(`/noticias/${deepLinkId}`);
  }, [deepLinkId, loading, router]);

  // ── Share ──────────────────────────────────────────────────────────────────

  const handleShare = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getShareUrl(id);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filtered =
    activeCategory === "Todos"
      ? articles
      : articles.filter((a) => a.type.toLowerCase() === activeCategory.toLowerCase());

  const featuredArticle = activeCategory === "Todos" ? filtered[0] ?? null : null;
  const regularArticles = featuredArticle
    ? filtered.slice(1)
    : filtered;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">

      {/* ── Editorial header ─────────────────────────────────────────────────── */}
      <div className="text-center mb-14">
        <div className="flex justify-center items-center gap-2 text-accent-dark uppercase tracking-widest text-xs font-bold mb-3">
          <Newspaper className="h-4 w-4" />
          <span>Informativo ASSEC</span>
        </div>
        <h1 className="font-serif font-bold text-4xl sm:text-5xl text-primary mt-2 leading-tight">
          Notícias e Comunicados
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
          Acompanhe boletins informativos, decisões jurídicas, novas parcerias e editais oficiais da nossa associação.
        </p>
        <div className="h-1 w-20 bg-accent mx-auto mt-6 rounded" />
      </div>

      {/* ── Category filter ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-border pb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${
              activeCategory === cat
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-text-secondary border-border hover:bg-slate-50 hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Loading ───────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary text-sm gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span>Carregando boletins...</span>
        </div>
      )}

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      {!loading && (
        <>
          {/* Featured cover story */}
          {featuredArticle && (
            <div className="mb-12">
              <Card
                className={`border-l-4 ${getCatStyle(featuredArticle.type).border} border border-slate-200 hover:border-slate-300 transition-colors duration-200 bg-white overflow-hidden group`}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Cover image Link */}
                  {featuredArticle.coverImage && (
                    <Link
                      href={`/noticias/${featuredArticle.id}`}
                      className="w-full h-52 lg:w-72 lg:h-auto lg:self-stretch shrink-0 overflow-hidden block relative"
                    >
                      <Image
                        src={featuredArticle.coverImage}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-102"
                        priority
                      />
                    </Link>
                  )}
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${getCatStyle(featuredArticle.type).text}`}>
                          <Tag className="h-3 w-3" />
                          {featuredArticle.type}
                        </span>
                        <span className="flex items-center gap-1 text-text-muted">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(featuredArticle.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                        <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[8px] tracking-widest font-black uppercase flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" />
                          Destaque
                        </span>
                      </div>
                      
                      <Link href={`/noticias/${featuredArticle.id}`} className="block group/title">
                        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-primary mb-3 leading-tight group-hover/title:text-accent-dark transition-colors duration-300">
                          {featuredArticle.title}
                        </h2>
                      </Link>

                      {featuredArticle.summary && (
                        <p className="text-text-secondary text-sm leading-relaxed mb-3">
                          {featuredArticle.summary}
                        </p>
                      )}
                      
                      {/* Tags */}
                      {featuredArticle.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {featuredArticle.tags.map((t) => (
                            <span key={t} className="text-[10px] font-semibold text-text-muted bg-slate-100 px-2 py-0.5 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/noticias/${featuredArticle.id}`}
                        className="inline-flex items-center gap-2 text-accent-dark font-bold hover:text-accent text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded transition-colors"
                      >
                        <span>Ler notícia completa</span>
                        <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 duration-200" />
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleShare(e, featuredArticle.id)}
                        title="Compartilhar link"
                        className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                          copiedId === featuredArticle.id
                            ? "text-emerald-600"
                            : "text-text-muted hover:text-accent-dark"
                        }`}
                      >
                        {copiedId === featuredArticle.id ? (
                          <><Check className="h-3.5 w-3.5" /> Copiado!</>
                        ) : (
                          <><Share2 className="h-3.5 w-3.5" /> Compartilhar</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Regular grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {regularArticles.map((art) => {
              const style = getCatStyle(art.type);
              return (
                <Card
                  key={art.id}
                  className={`flex flex-col border-l-4 ${style.border} border border-slate-200 hover:border-slate-300 transition-colors duration-200 bg-white overflow-hidden group`}
                >
                  {/* Thumbnail Link */}
                  <Link
                    href={`/noticias/${art.id}`}
                    className="w-full overflow-hidden block relative"
                    style={{ aspectRatio: "16/9" }}
                  >
                    {art.coverImage ? (
                      <Image
                        src={art.coverImage}
                        alt={art.title}
                        fill
                        sizes="(max-w-7xl) 33vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-102"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-slate-300" />
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest mb-3">
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${style.text}`}>
                        <Tag className="h-2.5 w-2.5" />
                        {style.text && art.type}
                      </span>
                      <span className="flex items-center gap-1 text-text-muted">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {new Date(art.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>

                    <Link href={`/noticias/${art.id}`} className="block group/title">
                      <h3 className="font-serif font-bold text-base text-primary mb-2 leading-snug group-hover/title:text-accent-dark transition-colors duration-300">
                        {art.title}
                      </h3>
                    </Link>

                    {art.summary && (
                      <p className="text-text-secondary text-xs leading-relaxed mb-3 line-clamp-2">
                        {art.summary}
                      </p>
                    )}
                    
                    {/* Tags */}
                    {art.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {art.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] font-semibold text-text-muted bg-slate-100 px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <Link
                        href={`/noticias/${art.id}`}
                        className="inline-flex items-center gap-1 text-accent-dark font-bold text-xs hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded transition-colors"
                      >
                        <span>Ler matéria</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 duration-200" />
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleShare(e, art.id)}
                        title="Compartilhar link"
                        className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${
                          copiedId === art.id
                            ? "text-emerald-600"
                            : "text-text-muted hover:text-accent-dark"
                        }`}
                      >
                        {copiedId === art.id ? (
                          <><Check className="h-3 w-3" /> Copiado!</>
                        ) : (
                          <><Share2 className="h-3 w-3" /> Compartilhar</>
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Empty state */}
          {articles.length === 0 ? (
            <div className="text-center py-24 bg-white border border-slate-100 rounded-2xl max-w-2xl mx-auto flex flex-col items-center gap-4 shadow-sm px-6">
              <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 animate-pulse">
                <Newspaper className="h-8 w-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-primary mt-2">
                Nenhuma notícia cadastrada
              </h3>
              <p className="text-text-secondary text-sm max-w-md">
                No momento não há comunicados ou informativos publicados. Por favor, fique no aguardo de novas atualizações.
              </p>
            </div>
          ) : (
            filtered.length === 0 && (
              <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-lg max-w-xl mx-auto flex flex-col items-center gap-3 px-4">
                <ShieldAlert className="h-8 w-8 text-slate-400" />
                <span className="text-text-secondary text-sm font-semibold">
                  Nenhuma notícia encontrada para a categoria "{activeCategory}".
                </span>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function NoticiasPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    }>
      <NoticiasContent />
    </React.Suspense>
  );
}
