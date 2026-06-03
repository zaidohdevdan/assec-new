import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import api from "../../services/api";

const fetchMessages = async () => {
  const response = await api.get("/contact");
  return response.data;
};

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMessages();
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load contact messages", e);
      }
    };
    load();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-slate-50 border-b border-[var(--border)]">
            <tr>
              <th className="p-4 text-left text-sm font-bold text-[var(--ink-muted)]">ID</th>
              <th className="p-4 text-left text-sm font-bold text-[var(--ink-muted)]">Nome</th>
              <th className="p-4 text-left text-sm font-bold text-[var(--ink-muted)]">E‑mail</th>
              <th className="p-4 text-left text-sm font-bold text-[var(--ink-muted)]">Assunto</th>
              <th className="p-4 text-left text-sm font-bold text-[var(--ink-muted)]">Mensagem</th>
              <th className="p-4 text-left text-sm font-bold text-[var(--ink-muted)]">Data</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((msg: any) => (
                <tr key={msg.id} className="border-b border-[var(--border)] hover:bg-[var(--gold-glow)]/40 transition-colors">
                  <td className="p-4 text-sm text-[var(--ink-muted)]">{msg.id}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-[var(--ink)]">{msg.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--ink-muted)]">{msg.email}</td>
                  <td className="p-4 text-sm text-[var(--ink-muted)]">{msg.subject}</td>
                  <td className="p-4 text-sm text-[var(--ink-muted)] max-w-xs truncate">{msg.message}</td>
                  <td className="p-4 text-sm text-[var(--ink-muted)]">{new Date(msg.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[var(--ink-muted)]">
                  Nenhuma mensagem encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
