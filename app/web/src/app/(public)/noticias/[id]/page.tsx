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

// Fallback Mock Data
const FALLBACK: Article[] = [
  {
    id: "1",
    title: "ASSEC garante nova vitória jurídica para reajuste de benefício",
    summary: "Decisão em segunda instância assegura reajuste integral para associados aposentados.",
    content: "<p>Nossa equipe jurídica obteve parecer favorável em segunda instância que assegura o reajuste integral para os associados aposentados. A decisão protege direitos fundamentais adquiridos por nossos servidores do Ceará.</p><p>A presidência da ASSEC ressaltou que esta ação representa apenas um passo em direção a um conjunto amplo de melhorias estruturais que a atual gestão vem pleiteando junto aos órgãos de previdência estaduais.</p>",
    type: "Jurídico",
    tags: ["jurídico", "benefício", "reajuste"],
    coverImage: null,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Novidades nas reservas da Pousada do Litoral para Julho",
    summary: "Fique atento ao cronograma de abertura das reservas para a alta temporada.",
    content: "<p>Fique atento ao cronograma de abertura das reservas para a alta temporada de férias. Vagas limitadas para garantir o lazer de todos os associados.</p><p>As reservas poderão ser efetuadas via portal do associado a partir do dia 10 do próximo mês. Recomendamos a atualização cadastral prévia para evitar contratempos.</p>",
    type: "Lazer",
    tags: ["pousada", "férias", "reservas"],
    coverImage: null,
    active: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Parceria com nova rede de farmácias oferece até 40% de desconto",
    summary: "Associados contam com descontos especiais em medicamentos de uso contínuo.",
    content: "<p>Agora os associados contam com descontos especiais em medicamentos de uso contínuo em todas as filiais parceiras do estado do Ceará.</p><p>Para usufruir do desconto, basta apresentar a carteira digital de associado ASSEC na recepção de qualquer estabelecimento da rede credenciada no momento da compra.</p>",
    type: "Parcerias",
    tags: ["farmácia", "desconto", "benefícios"],
    coverImage: null,
    active: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "4",
    title: "Assembleia Geral Extraordinária convocada para o dia 15/06",
    summary: "Convocamos todos os membros ativos a participar da votação das atualizações regimentares.",
    content: "<p>Convocamos todos os membros ativos a participarem da discussão e votação das atualizações regimentares. Sua presença é essencial para o bom andamento da associação.</p><p>A reunião ocorrerá na sede administrativa da ASSEC, iniciando em primeira convocação às 09h00 com quórum qualificado, e às 09h30 com qualquer número de presentes.</p>",
    type: "Institucional",
    tags: ["assembleia", "convocação", "institucional"],
    coverImage: null,
    active: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// Helper to fetch single article
async function getArticle(id: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_BASE}/notices/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // server fallback
  }
  return FALLBACK.find((a) => a.id === id) || null;
}

// ─── Metadata Generation ─────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  return {
    title: article ? `${article.title} | Notícias ASSEC` : "Notícia não encontrada",
    description: article?.summary || "Confira o boletim informativo da ASSEC Ceará.",
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

  // ── Render Page ────────────────────────────────────────────────────────────
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans animate-none">
      
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
            sizes="(max-w-4xl) 100vw, 800px"
            className="object-cover"
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
      <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-primary leading-tight mb-6">
        {article.title}
      </h1>

      {/* Summary / Lead */}
      {article.summary && (
        <div className="bg-slate-50 border-l-4 border-accent p-4 rounded-r-lg mb-8 shadow-sm">
          <p className="text-text-secondary text-sm sm:text-base font-medium leading-relaxed italic">
            {article.summary}
          </p>
        </div>
      )}

      <div className="h-px bg-slate-200 my-8" />

      {/* Main Body Content */}
      <div
        className="text-text-secondary text-sm sm:text-base leading-relaxed prose prose-slate max-w-none mb-12 space-y-6"
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
      <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div>
          <h4 className="font-serif font-bold text-sm text-primary">Gostou da notícia?</h4>
          <p className="text-text-muted text-xs">Compartilhe esta informação oficial com outros servidores.</p>
        </div>
        <ShareButton />
      </div>

    </article>
  );
}
