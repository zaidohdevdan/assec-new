"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Camera, ShieldCheck, AlertCircle, Save, Loader2, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { User as UserType } from "@/lib/types";
import { compressImage } from "@/lib/image";
import { usePortalUser } from "../../PortalUserContext";

const profileSchema = z.object({
  name: z.string().optional(),
  displayName: z.string().optional().or(z.literal("")),
  cpf: z.string().min(11, "CPF deve conter no mínimo 11 dígitos").optional().or(z.literal("")),
  rg: z.string().optional(),
  matricula: z.string().optional(),
  org: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const { user: contextUser, setUser: setContextUser } = usePortalUser();
  const [user, setUser] = React.useState<UserType | null>(contextUser);
  const [photoBase64, setPhotoBase64] = React.useState<string | null>(contextUser?.avatarUrl ?? null);
  const [photoError, setPhotoError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(!contextUser);
  const [submitting, setSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [pwdSubmitting, setPwdSubmitting] = React.useState(false);
  const [pwdSuccessMsg, setPwdSuccessMsg] = React.useState<string | null>(null);
  const [pwdErrorMsg, setPwdErrorMsg] = React.useState<string | null>(null);
  
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
      displayName: "",
      cpf: "",
      rg: "",
      matricula: "",
      org: "",
    },
  });

  const fetchUserData = React.useCallback(async () => {
    try {
      const res = await apiFetch("/auth/me");
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setContextUser(userData);
        setPhotoBase64(userData.avatarUrl ?? null);
        reset({
          name: userData.name || "",
          displayName: userData.displayName || "",
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
  }, [reset, setContextUser]);

  React.useEffect(() => {
    if (contextUser) {
      setUser(contextUser);
      setPhotoBase64(contextUser.avatarUrl ?? null);
      reset({
        name: contextUser.name || "",
        displayName: contextUser.displayName || "",
        cpf: contextUser.cpf || "",
        rg: contextUser.rg || "",
        matricula: contextUser.matricula || "",
        org: contextUser.org || "",
      });
      setLoading(false);
      return;
    }
    void fetchUserData();
  }, [contextUser, fetchUserData, reset]);

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
        
        // Update user state and shared PortalUserContext (no localStorage PII)
        setUser(updatedUser);
        setContextUser(updatedUser);
        
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSuccessMsg(null);
    setPwdErrorMsg(null);

    if (!currentPassword) {
      setPwdErrorMsg("Informe sua senha atual.");
      return;
    }
    if (newPassword.length < 10 || newPassword.length > 128) {
      setPwdErrorMsg("A nova senha deve ter entre 10 e 128 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdErrorMsg("A confirmação da nova senha não confere.");
      return;
    }

    setPwdSubmitting(true);
    try {
      const res = await apiFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (res.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setUser((prev) => (prev ? { ...prev, mustChangePassword: false } : prev));
        setContextUser((prev) =>
          prev ? { ...prev, mustChangePassword: false } : prev
        );
        setPwdSuccessMsg("Senha alterada com sucesso!");
        setTimeout(() => setPwdSuccessMsg(null), 4000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setPwdErrorMsg(
          errData?.message ?? "Não foi possível alterar a senha."
        );
      }
    } catch {
      setPwdErrorMsg("Erro de conexão ao tentar alterar a senha.");
    } finally {
      setPwdSubmitting(false);
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

      {user?.mustChangePassword && (
        <div
          className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r text-sm text-amber-900 flex items-start gap-3 shadow-sm"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold">Troca de senha obrigatória</p>
            <p className="text-xs mt-0.5">
              Sua senha foi redefinida pela administração da ASSEC. Por segurança, defina uma nova senha pessoal na seção <strong>Segurança e Senha</strong> abaixo para continuar navegando no portal.
            </p>
          </div>
        </div>
      )}

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
                  /* eslint-disable-next-line @next/next/no-img-element */
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome de Exibição / Apelido"
                placeholder="Ex: Daniel, Sgt. Almeida"
                error={errors.displayName?.message}
                hint="Como você prefere ser chamado nos menus e saudações do portal."
                {...register("displayName")}
              />

              <Input
                label="Nome Completo Oficial"
                placeholder="Nome civil do associado"
                error={errors.name?.message}
                readOnly
                className="bg-gray-50/80 cursor-not-allowed opacity-80"
                hint="Alteração cadastral restrita à administração"
                {...register("name")}
              />
            </div>

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

      {/* Password Change Section */}
      <Card className="p-6 sm:p-8">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent-dark" />
            <span>Segurança e Senha</span>
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Altere sua senha de acesso ao portal. A nova senha deve possuir no mínimo 10 caracteres.
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {pwdSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-700 flex items-center gap-2" role="alert">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{pwdSuccessMsg}</span>
            </div>
          )}

          {pwdErrorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" role="alert">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{pwdErrorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Senha Atual"
              type="password"
              placeholder="Informe sua senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nova Senha (mín. 10 caracteres)"
              type="password"
              placeholder="Nova senha forte"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirmar Nova Senha"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <Button
              type="submit"
              loading={pwdSubmitting}
              className="bg-primary text-white hover:bg-primary-light font-bold text-xs uppercase tracking-widest px-6 py-3 shadow border-none"
            >
              <Lock className="h-4 w-4 mr-2" />
              Alterar Minha Senha
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
