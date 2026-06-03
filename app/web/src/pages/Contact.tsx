/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Instagram,
} from "lucide-react";

export default function Contact() {
  return (
    <div style={{ paddingBlock: "5rem 8rem" }}>
      <div className="content">
        <div className="grid-2col" style={{ gap: "4rem" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 800,
                color: "var(--ink)",
                marginBottom: "2rem",
                letterSpacing: "-0.03em"
              }}
            >
              Estamos aqui para <br />
              <span style={{ color: "var(--gold)", fontStyle: "italic", fontFamily: "Alumni Sans, sans-serif" }}>ouvir você.</span>
            </h1>
            <p style={{ fontSize: "1.25rem", color: "var(--ink-muted)", marginBottom: "3rem", lineHeight: 1.6 }}>
              Dúvidas, sugestões ou solicitações? Escolha o canal de sua preferência ou preencha o formulário e nossa equipe entrará em contato em até 24 horas.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3rem" }}>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <div 
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    background: "rgba(224, 180, 100, 0.05)",
                    border: "1px solid rgba(224, 180, 100, 0.15)",
                    borderRadius: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold)",
                    flexShrink: 0
                  }}
                >
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-muted)", marginBottom: "0.25rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    WhatsApp / Plantão
                  </h4>
                  <a 
                    href="https://wa.me/5585999411411" 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--ink)",
                      textDecoration: "none",
                      transition: "color 0.2s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
                  >
                    (85) 99941-1411
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <div 
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    background: "rgba(224, 180, 100, 0.05)",
                    border: "1px solid rgba(224, 180, 100, 0.15)",
                    borderRadius: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold)",
                    flexShrink: 0
                  }}
                >
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-muted)", marginBottom: "0.25rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    E-mail institucional
                  </h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--ink)" }}>contato@assecce.com.br</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <div 
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    background: "rgba(224, 180, 100, 0.05)",
                    border: "1px solid rgba(224, 180, 100, 0.15)",
                    borderRadius: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold)",
                    flexShrink: 0
                  }}
                >
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-muted)", marginBottom: "0.25rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Onde Estamos
                  </h4>
                  <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>
                    Av. Santos Dumont, 1510, sala 805, Aldeota, Fortaleza/CE
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Siga nossas Redes Sociais:
              </h4>
              <a 
                href="https://www.instagram.com/assec.ceara/"
                target="_blank" 
                rel="noreferrer"
                style={{
                  width: "3rem",
                  height: "3rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--ink)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--gold)";
                  e.currentTarget.style.color = "var(--gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--ink)";
                }}
              >
                <Instagram size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: "var(--surface)",
              padding: "clamp(2rem, 5vw, 3.5rem)",
              borderRadius: "3rem",
              border: "1px solid var(--border)"
            }}
          >
            <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="grid-2col" style={{ gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>
                    Nome Completo
                  </label>
                  <input 
                    type="text" 
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>
                    Matrícula (Opcional)
                  </label>
                  <input 
                    type="text" 
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>
                  E-mail
                </label>
                <input 
                  type="email" 
                  className="form-input"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>
                  Assunto
                </label>
                <select 
                  className="form-input"
                  style={{
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.25rem",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option>Dúvidas Gerais</option>
                  <option>Suporte Jurídico</option>
                  <option>Convênios Médicos</option>
                  <option>Reclamações</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>
                  Mensagem
                </label>
                <textarea 
                  className="form-input"
                  style={{
                    height: "10rem",
                    resize: "none"
                  }}
                ></textarea>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", paddingBlock: "1.125rem", fontSize: "1.125rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <MessageSquare size={20} /> Enviar Mensagem
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
