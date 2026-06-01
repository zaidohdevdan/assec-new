import { motion } from "motion/react";
import { CalendarDays, Plus } from "lucide-react";
import { Link } from "react-router-dom";

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
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-blue-950">Meus Agendamentos</h2>
          <p className="text-slate-400 text-sm font-medium">Gerencie suas reservas e horários da semana.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95">
          <Plus className="w-5 h-5" /> Reservar
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
          {schedules.map(schedule => (
            <Card className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${schedule.status === 'Confirmado' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                    {schedule.status}
                  </span>
              </div>
              <div className="space-y-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <CalendarDays className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-blue-950 leading-none">{schedule.type}</h4>
                        <p className="text-sm font-medium text-slate-400 mt-1">{schedule.date} às {schedule.time}</p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-slate-200 pl-4 italic">
                    "{schedule.info}"
                  </p>
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 py-3 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95 border border-slate-100">Detalhes</button>
                    <button className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all active:scale-95 border border-red-100">Cancelar</button>
                  </div>
              </div>
            </div>
          ))}
      </div>

      <Card className="bg-slate-900 text-white p-6">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="text-center lg:text-left">
                <h3 className="text-2xl font-black mb-2 tracking-tight">Precisa de Lazer?</h3>
                <p className="text-slate-400 max-w-sm">Consulte a disponibilidade de nossas pousadas e colônias de férias para o próximo final de semana.</p>
            </div>
            <Link to="/pousadas" className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black hover:bg-slate-100 transition-all active:scale-95 shadow-xl inline-block">
              Ver Pousadas
            </Link>
          </div>
      </div>
    </motion.div>
  );
}
