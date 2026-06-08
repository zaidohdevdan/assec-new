"use client";

import * as React from "react";
import Image from "next/image";
import { Shield, Key, Heart, ShieldCheck, Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

interface BenefitItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tag: string;
  image?: string;
  details?: string;
}

interface InnItem {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  amenities: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const staticBenefits: BenefitItem[] = [
  {
    icon: Shield,
    title: "Assessoria Jurídica Integral",
    description: "Nossa equipe jurídica especialista em direito militar e administrativo defende e acompanha os associados em sindicâncias e processos correlatos.",
    tag: "Jurídico",
    details: "A ASSEC oferece assistência jurídica completa em diversas instâncias. Nossos associados contam com plantões de atendimento presencial e virtual, representação em processos disciplinares, sindicâncias corporativas, além de assessoria em direito civil e familiar para resguardar todos os direitos dos servidores públicos militares.",
  },
  {
    icon: Heart,
    title: "Convênios com Saúde e Odontologia",
    description: "Parcerias de ampla cobertura com os maiores planos de saúde e odontologia do estado, oferecendo condições exclusivas de contratação.",
    tag: "Saúde",
    details: "Nossos convênios de saúde e odontologia cobrem atendimentos clínicos, consultas com especialistas renomados, exames especializados de alta complexidade, procedimentos cirúrgicos e internações com valores e tabelas exclusivas negociados diretamente para a família associada da ASSEC.",
  },
  {
    icon: Key,
    title: "Convênios de Educação e Comércio",
    description: "Descontos expressivos em mensalidades de faculdades, escolas de idiomas, academias e hotéis parceiros.",
    tag: "Educação",
    details: "Parcerias sólidas com as maiores universidades, centros educacionais, escolas de idiomas, redes de academias e hotéis pelo país garantem aos associados e seus dependentes descontos expressivos de até 50% nas mensalidades e diárias.",
  },
  {
    icon: ShieldCheck,
    title: "Auxílio Emergencial e Seguro",
    description: "Seguros de vida coletivos e programas assistenciais voltados a amparar a família do servidor em momentos de extrema necessidade.",
    tag: "Assistência",
    details: "Com o objetivo de apoiar a família do associado nas horas mais delicadas, a ASSEC disponibiliza seguros de vida coletivos com coberturas amplas, auxílio financeiro emergencial imediato e assistência funeral completa de urgência.",
  },
];

const categories = ["Todos", "Jurídico", "Saúde", "Educação", "Lazer", "Assistência"];

export default function BeneficiosPage() {
  const [activeCategory, setActiveCategory] = React.useState("Todos");
  const [dynamicInns, setDynamicInns] = React.useState<BenefitItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedBenefit, setSelectedBenefit] = React.useState<BenefitItem | null>(null);

