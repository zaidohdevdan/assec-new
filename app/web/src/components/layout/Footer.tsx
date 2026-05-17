/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Phone, Mail, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="contato" className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-yellow-400 w-6 h-6" />
              <span className="text-2xl font-bold tracking-tighter">ASSEC</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Associação dos Servidores da Segurança Pública do Ceará. Fundada em 1999 para garantir os direitos e o bem-estar de nossos heróis.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Links Rápidos</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/transparencia" className="hover:text-white transition-colors">Transparência</Link></li>
              <li><Link to="/beneficios" className="hover:text-white transition-colors">Clube de Vantagens</Link></li>
              <li><Link to="/noticias" className="hover:text-white transition-colors">Notícias</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">Convênios</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Fale Conosco</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-blue-500" /> (85) 3217-1234</li>
              <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-blue-500" /> contato@assec.org.br</li>
              <li className="flex items-center gap-3"><MapPin className="w-5 h-5 text-blue-500" /> Fortaleza, Ceará - Rua Exemplo, 123</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-slate-400 mb-4 text-sm">Receba informativos e notícias da categoria.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Seu e-mail" className="bg-slate-800 border-slate-700 border p-3 rounded-xl flex-1 focus:outline-none focus:border-blue-500" />
              <button className="p-3 bg-blue-600 rounded-xl"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-slate-800 text-slate-500 text-sm">
          <p>© 2026 ASSEC - Associação dos Servidores da Segurança do Ceará. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
