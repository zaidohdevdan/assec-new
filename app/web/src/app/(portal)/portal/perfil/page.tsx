"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Camera, ShieldCheck, AlertCircle, Save, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { User as UserType } from "@/lib/types";
import { compressImage } from "@/lib/image";

const profileSchema = z.object({
  name: z.string().min(3, "O nome deve conter pelo menos 3 caracteres"),
  cpf: z.string().min(11, "CPF deve conter no mínimo 11 dígitos").optional().or(z.literal("")),
  rg: z.string().optional(),
  matricula: z.string().optional(),
  org: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const [user, setUser] = React.useState<UserType | null>(null);
  const [photoBase64, setPhotoBase64] = React.useState<string | null>(null);
  const [photoError, setPhotoError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      cpf: "",
      rg: "",
      matricula: "",
      org: "",
    },
  });

  const fetchUserData = async () => {
    try {
      const res = await apiFetch("/auth/me");
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setPhotoBase64(userData.avatarUrl ?? null);
        reset({
          name: userData.name || "",
          cpf: userData.cpf || "",
          rg: userData.rg || "",
          matricula: userData.matricula || "",
          org: userData.org || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, [reset]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64String = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.75,
        format: "image/webp",
      });
      setPhotoBase64(base64String);
    } catch (err) {
      console.error(err);
      setPhotoError((err as Error).message || "Erro ao processar imagem.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProfileFormData) => {
    setSuccessMsg(null);
    setSubmitError(null);
    setSubmitting(true);

    try {
      const payload = {
        ...data,
        avatarUrl: photoBase64,
      };

      const res = await apiFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        
        // Update user state and local storage display cache
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Dispatch custom event to notify PortalClientLayout
        window.dispatchEvent(new Event("user-profile-updated"));
        
        setSuccessMsg("Perfil atualizado com sucesso!");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        const errData = await res.json();
        setSubmitError(errData?.message ?? "Ocorreu um erro ao atualizar o perfil.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setSubmitError("Erro ao conectar ao servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-sm text-text-secondary">
        <Loader2 className="h-6 w-6 animate-spin text-accent mr-2" />
        Carregando dados do perfil...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-none">
      {/* Top Header */}
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
          Meu Perfil
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Gerencie seus dados pessoais, informações de afiliação e altere sua foto de perfil.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-700 flex items-center gap-2" role="alert">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" role="alert">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Photo Edit Section */}
          <div className="flex flex-col items-center gap-3 border-b border-gray-100 pb-6">
            <div className="relative group">
              <div className="h-28 w-28 rounded-full border-2 border-accent bg-slate-100 overflow-hidden flex items-center justify-center shadow-md">
                {photoBase64 ? (
                  <img
                    src={photoBase64}
                    alt={user?.name || "Foto de perfil"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-14 w-14 text-text-muted" />
                )}
              </div>
              
              {/* Photo Edit Overlay */}
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
                aria-label="Alterar foto de perfil"
              >
                <Camera className="h-6 w-6" />
                <span className="text-[10px] font-bold uppercase mt-1">Alterar</span>
              </button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={triggerFileInput}
              className="text-xs font-bold text-accent-dark hover:underline focus:outline-none"
            >
              Escolher nova imagem
            </button>
            <p className="text-[10px] text-text-muted">
              Formatos aceitos: JPG, PNG. Tamanho máximo: 1MB.
            </p>

            {photoError && (
              <span className="text-xs text-red-600 font-semibold">{photoError}</span>
            )}
          </div>

          {/* Profile fields */}
          <div className="space-y-4">
            <Input
              label="Nome de Exibição / Como prefere ser chamado"
              placeholder="Ex: Daniel, Sargento Almeida, etc."
              error={errors.name?.message}
              hint="Este é o nome exibido nos seus acessos ao portal. O nome oficial para fins cadastrais é gerenciado pela administração."
              {...register("name")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="CPF"
                placeholder="000.000.000-00"
                error={errors.cpf?.message}
                readOnly
                className="bg-gray-50/80 cursor-not-allowed opacity-80"
                hint="Alteração restrita à administração"
                {...register("cpf")}
              />
              <Input
                label="RG"
                placeholder="0000000000-0 SSP/CE"
                error={errors.rg?.message}
                readOnly
                className="bg-gray-50/80 cursor-not-allowed opacity-80"
                hint="Alteração restrita à administração"
                {...register("rg")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Matrícula"
                placeholder="Digite o número da sua matrícula"
                error={errors.matricula?.message}
                readOnly
                className="bg-gray-50/80 cursor-not-allowed opacity-80"
                hint="Alteração restrita à administração"
                {...register("matricula")}
              />
              <Input
                label="Organização / Cargo / Patente"
                placeholder="Ex: Soldado - PM/CE, Secretário"
                error={errors.org?.message}
                readOnly
                className="bg-gray-50/80 cursor-not-allowed opacity-80"
                hint="Alteração restrita à administração"
                {...register("org")}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <Button
              type="submit"
              loading={submitting}
              className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-6 py-3 shadow border-none"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
