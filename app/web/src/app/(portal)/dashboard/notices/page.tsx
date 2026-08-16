"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  Calendar,
  Trash2,
  Plus,
  X,
  Edit3,
  ImageIcon,
  Share2,
  Copy,
  Check,
  Tag,
  Eye,
  FileText,
  Upload,
  Globe,
  ToggleLeft,
  ToggleRight,
  Newspaper,
  AlertTriangle,
  AlignLeft,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NoticesManagementPage() {
  // ── List state ──────────────────────────────────────────────────────────────
  const [notices, setNotices] = React.useState<NoticeItem[]>([]);
  const [listLoading, setListLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");

  // ── Form state ──────────────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingNotice, setEditingNotice] = React.useState<NoticeItem | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // ── Field state ─────────────────────────────────────────────────────────────
  const [fTitle, setFTitle] = React.useState("");
  const [fSummary, setFSummary] = React.useState("");
  const [fCategory, setFCategory] = React.useState<string>("Institucional");
  const [fTags, setFTags] = React.useState<string[]>([]);
  const [fTagInput, setFTagInput] = React.useState("");
  const [fCoverImage, setFCoverImage] = React.useState("");
  const [fImageUrlInput, setFImageUrlInput] = React.useState("");
  const [fImageMode, setFImageMode] = React.useState<"url" | "upload">("url");
  const [fActive, setFActive] = React.useState(true);

  // ── Editor (Tiptap) ─────────────────────────────────────────────────────────
  const [editorHtml, setEditorHtml] = React.useState("");
  const [previewMode, setPreviewMode] = React.useState(false);

  // ── Share ───────────────────────────────────────────────────────────────────
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // ── API Calls ───────────────────────────────────────────────────────────────

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

  React.useEffect(() => { fetchNotices(); }, [fetchNotices]);

  // ── Form helpers ────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFTitle(""); setFSummary(""); setFCategory("Institucional");
    setFTags([]); setFTagInput(""); setFCoverImage("");
    setFImageUrlInput(""); setFActive(true); setSubmitError(null);
    setPreviewMode(false);
    setEditorHtml("");
  };

  const openNew = () => {
    setEditingNotice(null);
    resetForm();
    setFormOpen(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const openEdit = (n: NoticeItem) => {
    setEditingNotice(n);
    setFTitle(n.title);
    setFSummary(n.summary ?? "");
    setFCategory(n.type);
    setFTags(n.tags ?? []);
    setFCoverImage(n.coverImage ?? "");
    setFImageUrlInput(n.coverImage ?? "");
    setFActive(n.active);
    setSubmitError(null);
    setPreviewMode(false);
    setEditorHtml(n.content);
    setFormOpen(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const cancelForm = () => {
    setEditingNotice(null);
    setFormOpen(false);
    resetForm();
  };

  // ── Tags ────────────────────────────────────────────────────────────────────

  const commitTag = () => {
    const t = fTagInput.trim().toLowerCase().replace(/[\s,]+/g, "-");
    if (t && !fTags.includes(t)) setFTags((p) => [...p, t]);
    setFTagInput("");
  };

  const removeTag = (t: string) => setFTags((p) => p.filter((x) => x !== t));

  // ── Image ───────────────────────────────────────────────────────────────────

  /**
   * Redimensiona e recorta a imagem para proporção 16:9 (1280×720 px) usando
   * Canvas API. O crop é centralizado — a imagem nunca fica distorcida.
   * Retorna uma string base64 (image/webp ou jpeg, qualidade 0.75).
   */
  const normalizeImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const TARGET_W = 1280;
      const TARGET_H = 720; // 16:9

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        const srcW = img.naturalWidth;
        const srcH = img.naturalHeight;

        const srcRatio = srcW / srcH;
        const tgtRatio = TARGET_W / TARGET_H;

        let cropW: number, cropH: number, cropX: number, cropY: number;

        if (srcRatio > tgtRatio) {
          cropH = srcH;
          cropW = Math.round(srcH * tgtRatio);
          cropX = Math.round((srcW - cropW) / 2);
          cropY = 0;
        } else {
          cropW = srcW;
          cropH = Math.round(srcW / tgtRatio);
          cropX = 0;
          cropY = Math.round((srcH - cropH) / 2);
        }

        const canvas = document.createElement("canvas");
        canvas.width = TARGET_W;
        canvas.height = TARGET_H;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas não suportado")); return; }

        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, TARGET_W, TARGET_H);

        let finalFormat = "image/webp";
        try {
          const testCanvas = document.createElement("canvas");
          if (!testCanvas.toDataURL("image/webp").startsWith("data:image/webp")) {
            finalFormat = "image/jpeg";
          }
        } catch {
          finalFormat = "image/jpeg";
        }

        resolve(canvas.toDataURL(finalFormat, 0.75));
      };

      img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Falha ao carregar imagem")); };
      img.src = objectUrl;
    });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const b64 = await normalizeImage(file);
      setFCoverImage(b64);
      setFImageUrlInput("");
    } catch (err) {
      console.error("Falha ao processar imagem:", err);
      setSubmitError("Não foi possível processar a imagem. Tente outro arquivo.");
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fTitle.trim()) { setSubmitError("O título é obrigatório."); return; }
    if (!editorHtml || editorHtml === "<p></p>" || editorHtml.trim() === "") {
      setSubmitError("O conteúdo não pode estar vazio.");
      return;
    }

    const payload = {
      title: fTitle.trim(),
      summary: fSummary.trim() || null,
      content: sanitizeHtml(editorHtml),
      type: fCategory,
      tags: fTags,
      coverImage: fCoverImage || null,
      active: fActive,
    };

    setFormLoading(true);
    setSubmitError(null);

    try {
      const url = editingNotice ? `/notices/${editingNotice.id}` : "/notices";
      const method = editingNotice ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        cancelForm();
        await fetchNotices();
      } else {
        const err = await res.json();
        setSubmitError(err?.message ?? "Erro ao salvar comunicado.");
      }
    } catch {
      setSubmitError("Erro de conexão. Verifique se o servidor backend está ativo.");
    } finally {
      setFormLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este comunicado?")) return;
    setListLoading(true);
    try {
      await apiFetch(`/notices/${id}`, { method: "DELETE" });
      await fetchNotices();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setListLoading(false);
    }
  };

  const handleShare = async (id: string) => {
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

  // ── Filter ──────────────────────────────────────────────────────────────────

  const filtered = notices.filter((n) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      n.title.toLowerCase().includes(q) ||
      (n.summary ?? "").toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q));
    const matchCat = filterType === "all" || n.type === filterType;
    return matchSearch && matchCat;
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-none">

      {/* ── Page header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent-dark text-xs font-bold uppercase tracking-widest mb-1">
            <Newspaper className="h-4 w-4" />
            <span>Portal de Comunicados</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
            Gerenciar Avisos e Notícias
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Publique comunicados com editor rico, imagens, tags e compartilhamento direto.
          </p>
        </div>
        <Button
          onClick={formOpen ? cancelForm : openNew}
          className={`font-bold flex items-center gap-2 shrink-0 animate-none ${
            formOpen
              ? "bg-slate-100 text-text-primary hover:bg-slate-200 border border-border"
              : "bg-accent text-primary hover:bg-accent-light"
          }`}
        >
          {formOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{formOpen ? "Cancelar" : "Novo Comunicado"}</span>
        </Button>
      </div>

      {/* ── FORM ──────────────────────────────────────────────────────────────── */}
      {formOpen && (
        <Card className="border border-border shadow-lg overflow-hidden">

          {/* Form top bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-slate-50">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="h-5 w-5 text-accent-dark shrink-0" />
              <h2 className="font-serif font-bold text-lg text-primary truncate">
                {editingNotice ? "Editar Comunicado" : "Novo Comunicado"}
              </h2>
              {editingNotice && (
                <span className="hidden sm:block text-xs text-text-muted truncate max-w-[200px]">
                  — {editingNotice.title}
                </span>
              )}
            </div>

            {/* Draft / Publish toggle */}
            <button
              type="button"
              onClick={() => setFActive((p) => !p)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all shrink-0 ${
                fActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {fActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              {fActive ? "Publicar" : "Rascunho"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">

            {/* Error banner */}
            {submitError && (
              <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700" role="alert">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* ── Title + Category ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2">
                <Input
                  label="Título do Comunicado"
                  placeholder="Ex: Assembleia Geral convocada para 15 de junho"
                  value={fTitle}
                  onChange={(e) => setFTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-primary">Categoria</label>
                <select
                  value={fCategory}
                  onChange={(e) => setFCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Summary (lead / chapéu) ───────────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">
                Resumo / Subtítulo
                <span className="ml-2 text-xs font-normal text-text-muted">(opcional — aparece como lead no portal)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Uma frase objetiva resumindo o comunicado..."
                value={fSummary}
                onChange={(e) => setFSummary(e.target.value)}
                className="flex w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus resize-none"
              />
            </div>

            {/* ── Tags ─────────────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-accent-dark" />
                Tags
                <span className="text-xs font-normal text-text-muted">(Enter ou vírgula para confirmar)</span>
              </label>
              <div className="flex flex-wrap gap-2 min-h-[42px] p-2 rounded-md border border-border bg-bg-surface focus-within:ring-2 focus-within:ring-border-focus cursor-text">
                {fTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="ml-0.5 hover:text-red-600 transition-colors focus-visible:outline-none"
                      aria-label={`Remover tag ${t}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={fTagInput}
                  onChange={(e) => setFTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commitTag(); }
                  }}
                  onBlur={commitTag}
                  placeholder={fTags.length === 0 ? "urgente, convocação, jurídico..." : ""}
                  className="flex-1 min-w-[120px] text-sm bg-transparent outline-none text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>

            {/* ── Cover image ───────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-accent-dark" />
                Imagem de Capa
              </label>

              {/* Mode tabs */}
              <div className="flex gap-2 mb-1">
                {(["url", "upload"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFImageMode(m)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded border transition-colors ${
                      fImageMode === m
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-text-secondary border-border hover:bg-slate-50"
                    }`}
                  >
                    {m === "url" ? <Globe className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
                    {m === "url" ? "URL externa" : "Upload de arquivo"}
                  </button>
                ))}
              </div>

              {fImageMode === "url" ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={fImageUrlInput}
                    onChange={(e) => setFImageUrlInput(e.target.value)}
                    className="flex-1 h-10 rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFCoverImage(fImageUrlInput.trim())}
                      className="flex-1 sm:flex-none bg-primary text-white font-bold text-xs px-4 h-10 rounded-md hover:bg-primary-light transition-colors"
                    >
                      Usar como capa
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center gap-4 cursor-pointer border-2 border-dashed border-border rounded-md p-5 hover:bg-slate-50 transition-colors">
                  <Upload className="h-7 w-7 text-text-muted shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Clique para selecionar arquivo</p>
                    <p className="text-xs text-text-muted mt-0.5">PNG, JPG, WebP, GIF — máx. recomendado: 2 MB</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}

              {/* Cover preview — always 16:9 */}
              {fCoverImage && (
                <div className="relative mt-1 group w-full overflow-hidden rounded-md border border-border" style={{ aspectRatio: "16/9" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fCoverImage}
                    alt="Prévia da capa"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => { setFCoverImage(""); setFImageUrlInput(""); }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="Remover imagem de capa"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    Capa
                  </span>
                </div>
              )}
            </div>

            {/* ── Rich Text Editor (Tiptap) ──────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <AlignLeft className="h-3.5 w-3.5 text-accent-dark" />
                  Corpo da Notícia
                </label>
                <button
                  type="button"
                  onClick={() => setPreviewMode((p) => !p)}
                  className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary border border-border rounded px-2.5 py-1 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {previewMode ? "Editar" : "Prévia"}
                </button>
              </div>

              {!previewMode ? (
                <RichTextEditor
                  value={editorHtml}
                  onChange={setEditorHtml}
                  minHeight={280}
                />
              ) : (
                <div
                  className="min-h-[280px] px-5 py-4 border border-border rounded-md bg-slate-50 news-content prose prose-sm max-w-none text-text-primary text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(editorHtml) }}
                />
              )}

              <p className="text-[11px] text-text-muted flex flex-wrap gap-x-4 gap-y-1">
                <span><kbd className="bg-slate-100 px-1 rounded font-mono">Ctrl+B</kbd> Negrito</span>
                <span><kbd className="bg-slate-100 px-1 rounded font-mono">Ctrl+I</kbd> Itálico</span>
                <span><kbd className="bg-slate-100 px-1 rounded font-mono">Ctrl+Z</kbd> Desfazer</span>
                <span><kbd className="bg-slate-100 px-1 rounded font-mono">Ctrl+K</kbd> Link</span>
              </p>
            </div>

            {/* ── Form footer ───────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-3 border-t border-border">
              <p className="text-xs text-text-muted">
                {fActive
                  ? "✅ Este comunicado será visível publicamente no portal."
                  : "📝 Este comunicado ficará como rascunho (não visível no portal)."}
              </p>
              <div className="flex gap-3">
                {editingNotice && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelForm}
                    className="font-bold px-5 border-border"
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  type="submit"
                  loading={formLoading}
                  className="bg-accent text-primary hover:bg-accent-light font-bold px-7 animate-none"
                >
                  {editingNotice
                    ? "Salvar Alterações"
                    : fActive
                    ? "Publicar Comunicado"
                    : "Salvar Rascunho"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* ── Search & Filter ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-border">
        <div className="w-full sm:max-w-md relative">
          <input
            type="text"
            placeholder="Buscar por título, resumo, conteúdo ou tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          />
        </div>
        <div className="w-full sm:max-w-xs flex gap-2 items-center justify-end">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider shrink-0">
            Categoria:
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <option value="all">Todas</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Notices list ───────────────────────────────────────────────────────── */}
      <Card className="p-0 overflow-hidden border border-border">
        {/* Table header — visible on sm+ */}
        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-border text-[11px] font-bold uppercase tracking-widest text-text-muted">
          <span className="w-20">Capa</span>
          <span>Comunicado</span>
          <span className="w-28 text-center">Categoria</span>
          <span className="w-28 text-center">Data</span>
          <span className="w-36 text-right">Ações</span>
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
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-4 hover:bg-slate-50/60 transition-colors border-l-4 ${style.border}`}
                >
                  {/* ── Cover thumbnail ──────────────────────────────────────────
                      Mobile: full-width 16:9 card above content
                      Desktop (sm+): small 96px thumbnail on the left
                  */}
                  <div
                    className={`
                      overflow-hidden rounded border border-border shrink-0
                      w-full sm:w-24
                    `}
                    style={{ aspectRatio: "16/9" }}
                  >
                    {notice.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
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

                  {/* Content */}
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
                      {notice.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] text-text-muted font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <p className="font-semibold text-text-primary text-sm truncate" title={notice.title}>
                      {notice.title}
                    </p>
                    {notice.summary && (
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{notice.summary}</p>
                    )}
                    <div className="flex items-center gap-1 text-text-muted text-xs mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(notice.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                    {/* Share */}
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
                        <><Check className="h-3.5 w-3.5" /> Copiado!</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /><Share2 className="h-3 w-3" /> Link</>
                      )}
                    </button>

                    {/* Edit */}
                    <Button
                      variant="ghost"
                      onClick={() => openEdit(notice)}
                      className="text-primary hover:text-accent-dark hover:bg-slate-100 p-2 h-auto"
                      title="Editar"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      onClick={() => onDelete(notice.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
