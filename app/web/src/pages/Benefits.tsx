import { motion } from "motion/react";
import { 
  Scale, 
  Stethoscope, 
  Tent, 
  Users, 
  Heart,
  Briefcase,
  CheckCircle2,
  Gem,
  Award
 } from "lucide-react";

export default function Benefits() {
  const categories = [
    {
      title: "Proteção e Amparo",
      items: [
        { icon: <Scale className="w-6 h-6 text-yellow-500" />, title: "Assessoria Jurídica Integral", desc: "Nossa equipe de advogados está pronta para atuar em causas criminais, cíveis e administrativas decorrentes da função." },
        { icon: <Briefcase className="w-6 h-6 text-blue-500" />, title: "Seguro de Vida Especializado", desc: "Apólice robusta que garante tranquilidade em situações críticas, com cobertura para invalidez e morte." }
      ]
    },
    {
      title: "Saúde e Reabilitação",
      items: [
        { icon: <Stethoscope className="w-6 h-6 text-red-500" />, title: "Convênio de Saúde", desc: "Parceria com as maiores operadoras do estado (Unimed, Hapvida) com tabelas exclusivas para associados." },
        { icon: <Heart className="w-6 h-6 text-pink-500" />, title: "Atendimento Psicológico", desc: "Rede de apoio mental focada no alto estresse da profissão de segurança pública." }
      ]
    },
    {
      title: "Bem-estar e Lazer",
      items: [
        { icon: <Tent className="w-6 h-6 text-green-500" />, title: "Clube da ASSEC", desc: "Espaço completo com churrasqueiras, piscinas e área de esportes para você e sua família." },
        { icon: <Award className="w-6 h-6 text-orange-500" />, title: "Colônia de Férias", desc: "Apartamentos mobiliados em praias do litoral cearense para momentos de descanso garantido." }
      ]
    }
  ];

  return (
    <div className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-blue-950 mb-6">Por que ser um <span className="text-blue-600">Associado ASSEC?</span></h1>
          <p className="text-xl text-slate-600">Conheça detalhadamente todos os pilares de apoio que construímos para você e seu núcleo familiar.</p>
        </motion.div>

        <div className="space-y-24">
          {categories.map((cat, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-blue-900 mb-8 flex items-center gap-3">
                <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                {cat.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {cat.items.map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex gap-6"
                  >
                    <div className="p-4 bg-slate-50 rounded-2xl h-fit">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-950 mb-2">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Exclusive Perks */}
        <section className="mt-32 p-12 bg-blue-50 rounded-[3rem] border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <Gem className="w-12 h-12 text-blue-600 mb-6" />
              <h2 className="text-3xl font-bold text-blue-950 mb-4">Clube de Vantagens ASSEC</h2>
              <p className="text-lg text-slate-600 mb-8">
                Muito além dos serviços básicos, oferecemos descontos em mais de 500 estabelecimentos parceiros em todo o Brasil.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Educação (Escolas/Faculdades)",
                  "Combustíveis",
                  "Restaurantes",
                  "Cinemas e Teatro",
                  "Lojas de Departamento",
                  "Farmácias"
                ].map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> {perk}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://picsum.photos/seed/assec-perks/600/400" 
                alt="Clube de Vantagens" 
                className="rounded-3xl shadow-lg ring-8 ring-white"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
