"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, PlusCircle, Clock, Trash2, AlertCircle, CheckCircle2, User } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ScheduleSlot } from "@/lib/types";

// Helper to format date string safely without timezone offsets
const formatDateString = (dateStr: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

// Validation schema for creating slots in batch
const slotBatchSchema = z.object({
  date: z.string().min(1, "Selecione a data das vagas"),
  times: z.string().min(1, "Insira pelo menos um horário"),
});

type SlotBatchFormData = z.infer<typeof slotBatchSchema>;

export default function ProfessionalAgendaPage() {
  const [slots, setSlots] = React.useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = React.useState<string>("Todos");
  const [dateFilter, setDateFilter] = React.useState<string>("");
  const [minDate, setMinDate] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setMinDate(new Date().toLocaleDateString("sv-SE"));
  }, []);

  const filteredSlots = slots.filter((slot) => {
    const matchesStatus = statusFilter === "Todos" || slot.status === statusFilter;
    const matchesDate = !dateFilter || slot.date === dateFilter;
    return matchesStatus && matchesDate;
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SlotBatchFormData>({
    resolver: zodResolver(slotBatchSchema),
    defaultValues: {
      date: "",
      times: "",
    },
  });

  const fetchSlots = async () => {
    try {
      const res = await apiFetch("/slots");
      if (res.ok) {
        const data = await res.json();
        setSlots(data);
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSlots();
  }, []);

  const onSubmit = async (data: SlotBatchFormData) => {
    setSubmitError(null);
    setSuccessMessage(null);
    setActionLoading("submitting");

    // Parse comma-separated times
    const timeList = data.times
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const validTimeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const invalidTimes = timeList.filter((t) => !validTimeRegex.test(t));

    if (invalidTimes.length > 0) {
      setSubmitError(`Os seguintes horários estão em formato inválido: ${invalidTimes.join(", ")}. Use o formato HH:MM separados por vírgula (ex: 08:00, 09:30, 11:00).`);
      setActionLoading(null);
      return;
    }

    try {
      const slotsPayload = timeList.map((time) => ({
        date: data.date,
        time,
      }));

      const res = await apiFetch("/slots", {
        method: "POST",
        body: JSON.stringify({ slots: slotsPayload }),
      });

      if (res.ok) {
        setSuccessMessage(`${slotsPayload.length} vaga(s) de atendimento criada(s) com sucesso!`);
        reset();
        await fetchSlots();
      } else {
        const errData = await res.json();
        setSubmitError(errData?.message ?? "Ocorreu um erro ao criar as vagas.");
      }
    } catch (err) {
      console.error("Error creating slots:", err);
      setSubmitError("Erro de conexão. Verifique se o servidor do backend está ativo.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeSlot = async (slot: ScheduleSlot) => {
    const isReserved = slot.status === "Reservado";
    const confirmMessage = isReserved
      ? `Atenção: Esta vaga está reservada pelo associado "${slot.schedule?.user?.name}". Ao revogá-la, o agendamento dele será cancelado permanentemente e ele será notificado. Deseja continuar?`
      : "Tem certeza que deseja revogar esta vaga?";

    if (!window.confirm(confirmMessage)) return;

    setActionLoading(slot.id);
    try {
      const res = await apiFetch(`/slots/${slot.id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchSlots();
      } else {
        alert("Erro ao revogar a vaga de atendimento.");
      }
    } catch (err) {
      console.error("Error revoking slot:", err);
      alert("Erro de conexão ao servidor.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-none">
      {/* Top Header */}
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
          Minha Agenda de Atendimentos
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Crie vagas de atendimento em lote para o mês e gerencie os horários marcados pelos associados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot Batch Creator Form */}
        <Card className="p-6 col-span-1 bg-white shadow-sm border border-gray-100 self-start">
          <h2 className="font-serif font-bold text-lg text-primary border-b border-gray-100 pb-3 flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-accent-dark" />
            <span>Disponibilizar Vagas</span>
          </h2>

          {submitError && (
            <div className="my-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" role="alert">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {successMessage && (
            <div className="my-4 p-4 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-700 flex items-center gap-2" role="alert">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <Input
              label="Data de Atendimento"
              type="date"
              min={minDate}
              error={errors.date?.message}
              {...register("date")}
            />

            <div>
              <label htmlFor="times" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Horários de Atendimento
              </label>
              <textarea
                id="times"
                rows={3}
                placeholder="Ex: 08:00, 09:00, 10:00, 14:00, 15:30"
                className="flex w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                {...register("times")}
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                Insira os horários separados por vírgula no formato de 24 horas (HH:MM).
              </span>
              {errors.times?.message && (
                <span className="text-xs text-red-600 font-medium mt-1 block">{errors.times.message}</span>
              )}
            </div>

            <Button
              type="submit"
              loading={actionLoading === "submitting"}
              className="w-full bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest py-3 border-none mt-2"
            >
              Criar Horários
            </Button>
          </form>
        </Card>

        {/* Created Slots List */}
        <Card className="p-6 col-span-1 lg:col-span-2 bg-white shadow-sm border border-gray-100">
          <h2 className="font-serif font-bold text-lg text-primary border-b border-gray-100 pb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent-dark" />
            <span>Grade de Horários Criados</span>
          </h2>

          {loading ? (
            <div className="text-center py-16 text-sm text-text-secondary">
              Carregando agenda...
            </div>
          ) : (
            <>
              {slots.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-100 mt-4">
                  <div className="w-full sm:w-48">
                    <label htmlFor="status-filter" className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                      Filtrar por Status
                    </label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-border bg-bg-surface px-2.5 py-1 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                      <option value="Todos">Todos os Status</option>
                      <option value="Disponível">Disponível</option>
                      <option value="Reservado">Reservado</option>
                      <option value="Expirado">Expirado (Passado)</option>
                      <option value="Realizado">Realizado (Concluído)</option>
                    </select>
                  </div>

                  <div className="w-full sm:w-48">
                    <label htmlFor="date-filter" className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                      Filtrar por Data
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="date-filter"
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-border bg-bg-surface px-2.5 py-1 pr-12 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      />
                      {dateFilter && (
                        <button
                          type="button"
                          onClick={() => setDateFilter("")}
                          className="absolute right-2 text-text-muted hover:text-text-primary text-[10px] font-bold uppercase"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {slots.length === 0 ? (
                <div className="text-center py-16 text-text-secondary space-y-3">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto" />
                  <p className="font-serif font-bold text-lg text-primary">Agenda vazia</p>
                  <p className="text-sm max-w-sm mx-auto">
                    Você ainda não disponibilizou nenhuma vaga de atendimento para este mês. Use o formulário ao lado para cadastrar.
                  </p>
                </div>
              ) : filteredSlots.length === 0 ? (
                <div className="text-center py-16 text-text-secondary">
                  <p className="text-sm font-semibold">Nenhuma vaga corresponde aos filtros selecionados.</p>
                </div>
              ) : (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border text-text-secondary font-semibold">
                        <th className="pb-3 pr-4">Data e Hora</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 px-4">Associado / Informações</th>
                        <th className="pb-3 pl-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredSlots.map((slot) => {
                        const isReserved = slot.status === "Reservado";
                        const isRealizado = slot.status === "Realizado";
                        const isExpirado = slot.status === "Expirado";
                        const isPastOrFinished = isRealizado || isExpirado;
                        const associate = slot.schedule?.user;

                        return (
                          <tr key={slot.id} className="text-text-primary hover:bg-gray-50/30">
                            <td className="py-4 pr-4 font-semibold">
                              <span className="flex items-center gap-1.5 text-primary">
                                <Clock className="h-4 w-4 shrink-0 text-text-muted" />
                                <span>
                                  {formatDateString(slot.date)} às {slot.time}
                                </span>
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                isReserved
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : isRealizado
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : isExpirado
                                      ? "bg-slate-100 text-slate-500 border-slate-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}>
                                {isReserved || isRealizado ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <Clock className="h-3 w-3" />
                                )}
                                <span>{slot.status}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {(isReserved || isRealizado) && associate ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 font-bold text-xs text-primary">
                                    <User className="h-3.5 w-3.5 text-accent-dark shrink-0" />
                                    <span>{associate.name}</span>
                                    {associate.matricula && (
                                      <span className="text-[10px] text-text-muted font-normal font-mono">
                                        ({associate.matricula})
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-text-secondary">
                                    <strong className="text-primary">Assunto:</strong> {slot.schedule?.title}
                                  </p>
                                  {slot.schedule?.info && (
                                    <p className="text-[11px] text-text-muted italic bg-slate-50 border border-gray-100 p-1.5 rounded mt-0.5">
                                      &ldquo;{slot.schedule?.info}&rdquo;
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-text-muted">-</span>
                              )}
                            </td>
                            <td className="py-4 pl-4 text-right">
                              {isPastOrFinished ? (
                                <span className="text-xs text-text-muted italic pr-2">Encerrado</span>
                              ) : (
                                <Button
                                  variant="ghost"
                                  onClick={() => handleRevokeSlot(slot)}
                                  loading={actionLoading === slot.id}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 px-2 text-xs font-bold"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Revogar
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
