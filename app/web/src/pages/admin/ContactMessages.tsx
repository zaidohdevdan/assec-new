import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Mail } from "lucide-react";


const fetchMessages = async () => {
  const response = await api.get("/contact");
  return response.data;
};

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages().then(setMessages).catch(console.error);
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
