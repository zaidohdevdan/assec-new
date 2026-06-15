"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Landmark, Mail, Calendar, UserCheck, X, Heart } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = React.useState({ notices: 0, benefits: 0, messages: 0 });
  const [messages, setMessages] = React.useState<MessageItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // New States
  const [selectedMessage, setSelectedMessage] = React.useState<MessageItem | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [resNotices, resBenefits, resContact] = await Promise.all([
          apiFetch("/notices"),
          apiFetch("/benefits?all=true"),
          apiFetch("/contact"),
        ]);

        let noticesCount = 0;
        let benefitsCount = 0;
        let contactMessages: MessageItem[] = [];

        if (resNotices.ok) {
          const notices = await resNotices.json();
          noticesCount = notices.length;
        }

        if (resBenefits.ok) {
          const benefits = await resBenefits.json();
          benefitsCount = benefits.length;
        }

        if (resContact.ok) {
          contactMessages = await resContact.json();
        }

        setStats({
          notices: noticesCount,
          benefits: benefitsCount,
          messages: contactMessages.length,
        });

        // Show recent messages first
        setMessages(
          contactMessages.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const filteredMessages = messages.filter((msg) => {
    return (
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const displayedMessages = showAll ? filteredMessages : filteredMessages.slice(0, 5);

  return (
    <div className="space-y-8 animate-none">
      {/* Top Header */}
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
          Visão Geral
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Acompanhe estatísticas, últimas notícias e solicitações de filiação.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-6">
          <div className="p-4 bg-primary text-accent rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-primary block">
              {loading ? "..." : stats.notices}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Avisos e Notícias
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-6">
          <div className="p-4 bg-primary text-accent rounded-lg">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-primary block">
              {loading ? "..." : stats.benefits}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Benefícios Cadastrados
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-6">
          <div className="p-4 bg-primary text-accent rounded-lg">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-primary block">
              {loading ? "..." : stats.messages}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Mensagens / Propostas
            </span>
          </div>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h2 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-accent-dark" />
              <span>Últimas Propostas e Contatos Recebidos</span>
            </h2>
            {messages.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="text-xs font-bold text-primary hover:text-accent-dark transition-colors self-start sm:self-center"
              >
                {showAll ? "Ver Apenas Recentes (5)" : `Ver Todas as Propostas (${messages.length})`}
              </button>
            )}
          </div>

          {/* Search bar for messages */}
          {messages.length > 0 && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar contatos por nome, e-mail, assunto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-10 w-full sm:max-w-md rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-sm text-text-secondary">
              Carregando contatos...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-sm text-text-secondary">
              Nenhuma proposta ou contato correspondente.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-text-secondary font-semibold">
                    <th className="pb-3 pr-4">Nome</th>
                    <th className="pb-3 px-4">E-mail</th>
                    <th className="pb-3 px-4">Assunto</th>
                    <th className="pb-3 px-4">Data</th>
                    <th className="pb-3 px-4">Mensagem resumida</th>
                    <th className="pb-3 pl-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayedMessages.map((msg) => (
                    <tr key={msg.id} className="text-text-primary hover:bg-gray-50/50">
                      <td className="py-3.5 pr-4 font-medium">{msg.name}</td>
                      <td className="py-3.5 px-4 text-text-secondary">{msg.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-xs bg-gray-100 text-text-primary px-2 py-0.5 rounded">
                          {msg.subject}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(msg.createdAt).toLocaleDateString("pt-BR")}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-text-secondary max-w-xs truncate" title={msg.message}>
                          {msg.message}
                        </div>
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedMessage(msg)}
                          className="text-primary hover:text-accent-dark hover:bg-gray-100 py-1.5 px-3 h-auto text-xs font-bold"
                        >
                          Visualizar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Contact Details Modal */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedMessage(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-border animate-in fade-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/90 text-primary border border-transparent">
                    {selectedMessage.subject}
                  </span>
                  <h2 id="modal-title" className="font-serif font-bold text-2xl text-primary mt-2">
                    {selectedMessage.name}
                  </h2>
                  <a href={`mailto:${selectedMessage.email}`} className="text-xs text-accent-dark hover:underline block mt-1">
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
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-text-primary whitespace-pre-wrap leading-relaxed border border-border font-mono text-[12px]">
                  {selectedMessage.message}
                </div>
                <div className="text-xs text-text-muted mt-3">
                  Recebido em: {new Date(selectedMessage.createdAt).toLocaleString("pt-BR")}
                </div>
              </div>

              <div className="flex justify-end border-t border-border pt-4">
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
      )}
    </div>
  );
}
