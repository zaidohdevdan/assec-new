import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, CheckCircle2, ArrowRight, Scale, Palmtree, HeartPulse, GraduationCap, Brain, HeartHandshake, ExternalLink, Clock, FileCheck2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PreAssociateForm } from "@/components/ui/PreAssociateForm";
import { NewsCarousel } from "@/components/home/NewsCarousel";
import { VideoShortsSection } from "@/components/home/VideoShortsSection";
import { HeroJuridicoVideoWrapper } from "@/components/home/HeroJuridicoVideoWrapper";
import { PlantaoJuridicoBadge } from "@/components/home/PlantaoJuridicoBadge";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "ASSEC | Associação dos Servidores da Segurança do Ceará",
  description: "Portal Oficial da ASSEC Ceará. Força, transparência e benefícios exclusivos para os servidores da segurança pública do Estado do Ceará.",
  path: "/",
});

const API_BASE =
  process.env.INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

async function getRecentNotices() {
  try {
    const res = await fetch(`${API_BASE}/notices`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch {
    // Graceful fallback during build / offline
  }
  return [];
}

export default async function HomePage() {
  const recentNotices = await getRecentNotices();
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

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-4">
                <Button asChild variant="accent" className="w-full sm:w-auto h-auto py-3.5 px-8 font-semibold text-center text-sm sm:text-base bg-[#D4AF37] text-[#071A2D] hover:bg-[#F0C75E] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  <Link href="#pre-associacao" aria-label="Fazer pré-associação online na ASSEC">
                    Associe-se à ASSEC
                  </Link>
                </Button>
                <Button asChild variant="outlineWhite" className="w-full sm:w-auto h-auto py-3.5 px-8 font-semibold text-center text-sm sm:text-base backdrop-blur-sm bg-white/5 hover:bg-white/10 border-white/30 text-white transition-all">
                  <Link href="#beneficios" aria-label="Conhecer os benefícios e a assessoria jurídica da ASSEC">
                    Ver Benefícios e Proteção
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-gray-300/90 mb-8 flex items-center gap-2 font-sans">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                <span>Pré-cadastro online em 1 minuto • Ativos, Reserva, Reformados e Pensionistas</span>
              </p>

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
                    src="/foto-policiapenal.webp"
                    alt="Policiais Penais do Ceará"
                    fill
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


      {/* Faixa de Aderência Institucional & Quem Representamos */}
      <section className="bg-white border-b border-border py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-gray-100">
            <div className="max-w-xl">
              <span className="text-accent-dark uppercase tracking-widest text-[11px] font-bold font-sans">
                Representatividade Estadual
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-primary mt-1">
                Quem Pode se Associar à ASSEC
              </h2>
              <p className="text-text-secondary text-xs sm:text-sm mt-1 leading-relaxed">
                Acolhemos servidores da ativa, reserva remunerada, reformados, pensionistas e seus dependentes em todas as forças de segurança do Ceará:
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {[
                { code: "PMCE", name: "Polícia Militar" },
                { code: "PCCE", name: "Polícia Civil" },
                { code: "PPCE", name: "Polícia Penal" },
                { code: "CBMCE", name: "Bombeiro Militar" },
                { code: "PEFOCE", name: "Perícia Forense" },
              ].map((corp) => (
                <div
                  key={corp.code}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-border text-primary text-xs font-semibold shadow-2xs"
                >
                  <span className="font-extrabold text-accent-dark">{corp.code}</span>
                  <span className="text-gray-300">•</span>
                  <span>{corp.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Pilares de Valor Imediato */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/5 text-accent-dark border border-primary/10 shrink-0 mt-0.5">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary font-sans">
                  Blindagem Jurídica 24h
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mt-1">
                  Advogados especialistas em Direito Militar, Administrativo e Criminal de prontidão para ocorrências e processos disciplinares.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/5 text-accent-dark border border-primary/10 shrink-0 mt-0.5">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary font-sans">
                  Proteção Familiar Completa
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mt-1">
                  Extensão dos convênios de saúde, psicologia, educação e lazer para cônjuges e dependentes sem burocracia.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/5 text-accent-dark border border-primary/10 shrink-0 mt-0.5">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary font-sans">
                  Gestão Moderna e Transparente
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mt-1">
                  Fundada em 2026 com portal digital do associado, carteira funcional com QR Code e acompanhamento online de demandas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Benefits Preview */}
      <section id="beneficios" className="py-16 sm:py-24 bg-bg-page border-b border-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">Nossos Benefícios</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-primary mt-2 mb-4">
              Vantagens Exclusivas para Nossos Associados
            </h2>
            <p className="text-text-secondary max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              A ASSEC atua de forma proativa para oferecer soluções reais que impactam positivamente a vida pessoal e profissional dos servidores e de seus dependentes. Conheça as nossas principais frentes de atuação:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Destaque Jurídico Estruturado (5 Colunas) */}
            <div id="assessoria-juridica" className="lg:col-span-5 flex scroll-mt-24">
              <Card accentHover className="p-6 sm:p-8 flex flex-col justify-between h-full w-full group bg-white border border-border transition-all duration-300 shadow-sm hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="p-3 bg-primary/5 text-accent-dark rounded-xl w-fit group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                      <Scale className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Plantão 24 Horas
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-2xl text-primary mb-3">
                    Assessoria Jurídica Especializada
                  </h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Defesa técnica intransigente para resguardar a atuação operacional, a estabilidade e os direitos de carreira do servidor de segurança pública em todo o Ceará.
                  </p>

                  {/* 4 Frentes Jurídicas Escaneáveis */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 mb-6">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-100 flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-support shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wide">
                          PAD, Sindicância e Conselho
                        </h4>
                        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                          Defesa administrativa completa perante a CGD e corregedorias.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-100 flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-support shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wide">
                          Inquéritos (IPM e Policial) e Flagrantes
                        </h4>
                        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                          Acompanhamento presencial imediato em ocorrências de serviço e delegacias.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-100 flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-support shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wide">
                          Direitos de Carreira e Fazenda Pública
                        </h4>
                        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                          Promoções, implantação de gratificações, licenças, reforma e pensões.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-100 flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-support shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wide">
                          Consultoria Preventiva e Ações Coletivas
                        </h4>
                        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                          Orientação jurídica individualizada e atuação em demandas da categoria.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/beneficios?cat=jurídico" aria-label="Conhecer assessoria jurídica oferecida pela ASSEC" className="inline-flex items-center justify-between text-accent-dark font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded mt-auto pt-4 border-t border-border w-full">
                  <span>Conhecer assessoria jurídica completa</span>
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

          {/* CTA de Transição para Catálogo Completo ou Filiação */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="primary" className="w-full sm:w-auto px-8 py-3 h-auto text-sm font-semibold">
              <Link href="/beneficios">
                Explorar Todos os Convênios
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto px-8 py-3 h-auto text-sm font-semibold">
              <Link href="#pre-associacao">
                Quero Garantir Meus Benefícios
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Carousel de Notícias e Atuação Institucional (SSR) */}
      <NewsCarousel initialArticles={recentNotices} />

      {/* Vídeos e Shorts Recentes */}
      <VideoShortsSection />

      {/* Pre-Association Form Section — Layout de Alta Conversão em 2 Colunas */}
      <section id="pre-associacao" className="py-16 sm:py-24 bg-white border-b border-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Coluna Esquerda: Jornada de Filiação em 3 Passos + Garantias */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">
                  Filiação Online Simplificada
                </span>
                <h2 className="font-serif font-bold text-3xl sm:text-4xl text-primary mt-2 mb-4 leading-tight">
                  Associe-se em 3 Passos Simples
                </h2>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  Garanta o respaldo jurídico e todos os convênios da ASSEC para você e sua família sem precisar sair de casa.
                </p>
              </div>

              {/* Passo a Passo */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-primary text-accent font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    1
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base text-primary">
                      Envie seu Pré-Cadastro Online
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                      Preencha seus dados básicos e órgão de lotação no formulário ao lado em menos de 1 minuto.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-primary text-accent font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    2
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base text-primary">
                      Validação Rápida pelo WhatsApp
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                      Nossa equipe de atendimento entra em contato para confirmar sua documentação funcional e tirar dúvidas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-primary text-accent font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    3
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base text-primary">
                      Proteção e Carteira Digital Ativas
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                      Você recebe acesso ao Portal do Associado, Carteira Funcional com QR Code, Plantão Jurídico 24h e rede de descontos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Selos de Confiança e Opção de Ficha PDF */}
              <div className="p-5 rounded-xl bg-slate-50 border border-border space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-primary">
                  <Clock className="h-4 w-4 text-accent-dark shrink-0" />
                  <span>Retorno rápido da equipe em horário comercial</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-primary">
                  <Lock className="h-4 w-4 text-accent-dark shrink-0" />
                  <span>Dados protegidos em conformidade com a LGPD</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
                  <span className="text-xs text-text-secondary flex items-center gap-1.5">
                    <FileCheck2 className="h-4 w-4 text-accent-dark shrink-0" />
                    Prefere preencher a ficha em PDF?
                  </span>
                  <Link
                    href="/associe-se"
                    className="text-xs font-bold text-accent-dark hover:underline whitespace-nowrap"
                  >
                    Ver página completa →
                  </Link>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Formulário de Pré-Associação */}
            <div className="lg:col-span-7 w-full">
              <PreAssociateForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
