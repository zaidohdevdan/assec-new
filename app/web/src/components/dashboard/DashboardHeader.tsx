import { Bell, User } from "lucide-react";

interface DashboardHeaderProps {
  userData: { name: string };
}

export default function DashboardHeader({ userData }: DashboardHeaderProps) {
  return (
    <header className="flex bg-[var(--surface)] border-b border-[var(--border)] px-6 md:px-12 py-6 justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 bg-[var(--gold-glow)] rounded-[1.25rem] flex items-center justify-center border border-[var(--border-gold)]">
          <User className="text-[var(--gold)] w-7 h-7" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status de Conexão</p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-black text-[var(--ink)] uppercase tracking-tight">Portal Ativo</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-3 px-4 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center text-[10px] font-bold text-white uppercase italic">AS</div>
          <p className="text-sm font-bold text-[var(--ink)]">{userData.name.split(' ')[userData.name.split(' ').length - 1]}</p>
        </div>
        <button
          title="Notificações"
          type="button"
          className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl relative hover:bg-[var(--surface-2)] transition-all text-[var(--ink-muted)]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
