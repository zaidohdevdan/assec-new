import * as React from "react";
import Link from "next/link";
import { Shield, FileText, CheckCircle2, TrendingUp, Users, ArrowRight, Scale, Palmtree, HeartPulse, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "ASSEC | Associação dos Servidores da Segurança do Ceará",
  description: "Portal Oficial da ASSEC Ceará. Força, transparência e benefícios exclusivos para os servidores da segurança pública do Estado do Ceará.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full animate-none">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 sm:py-24 border-b border-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <Shield className="h-16 w-16 text-accent mb-6" />
          <h1 className="font-serif font-bold text-4xl sm:text-6xl max-w-4xl leading-tight mb-6">
            Força, Transparência e Representatividade
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mb-8">
            Unindo e defendendo os servidores da segurança pública do Estado do Ceará com integridade e compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center">
            <Button asChild variant="accent" className="w-full sm:w-auto h-auto py-3.5 px-8 font-semibold text-center text-sm sm:text-base animate-none">
              <Link href="/associe-se" aria-label="Associe-se à Associação dos Servidores da Segurança do Ceará">
                Associe-se Agora
              </Link>
            </Button>
            <Button asChild variant="outlineWhite" className="w-full sm:w-auto h-auto py-3.5 px-8 font-semibold text-center text-sm sm:text-base animate-none">
              <Link href="/sobre" aria-label="Saiba mais sobre a história e objetivos da ASSEC">
                Saiba Mais
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-accent-dark mb-2" />
              <span className="text-4xl font-extrabold text-primary font-sans">
                Em Expansão
              </span>
              <span className="text-text-secondary text-sm font-medium mt-1">
                Crescendo e fortalecendo nossa base diariamente
              </span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-8 w-8 text-accent-dark mb-2" />
              <span className="text-4xl font-extrabold text-primary font-sans">
                Criada em 2026
              </span>
              <span className="text-text-secondary text-sm font-medium mt-1 max-w-xs">
                Uma associação que nasceu em 2026 com um compromisso antigo: defender quem protege o Ceará.
              </span>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="h-8 w-8 text-accent-dark mb-2" />
              <span className="text-4xl font-extrabold text-primary font-sans">
                100% Foco
              </span>
              <span className="text-text-secondary text-sm font-medium mt-1">
                Na defesa intransigente e benefícios do servidor
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Preview */}
      <section className="py-16 sm:py-24 bg-bg-page border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">Nossos Benefícios</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-primary mt-2 mb-4">
              Vantagens Exclusivas para Nossos Associados
            </h2>
            <p className="text-text-secondary max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              A ASSEC atua de forma proativa para oferecer soluções reais que impactam positivamente a vida pessoal e profissional dos servidores e de seus dependentes. Conheça as nossas principais frentes de atuação:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card accentHover className="p-6 flex flex-col justify-between h-full group bg-white border border-border transition-all duration-300">
              <div>
                <div className="p-3 bg-primary/5 text-accent-dark rounded-xl w-fit mb-5 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-primary mb-3">
                  Assessoria Jurídica
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
                  Defesa técnica e suporte especializado para resguardar a atuação profissional e a carreira do servidor de segurança pública.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Defesa em processos administrativos (PADs)</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Acompanhamento em sindicâncias</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Consultas jurídicas preventivas</span>
                  </li>
                </ul>
              </div>
              <Link href="/beneficios?cat=jurídico" aria-label="Conhecer assessoria jurídica oferecida pela ASSEC" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded w-fit mt-auto">
                <span>Conhecer assessoria</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            <Card accentHover className="p-6 flex flex-col justify-between h-full group bg-white border border-border transition-all duration-300">
              <div>
                <div className="p-3 bg-primary/5 text-accent-dark rounded-xl w-fit mb-5 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                  <Palmtree className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-primary mb-3">
                  Lazer & Turismo
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
                  Convênios de hospedagem e turismo para proporcionar momentos inesquecíveis de descanso para você e sua família.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Pousadas parceiras no litoral e na serra</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tarifas e pacotes altamente atrativos</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Reservas descomplicadas pelo portal</span>
                  </li>
                </ul>
              </div>
              <Link href="/beneficios?cat=lazer" aria-label="Ver destinos de lazer e turismo parceiros da ASSEC" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded w-fit mt-auto">
                <span>Ver destinos</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            <Card accentHover className="p-6 flex flex-col justify-between h-full group bg-white border border-border transition-all duration-300">
              <div>
                <div className="p-3 bg-primary/5 text-accent-dark rounded-xl w-fit mb-5 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-primary mb-3">
                  Saúde & Bem-Estar
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
                  Rede de apoio médico, odontológico e terapêutico com condições exclusivas para promover o bem-estar do associado.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Planos de saúde e odontológicos especiais</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Descontos em exames e consultas clínicas</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Parceria com redes de farmácias</span>
                  </li>
                </ul>
              </div>
              <Link href="/beneficios?cat=saúde" aria-label="Explorar convênios de saúde e bem-estar para associados" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded w-fit mt-auto">
                <span>Explorar convênios</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            <Card accentHover className="p-6 flex flex-col justify-between h-full group bg-white border border-border transition-all duration-300">
              <div>
                <div className="p-3 bg-primary/5 text-accent-dark rounded-xl w-fit mb-5 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-primary mb-3">
                  Educação & Parcerias
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
                  Oportunidades de crescimento acadêmico e parcerias comerciais com vantagens imperdíveis no dia a dia.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Descontos em universidades e escolas de idiomas</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Vantagens em academias e centros de saúde</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ampla rede de comércios credenciados</span>
                  </li>
                </ul>
              </div>
              <Link href="/beneficios?cat=educação" aria-label="Ver rede de descontos em educação e parcerias" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded w-fit mt-auto">
                <span>Ver rede de descontos</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="bg-bg-page border-t border-border py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-primary mb-6">
            Fortaleça a Sua Categoria Profissional
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Faça parte de uma associação atuante que busca sempre a melhoria das condições de vida e trabalho de nossos servidores.
          </p>
          <Button asChild variant="accent" className="w-full sm:w-auto h-auto py-3.5 px-10 font-bold text-center text-sm sm:text-base animate-none">
            <Link href="/associe-se" aria-label="Quero me associar à ASSEC">
              Quero me Associar
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
