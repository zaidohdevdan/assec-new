import { motion } from "motion/react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import InstagramFeed from "./InstagramFeed";

export default function HeroSection() {

  return (
    <section
      style={{
        position: "relative",
        paddingTop: "clamp(5rem, 10vw, 9rem)",
        paddingBottom: "clamp(4rem, 8vw, 7rem)",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60vw",
          height: "40vw",
          maxWidth: "800px",
          maxHeight: "500px",
          background: "radial-gradient(ellipse at center, oklch(0.75 0.12 72 / 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Security radar / geometric lines watermark */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          left: "2%",
          width: "min(35vw, 400px)",
          height: "min(35vw, 400px)",
          opacity: 0.06,
          pointerEvents: "none",
          zIndex: 0,
          color: "var(--gold)",
        }}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <circle cx="50" cy="50" r="40" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="20" strokeDasharray="4 2" />
        <path d="M50 0 V100 M0 50 H100 M15 15 L85 85 M15 85 L85 15" strokeDasharray="1 3" />
      </svg>

      {/* Decorative shield watermark on the right */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "5%",
          right: "2%",
          width: "min(30vw, 350px)",
          height: "min(30vw, 350px)",
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 0,
          color: "var(--gold)",
        }}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
      >
        <path d="M50 10 C65 10 80 15 85 25 C85 55 50 85 50 90 C50 85 15 55 15 25 C20 15 35 10 50 10 Z" />
        <path d="M50 20 C60 20 72 24 75 32 C75 55 50 78 50 82 C50 78 25 55 25 32 C28 24 40 20 50 20 Z" strokeDasharray="2 2" />
      </svg>

      <div className="container-lg" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: "clamp(3rem, 6vw, 5rem)",
            alignItems: "center",
          }}
        >
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                border: "1px solid var(--border-gold)",
                borderRadius: "999px",
                padding: "0.3rem 0.875rem",
                marginBottom: "2rem",
                color: "var(--gold)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--gold)",
                  flexShrink: 0,
                }}
              />
              unidos pela segurança pública do ceará!
            </div>

            <h1
              style={{
                color: "var(--ink)",
                marginBottom: "1.5rem",
                fontWeight: 900,
              }}
            >
              Quem protege o Ceará{" "}
              <span
                style={{
                  color: "var(--gold)",
                  fontStyle: "italic",
                  display: "block",
                }}
              >
                merece ser protegido.
              </span>
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 1.5vw + 0.5rem, 1.125rem)",
                color: "var(--ink-muted)",
                lineHeight: 1.7,
                marginBottom: "2.5rem",
                maxWidth: "54ch",
              }}
            >
              A ASSEC nasceu da união dos servidores da segurança pública para defender direitos, conquistar avanços e fortalecer nossos laços. Somos a voz ativa de quem está na linha de frente, trabalhando por reconhecimento, valorização e dignidade para as categorias da Polícia Militar, Polícia Civil, Polícia Penal, Bombeiros Militares e Peritos Criminais.
            </p>

            {/* CTAs */}
            <div className="cta-actions" style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem" }}>
              <Link
                to="/area-associado?mode=register"
                id="hero-cta-primary"
                className="btn btn-primary"
                style={{ fontSize: "1rem" }}
              >
                Quero me Associar
                <ChevronRight size={18} />
              </Link>
              <Link
                to="/beneficios"
                id="hero-cta-secondary"
                className="btn btn-ghost"
                style={{ fontSize: "1rem" }}
              >
                Ver Benefícios
              </Link>
            </div>

            {/* Stat row */}
            <div className="hero-stats">
              {[
                { value: "+15.000", label: "Associados Ativos" },
                { value: "24h", label: "Suporte Jurídico" },
                { value: "26", label: "Anos de História" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    style={{
                      fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                      fontWeight: 900,
                      color: "var(--gold)",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--ink-muted)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginTop: "0.25rem",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Instagram Feed */}
          <motion.div
            className="hero-image-col"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <InstagramFeed />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
