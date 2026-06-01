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
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestão de Usuários</h1>
      <table className="w-full table-auto border-collapse">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">E‑mail</th>
            <th className="p-2 text-left">Perfil</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.id}</td>
              <td className="p-2 flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> {u.name}
              </td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                {/* Placeholder buttons – implement edit/delete later */}
                <button className="px-3 py-1 mr-2 bg-green-500 text-white rounded">Editar</button>
                <button className="px-3 py-1 bg-red-500 text-white rounded">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
