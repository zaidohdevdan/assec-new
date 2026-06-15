"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { User as UserType } from "@/lib/types";
import { 
  Calendar, 
  Search, 
  Filter, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock 
} from "lucide-react";

interface ScheduleItem {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  info?: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    matricula?: string;
  };
  slot?: {
    professional?: {
      name: string;
      specialty: string;
    };
  };
}

export default function DemandasPage() {
  const [user, setUser] = React.useState<UserType | null>(null);
  const [schedules, setSchedules] = React.useState<ScheduleItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("Todos");
  const [statusFilter, setStatusFilter] = React.useState("Todos");

  React.useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      loadSchedules();
    }
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/schedules/admin/list");
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (err) {
      console.error("Error loading schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "ADMIN";
  const isPresident = user.role === "PRESIDENT";

  if (!isAdmin && !isPresident) {
    return (
      <div className="p-8 text-center text-rose-600 font-semibold">
        Acesso negado. Esta página é exclusiva para a administração e diretoria.
      </div>
    );
  }

  // Categories list extracted from schedules dynamically
  const types = ["Todos", ...Array.from(new Set(schedules.map((s) => s.type)))];

  // Filtering logic
  const filteredSchedules = schedules.filter((sched) => {
    const matchesSearch = 
      sched.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sched.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sched.user.matricula && sched.user.matricula.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === "Todos" || sched.type === typeFilter;
    const matchesStatus = statusFilter === "Todos" || sched.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const total = schedules.length;
  const active = schedules.filter(s => s.status === "Agendado" || s.status === "Confirmado").length;
  const completed = schedules.filter(s => s.status === "Concluído").length;
  const cancelled = schedules.filter(s => s.status === "Cancelado").length;

  return (
    <div className="space-y-8 animate-none">
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
          Relatório de Demandas
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Acompanhe todos os agendamentos de pousadas, consultas jurídicas e demais serviços agendados pelos associados da ASSEC.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Total Geral</span>
            <span className="text-2xl font-extrabold text-primary block mt-1">{loading ? "..." : total}</span>
          </div>
          <div className="p-3 bg-gray-100 text-primary rounded-lg">
            <Calendar className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Ativas / Pendentes</span>
            <span className="text-2xl font-extrabold text-amber-600 block mt-1">{loading ? "..." : active}</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Concluídas</span>
            <span className="text-2xl font-extrabold text-emerald-600 block mt-1">{loading ? "..." : completed}</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Canceladas</span>
            <span className="text-2xl font-extrabold text-rose-600 block mt-1">{loading ? "..." : cancelled}</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <XCircle className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Filter Options & List */}
      <Card className="p-6 bg-white border border-border shadow-sm">
        <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-accent-dark" />
            <h2 className="font-serif font-bold text-lg text-primary">Buscar e Filtrar Demandas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por associado, matrícula ou serviço..."
                className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="Todos">Todos os Serviços</option>
              {types.filter(t => t !== "Todos").map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Agendado">Agendado</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {loading && <div className="text-center py-8 text-text-secondary text-sm">Carregando demandas...</div>}

        {!loading && filteredSchedules.length === 0 && (
          <div className="text-center py-8 text-text-secondary text-sm">Nenhuma demanda atende aos filtros de busca aplicados.</div>
        )}

        {!loading && filteredSchedules.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                  <th className="p-4">Demanda/Serviço</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Associado</th>
                  <th className="p-4">Atendimento</th>
                  <th className="p-4">Data/Hora</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((sched) => (
                  <tr key={sched.id} className="border-b border-border hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-primary">
                      {sched.title}
                      {sched.info && (
                        <span className="block text-[10px] font-normal text-text-muted mt-0.5">
                          {sched.info}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="bg-primary-light/10 text-primary font-semibold px-2 py-0.5 rounded text-[10px]">
                        {sched.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary">{sched.user.name}</span>
                        <span className="text-[10px] text-text-muted">{sched.user.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {sched.slot?.professional ? (
                        <div className="flex flex-col">
                          <span>{sched.slot.professional.name}</span>
                          <span className="text-[9px] text-text-muted">{sched.slot.professional.specialty}</span>
                        </div>
                      ) : (
                        <span className="text-text-muted">Auto-atendimento / Lazer</span>
                      )}
                    </td>
                    <td className="p-4 text-text-secondary">
                      {sched.date} às {sched.time}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        sched.status === "Confirmado" || sched.status === "Concluído"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : sched.status === "Cancelado"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {sched.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
