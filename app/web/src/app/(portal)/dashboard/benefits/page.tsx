"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, X, MapPin, Edit3, Heart, Shield, Key, ShieldCheck, Landmark, Info } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { compressImage } from "@/lib/image";

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

const benefitSchema = z.object({
  title: z.string().min(3, "O título deve conter pelo menos 3 caracteres"),
  tag: z.string().min(2, "Selecione uma categoria"),
  description: z.string().min(5, "A descrição deve conter pelo menos 5 caracteres"),
  details: z.string().optional(),
  icon: z.string().min(2, "Selecione um ícone para o benefício"),
  image: z.string().optional(),
  location: z.string().optional(),
  amenitiesString: z.string().optional(),
  active: z.boolean().optional(),
});

type BenefitFormData = z.infer<typeof benefitSchema>;

const iconOptions = [
  { value: "Shield", label: "Escudo (Jurídico)", icon: Shield },
  { value: "Heart", label: "Coração (Saúde)", icon: Heart },
  { value: "Key", label: "Chave (Educação)", icon: Key },
  { value: "ShieldCheck", label: "Escudo com Check (Assistência)", icon: ShieldCheck },
  { value: "Landmark", label: "Pousada/Monumento (Lazer)", icon: Landmark },
];

const categoryOptions = ["Jurídico", "Saúde", "Educação", "Lazer", "Assistência"];

const tagColors: Record<string, string> = {
  "jurídico": "bg-blue-50 text-blue-700 border-blue-200",
  "saúde": "bg-green-50 text-green-700 border-green-200",
  "educação": "bg-purple-50 text-purple-700 border-purple-200",
  "lazer": "bg-amber-50 text-amber-700 border-amber-200",
  "assistência": "bg-slate-50 text-slate-700 border-slate-200",
};

