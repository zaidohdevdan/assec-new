import { motion } from "motion/react";
import { MessageCircle, Repeat2, Heart, Share, ExternalLink } from "lucide-react";

// X (formerly Twitter) logo in SVG
function XLogo({ size = 16 }: { size?: number }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const TWEETS = [
  {
    id: 1,
    time: "15 min",
    text: "⚠️ ATENÇÃO: Plantão jurídico da ASSEC funcionando normalmente hoje para atendimento emergencial de associados em ocorrências operacionais. Ligue para o nosso canal de urgência: (85) 99941-1411. 📞🔒",
    retweets: 12,
    likes: 45
  },
  {
    id: 2,
    time: "3 horas",
    text: "Reunião altamente produtiva hoje com representantes da Secretaria de Segurança Pública. Pautas cruciais debatidas sobre a valorização salarial e melhoria nas condições de trabalho dos nossos policiais e bombeiros do Ceará. 💼⚖️",
    retweets: 28,
    likes: 98
  },
  {
    id: 3,
    time: "1 dia",
    text: "Atenção Associados: A abertura do calendário para reservas das pousadas de lazer do próximo mês começará nesta sexta-feira às 08h via Área do Associado. Fiquem atentos para garantir a sua estadia! 🏖️🌅",
    retweets: 19,
    likes: 67
  }
];

export default function XFeed() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "2rem",
        padding: "2rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              background: "#0f1419",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <XLogo size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, color: "var(--ink)" }}>
              Notícias no X
            </h4>
            <a
              href="https://x.com/assec_ce"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.8rem",
                color: "var(--gold)",
                textDecoration: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              @assec_ce <ExternalLink size={10} />
            </a>
          </div>
        </div>

        <a
          href="https://x.com/assec_ce"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.8rem",
            borderRadius: "0.5rem",
          }}
        >
          Seguir
        </a>
      </div>

      {/* Tweets List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {TWEETS.map((tweet) => (
          <div 
            key={tweet.id} 
            style={{ 
              display: "flex", 
              gap: "0.75rem", 
              borderBottom: tweet.id !== TWEETS.length ? "1px solid var(--border-gold)" : "none",
              paddingBottom: tweet.id !== TWEETS.length ? "1,25rem" : "0",
              opacity: 0.95
            }}
          >
            {/* Mock Profile Icon */}
            <div 
              style={{ 
                width: "2.25rem", 
                height: "2.25rem", 
                borderRadius: "50%", 
                background: "var(--gold-glow)", 
                border: "1px solid var(--border-gold)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontWeight: 800, 
                fontSize: "0.75rem", 
                color: "var(--gold)",
                flexShrink: 0
              }}
            >
              AS
            </div>

            {/* Content Area */}
            <div style={{ flex: 1 }}>
              {/* Profile details */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                <span style={{ fontWeight: 800, fontSize: "0.875rem", color: "var(--ink)" }}>ASSEC Ceará</span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>@assec_ce</span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>•</span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>{tweet.time}</span>
              </div>

              {/* Text */}
              <p style={{ fontSize: "0.875rem", lineHeight: 1.45, color: "var(--ink)", marginBottom: "0.75rem", textWrap: "pretty", maxWidth: "100%" }}>
                {tweet.text}
              </p>

              {/* Interactions bar */}
              <div style={{ display: "flex", gap: "2rem", color: "var(--ink-muted)" }}>
                <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.25rem", color: "inherit", fontSize: "0.75rem", cursor: "pointer" }}>
                  <MessageCircle size={14} /> 2
                </button>
                <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.25rem", color: "inherit", fontSize: "0.75rem", cursor: "pointer" }}>
                  <Repeat2 size={14} /> {tweet.retweets}
                </button>
                <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.25rem", color: "inherit", fontSize: "0.75rem", cursor: "pointer" }}>
                  <Heart size={14} /> {tweet.likes}
                </button>
                <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.25rem", color: "inherit", fontSize: "0.75rem", cursor: "pointer" }}>
                  <Share size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
