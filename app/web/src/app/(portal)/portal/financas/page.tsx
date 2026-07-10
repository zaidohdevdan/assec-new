"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { User as UserType, FinancialStats, MonthlyStats } from "@/lib/types";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Trash2, 
  Filter, 
  FileSpreadsheet,
  AlertCircle,
  Download,
  Printer
} from "lucide-react";

interface FinancialRecord {
  id: string;
  description: string;
  amount: number;
  type: string; // "INCOME" | "EXPENSE"
  category: string;
  date: string;
  createdAt: string;
}

export default function FinancasPage() {
  const [user, setUser] = React.useState<UserType | null>(null);
  const [records, setRecords] = React.useState<FinancialRecord[]>([]);
  const [stats, setStats] = React.useState<FinancialStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = React.useState<string>("Todos");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("Todos");

  // Create Record Form Modal State
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [type, setType] = React.useState("INCOME");
  const [category, setCategory] = React.useState("Mensalidades");
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const categories = ["Mensalidades", "Lazer", "Jurídico", "Administrativo", "Eventos"];

  React.useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const resList = await apiFetch("/financials");
      if (resList.ok) {
        const data = await resList.json();
        setRecords(data);
      }
      const resStats = await apiFetch("/financials/stats");
      if (resStats.ok) {
        const data = await resStats.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error loading financials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!description || !amount || !date) {
      setSubmitError("Preencha todos os campos obrigatórios.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount === 0) {
      setSubmitError("Informe um valor numérico válido.");
      return;
    }

    const finalAmount = type === "EXPENSE" ? -Math.abs(numAmount) : Math.abs(numAmount);

    try {
      const res = await apiFetch("/financials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          amount: finalAmount,
          type,
          category,
          date: new Date(date).toISOString(),
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setDescription("");
        setAmount("");
        setType("INCOME");
        setCategory("Mensalidades");
        setDate(new Date().toISOString().split("T")[0]);
        loadData();
      } else {
        const errData = await res.json();
        setSubmitError(errData.message || "Erro ao criar lançamento financeiro.");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Falha na rede.");
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este lançamento financeiro?")) return;

    try {
      const res = await apiFetch(`/financials/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    
    // CSV Header (UTF-8 BOM is added for correct characters display in Excel)
    const headers = ["Descrição", "Categoria", "Data", "Tipo", "Valor (R$)"];
    const rows = records.map((rec) => [
      `"${rec.description.replace(/"/g, '""')}"`,
      `"${rec.category}"`,
      new Date(rec.date).toLocaleDateString("pt-BR"),
      rec.type === "INCOME" ? "Receita" : "Despesa",
      rec.amount.toFixed(2),
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8,\uFEFF" + 
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `balanco-financeiro-assec-${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "ADMIN";
  const isPresident = user.role === "PRESIDENT";
  const isContabilidade = user.role === "CONTABILIDADE";
  const canManage = isAdmin || isContabilidade;

  if (!isAdmin && !isPresident && !isContabilidade) {
    return (
      <div className="p-8 text-center text-rose-600 font-semibold">
        Acesso negado. Esta área é restrita à diretoria e administração.
      </div>
    );
  }

  const filteredRecords = records.filter((rec) => {
    const matchesType = typeFilter === "Todos" || rec.type === typeFilter;
    const matchesCategory = categoryFilter === "Todos" || rec.category === categoryFilter;
    return matchesType && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
            Fluxo Financeiro
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {isPresident 
              ? "Relatório de receitas, despesas e demonstrativos patrimoniais (Apenas Leitura)." 
              : "Controle financeiro da associação. Cadastre lançamentos, audite despesas e acompanhe o balanço."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="border-border text-primary hover:bg-slate-50 font-bold text-xs uppercase tracking-widest px-4 py-2.5 shadow"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          
          <Button
            variant="outline"
            onClick={handlePrintPDF}
            className="border-border text-primary hover:bg-slate-50 font-bold text-xs uppercase tracking-widest px-4 py-2.5 shadow"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir PDF
          </Button>
          
          {canManage && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 py-2.5 shadow border-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Lançamento
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-center gap-4 p-6 bg-white border border-border shadow-sm">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Receitas Acumuladas</span>
              <span className="text-2xl font-extrabold text-emerald-600 block mt-1">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalIncome)}
              </span>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-6 bg-white border border-border shadow-sm">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-lg">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Despesas Acumuladas</span>
              <span className="text-2xl font-extrabold text-rose-600 block mt-1">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalExpense)}
              </span>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-6 bg-white border border-border shadow-sm">
            <div className="p-4 bg-primary text-accent rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Balanço do Caixa</span>
              <span className={`text-2xl font-extrabold block mt-1 ${stats.balance >= 0 ? "text-primary" : "text-rose-600"}`}>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.balance)}
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Cash Flow Visualizer (Chart Representation) */}
      {stats?.monthly && stats.monthly.length > 0 && (
        <Card className="p-6 bg-white border border-border shadow-sm">
          <h2 className="font-serif font-bold text-lg text-primary mb-6 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-accent-dark" />
            <span>Demonstrativo do Fluxo de Caixa Mensal (2026)</span>
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4 h-64 border-b border-border pb-2 px-4">
              {stats.monthly.map((m: MonthlyStats, idx: number) => {
                const maxVal = Math.max(...stats.monthly.map((i: MonthlyStats) => Math.max(i.income, i.expense)), 1);
                const incHeight = (m.income / maxVal) * 100;
                const expHeight = (m.expense / maxVal) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 max-w-[80px] h-full justify-end">
                    <div className="flex items-end gap-1.5 h-full w-full justify-center">
                      {/* Income Bar */}
                      <div 
                        className="bg-emerald-500 rounded-t w-5 transition-all duration-500 hover:opacity-80 relative group"
                        style={{ height: `${incHeight}%` }}
                      >
                        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow z-20">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(m.income)}
                        </div>
                      </div>
                      {/* Expense Bar */}
                      <div 
                        className="bg-rose-500 rounded-t w-5 transition-all duration-500 hover:opacity-80 relative group"
                        style={{ height: `${expHeight}%` }}
                      >
                        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow z-20">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(m.expense)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-text-secondary truncate mt-1">{m.month}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex gap-4 text-xs font-semibold justify-center">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 bg-emerald-500 rounded" />
                <span>Receitas (Arrecadações/Parcerias)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 bg-rose-500 rounded" />
                <span>Despesas (Custos de Operação/Serviços)</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters and List */}
      <Card className="p-6 bg-white border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-border pb-4">
          <h2 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
            <Filter className="h-5 w-5 text-accent-dark" />
            <span>Histórico de Lançamentos</span>
          </h2>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="Todos">Todos os Lançamentos</option>
              <option value="INCOME">Receitas (+)</option>
              <option value="EXPENSE">Despesas (-)</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="Todos">Todas as Categorias</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className="text-center py-8 text-text-secondary text-sm">Carregando lançamentos...</div>}

        {!loading && filteredRecords.length === 0 && (
          <div className="text-center py-8 text-text-secondary text-sm">Nenhum lançamento financeiro corresponde aos filtros aplicados.</div>
        )}

        {!loading && filteredRecords.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                  <th className="p-4">Descrição</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Data</th>
                  <th className="p-4 text-right">Valor</th>
                  {canManage && <th className="p-4 text-center">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="border-b border-border hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-primary">{rec.description}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-text-secondary px-2 py-0.5 rounded text-[10px] font-semibold">
                        {rec.category}
                      </span>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {new Date(rec.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className={`p-4 text-right font-bold ${rec.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                      {rec.type === "INCOME" ? "+" : ""}
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(rec.amount)}
                    </td>
                    {canManage && (
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRecord(rec.id)}
                          className="p-1 text-text-muted hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                          title="Excluir Lançamento"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Record Modal */}
      {showAddModal && canManage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-border">
            <div className="p-6 border-b border-border bg-slate-50 flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-primary">Novo Lançamento Financeiro</h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-secondary hover:text-primary font-bold">✕</button>
            </div>
            
            <form onSubmit={handleAddRecord} className="p-6 space-y-4">
              {submitError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded border border-rose-100 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Arrecadação de Mensalidades"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Tipo de Lançamento</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="INCOME">Receita (+)</option>
                    <option value="EXPENSE">Despesa (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-border hover:bg-gray-50 rounded-lg text-xs font-semibold text-text-secondary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white hover:bg-primary-light rounded-lg text-xs font-semibold transition-colors"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