export default function BenefitsManagementPage() {
  const [benefits, setBenefits] = React.useState<BenefitItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [base64Image, setBase64Image] = React.useState<string>("");
  const [editingBenefit, setEditingBenefit] = React.useState<BenefitItem | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterActive, setFilterActive] = React.useState("all");
  const [filterCategory, setFilterCategory] = React.useState("all");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BenefitFormData>({
    resolver: zodResolver(benefitSchema),
    defaultValues: {
      image: "",
      active: true,
      tag: "Saúde",
      icon: "Heart",
    },
  });

  const selectedTag = watch("tag");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file, {
          maxWidth: 600,
          maxHeight: 600,
          quality: 0.75,
          format: "image/webp",
        });
        setBase64Image(base64);
        setValue("image", base64, { shouldValidate: true });
      } catch (err) {
        console.error("Erro ao comprimir imagem do benefício:", err);
      }
    }
  };

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

  const onCreateBenefit = async (data: BenefitFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      // Parse amenities
      const amenities = data.amenitiesString
        ? data.amenitiesString.split(",").map(s => s.trim()).filter(Boolean)
        : [];

      const payload: Partial<BenefitItem> = {
        title: data.title,
        tag: data.tag,
        description: data.description,
        details: data.details || undefined,
        icon: data.icon,
        image: data.image || undefined,
        active: data.active ?? true,
      };

      if (data.tag === "Lazer") {
        payload.location = data.location || undefined;
        payload.amenities = amenities;
      }

      const res = await apiFetch("/benefits", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        reset();
        setBase64Image("");
        setFormOpen(false);
        await fetchBenefits();
      } else {
        const err = await res.json();
        setSubmitError(err?.message ?? "Erro ao salvar benefício.");
      }
    } catch (err) {
      console.error("Save benefit failed:", err);
      setSubmitError("Erro de conexão. Verifique se o servidor do backend está ativo.");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateBenefit = async (data: BenefitFormData) => {
    if (!editingBenefit) return;
    setLoading(true);
    setSubmitError(null);
    try {
      const amenities = data.amenitiesString
        ? data.amenitiesString.split(",").map(s => s.trim()).filter(Boolean)
        : [];

      const payload: Partial<BenefitItem> = {
        title: data.title,
        tag: data.tag,
        description: data.description,
        details: data.details || undefined,
        icon: data.icon,
        image: data.image || undefined,
        active: data.active ?? true,
        location: data.tag === "Lazer" ? data.location || undefined : undefined,
        amenities: data.tag === "Lazer" ? amenities : [],
      };

      const res = await apiFetch(`/benefits/${editingBenefit.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        reset();
        setBase64Image("");
        setEditingBenefit(null);
        setFormOpen(false);
        await fetchBenefits();
      } else {
        const err = await res.json();
        setSubmitError(err?.message ?? "Erro ao atualizar benefício.");
      }
    } catch (err) {
      console.error("Update benefit failed:", err);
      setSubmitError("Erro de conexão. Verifique se o servidor do backend está ativo.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: BenefitFormData) => {
    if (data.tag === "Lazer" && !data.location) {
      setSubmitError("Informe a localização para benefícios da categoria Lazer.");
      return;
    }
    if (editingBenefit) {
      onUpdateBenefit(data);
    } else {
      onCreateBenefit(data);
    }
  };

  const handleEditClick = (benefit: BenefitItem) => {
    setEditingBenefit(benefit);
    setFormOpen(true);
    setValue("title", benefit.title);
    setValue("tag", benefit.tag);
    setValue("description", benefit.description);
    setValue("details", benefit.details || "");
    setValue("icon", benefit.icon || "Shield");
    setValue("image", benefit.image || "");
    setValue("location", benefit.location || "");
    setValue("amenitiesString", benefit.amenities?.join(", ") || "");
    setValue("active", benefit.active);
    setBase64Image(benefit.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingBenefit(null);
    setFormOpen(false);
    reset();
    setBase64Image("");
    setSubmitError(null);
  };

  const onDeleteBenefit = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este benefício?")) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/benefits/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchBenefits();
      }
    } catch (err) {
      console.error("Delete benefit failed:", err);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
            Gerenciar Benefícios
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Cadastre e edite os benefícios, convênios e pousadas/unidades de lazer da associação.
          </p>
        </div>
        <Button
          onClick={() => {
            if (editingBenefit) {
              handleCancelEdit();
            } else {
              setFormOpen(!formOpen);
            }
          }}
          className="bg-accent text-primary hover:bg-accent-light font-bold flex items-center gap-2 animate-none"
        >
          {formOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{formOpen ? "Cancelar / Fechar" : "Novo Benefício"}</span>
        </Button>
      </div>

      {/* Form Card */}
      {formOpen && (
        <Card className="p-6">
          <h2 className="font-serif font-bold text-lg text-primary mb-4">
            {editingBenefit ? `Editando: ${editingBenefit.title}` : "Novo Benefício"}
          </h2>

          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" role="alert">
              <X className="h-5 w-5 shrink-0 text-red-600 cursor-pointer" onClick={() => setSubmitError(null)} />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2">
                <Input
                  label="Título do Benefício"
                  placeholder="Ex: Convênio com Plano Odontológico Sorriso +"
                  error={errors.title?.message}
                  {...register("title")}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-text-primary">
                  Categoria
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  {...register("tag")}
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.tag?.message && (
                  <span className="text-xs text-red-600 font-medium">{errors.tag.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-text-primary">
                  Ícone Representativo
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  {...register("icon")}
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.icon?.message && (
                  <span className="text-xs text-red-600 font-medium">{errors.icon.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-text-primary">
                  Imagem Ilustrativa (Opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-1.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                />
                {base64Image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={base64Image}
                    className="mt-2 h-20 w-32 object-cover rounded border border-border"
                    alt="Preview"
                  />
                )}
              </div>
            </div>

            {/* Conditional Fields for Pousada / Lazer */}
            {selectedTag === "Lazer" && (
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold mb-2 uppercase tracking-wider">
                  <Landmark className="h-4 w-4" />
                  <span>Informações Específicas de Pousada / Lazer</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Localização / Endereço da Pousada"
                    placeholder="Ex: Guaramiranga - Serra de Baturité"
                    error={errors.location?.message}
                    {...register("location")}
                  />
                  <Input
                    label="Comodidades (separadas por vírgula)"
                    placeholder="Ex: Piscina, Wi-Fi, Estacionamento, Café da manhã"
                    error={errors.amenitiesString?.message}
                    {...register("amenitiesString")}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5 w-full">
              <Input
                label="Descrição Curta"
                placeholder="Ex: Descontos de até 40% em consultas odontológicas."
                error={errors.description?.message}
                {...register("description")}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-text-primary">
                Detalhes Completos (Opcional)
              </label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                placeholder="Texto explicativo longo exibido ao clicar em 'Saber mais'..."
                {...register("details")}
              />
              {errors.details?.message && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.details.message}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                className="h-4 w-4 rounded border-border text-primary focus:ring-accent"
                {...register("active")}
              />
              <label htmlFor="active" className="text-sm font-semibold text-text-primary">
                Benefício Ativo (visível na página pública)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                className="font-bold px-6 border-border"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="bg-accent text-primary hover:bg-accent-light font-bold px-6 animate-none"
              >
                {editingBenefit ? "Salvar Alterações" : "Cadastrar Benefício"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-border">
        <div className="w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Buscar por título, categoria, descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          />
        </div>
        
        <div className="w-full sm:max-w-md flex gap-4">
          <div className="w-1/2 flex gap-2 items-center">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider shrink-0">
              Categoria:
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              <option value="all">Todas</option>
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/2 flex gap-2 items-center">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider shrink-0">
              Status:
            </label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Benefits List */}
      <Card className="p-6">
        {loading && benefits.length === 0 ? (
          <div className="text-center py-8 text-sm text-text-secondary">
            Carregando benefícios...
          </div>
        ) : filteredBenefits.length === 0 ? (
          <div className="text-center py-8 text-sm text-text-secondary">
            Nenhum benefício encontrado com os critérios definidos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-text-secondary font-semibold">
                  <th className="pb-3 pr-4">Título</th>
                  <th className="pb-3 px-4">Categoria</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Local / Detalhes</th>
                  <th className="pb-3 pl-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBenefits.map((b) => {
                  const bTagLower = b.tag.toLowerCase();
                  const badgeColor = tagColors[bTagLower] || "bg-gray-100 text-gray-800 border-gray-200";
                  
                  return (
                    <tr key={b.id} className="text-text-primary hover:bg-gray-50/50">
                      <td className="py-3.5 pr-4 font-medium max-w-xs truncate" title={b.title}>
                        {b.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                          {b.tag}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          b.active
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          {b.active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-text-secondary">
                        {b.tag === "Lazer" && b.location ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-accent-dark" />
                            <span className="truncate max-w-[150px]">{b.location}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 italic text-text-muted">
                            <Info className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[150px]">{b.description}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            onClick={() => handleEditClick(b)}
                            className="text-primary hover:text-accent-dark hover:bg-gray-100 p-2 h-auto"
                            title="Editar benefício"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => onDeleteBenefit(b.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                            title="Excluir benefício"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
