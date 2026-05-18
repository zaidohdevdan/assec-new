import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CalendarDays, Clock, Info, Tag } from "lucide-react";
import { dashboardService } from "../../../services/dashboard.service";
import { Schedule } from '@/src/types';

type ScheduleType = "clube" | "pousada" | "juridico" | "saude";

const isValidScheduleType = (value: string): value is ScheduleType => {
    return ["clube", "pousada", "juridico", "saude"].includes(value);
};

const scheduleFormSchema = z.object({
    type: z.enum(["clube", "pousada", "juridico", "saude"], {
        message: "Selecione o tipo de agendamento",
    }),
    title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
    date: z.string().min(1, "Data é obrigatória"),
    time: z.string().min(1, "Hora é obrigatória"),
    info: z.string().min(5, "Informações devem ter no mínimo 5 caracteres"),
});

type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

interface ScheduleFormProps {
    onClose: () => void;
    onScheduleCreated: (newSchedule: import("../../../types").Schedule) => void;
    initialData?: import("../../../types").Schedule;
}

export default function ScheduleForm({ onClose, onScheduleCreated, initialData }: ScheduleFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleFormSchema),
        defaultValues: initialData  ? {
            type: initialData.type as ScheduleType,
            title: initialData.title,
            date: initialData.date,
            time: initialData.time,
            info: initialData.info,
        } : undefined
    });

    // Reset form when initialData changes (e.g. switching between different schedules to edit)
    useEffect(() => {
        if (initialData && isValidScheduleType(initialData.type)) {
            reset({
                type: initialData.type,
                title: initialData.title,
                date: initialData.date,
                time: initialData.time,
                info: initialData.info,
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: ScheduleFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            let result: Schedule;
            if (initialData) {
                // Phase 2: Call update API
                result = await dashboardService.updateSchedule(initialData.id, data);
            } else {
                result = await dashboardService.createSchedule(data);
            }
            onScheduleCreated(result);
            reset();
            onClose();
        } catch (err) {
            console.error("❌ Erro ao salvar agendamento:", err);
            setError("Não foi possível salvar o agendamento. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="text-xl font-black text-blue-950">
                    {initialData ? "Editar Agendamento" : "Novo Agendamento"}
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="type" className="block text-sm font-bold text-slate-700 mb-2">Tipo de Agendamento</label>
                    <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                            id="type"
                            {...register("type")}
                            className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium appearance-none"
                        >
                            <option value="">Selecione...</option>
                            <option value="clube">Clube</option>
                            <option value="pousada">Pousada</option>
                            <option value="juridico">Jurídico</option>
                            <option value="saude">Saúde</option>
                        </select>
                    </div>
                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">Título</label>
                    <div className="relative">
                        <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            id="title"
                            type="text"
                            placeholder="Ex: Reunião mensal de diretoria"
                            {...register("title")}
                            className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
                        />
                    </div>
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-bold text-slate-700 mb-2">Data</label>
                        <div className="relative">
                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                id="date"
                                type="date"
                                {...register("date")}
                                className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="time" className="block text-sm font-bold text-slate-700 mb-2">Hora</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                id="time"
                                type="time"
                                {...register("time")}
                                className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                        {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="info" className="block text-sm font-bold text-slate-700 mb-2">Informações Adicionais</label>
                    <div className="relative">
                        <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <textarea
                            id="info"
                            placeholder="Detalhes do agendamento..."
                            {...register("info")}
                            rows={4}
                            className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium resize-y"
                        ></textarea>
                    </div>
                    {errors.info && <p className="text-red-500 text-xs mt-1">{errors.info.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Salvando..." : (initialData ? "Atualizar Agendamento" : "Confirmar Agendamento")}
                    {isLoading ? null : <CalendarDays className="w-6 h-6" />}
                </button>
            </form>
        </div>
    );
}