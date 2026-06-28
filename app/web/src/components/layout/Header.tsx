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
      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
          if (parsedUser.role === "ADMIN") setIsAdmin(true);
        } catch (err) {
          console.error("Failed to parse user session", err);
        }
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
    setIsAdmin(false);
    setUser(null);
    window.location.reload();
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-nowrap items-center justify-between h-14 sm:h-16 transition-all duration-300 min-w-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none p-1 rounded group w-fit">
              <Image
                src="/logo-transparent.webp"
                alt="ASSEC Logo"
                width={64}
                height={64}
                className="h-11 md:h-14 lg:h-16 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
              {/* Vertical Divider Art */}
              <div className="h-9 md:h-11 w-[1.5px] bg-gradient-to-b from-accent via-accent/40 to-transparent self-center rounded-full opacity-80" />
              <div className="flex flex-col justify-center">
                <span className="font-serif font-extrabold text-lg sm:text-xl md:text-2xl leading-none tracking-wider text-white group-hover:text-accent transition-colors duration-300">
                  ASSEC
                </span>
                <span className="text-[12px] md:text-[14px] lg:text-[15px] font-sans font-bold uppercase tracking-wider text-accent mt-1 block max-w-[195px] lg:max-w-[260px] xl:max-w-none leading-tight transition-all">
                  Associação dos Servidores da Segurança do Ceará
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav role="navigation" aria-label="Menu de navegação" className="hidden lg:flex space-x-1 items-center h-full">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-md text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors duration-200 group focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${isActive ? "text-accent" : "text-gray-300 hover:text-white"}`}
                  >
                    <span className="truncate" title={item.label}>{item.label}</span>
                    <span
                      className={`absolute bottom-0.5 left-4 right-4 h-[2px] bg-accent transform transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <Link href={user.role === "ADMIN" ? "/dashboard" : "/portal"}>
                  <Button variant="primary" title="Minha Área" className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 py-2 shadow hover:shadow-lg transition-all duration-300 animate-none">
                    Minha Área
                  </Button>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    title="Entrar"
                    className="inline-flex items-center justify-center rounded-md text-white hover:text-accent font-bold text-xs uppercase tracking-widest px-4 py-2.5 bg-white/10 hover:bg-white/20 transition-colors duration-200"
                  >
                    Entrar
                  </Link>
                  <Link href="/associe-se">
                    <Button variant="primary" title="Associe‑se" className="bg-accent text-primary hover:bg-accent-light hover:scale-[1.02] font-bold text-xs uppercase tracking-widest px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 animate-none whitespace-nowrap">
                      <Plus className="mr-1 h-4 w-4" />
                      Associe‑se
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                ref={toggleButtonRef}
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Abrir menu principal</span>
                {isOpen ? <X className="h-5 w-5 transform rotate-45 transition-transform duration-200" /> : <Menu className="h-5 w-5 transform rotate-0 transition-transform duration-200" />}
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
