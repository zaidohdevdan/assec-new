import { motion } from "motion/react";
import { Plus, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative pt-16 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Plus className="w-3 h-3" /> Juntos somos mais fortes
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-blue-950 mb-6 tracking-tight">
              Protegendo quem <br />
              <span className="text-blue-600 italic font-serif">protege o Ceará.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              A ASSEC é a casa do servidor da segurança pública. Oferecemos suporte jurídico, benefícios exclusivos e a representação que você merece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/area-associado?mode=register" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 text-center">
                Quero me Associar <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/beneficios" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all text-center">
                Conhecer Vantagens
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
              <img 
                src="https://picsum.photos/seed/assec-security/800/600" 
                alt="Segurança Pública Ceará" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Stat */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
              <p className="text-3xl font-black text-blue-900">+15.000</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Associados Ativos</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
