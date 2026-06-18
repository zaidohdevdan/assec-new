"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
          if (parsedUser.role === "ADMIN") {
            setIsAdmin(true);
          }
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
          localStorage.removeItem("token");
        }
      } catch {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    };
    void checkSession();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAdmin(false);
    setUser(null);
    window.location.reload();
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled || isOpen
          ? "bg-primary shadow-md border-primary-light/60 py-2"
          : "bg-primary border-transparent py-3"
        }`}
    >
      {/* Top Admin Indicator Bar */}
      {isAdmin && (
        <div className="bg-slate-950 text-white text-[11px] sm:text-xs py-2 px-4 sm:px-8 flex justify-between items-center border-b border-slate-900 font-sans tracking-wide">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Você está logado como <strong className="text-accent-light font-bold">Administrador</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-accent hover:text-accent-light font-bold transition-colors">
              Ir para o Painel Admin →
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
        <div className="flex items-center justify-between h-14 sm:h-16 transition-all duration-300">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none p-1 rounded group w-fit">
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
              <span className="text-[7.5px] md:text-[9.5px] lg:text-[11px] font-sans font-bold uppercase tracking-wider text-accent mt-1 block max-w-[195px] md:max-w-none leading-tight">
                Associação dos Servidores da Segurança do Ceará
              </span>
            </div>
          </Link>
 
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1 items-center h-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-md text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors duration-200 group focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${isActive
                      ? "text-accent"
                      : "text-gray-300 hover:text-white"
                    }`}
                >
                  <span>{item.label}</span>
                  {/* Underline Indicator Animation */}
                  <span 
                    className={`absolute bottom-0.5 left-4 right-4 h-[2px] bg-accent transform transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
 
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href={user.role === "ADMIN" ? "/dashboard" : "/portal"} tabIndex={-1}>
                <Button variant="primary" className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 py-2 shadow hover:shadow-lg transition-all duration-300 animate-none">
                  Minha Área
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" tabIndex={-1}>
                  <Button variant="ghost" className="text-white hover:text-accent font-bold text-xs uppercase tracking-widest px-3 py-2 hover:bg-white/10 transition-colors animate-none">
                    Entrar
                  </Button>
                </Link>
                <Link href="/associe-se" tabIndex={-1}>
                  <Button variant="primary" className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 py-2 shadow hover:shadow-lg transition-all duration-300 animate-none">
                    Associe-se
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden animate-none" id="mobile-menu">
          <div className="px-3 pt-2 pb-5 space-y-1 sm:px-4 bg-primary/95 backdrop-blur-md border-t border-primary-light/50 shadow-inner">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-md text-sm font-bold uppercase tracking-widest transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${isActive
                      ? "text-accent bg-primary-light/65"
                      : "text-gray-300 hover:text-white hover:bg-primary-light/40"
                    }`}
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
                  <Link href="/associe-se" onClick={() => setIsOpen(false)} tabIndex={-1}>
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
  );
};

export default Header;

