import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion } from "motion/react";

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
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const visibleMenuItems = menuItems.filter(item => {
    if (item.id.startsWith('admin-')) {
      return user?.role === 'ADMIN';
    }
    return true;
  });

  return (
    <aside className={`
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
      fixed lg:sticky top-0 left-0 w-72 bg-[var(--surface)] border-r border-[var(--border)] text-[var(--ink)] p-8 h-screen z-40 transition-transform duration-300 ease-in-out flex flex-col
    `}>
      <div className="hidden lg:flex items-center gap-3 mb-16">
        <motion.img
          src="/logomarca.jpeg"
          alt="ASSEC Logo"
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-10 h-10 rounded-lg object-contain flex-shrink-0"
        />
        <span className="text-2xl font-black tracking-tighter italic uppercase text-[var(--ink)]">ASSEC</span>
      </div>

      <nav className="space-y-3 grow">
        {visibleMenuItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-[var(--gold)] text-white shadow-[0_10px_20px_var(--gold-glow)] translate-x-1 ring-1 ring-[var(--gold-dim)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]'}`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-[var(--border)] mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 text-red-600 hover:text-red-800 font-bold transition-colors group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Sair do Portal
        </button>
      </div>
    </aside>
  );
}
