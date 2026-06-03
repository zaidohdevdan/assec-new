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
          <div className="bg-[var(--ink)] border border-[var(--border-gold)] rounded-2xl p-8 text-white shadow-lg shadow-[var(--gold-glow)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-[var(--gold)] w-8 h-8" />
                    <span className="text-2xl font-black tracking-tighter italic uppercase text-white">ASSEC</span>
                  </div>
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{userData.status}</span>
                </div>
                <div className="mt-8">
                  <p className="text-[10px] text-[var(--gold)] uppercase tracking-[0.2em] font-bold mb-1">Identificação Funcional Associativa</p>
                  <h3 className="text-2xl font-bold mb-1 tracking-tight text-white">{userData.name}</h3>
                  <p className="text-sm text-slate-300 opacity-80 mb-4">{userData.org}</p>
                  <div className="flex justify-between items-end border-t border-[var(--border-gold)] pt-4">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Matrícula</p>
                        <p className="font-mono text-xl text-white">{userData.id}</p>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-inner">
                        <QrCode className="text-[var(--ink)] w-full h-full" />
                      </div>
                  </div>
                </div>
            </div>
          </div>

          <Card className="divide-y divide-slate-100">
            <div className="pb-4 mb-4 flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">CPF</span>
                <span className="text-[var(--ink)] font-bold">{userData.cpf}</span>
            </div>
            <div className="py-4 mb-4 flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">RG</span>
                <span className="text-[var(--ink)] font-bold">{userData.rg}</span>
            </div>
            <div className="pt-4 flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Associado Desde</span>
                <span className="text-[var(--ink)] font-bold">{userData.since}</span>
            </div>
          </Card>

          <div className="flex gap-4">
            <button className="flex-1 bg-[var(--gold)] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[var(--gold-dim)] transition-all active:scale-95 shadow-md cursor-pointer">
              <Download className="w-5 h-5" /> Salvar PDF
            </button>
            <button className="flex-1 bg-white border border-[var(--border)] text-[var(--ink)] py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[var(--surface-2)] hover:border-[var(--gold)] transition-all active:scale-95 cursor-pointer">
              <QrCode className="w-5 h-5" /> Validar
            </button>
          </div>
      </div>
    </motion.div>
  );
}
