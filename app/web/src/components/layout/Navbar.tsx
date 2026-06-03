/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../../store/useAuthStore";

const NAV_LINKS = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre Nós" },
  { to: "/beneficios", label: "Benefícios" },
  { to: "/servicos", label: "Serviços" },
  { to: "/noticias", label: "Notícias" },
  { to: "/contato", label: "Contato" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleDashboardClick = () => {
    const destination = user?.role === "ADMIN" ? "/admin-dashboard" : "/dashboard";
    navigate(destination);
  };

  const navStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: scrolled
      ? "rgba(255, 255, 255, 0.72)"
      : "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderBottom: scrolled 
      ? "1px solid rgba(180, 138, 29, 0.08)" 
      : "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: scrolled 
      ? "0 8px 32px rgba(180, 138, 29, 0.04)" 
      : "none",
    transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <nav style={navStyle} role="navigation" aria-label="Navegação principal">
      <div className="container-lg" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "5.5rem" }}>
        {/* Brand */}
        <Link
          to="/"
          aria-label="ASSEC — página inicial"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            color: "var(--ink)",
          }}
        >
          <motion.img
            src="/logomarca.jpeg"
            alt="ASSEC Logo"
            whileHover={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            style={{
              width: "3.25rem",
              height: "3.25rem",
              borderRadius: "0.5rem",
              objectFit: "contain",
              flexShrink: 0
            }}
          />
          <div>
            <span style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
              ASSEC
            </span>
            <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-muted)", fontWeight: 700, lineHeight: 1.2, marginTop: "0.15rem" }}>
              Associação dos Servidores da Segurança do Ceará
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-desktop" style={{ gap: "2.25rem" }}>
          {!token ? (
            <>
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    color: location.pathname === l.to ? "var(--gold)" : "var(--ink-muted)",
                    textDecoration: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = "var(--ink)"; }}
                  onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = location.pathname === l.to ? "var(--gold)" : "var(--ink-muted)"; }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/area-associado"
                className="btn btn-primary"
                style={{ fontSize: "0.9rem", padding: "0.65rem 1.35rem" }}
              >
                Área do Associado
              </Link>
            </>
          ) : (
            <>
              <button
                id="navbar-dashboard-btn"
                onClick={handleDashboardClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--ink)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  transition: "border-color 0.15s ease",
                }}
              >
                <LayoutDashboard size={15} />
                Meu Painel
              </button>
              <span style={{ color: "var(--ink-muted)", fontSize: "0.875rem", fontWeight: 500 }}>
                {user?.name?.split(" ")[0]}
              </span>
              <button
                id="navbar-logout-btn"
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "transparent",
                  border: "none",
                  color: "var(--ink-muted)",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  padding: "0.4rem",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-muted)"; }}
              >
                <LogOut size={15} />
                Sair
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          id="navbar-mobile-toggle"
          className="nav-mobile-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--ink)",
            borderRadius: "0.5rem",
            padding: "0.4rem",
            cursor: "pointer",
            alignItems: "center",
          }}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              background: "var(--surface)",
              borderTop: "1px solid var(--border)",
              padding: "1.5rem",
            }}
          >
            {!token ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    style={{
                      color: "var(--ink)",
                      textDecoration: "none",
                      fontSize: "1.05rem",
                      fontWeight: 500,
                      padding: "0.75rem 0.5rem",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to="/area-associado"
                  className="btn btn-primary"
                  style={{ marginTop: "1rem", width: "100%", justifyContent: "center" }}
                >
                  Área do Associado
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <p style={{ color: "var(--ink-muted)", fontSize: "0.85rem" }}>
                  Conectado como <strong style={{ color: "var(--ink)" }}>{user?.name}</strong>
                </p>
                <button
                  onClick={handleDashboardClick}
                  className="btn btn-ghost"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <LayoutDashboard size={16} /> Meu Painel
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost"
                  style={{ width: "100%", justifyContent: "center", color: "var(--ink-muted)" }}
                >
                  <LogOut size={16} /> Sair
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
