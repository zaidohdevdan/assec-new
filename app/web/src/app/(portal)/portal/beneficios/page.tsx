"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Heart,
  Shield,
  Key,
  ShieldCheck,
  Landmark,
  Eye,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface BenefitItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  details?: string;
  image?: string;
  icon?: string;
  location?: string;
  amenities: string[];
  active: boolean;
}

const categoryColors: Record<string, string> = {
  "jurídico": "bg-blue-50 text-blue-700 border-blue-200",
  "saúde": "bg-green-50 text-green-700 border-green-200",
  "educação": "bg-purple-50 text-purple-700 border-purple-200",
  "lazer": "bg-amber-50 text-amber-700 border-amber-200",
  "assistência": "bg-slate-50 text-slate-700 border-slate-200",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield: Shield,
  Heart: Heart,
  Key: Key,
  ShieldCheck: ShieldCheck,
  Landmark: Landmark,
};

function getBenefitIcon(iconName?: string) {
  return iconMap[iconName || "Shield"] || Shield;
}

export default function BenefitsReadOnlyPage() {
  const [benefits, setBenefits] = React.useState<BenefitItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterActive, setFilterActive] = React.useState("all");
  const [filterCategory, setFilterCategory] = React.useState("all");
  const [selectedBenefit, setSelectedBenefit] = React.useState<BenefitItem | null>(null);

  const fetchBenefits = async () => {
    try {
      const res = await apiFetch("/benefits?all=true");
      if (res.ok) {
        const data = await res.json();
        setBenefits(data);
      }
    } catch (err) {
      console.error("Failed to load benefits:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBenefits();
  }, []);

  const filteredBenefits = benefits.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.location && b.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesActive =
      filterActive === "all" ||
      (filterActive === "active" && b.active) ||
      (filterActive === "inactive" && !b.active);

    const matchesCategory =
      filterCategory === "all" ||
      b.tag.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesActive && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-none">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-accent-dark text-xs font-bold uppercase tracking-widest mb-1">
          <Heart className="h-4 w-4" />
          <span>Supervisão de Convênios</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
          Convênios e Benefícios
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Consulte e fiscalize a lista de parcerias, assistência e unidades de lazer cadastradas (Apenas Leitura).
        </p>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6">
          <Input
            label=""
            placeholder="Buscar por nome, categoria ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <option value="all">Todas as Categorias</option>
            <option value="Saúde">Saúde</option>
            <option value="Jurídico">Jurídico</option>
            <option value="Lazer">Lazer</option>
            <option value="Educação">Educação</option>
            <option value="Assistência">Assistência</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Rascunhos / Inativos</option>
          </select>
        </div>
      </div>

      {/* Card Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary text-sm gap-2">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span>Carregando benefícios...</span>
        </div>
      ) : filteredBenefits.length === 0 ? (
        <Card className="p-8 text-center text-text-secondary text-sm">
          Nenhum benefício ou convênio encontrado com os filtros selecionados.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBenefits.map((benefit) => {
            const IconComponent = getBenefitIcon(benefit.icon);
            const tagStyle = categoryColors[benefit.tag.toLowerCase()] || "bg-slate-50 text-slate-700";

            return (
              <Card key={benefit.id} className="flex flex-col border border-border bg-white overflow-hidden hover:shadow-md transition-shadow">
                {benefit.image ? (
                  <div className="h-44 w-full overflow-hidden border-b border-border">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-44 w-full bg-slate-50 flex items-center justify-center border-b border-border">
                    <IconComponent className="h-12 w-12 text-slate-300" />
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tagStyle}`}>
                        {benefit.tag}
                      </span>
                      {!benefit.active && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-dashed border-slate-300">
                          Rascunho
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-primary text-base line-clamp-1">{benefit.title}</h3>
                    <p className="text-xs text-text-muted mt-2 line-clamp-3 leading-relaxed">{benefit.description}</p>
                  </div>

                  {benefit.tag === "Lazer" && benefit.location && (
                    <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                      <MapPin className="h-3.5 w-3.5 text-accent-dark shrink-0" />
                      <span className="truncate">{benefit.location}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border mt-auto flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedBenefit(benefit)}
                      className="text-primary hover:text-accent-dark hover:bg-slate-50 py-1.5 px-3 h-auto text-xs font-bold flex items-center gap-1.5"
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedBenefit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-border flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-border bg-slate-50 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-dark">
                  Ficha do Convênio
                </span>
                <h3 className="font-serif font-bold text-lg text-primary mt-1">
                  {selectedBenefit.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBenefit(null)}
                className="text-text-secondary hover:text-primary font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {selectedBenefit.image && (
                <div className="w-full max-h-56 overflow-hidden rounded-lg border border-border">
                  <img
                    src={selectedBenefit.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-gray-100 text-text-secondary px-2.5 py-0.5 rounded font-semibold">
                  Categoria: {selectedBenefit.tag}
                </span>
                {!selectedBenefit.active && (
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded font-bold uppercase text-[10px]">
                    Rascunho
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Descrição Resumida</h4>
                <p className="text-sm text-text-primary leading-relaxed">{selectedBenefit.description}</p>
              </div>

              {selectedBenefit.details && (
                <div className="space-y-2 border-t border-border pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Termos e Detalhes de Acesso</h4>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{selectedBenefit.details}</p>
                </div>
              )}

              {selectedBenefit.tag === "Lazer" && (
                <>
                  {selectedBenefit.location && (
                    <div className="space-y-2 border-t border-border pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Localização</h4>
                      <div className="flex items-center gap-1.5 text-sm text-text-primary">
                        <MapPin className="h-4 w-4 text-accent-dark shrink-0" />
                        <span>{selectedBenefit.location}</span>
                      </div>
                    </div>
                  )}

                  {selectedBenefit.amenities && selectedBenefit.amenities.length > 0 && (
                    <div className="space-y-2 border-t border-border pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Comodidades / Estrutura</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBenefit.amenities.map((item, index) => (
                          <span key={index} className="bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-semibold">
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-slate-50 flex justify-end shrink-0">
              <Button
                onClick={() => setSelectedBenefit(null)}
                className="bg-primary text-white hover:bg-primary-light font-bold text-xs uppercase tracking-widest px-5 py-2.5"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
