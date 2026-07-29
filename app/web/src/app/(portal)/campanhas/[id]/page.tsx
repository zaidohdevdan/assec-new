"use client";

import * as React from "react";
import { apiFetch, apiFetchJson } from "@/lib/api";
import Link from "next/link";

type Status = "PENDENTE" | "CONTATADO" | "CONVERTIDO" | "REJEITADO";

interface Registration {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
  telefone: string;
  orgao?: string;
  matricula?: string;
  status: Status;
  createdAt: string;
  ipAddress?: string;
}

interface Campaign {
  id: string;
  name: string;
  slug: string;
  expiresAt: string;
  active: boolean;
}

interface PageData {
  campaign: Campaign;
  registrations: Registration[];
}

const STATUS_LABELS: Record<Status, string> = {
  PENDENTE: "Pendente",
  CONTATADO: "Contatado",
  CONVERTIDO: "Convertido",
  REJEITADO: "Rejeitado",
};

const STATUS_COLORS: Record<Status, string> = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  CONTATADO: "bg-blue-100 text-blue-700",
  CONVERTIDO: "bg-green-100 text-green-700",
  REJEITADO: "bg-red-100 text-red-700",
};

function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatPhone(tel: string) {
  if (tel.length === 11)
    return tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  return tel.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const [data, setData] = React.useState<PageData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState<Status | "TODOS">("TODOS");
  const [search, setSearch] = React.useState("");
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const result = await apiFetchJson<PageData>(
        `/campaign/admin/${id}/registrations`
      );
      setData(result);
    } catch {
      // handled by null state
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (regId: string, status: Status) => {
    setUpdatingId(regId);
    try {
      await apiFetch(`/campaign/admin/registration/${regId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch {
      alert("Erro ao atualizar status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = () => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    window.open(`${base}/campaign/admin/${id}/export`, "_blank");
  };

  const filtered = React.useMemo(() => {
    if (!data) return [];
    return data.registrations.filter((r) => {
      const matchStatus =
        filterStatus === "TODOS" || r.status === filterStatus;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.nome.toLowerCase().includes(q) ||
        r.cpf.includes(q) ||
        r.telefone.includes(q) ||
        (r.email ?? "").toLowerCase().includes(q) ||
        (r.orgao ?? "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [data, filterStatus, search]);

  const counts = React.useMemo(() => {
    if (!data) return {} as Record<Status | "TODOS", number>;
    const c = { TODOS: data.registrations.length } as Record<Status | "TODOS", number>;
    for (const s of ["PENDENTE", "CONTATADO", "CONVERTIDO", "REJEITADO"] as Status[]) {
      c[s] = data.registrations.filter((r) => r.status === s).length;
    }
    return c;
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/campanhas"
            className="text-xs text-accent-dark font-semibold hover:underline flex items-center gap-1 mb-1"
          >
            ← Campanhas
          </Link>
          <h1 className="font-serif font-bold text-xl text-primary">
            {data?.campaign.name ?? "Carregando..."}
          </h1>
          {data && (
            <p className="text-xs text-text-secondary mt-0.5 font-mono">
              assecce.com.br/campanha/{data.campaign.slug}
            </p>
          )}
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          ↓ Exportar CSV
        </button>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(["TODOS", "PENDENTE", "CONTATADO", "CONVERTIDO", "REJEITADO"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-xl p-3 text-center border transition-all ${
                filterStatus === s
                  ? "border-accent bg-accent/10"
                  : "border-border bg-white hover:bg-gray-50"
              }`}
            >
              <div className="text-2xl font-black text-primary">
                {counts[s] ?? 0}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {s === "TODOS" ? "Total" : STATUS_LABELS[s]}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nome, CPF, telefone ou órgão..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="text-text-secondary text-sm">Nenhum pré-cadastro encontrado.</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  {["Nome", "CPF", "Telefone", "E-mail", "Órgão", "Matrícula", "Cadastrado em", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">
                      {r.nome}
                    </td>
                    <td className="px-4 py-3 font-mono text-text-secondary whitespace-nowrap">
                      {formatCPF(r.cpf)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {formatPhone(r.telefone)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {r.email || <span className="text-border">—</span>}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {r.orgao || <span className="text-border">—</span>}
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-mono text-xs">
                      {r.matricula || <span className="text-border">—</span>}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap text-xs">
                      {new Date(r.createdAt).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        disabled={updatingId === r.id}
                        onChange={(e) =>
                          handleStatusChange(r.id, e.target.value as Status)
                        }
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent/50 ${STATUS_COLORS[r.status]} disabled:opacity-60`}
                      >
                        {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border text-xs text-text-secondary">
            {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
            {filterStatus !== "TODOS" && ` · filtrado por ${STATUS_LABELS[filterStatus]}`}
          </div>
        </div>
      )}
    </div>
  );
}
