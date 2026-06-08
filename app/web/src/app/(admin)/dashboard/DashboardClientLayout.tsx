"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Shield, LayoutDashboard, FileText, Landmark, LogOut, Loader2, Users, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await apiFetch("/auth/me");
        if (res.ok) {
          setAuthorized(true);
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
      }
    };
    void checkSession();
  }, [router]);

  const handleLogout = async () => {
    // Clear the HttpOnly session cookie via backend
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-page">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <Loader2 className="h-10 w-10 animate-spin text-accent-dark" />
          <span>Verificando credenciais...</span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Avisos/Notícias", href: "/dashboard/notices", icon: FileText },
    { label: "Pousadas", href: "/dashboard/inns", icon: Landmark },
    { label: "Gerenciar Usuários", href: "/portal/usuarios", icon: Users },
    { label: "Terminal Root", href: "/portal/terminal", icon: Terminal },
    { label: "Portal Geral", href: "/portal", icon: Shield },
  ];

  return (
    <div className="flex min-h-screen bg-bg-page text-text-primary">
      {/* Sidebar — fixa na viewport, botão Sair sempre visível */}
      <aside className="w-64 bg-primary text-white border-r border-primary-light flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-primary-light shrink-0">
            <Shield className="h-7 w-7 text-accent" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base leading-none">
                ASSEC ADMIN
              </span>
              <span className="text-[9px] uppercase tracking-widest text-accent-light mt-1">
                Painel de Controle
              </span>
            </div>
          </div>

          {/* Navigation Links — rola se houver muitos itens */}
          <nav className="p-4 space-y-1 overflow-y-auto flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "bg-accent text-primary font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-primary-light"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout — sempre fixo na base da sidebar */}
        <div className="p-4 border-t border-primary-light shrink-0">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 text-gray-300 hover:text-red-400 hover:bg-red-950/20 px-4 py-3 h-auto"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-border flex items-center justify-end px-8 shrink-0">
          <span className="text-sm text-text-secondary">
            Logado como <strong className="text-text-primary">Administrador</strong>
          </span>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
