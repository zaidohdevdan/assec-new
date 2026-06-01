import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Mail, Building2, TrendingUp } from "lucide-react";

const data = [
  { name: "Usuários", value: 120 },
  { name: "Mensagens", value: 45 },
  { name: "Pousadas", value: 30 },
];

const stats = [
  { label: "Total de Usuários", value: "120", icon: Users, color: "bg-blue-500" },
  { label: "Mensagens", value: "45", icon: Mail, color: "bg-purple-500" },
  { label: "Pousadas", value: "30", icon: Building2, color: "bg-green-500" },
  { label: "Taxa de Crescimento", value: "+12%", icon: TrendingUp, color: "bg-orange-500" },
];

export default function AdminDashboard() {
  return (
    <div className="w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-blue-950 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
        <h3 className="text-lg font-bold text-blue-950 mb-6">Estatísticas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-lg font-bold text-blue-950 mb-6">Atividade Recente</h3>
        <div className="space-y-4">
          {[
            { action: "Novo usuário registrado", time: "há 2 horas", user: "João Silva" },
            { action: "Mensagem de contato recebida", time: "há 4 horas", user: "Maria Santos" },
            { action: "Pousada adicionada", time: "há 1 dia", user: "Sistema" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div>
                <p className="font-medium text-slate-900">{activity.action}</p>
                <p className="text-sm text-slate-500">{activity.user}</p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
