import * as React from "react";
import Image from "next/image";
import {
  Shield,
  BookOpen,
  Target,
  Users,
  Scale,
  ClipboardCheck,
  UserCheck,
  Users2,
  FileText,
  HeartPulse,
  GraduationCap,
  Palmtree
} from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Sobre Nós | História, Missão e Diretoria da Associação",
  description: "Conheça a história, missão, valores e organograma completo da Associação dos Servidores da Segurança do Ceará.",
};

export default function SobrePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-none">
      <div className="text-center mb-12">
        <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">Quem Somos</span>
        <h1 className="font-serif font-bold text-4xl text-primary mt-2">
          Associação dos Servidores da Segurança do Ceará
        </h1>
        <p className="text-text-secondary max-w-3xl mx-auto mt-4 text-base sm:text-lg">
          Trabalhamos incansavelmente para apoiar, defender e trazer benefícios significativos para os servidores da segurança pública e suas famílias.
        </p>
      </div>

      {/* ── Mensagem Institucional & Logomarca Mescladas (Clean Layout) ── */}
      <div className="mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">

          {/* Left Column: Welcoming Text */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Badge */}
            <div className="flex justify-start mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <Shield className="h-4 w-4 text-accent-dark" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Uma Nova Força
                </span>
              </div>
            </div>

            {/* Título */}
            <h2 className="font-serif font-bold text-3xl sm:text-4xl leading-tight mb-2 text-primary">
              Nasce Uma Nova Força.
            </h2>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl leading-tight mb-6 text-accent-dark">
              Bem-Vindo à ASSEC!
            </h2>

            {/* Corpo do texto */}
            <div className="space-y-4 text-text-secondary text-sm sm:text-base leading-relaxed">
              <p>
                Viver a realidade da segurança pública no Ceará é uma missão diária
                que exige coragem, entrega e resiliência. Quem garante a ordem na
                sociedade e mantém a tranca firme no sistema prisional sabe que o
                risco é constante e a rotina, desafiadora.
              </p>

              {/* Callout Box */}
              <div className="bg-accent/5 border-l-4 border-accent-dark p-4 rounded-r-lg my-6">
                <p className="text-primary font-medium italic">
                  Mas quem cuida de você enquanto você protege o Estado?
                </p>
              </div>

              <p>
                É para responder a essa pergunta que nasce a{" "}
                <strong className="text-primary">
                  ASSEC — Associação dos Servidores da Segurança do Ceará.
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
          </div>

          {/* Right Column: Logo Box */}
          <div className="lg:col-span-5 flex items-center justify-center p-8 bg-white border border-border rounded-2xl shadow-sm min-h-[320px] transition-all hover:shadow-md">
            <Image
              src="/escudo-logo.webp"
              alt="Logomarca oficial da ASSEC"
              width={500}
              height={279}
              className="w-full max-w-[300px] h-auto object-contain transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>

        </div>

        {/* Pilares da ASSEC */}
        <div className="border-t border-border pt-16 mb-16">
          <h3 className="text-center text-xs font-bold uppercase tracking-widest text-accent-dark mb-10">
            Conheça os Pilares da ASSEC
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-accent-dark/40 hover:-translate-y-1">
              <div className="p-2.5 bg-accent/10 text-accent-dark rounded-lg w-fit mb-4">
                <Scale className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-primary text-sm mb-2">
                Defesa Jurídica Especializada
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                Um corpo de advogados pronto para agir com rapidez nas especificidades
                da atividade policial e do sistema prisional (PADs, sindicâncias e
                defesas funcionais).
              </p>
            </div>

            <div className="bg-white border border-border rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-accent-dark/40 hover:-translate-y-1">
              <div className="p-2.5 bg-accent/10 text-accent-dark rounded-lg w-fit mb-4">
                <HeartPulse className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-primary text-sm mb-2">
                Saúde e Bem-Estar
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                Convênios com planos de saúde, odontológicos e suporte psicológico
                focado nas exigências e no estresse da nossa rotina.
              </p>
            </div>

            <div className="bg-white border border-border rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-accent-dark/40 hover:-translate-y-1">
              <div className="p-2.5 bg-accent/10 text-accent-dark rounded-lg w-fit mb-4">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-primary text-sm mb-2">
                Parcerias Estratégicas
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                Descontos em clubes de tiro, lojas de equipamentos táticos,
                faculdades e escolas para os seus filhos.
              </p>
            </div>

            <div className="bg-white border border-border rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-accent-dark/40 hover:-translate-y-1">
              <div className="p-2.5 bg-accent/10 text-accent-dark rounded-lg w-fit mb-4">
                <Palmtree className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-primary text-sm mb-2">
                Lazer e Descanso
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                Uma rede de vantagens e convênios em hotéis e pousadas parceiras
                para o seu momento de folga.
              </p>
            </div>
          </div>
        </div>

        {/* Encerramento & Assinatura */}
        <div className="bg-bg-page border border-border rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-4">
            Uma nova história se constrói com união.{" "}
            <strong className="text-primary font-semibold">
              Fortalecer a ASSEC é valorizar a nossa farda.
            </strong>
          </p>
          <p className="text-accent-dark font-semibold text-sm sm:text-base mb-8">
            Não espere o imprevisto acontecer para se proteger. Faça sua filiação agora mesmo!
          </p>

          <div className="w-16 h-0.5 bg-border mx-auto mb-6" />

          <p className="text-accent-dark font-serif font-bold text-sm sm:text-base tracking-wide">
            ASSEC: Força, Amparo e Valorização para o Profissional de Segurança do Ceará.
          </p>
          <p className="text-text-muted text-xs mt-2 uppercase tracking-widest">
            Presidente: Valdênia Arruda de Oliveira
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <Card>
          <Target className="h-8 w-8 text-accent-dark mb-4" />
          <h3 className="font-serif font-bold text-lg text-primary mb-2">Missão</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Representar e defender os associados perante os poderes públicos e a sociedade civil, oferecendo serviços e convênios de excelência.
          </p>
        </Card>
        <Card>
          <Shield className="h-8 w-8 text-accent-dark mb-4" />
          <h3 className="font-serif font-bold text-lg text-primary mb-2">Valores</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Integridade, transparência na gestão financeira, compromisso inabalável com a categoria e responsabilidade social.
          </p>
        </Card>
        <Card>
          <BookOpen className="h-8 w-8 text-accent-dark mb-4" />
          <h3 className="font-serif font-bold text-lg text-primary mb-2">Visão</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Ser reconhecida como a principal referência em representação e suporte aos servidores de segurança do Ceará.
          </p>
        </Card>
      </div>

      {/* Organograma Section */}
      <div className="border-t border-border pt-20">
        <div className="text-center mb-16">
          <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">Gestão 2026 - 2029</span>
          <h2 className="font-serif font-bold text-3xl text-primary mt-2">
            Organograma Institucional
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            Estrutura de governança e corpo administrativo constituídos formalmente conforme Ata de Assembleia Geral e Estatuto Social da ASSEC.
          </p>
        </div>

        {/* Level 1: Assembleia Geral */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary text-white border border-primary-light rounded-xl shadow-md px-10 py-6 text-center max-w-md w-full transition-all hover:scale-[1.01] hover:shadow-lg duration-300 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Users className="h-6 w-6 text-accent mx-auto mb-2" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-accent-light block">Órgão Deliberativo Máximo</span>
            <h3 className="font-serif font-bold text-xl mt-1">Assembleia Geral</h3>
            <p className="text-xs text-gray-300 mt-1">Composta por todos os associados em pleno gozo de seus direitos</p>
          </div>
          <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-border"></div>
        </div>

        {/* Level 2: Conselho Fiscal & Assessoria Jurídica */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Conselho Fiscal */}
          <div className="bg-white border border-border rounded-xl shadow-sm p-6 transition-all hover:shadow-md hover:border-accent/40 duration-300">
            <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
              <ClipboardCheck className="h-5 w-5 text-accent-dark" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-accent-dark block">Órgão Fiscalizador</span>
                <h3 className="font-serif font-bold text-lg text-primary">Conselho Fiscal</h3>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-50/60 p-3 rounded-lg border border-border">
                <span className="text-[9px] uppercase font-bold text-text-muted block">Presidente</span>
                <span className="font-sans font-bold text-sm text-primary block">João Paulo Gomes do Amaral</span>
                <span className="text-[10px] text-text-secondary block">Policial Militar</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50/60 p-3 rounded-lg border border-border">
                  <span className="text-[9px] uppercase font-bold text-text-muted block">Membro Titular (Relator)</span>
                  <span className="font-sans font-semibold text-xs text-primary block">Daniel Ferreira de Almeida</span>
                  <span className="text-[10px] text-text-secondary block">Policial Penal</span>
                </div>
                <div className="bg-slate-50/60 p-3 rounded-lg border border-border">
                  <span className="text-[9px] uppercase font-bold text-text-muted block">Membro Titular (Secretário)</span>
                  <span className="font-sans font-semibold text-xs text-primary block">Francisco Eugênio Freitas de Carvalho</span>
                  <span className="text-[10px] text-text-secondary block">Policial Penal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assessoria Jurídica */}
          <div className="bg-white border border-border rounded-xl shadow-sm p-6 transition-all hover:shadow-md hover:border-accent/40 duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
                <Scale className="h-5 w-5 text-accent-dark" />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-accent-dark block">Suporte Técnico-Legal</span>
                  <h3 className="font-serif font-bold text-lg text-primary">Assessoria Jurídica</h3>
                </div>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-lg border border-border mb-4">
                <span className="text-[9px] uppercase font-bold text-text-muted block">Advogado Titular</span>
                <span className="font-serif font-bold text-base text-primary block">Dr. Marcílio Lélis Prata</span>
                <span className="text-[11px] text-text-secondary block mt-1">OAB/CE Nº 24.530</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary italic leading-relaxed">
              Resguardo jurídico completo, representação processual coletiva e individual de associados, e assessoria estatutária para a Diretoria Executiva.
            </p>
          </div>
        </div>

        {/* Connecting Line to Diretoria Executiva */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-0.5 h-8 bg-border"></div>
          <div className="bg-primary text-white border border-primary-light rounded-full px-8 py-3 text-center text-xs font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-accent" />
            Diretoria Executiva
          </div>
          <div className="w-0.5 h-6 bg-border"></div>
        </div>

        {/* Level 4: Presidente & Vice-Presidente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          <Card className="border-l-4 border-l-accent-dark p-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-accent-dark">Diretora Presidente</span>
              <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded font-semibold">Policial Penal</span>
            </div>
            <h4 className="font-serif font-bold text-xl text-primary">Valdênia Arruda de Oliveira</h4>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              Representação política e jurídica da entidade, administração geral do patrimônio e coordenação superior dos departamentos.
            </p>
          </Card>

          <Card className="border-l-4 border-l-accent-dark p-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-accent-dark">Diretor Vice-Presidente</span>
              <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded font-semibold">Policial Militar</span>
            </div>
            <h4 className="font-serif font-bold text-xl text-primary">Djones Fagner de Lima Menezes</h4>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              Substituição estatutária imediata da presidência e assessoria direta na coordenação de projetos estratégicos.
            </p>
          </Card>
        </div>

        {/* Level 5: Secretário-Geral & Tesoureiro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="border-l-4 border-l-slate-400 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Diretor Secretário Geral</span>
              <span className="text-[10px] bg-slate-100 text-text-secondary px-2.5 py-0.5 rounded">Policial Militar</span>
            </div>
            <h4 className="font-serif font-bold text-lg text-primary">Alberto Bevinievisque Alves Araújo</h4>
            <p className="text-xs text-text-secondary mt-2">
              Supervisão de correspondências, atas, cadastros sociais, controle de reuniões e arquivos centrais da associação.
            </p>
          </Card>

          <Card className="border-l-4 border-l-slate-400 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Diretor Financeiro</span>
              <span className="text-[10px] bg-slate-100 text-text-secondary px-2.5 py-0.5 rounded">Policial Militar</span>
            </div>
            <h4 className="font-serif font-bold text-lg text-primary">Lauro Lima Silva</h4>
            <p className="text-xs text-text-secondary mt-2">
              Gestão de fundos monetários, arrecadação, pagamentos autorizados e prestação de contas periódica perante o conselho.
            </p>
          </Card>
        </div>

        {/* Level 6: Secretarias Setoriais */}
        <div className="text-center mb-8">
          <div className="inline-block h-0.5 w-16 bg-slate-200 mb-2"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary block">Diretorias Setoriais Executivas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto mb-16">
          <Card className="p-5 flex flex-col justify-between items-center text-center bg-white border border-border shadow-sm hover:border-accent hover:shadow-md transition-all duration-300">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block mb-1">Administrativo</span>
              <h5 className="font-serif font-bold text-sm text-primary">Cristiano Batista Freire</h5>
              <span className="text-[10px] bg-slate-50 text-text-secondary px-2 py-0.5 rounded inline-block mt-1 font-semibold border border-border/60">Policial Penal</span>
            </div>
            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              Supervisão de patrimônio, contratos corporativos, almoxarifado e RH interno.
            </p>
          </Card>

          <Card className="p-5 flex flex-col justify-between items-center text-center bg-white border border-border shadow-sm hover:border-accent hover:shadow-md transition-all duration-300">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block mb-1">Esportes e Saúde</span>
              <h5 className="font-serif font-bold text-sm text-primary">Katia Michelle do N. Oliveira</h5>
              <span className="text-[10px] bg-slate-50 text-text-secondary px-2 py-0.5 rounded inline-block mt-1 font-semibold border border-border/60">Policial Penal</span>
            </div>
            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              Promoção de eventos desportivos, convênios laboratoriais e atividades físicas.
            </p>
          </Card>

          <Card className="p-5 flex flex-col justify-between items-center text-center bg-white border border-border shadow-sm hover:border-accent hover:shadow-md transition-all duration-300">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block mb-1">Família e Ação Social</span>
              <h5 className="font-serif font-bold text-sm text-primary">Francisco Henrique M. Ramos</h5>
              <span className="text-[10px] bg-slate-50 text-text-secondary px-2 py-0.5 rounded inline-block mt-1 font-semibold border border-border/60">Policial Militar</span>
            </div>
            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              Assistência funerária, suporte em situações de invalidez, seguros e eventos solidários.
            </p>
          </Card>

          <Card className="p-5 flex flex-col justify-between items-center text-center bg-white border border-border shadow-sm hover:border-accent hover:shadow-md transition-all duration-300">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block mb-1">Interior</span>
              <h5 className="font-serif font-bold text-sm text-primary">Antônio César Madeiro Lessa</h5>
              <span className="text-[10px] bg-slate-50 text-text-secondary px-2 py-0.5 rounded inline-block mt-1 font-semibold border border-border/60">Policial Militar</span>
            </div>
            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              Integração das regionais, núcleos de apoio no interior e suporte de alojamentos externos.
            </p>
          </Card>

          <Card className="p-5 flex flex-col justify-between items-center text-center bg-white border border-border shadow-sm hover:border-accent hover:shadow-md transition-all duration-300">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block mb-1">Metropolitano</span>
              <h5 className="font-serif font-bold text-sm text-primary">Paulo Sérgio Medeiros Pereira</h5>
              <span className="text-[10px] bg-slate-50 text-text-secondary px-2 py-0.5 rounded inline-block mt-1 font-semibold border border-border/60">Policial Penal</span>
            </div>
            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              Expansão comercial, convênios na Região Metropolitana de Fortaleza e lazer.
            </p>
          </Card>
        </div>

        {/* Level 7: Membros Suplentes */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 max-w-4xl mx-auto shadow-sm mb-16">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 justify-center">
            <Users2 className="h-5 w-5 text-accent-dark" />
            <h4 className="font-serif font-bold text-base text-primary uppercase tracking-wider">Membros Suplentes de Gestão</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Suplentes Diretoria */}
            <div>
              <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 text-center border-b border-slate-200/60 pb-1.5">
                Diretoria Executiva Suplente
              </h5>
              <ul className="space-y-3">
                <li className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-sans font-semibold text-xs text-primary block">Sandra Timóteo Figueiredo</span>
                    <span className="text-[10px] text-text-secondary">Policial Penal</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded font-medium">Suplente Geral</span>
                </li>
                <li className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-sans font-semibold text-xs text-primary block">Manoel Serafim da Silva</span>
                    <span className="text-[10px] text-text-secondary">Policial Penal</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded font-medium">Suplente Geral</span>
                </li>
              </ul>
            </div>

            {/* Suplentes Conselho Fiscal */}
            <div>
              <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 text-center border-b border-slate-200/60 pb-1.5">
                Conselho Fiscal Suplente
              </h5>
              <ul className="space-y-3">
                <li className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-sans font-semibold text-xs text-primary block">Francisco Carlos Alencar Araripe</span>
                    <span className="text-[10px] text-text-secondary">Empresário</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded font-medium">Suplente 1º</span>
                </li>
                <li className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-sans font-semibold text-xs text-primary block">Genildo Raimundo de Souza</span>
                    <span className="text-[10px] text-text-secondary">Policial Penal</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded font-medium">Suplente 2º</span>
                </li>
                <li className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-sans font-semibold text-xs text-primary block">Reuwerth Raimny Brasil</span>
                    <span className="text-[10px] text-text-secondary">Policial Militar</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded font-medium">Suplente 3º</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Documentos Oficiais - Estatuto Social */}
        <div className="mt-16 bg-slate-900 text-white rounded-xl border border-slate-800 p-6 sm:p-8 shadow-lg max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex gap-4 items-start text-left">
            <div className="p-3 bg-white/10 text-accent rounded-lg shrink-0">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <span className="text-[10px] text-accent-light uppercase font-bold tracking-widest block">Documentação Oficial</span>
              <h3 className="font-serif font-bold text-xl mt-1">Estatuto Social da ASSEC</h3>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                Acesse e faça o download do Estatuto Social oficial da Associação dos Servidores da Segurança do Ceará, contendo as diretrizes, direitos e deveres dos associados.
              </p>
            </div>
          </div>
          <button
            disabled
            aria-disabled="true"
            aria-label="Download do Estatuto Social indisponível - Documento sob revisão para adequação à LGPD"
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-400 font-bold text-xs uppercase tracking-widest rounded border-none w-full sm:w-auto justify-center cursor-not-allowed shrink-0"
            title="O Estatuto Social está temporariamente indisponível para download para adequação à LGPD."
          >
            <FileText className="h-4 w-4" />
            <span>Sob Revisão (LGPD)</span>
          </button>
        </div>

      </div>
    </div>
  );
}

