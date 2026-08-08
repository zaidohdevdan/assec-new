"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, PlusCircle, Search, Edit3, Trash2, X, AlertCircle, CheckCircle2, ShieldAlert, Camera } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { User as UserType } from "@/lib/types";
import { compressImage } from "@/lib/image";

// Form validation schema
const userFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().optional().or(z.literal("")),
  role: z.enum(["USER", "PROFESSIONAL", "ADMIN", "PRESIDENT", "CONTABILIDADE", "EDITOR"]),
  status: z.string().min(1, "Selecione o status"),
  cpf: z.string().optional().or(z.literal("")),
  rg: z.string().optional().or(z.literal("")),
  matricula: z.string().optional().or(z.literal("")),
  org: z.string().optional().or(z.literal("")),
  specialty: z.string().optional().or(z.literal("")),
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function UsuariosManagerPage() {
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("Todos");
  const [statusFilter, setStatusFilter] = React.useState("Todos");

  // Modal states
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UserType | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<UserType | null>(null);

  // Card Photo States for Admin Edit
  const [cardPhotoBase64, setCardPhotoBase64] = React.useState<string | null>(null);
  const [cardPhotoError, setCardPhotoError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCardPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64String = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.75,
        format: "image/webp",
      });
      setCardPhotoBase64(base64String);
    } catch (err) {
      console.error(err);
      setCardPhotoError((err as Error).message || "Erro ao processar imagem.");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
      status: "Ativo",
      cpf: "",
      rg: "",
      matricula: "",
      org: "",
      specialty: "",
    },
  });

  const selectedRole = watch("role");

  const fetchUsers = async () => {
    try {
      const res = await apiFetch("/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setErrorMsg("Erro ao buscar usuários do servidor.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setCardPhotoBase64(null);
    setCardPhotoError(null);
    reset({
      name: "",
      email: "",
      password: "",
      role: "USER",
      status: "Ativo",
      cpf: "",
      rg: "",
      matricula: "",
      org: "",
      specialty: "",
    });
    setErrorMsg(null);
    setSuccessMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (user: UserType) => {
    setEditingUser(user);
    setCardPhotoBase64(user.photoUrl || null);
    setCardPhotoError(null);
    reset({
      name: user.name || "",
      email: user.email || "",
      password: "", // Leave blank for edit unless resetting
      role: user.role || "USER",
      status: user.status || "Ativo",
      cpf: user.cpf || "",
      rg: user.rg || "",
      matricula: user.matricula || "",
      org: user.org || "",
      specialty: user.specialty || "",
    });
    setErrorMsg(null);
    setSuccessMsg(null);
    setModalOpen(true);
  };

  const onSubmit = async (data: UserFormData) => {
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Prepare payload
    const payload: Partial<UserType> & { password?: string } = {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      cpf: data.cpf || null,
      rg: data.rg || null,
      matricula: data.matricula || null,
      org: data.org || null,
      specialty: data.role === "PROFESSIONAL" ? data.specialty || null : null,
      photoUrl: cardPhotoBase64,
    };

    if (data.password && data.password.trim().length > 0) {
      payload.password = data.password;
    } else if (!editingUser) {
      // Require password for new users
      setErrorMsg("A senha é obrigatória para novos usuários.");
      setSubmitting(false);
      return;
    }

    try {
      const url = editingUser ? `/users/${editingUser.id}` : "/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg(
          editingUser
            ? "Usuário atualizado com sucesso!"
            : "Novo usuário criado com sucesso!"
        );
        setModalOpen(false);
        fetchUsers();
      } else {
        const errData = await res.json();
        setErrorMsg(errData?.message ?? "Ocorreu um erro ao salvar o usuário.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro de conexão. Verifique se o servidor está rodando.");
    } finally {
      setSubmitting(false);
    }
  };

  const requestDeleteUser = (user: UserType) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await apiFetch(`/users/${userToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccessMsg(`Usuário "${userToDelete.name}" excluído com sucesso.`);
        fetchUsers();
      } else {
        const errData = await res.json().catch(() => null);
        setErrorMsg(errData?.message ?? "Erro ao excluir usuário.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro de conexão. Verifique se o servidor está rodando.");
    } finally {
      setSubmitting(false);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  // Client-side filtering logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "Todos" || u.role === roleFilter;
    const matchesStatus = statusFilter === "Todos" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-accent-dark shrink-0" />
            <span>Gerenciamento de Usuários</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Painel administrativo com controle root total sobre associados, profissionais e outros administradores.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 py-2.5 shadow self-start sm:self-center border-none"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Cadastrar Usuário
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-700 flex items-center gap-2" role="alert">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filters Card */}
      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2 relative">
            <label htmlFor="search" className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
              Buscar por Nome ou E-mail
            </label>
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-text-muted" />
              <input
                id="search"
                type="text"
                placeholder="Ex: Marcos Oliveira..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-9 w-full rounded-md border border-border bg-bg-surface pl-9 pr-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role-filter" className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
              Filtrar por Perfil (Role)
            </label>
            <select
              id="role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-bg-surface px-2.5 py-1 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              <option value="Todos">Todos</option>
              <option value="USER">Associado (USER)</option>
              <option value="PROFESSIONAL">Profissional (PROFESSIONAL)</option>
              <option value="ADMIN">Administrador (ADMIN)</option>
              <option value="PRESIDENT">Presidente (PRESIDENT)</option>
              <option value="CONTABILIDADE">Contabilidade (CONTABILIDADE)</option>
              <option value="EDITOR">Editor (EDITOR)</option>
            </select>
          </div>

          <div>
            <label htmlFor="status-filter" className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
              Filtrar por Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-bg-surface px-2.5 py-1 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              <option value="Todos">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Suspenso">Suspenso</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-8 overflow-x-auto">
          {loading ? (
            <div className="text-center py-16 text-sm text-text-secondary">
              Carregando lista de usuários...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-text-secondary font-semibold">
              Nenhum usuário corresponde aos filtros ou pesquisa informada.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-text-secondary font-semibold">
                  <th className="pb-3 pr-4">Nome & Contato</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Documentação</th>
                  <th className="pb-3 px-4">Órgão / Especialidade</th>
                  <th className="pb-3 pl-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="text-text-primary hover:bg-gray-50/30">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-slate-100 text-primary flex items-center justify-center font-bold text-xs">
                            {user.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">{user.name}</span>
                          <span className="text-[10px] text-text-muted">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${user.role === "ADMIN"
                        ? "bg-slate-100 text-slate-800 border-slate-200"
                        : user.role === "PROFESSIONAL"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${user.status === "Ativo"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : user.status === "Suspenso"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 space-y-0.5 font-mono text-[10px] text-text-secondary">
                      {user.cpf && <p>CPF: {user.cpf}</p>}
                      {user.rg && <p>RG: {user.rg}</p>}
                      {user.matricula && <p>Matr.: {user.matricula}</p>}
                      {!user.cpf && !user.rg && !user.matricula && <span className="text-text-muted">-</span>}
                      {user.photoUrl ? (
                        <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold uppercase mt-1">
                          <CheckCircle2 className="h-3 w-3 shrink-0" />
                          <span>Foto Carteira OK</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[9px] text-red-500 font-bold uppercase mt-1">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>Sem Foto Carteira</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-text-secondary">
                      {user.role === "PROFESSIONAL" ? (
                        <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase border border-blue-200">
                          {user.specialty || "Não definida"}
                        </span>
                      ) : user.org ? (
                        <span>{user.org}</span>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => openEditModal(user)}
                          className="text-primary hover:text-accent-dark hover:bg-slate-50 h-8 px-2 text-xs font-bold"
                        >
                          <Edit3 className="h-3.5 w-3.5 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => requestDeleteUser(user)}
                          disabled={user.email === "admin@assec.com.br"} // Protect root admin
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 px-2 text-xs font-bold disabled:opacity-30"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Creation / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-border animate-in fade-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2 items-center text-primary">
                  <User className="h-5 w-5 text-accent-dark" />
                  <h2 id="modal-title" className="font-serif font-bold text-xl">
                    {editingUser ? `Editar Usuário: ${editingUser.name}` : "Cadastrar Novo Usuário"}
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-text-muted hover:text-text-primary transition-colors p-1"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" role="alert">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Photo Edit Section (Official Card Photo) */}
                <div className="flex flex-col items-center gap-2 border-b border-gray-100 pb-4">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Foto Oficial da Carteirinha</span>
                  <div className="relative group">
                    <div className="h-24 w-20 rounded border-2 border-accent bg-slate-900/50 overflow-hidden flex items-center justify-center shadow-md relative">
                      {cardPhotoBase64 ? (
                        <img
                          src={cardPhotoBase64}
                          alt="Foto da carteirinha"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-accent/60 w-full h-full p-2 text-center">
                          <span className="text-[8px] font-bold uppercase">Sem Foto</span>
                          <span className="text-[6px] text-text-muted mt-0.5">Oficial</span>
                        </div>
                      )}
                    </div>

                    {/* Photo Edit Overlay */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 text-white rounded flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
                      aria-label="Alterar foto da carteirinha"
                    >
                      <Camera className="h-5 w-5" />
                      <span className="text-[8px] font-bold uppercase mt-1">Alterar</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCardPhotoChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-bold text-accent-dark hover:underline focus:outline-none"
                    >
                      Escolher Foto
                    </button>
                    {cardPhotoBase64 && (
                      <>
                        <span className="text-[10px] text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => setCardPhotoBase64(null)}
                          className="text-[10px] font-bold text-red-600 hover:underline focus:outline-none"
                        >
                          Remover
                        </button>
                      </>
                    )}
                  </div>
                  {cardPhotoError && (
                    <span className="text-xs text-red-600 font-semibold">{cardPhotoError}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nome Completo"
                    placeholder="Ex: SGT. MARCOS OLIVEIRA"
                    error={errors.name?.message}
                    {...register("name")}
                  />

                  <Input
                    label="Endereço de E-mail"
                    type="email"
                    placeholder="Ex: marcos@assec.com.br"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="role" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Perfil / Role do Usuário
                    </label>
                    <select
                      id="role"
                      className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      {...register("role")}
                    >
                      <option value="USER">Associado (USER)</option>
                      <option value="PROFESSIONAL">Profissional (PROFESSIONAL)</option>
                      <option value="ADMIN">Administrador (ADMIN)</option>
                      <option value="PRESIDENT">Presidente (PRESIDENT)</option>
                      <option value="CONTABILIDADE">Contabilidade (CONTABILIDADE)</option>
                      <option value="EDITOR">Editor (EDITOR)</option>
                    </select>
                    {errors.role?.message && (
                      <span className="text-xs text-red-600 font-medium mt-1 block">{errors.role.message}</span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Status da Conta
                    </label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      {...register("status")}
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Suspenso">Suspenso</option>
                    </select>
                    {errors.status?.message && (
                      <span className="text-xs text-red-600 font-medium mt-1 block">{errors.status.message}</span>
                    )}
                  </div>
                </div>

                {/* Conditional specialty field for professionals */}
                {selectedRole === "PROFESSIONAL" && (
                  <div>
                    <label htmlFor="specialty" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Especialidade Médica/Profissional
                    </label>
                    <select
                      id="specialty"
                      className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      {...register("specialty")}
                    >
                      <option value="Fisioterapia">Fisioterapia</option>
                      <option value="Assistência Jurídica">Assistência Jurídica</option>
                      <option value="Enfermaria">Enfermaria</option>
                      <option value="Psicologia">Psicologia</option>
                      <option value="Administrativo">Administrativo</option>
                    </select>
                    {errors.specialty?.message && (
                      <span className="text-xs text-red-600 font-medium mt-1 block">{errors.specialty.message}</span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="CPF"
                    placeholder="000.000.000-00"
                    error={errors.cpf?.message}
                    {...register("cpf")}
                  />

                  <Input
                    label="RG"
                    placeholder="RG / Órgão Emissor"
                    error={errors.rg?.message}
                    {...register("rg")}
                  />

                  <Input
                    label="Matrícula Funcional"
                    placeholder="ASSEC-YYYY-XXXX"
                    error={errors.matricula?.message}
                    {...register("matricula")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-text-primary">Cargo na organização</label>
                    <select
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                      {...register("org")}
                    >
                      <option value="">Selecione a corporação...</option>
                      <option value="POLICIAL PENAL">POLICIAL PENAL</option>
                      <option value="POLICIAL MILITAR">POLICIAL MILITAR</option>
                      <option value="POLICIAL CIVIL">POLICIAL CIVIL</option>
                      <option value="BOMBEIRO MILITAR">BOMBEIRO MILITAR</option>
                      <option value="PERITO CRIMINAL">PERITO CRIMINAL</option>
                    </select>
                    {errors.org?.message && (
                      <span className="text-xs text-red-500">{errors.org.message}</span>
                    )}
                  </div>

                  <Input
                    label={editingUser ? "Senha (deixe em branco para manter)" : "Senha de Acesso"}
                    type="password"
                    placeholder={editingUser ? "••••••••" : "Insira uma senha segura"}
                    error={errors.password?.message}
                    {...register("password")}
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-border pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-border hover:bg-gray-50 rounded-lg text-xs font-semibold text-text-secondary transition-colors"
                  >
                    Cancelar
                  </button>
                  <Button
                    type="submit"
                    loading={submitting}
                    className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 py-2 shadow border-none"
                  >
                    {editingUser ? "Atualizar Usuário" : "Cadastrar Usuário"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom Deletion Confirmation Modal */}
      {deleteConfirmOpen && userToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            if (!submitting) setDeleteConfirmOpen(false);
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full relative border border-border animate-in fade-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className="p-6">
              <div className="flex gap-3 items-start mb-4 text-red-600">
                <AlertCircle className="h-6 w-6 shrink-0 text-red-600" />
                <div>
                  <h3 id="delete-modal-title" className="font-serif font-bold text-lg text-primary">
                    Excluir Usuário?
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>

              <div className="text-xs text-text-primary mb-6 leading-relaxed">
                Deseja realmente <strong className="text-red-600">EXCLUIR permanentemente</strong> o usuário{" "}
                <strong>{userToDelete.name}</strong>? Todos os agendamentos e registros vinculados a ele serão deletados.
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 border border-border hover:bg-gray-50 rounded-lg text-xs font-semibold text-text-secondary transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <Button
                  onClick={confirmDeleteUser}
                  loading={submitting}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 shadow border-none"
                >
                  Excluir Permanentemente
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
