import { motion } from "motion/react";
import { CalendarDays, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../ui/Card";

interface Schedule {
  id: string;
  type: string;
  date: string;
  time: string;
  info: string;
  status: string;
}

interface SchedulesTabProps {
  schedules: Schedule[];
}

export default function SchedulesTab({ schedules }: SchedulesTabProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h2 className="text-xl font-black text-[var(--ink)]">Meus Agendamentos</h2>
          <p className="text-[var(--ink-muted)] text-sm font-medium">Gerencie suas reservas e horários da semana.</p>
        </div>
        <button className="bg-[var(--gold)] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[var(--gold-dim)] transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
          <Plus className="w-5 h-5" /> Reservar
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
          {schedules.map(schedule => (
            <Card key={schedule.id} className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${schedule.status === 'Confirmado' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-[var(--gold-glow)] text-[var(--gold)] border-[var(--border-gold)]'}`}>
                    {schedule.status}
                  </span>
              </div>
              <div className="space-y-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <CalendarDays className="w-6 h-6 text-[var(--gold)]" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-[var(--ink)] leading-none">{schedule.type}</h4>
                        <p className="text-sm font-medium text-[var(--ink-muted)] mt-1">{schedule.date} às {schedule.time}</p>
                    </div>
                  </div>
                  <p className="text-[var(--ink-muted)] text-sm leading-relaxed border-l-2 border-[var(--border)] pl-4 italic">
                    "{schedule.info}"
                  </p>
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 py-3 bg-slate-50 text-[var(--ink)] rounded-xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95 border border-[var(--border)] cursor-pointer">Detalhes</button>
                    <button className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all active:scale-95 border border-red-100 cursor-pointer">Cancelar</button>
                  </div>
              </div>
            </Card>
          ))}
      </div>

      <Card className="bg-[var(--ink)] border border-[var(--border-gold)] text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="text-center lg:text-left">
                <h3 className="text-2xl font-black mb-2 tracking-tight text-white">Precisa de Lazer?</h3>
                <p className="text-slate-400 max-w-sm">Consulte a disponibilidade de nossas pousadas e colônias de férias para o próximo final de semana.</p>
            </div>
            <Link to="/pousadas" className="bg-[var(--gold)] text-white px-10 py-5 rounded-2xl font-black hover:bg-[var(--gold-dim)] transition-all active:scale-95 shadow-xl inline-block">
              Ver Pousadas
            </Link>
          </div>
      </Card>
    </motion.div>
  );
}
