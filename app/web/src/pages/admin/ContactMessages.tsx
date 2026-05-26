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
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Mensagens de Contato</h1>
      <table className="w-full table-auto border-collapse">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">E‑mail</th>
            <th className="p-2 text-left">Assunto</th>
            <th className="p-2 text-left">Mensagem</th>
            <th className="p-2 text-left">Data</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id} className="border-b">
              <td className="p-2">{msg.id}</td>
              <td className="p-2 flex items-center gap-2"><Mail className="w-4 h-4" /> {msg.name}</td>
              <td className="p-2">{msg.email}</td>
              <td className="p-2">{msg.subject}</td>
              <td className="p-2">{msg.message}</td>
              <td className="p-2">{msg.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
