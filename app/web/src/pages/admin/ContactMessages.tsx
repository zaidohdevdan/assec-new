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
            {messages.length > 0 ? (
              messages.map((msg: any) => (
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
                  <td className="p-4 text-sm text-slate-600">{new Date(msg.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
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
