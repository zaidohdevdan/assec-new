"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Youtube,
  Trash2,
  Plus,
  X,
  Edit3,
  Eye,
  AlertTriangle,
  Play,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  // Expressão regular para obter o ID do vídeo de vários formatos de URL do YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function VideosManagementPage() {
  const [videos, setVideos] = React.useState<VideoItem[]>([]);
  const [listLoading, setListLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Form State
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingVideo, setEditingVideo] = React.useState<VideoItem | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Field State
  const [fTitle, setFTitle] = React.useState("");
  const [fYoutubeUrl, setFYoutubeUrl] = React.useState("");
  const [fActive, setFActive] = React.useState(true);

  const fetchVideos = React.useCallback(async () => {
    setListLoading(true);
    try {
      const res = await apiFetch("/videos?all=true");
      if (res.ok) {
        setVideos(await res.json());
      }
    } catch (err) {
      console.error("Erro ao carregar vídeos:", err);
    } finally {
      setListLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const resetForm = () => {
    setFTitle("");
    setFYoutubeUrl("");
    setFActive(true);
    setSubmitError(null);
  };

  const openNew = () => {
    setEditingVideo(null);
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (video: VideoItem) => {
    setEditingVideo(video);
    setFTitle(video.title);
    setFYoutubeUrl(video.youtubeUrl);
    setFActive(video.active);
    setSubmitError(null);
    setFormOpen(true);
  };

  const cancelForm = () => {
    setEditingVideo(null);
    setFormOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fTitle.trim()) {
      setSubmitError("O título do vídeo é obrigatório.");
      return;
    }

    const videoId = getYouTubeId(fYoutubeUrl);
    if (!videoId) {
      setSubmitError("URL do YouTube inválida. Insira uma URL válida de vídeo ou Shorts do YouTube.");
      return;
    }

    const payload = {
      title: fTitle.trim(),
      youtubeUrl: fYoutubeUrl.trim(),
      active: fActive,
    };

    setFormLoading(true);
    try {
      const url = editingVideo ? `/videos/${editingVideo.id}` : "/videos";
      const method = editingVideo ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        cancelForm();
        await fetchVideos();
      } else {
        const err = await res.json();
        setSubmitError(err?.message ?? "Erro ao salvar o vídeo.");
      }
    } catch {
      setSubmitError("Erro de conexão. Verifique se o servidor backend está ativo.");
    } finally {
      setFormLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) return;
    setListLoading(true);
    try {
      const res = await apiFetch(`/videos/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchVideos();
      } else {
        alert("Erro ao excluir vídeo.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setListLoading(false);
    }
  };

  const videoIdPreview = getYouTubeId(fYoutubeUrl);

  const filtered = videos.filter((v) => {
    const q = searchQuery.toLowerCase();
    return v.title.toLowerCase().includes(q) || v.youtubeUrl.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent-dark text-xs font-bold uppercase tracking-widest mb-1">
            <Youtube className="h-4 w-4" />
            <span>Biblioteca de Vídeos</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
            Gerenciar Vídeos (Shorts)
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Publique e organize vídeos curtos no formato vertical (Shorts) direto na página inicial.
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
          <span>{formOpen ? "Cancelar" : "Adicionar Vídeo"}</span>
        </Button>
      </div>

      {/* FORM SECTION */}
      {formOpen && (
        <Card className="border border-border shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50">
            <div className="flex items-center gap-2.5">
              <Play className="h-5 w-5 text-accent-dark" />
              <h2 className="font-serif font-bold text-lg text-primary">
                {editingVideo ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
              </h2>
            </div>

            {/* Active Toggle */}
            <button
              type="button"
              onClick={() => setFActive((p) => !p)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                fActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {fActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              {fActive ? "Visível na Home" : "Oculto (Rascunho)"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Fields */}
              <div className="lg:col-span-7 space-y-6">
                {submitError && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Input
                    label="Título do Vídeo"
                    placeholder="Ex: Saiba tudo sobre a ASSEC em 1 minuto!"
                    value={fTitle}
                    onChange={(e) => setFTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Input
                    label="URL do Vídeo (YouTube ou Shorts)"
                    placeholder="Ex: https://www.youtube.com/shorts/VIDEO_ID"
                    value={fYoutubeUrl}
                    onChange={(e) => setFYoutubeUrl(e.target.value)}
                    required
                  />
                  <span className="text-xs text-text-secondary">
                    Cole o link completo do vídeo do YouTube. Funciona com links do tipo `/shorts/`, `/watch?v=` ou `youtu.be/`.
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelForm}
                    className="font-bold px-5 border-border"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    loading={formLoading}
                    className="bg-accent text-primary hover:bg-accent-light font-bold px-7"
                  >
                    {editingVideo ? "Salvar Alterações" : "Adicionar Vídeo"}
                  </Button>
                </div>
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-5 flex flex-col items-center p-6 bg-slate-50 border border-border rounded-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-1.5">
                  <Eye className="h-4 w-4" /> Prévia Visual do Player
                </span>

                {videoIdPreview ? (
                  <div className="w-full max-w-[240px] aspect-[9/16] rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-black relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoIdPreview}`}
                      title={fTitle || "YouTube Shorts Preview"}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-[240px] aspect-[9/16] rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-6 text-center text-text-muted">
                    <Youtube className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-xs font-medium">Insira uma URL do YouTube para carregar a prévia vertical</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* SEARCH AND GRID OF VIDEOS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Buscar vídeos por título ou URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            />
          </div>
          <span className="text-xs font-semibold text-text-secondary shrink-0">
            {filtered.length} {filtered.length === 1 ? "vídeo cadastrado" : "vídeos cadastrados"}
          </span>
        </div>

        {listLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent-dark" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center border border-border flex flex-col items-center">
            <Youtube className="h-12 w-12 text-text-muted mb-3" />
            <h3 className="font-serif font-bold text-lg text-primary">Nenhum vídeo encontrado</h3>
            <p className="text-sm text-text-secondary mt-1">
              {searchQuery ? "Experimente alterar o termo de busca." : "Adicione seu primeiro vídeo para começar!"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((video) => {
              const videoId = getYouTubeId(video.youtubeUrl);
              return (
                <Card
                  key={video.id}
                  className={`bg-white border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                    video.active ? "border-border" : "border-slate-200 opacity-75 bg-slate-50/50"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Thumbnail preview */}
                    {videoId ? (
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                            <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 bg-black/75 text-white rounded">
                          Shorts Preview
                        </span>
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-lg bg-slate-100 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            video.active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {video.active ? "Home Ativo" : "Rascunho"}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {new Date(video.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <h3 className="font-bold text-primary text-sm line-clamp-2">{video.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent-dark font-semibold hover:underline flex items-center gap-1"
                    >
                      Ver no YouTube <ExternalLink className="h-3 w-3" />
                    </a>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(video)}
                        className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                        title="Editar vídeo"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(video.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Excluir vídeo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
