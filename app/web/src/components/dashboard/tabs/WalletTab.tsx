import { motion } from "motion/react";
import { ShieldCheck, QrCode, Download } from "lucide-react";
import Card from "../../ui/Card";

interface WalletTabProps {
  userData: {
    name: string;
    id: string;
    status: string;
    org: string;
    since: string;
    cpf: string;
    rg: string;
  };
}

export default function WalletTab({ userData }: WalletTabProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
          <div className="bg-linear-to-br from-blue-900 via-blue-800 to-blue-950 rounded-2xl p-8 text-white shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-yellow-400 w-8 h-8" />
                    <span className="text-2xl font-black tracking-tighter italic uppercase">ASSEC</span>
                  </div>
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{userData.status}</span>
                </div>
                <div>
                  <p className="text-[10px] text-blue-300 uppercase tracking-[0.2em] font-bold mb-1">Identificação Funcional Associativa</p>
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">{userData.name}</h3>
                  <p className="text-sm text-blue-200 opacity-80 mb-4">{userData.org}</p>
                  <div className="flex justify-between items-end border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Matrícula</p>
                        <p className="font-mono text-xl">{userData.id}</p>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-inner shadow-blue-900/40">
                        <QrCode className="text-blue-950 w-full h-full" />
                      </div>
                  </div>
                </div>
            </div>
          </div>

          <Card className="divide-y divide-slate-100">
            <div className="pb-4 mb-4 flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">CPF</span>
                <span className="text-slate-700 font-bold">{userData.cpf}</span>
            </div>
            <div className="py-4 mb-4 flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">RG</span>
                <span className="text-slate-700 font-bold">{userData.rg}</span>
            </div>
            <div className="pt-4 flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Associado Desde</span>
                <span className="text-slate-700 font-bold">{userData.since}</span>
            </div>
          </Card>

          <div className="flex gap-4">
            <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95">
              <Download className="w-5 h-5" /> Salvar PDF
            </button>
            <button className="flex-1 bg-white border border-slate-200 text-slate-800 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95">
              <QrCode className="w-5 h-5" /> Validar
            </button>
          </div>
      </div>
    </motion.div>
  );
}
