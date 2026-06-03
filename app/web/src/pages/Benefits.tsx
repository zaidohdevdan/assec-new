/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Scale, 
  Stethoscope, 
  Tent, 
  Heart,
  Briefcase,
  CheckCircle2,
  Gem,
  Award
} from "lucide-react";

export default function Benefits() {
  const categories = [
    {
      title: "Proteção e Amparo",
      items: [
        { icon: <Scale size={24} style={{ color: "var(--gold)" }} />, title: "Assessoria Jurídica Integral", desc: "Nossa equipe de advogados está pronta para atuar em causas criminais, cíveis e administrativas decorrentes da função." },
        { icon: <Briefcase size={24} style={{ color: "var(--gold)" }} />, title: "Seguro de Vida Especializado", desc: "Apólice robusta que garante tranquilidade em situações críticas, com cobertura para invalidez e morte." }
      ]
    },
    {
      title: "Saúde e Reabilitação",
      items: [
        { icon: <Stethoscope size={24} style={{ color: "var(--gold)" }} />, title: "Convênio de Saúde", desc: "Parceria com as maiores operadoras do estado (Unimed, Hapvida) com tabelas exclusivas para associados." },
        { icon: <Heart size={24} style={{ color: "var(--gold)" }} />, title: "Atendimento Psicológico", desc: "Rede de apoio mental focada no alto estresse da segurança pública." }
      ]
    },
    {
      title: "Bem-estar e Lazer",
      items: [
        { icon: <Tent size={24} style={{ color: "var(--gold)" }} />, title: "Clube da ASSEC", desc: "Espaço completo com churrasqueiras, piscinas e área de esportes para você e sua família." },
        { icon: <Award size={24} style={{ color: "var(--gold)" }} />, title: "Colônia de Férias", desc: "Apartamentos mobiliados em praias do litoral cearense para momentos de descanso garantido." }
      ]
    }
  ];

  return (
    <div style={{ paddingBlock: "5rem 8rem" }}>
      <div className="content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            maxWidth: "700px",
            marginInline: "auto",
            marginBottom: "5rem"
          }}
        >
          <h1 
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 800,
              color: "var(--ink)",
              marginBottom: "1.5rem",
              letterSpacing: "-0.03em"
            }}
          >
            Por que ser um <br />
            <span style={{ color: "var(--gold)", fontStyle: "italic", fontFamily: "Alumni Sans, sans-serif" }}>Associado ASSEC?</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--ink-muted)", lineHeight: 1.5 }}>
            Conheça detalhadamente todos os pilares de apoio que construímos para você e seu núcleo familiar.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
          {categories.map((cat, idx) => (
            <div key={idx}>
              <h2 
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}
              >
                <div style={{ width: "2rem", height: "2px", background: "var(--gold)" }}></div>
                {cat.title}
              </h2>
              <div 
                className="grid-2col"
                style={{ gap: "2rem" }}
              >
                {cat.items.map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    style={{
                      background: "var(--surface)",
                      padding: "2.5rem",
                      borderRadius: "2rem",
                      border: "1px solid var(--border)",
                      display: "flex",
                      gap: "1.5rem",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div 
                      style={{
                        padding: "1rem",
                        background: "rgba(224, 180, 100, 0.05)",
                        border: "1px solid rgba(224, 180, 100, 0.15)",
                        borderRadius: "1.25rem",
                        height: "fit-content",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>{item.title}</h3>
                      <p style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Exclusive Perks */}
        <section 
          style={{
            marginTop: "8rem",
            padding: "3rem",
            background: "var(--surface)",
            borderRadius: "3rem",
            border: "1px solid var(--border)"
          }}
        >
          <div 
            className="grid-2col"
            style={{ gap: "4rem", alignItems: "center" }}
          >
            <div>
              <Gem size={40} style={{ color: "var(--gold)", marginBottom: "1.5rem" }} />
              <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)", marginBottom: "1rem" }}>
                Clube de Vantagens ASSEC
              </h2>
              <p style={{ color: "var(--ink-muted)", fontSize: "1.125rem", marginBottom: "2rem", lineHeight: 1.6 }}>
                Muito além dos serviços básicos, oferecemos descontos em mais de 500 estabelecimentos parceiros em todo o Brasil.
              </p>
              <div 
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem"
                }}
              >
                {[
                  "Educação (Escolas/Faculdades)",
                  "Combustíveis",
                  "Restaurantes",
                  "Cinemas e Teatro",
                  "Lojas de Departamento",
                  "Farmácias"
                ].map((perk, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--ink)", fontSize: "0.875rem", fontWeight: 500 }}>
                    <CheckCircle2 size={16} style={{ color: "var(--gold)" }} /> {perk}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" 
                alt="Clube de Vantagens" 
                style={{
                  width: "100%",
                  borderRadius: "2rem",
                  border: "1px solid var(--border)",
                  filter: "grayscale(100%) opacity(0.8)"
                }}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
