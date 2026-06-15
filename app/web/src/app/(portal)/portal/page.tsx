"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, User, ShieldCheck, Clock, PlusCircle, ArrowRight, TrendingUp, TrendingDown, Users, Scale, DollarSign, Activity } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { User as UserType, ScheduleSlot, FinancialStats, MonthlyStats } from "@/lib/types";

interface ScheduleItem {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  info?: string;
  status: string;
  createdAt: string;
}

export default function PortalPage() {
  const [user, setUser] = React.useState<UserType | null>(null);
  const [schedules, setSchedules] = React.useState<ScheduleItem[]>([]);
  const [slots, setSlots] = React.useState<ScheduleSlot[]>([]);
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [finStats, setFinStats] = React.useState<FinancialStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);

      const fetchData = async () => {
        try {
          if (parsedUser.role === "ADMIN") {
            const res = await apiFetch("/users");
            if (res.ok) {
              const data = await res.json();
              setUsers(data);
            }
          } else if (parsedUser.role === "PRESIDENT") {
            const resUsers = await apiFetch("/users");
            if (resUsers.ok) {
              const uData = await resUsers.json();
              setUsers(uData);
            }
            const resScheds = await apiFetch("/schedules/admin/list");
            if (resScheds.ok) {
              const sData = await resScheds.json();
              setSchedules(sData);
            }
            const resFin = await apiFetch("/financials/stats");
            if (resFin.ok) {
              const fData = await resFin.json();
              setFinStats(fData);
            }
          } else if (parsedUser.role === "PROFESSIONAL") {
            const res = await apiFetch("/slots");
            if (res.ok) {
              const data = await res.json();
              setSlots(data);
            }
          } else {
            const res = await apiFetch("/schedules");
            if (res.ok) {
              const data = await res.json();
              setSchedules(data);
            }
          }
        } catch (err) {
          console.error("Error fetching portal data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const handleProfileUpdate = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {
          console.error("Failed to parse user profile update:", e);
        }
      }
    };

    window.addEventListener("user-profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("user-profile-updated", handleProfileUpdate);
    };
  }, []);

  if (!user) {
    return null;
  }

  // --- Admin Dashboard Render ---
  if (user.role === "ADMIN") {
    const totalUsers = users.length;
    const associates = users.filter((u) => u.role === "USER").length;
    const professionals = users.filter((u) => u.role === "PROFESSIONAL").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;

    // Last 5 registered users
    const recentUsers = [...users]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);

    return (
      <div className="space-y-8 animate-none">
        {/* Welcome Hero for Admin */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 sm:p-8 rounded-xl text-white shadow-lg relative overflow-hidden border border-slate-700">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <ShieldCheck className="h-64 w-64 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="bg-accent text-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Controle Root do Sistema
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl mt-3">
                Olá, {user.name}!
              </h1>
              <p className="text-sm text-gray-300 mt-2 max-w-xl">
                Você possui controle administrativo total. Gerencie associados, credencie profissionais, modifique privilégios e supervisione as contas ativas na associação.
              </p>
            </div>
            <Link href="/portal/usuarios">
              <Button className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-5 py-3 shadow border-none">
                <User className="h-4 w-4 mr-2" />
                Gerenciar Usuários
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 flex items-center gap-4 bg-white shadow-sm border border-gray-100">
            <div className="p-3.5 bg-primary/10 text-primary rounded-xl">
              <User className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Total de Usuários</span>
              <h3 className="text-2xl font-bold text-primary mt-0.5">{totalUsers}</h3>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-4 bg-white shadow-sm border border-gray-100">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Associados</span>
              <h3 className="text-2xl font-bold text-emerald-700 mt-0.5">{associates}</h3>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-4 bg-white shadow-sm border border-gray-100">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
              <User className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Profissionais</span>
              <h3 className="text-2xl font-bold text-blue-700 mt-0.5">{professionals}</h3>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-4 bg-white shadow-sm border border-gray-100">
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Administradores</span>
              <h3 className="text-2xl font-bold text-amber-700 mt-0.5">{admins}</h3>
            </div>
          </Card>
        </div>

        {/* Recently Registered Users */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2 bg-white shadow-sm border border-gray-100">
            <h2 className="font-serif font-bold text-lg text-primary border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-accent-dark" />
              <span>Usuários Registrados Recentemente</span>
            </h2>

            {loading ? (
              <div className="py-12 text-center text-xs text-text-muted">
                Buscando usuários...
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="py-12 text-center text-sm text-text-secondary">
                Nenhum usuário cadastrado no sistema.
              </div>
            ) : (
              <div className="mt-4 divide-y divide-gray-100">
                {recentUsers.map((u) => (
                  <div key={u.id} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-primary">{u.name}</p>
                      <p className="text-xs text-text-secondary">{u.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                        u.role === "ADMIN"
                          ? "bg-slate-100 text-slate-800 border-slate-200"
                          : u.role === "PROFESSIONAL"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {u.role}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {u.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Shortcuts */}
          <Card className="p-6 col-span-1 bg-white shadow-sm border border-gray-100">
            <h2 className="font-serif font-bold text-lg text-primary border-b border-gray-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent-dark" />
              <span>Atalhos Rápidos</span>
            </h2>
            <div className="mt-4 space-y-4">
              <Link href="/portal/usuarios" className="block p-3 border border-border rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                <p className="font-bold text-xs text-primary uppercase tracking-wider">Cadastro de Profissional</p>
                <p className="text-xs text-text-secondary mt-1">Cadastrar e credenciar novos especialistas de serviços.</p>
              </Link>
              <Link href="/portal/usuarios" className="block p-3 border border-border rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                <p className="font-bold text-xs text-primary uppercase tracking-wider">Gestão Geral</p>
                <p className="text-xs text-text-secondary mt-1">Alterar papéis, e-mails ou senhas dos membros da associação.</p>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // --- President Dashboard Render ---
  if (user.role === "PRESIDENT") {
    const associates = users.filter((u) => u.role === "USER").length;
    
    const recentSchedules = [...schedules]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 4);

    return (
      <div className="space-y-8 animate-none">
        {/* Welcome Hero for President */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 sm:p-8 rounded-xl text-white shadow-lg relative overflow-hidden border border-slate-700">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <ShieldCheck className="h-64 w-64 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="bg-accent text-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Painel da Diretoria Executiva
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl mt-3">
                Olá, {user.name}!
              </h1>
              <p className="text-sm text-gray-300 mt-2 max-w-xl">
                Acompanhe o crescimento dos associados, a estatística de demandas e a prestação de contas financeiras consolidadas da organização.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/portal/financas">
                <Button className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-5 py-3 shadow border-none">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ver Finanças
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-center gap-4 p-6 bg-white border border-border shadow-sm">
            <div className="p-4 bg-primary text-accent rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-primary block">
                {loading ? "..." : associates}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Associados Ativos
              </span>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-6 bg-white border border-border shadow-sm">
            <div className="p-4 bg-primary text-accent rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-primary block">
                {loading ? "..." : schedules.length}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Demandas Totais
              </span>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-6 bg-white border border-border shadow-sm">
            <div className="p-4 bg-primary text-accent rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-primary block">
                {loading ? "..." : finStats ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finStats.balance) : "R$ 0,00"}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Balanço Geral em Caixa
              </span>
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Cash Flow */}
          <Card className="p-6 bg-white border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent-dark" />
                <span>Fluxo Financeiro Recente</span>
              </h2>
              <Link href="/portal/financas" className="text-xs font-bold text-accent-dark hover:underline flex items-center gap-1">
                <span>Ver fluxo completo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loading && <div className="text-sm text-text-secondary">Carregando dados financeiros...</div>}
            
            {!loading && (!finStats || finStats.balance === 0) && (
              <div className="text-sm text-text-muted py-6 text-center">Nenhum lançamento financeiro registrado.</div>
            )}

            {!loading && finStats && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Receitas</span>
                      <span className="text-sm font-extrabold text-emerald-800">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finStats.totalIncome)}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-rose-600" />
                    <div>
                      <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">Despesas</span>
                      <span className="text-sm font-extrabold text-rose-800">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finStats.totalExpense)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">Resumo de Lançamentos</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {finStats.monthly && finStats.monthly.slice(0, 4).map((m: MonthlyStats, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 border border-border rounded-lg bg-gray-50/50">
                        <span className="text-xs font-bold text-primary">{m.month}</span>
                        <div className="flex gap-3 text-xs">
                          <span className="text-emerald-600 font-semibold">+{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.income)}</span>
                          <span className="text-rose-600 font-semibold">-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.expense)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Recent Demands (Schedules) */}
          <Card className="p-6 bg-white border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent-dark" />
                <span>Demandas Recentes</span>
              </h2>
              <Link href="/portal/demandas" className="text-xs font-bold text-accent-dark hover:underline flex items-center gap-1">
                <span>Ver todas as demandas</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loading && <div className="text-sm text-text-secondary">Carregando agendamentos...</div>}
            
            {!loading && recentSchedules.length === 0 && (
              <div className="text-sm text-text-muted py-6 text-center">Nenhum agendamento ou demanda registrado.</div>
            )}

            {!loading && recentSchedules.length > 0 && (
              <div className="space-y-3">
                {recentSchedules.map((sched) => (
                  <div key={sched.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-gray-50/50">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-primary block truncate">{sched.title}</span>
                      <div className="flex items-center gap-2 text-[10px] text-text-muted mt-1">
                        <span>{sched.type}</span>
                        <span>•</span>
                        <span>{sched.date} às {sched.time}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      sched.status === "Confirmado" || sched.status === "Concluído"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : sched.status === "Cancelado"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {sched.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // --- Professional Dashboard Render ---
  if (user.role === "PROFESSIONAL") {
    const totalSlots = slots.length;
    const bookedSlots = slots.filter((s) => s.status === "Reservado").length;
    const availableSlots = slots.filter((s) => s.status === "Disponível").length;
    const upcomingBookings = slots.filter((s) => s.status === "Reservado" && s.schedule);

    return (
      <div className="space-y-8 animate-none">
        {/* Welcome Hero for Professional */}
        <div className="bg-gradient-to-r from-primary via-primary-light to-secondary p-6 sm:p-8 rounded-xl text-white shadow-lg relative overflow-hidden border border-primary-light">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <ShieldCheck className="h-64 w-64 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="bg-accent text-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Profissional: {user.specialty || "Geral"}
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl mt-3">
                Olá, Dr(a). {user.name}!
              </h1>
              <p className="text-sm text-gray-300 mt-2 max-w-xl">
                Gerencie seus horários de atendimento de {user.specialty?.toLowerCase() || "serviços"} e acompanhe as consultas marcadas pelos associados da ASSEC.
              </p>
            </div>
            <Link href="/portal/agenda">
              <Button className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-5 py-3 shadow border-none">
                <Calendar className="h-4 w-4 mr-2" />
                Gerenciar Agenda
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 flex items-center gap-4 bg-white shadow-sm border border-gray-100">
            <div className="p-3.5 bg-primary/10 text-primary rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Total de Horários</span>
              <h3 className="text-2xl font-bold text-primary mt-0.5">{totalSlots}</h3>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-4 bg-white shadow-sm border border-gray-100">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Horários Reservados</span>
              <h3 className="text-2xl font-bold text-emerald-700 mt-0.5">{bookedSlots}</h3>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-4 bg-white shadow-sm border border-gray-100">
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Horários Livres</span>
              <h3 className="text-2xl font-bold text-amber-700 mt-0.5">{availableSlots}</h3>
            </div>
          </Card>
        </div>

        {/* Bookings List Section */}
        <Card className="p-6 bg-white shadow-sm">
          <h2 className="font-serif font-bold text-lg text-primary border-b border-gray-100 pb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent-dark" />
            <span>Consultas e Atendimentos Reservados</span>
          </h2>

          {loading ? (
            <div className="py-12 text-center text-xs text-text-muted">
              Buscando agendamentos...
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-secondary space-y-3">
              <p>Você não possui nenhum horário agendado por associados no momento.</p>
              <Link href="/portal/agenda" className="inline-block">
                <Button className="bg-primary text-white hover:bg-secondary font-semibold text-xs py-2 px-4 h-auto">
                  <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                  Disponibilizar Vagas
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {upcomingBookings.map((slot) => {
                const schedule = slot.schedule;
                const associate = schedule?.user;
                return (
                  <div
                    key={slot.id}
                    className="p-4 border border-border rounded-lg bg-gray-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-sm transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 bg-accent text-primary rounded">
                          {user.specialty}
                        </span>
                        <span className="text-xs text-text-muted font-mono">
                          Matrícula: {associate?.matricula || "N/A"}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-primary">
                        Associado: {associate?.name || "Desconhecido"}
                      </h3>
                      <p className="text-xs text-text-secondary">
                        <strong className="text-primary">Assunto:</strong> {schedule?.title}
                      </p>
                      {schedule?.info && (
                        <p className="text-xs text-text-muted italic bg-white p-2 rounded border border-gray-100 mt-1.5">
                          "{schedule.info}"
                        </p>
                      )}
                      <p className="text-[11px] text-text-muted">
                        Contato: {associate?.email}
                      </p>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-gray-200 shrink-0">
                      <span className="text-xs text-text-muted font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded shadow-sm">
                        {new Date(slot.date).toLocaleDateString("pt-BR")} às {slot.time}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Confirmado
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    );
  }

  // --- Associate (USER) Dashboard Render ---
  const upcomingSchedules = schedules
    .filter((s) => s.status !== "Cancelado" && s.status !== "Concluído")
    .slice(0, 2);

  return (
    <div className="space-y-8 animate-none">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 sm:p-8 rounded-xl text-white shadow-lg relative overflow-hidden border border-primary-light">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <ShieldCheck className="h-64 w-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="bg-accent text-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
              Associado Ativo
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl mt-3">
              Olá, {user.name}!
            </h1>
            <p className="text-sm text-gray-300 mt-2 max-w-xl">
              Este é o seu portal exclusivo. Acompanhe suas reservas, visualize sua carteira funcional digital ou gerencie seus dados cadastrais.
            </p>
          </div>
          <Link href="/portal/carteira">
            <Button className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-5 py-3 shadow border-none">
              <CreditCard className="h-4 w-4 mr-2" />
              Ver Carteira Digital
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Profile Snapshot & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Snapshot Card */}
        <Card className="p-6 col-span-1 flex flex-col justify-between bg-white shadow-sm">
          <div>
            <h2 className="font-serif font-bold text-lg text-primary border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-accent-dark" />
              <span>Dados da Filiação</span>
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                <span className="text-text-secondary font-medium">Nome</span>
                <span className="text-primary font-bold">{user.name}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                <span className="text-text-secondary font-medium">Matrícula</span>
                <span className="text-primary font-mono font-bold">
                  {user.matricula || "Não cadastrada"}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                <span className="text-text-secondary font-medium">CPF</span>
                <span className="text-primary font-mono font-bold">{user.cpf || "Não cadastrado"}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                <span className="text-text-secondary font-medium">Organização</span>
                <span className="text-primary font-bold">{user.org || "Não cadastrada"}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5">
                <span className="text-text-secondary font-medium">Status</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase border border-emerald-200">
                  {user.status || "Ativo"}
                </span>
              </div>
            </div>
          </div>
          <Link href="/portal/perfil" className="mt-6 block">
            <Button variant="outline" className="w-full text-xs font-bold text-primary hover:bg-gray-50">
              Atualizar Meus Dados
            </Button>
          </Link>
        </Card>

        {/* Quick Actions Card */}
        <Card className="p-6 col-span-1 lg:col-span-2 flex flex-col justify-between bg-white shadow-sm">
          <div>
            <h2 className="font-serif font-bold text-lg text-primary border-b border-gray-100 pb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-dark" />
              <span>Próximos Agendamentos</span>
            </h2>

            {loading ? (
              <div className="py-12 text-center text-xs text-text-muted">
                Buscando agendamentos...
              </div>
            ) : upcomingSchedules.length === 0 ? (
              <div className="py-12 text-center text-sm text-text-secondary">
                <p>Nenhum agendamento pendente ou reservado.</p>
                <Link href="/portal/agendamentos" className="mt-4 inline-block">
                  <Button className="bg-primary text-white hover:bg-secondary font-semibold text-xs py-2 px-4 h-auto">
                    <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                    Solicitar Agendamento
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {upcomingSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-4 border border-border rounded-lg bg-gray-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                  >
                    <div>
                      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 bg-primary/10 text-primary rounded mb-1">
                        {schedule.type}
                      </span>
                      <h3 className="font-semibold text-sm text-primary">
                        {schedule.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1">
                        {schedule.info || "Sem observações adicionais."}
                      </p>
                    </div>
                    <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                      <span className="text-xs text-text-muted font-medium bg-white border border-gray-200 px-2.5 py-1 rounded shadow-sm">
                        {new Date(schedule.date).toLocaleDateString("pt-BR")} às {schedule.time}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        schedule.status === "Agendado"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>
                        {schedule.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {schedules.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Link href="/portal/agendamentos" className="flex items-center gap-1 text-xs font-bold text-primary hover:text-accent-dark transition-colors">
                <span>Ver todos os meus agendamentos</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Mini Services Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/portal/carteira" className="group block">
          <Card className="p-5 hover:border-accent transition-all duration-300 hover:shadow flex items-start gap-4 bg-white">
            <div className="p-3 bg-accent/10 text-accent-dark rounded-lg group-hover:bg-accent group-hover:text-primary transition-colors">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary group-hover:text-accent-dark transition-colors">
                Carteira Funcional
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Visualize os dados de filiação, QR code de validação e imprima sua carteira digital.
              </p>
            </div>
          </Card>
        </Link>

        <Link href="/portal/agendamentos" className="group block">
          <Card className="p-5 hover:border-accent transition-all duration-300 hover:shadow flex items-start gap-4 bg-white">
            <div className="p-3 bg-accent/10 text-accent-dark rounded-lg group-hover:bg-accent group-hover:text-primary transition-colors">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary group-hover:text-accent-dark transition-colors">
                Solicitações
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Agende serviços da associação como assistência jurídica, fisioterapia, enfermaria, psicologia e administrativo.
              </p>
            </div>
          </Card>
        </Link>

        <Link href="/portal/perfil" className="group block">
          <Card className="p-5 hover:border-accent transition-all duration-300 hover:shadow flex items-start gap-4 bg-white">
            <div className="p-3 bg-accent/10 text-accent-dark rounded-lg group-hover:bg-accent group-hover:text-primary transition-colors">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary group-hover:text-accent-dark transition-colors">
                Atualização Cadastral
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Altere sua foto de perfil, dados de contato, patente/cargo e órgão associado.
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
