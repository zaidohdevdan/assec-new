
import { motion } from "motion/react";
import { 
  Scale, 
  Stethoscope, 
  Heart,
  Handshake,
  ArrowRight,
  ClipboardCheck,
  ShieldAlert,
  Gavel
 } from "lucide-react";

export default function Services() {
  const mainServices = [
    {
      icon: <Scale className="w-12 h-12 text-blue-600" />,
      title: "Assessoria Jurídica",
      desc: "Nossa equipe multidisciplinar atua em todas as esferas do direito, com foco especial em causas relacionadas ao exercício da função policial e administrativa.",
      features: ["Defesa Disciplinar", "Flagrantes Operacionais", "Ações de Promoção", "Direito de Família"]
    },
    {
      icon: <Stethoscope className="w-12 h-12 text-red-500" />,
      title: "Saúde e Convênios",
      desc: "Gerenciamos parcerias estratégicas para garantir que o associado tenha acesso ao melhor sistema de saúde do estado com custos reduzidos.",
      features: ["Planos de Saúde", "Odontologia Especializada", "Psicologia Social", "Farmácia Própria"]
    },
    {
      icon: <Handshake className="w-12 h-12 text-green-500" />,
      title: "Parcerias Corporativas",
      desc: "Rede ampla de descontos em serviços essenciais, lazer e educação para potencializar o poder de compra do servidor.",
      features: ["Faculdades e Escolas", "Lojas de Veículos", "Cursos de Tiro", "Academias"]
    }
  ];

  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-950 mb-6">Nossos <span className="text-blue-600">Serviços</span></h1>
          <p className="text-xl text-slate-600">Trabalhamos incansavelmente para oferecer soluções que impactam positivamente a vida funcional e pessoal do servidor.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {mainServices.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col"
            >
              <div className="mb-8">{service.icon}</div>
              <h3 className="text-2xl font-bold text-blue-950 mb-4">{service.title}</h3>
              <p className="text-slate-600 mb-8 grow leading-relaxed">{service.desc}</p>
              <ul className="space-y-3 mb-10">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                    <ArrowRight className="w-4 h-4 text-blue-400" /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Saber Mais
              </button>
            </motion.div>
          ))}
        </div>

        {/* Specialized Legal Section */}
        <section className="bg-blue-950 rounded-[3rem] p-8 md:p-20 text-white overflow-hidden relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Gavel className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Plantão Jurídico 24h</h2>
              </div>
              <p className="text-blue-200 text-lg mb-10 leading-relaxed">
                Entendemos que a segurança pública não para. Por isso, mantemos uma central de emergência jurídica ativa 24 horas por dia para casos de flagrantes e ocorrências disciplinares urgentes.
              </p>
              <div className="space-y-6">
                {[
                  { icon: <ShieldAlert className="w-6 h-6 text-yellow-400" />, text: "Atendimento imediato em ocorrências operacionais." },
                  { icon: <ClipboardCheck className="w-6 h-6 text-yellow-400" />, text: "Orientação técnica antes de depoimentos." },
                  { icon: <Heart className="w-6 h-6 text-yellow-400" />, text: "Apoio humanizado para o servidor e família." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    {item.icon}
                    <p className="text-white font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
               <h4 className="text-xl font-bold mb-6">Solicitar Atendimento</h4>
               <div className="space-y-4">
                  <input type="text" placeholder="Seu nome operacional" className="w-full bg-white/10 border-white/20 border p-4 rounded-xl focus:outline-none focus:border-blue-500" />
                  <input type="tel" placeholder="Telefone de contato" className="w-full bg-white/10 border-white/20 border p-4 rounded-xl focus:outline-none focus:border-blue-500" />
                  <textarea placeholder="Breve descrição da urgência" className="w-full bg-white/10 border-white/20 border p-4 rounded-xl h-32 focus:outline-none focus:border-blue-500"></textarea>
                  <button className="w-full py-4 bg-blue-600 rounded-xl font-black text-lg hover:bg-blue-500 transition-all">Enviar Urgência</button>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
