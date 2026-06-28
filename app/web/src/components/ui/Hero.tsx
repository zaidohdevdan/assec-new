import { Shield, Scale, HeartPulse, GraduationCap, Palmtree, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const pilares = [
  {
    icon: Scale,
    title: "Defesa Jurídica Especializada",
    description:
      "Um corpo de advogados pronto para agir com rapidez nas especificidades da atividade policial e do sistema prisional (PADs, sindicâncias e defesas funcionais).",
  },
  {
    icon: HeartPulse,
    title: "Saúde e Bem-Estar",
    description:
      "Convênios com planos de saúde, odontológicos e suporte psicológico focado nas exigências e no estresse da nossa rotina.",
  },
  {
    icon: GraduationCap,
    title: "Parcerias Estratégicas",
    description:
      "Descontos em clubes de tiro, lojas de equipamentos táticos, faculdades e escolas para os seus filhos.",
  },
  {
    icon: Palmtree,
    title: "Lazer e Descanso",
    description:
      "Uma rede de vantagens e convênios em hotéis e pousadas parceiras para o seu momento de folga.",
  },
];

export default function InstitutionalMessage() {
  return (
    <section
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{ backgroundColor: "#F1F5F9" }}
      aria-label="Mensagem institucional da ASSEC"
    >
      {/* Subtle decorative blurs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Shield className="h-4 w-4 text-accent-dark" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Uma Nova Força
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-center leading-tight mb-6 text-primary">
          Nasce Uma Nova Força.
          <br />
          <span className="text-accent-dark">Bem-Vindo à ASSEC!</span>
        </h2>

        {/* Divider */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-1 bg-gradient-to-r from-accent-dark/0 via-accent-dark to-accent-dark/0 rounded-full" />
        </div>

        {/* Body text */}
        <div className="max-w-3xl mx-auto space-y-5 text-center text-text-secondary text-sm sm:text-base leading-relaxed">
          <p>
            Viver a realidade da segurança pública no Ceará é uma missão diária
            que exige coragem, entrega e resiliência. Quem garante a ordem na
            sociedade e mantém a tranca firme no sistema prisional sabe que o
            risco é constante e a rotina, desafiadora.
          </p>
          <p className="text-primary font-medium text-base sm:text-lg italic">
            Mas quem cuida de você enquanto você protege o Estado?
          </p>
          <p>
            É para responder a essa pergunta que nasce a{" "}
            <strong className="text-primary">
              ASSEC — Associação dos Profissionais da Segurança do Ceará.
            </strong>
          </p>
          <p>
            A ASSEC nasce moderna, ágil e com um único propósito:{" "}
            <strong className="text-accent-dark">
              dar proteção ao operador de segurança e apoiar a sua família!
            </strong>{" "}
            Chegou a hora de ter ao seu lado uma instituição que fala a sua
            língua e entende seu dia a dia.
          </p>
        </div>

        {/* Pilares */}
        <div className="mt-14 mb-14">
          <h3 className="text-center text-xs font-bold uppercase tracking-widest text-accent-dark mb-8">
            Conheça os Pilares da ASSEC
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pilares.map((pilar) => (
              <div
                key={pilar.title}
                className="group bg-white border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-accent/40 hover:-translate-y-0.5"
              >
                <div className="p-2.5 bg-primary/5 text-accent-dark rounded-lg w-fit mb-4 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                  <pilar.icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-primary text-sm mb-2">
                  {pilar.title}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {pilar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote + CTA */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-px bg-border" />
          </div>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Uma nova história se constrói com união.{" "}
            <strong className="text-primary">
              Fortalecer a ASSEC é valorizar a nossa farda.
            </strong>
          </p>
          <p className="text-accent-dark font-semibold text-base sm:text-lg">
            Não espere o imprevisto acontecer para se proteger.
          </p>

          <Button
            asChild
            variant="accent"
            className="h-auto py-3.5 px-10 font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
          >
            <Link
              href="/associe-se"
              aria-label="Faça sua filiação agora na ASSEC"
            >
              Faça sua filiação agora
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>

          {/* Signature */}
          <div className="pt-8 border-t border-border mt-8">
            <p className="text-accent-dark font-serif font-bold text-sm sm:text-base tracking-wide">
              ASSEC: Força, Amparo e Valorização para o Profissional de
              Segurança do Ceará.
            </p>
            <p className="text-text-muted text-xs mt-2 uppercase tracking-widest">
              Presidente: Valdenia Oliveira
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

