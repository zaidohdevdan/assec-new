"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Benefícios", href: "/beneficios" },
  { label: "Notícias", href: "/noticias" },
  { label: "Contato", href: "/contato" },
];

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [user, setUser] = React.useState<{ name: string; role: string } | null>(null);

  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setTimeout(() => toggleButtonRef.current?.focus(), 50);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);

    const checkSession = async () => {
      const userStr = localStorage.getItem("user");
      const hasProfileCookie =
        typeof document !== "undefined" &&
        document.cookie.split(";").some((c) => c.trim().startsWith("assec_user_profile="));

      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
          if (parsedUser.role === "ADMIN") setIsAdmin(true);
        } catch (err) {
          console.error("Failed to parse user session", err);
        }
      }

      // Se não há usuário no localStorage nem cookie de sessão, o visitante não está autenticado
      if (!userStr && !hasProfileCookie) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      try {
        const res = await apiFetch("/auth/me");
        if (res.ok) {
          const parsedUser = await res.json();
          setUser(parsedUser);
          setIsAdmin(parsedUser.role === "ADMIN");
          localStorage.setItem("user", JSON.stringify(parsedUser));
        } else {
          setUser(null);
          setIsAdmin(false);
          localStorage.removeItem("user");
          document.cookie = "assec_user_profile=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      } catch {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem("user");
      }
    };
    void checkSession();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "assec_user_profile=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAdmin(false);
    setUser(null);
    window.location.href = "/login";
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only">Ir ao conteúdo</a>
      {/* Institutional top bar */}
      <div className="bg-primary-light py-2 text-center border-b border-primary-light/30">
        <span className="inline-block bg-primary-light/30 backdrop-blur-sm rounded-md px-3 py-1 font-serif text-xs md:text-sm text-white">
          Protegendo quem protege a nossa sociedade.
        </span>
      </div>

      <header role="banner" aria-label="Cabeçalho institucional"
        className={`sticky top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled || isOpen
          ? "bg-gradient-to-r from-primary to-primary-light shadow-md border-primary-light/60 py-2"
          : "bg-gradient-to-r from-primary to-primary-light border-transparent py-3"}`}
      >
        {/* Top Associate Indicator Bar */}
        {user && user.role === "USER" && (
          <div className="bg-slate-950 text-white text-[11px] sm:text-xs py-2 px-4 sm:px-8 flex justify-between items-center border-b border-slate-900 font-sans tracking-wide">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Olá, <strong className="text-accent-light font-bold">{user.name}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/portal" className="text-accent hover:text-accent-light font-bold transition-colors">
                Área do Associado →
              </Link>
              <span className="text-slate-800">|</span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 font-medium transition-colors focus:outline-none"
              >
                Sair
              </button>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 transition-all duration-300 min-w-0 gap-2 sm:gap-4">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1 sm:flex-initial text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none p-0.5 sm:p-1 rounded group"
            >
              <Image
                src="/logo-transparent.webp"
                alt="ASSEC Logo"
                width={56}
                height={56}
                className="h-9 sm:h-12 md:h-13 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                priority
              />
              {/* Vertical Divider Art — sólida e centralizada */}
              <div className="h-7 sm:h-9 w-[1.5px] bg-[#D4AF37]/50 self-center rounded-full shrink-0" />
              <div className="flex flex-col justify-center text-left min-w-0">
                <span className="font-serif font-extrabold text-base sm:text-xl md:text-2xl leading-none tracking-wider text-white group-hover:text-accent transition-colors duration-300">
                  ASSEC
                </span>
                <span className="text-[8.5px] xs:text-[10px] sm:text-[12px] md:text-[13px] font-sans font-bold uppercase tracking-wide text-accent mt-0.5 block leading-tight transition-all line-clamp-2">
                  Associação dos Servidores da Segurança do Ceará
                </span>
              </div>
            </Link>

            {/* Desktop Nav + CTA unidos à direita com alinhamento perfeito */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {/* Desktop Nav */}
              <nav role="navigation" aria-label="Menu de navegação" className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors duration-200 group focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${isActive ? "text-accent" : "text-gray-300 hover:text-white"}`}
                    >
                      <span className="truncate" title={item.label}>{item.label}</span>
                      <span
                        className={`absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-accent rounded-full transform transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Separador vertical sutil entre o menu e as ações */}
              <div className="h-6 w-[1px] bg-white/20" />

              {/* Desktop CTA */}
              <div className="flex items-center gap-3">
                {user ? (
                  <Link href={user.role === "ADMIN" ? "/dashboard" : "/portal"}>
                    <Button variant="primary" title="Minha Área" className="h-10 bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 shadow hover:shadow-lg transition-all duration-300 animate-none">
                      Minha Área
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      title="Entrar"
                      className="inline-flex items-center justify-center h-10 rounded-md text-white hover:text-accent font-bold text-xs uppercase tracking-widest px-4 bg-white/10 hover:bg-white/20 border border-white/10 transition-colors duration-200"
                    >
                      Entrar
                    </Link>
                    <Link href="/associe-se">
                      <Button variant="primary" title="Associe‑se" className="h-10 bg-accent text-primary hover:bg-accent-light hover:scale-[1.02] font-bold text-xs uppercase tracking-widest px-4 shadow-md hover:shadow-lg transition-all duration-300 animate-none whitespace-nowrap">
                        <Plus className="mr-1 h-4 w-4" />
                        Associe‑se
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden shrink-0">
              <button
                ref={toggleButtonRef}
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl text-white bg-white/10 hover:bg-white/15 border border-white/15 hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 active:scale-95 shadow-sm"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Abrir menu principal</span>
                {isOpen ? (
                  <X className="h-5 w-5 transform rotate-90 transition-transform duration-200 text-accent" />
                ) : (
                  <Menu className="h-5 w-5 transform rotate-0 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden animate-none" id="mobile-menu">
            <div className="px-3 pt-2 pb-5 space-y-1 sm:px-4 bg-primary/95 backdrop-blur-md border-t border-primary-light/50 shadow-inner">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-3 rounded-md text-sm font-bold uppercase tracking-widest transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${isActive ? "text-accent bg-primary-light/65" : "text-gray-300 hover:text-white hover:bg-primary-light/40"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4 pb-1 px-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link href={user.role === "ADMIN" ? "/dashboard" : "/portal"} onClick={() => setIsOpen(false)} className="block text-center py-2 text-sm font-bold uppercase tracking-widest text-accent hover:bg-primary-light/40 rounded transition-colors">
                      Minha Área
                    </Link>
                    <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full text-center py-2 text-sm font-bold uppercase tracking-widest text-red-400 hover:bg-primary-light/40 rounded transition-colors">
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center py-2 text-sm font-bold uppercase tracking-widest text-white hover:bg-primary-light/40 rounded transition-colors">
                      Entrar
                    </Link>
                    <Link href="/associe-se" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" className="w-full bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest py-3 shadow animate-none">
                        Associe-se
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
