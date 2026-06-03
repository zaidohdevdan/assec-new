import { motion } from "motion/react";
import { ArrowRight, Scale, Stethoscope, Tent, Users, Heart, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const BENEFITS = [
  {
    icon: Scale,
    title: "Assistência Jurídica 24h",
    description: "Defesa especializada para questões funcionais e disciplinares, protegendo quem protege o Ceará.",
  },
  {
    icon: Stethoscope,
    title: "Saúde e Bem-estar",
    description: "Convênios com os melhores planos de saúde, odontológicos e clínicas especializadas para você e sua família.",
  },
  {
    icon: Tent,
    title: "Lazer e Descanso",
    description: "Acesso a clubes próprios, pousadas e parcerias em todo o estado para o seu merecido descanso.",
  },
  {
    icon: Users,
    title: "Representação Ativa",
    description: "Voz forte junto aos órgãos governamentais por melhores salários, condições de trabalho e dignidade.",
  },
  {
    icon: Heart,
    title: "Auxílio Natalidade",
    description: "Apoio financeiro e social no momento mais importante da sua família: a chegada de um novo membro.",
  },
  {
    icon: Briefcase,
    title: "Seguro de Vida",
    description: "Apólices exclusivas com coberturas abrangentes, garantindo o futuro de quem você mais ama.",
  },
];

export default function BenefitsSection() {
  return (
    <section
      id="beneficios"
      style={{
        paddingBlock: "var(--section-gap)",
      }}
    >
      <div className="container-lg">
        {/* Header */}
        <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <h2 style={{ color: "var(--ink)", marginBottom: "1rem" }}>
            Benefícios e proteção de ser{" "}
            <span style={{ color: "var(--gold)" }}>um associado ASSEC</span>
          </h2>
          <p style={{ color: "var(--ink-muted)", fontSize: "1.05rem", lineHeight: 1.65 }}>
            Benefícios reais para você e sua família, construídos por quem conhece a realidade do servidor público.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {BENEFITS.map((benefit, idx) => {
            const Icon = benefit.icon;
            const isHighlighted = idx === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{
                  y: { type: "spring", stiffness: 300, damping: 20 },
                  default: { delay: idx * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                }}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  height: "100%",
                  position: "relative",
                  ...(isHighlighted ? {
                    borderColor: "var(--gold)",
                    boxShadow: "0 10px 30px var(--gold-glow)",
                  } : {})
                }}
              >
                {isHighlighted && (
                  <span
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1.25rem",
                      background: "var(--gold)",
                      color: "oklch(0.08 0.008 60)",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.25rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    ESSENCIAL
                  </span>
                )}

                {/* Icon */}
                <div
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "0.625rem",
                    background: "var(--gold-glow)",
                    border: "1px solid var(--border-gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} style={{ color: "var(--gold)" }} />
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--ink)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Link */}
        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <Link
            to="/beneficios"
            id="benefits-see-all-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--gold)",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            Ver todos os benefícios <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