  React.useEffect(() => {
    const fetchInns = async () => {
      try {
        const res = await apiFetch("/inns");
        if (res.ok) {
          const inns: InnItem[] = await res.json();
          const mapped: BenefitItem[] = inns.map((inn) => ({
            icon: Landmark,
            title: `Pousada: ${inn.name}`,
            description: `${inn.description} - Localização: ${inn.location}. Serviços: ${inn.amenities?.join(", ") || "Sem descrição"}`,
            tag: "Lazer",
            image: inn.image,
            details: `Desfrute de momentos de lazer e descanso na Pousada ${inn.name}, localizada na privilegiada região de ${inn.location}. A pousada oferece suítes climatizadas, cozinha de apoio, área de lazer equipada com churrasqueira e piscinas. Serviços disponíveis: ${inn.amenities?.join(", ") || "Sem restrições adicionais"}. Diárias promocionais exclusivas para associados da ASSEC.`,
          }));
          setDynamicInns(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch inns, using fallback values", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInns();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedBenefit(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fallbackLodging: BenefitItem = {
    icon: Landmark,
    title: "Hospedagem no Litoral (Pousadas)",
    description: "Tarifas diferenciadas e pacotes de lazer exclusivos na pousada da associação. Quartos climatizados e piscinas para descanso.",
    tag: "Lazer",
    image: "https://picsum.photos/seed/assec-pousada/800/600",
    details: "Nossa pousada de lazer no litoral do estado conta com infraestrutura ideal para acomodar você e seus dependentes com muito conforto. Desfrute de suítes mobiliadas e climatizadas, piscinas adulto e infantil, Wi-Fi integrado, churrasqueira e tarifas exclusivas com pacotes diferenciados durante todo o ano.",
  };

  const allBenefits = [
    ...staticBenefits,
    ...(dynamicInns.length > 0 ? dynamicInns : [fallbackLodging]),
  ];

  const filteredBenefits = activeCategory === "Todos"
    ? allBenefits
    : allBenefits.filter((b) => b.tag.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-none">
      <div className="text-center mb-12">
        <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">Vantagens</span>
        <h1 className="font-serif font-bold text-4xl text-primary mt-2">
          Benefícios para Você e Sua Família
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto mt-4 text-sm sm:text-base">
          Ser parceiro da ASSEC é contar com uma rede de proteção e vantagens projetadas para dar mais tranquilidade e qualidade de vida no seu dia a dia.
        </p>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${
              activeCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-white text-text-secondary border-border hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8 text-text-secondary text-sm">
          Carregando pousadas e benefícios...
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const hasImage = !!benefit.image;
              return (
                <Card
                  key={index}
                  className="flex flex-col justify-between h-full relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-0 border-l-4 border-l-accent-dark"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {benefit.image && (
                        <div className="w-full h-48 overflow-hidden relative rounded-t-lg">
                          <Image
                            src={benefit.image}
                            alt={benefit.title}
                            fill
                            sizes="(max-w-7xl) 33vw, 100vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-lg"
                          />
                        </div>
                      )}
                      
                      {benefit.tag && (
                        <span className={`absolute top-4 right-4 z-10 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded shadow-md border ${
                          hasImage
                            ? "bg-primary text-white border-white/10"
                            : "bg-accent/90 text-primary border-transparent"
                        }`}>
                          {benefit.tag}
                        </span>
                      )}
                      
                      <div className="p-6">
                        {!hasImage && (
                          <div className="p-3 bg-primary text-accent rounded-lg w-fit mb-4">
                            <Icon className="h-6 w-6" />
                          </div>
                        )}
                        
                        <h3 className="font-serif font-bold text-lg text-primary mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6">
                      <div className="pt-4 flex justify-between items-center border-t border-border">
                        <span className="text-xs text-text-muted font-sans font-medium">
                          Categoria: {benefit.tag}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedBenefit(benefit)}
                          className="text-xs font-bold text-primary hover:text-accent-dark transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded px-1"
                        >
                          <span>Saber mais</span>
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredBenefits.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              Nenhum benefício encontrado para esta categoria.
            </div>
          )}
        </>
      )}

      {/* Modal Dialog */}
      {selectedBenefit && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedBenefit(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-border animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {selectedBenefit.image && (
              <div className="w-full h-56 overflow-hidden relative">
                <Image 
                  src={selectedBenefit.image} 
                  alt={selectedBenefit.title} 
                  fill
                  sizes="(max-w-lg) 100vw, 500px"
                  className="object-cover"
                />
                <span className="absolute top-4 right-4 bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded shadow-md border border-white/10">
                  {selectedBenefit.tag}
                </span>
              </div>
            )}

            <div className="p-6">
              {!selectedBenefit.image && (
                <div className="p-3 bg-primary text-accent rounded-lg w-fit mb-4">
                  {React.createElement(selectedBenefit.icon, { className: "h-6 w-6" })}
                </div>
              )}

              <h2 id="modal-title" className="font-serif font-bold text-2xl text-primary mb-3">
                {selectedBenefit.title}
              </h2>
              
              <div className="text-xs font-semibold text-text-muted mb-4 uppercase tracking-wider">
                Categoria: {selectedBenefit.tag}
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {selectedBenefit.details || selectedBenefit.description}
              </p>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedBenefit(null)}
                  className="px-4 py-2 border border-border hover:bg-gray-50 rounded-lg text-xs font-semibold text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Fechar
                </button>
                <a
                  href="/associe-se"
                  className="px-4 py-2 bg-primary text-white hover:bg-primary-light rounded-lg text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent inline-flex items-center"
                >
                  Quero este benefício
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
