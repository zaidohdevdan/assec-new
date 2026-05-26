import { Bell, User } from "lucide-react";

interface DashboardHeaderProps {
  userData: { name: string };
}

export default function DashboardHeader({ userData }: DashboardHeaderProps) {
  return (
    <header className="hidden lg:flex bg-white/80 backdrop-blur-md border-b border-slate-200 px-12 py-6 justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 bg-linear-to-br from-blue-100 to-blue-50 rounded-[1.25rem] flex items-center justify-center shadow-inner">
          <User className="text-blue-600 w-7 h-7" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status de Conexão</p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-black text-blue-950 uppercase tracking-tight">Portal Ativo</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-blue-900 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white uppercase italic">AS</div>
          <p className="text-sm font-bold text-blue-950">{userData.name.split(' ')[userData.name.split(' ').length - 1]}</p>
        </div>
        <button 
        title="Notificações" 
        type="button"
        className="p-3 bg-white border border-slate-200 rounded-xl relative hover:bg-slate-50 transition-all text-slate-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
