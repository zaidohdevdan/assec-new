"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, PlusCircle, Clock, CheckCircle2, AlertCircle, X, Trash2 } from "lucide-react";
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

// Validation schema for scheduling requests
const scheduleSchema = z.object({
  type: z.string().min(1, "Selecione o tipo de agendamento"),
  title: z.string().min(1, "Selecione a finalidade do agendamento"),
  customTitle: z.string().optional(),
  slotId: z.string().min(1, "Selecione uma vaga disponível"),
  info: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface ScheduleItem {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  info?: string;
  status: string;
  createdAt: string;
  slot?: {
    professional?: {
      name: string;
      email: string;
    };
  };
}

export default function AgendamentosPage() {
  const [schedules, setSchedules] = React.useState<ScheduleItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  // States for available slots
  const [availableSlots, setAvailableSlots] = React.useState<ScheduleSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = React.useState<string>("Todos");
  const [typeFilter, setTypeFilter] = React.useState<string>("Todos");

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesStatus = statusFilter === "Todos" || schedule.status === statusFilter;
    const matchesType = typeFilter === "Todos" || schedule.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      type: "Assistência Jurídica",
      title: "Primeira Consulta",
      customTitle: "",
      slotId: "",
      info: "",
    },
  });

  const selectedType = watch("type");
  const selectedTitle = watch("title");

  // Fetch available slots when category changes
  React.useEffect(() => {
    if (!selectedType || !modalOpen) return;

    const fetchAvailableSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await apiFetch(`/slots?type=${encodeURIComponent(selectedType)}`);
        if (res.ok) {
          const data: ScheduleSlot[] = await res.json();
          const todayStr = new Date().toLocaleDateString("sv-SE");
          const validSlots = data.filter((s) => s.date >= todayStr);
          setAvailableSlots(validSlots);
          if (validSlots.length > 0) {
            setValue("slotId", validSlots[0].id);
          } else {
            setValue("slotId", "");
          }
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedType, modalOpen, setValue]);

  const fetchSchedules = async () => {
    try {
      const res = await apiFetch("/schedules");
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (err) {
      console.error("Error fetching schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSchedules();
  }, []);

  const onSubmit = async (data: ScheduleFormData) => {
    setSubmitError(null);
    setActionLoading("submitting");

    const finalTitle =
      data.title === "Outros" && data.customTitle?.trim()
        ? `Outros (${data.customTitle.trim()})`
        : data.title;

    try {
      const res = await apiFetch("/schedules", {
        method: "POST",
        body: JSON.stringify({
          slotId: data.slotId,
          title: finalTitle,
          info: data.info,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        reset();
        await fetchSchedules();
      } else {
        const errData = await res.json();
        setSubmitError(errData?.message ?? "Ocorreu um erro ao processar o agendamento.");
      }
    } catch (err) {
      console.error("Error making schedule request:", err);
      setSubmitError("Erro de conexão. Verifique se o servidor do backend está ativo.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSchedule = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) return;

    setActionLoading(id);
    try {
      const res = await apiFetch(`/schedules/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Cancelado" }),
      });

      if (res.ok) {
        await fetchSchedules();
      } else {
        alert("Erro ao cancelar o agendamento.");
      }
    } catch (err) {
      console.error("Error cancelling schedule:", err);
      alert("Erro ao conectar ao servidor.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
            Meus Agendamentos
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Solicite assistência jurídica, fisioterapia, enfermaria, psicologia ou atendimentos administrativos.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 py-2.5 shadow self-start sm:self-center border-none"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Solicitar Agendamento
        </Button>
      </div>

      {/* Main content area */}
      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        {loading ? (
          <div className="text-center py-16 text-sm text-text-secondary">
            Carregando seus agendamentos...
          </div>
        ) : (
          <>
            {schedules.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
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
                    <option value="Todos">Todos</option>
                    <option value="Agendado">Agendado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="w-full sm:w-56">
                  <label htmlFor="type-filter" className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    Filtrar por Especialidade
                  </label>
                  <select
                    id="type-filter"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-border bg-bg-surface px-2.5 py-1 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  >
                    <option value="Todos">Todas</option>
                    <option value="Assistência Jurídica">Assistência Jurídica</option>
                    <option value="Fisioterapia">Fisioterapia</option>
                    <option value="Enfermaria">Enfermaria</option>
                    <option value="Psicologia">Psicologia</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                </div>
              </div>
            )}

            {schedules.length === 0 ? (
              <div className="text-center py-16 text-text-secondary space-y-4">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto" />
                <p className="font-serif font-bold text-lg text-primary">Nenhum agendamento encontrado</p>
                <p className="text-sm max-w-sm mx-auto">
                  Você ainda não fez nenhuma solicitação de agendamento. Clique no botão acima para iniciar seu primeiro agendamento.
                </p>
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="text-center py-16 text-text-secondary">
                <p className="text-sm font-semibold">Nenhum agendamento corresponde aos filtros selecionados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-text-secondary font-semibold">
                  <th className="pb-3 pr-4">Tipo & Profissional</th>
                  <th className="pb-3 px-4">Título / Finalidade</th>
                  <th className="pb-3 px-4">Data e Hora</th>
                  <th className="pb-3 px-4">Observações</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="text-text-primary hover:bg-gray-50/30">
                    <td className="py-4 pr-4 font-semibold">
                      <div className="flex flex-col">
                        <span className="inline-block w-fit text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {schedule.type}
                        </span>
                        {schedule.slot?.professional?.name && (
                          <span className="text-[11px] text-text-muted mt-1 font-normal">
                            Dr(a). {schedule.slot.professional.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-primary">{schedule.title}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1.5 text-text-secondary font-medium">
                        <Clock className="h-4 w-4 shrink-0 text-text-muted" />
                        <span>
                          {formatDateString(schedule.date)} às {schedule.time}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-text-secondary max-w-xs truncate" title={schedule.info}>
                      {schedule.info || "-"}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        schedule.status === "Agendado"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : schedule.status === "Cancelado"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {schedule.status === "Agendado" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : schedule.status === "Cancelado" ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        <span>{schedule.status}</span>
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      {schedule.status !== "Cancelado" && (
                        <Button
                          variant="ghost"
                          onClick={() => handleCancelSchedule(schedule.id)}
                          loading={actionLoading === schedule.id}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 px-2 text-xs font-bold"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    )}
  </Card>

      {/* Booking Form Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative border border-border animate-in fade-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2 items-center text-primary">
                  <Calendar className="h-5 w-5 text-accent-dark" />
                  <h2 id="modal-title" className="font-serif font-bold text-xl">
                    Solicitar Agendamento
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-text-muted hover:text-text-primary transition-colors p-1"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" role="alert">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="type" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Tipo de Serviço
                  </label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    {...register("type")}
                  >
                    <option value="Assistência Jurídica">Assistência Jurídica</option>
                    <option value="Fisioterapia">Fisioterapia</option>
                    <option value="Enfermaria">Enfermaria</option>
                    <option value="Psicologia">Psicologia</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                  {errors.type?.message && (
                    <span className="text-xs text-red-600 font-medium mt-1 block">{errors.type.message}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="title" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Título / Finalidade do Agendamento
                  </label>
                  <select
                    id="title"
                    className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    {...register("title")}
                  >
                    <option value="Primeira Consulta">Primeira Consulta</option>
                    <option value="Retorno">Retorno</option>
                    <option value="Acompanhamento">Acompanhamento</option>
                    <option value="Outros">Outros</option>
                  </select>
                  {errors.title?.message && (
                    <span className="text-xs text-red-600 font-medium mt-1 block">{errors.title.message}</span>
                  )}
                </div>

                {selectedTitle === "Outros" && (
                  <Input
                    label="Especifique a Finalidade (Opcional)"
                    placeholder="Ex: Dúvidas contratuais, Exame específico..."
                    error={errors.customTitle?.message}
                    {...register("customTitle")}
                  />
                )}

                <div>
                  <label htmlFor="slotId" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Vagas Disponíveis
                  </label>
                  {loadingSlots ? (
                    <div className="text-xs text-text-muted py-2">Buscando horários disponíveis...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-md">
                      Nenhum horário disponível para esta especialidade no momento.
                    </div>
                  ) : (
                    <select
                      id="slotId"
                      className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      {...register("slotId")}
                    >
                      {availableSlots.map((slot) => {
                        const dateFormatted = formatDateString(slot.date);
                        const professionalName = slot.professional?.name || "Profissional";
                        return (
                          <option key={slot.id} value={slot.id}>
                            {dateFormatted} às {slot.time} — Dr(a). {professionalName}
                          </option>
                        );
                      })}
                    </select>
                  )}
                  {errors.slotId?.message && (
                    <span className="text-xs text-red-600 font-medium mt-1 block">{errors.slotId.message}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="info" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Informações Adicionais / Detalhes
                  </label>
                  <textarea
                    id="info"
                    rows={3}
                    placeholder="Descreva detalhes importantes da solicitação (ex: número de acompanhantes, patologia, etc.)"
                    className="flex w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    {...register("info")}
                  />
                  {errors.info?.message && (
                    <span className="text-xs text-red-600 font-medium mt-1 block">{errors.info.message}</span>
                  )}
                </div>

                <div className="flex justify-end gap-3 border-t border-border pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-border hover:bg-gray-50 rounded-lg text-xs font-semibold text-text-secondary transition-colors"
                  >
                    Cancelar
                  </button>
                  <Button
                    type="submit"
                    loading={actionLoading === "submitting"}
                    disabled={availableSlots.length === 0}
                    className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 py-2 shadow border-none"
                  >
                    Confirmar Solicitação
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
