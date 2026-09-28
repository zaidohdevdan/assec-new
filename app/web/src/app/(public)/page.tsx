import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, CheckCircle2, TrendingUp, Users, ArrowRight, Scale, Palmtree, HeartPulse, GraduationCap, Brain, HeartHandshake, Instagram, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PreAssociateForm } from "@/components/ui/PreAssociateForm";
import { NewsCarousel } from "@/components/home/NewsCarousel";
import { VideoShortsSection } from "@/components/home/VideoShortsSection";
import { JuridicoVideoWrapper } from "@/components/home/JuridicoVideoWrapper";
import { HeroJuridicoVideoWrapper } from "@/components/home/HeroJuridicoVideoWrapper";
import { PlantaoJuridicoBadge } from "@/components/home/PlantaoJuridicoBadge";

export const metadata = {
  title: "ASSEC | Associação dos Servidores da Segurança do Ceará",
  description: "Portal Oficial da ASSEC Ceará. Força, transparência e benefícios exclusivos para os servidores da segurança pública do Estado do Ceará.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full animate-none">
      {/* Hero Section - Estrutura Humanizada, Tipografia Impecável e Tema ASSEC */}
      <section className="relative bg-[#071A2D] text-white py-16 sm:py-20 lg:py-24 border-b border-[#0a2439] overflow-hidden">
        {/* Camadas sutis de profundidade e iluminação institucional */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#071A2D] via-[#0E2B47] to-[#051322] opacity-95 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

            {/* Coluna da Esquerda: Tipografia & Ação (5 Colunas) */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] mb-6 backdrop-blur-md shadow-sm">
                <Shield className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider font-sans">Associação dos Servidores da Segurança do Ceará</span>
              </div>

              <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white mb-6 tracking-tight">
                Quem protege o Ceará também merece ser <span className="text-[#D4AF37] relative inline-block font-extrabold">cuidado e defendido</span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed max-w-xl font-sans">
                União, suporte jurídico de prontidão, saúde e assistência real para policiais militares, civis, penais, bombeiros e peritos forenses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
                <Button asChild variant="accent" className="w-full sm:w-auto h-auto py-3.5 px-8 font-semibold text-center text-sm sm:text-base bg-[#D4AF37] text-[#071A2D] hover:bg-[#F0C75E] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  <Link href="/associe-se" aria-label="Associe-se à ASSEC">
                    Associe-se à ASSEC
                  </Link>
                </Button>
                <Button asChild variant="outlineWhite" className="w-full sm:w-auto h-auto py-3.5 px-8 font-semibold text-center text-sm sm:text-base backdrop-blur-sm bg-white/5 hover:bg-white/10 border-white/30 text-white transition-all">
                  <Link href="/sobre" aria-label="Conheça a história e propósitos da ASSEC">
                    Conheça Nossos Valores
                  </Link>
                </Button>
              </div>

              {/* Indicadores de credibilidade humana com tipografia refinada */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 w-full">
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] font-sans tracking-tight">24h</span>
                  <span className="text-xs text-gray-300 font-medium mt-0.5">Plantão Jurídico</span>
                </div>
                <div className="flex flex-col border-l border-white/15 pl-4">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">100%</span>
                  <span className="text-xs text-gray-300 font-medium mt-0.5">Foco no Servidor</span>
                </div>
                <div className="flex flex-col border-l border-white/15 pl-4">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] font-sans tracking-tight">Ceará</span>
                  <span className="text-xs text-gray-300 font-medium mt-0.5">Capital e Interior</span>
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Grid unificado — 4 cards + vídeo row-span-2 */}
            <div className="lg:col-span-7 relative w-full flex flex-col gap-3 sm:gap-3.5">

              {/* Grid principal: 2 colunas no mobile, 3 colunas iguais no md+ */}
              {/* O vídeo usa row-span-2: o browser garante que ele tem EXATAMENTE a altura dos 2 cards + gap e a mesma largura */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5 md:grid-cols-3">

                {/* 1. Polícia Militar */}
                <div className="relative h-44 sm:h-48 md:h-[188px] lg:h-[205px] rounded-2xl overflow-hidden border border-white/20 bg-[#0E2B47] shadow-xl group order-1">
                  <Image
                    src="/foto-policia.jpg"
                    alt="Polícia Militar do Ceará"
                    fill
                    priority
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A2D] via-black/25 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#071A2D]/90 px-2 py-0.5 rounded backdrop-blur-sm border border-[#D4AF37]/30 mb-0.5">
                      Polícia Militar
                    </span>
                    <p className="text-white text-xs font-semibold leading-tight drop-shadow-sm">PMCE na linha de frente</p>
                  </div>
                </div>

                {/* 2. Polícia Civil */}
                <div className="relative h-44 sm:h-48 md:h-[188px] lg:h-[205px] rounded-2xl overflow-hidden border border-white/20 bg-[#0E2B47] shadow-xl group order-2">
                  <Image
                    src="/foto-policiacivil.jpg"
                    alt="Polícia Civil do Ceará"
                    fill
                    priority
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A2D] via-black/25 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#071A2D]/90 px-2 py-0.5 rounded backdrop-blur-sm border border-[#D4AF37]/30 mb-0.5">
                      Polícia Civil
                    </span>
                    <p className="text-white text-xs font-semibold leading-tight drop-shadow-sm">PCCE e investigação</p>
                  </div>
                </div>

                {/* Vídeo — mobile: abaixo dos 4 cards (order-5, col-span-2) */}
                {/*         md+:   3ª coluna, row-span-2 (altura automática = 2 cards + gap) */}
                <div className="col-span-2 order-5 h-[220px] sm:h-[260px] md:col-span-1 md:row-span-2 md:h-auto md:order-3">
                  <HeroJuridicoVideoWrapper />
                </div>

                {/* 3. Bombeiros & Perícia */}
                <div className="relative h-44 sm:h-48 md:h-[188px] lg:h-[205px] rounded-2xl overflow-hidden border border-white/20 bg-[#0E2B47] shadow-xl group order-3 md:order-4">
                  <Image
                    src="/foto-bombeiro.jpg"
                    alt="Corpo de Bombeiros e Perícia Forense"
                    fill
                    priority
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A2D] via-black/25 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#071A2D]/90 px-2 py-0.5 rounded backdrop-blur-sm border border-[#D4AF37]/30 mb-0.5">
                      Bombeiros & Perícia
                    </span>
                    <p className="text-white text-xs font-semibold leading-tight drop-shadow-sm">CBMCE e PEFOCE</p>
                  </div>
                </div>

                {/* 4. Polícia Penal */}
                <div className="relative h-44 sm:h-48 md:h-[188px] lg:h-[205px] rounded-2xl overflow-hidden border border-white/20 bg-[#0E2B47] shadow-xl group order-4 md:order-5">
                  <Image
                    src="/foto-policiapenal.jpg"
                    alt="Policiais Penais do Ceará"
                    fill
                    priority
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A2D] via-black/25 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#071A2D]/90 px-2 py-0.5 rounded backdrop-blur-sm border border-[#D4AF37]/30 mb-0.5">
                      Polícia Penal
                    </span>
                    <p className="text-white text-xs font-semibold leading-tight drop-shadow-sm">Disciplina e custódia</p>
                  </div>
                </div>

              </div>

              {/* Barra de Ações Rápidas: no mobile logos arredondadas lado a lado, no desktop cards completos */}
              <div className="flex items-center justify-center gap-4 sm:grid sm:grid-cols-3 sm:gap-3.5 w-full">
                {/* 1. Instagram */}
                <a
                  href="https://instagram.com/assec.ceara"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Acessar Instagram Oficial da ASSEC Ceará"
                  className="relative h-16 w-16 sm:h-20 sm:w-full rounded-2xl overflow-hidden border border-white/20 bg-[#0E2B47] shadow-xl p-1 sm:p-3.5 flex items-center justify-center sm:justify-start gap-3.5 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:scale-105 sm:hover:scale-[1.02] shrink-0 sm:shrink group"
                >
                  <div className="relative h-full w-full sm:h-14 sm:w-14 shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform sm:border sm:border-white/10 bg-black/20">
                    <Image
                      src="/logo-instagram.svg"
                      alt="Instagram ASSEC"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="hidden sm:flex text-left flex-col justify-center min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide uppercase leading-tight truncate group-hover:text-[#D4AF37] transition-colors">
                        Instagram
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#D4AF37] transition-colors shrink-0" />
                    </div>
                    <span className="text-[11px] sm:text-xs text-[#D4AF37] font-bold tracking-tight mt-1 truncate">
                      @assec.ceara
                    </span>
                  </div>
                </a>

                {/* 2. YouTube */}
                <a
                  href="https://www.youtube.com/@ASSEC-CE"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Acessar Canal do YouTube da ASSEC Ceará"
                  className="relative h-16 w-16 sm:h-20 sm:w-full rounded-2xl overflow-hidden border border-white/20 bg-[#0E2B47] shadow-xl p-1 sm:p-3.5 flex items-center justify-center sm:justify-start gap-3.5 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:scale-105 sm:hover:scale-[1.02] shrink-0 sm:shrink group"
                >
                  <div className="relative h-full w-full sm:h-14 sm:w-14 shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform sm:border sm:border-white/10 bg-black/20">
                    <Image
                      src="/logo-youtube.svg"
                      alt="YouTube ASSEC"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="hidden sm:flex text-left flex-col justify-center min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide uppercase leading-tight truncate group-hover:text-[#D4AF37] transition-colors">
                        YouTube
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#D4AF37] transition-colors shrink-0" />
                    </div>
                    <span className="text-[11px] sm:text-xs text-[#D4AF37] font-bold tracking-tight mt-1 truncate">
                      @ASSEC-CE
                    </span>
                  </div>
                </a>

                {/* 3. Plantão Jurídico 24h */}
                <PlantaoJuridicoBadge />
              </div>

            </div>


          </div>
        </div>
      </section>


      {/* Stats Section — Faixa escura de credibilidade */}
      <section className="bg-[#071A2D] border-b border-[#0a2439] py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-white/10">
            {/* 1. Base Crescente */}
            <div className="flex flex-col sm:items-center text-left sm:text-center sm:px-6 lg:px-8">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 shrink-0">
                  <Users className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white font-sans tracking-tight whitespace-nowrap">
                  Base Crescente
                </h3>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm font-normal leading-relaxed max-w-xs">
                Novos associados todos os dias. A ASSEC cresce junto com a categoria.
              </p>
            </div>

            {/* 2. Fundada em 2026 */}
            <div className="flex flex-col sm:items-center text-left sm:text-center sm:px-6 lg:px-8">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white font-sans tracking-tight whitespace-nowrap">
                  Fundada em 2026
                </h3>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm font-normal leading-relaxed max-w-xs">
                Uma nova era: gestão moderna, transparente e combativa para os servidores.
              </p>
            </div>

            {/* 3. 100% Foco */}
            <div className="flex flex-col sm:items-center text-left sm:text-center sm:px-6 lg:px-8">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 shrink-0">
                  <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white font-sans tracking-tight whitespace-nowrap">
                  100% Foco
                </h3>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm font-normal leading-relaxed max-w-xs">
                Na defesa jurídica intransigente, saúde, lazer e valorização do servidor.
              </p>
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
