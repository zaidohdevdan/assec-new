import { motion } from "motion/react";
import { Bell, Scale, Stethoscope, Tent, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
}

export default function OverviewTab({ setActiveTab }: OverviewTabProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Mensalidade</p>
            <p className="text-2xl font-black text-blue-900 leading-none">Pagamento em Folha</p>
            <span className="text-[10px] font-bold text-green-500 uppercase mt-2 inline-block italic">Atualizado Automaticamente</span>
          </div>
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Próximo Lazer</p>
            <p className="text-2xl font-black text-blue-900 leading-none">15 Mai</p>
            <span className="text-[10px] font-bold text-blue-500 uppercase mt-2 inline-block">Churrasq. 04</span>
          </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-blue-950 mb-6 flex justify-between items-center">
              Avisos Importantes
              <Bell className="w-4 h-4 text-slate-400" />
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="font-bold text-blue-900 text-sm mb-1">Assembleia Geral Extraordinária</p>
                <p className="text-xs text-blue-700">Pauta: Discussão sobre o novo plano de cargos e carreiras. Participe!</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-800 text-sm mb-1">Novos Convênios Odontológicos</p>
                <p className="text-xs text-slate-500">Agora associados ASSEC têm 40% de desconto na rede Sorriso +, em todo o CE.</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-blue-950 mb-6">Atalhos Rápidos</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActiveTab("agendamentos")} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-all text-left group">
                  <Scale className="w-5 h-5 text-blue-600 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-bold text-slate-700">Jurídico</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-all text-left group">
                  <Stethoscope className="w-5 h-5 text-blue-600 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-bold text-slate-700">Clínicas</span>
              </button>
              <Link to="/pousadas" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-all text-left group">
                  <Tent className="w-5 h-5 text-blue-600 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-bold text-slate-700">Pousadas</span>
              </Link>
              <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-all text-left group">
                  <Users className="w-5 h-5 text-blue-600 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-bold text-slate-700">Dependentes</span>
              </button>
            </div>
          </div>
      </div>
    </motion.div>
  );
}
