"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  UserX,
  Eye,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Calendar,
  Layers,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface TimelineItem {
  date: string;
  logged: number;
  anonymous: number;
  total: number;
}

interface TopPageItem {
  path: string;
  total: number;
  logged: number;
  anonymous: number;
}

interface AnalyticsStats {
  period: string;
  totalVisits: number;
  loggedVisits: number;
  anonymousVisits: number;
  uniqueVisitorsEstimate: number;
  uniqueLoggedUsers: number;
  timeline: TimelineItem[];
  topPages: TopPageItem[];
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
    other: number;
  };
}

const PERIODS = [
  { key: "today", label: "Hoje" },
  { key: "7d", label: "Últimos 7 dias" },
  { key: "30d", label: "Últimos 30 dias" },
  { key: "90d", label: "Últimos 90 dias" },
];

export function AdminAnalyticsSection() {
  const [period, setPeriod] = React.useState("30d");
  const [stats, setStats] = React.useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [hoveredDay, setHoveredDay] = React.useState<TimelineItem | null>(null);

  const fetchStats = React.useCallback(async (selectedPeriod: string) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/analytics/stats?period=${selectedPeriod}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Erro ao carregar estatísticas de analytics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStats(period);
  }, [period, fetchStats]);

  const loggedPct =
    stats && stats.totalVisits > 0
      ? Math.round((stats.loggedVisits / stats.totalVisits) * 100)
      : 0;

  const anonPct =
    stats && stats.totalVisits > 0
      ? Math.round((stats.anonymousVisits / stats.totalVisits) * 100)
      : 0;

  // Max value in timeline for scaling chart
  const maxDayTotal = React.useMemo(() => {
    if (!stats || !stats.timeline.length) return 1;
    const max = Math.max(...stats.timeline.map((d) => d.total));
    return max > 0 ? max : 1;
  }, [stats]);

  const maxPageVisits = React.useMemo(() => {
    if (!stats || !stats.topPages.length) return 1;
    const max = Math.max(...stats.topPages.map((p) => p.total));
    return max > 0 ? max : 1;
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Header with period selector & refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-surface/90 backdrop-blur-md p-4 rounded-xl border border-border-default/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              Métricas de Visitas no Portal
            </h2>
            <p className="text-xs text-text-muted">
              Acompanhamento detalhado de acessos: Usuários Logados vs. Visitantes Anônimos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex bg-bg-card p-1 rounded-lg border border-border-default/60">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  period === p.key
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-hover"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStats(period)}
            disabled={loading}
            className="h-9 px-3 border-border-default"
            title="Atualizar dados agora"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Visits */}
        <Card className="p-5 bg-gradient-to-br from-bg-surface to-bg-card border-border-default/80 shadow-sm hover:border-brand-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Total de Visitas
            </span>
            <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-text-primary tracking-tight">
              {loading ? "..." : stats?.totalVisits.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-text-muted/70" />
              Visualizações de páginas no período
            </p>
          </div>
        </Card>

        {/* Logged-in Users */}
        <Card className="p-5 bg-gradient-to-br from-bg-surface to-emerald-500/5 border-emerald-500/20 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Usuários Logados
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {loading ? "..." : stats?.loggedVisits.toLocaleString("pt-BR")}
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {loggedPct}%
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              {stats?.uniqueLoggedUsers ?? 0} associados distintos logados
            </p>
          </div>
        </Card>

        {/* Anonymous Visitors */}
        <Card className="p-5 bg-gradient-to-br from-bg-surface to-blue-500/5 border-blue-500/20 shadow-sm hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Visitantes Não Logados
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                {loading ? "..." : stats?.anonymousVisits.toLocaleString("pt-BR")}
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {anonPct}%
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Público externo e associados deslogados
            </p>
          </div>
        </Card>

        {/* Unique Visitors Estimate */}
        <Card className="p-5 bg-gradient-to-br from-bg-surface to-purple-500/5 border-purple-500/20 shadow-sm hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Visitantes Únicos (Est.)
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
              {loading ? "..." : stats?.uniqueVisitorsEstimate.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-text-muted mt-1">
              Identificados de forma anônima (LGPD)
            </p>
          </div>
        </Card>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart (2 cols) */}
        <Card className="lg:col-span-2 p-5 bg-bg-surface border-border-default/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-primary" />
                  Evolução Temporal de Acessos
                </h3>
                <p className="text-xs text-text-muted">
                  Comparação diária entre visitas logadas e não logadas
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                  <span className="text-text-primary">Logados</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
                  <span className="text-text-primary">Não Logados</span>
                </div>
              </div>
            </div>

            {/* Hover Tooltip / Live Inspector */}
            <div className="h-6 mb-2">
              {hoveredDay ? (
                <div className="text-xs font-medium text-text-primary bg-bg-card px-2.5 py-1 rounded-md border border-border-default inline-flex items-center gap-3 animate-in fade-in duration-150">
                  <span className="font-semibold text-text-muted">
                    {new Date(hoveredDay.date + "T00:00:00").toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Logados: {hoveredDay.logged}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    Anônimos: {hoveredDay.anonymous}
                  </span>
                  <span className="font-bold">Total: {hoveredDay.total}</span>
                </div>
              ) : (
                <div className="text-xs text-text-muted/80 italic">
                  Passe o mouse sobre as barras para inspecionar cada dia.
                </div>
              )}
            </div>

            {/* Bar Chart Container */}
            <div className="relative h-48 w-full mt-2 pt-4 border-b border-border-default/60 flex items-end gap-1.5 sm:gap-2">
              {stats?.timeline && stats.timeline.length > 0 ? (
                stats.timeline.map((day) => {
                  const loggedHeight =
                    day.total > 0
                      ? Math.round((day.logged / maxDayTotal) * 140)
                      : 0;
                  const anonHeight =
                    day.total > 0
                      ? Math.round((day.anonymous / maxDayTotal) * 140)
                      : 0;

                  return (
                    <div
                      key={day.date}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                    >
                      {/* Stacked bar */}
                      <div className="w-full max-w-[20px] flex flex-col justify-end rounded-t overflow-hidden bg-bg-hover group-hover:brightness-110 transition-all">
                        {anonHeight > 0 && (
                          <div
                            style={{ height: `${anonHeight}px` }}
                            className="w-full bg-blue-500/80 group-hover:bg-blue-500 transition-all"
                          />
                        )}
                        {loggedHeight > 0 && (
                          <div
                            style={{ height: `${loggedHeight}px` }}
                            className="w-full bg-emerald-500/80 group-hover:bg-emerald-500 transition-all"
                          />
                        )}
                        {day.total === 0 && (
                          <div className="w-full h-1 bg-border-default/50" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-text-muted">
                  Nenhum registro no período selecionado.
                </div>
              )}
            </div>

            {/* Date timeline axis */}
            <div className="flex justify-between text-[10px] text-text-muted mt-2 font-mono">
              {stats?.timeline && stats.timeline.length > 0 && (
                <>
                  <span>
                    {new Date(
                      stats.timeline[0].date + "T00:00:00"
                    ).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                  <span>
                    {new Date(
                      stats.timeline[Math.floor(stats.timeline.length / 2)].date +
                        "T00:00:00"
                    ).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                  <span>
                    {new Date(
                      stats.timeline[stats.timeline.length - 1].date + "T00:00:00"
                    ).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Device & Technology Breakdown (1 col) */}
        <Card className="p-5 bg-bg-surface border-border-default/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-brand-primary" />
              Dispositivos dos Usuários
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Perfil de telas e navegadores de quem acessa
            </p>

            <div className="space-y-4">
              {/* Mobile */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-text-primary">
                    <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                    Smartphones (Mobile)
                  </span>
                  <span className="text-text-muted font-mono">
                    {stats?.deviceBreakdown?.mobile || 0} visitas
                  </span>
                </div>
                <div className="w-full bg-bg-card rounded-full h-2 overflow-hidden border border-border-default/40">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        stats && stats.totalVisits > 0
                          ? Math.round(
                              (stats.deviceBreakdown.mobile / stats.totalVisits) * 100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Desktop */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-text-primary">
                    <Monitor className="w-3.5 h-3.5 text-emerald-500" />
                    Computadores (Desktop)
                  </span>
                  <span className="text-text-muted font-mono">
                    {stats?.deviceBreakdown?.desktop || 0} visitas
                  </span>
                </div>
                <div className="w-full bg-bg-card rounded-full h-2 overflow-hidden border border-border-default/40">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        stats && stats.totalVisits > 0
                          ? Math.round(
                              (stats.deviceBreakdown.desktop / stats.totalVisits) * 100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Tablet */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-text-primary">
                    <Tablet className="w-3.5 h-3.5 text-purple-500" />
                    Tablets
                  </span>
                  <span className="text-text-muted font-mono">
                    {stats?.deviceBreakdown?.tablet || 0} visitas
                  </span>
                </div>
                <div className="w-full bg-bg-card rounded-full h-2 overflow-hidden border border-border-default/40">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        stats && stats.totalVisits > 0
                          ? Math.round(
                              (stats.deviceBreakdown.tablet / stats.totalVisits) * 100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-lg bg-bg-card border border-border-default/60 text-xs text-text-muted">
            <span className="font-semibold text-text-primary block mb-0.5">
              Privacidade Garantida:
            </span>
            Em conformidade com a LGPD, os IPs são convertidos em hashes rotativos e dados de sessões anônimas não identificam pessoalmente os visitantes.
          </div>
        </Card>
      </div>

      {/* Top Visited Pages Table */}
      <Card className="p-5 bg-bg-surface border-border-default/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Páginas Mais Acessadas
            </h3>
            <p className="text-xs text-text-muted">
              Ranking de rotas mais visualizadas com proporção entre públicos
            </p>
          </div>
        </div>

        {stats?.topPages && stats.topPages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-default text-text-muted uppercase text-[11px] font-bold">
                  <th className="pb-3 pl-2">Página / Rota</th>
                  <th className="pb-3 text-center">Logados</th>
                  <th className="pb-3 text-center">Não Logados</th>
                  <th className="pb-3 text-right pr-2">Total de Visitas</th>
                  <th className="pb-3 pl-4 min-w-[140px]">Distribuição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/50">
                {stats.topPages.map((page, idx) => {
                  const loggedBarPct =
                    page.total > 0
                      ? Math.round((page.logged / page.total) * 100)
                      : 0;

                  return (
                    <tr
                      key={page.path}
                      className="hover:bg-bg-hover/60 transition-colors"
                    >
                      <td className="py-3 pl-2 font-mono font-medium text-text-primary flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-bg-card border border-border-default flex items-center justify-center text-[10px] font-bold text-text-muted">
                          {idx + 1}
                        </span>
                        <span className="truncate max-w-xs sm:max-w-md" title={page.path}>
                          {page.path === "/" ? "/ (Início)" : page.path}
                        </span>
                      </td>

                      <td className="py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        {page.logged.toLocaleString("pt-BR")}
                      </td>

                      <td className="py-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                        {page.anonymous.toLocaleString("pt-BR")}
                      </td>

                      <td className="py-3 text-right pr-2 font-black text-text-primary">
                        {page.total.toLocaleString("pt-BR")}
                      </td>

                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-blue-500/20 rounded-full h-2 overflow-hidden flex">
                            <div
                              style={{ width: `${loggedBarPct}%` }}
                              className="bg-emerald-500 h-full"
                              title={`Logados: ${loggedBarPct}%`}
                            />
                            <div
                              style={{ width: `${100 - loggedBarPct}%` }}
                              className="bg-blue-500 h-full"
                              title={`Anônimos: ${100 - loggedBarPct}%`}
                            />
                          </div>
                          <span className="text-[10px] text-text-muted font-mono w-10 text-right">
                            {Math.round((page.total / maxPageVisits) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-text-muted">
            Nenhuma página registrada no período.
          </div>
        )}
      </Card>
    </div>
  );
}
