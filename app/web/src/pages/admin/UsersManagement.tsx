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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-left text-sm font-bold text-slate-600">ID</th>
              <th className="p-4 text-left text-sm font-bold text-slate-600">Nome</th>
              <th className="p-4 text-left text-sm font-bold text-slate-600">E‑mail</th>
              <th className="p-4 text-left text-sm font-bold text-slate-600">Perfil</th>
              <th className="p-4 text-left text-sm font-bold text-slate-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u: any) => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-slate-600">{u.id}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{u.email}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'ADMIN'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">Editar</button>
                      <button className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
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
