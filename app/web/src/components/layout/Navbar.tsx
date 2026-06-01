/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";
import { useAuthStore } from "../../store/useAuthStore";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/", { replace: true });
  };

  const handleDashboardClick = () => {
    setIsMenuOpen(false);
    const destination = user?.role === "ADMIN" ? "/admin-dashboard" : "/dashboard";
    navigate(destination);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="text-yellow-400 w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tighter text-blue-900">ASSEC</span>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-none">
                Associação dos Servidores da Segurança do Estado do Ceará
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {!token ? (
              <>
                <Link to="/sobre" className="hover:text-blue-600 transition-colors">Sobre Nós</Link>
                <Link to="/beneficios" className="hover:text-blue-600 transition-colors">Benefícios</Link>
                <Link to="/servicos" className="hover:text-blue-600 transition-colors">Serviços</Link>
                <Link to="/pousadas" className="hover:text-blue-600 transition-colors">Lazer</Link>
                <Link to="/contato" className="hover:text-blue-600 transition-colors">Contato</Link>
                <Link to="/area-associado" className="bg-blue-900 text-white px-6 py-2.5 rounded-full hover:bg-blue-800 transition-all shadow-md active:scale-95">
                  Área do Associado
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleDashboardClick}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200 transition-all font-bold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Meu Painel
                </button>

                <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-slate-900 font-bold text-sm">
                    {user?.name?.split(' ')[0] || "Usuário"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-xl"
        >
          {!token ? (
            <>
              <Link to="/beneficios" className="block text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>Benefícios</Link>
              <Link to="/servicos" className="block text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>Serviços</Link>
              <Link to="/sobre" className="block text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>Sobre Nós</Link>
              <Link to="/contato" className="block text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>Contato</Link>
              <Link to="/area-associado" className="block w-full bg-blue-900 text-white py-3 rounded-xl font-bold text-center" onClick={() => setIsMenuOpen(false)}>
                Área do Associado
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Conectado como</p>
                  <p className="text-slate-900 font-bold">{user?.name || "Usuário"}</p>
                </div>
              </div>

              <button
                onClick={handleDashboardClick}
                className="w-full flex items-center gap-2 px-4 py-3 bg-blue-100 text-blue-900 rounded-xl hover:bg-blue-200 transition-all font-bold"
              >
                <LayoutDashboard className="w-5 h-5" />
                Ir para Meu Painel
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all font-bold"
              >
                <LogOut className="w-5 h-5" />
                Sair do Portal
              </button>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
}
