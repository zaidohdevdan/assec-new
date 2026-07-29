"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, CreditCard, User, Users, LogOut, ArrowLeft, Loader2, Menu, X, Bell, Check, Shield, Terminal, FileText, Landmark, Heart, Video, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { User as UserType, Notification } from "@/lib/types";

let lastAuthCheck = 0;
const AUTH_CHECK_COOLDOWN = 15000; // 15 segundos de cooldown para chamadas de validação de rede

interface PortalClientLayoutProps {
  children: React.ReactNode;
  initialUser?: UserType;
  initialAuthorized?: boolean;
}

export default function PortalClientLayout({
  children,
  initialUser,
  initialAuthorized = false,
}: PortalClientLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = React.useState(initialAuthorized);
  const [userName, setUserName] = React.useState(initialUser?.name || "");
  const [userPhoto, setUserPhoto] = React.useState<string | null>(initialUser?.avatarUrl || null);
  const [userRole, setUserRole] = React.useState<string>(initialUser?.role || "USER");
  const [userSpecialty, setUserSpecialty] = React.useState<string | null>(initialUser?.specialty || null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Notifications state
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const fetchNotifications = React.useCallback(async () => {
    try {
      const res = await apiFetch("/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, []);

  React.useEffect(() => {
    if (!authorized) return;
    fetchNotifications();

    // Polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [authorized, fetchNotifications]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await apiFetch("/notifications/read-all", { method: "POST" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  React.useEffect(() => {
    // Check session via HttpOnly cookie — the browser sends it automatically
    const checkAuth = async () => {
      // If we already have initialUser from the server cookie, skip localStorage
      // override to prevent hydration mismatch (server HTML uses cookie data,
      // localStorage may have stale/different role).
      const userStr = localStorage.getItem("user");
      if (!initialUser && userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name ?? "");
          setUserPhoto(user.avatarUrl ?? null);
          setUserRole(user.role ?? "USER");
          setUserSpecialty(user.specialty ?? null);
          setAuthorized(true); // Autoriza imediatamente com base no cache para evitar tela de loading Piscando
        } catch {
          // ignore malformed cached data
        }
      }

      // Evita chamadas de rede redundantes caso tenha sido verificado muito recentemente (cooldown)
      const now = Date.now();
      if ((userStr || initialUser) && (now - lastAuthCheck < AUTH_CHECK_COOLDOWN)) {
        return;
      }

      // Then validate the session against the backend (uses cookie automatically)
      try {
        const res = await apiFetch("/auth/me");
        if (res.ok) {
          lastAuthCheck = Date.now(); // Atualiza o timestamp de sucesso
          const user = await res.json();
          setUserName(user.name ?? "");
          setUserPhoto(user.avatarUrl ?? null);
          setUserRole(user.role ?? "USER");
          setUserSpecialty(user.specialty ?? null);
          // Sync localStorage display cache with fresh data
          localStorage.setItem("user", JSON.stringify(user));
          const secureFlag = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
          document.cookie = `assec_user_profile=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=31536000; SameSite=Lax${secureFlag}`;
          setAuthorized(true);
          window.dispatchEvent(new Event("user-profile-updated"));
        } else {
          // Session expired or account suspended — force re-login
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          document.cookie = "assec_user_profile=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          router.push("/login");
        }
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        document.cookie = "assec_user_profile=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/login");
      }
    };
    void checkAuth();
  }, [router]);

  // Sync profile photo if updated in profile page (we'll trigger a storage event)
  React.useEffect(() => {
    setMounted(true);
    
    // Unregister any active service worker in development mode
    if (process.env.NODE_ENV === "development" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          console.log("PortalLayout: Service Worker unregistered in development mode");
        }
      });
    }

    const handleStorageChange = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name);
          setUserPhoto(user.avatarUrl || null);
          setUserRole(user.role || "USER");
          setUserSpecialty(user.specialty || null);
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener("user-profile-updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-profile-updated", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    // Call backend to clear the HttpOnly session cookie (browser cannot clear it via JS)
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => null);
    // Clear the non-sensitive display cache from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Clear profile cookie
    document.cookie = "assec_user_profile=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Full redirect to trigger clean browser state
    window.location.href = "/login";
  };

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-page">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <Loader2 className="h-10 w-10 animate-spin text-accent-dark" />
          <span>Carregando portal...</span>
        </div>
      </div>
    );
  }

  const menuItems = userRole === "ADMIN"
    ? [
      { label: "Visão Geral", href: "/portal", icon: LayoutDashboard },
      { label: "Gerenciar Usuários", href: "/portal/usuarios", icon: Users },
      { label: "Campanhas", href: "/campanhas", icon: Megaphone },
      { label: "Terminal Root", href: "/portal/terminal", icon: Terminal },
      { label: "Meu Perfil", href: "/portal/perfil", icon: User },
    ]
    : userRole === "PRESIDENT"
      ? [
        { label: "Visão Geral", href: "/portal", icon: LayoutDashboard },
        { label: "Fluxo Financeiro", href: "/portal/financas", icon: CreditCard },
        { label: "Relatório de Demandas", href: "/portal/demandas", icon: Calendar },
        { label: "Notícias & Avisos", href: "/portal/noticias", icon: FileText },
        { label: "Convênios & Benefícios", href: "/portal/beneficios", icon: Heart },
        { label: "Campanhas", href: "/campanhas", icon: Megaphone },
        { label: "Meu Perfil", href: "/portal/perfil", icon: User },
      ]
      : userRole === "CONTABILIDADE"
        ? [
          { label: "Visão Geral", href: "/portal", icon: LayoutDashboard },
          { label: "Fluxo Financeiro", href: "/portal/financas", icon: CreditCard },
          { label: "Campanhas", href: "/campanhas", icon: Megaphone },
          { label: "Meu Perfil", href: "/portal/perfil", icon: User },
        ]
        : userRole === "EDITOR"
          ? [
            { label: "Visão Geral", href: "/portal", icon: LayoutDashboard },
            { label: "Painel Administrativo", href: "/dashboard", icon: Shield },
            { label: "Avisos/Notícias", href: "/dashboard/notices", icon: FileText },
            { label: "Gerenciar Benefícios", href: "/dashboard/benefits", icon: Heart },
            { label: "Vídeos (Shorts)", href: "/dashboard/videos", icon: Video },
            { label: "Meu Perfil", href: "/portal/perfil", icon: User },
          ]
          : userRole === "PROFESSIONAL"
            ? [
              { label: "Visão Geral", href: "/portal", icon: LayoutDashboard },
              { label: "Minha Agenda", href: "/portal/agenda", icon: Calendar },
              { label: "Meu Perfil", href: "/portal/perfil", icon: User },
            ]
            : [
              { label: "Visão Geral", href: "/portal", icon: LayoutDashboard },
              { label: "Meus Agendamentos", href: "/portal/agendamentos", icon: Calendar },
              { label: "Carteira Virtual", href: "/portal/carteira", icon: CreditCard },
              { label: "Meu Perfil", href: "/portal/perfil", icon: User },
            ];

  return (
    <div className="flex min-h-screen bg-bg-page text-text-primary">
      {/* Sidebar — Desktop (hidden on mobile) */}
      <aside className="hidden lg:flex w-64 bg-primary text-white border-r border-primary-light flex-col shrink-0 sticky top-0 h-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header/Logo */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-primary-light shrink-0">
            <div className="p-1.5 bg-accent/15 rounded border border-accent/20">
              <CreditCard className="h-6 w-6 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base leading-none text-white">
                ASSEC
              </span>
              <span className="text-[9px] uppercase tracking-widest text-accent-light mt-1">
                {!mounted
                  ? "Carregando..."
                  : userRole === "ADMIN"
                  ? "Portal do Admin"
                  : userRole === "PRESIDENT"
                  ? "Painel da Diretoria"
                  : userRole === "CONTABILIDADE"
                  ? "Gestão Contábil"
                  : userRole === "EDITOR"
                  ? "Editoria / Imprensa"
                  : userRole === "PROFESSIONAL"
                  ? "Portal do Profissional"
                  : "Portal do Associado"}
              </span>
            </div>
          </div>

          {/* User Profile Mini Badge */}
          <div className="p-5 border-b border-primary-light flex items-center gap-3 bg-primary-light/30">
            {!mounted ? (
              <div className="h-10 w-10 rounded-full bg-primary-light/40 border border-primary-light animate-pulse" />
            ) : userPhoto ? (
              <img
                src={userPhoto}
                alt={userName}
                className="h-10 w-10 rounded-full object-cover border-2 border-accent"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm">
                {userName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-gray-200 truncate leading-tight">
                {mounted ? userName : "..."}
              </span>
              <span className="text-[10px] text-accent-light uppercase tracking-wider mt-0.5">
                {!mounted
                  ? "Carregando..."
                  : userRole === "ADMIN"
                  ? "Administrador"
                  : userRole === "PRESIDENT"
                  ? "Presidente"
                  : userRole === "CONTABILIDADE"
                  ? "Contabilidade"
                  : userRole === "EDITOR"
                  ? "Editor de Conteúdo"
                  : userRole === "PROFESSIONAL"
                  ? `Profissional${userSpecialty ? ` (${userSpecialty})` : ""}`
                  : "Associado Ativo"}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto flex-1">
            {mounted ? (
              menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${isActive
                        ? "bg-accent text-primary font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-primary-light"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })
            ) : (
              <div className="space-y-2">
                <div className="h-10 bg-primary-light/20 rounded animate-pulse" />
                <div className="h-10 bg-primary-light/20 rounded animate-pulse" />
                <div className="h-10 bg-primary-light/20 rounded animate-pulse" />
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-primary-light space-y-2 shrink-0">
          <Link href="/" className="w-full">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start gap-3 text-gray-400 hover:text-white hover:bg-primary-light px-4 py-2.5 h-auto text-xs"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
              <span>Voltar ao Site</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 text-gray-400 hover:text-red-400 hover:bg-red-950/20 px-4 py-2.5 h-auto text-xs"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sair</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer (visible when mobileOpen is true) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative flex w-64 max-w-xs flex-col bg-primary text-white border-r border-primary-light h-full p-0 animate-in slide-in-from-left duration-250">
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="h-20 flex items-center justify-between px-6 border-b border-primary-light shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-accent/15 rounded border border-accent/20">
                    <CreditCard className="h-5 w-5 text-accent" />
                  </div>
                  <span className="font-serif font-bold text-base leading-none text-white">
                    ASSEC
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User profile mini badge */}
              <div className="p-5 border-b border-primary-light flex items-center gap-3 bg-primary-light/30">
                {!mounted ? (
                  <div className="h-10 w-10 rounded-full bg-primary-light/40 border border-primary-light animate-pulse" />
                ) : userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={userName}
                    className="h-10 w-10 rounded-full object-cover border-2 border-accent"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm">
                    {userName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-gray-200 truncate leading-tight">
                    {mounted ? userName : "..."}
                  </span>
                  <span className="text-[10px] text-accent-light uppercase tracking-wider mt-0.5">
                    {!mounted
                      ? "Carregando..."
                      : userRole === "ADMIN"
                      ? "Administrador"
                      : userRole === "PRESIDENT"
                      ? "Presidente"
                      : userRole === "CONTABILIDADE"
                      ? "Contabilidade"
                      : userRole === "EDITOR"
                      ? "Editor de Conteúdo"
                      : userRole === "PROFESSIONAL"
                      ? `Profissional${userSpecialty ? ` (${userSpecialty})` : ""}`
                      : "Associado Ativo"}
                  </span>
                </div>
              </div>

              <nav className="p-4 space-y-1 overflow-y-auto flex-1">
                {mounted ? (
                  menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive
                            ? "bg-accent text-primary font-semibold"
                            : "text-gray-300 hover:text-white hover:bg-primary-light"
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })
                ) : (
                  <div className="space-y-2">
                    <div className="h-10 bg-primary-light/20 rounded animate-pulse" />
                    <div className="h-10 bg-primary-light/20 rounded animate-pulse" />
                    <div className="h-10 bg-primary-light/20 rounded animate-pulse" />
                  </div>
                )}
              </nav>
            </div>

            <div className="p-4 border-t border-primary-light space-y-2 shrink-0">
              <Link href="/" className="w-full" onClick={() => setMobileOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start gap-3 text-gray-400 hover:text-white hover:bg-primary-light px-4 py-2.5 h-auto text-xs"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                  <span>Voltar ao Site</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full flex items-center justify-start gap-3 text-gray-400 hover:text-red-400 hover:bg-red-950/20 px-4 py-2.5 h-auto text-xs"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Sair</span>
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-border flex items-center justify-between px-6 lg:px-8 shrink-0">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-md border border-gray-200 text-text-secondary hover:bg-gray-50 focus:outline-none"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block">
            <span className="text-sm font-semibold text-text-secondary">
              Seja bem-vindo ao portal, <strong className="text-primary">{mounted ? userName : "..."}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Click outside overlay for notifications */}
            {showNotifications && (
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setShowNotifications(false)}
              />
            )}

            {/* Notification Bell */}
            <div className="relative z-50">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-text-secondary hover:text-primary hover:bg-gray-100 rounded-full relative transition-colors focus:outline-none"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {/* Dropdown Container */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="p-3 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center">
                    <span className="font-serif font-bold text-sm text-primary">Notificações</span>
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] font-semibold text-accent-dark hover:underline"
                      >
                        Marcar todas como lidas
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-text-muted">
                        Nenhuma notificação encontrada.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 text-left transition-colors flex gap-2.5 items-start ${notif.read ? "bg-white" : "bg-blue-50/20 hover:bg-blue-50/30"
                            }`}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-bold truncate ${notif.read ? "text-primary/80" : "text-primary"}`}>
                              {notif.title}
                            </h4>
                            <p className="text-[11px] text-text-secondary mt-0.5 leading-normal">
                              {notif.content}
                            </p>
                            <span className="text-[9px] text-text-muted mt-1 block">
                              {new Date(notif.createdAt).toLocaleDateString("pt-BR")} às {new Date(notif.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          {!notif.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(notif.id, e)}
                              className="text-text-muted hover:text-accent-dark p-1 rounded hover:bg-gray-100 shrink-0 self-center"
                              title="Marcar como lida"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href="/portal/perfil" className="flex items-center gap-2 group">
              {!mounted ? (
                <div className="h-8 w-8 rounded-full bg-primary-light/10 animate-pulse" />
              ) : userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName}
                  className="h-8 w-8 rounded-full object-cover border border-gray-200 group-hover:border-accent"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-xs group-hover:bg-accent-dark">
                  {userName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-semibold text-text-secondary group-hover:text-primary transition-colors">
                Meu Perfil
              </span>
            </Link>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
