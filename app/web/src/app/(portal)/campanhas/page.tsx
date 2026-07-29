"use client";

import * as React from "react";
import { apiFetch, apiFetchJson } from "@/lib/api";

interface Campaign {
  id: string;
  name: string;
  slug: string;
  description?: string;
  expiresAt: string;
  active: boolean;
  maxSubmissions?: number;
  _count: { preRegistrations: number };
}

interface CreateForm {
  name: string;
  slug: string;
  description: string;
  expiresAt: string;
  maxSubmissions: string;
}

export default function AdminCampanhasPage() {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState<CreateForm>({
    name: "",
    slug: "",
    description: "",
    expiresAt: "",
    maxSubmissions: "",
  });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyLink = (slug: string, id: string) => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://assecce.com.br';
    const link = `${base}/campanha/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };


  const loadCampaigns = React.useCallback(async () => {
    try {
      const data = await apiFetchJson<Campaign[]>("/campaign/admin");
      setCampaigns(data);
    } catch {
      // handled by empty state
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFormError(null);
    try {
      await apiFetchJson("/campaign/admin", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description || undefined,
          expiresAt: new Date(form.expiresAt).toISOString(),
          maxSubmissions: form.maxSubmissions
            ? parseInt(form.maxSubmissions)
            : undefined,
        }),
      });
      setShowForm(false);
      setForm({ name: "", slug: "", description: "", expiresAt: "", maxSubmissions: "" });
      await loadCampaigns();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao criar campanha");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await apiFetch(`/campaign/admin/${id}/toggle`, {
        method: "PATCH",
        body: JSON.stringify({ active: !active }),
      });
      await loadCampaigns();
    } catch {
      alert("Erro ao alterar status da campanha");
    }
  };

  const handleExport = (id: string, name: string) => {
    // Abre CSV diretamente via window para forçar download com cookie de sessão
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    window.open(`${base}/campaign/admin/${id}/export`, "_blank");
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-primary">
            Campanhas de Captação
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Gerencie campanhas e visualize pré-cadastros dos potenciais associados.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary font-bold text-sm rounded-lg hover:bg-accent-light transition-colors"
        >
          <span>{showForm ? "✕ Cancelar" : "+ Nova Campanha"}</span>
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif font-bold text-lg text-primary mb-5">
            Nova Campanha
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                  Nome da campanha *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: slugify(name),
                    }));
                  }}
                  placeholder="Ex: Captação WhatsApp 2026"
                  className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                  Slug (URL) *
                </label>
                <input
                  required
                  pattern="^[a-z0-9-]+$"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  placeholder="captacao-2026"
                  className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Link:{" "}
                  <span className="font-mono text-accent-dark">
                    assecce.com.br/campanha/{form.slug || "slug"}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                  Data de expiração *
                </label>
                <input
                  required
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiresAt: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                  Limite de cadastros (opcional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.maxSubmissions}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maxSubmissions: e.target.value }))
                  }
                  placeholder="Ex: 9000 (deixe vazio para sem limite)"
                  className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                  Descrição (opcional)
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Descrição interna para identificação"
                  className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2.5 bg-accent text-primary font-bold text-sm rounded-lg hover:bg-accent-light transition-colors disabled:opacity-60"
              >
                {creating ? "Criando..." : "Criar campanha"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="text-text-secondary text-sm">Nenhuma campanha criada ainda.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-accent-dark text-sm font-semibold underline"
          >
            Criar primeira campanha
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => {
            const expired = isExpired(c.expiresAt);
            const statusLabel = !c.active
              ? "Inativa"
              : expired
              ? "Expirada"
              : "Ativa";
            const statusColor = !c.active
              ? "bg-gray-100 text-gray-600"
              : expired
              ? "bg-orange-100 text-orange-700"
              : "bg-green-100 text-green-700";

            return (
              <div
                key={c.id}
                className="bg-white border border-border rounded-2xl p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-primary">{c.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </div>
                    {c.description && (
                      <p className="text-xs text-text-secondary">{c.description}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`/campanha/${c.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-accent-dark hover:underline flex items-center gap-1"
                      >
                        <span>assecce.com.br/campanha/{c.slug}</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleCopyLink(c.slug, c.id)}
                        className={`text-[10px] px-2 py-0.5 rounded transition-all font-semibold border ${
                          copiedId === c.id
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {copiedId === c.id ? "✓ Copiado!" : "Copiar"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-text-secondary pt-1">
                      <span>
                        <strong className="text-primary">{c._count.preRegistrations}</strong>{" "}
                        pré-cadastros
                        {c.maxSubmissions && ` / ${c.maxSubmissions}`}
                      </span>
                      <span>
                        Expira:{" "}
                        <strong className={expired ? "text-orange-600" : "text-primary"}>
                          {new Date(c.expiresAt).toLocaleString("pt-BR")}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <a
                      href={`/campanhas/${c.id}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Ver cadastros
                    </a>
                    <button
                      onClick={() => handleExport(c.id, c.name)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      ↓ CSV
                    </button>
                    <button
                      onClick={() => handleToggle(c.id, c.active)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        c.active
                          ? "bg-red-50 hover:bg-red-100 text-red-700"
                          : "bg-green-50 hover:bg-green-100 text-green-700"
                      }`}
                    >
                      {c.active ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                {c.maxSubmissions && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-text-secondary mb-1">
                      <span>Progresso</span>
                      <span>
                        {Math.round(
                          (c._count.preRegistrations / c.maxSubmissions) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-yellow-400 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (c._count.preRegistrations / c.maxSubmissions) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
