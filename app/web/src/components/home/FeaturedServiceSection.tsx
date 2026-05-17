import { motion } from "motion/react";
import { Plus, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturedServiceSection() {
  return (
    <section id="servicos" className="py-24 bg-blue-950 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                Proteção Jurídica Especializada em <span className="text-yellow-400 font-serif italic">Tempo Integral</span>
              </h2>
              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full shrink-0 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-blue-950" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Acompanhamento em flagrantes</h4>
                    <p className="text-blue-200">Suporte presencial em situações de urgência operacional.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full shrink-0 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-blue-950" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Defesa em PADs</h4>
                    <p className="text-blue-200">Assessoria completa em Processos Administrativos Disciplinares.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full shrink-0 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-blue-950" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Ações Ordinárias</h4>
                    <p className="text-blue-200">Busca por direitos financeiros, correções e gratificações.</p>
                  </div>
                </div>
              </div>
              <Link to="/servicos" className="inline-block bg-yellow-400 text-blue-950 px-8 py-4 rounded-2xl font-black text-lg hover:bg-yellow-300 transition-all">
                Conhecer Nossos Serviços
              </Link>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square bg-blue-900 rounded-[4rem] flex items-center justify-center transform rotate-3 relative overflow-hidden">
                  <Scale className="w-48 h-48 text-blue-800 absolute -bottom-12 -right-12" />
                  <div className="relative z-10 text-center p-12">
                    <p className="text-6xl font-black mb-2 tracking-tighter">100%</p>
                    <p className="text-xl font-medium text-blue-200">Compromisso com o Associado</p>
                  </div>
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
