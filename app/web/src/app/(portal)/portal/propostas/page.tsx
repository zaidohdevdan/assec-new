"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Mail,
  Calendar,
  UserCheck,
  X,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Trash2,
  Download,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { usePortalUser } from "../../PortalUserContext";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

function isMembershipProposal(subject: string): boolean {
  const s = subject.toLowerCase();
  return (
    s.includes("pré-associação") ||
    s.includes("pre-associacao") ||
    s.includes("filiação") ||
    s.includes("filiacao")
  );
}

function extractPhoneDigits(message: string): string | null {
  const match = message.match(
    /(?:CELULAR\/TELEFONE|Telefone|Celular|WhatsApp)\s*:\s*([0-9()\s.-]{8,20})/i
  );
  if (!match?.[1]) return null;
  const digits = match[1].replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return null;
  return digits.startsWith("55") && digits.length >= 12 ? digits : `55${digits}`;
}

export default function PropostasPage() {
  const { user } = usePortalUser();
  const [messages, setMessages] = React.useState<MessageItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedMessage, setSelectedMessage] =
    React.useState<MessageItem | null>(null);
  const [messageToDelete, setMessageToDelete] =
    React.useState<MessageItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<
    "ALL" | "PROPOSAL" | "CONTACT"
  >("ALL");
  const [statusFilter, setStatusFilter] = React.useState<
    "ALL" | "UNREAD" | "READ"
  >("ALL");

  const loadMessages = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/contact");
      if (res.ok) {
        const data: MessageItem[] = await res.json();
        setMessages(
          data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      }
    } catch (err) {
      console.error("Error fetching contact messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (user?.id) {
      void loadMessages();
    }
  }, [user?.id, loadMessages]);

  // Keyboard accessibility for modal closing
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMessage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleRead = async (msg: MessageItem, nextRead: boolean) => {
    try {
      const res = await apiFetch(`/contact/${msg.id}/read`, {
        method: "PATCH",
        body: JSON.stringify({ read: nextRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: nextRead } : m))
        );
        setSelectedMessage((prev) =>
          prev && prev.id === msg.id ? { ...prev, read: nextRead } : prev
        );
      }
    } catch (err) {
      console.error("Error updating message status:", err);
    }
  };

  const handleOpenMessage = (msg: MessageItem) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      void handleToggleRead(msg, true);
    }
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    try {
      const res = await apiFetch(`/contact/${messageToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const deletedId = messageToDelete.id;
        setMessages((prev) => prev.filter((m) => m.id !== deletedId));
        if (selectedMessage?.id === deletedId) {
          setSelectedMessage(null);
        }
        setMessageToDelete(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredMessages.length === 0) return;

    const headers = [
      "Nome",
      "E-mail",
      "Assunto",
      "Tipo",
      "Status",
      "Data",
      "Mensagem",
    ];
    const rows = filteredMessages.map((m) => [
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.email.replace(/"/g, '""')}"`,
      `"${m.subject.replace(/"/g, '""')}"`,
      isMembershipProposal(m.subject) ? "Proposta de Filiação" : "Contato Geral",
      m.read ? "Atendida/Lida" : "Pendente",
      new Date(m.createdAt).toLocaleString("pt-BR"),
      `"${m.message.replace(/"/g, '""').replace(/\r?\n/g, " | ")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `propostas-e-contatos-assec-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3 text-text-secondary animate-pulse">
          <Loader2 className="h-10 w-10 animate-spin text-accent-dark" />
          <span className="text-xs font-semibold">
            Carregando propostas e contatos...
          </span>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN";
  const isPresident = user.role === "PRESIDENT";

  if (!isAdmin && !isPresident) {
    return (
      <div className="p-8 text-center text-rose-600 font-semibold">
        Acesso negado. Esta página é exclusiva para a administração e diretoria.
      </div>
    );
  }

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => !m.read).length;
  const proposalsCount = messages.filter((m) =>
    isMembershipProposal(m.subject)
  ).length;
  const contactsCount = totalCount - proposalsCount;

  const filteredMessages = messages.filter((msg) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q);

    const isProposal = isMembershipProposal(msg.subject);
    const matchesCategory =
      categoryFilter === "ALL" ||
      (categoryFilter === "PROPOSAL" && isProposal) ||
      (categoryFilter === "CONTACT" && !isProposal);

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "UNREAD" && !msg.read) ||
      (statusFilter === "READ" && msg.read);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const selectedPhone = selectedMessage
    ? extractPhoneDigits(selectedMessage.message)
    : null;

  return (
    <div className="space-y-8 animate-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
            Propostas de Filiação e Contatos
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Gerencie solicitações de pré-associação, fichas de filiação online e
            mensagens enviadas pelo portal institucional.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportCSV}
          disabled={filteredMessages.length === 0}
          className="border-border text-primary hover:bg-slate-50 font-bold text-xs uppercase tracking-widest px-4 py-2.5 shadow self-start sm:self-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV ({filteredMessages.length})
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Total Recebido
            </span>
            <span className="text-2xl font-extrabold text-primary block mt-1">
              {loading ? "..." : totalCount}
            </span>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Mail className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Pendentes (Não lidas)
            </span>
            <span className="text-2xl font-extrabold text-amber-600 block mt-1">
              {loading ? "..." : unreadCount}
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Propostas de Filiação
            </span>
            <span className="text-2xl font-extrabold text-emerald-600 block mt-1">
              {loading ? "..." : proposalsCount}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserCheck className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Contatos / Dúvidas
            </span>
            <span className="text-2xl font-extrabold text-blue-600 block mt-1">
              {loading ? "..." : contactsCount}
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <CheckCircle className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="p-6 bg-white border border-border shadow-sm">
        <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-accent-dark" />
            <h2 className="font-serif font-bold text-lg text-primary">
              Filtrar Propostas e Contatos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, e-mail, órgão, telefone..."
                className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value as "ALL" | "PROPOSAL" | "CONTACT"
                )
              }
              className="px-3 py-2 border border-border rounded-lg text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="ALL">Todos os Tipos</option>
              <option value="PROPOSAL">
                Apenas Propostas de Filiação / Pré-Associação
              </option>
              <option value="CONTACT">Apenas Contatos Gerais / Dúvidas</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | "UNREAD" | "READ")
              }
              className="px-3 py-2 border border-border rounded-lg text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="ALL">Todos os Status</option>
              <option value="UNREAD">Pendentes (Não lidas)</option>
              <option value="READ">Atendidas (Lidas)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-text-secondary">
            Carregando propostas e contatos...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-sm text-text-secondary">
            Nenhuma proposta ou contato corresponde aos filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                  <th className="p-4">Status</th>
                  <th className="p-4">Nome</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">Assunto / Origem</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Resumo da Mensagem</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMessages.map((msg) => {
                  const phone = extractPhoneDigits(msg.message);
                  const isProposal = isMembershipProposal(msg.subject);

                  return (
                    <tr
                      key={msg.id}
                      className={`transition-colors ${
                        msg.read
                          ? "bg-white text-text-primary hover:bg-gray-50/60"
                          : "bg-amber-50/30 text-text-primary hover:bg-amber-50/50"
                      }`}
                    >
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                            msg.read
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              msg.read ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {msg.read ? "Atendida" : "Nova"}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-primary">
                        {msg.name}
                      </td>
                      <td className="p-4 text-text-secondary text-xs">
                        {msg.email}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold text-[11px] px-2.5 py-1 rounded border ${
                            isProposal
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-gray-100 text-text-primary border-gray-200"
                          }`}
                        >
                          {msg.subject}
                        </span>
                      </td>
                      <td className="p-4 text-text-muted text-xs whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div
                          className="text-xs text-text-secondary max-w-xs truncate"
                          title={msg.message}
                        >
                          {msg.message}
                        </div>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {phone && (
                            <a
                              href={`https://wa.me/${phone}?text=${encodeURIComponent(
                                `Olá, ${msg.name}! Recebemos sua solicitação (${msg.subject}) no portal da ASSEC.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-bold bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-colors"
                              title="Chamar no WhatsApp"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span className="hidden xl:inline">WhatsApp</span>
                            </a>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => handleOpenMessage(msg)}
                            className="text-primary hover:text-accent-dark hover:bg-gray-100 py-1.5 px-3 h-auto text-xs font-bold"
                          >
                            Visualizar
                          </Button>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => setMessageToDelete(msg)}
                              className="p-1.5 text-text-muted hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                              title="Excluir registro"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
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

      {/* Contact / Proposal Details Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative border border-border animate-in fade-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-accent/90 text-primary border border-transparent">
                    {selectedMessage.subject}
                  </span>
                  <h2
                    id="modal-title"
                    className="font-serif font-bold text-2xl text-primary mt-2"
                  >
                    {selectedMessage.name}
                  </h2>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs text-accent-dark hover:underline block mt-1"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-text-muted hover:text-text-primary transition-colors p-1"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                  Detalhes da Mensagem / Proposta:
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-text-primary whitespace-pre-wrap leading-relaxed border border-border font-mono text-[12px]">
                  {selectedMessage.message}
                </div>
                <div className="text-xs text-text-muted mt-3 flex justify-between items-center">
                  <span>
                    Recebido em:{" "}
                    {new Date(selectedMessage.createdAt).toLocaleString("pt-BR")}
                  </span>
                  <span
                    className={`font-bold uppercase text-[10px] ${
                      selectedMessage.read
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {selectedMessage.read ? "✓ Atendida / Lida" : "● Pendente"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3 border-t border-border pt-4">
                <div className="flex flex-wrap gap-2">
                  {selectedPhone && (
                    <a
                      href={`https://wa.me/${selectedPhone}?text=${encodeURIComponent(
                        `Olá, ${selectedMessage.name}! Recebemos sua solicitação (${selectedMessage.subject}) no portal da ASSEC.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#25D366] text-white hover:bg-[#20BA56] transition-colors shadow-sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Chamar no WhatsApp</span>
                    </a>
                  )}
                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      `ASSEC - Retorno: ${selectedMessage.subject}`
                    )}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-light transition-colors shadow-sm"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Responder E-mail</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setMessageToDelete(selectedMessage)}
                      className="px-3 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Excluir</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleRead(selectedMessage, !selectedMessage.read)
                    }
                    className="px-3 py-2 border border-border hover:bg-gray-50 rounded-lg text-xs font-semibold text-text-secondary transition-colors"
                  >
                    {selectedMessage.read
                      ? "Marcar como Pendente"
                      : "Marcar como Atendida"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 border border-border hover:bg-gray-50 rounded-lg text-xs font-semibold text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Deletion Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(messageToDelete)}
        title="Excluir Proposta / Mensagem?"
        subtitle="Esta ação não pode ser desfeita."
        description={
          messageToDelete ? (
            <>
              Deseja realmente{" "}
              <strong className="text-red-600">EXCLUIR permanentemente</strong>{" "}
              o registro enviado por <strong>{messageToDelete.name}</strong> (
              <em>{messageToDelete.subject}</em>)?
            </>
          ) : null
        }
        confirmLabel="Excluir Permanentemente"
        loading={deleting}
        onConfirm={confirmDeleteMessage}
        onCancel={() => {
          if (!deleting) setMessageToDelete(null);
        }}
      />
    </div>
  );
}

