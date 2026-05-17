/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { motion } from "motion/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-none">Segurança Ceará</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/beneficios" className="hover:text-blue-600 transition-colors">Benefícios</Link>
            <Link to="/servicos" className="hover:text-blue-600 transition-colors">Serviços</Link>
            <Link to="/pousadas" className="hover:text-blue-600 transition-colors">Pousadas</Link>
            <Link to="/sobre" className="hover:text-blue-600 transition-colors">Sobre Nós</Link>
            <Link to="/contato" className="hover:text-blue-600 transition-colors">Contato</Link>
            <Link to="/area-associado" className="bg-blue-900 text-white px-6 py-2.5 rounded-full hover:bg-blue-800 transition-all shadow-md active:scale-95">
              Área do Associado
            </Link>
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
          <Link to="/beneficios" className="block text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>Benefícios</Link>
          <Link to="/servicos" className="block text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>Serviços</Link>
          <Link to="/sobre" className="block text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>Sobre Nós</Link>
          <Link to="/contato" className="block text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>Contato</Link>
          <Link to="/area-associado" className="block w-full bg-blue-900 text-white py-3 rounded-xl font-bold text-center" onClick={() => setIsMenuOpen(false)}>
            Área do Associado
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
