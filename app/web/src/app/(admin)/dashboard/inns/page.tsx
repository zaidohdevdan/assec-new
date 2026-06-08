"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, X, MapPin, Edit3 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface InnItem {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  amenities: string[];
  active: boolean;
}

const innSchema = z.object({
  name: z.string().min(3, "O nome deve conter pelo menos 3 caracteres"),
  location: z.string().min(3, "A localização deve conter pelo menos 3 caracteres"),
  description: z.string().min(5, "A descrição deve conter pelo menos 5 caracteres"),
  image: z.string().min(10, "Selecione uma imagem para a pousada"),
  amenitiesString: z.string().min(2, "Informe as comodidades separadas por vírgula"),
  active: z.boolean().optional(),
});

type InnFormData = z.infer<typeof innSchema>;

export default function InnsManagementPage() {
  const [inns, setInns] = React.useState<InnItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [base64Image, setBase64Image] = React.useState<string>("");
  const [editingInn, setEditingInn] = React.useState<InnItem | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterActive, setFilterActive] = React.useState("all");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InnFormData>({
    resolver: zodResolver(innSchema),
    defaultValues: {
      image: "",
      active: true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setBase64Image(base64);
        setValue("image", base64, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchInns = async () => {
    try {
      const res = await apiFetch("/inns");
      if (res.ok) {
        const data = await res.json();
        setInns(data);
      }
    } catch (err) {
      console.error("Failed to load inns:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInns();
  }, []);

  const onCreateInn = async (data: InnFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const amenities = data.amenitiesString.split(",").map(s => s.trim()).filter(Boolean);

      const res = await apiFetch("/inns", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          location: data.location,
          description: data.description,
          image: data.image,
          amenities,
        }),
      });

      if (res.ok) {
        reset();
        setBase64Image("");
        setFormOpen(false);
        await fetchInns();
      } else {
        const err = await res.json();
        setSubmitError(err?.message ?? "Erro ao salvar pousada.");
      }
    } catch (err) {
      console.error("Save inn failed:", err);
      setSubmitError("Erro de conexão. Verifique se o servidor do backend está ativo.");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateInn = async (data: InnFormData) => {
    if (!editingInn) return;
    setLoading(true);
    setSubmitError(null);
    try {
      const amenities = data.amenitiesString.split(",").map(s => s.trim()).filter(Boolean);

      const res = await apiFetch(`/inns/${editingInn.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: data.name,
          location: data.location,
          description: data.description,
          image: data.image,
          amenities,
          active: data.active ?? true,
        }),
      });

      if (res.ok) {
        reset();
        setBase64Image("");
        setEditingInn(null);
        setFormOpen(false);
        await fetchInns();
      } else {
        const err = await res.json();
        setSubmitError(err?.message ?? "Erro ao atualizar pousada.");
      }
    } catch (err) {
      console.error("Update inn failed:", err);
      setSubmitError("Erro de conexão. Verifique se o servidor do backend está ativo.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: InnFormData) => {
    if (editingInn) {
      onUpdateInn(data);
    } else {
      onCreateInn(data);
    }
  };

  const handleEditClick = (inn: InnItem) => {
    setEditingInn(inn);
    setFormOpen(true);
    setValue("name", inn.name);
    setValue("location", inn.location);
    setValue("description", inn.description);
    setValue("image", inn.image);
    setValue("amenitiesString", inn.amenities.join(", "));
    setValue("active", inn.active);
    setBase64Image(inn.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingInn(null);
    setFormOpen(false);
    reset();
    setBase64Image("");
  };

  const onDeleteInn = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta pousada?")) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/inns/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchInns();
      }
    } catch (err) {
      console.error("Delete inn failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInns = inns.filter((inn) => {
    const matchesSearch =
      inn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inn.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inn.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && inn.active) ||
      (filterActive === "inactive" && !inn.active);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-none">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
            Gerenciar Pousadas
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Cadastre, busque, filtre e edite as unidades de lazer da associação para consulta dos associados.
          </p>
        </div>
        <Button
          onClick={() => {
            if (editingInn) {
              handleCancelEdit();
            } else {
              setFormOpen(!formOpen);
            }
          }}
          className="bg-accent text-primary hover:bg-accent-light font-bold flex items-center gap-2 animate-none"
        >
          {formOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{formOpen ? "Cancelar / Fechar" : "Nova Pousada"}</span>
        </Button>
      </div>

      {/* Form Card */}
      {formOpen && (
        <Card className="p-6">
          <h2 className="font-serif font-bold text-lg text-primary mb-4">
            {editingInn ? `Editando: ${editingInn.name}` : "Nova Unidade de Lazer"}
          </h2>

          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" role="alert">
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Nome da Pousada / Unidade"
                placeholder="Ex: Chalés da Serra Guaramiranga"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Localização / Endereço"
                placeholder="Ex: Guaramiranga - Serra de Baturité"
                error={errors.location?.message}
                {...register("location")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-text-primary">
                  Imagem de Destaque
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-1.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                />
                {errors.image?.message && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.image.message}
                  </span>
                )}
                {base64Image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={base64Image}
                    className="mt-2 h-20 w-32 object-cover rounded border border-border"
                    alt="Preview"
                  />
                )}
              </div>
              <Input
                label="Comodidades (separadas por vírgula)"
                placeholder="Ex: Piscina, Wi-Fi, Lareira, Estacionamento"
                error={errors.amenitiesString?.message}
                {...register("amenitiesString")}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-text-primary">
                Descrição Completa
              </label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                placeholder="Descreva a pousada, tipos de acomodação e atrativos..."
                {...register("description")}
              />
              {errors.description?.message && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.description.message}
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
                Pousada Ativa (visível no portal público)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {editingInn && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="font-bold px-6 border-border"
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                loading={loading}
                className="bg-accent text-primary hover:bg-accent-light font-bold px-6 animate-none"
              >
                {editingInn ? "Salvar Alterações" : "Cadastrar Pousada"}
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
            placeholder="Buscar por nome, localização, descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          />
        </div>
        
        <div className="w-full sm:max-w-xs flex gap-2 items-center justify-end">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider shrink-0">
            Status:
          </label>
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <option value="all">Todas as pousadas</option>
            <option value="active">Apenas Ativas</option>
            <option value="inactive">Apenas Inativas</option>
          </select>
        </div>
      </div>

      {/* Inns List */}
      <Card className="p-6">
        {loading && inns.length === 0 ? (
          <div className="text-center py-8 text-sm text-text-secondary">
            Carregando pousadas...
          </div>
        ) : filteredInns.length === 0 ? (
          <div className="text-center py-8 text-sm text-text-secondary">
            Nenhuma pousada encontrada com os critérios definidos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-text-secondary font-semibold">
                  <th className="pb-3 pr-4">Nome da Unidade</th>
                  <th className="pb-3 px-4">Localização</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Comodidades</th>
                  <th className="pb-3 pl-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInns.map((inn) => (
                  <tr key={inn.id} className="text-text-primary hover:bg-gray-50/50">
                    <td className="py-3.5 pr-4 font-medium">{inn.name}</td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-accent-dark" />
                        <span>{inn.location}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm border ${
                        inn.active
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {inn.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {inn.amenities?.map((amenity, idx) => (
                          <span key={idx} className="text-[10px] font-semibold bg-gray-100 text-text-secondary px-2 py-0.5 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          onClick={() => handleEditClick(inn)}
                          className="text-primary hover:text-accent-dark hover:bg-gray-100 p-2 h-auto"
                          title="Editar pousada"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => onDeleteInn(inn.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                          title="Excluir pousada"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
