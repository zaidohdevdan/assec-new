import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const ITEMS = [
  {
    title: "Acompanhamento em flagrantes",
    description: "Suporte presencial em situações de urgência operacional.",
  },
  {
    title: "Defesa em PADs",
    description: "Assessoria completa em Processos Administrativos Disciplinares.",
  },
  {
    title: "Ações Ordinárias",
    description: "Busca por direitos financeiros, correções e gratificações.",
  },
];

export default function FeaturedServiceSection() {
  return (
    <section
      id="servicos"
      style={{
        paddingBlock: "var(--section-gap)",
        background: "var(--surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          right: "-10%",
          transform: "translateY(-50%)",
          width: "40vw",
          height: "40vw",
          maxWidth: "500px",
          background: "radial-gradient(ellipse, oklch(0.75 0.12 72 / 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-lg" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
            gap: "clamp(3rem, 6vw, 6rem)",
            alignItems: "center",
          }}
        >
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 style={{ marginBottom: "2rem" }}>
              Proteção Jurídica Especializada{" "}
              <span style={{ color: "var(--gold)", display: "block", fontStyle: "italic" }}>
                em Tempo Integral
              </span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
              {ITEMS.map((item) => (
                <div key={item.title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <CheckCircle2
                    size={20}
                    style={{ color: "var(--gold)", flexShrink: 0, marginTop: "0.1rem" }}
                  />
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--ink)", marginBottom: "0.2rem" }}>
                      {item.title}
                    </h4>
                    <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/servicos"
              id="featured-service-cta"
              className="btn btn-primary"
              style={{ fontSize: "1rem" }}
            >
              Conhecer Nossos Serviços
            </Link>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div
              className="service-visual"
              style={{
                width: "min(100%, 380px)",
                aspectRatio: "1 / 1",
                borderRadius: "1.5rem",
                background: "var(--bg)",
                border: "1px solid var(--border-gold)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background glow */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(ellipse at 50% 120%, oklch(0.75 0.12 72 / 0.08) 0%, transparent 60%)",
                }}
              />
              <p
                style={{
                  fontSize: "clamp(4rem, 8vw, 6rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  color: "var(--gold)",
                  lineHeight: 1,
                  position: "relative",
                }}
              >
                100%
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--ink-muted)",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textAlign: "center",
                  position: "relative",
                  padding: "0 2rem",
                }}
              >
                Compromisso com o Associado
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
