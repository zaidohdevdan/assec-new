import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, CheckCircle2, TrendingUp, Users, ArrowRight, Scale, Palmtree, HeartPulse, GraduationCap, Brain, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PreAssociateForm } from "@/components/ui/PreAssociateForm";
import { NewsCarousel } from "@/components/home/NewsCarousel";
import { VideoShortsSection } from "@/components/home/VideoShortsSection";
import { JuridicoVideoWrapper } from "@/components/home/JuridicoVideoWrapper";

export const metadata = {
  title: "ASSEC | Associação dos Servidores da Segurança do Ceará",
  description: "Portal Oficial da ASSEC Ceará. Força, transparência e benefícios exclusivos para os servidores da segurança pública do Estado do Ceará.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full animate-none">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-24 sm:py-32 lg:py-40 border-b border-primary-light overflow-hidden">
        {/* Background image optimized with Next.js Image Component */}
        <Image
          src="/banner-header.webp"
          alt="Banner representando a união das forças de segurança do Ceará com seus agentes fardados e viaturas"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-center transition-transform duration-1000 transform scale-102"
        />
        {/* Dark gradients to ensure contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent lg:to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-transparent to-primary/40" />
        <div className="absolute inset-0 bg-black/50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent mb-6 backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Associação Oficial</span>
            </div>
            
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6 text-white drop-shadow-md">
              Força, Transparência e <span className="text-accent drop-shadow-none">Representatividade</span>
            </h1>
            
            <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-8 leading-relaxed max-w-2xl drop-shadow-sm">
              Unindo e defendendo os servidores da segurança pública do Estado do Ceará com integridade, compromisso e benefícios exclusivos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild variant="accent" className="w-full sm:w-auto h-auto py-3.5 px-8 font-semibold text-center text-sm sm:text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <Link href="/associe-se" aria-label="Associe-se à Associação dos Servidores da Segurança do Ceará">
                  Associe-se Agora
                </Link>
              </Button>
              <Button asChild variant="outlineWhite" className="w-full sm:w-auto h-auto py-3.5 px-8 font-semibold text-center text-sm sm:text-base backdrop-blur-sm bg-white/5 hover:bg-white/10 border-white/40">
                <Link href="/sobre" aria-label="Saiba mais sobre a história e objetivos da ASSEC">
                  Saiba Mais
                </Link>
              </Button>
            </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Destaque Jurídico com Vídeo (5 Colunas) */}
            <div className="lg:col-span-5 flex">
              <Card accentHover className="p-6 sm:p-8 flex flex-col justify-between h-full w-full group bg-white border border-border transition-all duration-300 shadow-sm hover:shadow-md">
                <div>
                  <div className="p-3 bg-primary/5 text-accent-dark rounded-xl w-fit mb-5 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                    <Scale className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-primary mb-3">
                    Assessoria Jurídica
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                    Defesa técnica e suporte especializado para resguardar a atuação profissional e a carreira do servidor de segurança pública.
                  </p>
                  
                  {/* Interactive YouTube Shorts Lightbox Preview */}
                  <JuridicoVideoWrapper />

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2 text-xs text-text-secondary">
                      <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Defesa em processos administrativos (PADs) e sindicâncias</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs text-text-secondary">
                      <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Acompanhamento especializado em inquéritos policiais</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs text-text-secondary">
                      <svg className="h-4 w-4 text-support shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Consultas jurídicas preventivas e ações de interesse coletivo</span>
                    </li>
                  </ul>
                </div>
                <Link href="/beneficios?cat=jurídico" aria-label="Conhecer assessoria jurídica oferecida pela ASSEC" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded w-fit mt-auto pt-4 border-t border-border w-full">
                  <span>Conhecer assessoria completa</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            </div>

            {/* Grid de Benefícios Conveniados (7 Colunas) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                
                {/* Lazer & Turismo */}
                <Card accentHover className="p-5 flex flex-col justify-between h-full group bg-white border border-border transition-all duration-300">
                  <div>
                    <div className="p-2.5 bg-primary/5 text-accent-dark rounded-lg w-fit mb-4 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                      <Palmtree className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-primary mb-2">
                      Lazer & Turismo
                    </h3>
                    <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
                      Convênios de hospedagem e turismo para proporcionar momentos inesquecíveis de descanso para você e sua família.
                    </p>
                  </div>
                  <Link href="/beneficios?cat=lazer" aria-label="Ver destinos de lazer e turismo parceiros da ASSEC" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-xs sm:text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded w-fit mt-auto">
                    <span>Ver destinos</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Card>

                {/* Saúde & Bem-Estar */}
                <Card accentHover className="p-5 flex flex-col justify-between h-full group bg-white border border-border transition-all duration-300">
                  <div>
                    <div className="p-2.5 bg-primary/5 text-accent-dark rounded-lg w-fit mb-4 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                      <HeartPulse className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-primary mb-2">
                      Saúde & Bem-Estar
                    </h3>
                    <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
                      Rede de apoio médico, odontológico e terapêutico com condições exclusivas para promover o bem-estar do associado.
                    </p>
                  </div>
                  <Link href="/beneficios?cat=saúde" aria-label="Explorar convênios de saúde e bem-estar para associados" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-xs sm:text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded w-fit mt-auto">
                    <span>Explorar convênios</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Card>

                {/* Educação & Parcerias */}
                <Card accentHover className="p-5 flex flex-col justify-between h-full group bg-white border border-border transition-all duration-300">
                  <div>
                    <div className="p-2.5 bg-primary/5 text-accent-dark rounded-lg w-fit mb-4 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-primary mb-2">
                      Educação & Parcerias
                    </h3>
                    <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
                      Oportunidades de crescimento acadêmico e parcerias comerciais com vantagens imperdíveis no dia a dia.
                    </p>
                  </div>
                  <Link href="/beneficios?cat=educação" aria-label="Ver rede de descontos em educação e parcerias" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-xs sm:text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded w-fit mt-auto">
                    <span>Ver rede de descontos</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Card>

                {/* Apoio Psicológico */}
                <Card accentHover className="p-5 flex flex-col justify-between h-full group bg-white border border-border transition-all duration-300">
                  <div>
                    <div className="p-2.5 bg-primary/5 text-accent-dark rounded-lg w-fit mb-4 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                      <Brain className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-primary mb-2">
                      Apoio Psicológico
                    </h3>
                    <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
                      Suporte especializado à saúde mental e psicoterapia para aliviar o estresse inerente à rotina da segurança pública.
                    </p>
                  </div>
                  <Link href="/beneficios?cat=saúde" aria-label="Ver suporte psicológico oferecido pela ASSEC" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-xs sm:text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded w-fit mt-auto">
                    <span>Ver suporte</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Card>

                {/* Assistência & Proteção Social */}
                <Card accentHover className="p-5 flex flex-col justify-between h-full group bg-white border border-border transition-all duration-300 sm:col-span-2">
                  <div>
                    <div className="p-2.5 bg-primary/5 text-accent-dark rounded-lg w-fit mb-4 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-primary mb-2">
                      Assistência & Proteção Social
                    </h3>
                    <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
                      Programas de suporte familiar, seguro coletivo de proteção e auxílio mútuo em momentos de necessidade ou vulnerabilidade.
                    </p>
                  </div>
                  <Link href="/beneficios?cat=assistência" aria-label="Conhecer programas de assistência social" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-xs sm:text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded w-fit mt-auto">
                    <span>Conhecer assistência</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vídeos e Shorts Recentes */}
      <VideoShortsSection />

      {/* Carousel de Notícias */}
      <NewsCarousel />

      {/* Pre-Association Form Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">Filiação Online</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-primary mt-2 mb-4">
              Faça Sua Pré-Associação
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Deseja aproveitar todas as vantagens e ter o respaldo da ASSEC? Preencha o formulário abaixo e nossa equipe entrará em contato para finalizar o seu cadastro.
            </p>
          </div>
          <PreAssociateForm />
        </div>
      </section>
    </div>
  );
}
