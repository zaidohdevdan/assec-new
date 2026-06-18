"use client";

import * as React from "react";
import Image from "next/image";
import { Shield, Key, Heart, ShieldCheck, Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useSearchParams } from "next/navigation";

interface BenefitItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  details?: string;
  image?: string;
  icon?: string;
  location?: string;
  amenities?: string[];
  active: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Heart,
  Key,
  ShieldCheck,
  Landmark,
};

const categories = ["Todos", "Jurídico", "Saúde", "Educação", "Lazer", "Assistência"];

function BeneficiosContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const [activeCategory, setActiveCategory] = React.useState("Todos");

  React.useEffect(() => {
    if (catParam) {
      const matchedCat = categories.find(
        (c) => c.toLowerCase() === catParam.toLowerCase()
      );
      if (matchedCat) {
        setActiveCategory(matchedCat);
      }
    }
  }, [catParam]);
  const [benefits, setBenefits] = React.useState<BenefitItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedBenefit, setSelectedBenefit] = React.useState<BenefitItem | null>(null);

  React.useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const res = await apiFetch("/benefits");
        if (res.ok) {
          const data = await res.json();
          setBenefits(data);
        }
      } catch (err) {
        console.error("Failed to fetch benefits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
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

  const filteredBenefits = activeCategory === "Todos"
    ? benefits
    : benefits.filter((b) => b.tag.toLowerCase() === activeCategory.toLowerCase());

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

      {/* Starting Phase Hero Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-light to-secondary p-6 sm:p-8 rounded-2xl text-white shadow-lg mb-12 relative overflow-hidden border border-primary-light">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none animate-none">
          <Shield className="h-64 w-64 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-accent text-primary text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
            Estamos Apenas Começando!
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl mt-4 leading-tight text-white">
            Uma nova era de conquistas e proteção para nossa categoria
          </h2>
          <p className="text-sm sm:text-base text-gray-200 mt-3 leading-relaxed">
            A ASSEC está iniciando suas atividades com um propósito claro: unir, proteger e valorizar cada um de nossos membros. Estamos negociando e expandindo ativamente nossa rede de convênios, parcerias e infraestruturas de lazer. Os benefícios listados abaixo são o ponto de partida de uma jornada extraordinária que construiremos juntos. Prepare-se para muito mais!
          </p>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 h-64 flex flex-col justify-between border-l-4 border-l-gray-200 animate-pulse bg-white">
              <div className="space-y-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
              <div className="h-8 bg-gray-100 rounded w-full mt-4" />
            </Card>
          ))}
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBenefits.map((benefit) => {
              const Icon = iconMap[benefit.icon || ""] || Shield;
              const hasImage = !!benefit.image;
              return (
                <Card
                  key={benefit.id}
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
                        
                        {benefit.location && (
                          <p className="text-xs text-text-muted mt-2 font-semibold">
                            Localização: {benefit.location}
                          </p>
                        )}
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
            benefits.length === 0 ? (
              <Card className="max-w-2xl mx-auto p-8 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="p-4 bg-accent/10 text-accent-dark rounded-full w-fit mx-auto mb-4 animate-none">
                  <Landmark className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-xl text-primary mb-2">
                  Preparando Grandes Novidades para Você!
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-lg mx-auto">
                  Nossa equipe de parcerias está em negociações avançadas com os melhores planos de saúde, odontologia, instituições de ensino e colônias de férias do estado. Muito em breve, você terá acesso a descontos e coberturas exclusivas aqui no portal. Fique atento!
                </p>
              </Card>
            ) : (
              <div className="text-center py-12 text-text-secondary">
                Nenhum benefício encontrado para esta categoria.
              </div>
            )
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
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative border border-border animate-in fade-in zoom-in-95 duration-200"
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
                  {React.createElement(iconMap[selectedBenefit.icon || ""] || Shield, { className: "h-6 w-6" })}
                </div>
              )}

              <h2 id="modal-title" className="font-serif font-bold text-2xl text-primary mb-3">
                {selectedBenefit.title}
              </h2>
              
              <div className="text-xs font-semibold text-text-muted mb-4 uppercase tracking-wider">
                Categoria: {selectedBenefit.tag}
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                {selectedBenefit.details || selectedBenefit.description}
              </p>

              {selectedBenefit.location && (
                <div className="text-xs text-text-secondary mb-2">
                  <strong>Localização:</strong> {selectedBenefit.location}
                </div>
              )}

              {selectedBenefit.amenities && selectedBenefit.amenities.length > 0 && (
                <div className="mb-6">
                  <strong className="text-xs text-text-secondary block mb-1.5">Comodidades / Serviços:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBenefit.amenities.map((item, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-gray-100 text-text-secondary px-2 py-0.5 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

export default function BeneficiosPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    }>
      <BeneficiosContent />
    </React.Suspense>
  );
}
