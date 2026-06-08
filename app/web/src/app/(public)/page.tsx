import * as React from "react";
import Link from "next/link";
import { Shield, FileText, CheckCircle2, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Início",
  description: "Associação dos Servidores da Segurança do Ceará. Transparência, representatividade e força.",
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
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/associe-se" className="w-full sm:w-auto">
              <Button className="w-full bg-accent text-primary hover:bg-accent-light font-semibold px-8 py-3 animate-none">
                Associe-se Agora
              </Button>
            </Link>
            <Link href="/sobre" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-gray-400 text-white hover:bg-primary-light px-8 py-3 animate-none">
                Saiba Mais
              </Button>
            </Link>
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
              <span className="text-text-secondary text-sm font-medium mt-1">
                Uma nova força com ideais modernos e atuantes
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
      <section className="py-16 sm:py-24 bg-bg-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-primary mb-4">
              Nossos Benefícios
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Como associado ASSEC, você tem acesso a diversos serviços de apoio, convênios de lazer e suporte jurídico especializado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card accentHover>
              <h3 className="font-serif font-bold text-xl text-primary mb-3">
                Assessoria Jurídica
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Suporte jurídico completo em questões administrativas e profissionais para proteger os seus direitos.
              </p>
              <Link href="/beneficios" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                <span>Ver detalhes</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            <Card accentHover>
              <h3 className="font-serif font-bold text-xl text-primary mb-3">
                Pousada da Associação
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Tarifas e pacotes especiais de hospedagem no litoral para lazer e descanso da sua família.
              </p>
              <Link href="/beneficios" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                <span>Ver detalhes</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            <Card accentHover>
              <h3 className="font-serif font-bold text-xl text-primary mb-3">
                Convênios Médicos
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Planos de saúde e convênios com consultórios e clínicas com condições exclusivas de contratação.
              </p>
              <Link href="/beneficios" className="inline-flex items-center gap-1 text-accent-dark font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                <span>Ver detalhes</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Transparency Banner */}
      <section className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-accent" />
              <span className="uppercase text-accent-light tracking-widest text-xs font-bold">Portal da Transparência</span>
            </div>
            <h2 className="font-serif font-bold text-3xl">
              Nossas Contas são Abertas e Claras
            </h2>
            <p className="text-gray-300 text-sm">
              Publicamos periodicamente estatutos, balanços financeiros e relatórios anuais de atividades para consulta livre de qualquer associado.
            </p>
          </div>
          <Link href="/transparencia" className="shrink-0 w-full md:w-auto">
            <Button className="w-full md:w-auto bg-accent text-primary hover:bg-accent-light font-semibold px-6 py-3 animate-none">
              Acessar Documentos
            </Button>
          </Link>
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
          <Link href="/associe-se">
            <Button size="lg" className="bg-accent text-primary hover:bg-accent-light font-bold px-10 animate-none">
              Quero me Associar
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
