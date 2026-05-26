import { motion } from "motion/react";
import { ChevronRight, Scale, Stethoscope, Tent, Users, Heart, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const BENEFITS = [
  {
    icon: <Scale className="w-8 h-8 text-yellow-500" />,
    title: "Assistência Jurídica 24h",
    description: "Defesa especializada para questões funcionais e disciplinares, protegendo quem protege o Ceará."
  },
  {
    icon: <Stethoscope className="w-8 h-8 text-blue-500" />,
    title: "Saúde e Bem-estar",
    description: "Convênios com os melhores planos de saúde, odontológicos e clínicas especializadas para você e sua família."
  },
  {
    icon: <Tent className="w-8 h-8 text-green-500" />,
    title: "Lazer e Descanso",
    description: "Acesso a clubes próprios, pousadas e parcerias em todo o estado para o seu merecido descanso."
  },
  {
    icon: <Users className="w-8 h-8 text-indigo-500" />,
    title: "Representação Ativa",
    description: "Voz forte junto aos órgãos governamentais por melhores salários, condições de trabalho e dignidade."
  },
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "Auxílio Natalidade",
    description: "Apoio financeiro e social no momento mais importante da sua família: a chegada de um novo membro."
  },
  {
    icon: <Briefcase className="w-8 h-8 text-gray-500" />,
    title: "Seguro de Vida",
    description: "Apólices exclusivas com coberturas abrangentes, garantindo o futuro de quem você mais ama."
  }
];

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Vantagens Exclusivas</h2>
          <p className="text-4xl md:text-5xl font-bold text-blue-950 tracking-tight">O que você ganha ao ser ASSEC</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-3">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/beneficios" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
            Ver todos os benefícios detalhados <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
