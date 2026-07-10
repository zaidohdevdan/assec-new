"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Eye,
  Newspaper,
  ImageIcon,
  Copy,
  Check,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface NoticeItem {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  type: string;
  tags: string[];
  coverImage: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = ["Institucional", "Jurídico", "Lazer", "Parcerias", "Urgente"] as const;

const categoryColors: Record<string, { pill: string; border: string }> = {
  Institucional: { pill: "bg-slate-100 text-slate-700", border: "border-l-slate-400" },
  Jurídico:      { pill: "bg-amber-50 text-amber-700",  border: "border-l-amber-500" },
  Lazer:         { pill: "bg-emerald-50 text-emerald-700", border: "border-l-emerald-500" },
  Parcerias:     { pill: "bg-blue-50 text-blue-700",    border: "border-l-blue-500" },
  Urgente:       { pill: "bg-red-50 text-red-700",      border: "border-l-red-500" },
};

function getCategoryStyle(type: string) {
  return categoryColors[type] ?? { pill: "bg-slate-100 text-slate-600", border: "border-l-slate-300" };
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s+on\w+="[^"]*"/gi, "")
    .replace(/\s+on\w+='[^']*'/gi, "");
}

function getShareUrl(id: string): string {
  if (typeof window === "undefined") return `/noticias/${id}`;
  return `${window.location.origin}/noticias/${id}`;
}

export default function NoticesReadOnlyPage() {
  const [notices, setNotices] = React.useState<NoticeItem[]>([]);
  const [listLoading, setListLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [selectedNotice, setSelectedNotice] = React.useState<NoticeItem | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const fetchNotices = React.useCallback(async () => {
    setListLoading(true);
    try {
      const res = await apiFetch("/notices?all=true");
      if (res.ok) setNotices(await res.json());
    } catch (err) {
      console.error("Failed to load notices:", err);
    } finally {
      setListLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleShare = async (id: string) => {
    const url = getShareUrl(id);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const filtered = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.summary ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || n.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent-dark text-xs font-bold uppercase tracking-widest mb-1">
          <Newspaper className="h-4 w-4" />
          <span>Supervisão de Comunicados</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
          Notícias e Avisos
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Acompanhe todos os comunicados e notícias publicados ou salvos como rascunho no portal (Apenas Leitura).
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-3">
          <Input
            label=""
            placeholder="Buscar por título ou resumo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <option value="all">Todas as Categorias</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List */}
      <Card className="p-0 overflow-hidden border border-border">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-border text-[11px] font-bold uppercase tracking-widest text-text-muted">
          <span className="w-16">Capa</span>
          <span>Comunicado</span>
          <span className="w-28 text-center">Categoria</span>
          <span className="w-28 text-center">Data</span>
          <span className="w-28 text-right">Ações</span>
        </div>

        {listLoading && notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-text-secondary text-sm gap-2">
            <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <span>Carregando comunicados...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14 flex flex-col items-center gap-3 text-text-secondary text-sm">
            <Newspaper className="h-8 w-8 text-slate-300" />
            <span>Nenhum comunicado encontrado.</span>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((notice) => {
              const style = getCategoryStyle(notice.type);
              const isShared = copiedId === notice.id;

              return (
                <div
                  key={notice.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors border-l-4 ${style.border}`}
                >
                  {/* Cover image */}
                  <div
                    className="shrink-0 w-[88px] overflow-hidden rounded border border-border"
                    style={{ aspectRatio: "16/9" }}
                  >
                    {notice.coverImage ? (
                      <img
                        src={notice.coverImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Title and summary */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.pill}`}>
                        {notice.type}
                      </span>
                      {!notice.active && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-dashed border-slate-300">
                          Rascunho
                        </span>
                      )}
                      {notice.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-[10px] text-text-muted font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <p className="font-semibold text-text-primary text-sm truncate" title={notice.title}>
                      {notice.title}
                    </p>
                    {notice.summary && (
                      <p className="text-xs text-text-muted mt-0.5 truncate">{notice.summary}</p>
                    )}
                    <div className="flex items-center gap-1 text-text-muted text-xs mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(notice.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleShare(notice.id)}
                      title="Copiar link público"
                      className={`group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded border transition-all ${
                        isShared
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-border bg-white text-text-muted hover:text-accent-dark hover:border-accent-dark"
                      }`}
                    >
                      {isShared ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Link
                        </>
                      )}
                    </button>

                    <Button
                      variant="ghost"
                      onClick={() => setSelectedNotice(notice)}
                      className="text-primary hover:text-accent-dark hover:bg-slate-100 p-2 h-auto flex items-center gap-1.5 text-xs font-bold"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Count footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border bg-slate-50 text-xs text-text-muted">
            {filtered.length} comunicado{filtered.length !== 1 ? "s" : ""}
            {filterType !== "all" && ` em ${filterType}`}
            {searchQuery && ` correspondendo a "${searchQuery}"`}
          </div>
        )}
      </Card>

      {/* Read-Only Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-border flex flex-col max-h-[85vh]">
            {/* Modal header */}
            <div className="p-6 border-b border-border bg-slate-50 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-dark">
                  Visualização de Comunicado
                </span>
                <h3 className="font-serif font-bold text-lg text-primary mt-1">
                  {selectedNotice.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-text-secondary hover:text-primary font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {selectedNotice.coverImage && (
                <div className="w-full max-h-64 overflow-hidden rounded-lg border border-border">
                  <img
                    src={selectedNotice.coverImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-gray-100 text-text-secondary px-2.5 py-0.5 rounded font-semibold">
                  Categoria: {selectedNotice.type}
                </span>
                <span className="bg-gray-100 text-text-secondary px-2.5 py-0.5 rounded font-semibold">
                  Data: {new Date(selectedNotice.createdAt).toLocaleDateString("pt-BR")}
                </span>
                {!selectedNotice.active && (
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded font-bold uppercase text-[10px]">
                    Rascunho
                  </span>
                )}
              </div>

              {selectedNotice.summary && (
                <p className="font-semibold text-sm text-text-secondary border-l-4 border-accent pl-3 italic">
                  {selectedNotice.summary}
                </p>
              )}

              <div
                className="news-content prose prose-slate max-w-none text-sm text-text-primary mt-4 border-t border-border pt-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedNotice.content) }}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-slate-50 flex justify-end shrink-0">
              <Button
                onClick={() => setSelectedNotice(null)}
                className="bg-primary text-white hover:bg-primary-light font-bold text-xs uppercase tracking-widest px-5 py-2.5"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
