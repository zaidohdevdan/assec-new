import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight, MessageCircle } from "lucide-react";

export default function CtaSection() {
  return (
    <section style={{ paddingBlock: "var(--section-gap)" }}>
      <div className="container-lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            borderRadius: "1.5rem",
            border: "1px solid var(--border-gold)",
            background: "var(--surface)",
            padding: "clamp(2.5rem, 6vw, 5rem)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "70%",
              height: "70%",
              background: "radial-gradient(ellipse, oklch(0.75 0.12 72 / 0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <h2
              style={{
                maxWidth: "22ch",
                margin: "0 auto 1.25rem",
              }}
            >
              Faça parte da maior associação de{" "}
              <span style={{ color: "var(--gold)" }}>segurança do estado.</span>
            </h2>
            <p
              style={{
                color: "var(--ink-muted)",
                fontSize: "1.05rem",
                lineHeight: 1.65,
                marginBottom: "2.5rem",
                maxWidth: "50ch",
                marginInline: "auto",
              }}
            >
              Junte-se a milhares de companheiros. Sua família e sua carreira merecem proteção real.
            </p>

            <div
              className="cta-actions"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <Link
                to="/area-associado?mode=register"
                id="cta-associate-btn"
                className="btn btn-primary"
                style={{ fontSize: "1.05rem", padding: "0.875rem 2.25rem" }}
              >
                Associar-se Agora
                <ChevronRight size={18} />
              </Link>
              <Link
                to="/contato"
                id="cta-contact-btn"
                className="btn btn-ghost"
                style={{ fontSize: "1.05rem", padding: "0.875rem 2.25rem" }}
              >
                <MessageCircle size={17} />
                Falar com a equipe
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
