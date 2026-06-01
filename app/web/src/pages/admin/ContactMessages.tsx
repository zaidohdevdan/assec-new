import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";

// Mock data – replace with real API call to /admin/contact-messages
const mockMessages = [
  { id: "1", name: "Cliente A", email: "a@example.com", subject: "Dúvida", message: "Preciso de ajuda...", createdAt: "2026-05-20" },
  { id: "2", name: "Cliente B", email: "b@example.com", subject: "Orçamento", message: "Solicito orçamento para...", createdAt: "2026-05-22" },
];

export default function ContactMessages() {
  const [messages, setMessages] = useState(mockMessages);

  useEffect(() => {
    // fetchMessages().then(setMessages);
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-left text-sm font-bold text-slate-600">ID</th>
              <th className="p-4 text-left text-sm font-bold text-slate-600">Nome</th>
              <th className="p-4 text-left text-sm font-bold text-slate-600">E‑mail</th>
              <th className="p-4 text-left text-sm font-bold text-slate-600">Assunto</th>
              <th className="p-4 text-left text-sm font-bold text-slate-600">Mensagem</th>
              <th className="p-4 text-left text-sm font-bold text-slate-600">Data</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm text-slate-600">{msg.id}</td>
                <td className="p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{msg.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">{msg.email}</td>
                <td className="p-4 text-sm text-slate-600">{msg.subject}</td>
                <td className="p-4 text-sm text-slate-600 max-w-xs truncate">{msg.message}</td>
                <td className="p-4 text-sm text-slate-600">{msg.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
