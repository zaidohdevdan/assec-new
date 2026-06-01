import { useState, useEffect } from "react";
import { User, CreditCard, CalendarDays, LayoutDashboard, Menu, X, Mail, ShieldCheck } from "lucide-react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import OverviewTab from "../components/dashboard/tabs/OverviewTab";
import WalletTab from "../components/dashboard/tabs/WalletTab";
import SchedulesTab from "../components/dashboard/tabs/SchedulesTab";
import { useAuthStore } from "../store/useAuthStore";
import { scheduleService } from "../services/scheduleService";

function Dashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(user?.role === "ADMIN" ? "admin-dashboard" : "inicio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);

  // Sync active tab when role changes
  useEffect(() => {
    if (user?.role === "ADMIN") {
      setActiveTab("admin-dashboard");
    } else {
      setActiveTab("inicio");
    }
  }, [user]);

  // Fetch schedules for regular users
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await scheduleService.getAll();
        setSchedules(data);
      } catch (e) {
        console.error("Failed to load schedules", e);
      }
    };
    fetchSchedules();
  }, []);

  const userData = {
    name: user?.name || "Usuário Desconhecido",
    id: user?.matricula || user?.id || "N/A",
    status: user?.status || "Inativo",
    org: user?.org || "",
    since: user?.since || new Date().toISOString(),
    cpf: user?.cpf || "",
    rg: user?.rg || "",
  };

  const isAdmin = user?.role === "ADMIN";
  const menuItems = isAdmin
    ? [
      { id: "admin-dashboard", label: "Painel Admin", icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: "admin-usuarios", label: "Gestão de Usuários", icon: <User className="w-5 h-5" /> },
      { id: "admin-mensagens", label: "Mensagens de Contato", icon: <Mail className="w-5 h-5" /> },
    ]
    : [
      { id: "inicio", label: "Visão Geral", icon: <User className="w-5 h-5" /> },
      { id: "carteira", label: "Carteira Digital", icon: <CreditCard className="w-5 h-5" /> },
      { id: "agendamentos", label: "Agendamentos", icon: <CalendarDays className="w-5 h-5" /> },
    ];

  const renderContent = () => {
    switch (activeTab) {
      case "inicio":
        return <OverviewTab setActiveTab={setActiveTab} />;
      case "carteira":
        return <WalletTab userData={userData} />;
      case "agendamentos":
        return <SchedulesTab schedules={schedules} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-blue-950 text-white p-5 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-yellow-400 w-6 h-6" />
          <span className="font-black tracking-tighter text-xl italic uppercase">ASSEC</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/10 rounded-xl">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <DashboardSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <DashboardHeader userData={userData} />
        {/* Scrollable Body */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full max-w-6xl mx-auto scroll-smooth relative z-10">
          <div className="mb-12">
            <p className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-2">{activeTab}</p>
            <h2 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tight leading-none">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
