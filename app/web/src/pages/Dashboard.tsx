// app/web/src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, CalendarDays, Wallet } from "lucide-react";
import { dashboardService } from "../services/dashboard.service";
import { User, Schedule } from "../types";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import OverviewTab from "../components/dashboard/tabs/OverviewTab";
import SchedulesTab from "../components/dashboard/tabs/SchedulesTab";
import WalletTab from "../components/dashboard/tabs/WalletTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const menuItems = [
    { id: "inicio", label: "Visão Geral", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "agendamentos", label: "Agendamentos", icon: <CalendarDays className="w-5 h-5" /> },
    { id: "carteira", label: "Minha Carteira", icon: <Wallet className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const token = localStorage.getItem('@assec/token');
    if (!token) {
      navigate('/area-associado');
      return;
    }

    async function loadData() {
      try {
        const [user, userSchedules] = await Promise.all([
          dashboardService.getUserProfile(),
          dashboardService.getSchedules(),
        ]);
        setUserData(user);
        setSchedules(userSchedules);
        setError(null);
      } catch (err) {
        console.error("❌ Erro ao carregar dashboard:", err);

        const message = err && typeof err === 'object' && 'message' in err
          ? (err as any).message
          : err instanceof Error
            ? err.message
            : 'Erro ao carregar dados';

        setError(message);

        const statusCode = err && typeof err === 'object' && (('statusCode' in err && (err as any).statusCode) || ('status' in err && (err as any).status));
        if (statusCode === 401) {
          localStorage.removeItem('@assec/token');
          navigate('/area-associado');
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Erro ao carregar</h2>
          <p className="text-slate-500 mb-6">{error || 'Não foi possível carregar seus dados'}</p>
          <button
            onClick={() => navigate('/area-associado')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Voltar para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
      />

      {/* Overlay móvel */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader userData={userData} />

        {/* Mobile Menu Button */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-950">ASSEC</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-8">
          {activeTab === "inicio" && (
            <OverviewTab setActiveTab={setActiveTab} />
          )}
          {activeTab === "agendamentos" && (
            <SchedulesTab schedules={schedules}/>
          )}
          {activeTab === "carteira" && (
            <WalletTab userData={userData} />
          )}
        </main>
      </div>
    </div>
  );
}