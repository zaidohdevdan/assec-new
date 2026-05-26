import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, LogOut } from "lucide-react";

interface DashboardSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  menuItems: Array<{ id: string; label: string; icon: React.ReactNode }>;
}

export default function DashboardSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
  setActiveTab,
  menuItems
}: DashboardSidebarProps) {
  return (
    <aside className={`
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
      fixed lg:sticky top-0 left-0 w-72 bg-blue-950 text-white p-8 h-screen z-40 transition-transform duration-300 ease-in-out flex flex-col
    `}>
      <div className="hidden lg:flex items-center gap-3 mb-16">
        <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center shadow-2xl border border-blue-700">
          <ShieldCheck className="text-yellow-400 w-7 h-7" />
        </div>
        <span className="text-3xl font-black tracking-tighter italic uppercase">ASSEC</span>
      </div>

      <nav className="space-y-3 grow">
        {menuItems.map(item => (
          <button 
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-2xl translate-x-2 ring-1 ring-white/20' : 'text-blue-300 hover:text-white hover:bg-white/5'}`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-white/10 mt-auto">
        <Link to="/" className="flex items-center gap-4 p-4 text-red-300 hover:text-red-100 font-bold transition-colors group">
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Sair do Portal
        </Link>
      </div>
    </aside>
  );
}
