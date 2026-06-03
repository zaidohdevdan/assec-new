/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import {
  Scale,
  Stethoscope,
  Heart,
  Handshake,
  ArrowRight,
  ClipboardCheck,
  ShieldAlert,
  Gavel
} from "lucide-react";

export default function Services() {
  const mainServices = [
    {
      icon: <Scale size={40} style={{ color: "var(--gold)" }} />,
      title: "Assessoria Jurídica",
      desc: "Nossa equipe multidisciplinar atua em todas as esferas do direito, com foco especial em causas relacionadas ao exercício da função policial e administrativa.",
      features: ["Defesa Disciplinar", "Flagrantes Operacionais", "Ações de Promoção", "Direito de Família"]
    },
    {
      icon: <Stethoscope size={40} style={{ color: "var(--gold)" }} />,
      title: "Saúde e Convênios",
      desc: "Gerenciamos parcerias estratégicas para garantir que o associado tenha acesso ao melhor sistema de saúde do estado com custos reduzidos.",
      features: ["Planos de Saúde", "Odontologia Especializada", "Psicologia Social", "Farmácia Própria"]
    },
    {
      icon: <Handshake size={40} style={{ color: "var(--gold)" }} />,
      title: "Parcerias Corporativas",
      desc: "Rede ampla de descontos em serviços essenciais, lazer e educação para potencializar o poder de compra do servidor.",
      features: ["Faculdades e Escolas", "Lojas de Veículos", "Cursos de Tiro", "Academias"]
    }
  ];

  return (
    <div style={{ paddingBlock: "5rem 8rem" }}>
      <div className="content">
        <header
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
            Nossos <span style={{ color: "var(--gold)", fontStyle: "italic", fontFamily: "Alumni Sans, sans-serif" }}>Serviços</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--ink-muted)", lineHeight: 1.5 }}>
            Trabalhamos incansavelmente para oferecer soluções que impactam positivamente a vida funcional e pessoal do servidor.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "6rem"
          }}
        >
          {mainServices.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: "var(--surface)",
                padding: "2.5rem",
                borderRadius: "2.5rem",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ marginBottom: "1.5rem" }}>{service.icon}</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--ink)", marginBottom: "1rem" }}>{service.title}</h3>
              <p style={{ color: "var(--ink-muted)", marginBottom: "2rem", flexGrow: 1, lineHeight: 1.6 }}>{service.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {service.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--ink)", fontSize: "0.875rem", fontWeight: 500 }}>
                    <ArrowRight size={14} style={{ color: "var(--gold)" }} /> {f}
                  </li>
                ))}
              </ul>
              <button className="btn-primary" style={{ width: "100%" }}>
                Saber Mais
              </button>
            </motion.div>
          ))}
        </div>

        {/* Specialized Legal Section */}
        <section
          style={{
            background: "var(--surface-2)",
            borderRadius: "3rem",
            padding: "3rem",
            border: "1px solid var(--border)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div
            className="grid-2col"
            style={{ gap: "4rem", alignItems: "center" }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "rgba(224, 180, 100, 0.05)",
                    border: "1px solid rgba(224, 180, 100, 0.15)",
                    borderRadius: "1rem"
                  }}
                >
                  <Gavel size={32} style={{ color: "var(--gold)" }} />
                </div>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.025em" }}>
                  Plantão Jurídico 24h
                </h2>
              </div>
              <p style={{ color: "var(--ink-muted)", fontSize: "1.125rem", marginBottom: "2.5rem", lineHeight: 1.6 }}>
                Entendemos que a segurança pública não para. Por isso, mantemos uma central de emergência jurídica ativa 24 horas por dia para casos de flagrantes e ocorrências disciplinares urgentes.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {[
                  { icon: <ShieldAlert size={24} style={{ color: "var(--gold)" }} />, text: "Atendimento imediato em ocorrências operacionais." },
                  { icon: <ClipboardCheck size={24} style={{ color: "var(--gold)" }} />, text: "Orientação técnica antes de depoimentos." },
                  { icon: <Heart size={24} style={{ color: "var(--gold)" }} />, text: "Apoio humanizado para o servidor e família." }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    {item.icon}
                    <p style={{ color: "var(--ink)", fontWeight: 500 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "var(--surface)",
                borderRadius: "2rem",
                padding: "2.5rem",
                border: "1px solid var(--border)"
              }}
            >
              <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginBottom: "1.5rem" }}>Solicitar Atendimento</h4>
              <form
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  try {
                    const { contactService } = await import('../services/contactService');
                    await contactService.create({
                      name: formData.get('name') as string,
                      email: formData.get('email') as string || 'urgencia@assec.com.br',
                      subject: 'URGÊNCIA JURÍDICA - ' + (formData.get('phone') as string),
                      message: formData.get('message') as string
                    });
                    alert('Urgência enviada com sucesso! Aguarde contato.');
                    (e.target as HTMLFormElement).reset();
                  } catch (err) {
                    alert('Erro ao enviar urgência. Tente ligar para o plantão diretamente.');
                  }
                }}
              >
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Seu nome operacional"
                  style={{
                    width: "100%",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    padding: "1rem",
                    borderRadius: "1rem",
                    color: "var(--ink)",
                    outline: "none"
                  }}
                />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Telefone de contato"
                  style={{
                    width: "100%",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    padding: "1rem",
                    borderRadius: "1rem",
                    color: "var(--ink)",
                    outline: "none"
                  }}
                />
                <textarea
                  name="message"
                  required
                  placeholder="Breve descrição da urgência"
                  style={{
                    width: "100%",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    padding: "1rem",
                    borderRadius: "1rem",
                    color: "var(--ink)",
                    outline: "none",
                    height: "8rem",
                    resize: "none"
                  }}
                ></textarea>
                <button type="submit" className="btn-primary" style={{ width: "100%", paddingBlock: "1.125rem", fontSize: "1rem" }}>
                  Enviar Urgência
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
