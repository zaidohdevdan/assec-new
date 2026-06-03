import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { User as UserIcon } from "lucide-react";
import api from "../../services/api";

// Service functions
const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const { token } = useAuthStore(); // ensure token present for interceptor

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (e) {
        console.error("Failed to load users", e);
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
              <th className="p-4 text-left text-sm font-bold text-[var(--ink-muted)]">Perfil</th>
              <th className="p-4 text-left text-sm font-bold text-[var(--ink-muted)]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u: any) => (
                <tr key={u.id} className="border-b border-[var(--border)] hover:bg-[var(--gold-glow)]/40 transition-colors">
                  <td className="p-4 text-sm text-[var(--ink-muted)]">{u.id}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                       <UserIcon className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-[var(--ink)]">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--ink-muted)]">{u.email}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'ADMIN'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-[var(--gold-glow)] text-[var(--gold)] border border-[var(--border-gold)]'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold bg-[var(--gold-glow)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white border border-[var(--border-gold)] rounded-lg transition-colors cursor-pointer">Editar</button>
                      <button className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 rounded-lg transition-colors cursor-pointer">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--ink-muted)]">
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
