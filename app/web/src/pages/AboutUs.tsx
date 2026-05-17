
import { motion } from "motion/react";
import { 
  History, 
  Target, 
  Eye, 
  Users2, 
  ShieldCheck,
  Building2,
  Landmark,
  FileText
 } from "lucide-react";

export default function About() {
  const values = [
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Integridade", desc: "Compromisso inabalável com a ética e a transparência em todas as nossas ações." },
    { icon: <Users2 className="w-6 h-6" />, title: "União", desc: "Acreditamos que a força da nossa categoria reside na coesão de seus membros." },
    { icon: <Target className="w-6 h-6" />, title: "Excelência", desc: "Busca constante pelos melhores serviços e representação para o associado." }
  ];

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="h-[40vh] bg-blue-900 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="https://picsum.photos/seed/assec-about/1200/600" 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
          alt="ASSEC Background"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Nossa História, <span className="text-yellow-400">Sua Força</span></h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">Conheça a trajetória da ASSEC na luta pelos servidores da segurança cearense.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 text-blue-600 font-bold mb-4">
              <History className="w-5 h-5" />
              <span>Desde 1999</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-blue-950 mb-8 leading-tight tracking-tight text-balance">
              Mais de duas décadas de compromisso e representatividade.
            </h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                A ASSEC foi concebida por um grupo de servidores que enxergavam a necessidade de uma voz institucional forte e independente. Ao longo dos anos, transformamo-nos na maior associação do gênero no Ceará.
              </p>
              <p>
                Hoje, não somos apenas uma entidade de representação política, mas um provedor completo de serviços, saúde e amparo para milhares de famílias de policiais, bombeiros e peritos.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4 pt-12">
              <div className="aspect-3/4 bg-slate-200 rounded-3xl overflow-hidden shadow-lg">
                <img src="https://picsum.photos/seed/history1/400/500" alt="History" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-3/4 bg-slate-200 rounded-3xl overflow-hidden shadow-lg">
                <img src="https://picsum.photos/seed/history2/400/500" alt="History" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square bg-blue-100 rounded-3xl p-8 flex flex-col justify-end">
                <Building2 className="w-10 h-10 text-blue-600 mb-4" />
                <p className="text-2xl font-bold text-blue-900 leading-none">Sede Própria</p>
                <p className="text-sm text-blue-700">Infraestrutura completa</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mission/Vision/Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {values.map((v, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white rounded-3xl shadow-sm border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {v.icon}
              </div>
              <h3 className="text-2xl font-bold text-blue-950 mb-4">{v.title}</h3>
              <p className="text-slate-600">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Transparency */}
        <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Portal da Transparência</h2>
            <p className="text-slate-400 text-lg mb-8">
              Acreditamos que a confiança é o alicerce de qualquer associação. Disponibilizamos mensalmente nossos relatórios financeiros, atas de reuniões e planejamentos estratégicos para consulta de todos os associados.
            </p>
            <button className="flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all">
              <FileText className="w-5 h-5" /> Acessar Documentos
            </button>
          </div>
          <div className="shrink-0">
             <Landmark className="w-48 h-48 text-slate-800" />
          </div>
        </section>
      </div>
    </div>
  );
}
