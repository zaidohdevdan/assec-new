/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import {
  History,
  Target,
  ShieldCheck,
  Users2,
  Building2,
  Landmark,
  FileText
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <ShieldCheck size={24} style={{ color: "var(--gold)" }} />,
      title: "Integridade",
      desc: "Compromisso inabalável com a ética e a transparência em todas as nossas ações."
    },
    {
      icon: <Users2 size={24} style={{ color: "var(--gold)" }} />,
      title: "União",
      desc: "Acreditamos que a força da nossa categoria reside na coesão de seus membros."
    },
    {
      icon: <Target size={24} style={{ color: "var(--gold)" }} />,
      title: "Excelência",
      desc: "Busca constante pelos melhores serviços e representação para o associado."
    }
  ];

  return (
    <div style={{ paddingBottom: "5rem" }}>
      {/* Banner */}
      <div
        style={{
          height: "40vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderBottom: "1px solid var(--border)"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(7,6,4,0.4), rgba(7,6,4,0.9))",
            zIndex: 10
          }}
        ></div>
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.25,
            filter: "grayscale(100%)"
          }}
          alt="ASSEC Background"
          referrerPolicy="no-referrer"
        />
        <div className="content" style={{ position: "relative", zIndex: 20, textAlign: "center" }}>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "1rem",
              letterSpacing: "-0.03em"
            }}
          >
            Nossa História, <span style={{ color: "var(--gold)", fontStyle: "italic", fontFamily: "Alumni Sans, sans-serif" }}>Sua Força</span>
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "600px",
              marginInline: "auto"
            }}
          >
            Descubra a trajetória da ASSEC, construída com dedicação pelos servidores da segurança cearense.
          </p>
        </div>
      </div>

      <div className="content" style={{ marginTop: "5rem" }}>
        <div
          className="grid-2col"
          style={{
            alignItems: "center",
            marginBottom: "6rem",
            gap: "4rem"
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--gold)",
                fontWeight: 700,
                marginBottom: "1rem",
                textTransform: "uppercase",
                fontSize: "0.875rem",
                letterSpacing: "0.1em"
              }}
            >
              <History size={16} />
              <span>Desde 2026</span>
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "var(--ink)",
                marginBottom: "2rem",
                lineHeight: 1.15,
                letterSpacing: "-0.02em"
              }}
            >
              Nosso compromisso e representatividade.
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                color: "var(--ink-muted)",
                fontSize: "1.125rem",
                lineHeight: 1.6
              }}
            >
              <p>
                A ASSEC nasceu da necessidade de representar e defender pautas essenciais e históricas dos profissionais da Segurança Pública do nosso Estado. Somos um grupo formado por pessoas comprometidas com a valorização da categoria, buscando caminhos concretos para construir diálogo com a sociedade e com os órgãos competentes, transformando reivindicações legítimas em conquistas reais.
              </p>
              <p>
                Acreditamos que somente por meio da união, da responsabilidade e da participação ativa será possível fortalecer a Segurança Pública e garantir melhores condições de trabalho, reconhecimento profissional e dignidade para aqueles que dedicam suas vidas à proteção da sociedade.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem"
            }}
          >
            <div style={{ paddingTop: "3rem" }}>
              <div
                style={{
                  aspectRatio: "3/4",
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  background: "var(--surface)"
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80"
                  alt="History"
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  aspectRatio: "3/4",
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  background: "var(--surface)"
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80"
                  alt="History 2"
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }}
                  referrerPolicy="no-referrer"
                />
              </div>
              {/*<div
                style={{
                  aspectRatio: "1/1",
                  background: "var(--surface)",
                  borderRadius: "1.5rem",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  border: "1px solid var(--border)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "80px",
                    height: "80px",
                    background: "var(--gold)",
                    filter: "blur(40px)",
                    opacity: 0.1,
                    pointerEvents: "none"
                  }}
                ></div>
                {/* <Building2 size={32} style={{ color: "var(--gold)", marginBottom: "1rem" }} /> */}
              {/*  <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1.1 }}>Sede Própria</p> */}
              {/* <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)", marginTop: "0.25rem" }}>Infraestrutura completa</p> */}
              {/* </div> */}
            </div>
          </motion.div>
        </div>

        {/* Mission/Vision/Values */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            marginBottom: "6rem"
          }}
        >
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: "2.5rem",
                background: "var(--surface)",
                borderRadius: "2rem",
                border: "1px solid var(--border)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  background: "rgba(224, 180, 100, 0.05)",
                  borderRadius: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginInline: "auto",
                  marginBottom: "1.5rem",
                  border: "1px solid rgba(224, 180, 100, 0.15)"
                }}
              >
                {v.icon}
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--ink)", marginBottom: "1rem" }}>{v.title}</h3>
              <p style={{ color: "var(--ink-muted)", fontSize: "1rem", lineHeight: 1.5 }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Transparency */}
        <section
          style={{
            background: "var(--surface-2)",
            borderRadius: "3rem",
            padding: "3rem",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              background: "var(--gold)",
              filter: "blur(120px)",
              opacity: 0.05,
              pointerEvents: "none"
            }}
          ></div>
          <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--ink)", marginBottom: "1.5rem" }}>
              Portal da Transparência
            </h2>
            <p style={{ color: "var(--ink-muted)", fontSize: "1.125rem", marginBottom: "2.5rem", maxWidth: "700px", lineHeight: 1.6 }}>
              Acreditamos que a confiança é o alicerce de qualquer associação. Disponibilizamos mensalmente nossos relatórios financeiros, atas de reuniões e planejamentos estratégicos para consulta de todos os associados.
            </p>
            <button
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <FileText size={18} /> Acessar Documentos
            </button>
          </div>
          <div className="nav-desktop" style={{ justifyContent: "center", opacity: 0.15, zIndex: 1 }}>
            <Landmark size={180} style={{ color: "var(--ink)" }} />
          </div>
        </section>
      </div>
    </div>
  );
}
