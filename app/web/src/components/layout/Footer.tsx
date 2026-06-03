/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, Mail, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const QUICK_LINKS = [
  { to: "/transparencia", label: "Transparência" },
  { to: "/beneficios", label: "Clube de Vantagens" },
  { to: "/servicos", label: "Convênios" },
  { to: "/contato", label: "Contato" },
];

const CONTACT_ITEMS = [
  { icon: Phone, text: "(85) 3217-1234" },
  { icon: Mail, text: "contato@assecce.com.br" },
  { icon: MapPin, text: "Fortaleza, Ceará" },
];

export default function Footer() {
  return (
    <footer
      id="contato"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--border-gold)",
        paddingTop: "clamp(4rem, 8vw, 6rem)",
        paddingBottom: "3rem",
        color: "rgba(255, 255, 255, 0.9)",
        position: "relative",
      }}
    >
      {/* Decorative subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pointer-events-none"></div>

      <div className="container-lg relative z-10">
        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <img
                src="/logomarca.jpeg"
                alt="ASSEC Logo"
                style={{
                  width: "2.75rem",
                  height: "2.75rem",
                  borderRadius: "0.5rem",
                  objectFit: "contain",
                  flexShrink: 0,
                  border: "1px solid var(--border-gold)",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1 }}>ASSEC</span>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase", marginTop: "0.2rem" }}>DESDE 2026</span>
              </div>
            </div>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "28ch" }}>
              Associação dos Servidores da Segurança Pública do Ceará. Protegendo e defendendo quem protege o nosso estado.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.875rem", marginBottom: "1.5rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Links Rápidos
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--gold)";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255, 255, 255, 0.6)";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)";
                    }}
                  >
                    <ChevronRight size={12} className="opacity-50" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.875rem", marginBottom: "1.5rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Fale Conosco
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {CONTACT_ITEMS.map(({ icon: Icon, text }) => (
                <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <Icon size={16} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "0.2rem" }} />
                  <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem", lineHeight: 1.4 }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.875rem", marginBottom: "0.75rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Newsletter
            </h4>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.875rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              Receba atualizações e notícias diretamente da nossa diretoria.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="footer-newsletter-form"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <input
                id="footer-newsletter-email"
                type="email"
                placeholder="Seu e-mail profissional"
                aria-label="Endereço de e-mail para newsletter"
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  borderRadius: "0.75rem",
                  padding: "0.75rem 1rem",
                  fontSize: "0.875rem",
                  outline: "none",
                  transition: "all 0.2s ease",
                  fontFamily: "var(--font-sans)",
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "var(--gold)";
                  (e.target as HTMLInputElement).style.background = "rgba(255, 255, 255, 0.08)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "rgba(255, 255, 255, 0.1)";
                  (e.target as HTMLInputElement).style.background = "rgba(255, 255, 255, 0.04)";
                }}
              />
              <button
                id="footer-newsletter-submit"
                type="submit"
                className="btn bg-[var(--gold)] hover:bg-[var(--gold-dim)] text-white"
                style={{ padding: "0.75rem 1.25rem", borderRadius: "0.75rem", flexShrink: 0, cursor: "pointer" }}
                aria-label="Inscrever-se na newsletter"
              >
                <ChevronRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "2rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} ASSEC — Associação dos Servidores da Segurança do Ceará. Todos os direitos reservados.
          </p>
          <p style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "0.8rem", fontFamily: "monospace" }}>
            CNPJ: 03.541.222/0001-90
          </p>
        </div>
      </div>
    </footer>
  );
}
