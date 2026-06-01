import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../services/api";

const fetchStats = async () => {
  const [usersRes, contactsRes, schedulesRes] = await Promise.all([
    api.get("/users"),
    api.get("/contact"),
    api.get("/schedules"),
  ]);
  return [
    { name: "Usuários", value: usersRes.data.length },
    { name: "Mensagens", value: contactsRes.data.length },
    { name: "Agendamentos", value: schedulesRes.data.length },
  ];
};

export default function AdminDashboard() {
  const [data, setData] = useState([{ name: "Usuários", value: 0 }, { name: "Mensagens", value: 0 }, { name: "Agendamentos", value: 0 }]);

  useEffect(() => {
    fetchStats().then(setData).catch(console.error);
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Painel Admin</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
